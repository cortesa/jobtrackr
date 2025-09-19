"use server"

import { revalidateTag } from "next/cache"

import {
  companies,
  contacts,
  db,
  projectContacts,
  projectNotes,
  projectSteps,
  projects,
} from "@/db"
import { findOrCreateTech, linkTechToProject } from "@/db/queries"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface CreateProjectContactInput {
  name?: string
  email?: string
  phone?: string
  role?: string
  notes?: string
}

interface CreateProjectStepInput {
  title?: string
  stepAt?: number | null
  comment?: string
}

interface CreateProjectNoteInput {
  noteAt?: number | null
  content?: string
}

export interface CreateProjectBundleInput {
  companyName: string
  companyWebsite?: string | null
  contact?: CreateProjectContactInput
  projectName: string
  firstContactAt: number | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: string | null
  salaryPeriod?: string | null
  salaryRaw?: string | null
  status?: string | null
  techsRequired?: string[]
  techsValuable?: string[]
  step?: CreateProjectStepInput
  note?: CreateProjectNoteInput
}

function sanitizetechs(techsList: string[] | undefined): string[] {
  if (!techsList?.length) return []

  return Array.from(new Set(techsList.map((item) => item.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es-ES"),
  )
}
export async function createProjectBundle(
  input: CreateProjectBundleInput,
): Promise<ActionResult<{ projectId: number }>> {
  try {
    const companyName = input.companyName?.trim()
    if (!companyName) {
      return failure("El nombre de la empresa es obligatorio")
    }
    const projectName = input.projectName?.trim()
    if (!projectName) {
      return failure("El nombre del proyecto es obligatorio")
    }
    if (!Number.isFinite(input.firstContactAt)) {
      return failure("La fecha de primer contacto es obligatoria")
    }
    const firstContactAt = input.firstContactAt as number

    const now = Date.now()
    const result = await db.transaction(async (tx) => {
      const existingCompany = await tx.query.companies.findFirst({
        where: (table, { eq }) => eq(table.name, companyName),
      })

      const companyId = existingCompany
        ? existingCompany.id
        : (
          await tx
            .insert(companies)
            .values({
              name: companyName,
              website: input.companyWebsite?.trim() || null,
            })
            .returning({ id: companies.id })
        )[0].id

      const projectExists = await tx.query.projects.findFirst({
        where: (table, { and, eq }) => and(eq(table.companyId, companyId), eq(table.name, projectName)),
      })

      if (projectExists) {
        return failure("Ya existe un proyecto con ese nombre para la empresa seleccionada")
      }
      let contactId: number | null = null
      const contactInput = input.contact
      if (contactInput?.name?.trim()) {
        const contactName = contactInput.name.trim()
        const contactKeyValue = contactInput.email?.trim()
        const existingContact = await tx.query.contacts.findFirst({
          where: (table, { and, eq }) =>
            contactKeyValue
              ? and(eq(table.companyId, companyId), eq(table.email, contactKeyValue))
              : and(eq(table.companyId, companyId), eq(table.name, contactName)),
        })

        if (existingContact) {
          contactId = existingContact.id
        } else {
          const [ insertedContact ] = await tx
            .insert(contacts)
            .values({
              companyId,
              name: contactName,
              email: contactKeyValue ?? null,
              phone: contactInput.phone?.trim() || null,
              role: contactInput.role?.trim() || null,
              notes: contactInput.notes?.trim() || null,
            })
            .returning({ id: contacts.id })
          contactId = insertedContact.id
        }
      }
      const projectValues: typeof projects.$inferInsert = {
        companyId,
        name: projectName,
        firstContactAt,
        salaryMin: input.salaryMin ?? undefined,
        salaryMax: input.salaryMax ?? undefined,
        salaryCurrency: input.salaryCurrency?.trim() || undefined,
        salaryPeriod: input.salaryPeriod?.trim() || undefined,
        salaryRaw: input.salaryRaw?.trim() || null,
        status: input.status?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }

      const [ project ] = await tx.insert(projects).values(projectValues).returning({ id: projects.id })

      if (contactId) {
        await tx
          .insert(projectContacts)
          .values({ projectId: project.id, contactId })
          .onConflictDoNothing({
            target: [ projectContacts.projectId, projectContacts.contactId ],
          })
      }
      const requiredtechs = sanitizetechs(input.techsRequired)
      const valuabletechs = sanitizetechs(input.techsValuable)

      for (const techName of requiredtechs) {
        const tech = await findOrCreateTech({ name: techName })
        await linkTechToProject({ projectId: project.id, techId: tech.id, kind: "required" })
      }
      for (const techName of valuabletechs) {
        const tech = await findOrCreateTech({ name: techName })
        await linkTechToProject({ projectId: project.id, techId: tech.id, kind: "valuable" })
      }
      if (input.step?.title && input.step.stepAt) {
        await tx.insert(projectSteps).values({
          projectId: project.id,
          title: input.step.title.trim(),
          comment: input.step.comment?.trim() || null,
          stepAt: input.step.stepAt,
          sortOrder: 0,
          createdAt: now,
        })
      }
      if (input.note?.content && input.note.noteAt) {
        await tx.insert(projectNotes).values({
          projectId: project.id,
          content: input.note.content.trim(),
          noteAt: input.note.noteAt,
        })
      }

      return success({ projectId: project.id })
    })

    if (!result.ok) {
      return result
    }
    revalidateTag(PROJECTS_TAG)

    return result
  } catch (error) {
    console.error("createProjectBundle", error)

    return failure("No se pudo crear el proyecto")
  }
}

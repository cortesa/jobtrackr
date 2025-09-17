"use server"

import { revalidateTag } from "next/cache"

import { db, projectContacts, projects } from "@/db"
import { contactBelongsToCompany } from "@/db/queries"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface CreateProjectArgs {
  companyId: number;
  name: string;
  firstContactAt: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;
  salaryRaw?: string | null;
  status?: string | null;
  contactIds?: number[];
}

export async function createProject({
  companyId,
  name,
  firstContactAt,
  salaryMin,
  salaryMax,
  salaryCurrency,
  salaryPeriod,
  salaryRaw,
  status,
  contactIds,
}: CreateProjectArgs): Promise<ActionResult<{ id: number }>> {
  try {
    const company = await db.query.companies.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.id, companyId),
    })

    if (!company) {
      return failure("La empresa indicada no existe")
    }
    const trimmedName = name.trim()
    if (!trimmedName) {
      return failure("El nombre del proyecto es obligatorio")
    }
    if (!Number.isFinite(firstContactAt)) {
      return failure("La fecha de primer contacto es obligatoria")
    }
    const now = Date.now()

    const result = await db.transaction(async (tx) => {
      const projectValues: typeof projects.$inferInsert = {
        companyId,
        name: trimmedName,
        firstContactAt,
        createdAt: now,
        updatedAt: now,
      }

      if (salaryMin != null) projectValues.salaryMin = salaryMin
      if (salaryMax != null) projectValues.salaryMax = salaryMax
      if (salaryCurrency) projectValues.salaryCurrency = salaryCurrency
      if (salaryPeriod) projectValues.salaryPeriod = salaryPeriod
      if (salaryRaw) projectValues.salaryRaw = salaryRaw
      if (status) projectValues.status = status

      const [ project ] = await tx
        .insert(projects)
        .values(projectValues)
        .returning({ id: projects.id })

      if (contactIds?.length) {
        const pairs = await Promise.all(
          contactIds.map(async (contactId) => {
            const belongs = await contactBelongsToCompany({
              contactId,
              companyId,
            })

            return belongs ? contactId : null
          }),
        )

        const validContactIds = pairs.filter((value): value is number => value !== null)

        if (validContactIds.length) {
          await tx.insert(projectContacts).values(
            validContactIds.map((contactId) => ({
              projectId: project.id,
              contactId,
            })),
          )
        }
      }

      return project
    })

    revalidateTag(PROJECTS_TAG)

    return success({ id: result.id })
  } catch (error) {
    console.error("createProject", error)

    return failure("No se pudo crear el proyecto")
  }
}

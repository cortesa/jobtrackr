"use server"

import { Buffer } from "node:buffer"

import { parse } from "csv-parse/sync"
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
import { CSV_HEADERS } from "@/lib/csvTemplate"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface NormalizedRow {
  companyName: string
  companyWebsite: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  contactRole: string | null
  contactNotes: string | null
  projectName: string
  firstContactAt: number
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  salaryPeriod: string | null
  salaryRaw: string | null
  status: string | null
  techsRequired: string[]
  techsValuable: string[]
  stepTitle: string | null
  stepAt: number | null
  stepComment: string | null
  noteAt: number | null
  noteContent: string | null
}

function normalizeDate(input: string, column: string, rowIndex: number, errors: string[]): number | null {
  if (!input) return null

  const trimmed = input.trim()
  if (!trimmed) return null

  const parsed = Number.isFinite(Number(trimmed)) ? Number(trimmed) : Date.parse(trimmed)
  if (Number.isNaN(parsed)) {
    errors.push(`Fila ${rowIndex}: la columna "${column}" tiene una fecha inválida (${input}).`)

    return null
  }

  return parsed
}
function normalizeNumber(
  input: string,
  column: string,
  rowIndex: number,
  errors: string[],
): number | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null
  const value = Number(trimmed)
  if (!Number.isFinite(value)) {
    errors.push(`Fila ${rowIndex}: la columna "${column}" debe ser numérica (${input}).`)

    return null
  }

  return value
}
function normalizeList(input: string | null | undefined): string[] {
  return (input ?? "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
function sanitizeRow(row: string[], headerLength: number): string[] | null {
  const cells = row.map((value) => value.trim())
  const requiredIndices = [ 0, 7, 8 ]

  while (cells.length > headerLength) {
    let removed = false

    for (const requiredIndex of requiredIndices) {
      if (requiredIndex < cells.length && cells[requiredIndex] === "" && cells[requiredIndex + 1]) {
        cells.splice(requiredIndex, 1)
        removed = true
        break
      }
    }
    if (removed) {
      continue
    }
    const removeIndex = cells.lastIndexOf("")
    if (removeIndex === -1) {
      break
    }
    cells.splice(removeIndex, 1)
  }
  if (cells.length > headerLength) {
    return null
  }
  while (cells.length < headerLength) {
    cells.push("")
  }

  return cells
}
async function persistRows(normalizedRows: NormalizedRow[]) {
  const companyCache = new Map<string, number>()
  const contactCache = new Map<string, number>()
  const techCache = new Map<string, number>()

  let imported = 0
  let skipped = 0

  for (const row of normalizedRows) {
    const nameKey = row.companyName.toLowerCase()
    let companyId = companyCache.get(nameKey)

    if (!companyId) {
      const existingCompany = await db.query.companies.findFirst({
        where: (table, { eq }) => eq(table.name, row.companyName),
      })

      if (existingCompany) {
        companyId = existingCompany.id
      } else {
        const [ insertedCompany ] = await db
          .insert(companies)
          .values({ name: row.companyName, website: row.companyWebsite })
          .returning({ id: companies.id })
        companyId = insertedCompany.id
      }
      companyCache.set(nameKey, companyId)
    }
    let contactId: number | null = null
    if (row.contactName) {
      const contactKey = (row.contactEmail || `${row.contactName}-${companyId}`).toLowerCase()
      contactId = contactCache.get(contactKey) ?? null

      if (!contactId) {
        const existingContact = await db.query.contacts.findFirst({
          where: (table, { and, eq }) =>
            row.contactEmail
              ? and(eq(table.companyId, companyId), eq(table.email, row.contactEmail))
              : and(eq(table.companyId, companyId), eq(table.name, row.contactName!)),
        })

        if (existingContact) {
          contactId = existingContact.id
        } else {
          const [ insertedContact ] = await db
            .insert(contacts)
            .values({
              companyId,
              name: row.contactName,
              email: row.contactEmail,
              phone: row.contactPhone,
              role: row.contactRole,
              notes: row.contactNotes,
            })
            .returning({ id: contacts.id })
          contactId = insertedContact.id
        }
        contactCache.set(contactKey, contactId)
      }
    }
    const now = Date.now()
    const projectValues: typeof projects.$inferInsert = {
      companyId,
      name: row.projectName,
      firstContactAt: row.firstContactAt,
      salaryMin: row.salaryMin ?? undefined,
      salaryMax: row.salaryMax ?? undefined,
      salaryCurrency: row.salaryCurrency ?? undefined,
      salaryPeriod: row.salaryPeriod ?? undefined,
      salaryRaw: row.salaryRaw,
      status: row.status ?? undefined,
      createdAt: now,
      updatedAt: now,
    }

    const existingProject = await db.query.projects.findFirst({
      where: (table, { and, eq }) => and(eq(table.companyId, companyId), eq(table.name, row.projectName)),
    })

    if (existingProject) {
      skipped += 1
      continue
    }
    const [ insertedProject ] = await db
      .insert(projects)
      .values(projectValues)
      .returning({ id: projects.id })

    const projectId = insertedProject.id

    if (contactId) {
      await db
        .insert(projectContacts)
        .values({ projectId, contactId })
        .onConflictDoNothing({
          target: [ projectContacts.projectId, projectContacts.contactId ],
        })
    }
    const handletech = async (techName: string, kind: "required" | "valuable") => {
      const key = techName.toLowerCase()
      let techId = techCache.get(key)
      if (!techId) {
        const tech = await findOrCreateTech({ name: techName })
        techId = tech.id
        techCache.set(key, techId)
      }
      await linkTechToProject({ projectId, techId, kind })
    }
    await Promise.all(row.techsRequired.map((tech) => handletech(tech, "required")))
    await Promise.all(row.techsValuable.map((tech) => handletech(tech, "valuable")))

    if (row.stepTitle && row.stepAt) {
      await db.insert(projectSteps).values({
        projectId,
        title: row.stepTitle,
        comment: row.stepComment,
        stepAt: row.stepAt,
        sortOrder: 0,
        createdAt: now,
      })
    }
    if (row.noteContent && row.noteAt) {
      await db.insert(projectNotes).values({
        projectId,
        content: row.noteContent,
        noteAt: row.noteAt,
      })
    }
    imported += 1
  }

  return { imported, skipped }
}
async function processCsvContent(content: string): Promise<ActionResult<{ imported: number; skipped: number }>> {
  try {
    const rows = parse(content, {
      columns: false,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as string[][]

    if (!rows.length) {
      return failure("El CSV no contiene registros")
    }
    const [ rawHeader, ...dataRows ] = rows
    const header = rawHeader.map((value) => value.trim())

    if (header.length !== CSV_HEADERS.length || !header.every((value, index) => value === CSV_HEADERS[index])) {
      return failure("La fila de cabeceras no coincide con el formato esperado")
    }
    const errors: string[] = []
    const normalizedRows: NormalizedRow[] = []

    dataRows.forEach((row, index) => {
      const line = index + 2
      const sanitized = sanitizeRow(row, header.length)
      if (!sanitized) {
        errors.push(`Fila ${line}: contiene más columnas de las esperadas y no se pudo ajustar automáticamente.`)

        return
      }
      const record: Record<string, string> = {}
      header.forEach((column, columnIndex) => {
        record[column] = sanitized[columnIndex] ?? ""
      })

      const companyName = record.company_name?.trim()
      if (!companyName) {
        errors.push(`Fila ${line}: "company_name" es obligatorio.`)
      }
      const projectName = record.project_name?.trim()
      if (!projectName) {
        errors.push(`Fila ${line}: "project_name" es obligatorio.`)
      }
      const firstContactAtValue = normalizeDate(
        record.first_contact_at,
        "first_contact_at",
        line,
        errors,
      )

      if (firstContactAtValue === null) {
        errors.push(`Fila ${line}: "first_contact_at" es obligatorio.`)
      }
      const salaryMin = normalizeNumber(record.salary_min ?? "", "salary_min", line, errors)
      const salaryMax = normalizeNumber(record.salary_max ?? "", "salary_max", line, errors)

      const stepAtValue = normalizeDate(record.step_at ?? "", "step_at", line, errors)
      const noteAtValue = normalizeDate(record.note_at ?? "", "note_at", line, errors)

      normalizedRows.push({
        companyName: companyName ?? "",
        companyWebsite: record.company_website?.trim() || null,
        contactName: record.contact_name?.trim() || null,
        contactEmail: record.contact_email?.trim() || null,
        contactPhone: record.contact_phone?.trim() || null,
        contactRole: record.contact_role?.trim() || null,
        contactNotes: record.contact_notes?.trim() || null,
        projectName: projectName ?? "",
        firstContactAt: firstContactAtValue != null ? Math.trunc(firstContactAtValue) : 0,
        salaryMin,
        salaryMax,
        salaryCurrency: record.salary_currency?.trim() || null,
        salaryPeriod: record.salary_period?.trim() || null,
        salaryRaw: record.salary_raw?.trim() || null,
        status: record.status?.trim() || null,
        techsRequired: normalizeList(record.techs_required),
        techsValuable: normalizeList(record.techs_valuable),
        stepTitle: record.step_title?.trim() || null,
        stepAt: stepAtValue != null ? Math.trunc(stepAtValue) : null,
        stepComment: record.step_comment?.trim() || null,
        noteAt: noteAtValue != null ? Math.trunc(noteAtValue) : null,
        noteContent: record.note_content?.trim() || null,
      })
    })

    if (errors.length) {
      return failure(errors.slice(0, 10).join(" \n"))
    }
    const { imported, skipped } = await persistRows(normalizedRows)

    revalidateTag(PROJECTS_TAG)

    return success({ imported, skipped })
  } catch (error) {
    console.error("processCsvContent", error)

    return failure("No se pudieron importar los datos del CSV")
  }
}
export async function importProjectsFromCsv(formData: FormData): Promise<
  ActionResult<{ imported: number; skipped: number }>
> {
  try {
    const file = formData.get("file") as File | null
    if (!file) {
      return failure("Debes seleccionar un archivo CSV")
    }
    if (!file.name.endsWith(".csv")) {
      return failure("El archivo debe tener extensión .csv")
    }
    if (file.size === 0) {
      return failure("El archivo está vacío")
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString("utf8")

    return processCsvContent(content)
  } catch (error) {
    console.error("importProjectsFromCsv", error)

    return failure("No se pudieron importar los datos del CSV")
  }
}
export async function importProjectsFromCsvText(csvText: string): Promise<
  ActionResult<{ imported: number; skipped: number }>
> {
  try {
    if (!csvText || !csvText.trim()) {
      return failure("El contenido CSV está vacío")
    }

    return processCsvContent(csvText)
  } catch (error) {
    console.error("importProjectsFromCsvText", error)

    return failure("No se pudieron importar los datos del CSV")
  }
}

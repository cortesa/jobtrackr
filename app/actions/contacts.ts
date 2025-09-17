"use server"

import { revalidateTag } from "next/cache"

import { db, contacts } from "@/db"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface CreateContactArgs {
  companyId: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  notes?: string | null;
}

export async function createContact({
  companyId,
  name,
  email,
  phone,
  role,
  notes,
}: CreateContactArgs): Promise<ActionResult<{ id: number }>> {
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
      return failure("El nombre del contacto es obligatorio")
    }
    const [ contact ] = await db
      .insert(contacts)
      .values({
        companyId,
        name: trimmedName,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        role: role?.trim() || null,
        notes: notes?.trim() || null,
      })
      .returning({ id: contacts.id })

    revalidateTag(PROJECTS_TAG)

    return success({ id: contact.id })
  } catch (error) {
    console.error("createContact", error)

    return failure("No se pudo crear el contacto")
  }
}

"use server"

import { revalidateTag } from "next/cache"

import { db, companies } from "@/db"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface CreateCompanyArgs {
  name: string;
  website?: string | null;
}

export async function createCompany({
  name,
  website,
}: CreateCompanyArgs): Promise<ActionResult<{ id: number }>> {
  try {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return failure("El nombre de la empresa es obligatorio")
    }
    const [ company ] = await db
      .insert(companies)
      .values({ name: trimmedName, website: website?.trim() || null })
      .returning({ id: companies.id })

    revalidateTag(PROJECTS_TAG)

    return success({ id: company.id })
  } catch (error) {
    console.error("createCompany", error)

    return failure("No se pudo crear la empresa")
  }
}

"use server"

import { revalidateTag } from "next/cache"

import { findOrCreateTech, linkTechToProject, projectExists } from "@/db/queries"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface AddTechsArgs {
  projectId: number;
  name: string;
  kind: "required" | "valuable";
}

export async function addTech({
  projectId,
  name,
  kind,
}: AddTechsArgs): Promise<ActionResult<{ techId: number }>> {
  try {
    if (!name.trim()) {
      return failure("El nombre de la tech es obligatorio")
    }
    if (![ "required", "valuable" ].includes(kind)) {
      return failure("El tipo de tech no es válido")
    }
    const exists = await projectExists(projectId)
    if (!exists) {
      return failure("El proyecto indicado no existe")
    }
    const tech = await findOrCreateTech({ name })

    await linkTechToProject({ projectId, techId: tech.id, kind })

    revalidateTag(PROJECTS_TAG)

    return success({ techId: tech.id })
  } catch (error) {
    console.error("addtech", error)
    if (error instanceof Error && /check constraint/i.test(error.message)) {
      return failure("El tipo de tech debe ser 'required' o 'valuable'")
    }

    return failure("No se pudo añadir la tech")
  }
}

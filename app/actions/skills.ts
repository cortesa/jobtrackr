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

export async function addSkill({
  projectId,
  name,
  kind,
}: AddTechsArgs): Promise<ActionResult<{ techId: number }>> {
  try {
    if (!name.trim()) {
      return failure("El nombre de la skill es obligatorio")
    }
    if (![ "required", "valuable" ].includes(kind)) {
      return failure("El tipo de skill no es válido")
    }
    const exists = await projectExists(projectId)
    if (!exists) {
      return failure("El proyecto indicado no existe")
    }
    const skill = await findOrCreateTech({ name })

    await linkTechToProject({ projectId, techId: skill.id, kind })

    revalidateTag(PROJECTS_TAG)

    return success({ skillId: skill.id })
  } catch (error) {
    console.error("addSkill", error)
    if (error instanceof Error && /check constraint/i.test(error.message)) {
      return failure("El tipo de skill debe ser 'required' o 'valuable'")
    }

    return failure("No se pudo añadir la skill")
  }
}

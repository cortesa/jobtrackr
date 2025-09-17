"use server";

import { revalidateTag } from "next/cache";

import { findOrCreateSkill, linkSkillToProject, projectExists } from "@/db/queries";
import { PROJECTS_TAG } from "./cache";
import { failure, success, type ActionResult } from "./types";

interface AddSkillArgs {
  projectId: number;
  name: string;
  kind: "required" | "valuable";
}

export async function addSkill({
  projectId,
  name,
  kind,
}: AddSkillArgs): Promise<ActionResult<{ skillId: number }>> {
  try {
    if (!name.trim()) {
      return failure("El nombre de la skill es obligatorio");
    }

    if (!["required", "valuable"].includes(kind)) {
      return failure("El tipo de skill no es válido");
    }

    const exists = await projectExists(projectId);
    if (!exists) {
      return failure("El proyecto indicado no existe");
    }

    const skill = await findOrCreateSkill({ name });

    await linkSkillToProject({ projectId, skillId: skill.id, kind });

    revalidateTag(PROJECTS_TAG);
    return success({ skillId: skill.id });
  } catch (error) {
    console.error("addSkill", error);
    if (error instanceof Error && /check constraint/i.test(error.message)) {
      return failure("El tipo de skill debe ser 'required' o 'valuable'");
    }
    return failure("No se pudo añadir la skill");
  }
}

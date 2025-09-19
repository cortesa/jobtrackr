"use server"

import { revalidateTag } from "next/cache"

import { db, projectSteps, projects } from "@/db"
import { projectExists } from "@/db/queries"
import { PROJECTS_TAG } from "./cache"
import { failure, success, type ActionResult } from "./types"

interface AddStepArgs {
  projectId: number;
  stepAt: number;
  title: string;
  comment?: string | null;
  sortOrder?: number | null;
}

export async function addStep({
  projectId,
  stepAt,
  title,
  comment,
  sortOrder,
}: AddStepArgs): Promise<ActionResult<{ id: number }>> {
  try {
    if (!title.trim()) {
      return failure("El título del paso es obligatorio")
    }
    if (!Number.isFinite(stepAt)) {
      return failure("La fecha del paso es obligatoria")
    }
    const exists = await projectExists(projectId)
    if (!exists) {
      return failure("El proyecto indicado no existe")
    }
    const now = Date.now()

    const [ step ] = await db
      .insert(projectSteps)
      .values({
        projectId,
        stepAt,
        title: title.trim(),
        comment: comment?.trim() || null,
        sortOrder: sortOrder ?? null,
        createdAt: now,
      })
      .returning({ id: projectSteps.id })

    await db
      .update(projects)
      .set({ updatedAt: now })
      .where((table, { eq }) => eq(table.id, projectId))

    revalidateTag(PROJECTS_TAG)

    return success({ id: step.id })
  } catch (error) {
    console.error("addStep", error)

    return failure("No se pudo añadir el paso")
  }
}

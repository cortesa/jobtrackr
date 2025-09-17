"use server";

import { revalidateTag } from "next/cache";

import { db, projectNotes, projects } from "@/db";
import { projectExists } from "@/db/queries";
import { PROJECTS_TAG } from "./cache";
import { failure, success, type ActionResult } from "./types";

interface AddNoteArgs {
  projectId: number;
  noteAt: number;
  content: string;
}

export async function addNote({
  projectId,
  noteAt,
  content,
}: AddNoteArgs): Promise<ActionResult<{ id: number }>> {
  try {
    if (!content.trim()) {
      return failure("El contenido de la nota es obligatorio");
    }

    if (!Number.isFinite(noteAt)) {
      return failure("La fecha de la nota es obligatoria");
    }

    const exists = await projectExists(projectId);
    if (!exists) {
      return failure("El proyecto indicado no existe");
    }

    const now = Date.now();

    const [note] = await db
      .insert(projectNotes)
      .values({
        projectId,
        noteAt,
        content: content.trim(),
      })
      .returning({ id: projectNotes.id });

    await db
      .update(projects)
      .set({ updatedAt: now })
      .where((table, { eq }) => eq(table.id, projectId));

    revalidateTag(PROJECTS_TAG);
    return success({ id: note.id });
  } catch (error) {
    console.error("addNote", error);
    return failure("No se pudo añadir la nota");
  }
}

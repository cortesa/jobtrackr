"use client"

import { useQuery } from "@tanstack/react-query"

import type { ProjectDetails } from "@/db/queries"

async function fetchProjects(): Promise<ProjectDetails[]> {
  const response = await fetch("/api/projects", {
    method: "GET",
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("No se pudieron cargar los proyectos")
  }
  const payload = (await response.json()) as { projects: ProjectDetails[] }

  return payload.projects
}
export function useProjects() {
  return useQuery({
    queryKey: [ "projects" ],
    queryFn: fetchProjects,
  })
}

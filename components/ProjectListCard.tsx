"use client"

import Link from "next/link"

import type { ProjectDetails } from "@/db/queries"
import { formatCurrencyRange } from "@/lib/formatters"

import styles from "./ProjectListCard.module.scss"

interface ProjectListCardProps {
  project: ProjectDetails
}

export function ProjectListCard({ project }: ProjectListCardProps) {
  const salaryRange = formatCurrencyRange({
    min: project.salary.min ?? undefined,
    max: project.salary.max ?? undefined,
    currency: project.salary.currency,
    period: project.salary.period,
  })

  return (
    <Link
      href={`/projects/${project.id}`}
      className={styles.card}
      style={{
        color: project.company.color || undefined,
      }}>
      <span className={styles.company}>{project.company.name}</span>
      <span className={styles.project}>{project.name}</span>
      {salaryRange ? <span className={styles.salary}>{salaryRange}</span> : null}
    </Link>
  )
}

"use client"

import Link from "next/link"

import type { ProjectDetails } from "@/db/queries"
import { formatCurrencyRange, formatDate } from "@/lib/formatters"

import styles from "./ProjectCard.module.scss"

interface ProjectCardProps {
  project: ProjectDetails;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const salaryRange = formatCurrencyRange({
    min: project.salary.min ?? undefined,
    max: project.salary.max ?? undefined,
    currency: project.salary.currency,
    period: project.salary.period,
  })

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.companyName}>{project.company.name}</span>
        <span className={styles.projectName}>{project.name}</span>
        <div className={styles.meta}>
          <span>Primer contacto: {formatDate(project.firstContactAt)}</span>
          {project.salary.raw ? <span>Oferta: {project.salary.raw}</span> : null}
          {salaryRange ? <span>Rango estimado: {salaryRange}</span> : null}
          {project.company.website ? (
            <Link href={project.company.website} target="_blank" rel="noreferrer">
              Web empresa
            </Link>
          ) : null}
        </div>
      </header>

      <section className={styles.contacts} aria-label="Contactos">
        <span className={styles.sectionTitle}>Contactos</span>
        {project.contacts.length ? (
          project.contacts.map((contact) => (
            <div key={contact.id} className={styles.contactItem}>
              <strong>{contact.name}</strong>
              <span>{contact.role ?? "Rol no definido"}</span>
              <span>{contact.email ?? "Sin email"}</span>
              {contact.phone ? <span>Tel: {contact.phone}</span> : null}
              {contact.notes ? <span>{contact.notes}</span> : null}
            </div>
          ))
        ) : (
          <span className={styles.empty}>No hay contactos asociados.</span>
        )}
      </section>

      <section className={styles.skills} aria-label="Tecnologías">
        <span className={styles.sectionTitle}>Stack</span>
        <div className={styles.skillGroup}>
          <span>Imprescindibles</span>
          <div className={styles.skillPillGroup}>
            {project.skills.required.length ? (
              project.skills.required.map((skill) => (
                <span key={`required-${skill}`} className={styles.skillPill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className={styles.empty}>Sin skills imprescindibles.</span>
            )}
          </div>
        </div>
        <div className={styles.skillGroup}>
          <span>Valorables</span>
          <div className={styles.skillPillGroup}>
            {project.skills.valuable.length ? (
              project.skills.valuable.map((skill) => (
                <span
                  key={`valuable-${skill}`}
                  className={`${styles.skillPill} ${styles.skillPillValuable}`}
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className={styles.empty}>Sin skills valorables.</span>
            )}
          </div>
        </div>
      </section>

      <section className={styles.steps} aria-label="Proceso">
        <span className={styles.sectionTitle}>Pasos</span>
        {project.steps.length ? (
          project.steps.map((step) => (
            <div key={step.id} className={styles.timelineItem}>
              <span className={styles.itemDate}>{formatDate(step.stepAt)}</span>
              <span className={styles.itemTitle}>{step.title}</span>
              {step.comment ? <span className={styles.itemComment}>{step.comment}</span> : null}
            </div>
          ))
        ) : (
          <span className={styles.empty}>Aún no hay pasos registrados.</span>
        )}
      </section>

      <section className={styles.notes} aria-label="Notas">
        <span className={styles.sectionTitle}>Notas</span>
        {project.notes.length ? (
          project.notes.map((note) => (
            <div key={note.id} className={styles.noteItem}>
              <span className={styles.itemDate}>{formatDate(note.noteAt)}</span>
              <span>{note.content}</span>
            </div>
          ))
        ) : (
          <span className={styles.empty}>Sin notas por el momento.</span>
        )}
      </section>
    </article>
  )
}

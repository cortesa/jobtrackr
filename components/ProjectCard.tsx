"use client"

import Link from "next/link"

import type { ProjectDetails } from "@/db/queries"
import { formatCurrencyRange, formatDate } from "@/lib/formatters"
import { Icons, type IconName } from "@/lib/icons"

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

      <section className={styles.techs} aria-label="Tecnologías">
        <span className={styles.sectionTitle}>Stack</span>
        <div className={styles.techGroup}>
          <span>Imprescindibles</span>
          <div className={styles.techPillGroup}>
            {project.techs.required.length ? (
              project.techs.required.map((tech) => {
                const IconComponent = tech.icon ? Icons[tech.icon as IconName] : null

                return (
                  <span key={`required-${project.id}-${tech.name}`} className={styles.techPill}>
                    {IconComponent ? <IconComponent size={14} /> : null}
                    {tech.name}
                  </span>
                )
              })
            ) : (
              <span className={styles.empty}>Sin techs imprescindibles.</span>
            )}
          </div>
        </div>
        <div className={styles.techGroup}>
          <span>Valorables</span>
          <div className={styles.techPillGroup}>
            {project.techs.valuable.length ? (
              project.techs.valuable.map((tech) => {
                const IconComponent = tech.icon ? Icons[tech.icon as IconName] : null

                return (
                  <span
                    key={`valuable-${project.id}-${tech.name}`}
                    className={`${styles.techPill} ${styles.techPillValuable}`}
                  >
                    {IconComponent ? <IconComponent size={14} /> : null}
                    {tech.name}
                  </span>
                )
              })
            ) : (
              <span className={styles.empty}>Sin techs valorables.</span>
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

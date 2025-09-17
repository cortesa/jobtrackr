import { notFound } from "next/navigation"
import Link from "next/link"

import { getProjectDetailsById } from "@/db/queries"
import { formatCurrencyRange, formatDate } from "@/lib/formatters"

import styles from "./page.module.scss"

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const id = Number(params.projectId)
  if (!Number.isFinite(id)) {
    notFound()
  }
  const project = await getProjectDetailsById(id)
  if (!project) {
    notFound()
  }
  const salaryRangeText = formatCurrencyRange({
    min: project.salary.min ?? undefined,
    max: project.salary.max ?? undefined,
    currency: project.salary.currency,
    period: project.salary.period,
  })

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs} aria-label="Navegación">
        <Link href="/">← Volver a la lista</Link>
      </nav>

      <header className={styles.header}>
        <div>
          <p className={styles.company}>{project.company.name}</p>
          <h1 className={styles.title}>{project.name}</h1>
        </div>
        <div className={styles.headerActions}>
          {salaryRangeText ? <span className={styles.salary}>{salaryRangeText}</span> : null}
          {project.company.website ? (
            <a href={project.company.website} target="_blank" rel="noreferrer" className={styles.websiteLink}>
              Visitar web
            </a>
          ) : null}
        </div>
      </header>

      <section className={styles.section} aria-labelledby="project-overview">
        <h2 id="project-overview">Resumen</h2>
        <dl className={styles.definitionList}>
          <div>
            <dt>Primer contacto</dt>
            <dd>{formatDate(project.firstContactAt)}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{project.status ?? "Sin estado"}</dd>
          </div>
          {project.salary.raw ? (
            <div>
              <dt>Oferta textual</dt>
              <dd>{project.salary.raw}</dd>
            </div>
          ) : null}
          <div>
            <dt>Última actualización</dt>
            <dd>{formatDate(project.updatedAt)}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="project-contacts">
        <h2 id="project-contacts">Contactos</h2>
        {project.contacts.length ? (
          <ul className={styles.list}>
            {project.contacts.map((contact) => (
              <li key={contact.id}>
                <strong>{contact.name}</strong>
                <div className={styles.meta}>
                  {contact.role ? <span>{contact.role}</span> : null}
                  {contact.email ? <span>{contact.email}</span> : null}
                  {contact.phone ? <span>{contact.phone}</span> : null}
                </div>
                {contact.notes ? <p>{contact.notes}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No hay contactos asociados.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="project-techs">
        <h2 id="project-techs">Stack</h2>
        <div className={styles.tech}>
          <div>
            <h3>Imprescindibles</h3>
            {project.techs.required.length ? (
              <ul className={styles.pills}>
                {project.techs.required.map((tech) => (
                  <li key={`required-${tech}`}>{tech}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Sin techs imprescindibles.</p>
            )}
          </div>
          <div>
            <h3>Valorables</h3>
            {project.techs.valuable.length ? (
              <ul className={styles.pills}>
                {project.techs.valuable.map((tech) => (
                  <li key={`valuable-${tech}`}>{tech}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Sin techs valorables.</p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="project-steps">
        <h2 id="project-steps">Pasos</h2>
        {project.steps.length ? (
          <ul className={styles.timeline}>
            {project.steps.map((step) => (
              <li key={step.id}>
                <span>{formatDate(step.stepAt)}</span>
                <strong>{step.title}</strong>
                {step.comment ? <p>{step.comment}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Aún no hay pasos registrados.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="project-notes">
        <h2 id="project-notes">Notas</h2>
        {project.notes.length ? (
          <ul className={styles.list}>
            {project.notes.map((note) => (
              <li key={note.id}>
                <span>{formatDate(note.noteAt)}</span>
                <p>{note.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Sin notas registradas.</p>
        )}
      </section>
    </div>
  )
}

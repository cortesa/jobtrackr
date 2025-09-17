"use client"

import { useProjects } from "@/hooks/useProjects"

import { CsvImportButton } from "./CsvImportButton"
import { ProjectCard } from "./ProjectCard"
import { ProjectFormCard } from "./ProjectFormCard"
import styles from "./ProjectOverview.module.scss"

export function ProjectOverview() {
  const { data, isLoading, isError, error } = useProjects()

  return (
    <section className={styles.container}>
      <header className={styles.heading}>
        <div className={styles.headingText}>
          <h1 className={styles.title}>Tus posiciones
          </h1>
          <p className={styles.subtitle}>
            Controla tus oportunidades, contactos, pasos y notas en un solo lugar.
          </p>
        </div>
        <CsvImportButton />
      </header>

      {isLoading ? <StateMessage message="Cargando proyectos..." /> : null}
      {isError ? <StateMessage message={error?.message ?? "Ha ocurrido un error."} /> : null}

      {!isLoading && !isError ? (
        data && data.length ? (
          <div className={styles.grid}>
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <StateMessage message="Empieza registrando la información clave de tu primer proyecto." />
            <ProjectFormCard />
          </div>
        )
      ) : null}
    </section>
  )
}
function StateMessage({ message }: { message: string }) {
  return <div className={styles.state}>{message}</div>
}

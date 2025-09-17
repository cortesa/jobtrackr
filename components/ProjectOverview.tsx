"use client"

import { useProjects } from "@/hooks/useProjects"

import { ProjectCard } from "./ProjectCard"
import styles from "./ProjectOverview.module.scss"

export function ProjectOverview() {
  const { data, isLoading, isError, error } = useProjects()

  return (
    <section className={styles.container}>
      <header className={styles.heading}>
        <h1 className={styles.title}>Tus proyectos</h1>
        <p className={styles.subtitle}>
          Controla tus oportunidades, contactos, pasos y notas en un solo lugar.
        </p>
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
          <StateMessage message="Añade tu primer proyecto para empezar a seguirlo." />
        )
      ) : null}
    </section>
  )
}
function StateMessage({ message }: { message: string }) {
  return <div className={styles.state}>{message}</div>
}

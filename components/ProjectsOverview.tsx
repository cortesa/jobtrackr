"use client"

import { useState } from "react"

import { useProjects } from "@/hooks/useProjects"

import { CsvImportButton } from "./CsvImportButton"
import { ProjectListCard } from "./ProjectListCard"
import { ProjectFormCard } from "./ProjectFormCard"
import styles from "./ProjectsOverview.module.scss"
import { useCompanies } from "@/hooks/useCompanies"

export function ProjectsOverview() {
  const { data, isLoading, isError, error } = useProjects()
  const [ showForm, setShowForm ] = useState(false)

  const { data: apolloData } = useCompanies()

  console.log("acz: comapnies apolloData", apolloData)

  return (
    <section className={styles.container}>
      <header className={styles.heading}>
        <div className={styles.headingText}>
          <h1 className={styles.title}>Tus posiciones</h1>
          <p className={styles.subtitle}>
            Controla tus oportunidades, contactos, pasos y notas en un solo lugar.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setShowForm((previous) => !previous)}
          >
            {showForm ? "Cerrar formulario" : "Añadir proyecto"}
          </button>
          <CsvImportButton />
        </div>
      </header>

      {showForm ? <ProjectFormCard /> : null}

      {isLoading ? <StateMessage message="Cargando proyectos..." /> : null}
      {isError ? <StateMessage message={error?.message ?? "Ha ocurrido un error."} /> : null}

      {!isLoading && !isError ? (
        data && data.length ? (
          <div className={styles.grid}>
            {data.map((project) => (
              <ProjectListCard key={project.id} project={project} />
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

"use client"

import styles from "./ProjectFormCard.module.scss"

export function ProjectFormCard() {
  return (
    <form className={styles.card} aria-labelledby="project-form-card-title">
      <header className={styles.header}>
        <h2 id="project-form-card-title">Añade un nuevo proyecto</h2>
        <p className={styles.helperText}>
          Esta tarjeta es un formulario de ejemplo para guiar la captura de datos.
        </p>
      </header>

      <div className={styles.sections}>
        <section className={`${styles.section} ${styles.company}`} aria-labelledby="project-form-company">
          <h3 id="project-form-company" className={styles.sectionTitle}>
            Empresa
          </h3>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Nombre
              <input
                className={styles.input}
                type="text"
                name="companyName"
                placeholder="Algorath"
              />
            </label>
            <label className={styles.label}>
              Sitio web
              <input
                className={styles.input}
                type="url"
                name="companyWebsite"
                placeholder="https://algorath.com"
              />
            </label>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionFull} ${styles.contact}`} aria-labelledby="project-form-contact">
          <h3 id="project-form-contact" className={styles.sectionTitle}>
            Contacto principal
          </h3>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Nombre completo
              <input
                className={styles.input}
                type="text"
                name="contactName"
                placeholder="Suleiman Mohamed Mimun"
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                name="contactEmail"
                placeholder="suleiman@algorath.com"
              />
            </label>
            <label className={styles.label}>
              Teléfono
              <input
                className={styles.input}
                type="tel"
                name="contactPhone"
                placeholder="+34 600 000 000"
              />
            </label>
          </div>
          <label className={styles.label}>
            Rol
            <input
              className={styles.input}
              type="text"
              name="contactRole"
              placeholder="Talent Acquisition"
            />
          </label>
          <label className={styles.label}>
            Notas rápidas
            <textarea
              className={styles.textarea}
              name="contactNotes"
              placeholder="Respuesta ágil, disponible de 9:00 a 17:00."
            />
          </label>
        </section>

        <section className={`${styles.section} ${styles.sectionFull} ${styles.project}`} aria-labelledby="project-form-project">
          <h3 id="project-form-project" className={styles.sectionTitle}>
            Proyecto
          </h3>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Nombre del proyecto
              <input className={styles.input} type="text" name="projectName" placeholder="LeoVegas" />
            </label>
            <label className={styles.label}>
              Fecha primer contacto
              <input className={styles.input} type="date" name="firstContact" />
            </label>
            <label className={styles.label}>
              Estado
              <select className={styles.select} name="status" defaultValue="open">
                <option value="open">Abierto</option>
                <option value="hold">En pausa</option>
                <option value="won">Ganado</option>
                <option value="lost">Descartado</option>
              </select>
            </label>
          </div>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Salario mínimo (€)
              <input
                className={styles.input}
                type="number"
                name="salaryMin"
                placeholder="42000"
                min="0"
                step="1000"
              />
            </label>
            <label className={styles.label}>
              Salario máximo (€)
              <input
                className={styles.input}
                type="number"
                name="salaryMax"
                placeholder="55000"
                min="0"
                step="1000"
              />
            </label>
            <label className={styles.label}>
              Periodo salarial
              <select className={styles.select} name="salaryPeriod" defaultValue="year">
                <option value="year">Año</option>
                <option value="month">Mes</option>
                <option value="day">Día</option>
              </select>
            </label>
          </div>
          <label className={styles.label}>
            Oferta textual
            <textarea
              className={styles.textarea}
              name="salaryRaw"
              placeholder="Oferta final de 42.8k con bonus tras 6 meses."
            />
          </label>
        </section>

        <section className={`${styles.section} ${styles.skills}`} aria-labelledby="project-form-skills">
          <h3 id="project-form-skills" className={styles.sectionTitle}>
            Stack requerido
          </h3>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Imprescindibles
              <input
                className={styles.input}
                type="text"
                name="skillsRequired"
                placeholder="React, TypeScript, Tailwind"
              />
            </label>
            <label className={styles.label}>
              Valorables
              <input
                className={styles.input}
                type="text"
                name="skillsNiceToHave"
                placeholder="Storybook, Testing Library"
              />
            </label>
          </div>
        </section>

        <section className={`${styles.section} ${styles.steps}`} aria-labelledby="project-form-steps">
          <h3 id="project-form-steps" className={styles.sectionTitle}>
            Pasos del proceso
          </h3>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Próximo paso
              <input
                className={styles.input}
                type="text"
                name="nextStep"
                placeholder="Entrevista técnica con lead"
              />
            </label>
            <label className={styles.label}>
              Fecha estimada
              <input className={styles.input} type="date" name="nextStepDate" />
            </label>
            <label className={styles.label}>
              Comentario
              <textarea
                className={styles.textarea}
                name="stepComment"
                placeholder="Traer ejemplos de componentes y preparar pair-programming."
              />
            </label>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionFull} ${styles.notes}`} aria-labelledby="project-form-notes">
          <h3 id="project-form-notes" className={styles.sectionTitle}>
            Notas
          </h3>
          <label className={styles.label}>
            Resumen
            <textarea
              className={styles.textarea}
              name="projectNotes"
              placeholder="Oferta final aceptada, incorporación prevista el 22 de septiembre."
            />
          </label>
        </section>
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.fakeButton} disabled>
          Guardar proyecto
        </button>
      </footer>
    </form>
  )
}

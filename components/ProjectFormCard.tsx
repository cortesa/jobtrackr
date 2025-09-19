"use client"

import { useMemo, useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { createProjectBundle } from "@/app/actions/projectBundle"

import styles from "./ProjectFormCard.module.scss"

interface FormState {
  companyName: string
  companyWebsite: string
  contactName: string
  contactEmail: string
  contactPhone: string
  contactRole: string
  contactNotes: string
  projectName: string
  firstContactAt: string
  status: string
  salaryMin: string
  salaryMax: string
  salaryCurrency: string
  salaryPeriod: string
  salaryRaw: string
  techsRequired: string
  techsValuable: string
  stepTitle: string
  stepAt: string
  stepComment: string
  noteAt: string
  noteContent: string
}

const INITIAL_STATE: FormState = {
  companyName: "",
  companyWebsite: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  contactRole: "",
  contactNotes: "",
  projectName: "",
  firstContactAt: "",
  status: "open",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "EUR",
  salaryPeriod: "year",
  salaryRaw: "",
  techsRequired: "",
  techsValuable: "",
  stepTitle: "",
  stepAt: "",
  stepComment: "",
  noteAt: "",
  noteContent: "",
}

interface FeedbackState {
  type: "success" | "error"
  message: string
}

function parseDateInput(value: string): number | null {
  if (!value) return null
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return null

  return parsed
}
function parseNumberInput(value: string): number | null {
  if (!value.trim()) return null
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return null

  return numberValue
}
function parsetechs(value: string): string[] {
  return value
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean)
}
export function ProjectFormCard() {
  const [ form, setForm ] = useState<FormState>(INITIAL_STATE)
  const [ feedback, setFeedback ] = useState<FeedbackState | null>(null)
  const [ isPending, startTransition ] = useTransition()
  const queryClient = useQueryClient()

  const isSubmitDisabled = useMemo(() => {
    return !form.companyName.trim() || !form.projectName.trim() || !form.firstContactAt
  }, [ form.companyName, form.projectName, form.firstContactAt ])

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)

    const firstContactAt = parseDateInput(form.firstContactAt)
    if (firstContactAt === null) {
      setFeedback({ type: "error", message: "Introduce una fecha válida para el primer contacto." })

      return
    }
    const payload = {
      companyName: form.companyName,
      companyWebsite: form.companyWebsite.trim() || null,
      contact: form.contactName || form.contactEmail || form.contactPhone || form.contactRole || form.contactNotes
        ? {
          name: form.contactName.trim() || undefined,
          email: form.contactEmail.trim() || undefined,
          phone: form.contactPhone.trim() || undefined,
          role: form.contactRole.trim() || undefined,
          notes: form.contactNotes.trim() || undefined,
        }
        : undefined,
      projectName: form.projectName,
      firstContactAt,
      salaryMin: parseNumberInput(form.salaryMin),
      salaryMax: parseNumberInput(form.salaryMax),
      salaryCurrency: form.salaryCurrency.trim() || undefined,
      salaryPeriod: form.salaryPeriod.trim() || undefined,
      salaryRaw: form.salaryRaw.trim() || undefined,
      status: form.status.trim() || undefined,
      techsRequired: parsetechs(form.techsRequired),
      techsValuable: parsetechs(form.techsValuable),
      step:
        form.stepTitle.trim() && parseDateInput(form.stepAt) !== null
          ? {
            title: form.stepTitle.trim(),
            stepAt: parseDateInput(form.stepAt)!,
            comment: form.stepComment.trim() || undefined,
          }
          : undefined,
      note:
        form.noteContent.trim() && parseDateInput(form.noteAt) !== null
          ? {
            content: form.noteContent.trim(),
            noteAt: parseDateInput(form.noteAt)!,
          }
          : undefined,
    }

    startTransition(async () => {
      const result = await createProjectBundle(payload)
      if (result.ok) {
        setFeedback({ type: "success", message: "Proyecto guardado correctamente." })
        setForm(INITIAL_STATE)
        await queryClient.invalidateQueries({ queryKey: [ "projects" ] })
      } else {
        setFeedback({ type: "error", message: result.error })
      }
    })
  }

  return (
    <form className={styles.card} aria-labelledby="project-form-card-title" onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h2 id="project-form-card-title">Añade una posición</h2>
        <p className={styles.helperText}>
          Completa los datos clave y guarda para su seguimiento.
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
                value={form.companyName}
                onChange={handleChange("companyName")}
                required
              />
            </label>
            <label className={styles.label}>
              Sitio web
              <input
                className={styles.input}
                type="url"
                name="companyWebsite"
                placeholder="https://algorath.com"
                value={form.companyWebsite}
                onChange={handleChange("companyWebsite")}
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
                value={form.contactName}
                onChange={handleChange("contactName")}
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                name="contactEmail"
                placeholder="suleiman@algorath.com"
                value={form.contactEmail}
                onChange={handleChange("contactEmail")}
              />
            </label>
            <label className={styles.label}>
              Teléfono
              <input
                className={styles.input}
                type="tel"
                name="contactPhone"
                placeholder="+34 600 000 000"
                value={form.contactPhone}
                onChange={handleChange("contactPhone")}
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
              value={form.contactRole}
              onChange={handleChange("contactRole")}
            />
          </label>
          <label className={styles.label}>
            Notas rápidas
            <textarea
              className={styles.textarea}
              name="contactNotes"
              placeholder="Respuesta ágil, disponible de 9:00 a 17:00."
              value={form.contactNotes}
              onChange={handleChange("contactNotes")}
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
              <input
                className={styles.input}
                type="text"
                name="projectName"
                placeholder="LeoVegas"
                value={form.projectName}
                onChange={handleChange("projectName")}
                required
              />
            </label>
            <label className={styles.label}>
              Fecha primer contacto
              <input
                className={styles.input}
                type="date"
                name="firstContact"
                value={form.firstContactAt}
                onChange={handleChange("firstContactAt")}
                required
              />
            </label>
            <label className={styles.label}>
              Estado
              <select
                className={styles.select}
                name="status"
                value={form.status}
                onChange={handleChange("status")}
              >
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
                value={form.salaryMin}
                onChange={handleChange("salaryMin")}
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
                value={form.salaryMax}
                onChange={handleChange("salaryMax")}
              />
            </label>
            <label className={styles.label}>
              Periodo salarial
              <select
                className={styles.select}
                name="salaryPeriod"
                value={form.salaryPeriod}
                onChange={handleChange("salaryPeriod")}
              >
                <option value="year">Año</option>
                <option value="month">Mes</option>
                <option value="day">Día</option>
                <option value="hour">Hora</option>
              </select>
            </label>
          </div>
          <label className={styles.label}>
            Oferta textual
            <textarea
              className={styles.textarea}
              name="salaryRaw"
              placeholder="Oferta final de 42.8k con bonus tras 6 meses."
              value={form.salaryRaw}
              onChange={handleChange("salaryRaw")}
            />
          </label>
        </section>

        <section className={`${styles.section} ${styles.techs}`} aria-labelledby="project-form-techs">
          <h3 id="project-form-techs" className={styles.sectionTitle}>
            Stack requerido
          </h3>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Imprescindibles
              <input
                className={styles.input}
                type="text"
                name="techsRequired"
                placeholder="React, TypeScript, Tailwind"
                value={form.techsRequired}
                onChange={handleChange("techsRequired")}
              />
            </label>
            <label className={styles.label}>
              Valorables
              <input
                className={styles.input}
                type="text"
                name="techsValuable"
                placeholder="Storybook, Testing Library"
                value={form.techsValuable}
                onChange={handleChange("techsValuable")}
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
                value={form.stepTitle}
                onChange={handleChange("stepTitle")}
              />
            </label>
            <label className={styles.label}>
              Fecha estimada
              <input
                className={styles.input}
                type="date"
                name="nextStepDate"
                value={form.stepAt}
                onChange={handleChange("stepAt")}
              />
            </label>
            <label className={styles.label}>
              Comentario
              <textarea
                className={styles.textarea}
                name="stepComment"
                placeholder="Traer ejemplos de componentes y preparar pair-programming."
                value={form.stepComment}
                onChange={handleChange("stepComment")}
              />
            </label>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionFull} ${styles.notes}`} aria-labelledby="project-form-notes">
          <h3 id="project-form-notes" className={styles.sectionTitle}>
            Notas
          </h3>
          <div className={styles.inlineFields}>
            <label className={styles.label}>
              Fecha nota
              <input
                className={styles.input}
                type="date"
                name="noteAt"
                value={form.noteAt}
                onChange={handleChange("noteAt")}
              />
            </label>
          </div>
          <label className={styles.label}>
            Resumen
            <textarea
              className={styles.textarea}
              name="projectNotes"
              placeholder="Oferta final aceptada, incorporación prevista el 22 de septiembre."
              value={form.noteContent}
              onChange={handleChange("noteContent")}
            />
          </label>
        </section>
      </div>

      {feedback ? (
        <p
          className={`${styles.feedback} ${feedback.type === "error" ? styles.feedbackError : ""}`}
          role="status"
        >
          {feedback.message}
        </p>
      ) : null}

      <footer className={styles.footer}>
        <button type="submit" className={styles.submitButton} disabled={isPending || isSubmitDisabled}>
          {isPending ? "Guardando…" : "Guardar proyecto"}
        </button>
      </footer>
    </form>
  )
}

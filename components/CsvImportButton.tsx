"use client"

import { useRef, useState, useTransition, type ChangeEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { importProjectsFromCsv, importProjectsFromCsvText } from "@/app/actions/import"

import styles from "./CsvImportButton.module.scss"

interface FeedbackState {
  type: "success" | "error"
  message: string
}

export function CsvImportButton() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()
  const [ feedback, setFeedback ] = useState<FeedbackState | null>(null)
  const [ isPending, startTransition ] = useTransition()
  const [ isCopyingPrompt, setIsCopyingPrompt ] = useState(false)
  const [ isManualOpen, setIsManualOpen ] = useState(false)
  const [ manualCsv, setManualCsv ] = useState("")
  const [ isManualImporting, setIsManualImporting ] = useState(false)

  const handleClick = () => {
    setFeedback(null)
    inputRef.current?.click()
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [ file ] = Array.from(event.target.files ?? [])
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    startTransition(async () => {
      const result = await importProjectsFromCsv(formData)
      if (result.ok) {
        setFeedback({
          type: "success",
          message: `Se importaron ${result.data.imported} registros correctamente. Skipped: ${result.data.skipped}.`,
        })
        await queryClient.invalidateQueries({ queryKey: [ "projects" ] })
      } else {
        setFeedback({ type: "error", message: result.error })
      }
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    })
  }
  const handleCopyPrompt = async () => {
    setFeedback(null)
    setIsCopyingPrompt(true)
    try {
      const response = await fetch("/api/csv-template/prompt")
      if (!response.ok) {
        throw new Error("prompt-request-failed")
      }
      const promptText = await response.text()
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error("clipboard-not-supported")
      }
      await navigator.clipboard.writeText(promptText)
      setFeedback({ type: "success", message: "Prompt copiado al portapapeles." })
    } catch (error) {
      console.error("copy-prompt", error)
      setFeedback({
        type: "error",
        message: "No se pudo copiar el prompt. Descárgalo manualmente si lo necesitas.",
      })
    } finally {
      setIsCopyingPrompt(false)
    }
  }
  const handleToggleManual = () => {
    setIsManualOpen((previous) => !previous)
  }
  const handleManualImport = async () => {
    setFeedback(null)
    if (!manualCsv.trim()) {
      setFeedback({ type: "error", message: "Pega contenido CSV antes de importar." })

      return
    }
    setIsManualImporting(true)
    try {
      const result = await importProjectsFromCsvText(manualCsv)
      if (result.ok) {
        setFeedback({
          type: "success",
          message: `Se importaron ${result.data.imported} registros correctamente. Skipped: ${result.data.skipped}.`,
        })
        await queryClient.invalidateQueries({ queryKey: [ "projects" ] })
        setManualCsv("")
      } else {
        setFeedback({ type: "error", message: result.error })
      }
    } catch (error) {
      console.error("manual-import", error)
      setFeedback({ type: "error", message: "No se pudo procesar el CSV pegado." })
    } finally {
      setIsManualImporting(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={handleClick}
          disabled={isPending}
        >
          {isPending ? "Importando…" : "Importar CSV"}
        </button>
        <a className={styles.secondaryButton} href="/api/csv-template" download>
          Descargar plantilla
        </a>
        <button
          type="button"
          className={styles.ghostButton}
          onClick={handleCopyPrompt}
          disabled={isCopyingPrompt}
        >
          {isCopyingPrompt ? "Copiando…" : "Copiar prompt IA"}
        </button>
        <button type="button" className={styles.ghostButton} onClick={handleToggleManual}>
          {isManualOpen ? "Ocultar área de pegado" : "Pegar CSV manualmente"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        hidden
      />
      {isManualOpen ? (
        <div className={styles.manualContainer}>
          <label htmlFor="manual-csv-textarea">
            Pega aquí el contenido CSV (incluye la fila de cabeceras)
          </label>
          <textarea
            id="manual-csv-textarea"
            className={styles.textarea}
            value={manualCsv}
            onChange={(event) => setManualCsv(event.target.value)}
          />
          <div className={styles.manualActions}>
            <button
              type="button"
              className={styles.button}
              onClick={handleManualImport}
              disabled={isManualImporting}
            >
              {isManualImporting ? "Importando…" : "Importar texto"}
            </button>
            <button
              type="button"
              className={styles.ghostButton}
              onClick={() => setManualCsv("")}
              disabled={isManualImporting}
            >
              Limpiar
            </button>
          </div>
        </div>
      ) : null}
      {feedback ? (
        <p
          className={`${styles.feedback} ${
            feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, useTransition, type ChangeEvent } from "react"
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
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)
  const [ isManualOpen, setIsManualOpen ] = useState(false)
  const [ manualCsv, setManualCsv ] = useState("")
  const [ isManualImporting, setIsManualImporting ] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const manualDialogRef = useRef<HTMLDialogElement | null>(null)

  const closeMenu = () => setIsMenuOpen(false)
  const openManualDialog = () => {
    setFeedback(null)
    closeMenu()
    const dialog = manualDialogRef.current
    if (!dialog) return

    if (!dialog.open) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal()
      } else {
        dialog.setAttribute("open", "")
      }
      setIsManualOpen(true)
    }
  }
  const closeManualDialog = () => {
    const dialog = manualDialogRef.current
    if (!dialog) return

    if (dialog.open) {
      if (typeof dialog.close === "function") {
        dialog.close()
      } else {
        dialog.removeAttribute("open")
      }
    }
    setIsManualOpen(false)
  }
  const handleClick = () => {
    setFeedback(null)
    closeMenu()
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
    closeMenu()
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
    if (isManualOpen) {
      closeManualDialog()
    } else {
      openManualDialog()
    }
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
        closeManualDialog()
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
  const handleToggleMenu = () => {
    setIsMenuOpen((previous) => !previous)
  }
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [ isMenuOpen ])

  useEffect(() => {
    const dialog = manualDialogRef.current
    if (!dialog) {
      return
    }
    const handleClose = () => {
      setIsManualOpen(false)
    }
    dialog.addEventListener("close", handleClose)

    return () => {
      dialog.removeEventListener("close", handleClose)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuWrapper} ref={menuRef}>
        <button
          type="button"
          className={styles.menuToggle}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-controls="csv-import-menu"
          onClick={handleToggleMenu}
        >
          <span aria-hidden className={styles.menuIcon}>
            <span />
          </span>
          Acciones CSV
        </button>
        {isMenuOpen ? (
          <div className={styles.menuList} id="csv-import-menu" role="menu">
            <button
              type="button"
              className={`${styles.button} ${styles.menuAction}`}
              onClick={handleClick}
              disabled={isPending}
              role="menuitem"
            >
              {isPending ? "Importando…" : "Importar CSV"}
            </button>
            <a
              className={`${styles.secondaryButton} ${styles.menuAction}`}
              href="/api/csv-template"
              download
              role="menuitem"
            >
              Descargar plantilla
            </a>
            <button
              type="button"
              className={`${styles.ghostButton} ${styles.menuAction}`}
              onClick={handleCopyPrompt}
              disabled={isCopyingPrompt}
              role="menuitem"
            >
              {isCopyingPrompt ? "Copiando…" : "Copiar prompt IA"}
            </button>
            <button
              type="button"
              className={`${styles.ghostButton} ${styles.menuAction}`}
              onClick={handleToggleManual}
              role="menuitem"
            >
              {isManualOpen ? "Cerrar modal" : "Pegar CSV manualmente"}
            </button>
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        hidden
      />
      <dialog
        ref={manualDialogRef}
        className={styles.manualDialog}
        aria-labelledby="manual-import-title"
      >
        <div className={styles.manualContainer}>
          <header className={styles.manualHeader}>
            <h2 id="manual-import-title">Pegar CSV manualmente</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeManualDialog}
            >
              Cerrar
            </button>
          </header>
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
      </dialog>
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

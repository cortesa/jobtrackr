#!/usr/bin/env node
import { rmSync, existsSync, mkdirSync } from "node:fs"
import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = dirname(__dirname)
const sqliteDir = join(projectRoot, "sqlite")
const dbPath = join(sqliteDir, "jobtrackr.db")

function log(message) {
  process.stdout.write(`\u001b[36m[db:reset]\u001b[0m ${message}\n`)
}
try {
  if (!existsSync(sqliteDir)) {
    mkdirSync(sqliteDir, { recursive: true })
  }
  if (existsSync(dbPath)) {
    rmSync(dbPath)
    log(`Base de datos eliminada: ${dbPath}`)
  } else {
    log("No se encontró base de datos previa. Continuando...")
  }
} catch (error) {
  console.error("No se pudo eliminar la base de datos:", error)
  process.exit(1)
}
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
const child = spawn(npmCommand, [ "run", "db:push" ], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "development",
  },
})

child.on("exit", (code) => {
  if (code !== 0) {
    console.error("Fallo al aplicar el esquema con drizzle-kit")
    process.exit(code ?? 1)
  }
  log("Base de datos recreada correctamente.")
})

#!/usr/bin/env node
import { rmSync, existsSync, mkdirSync } from "node:fs"
import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = dirname(__dirname)
const sqliteDir = join(projectRoot, "sqlite")
const DrizzleDir = join(projectRoot, "drizzle")
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
  if (existsSync(DrizzleDir)) {
    rmSync(DrizzleDir, { recursive: true, force: true })
    log(`Drizzle borrado: ${DrizzleDir}`)
    mkdirSync(DrizzleDir, { recursive: true })
  } else {
    mkdirSync(DrizzleDir, { recursive: true })
  }
} catch (error) {
  console.error("No se pudo eliminar la base de datos:", error)
  process.exit(1)
}
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
const generate = spawn(npmCommand, [ "run", "db:generate",  ], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "development",
  },
})

generate.on("exit", (code) => {
  if (code !== 0) {
    console.error("Fallo al aplicar el esquema con drizzle-kit")
    process.exit(code ?? 1)
  }
  const migrate = spawn(npmCommand, [ "run", "db:migrate" ], {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  })
  migrate.on("exit", (code) => {
    if (code !== 0) {
      console.error("Fallo al aplicar el esquema con drizzle-kit")
      process.exit(code ?? 1)
    }
  })
  log("Base de datos recreada correctamente.")
})

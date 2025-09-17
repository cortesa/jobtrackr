export interface CsvColumnDefinition {
  key: string
  required: boolean
  description: string
  format?: string
  example?: string
}

export const csvColumns: CsvColumnDefinition[] = [
  {
    key: "company_name",
    required: true,
    description: "Nombre de la empresa",
  },
  {
    key: "company_website",
    required: false,
    description: "URL de la empresa con protocolo",
    format: "https://ejemplo.com",
  },
  {
    key: "contact_name",
    required: false,
    description: "Nombre completo de la persona de contacto",
  },
  {
    key: "contact_email",
    required: false,
    description: "Email válido del contacto",
    format: "persona@empresa.com",
  },
  {
    key: "contact_phone",
    required: false,
    description: "Teléfono con prefijo internacional",
    format: "+34 600 123 456",
  },
  {
    key: "contact_role",
    required: false,
    description: "Rol o puesto del contacto",
  },
  {
    key: "contact_notes",
    required: false,
    description: "Notas breves sobre el contacto",
  },
  {
    key: "project_name",
    required: true,
    description: "Nombre del proyecto o puesto",
  },
  {
    key: "first_contact_at",
    required: true,
    description: "Fecha del primer contacto",
    format: "YYYY-MM-DD o timestamp en milisegundos",
  },
  {
    key: "salary_min",
    required: false,
    description: "Salario mínimo ofertado como número entero",
    example: "42000",
  },
  {
    key: "salary_max",
    required: false,
    description: "Salario máximo ofertado como número entero",
    example: "55000",
  },
  {
    key: "salary_currency",
    required: false,
    description: "Moneda en formato ISO de tres letras",
    example: "EUR",
  },
  {
    key: "salary_period",
    required: false,
    description: "Periodo aplicado al salario",
    example: "year | month | day | hour",
  },
  {
    key: "salary_raw",
    required: false,
    description: "Detalle textual de la oferta salarial",
  },
  {
    key: "status",
    required: false,
    description: "Estado del proceso",
    example: "open | hold | won | lost",
  },
  {
    key: "skills_required",
    required: false,
    description: "Lista de skills imprescindibles separadas por comas",
    example: "React, TypeScript, GraphQL",
  },
  {
    key: "skills_valuable",
    required: false,
    description: "Lista de skills valorables separadas por comas",
    example: "Storybook, Cypress",
  },
  {
    key: "step_title",
    required: false,
    description: "Título del siguiente paso del proceso",
  },
  {
    key: "step_at",
    required: false,
    description: "Fecha del paso (ISO o timestamp en ms)",
  },
  {
    key: "step_comment",
    required: false,
    description: "Notas sobre el paso",
  },
  {
    key: "note_at",
    required: false,
    description: "Fecha de la nota (ISO o timestamp en ms)",
  },
  {
    key: "note_content",
    required: false,
    description: "Contenido de la nota",
  },
]

export const CSV_HEADERS = csvColumns.map((column) => column.key)
export const CSV_REQUIRED_COLUMN_KEYS = csvColumns.filter((column) => column.required).map((column) => column.key)
export const CSV_OPTIONAL_COLUMN_KEYS = csvColumns.filter((column) => !column.required).map((column) => column.key)
export const CSV_REQUIRED_COLUMN_SET = new Set(CSV_REQUIRED_COLUMN_KEYS)
export const CSV_OPTIONAL_COLUMN_SET = new Set(CSV_OPTIONAL_COLUMN_KEYS)

export function buildCsvAiPrompt(): string {
  const headerLine = CSV_HEADERS.join(",")
  const requiredList = csvColumns
    .filter((column) => column.required)
    .map((column) => `- ${column.key}: ${column.description}`)
    .join("\n")
  const optionalList = csvColumns
    .filter((column) => !column.required)
    .map((column) => {
      const extra = column.example ? ` (ej.: ${column.example})` : column.format ? ` (${column.format})` : ""

      return `- ${column.key}: ${column.description}${extra}`
    })
    .join("\n")

  return `Quiero que actúes como asistente experto en reclutamiento técnico y completes un CSV de oportunidades laborales siguiendo estas reglas estrictas:\n\n` +
    `- Usa la primera línea exactamente así: ${headerLine}.\n` +
    `- Genera una fila por proyecto respetando estas columnas obligatorias:\n${requiredList}\n\n` +
    `- Los campos opcionales se rellenan si hay información disponible:\n${optionalList}\n\n` +
    `Formato adicional:\n` +
    `- Usa coma como separador. No añadas columnas ni cabeceras extra.\n` +
    `- Las listas (skills) se separan por comas y no pueden repetir valores.\n` +
    `- Las fechas pueden ir en formato ISO (YYYY-MM-DD) o como timestamp epoch en ms.\n` +
    `- Deja la celda vacía si no conoces un dato (sin “N/A”).\n` +
    `- No repitas el mismo project_name para una company_name; cada fila debe ser única.\n` +
    `- Revisa la coherencia de fechas (los pasos y notas deben ser posteriores al primer contacto).\n\n` +
    `Devuelve solo el CSV listo para importar, comenzando por la línea de cabeceras indicada.`
}

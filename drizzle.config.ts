import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./db-js/schema.js",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite/jobtrackr.db",
  },
  verbose: true,
  strict: true,
})

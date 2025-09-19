import path from "node:path"
import { buildSchema } from "drizzle-graphql"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

import * as dbSchema from "./schema.js"

const databasePath = path.join(process.cwd(), "sqlite", "jobtrackr.db")

const sqlite = new Database(databasePath)

const db = drizzle({ client: sqlite, schema: dbSchema })

const { schema } = buildSchema(db)
const server = new ApolloServer({ schema })
const { url } = await startStandaloneServer(server)

console.log("---------")
console.log(`🚀 Server ready at ${url}`)
console.log("---------")

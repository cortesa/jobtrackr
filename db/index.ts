import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const defaultDatabasePath = path.join(process.cwd(), "sqlite", "jobtrackr.db");

declare global {
  // eslint-disable-next-line no-var
  var __jobtrackrDb: Database | undefined;
}

function getDatabaseInstance() {
  if (!global.__jobtrackrDb) {
    const databasePath = process.env.DATABASE_URL ?? defaultDatabasePath;
    global.__jobtrackrDb = new Database(databasePath);
  }

  return global.__jobtrackrDb;
}

const sqlite = getDatabaseInstance();

export const db = drizzle(sqlite, { schema });
export type DatabaseClient = typeof db;
export * from "./schema";

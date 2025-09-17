CREATE TABLE IF NOT EXISTS "company" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "website" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS "contact" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "company_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "role" TEXT,
  "notes" TEXT,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "project" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "company_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "first_contact_at" INTEGER NOT NULL,
  "salary_min" INTEGER,
  "salary_max" INTEGER,
  "salary_currency" TEXT DEFAULT 'EUR',
  "salary_period" TEXT DEFAULT 'year',
  "salary_raw" TEXT,
  "status" TEXT DEFAULT 'open',
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  "updated_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "project_contact" (
  "project_id" INTEGER NOT NULL,
  "contact_id" INTEGER NOT NULL,
  "rel_role" TEXT,
  PRIMARY KEY ("project_id", "contact_id"),
  FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE,
  FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "skill" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "project_skill" (
  "project_id" INTEGER NOT NULL,
  "skill_id" INTEGER NOT NULL,
  "kind" TEXT NOT NULL,
  PRIMARY KEY ("project_id", "skill_id", "kind"),
  CHECK ("kind" IN ('required', 'valuable')),
  FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE,
  FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "project_step" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "project_id" INTEGER NOT NULL,
  "step_at" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "comment" TEXT,
  "sort_order" INTEGER,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "project_note" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "project_id" INTEGER NOT NULL,
  "note_at" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE
);

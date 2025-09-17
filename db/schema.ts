import { sql } from "drizzle-orm"
import { relations } from "drizzle-orm"
import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"

const timestampNow = sql`(unixepoch() * 1000)`

export const companies = sqliteTable("company", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  website: text("website"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(timestampNow),
})

export const contacts = sqliteTable("contact", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(timestampNow),
})

export const projects = sqliteTable("project", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  firstContactAt: integer("first_contact_at", { mode: "number" }).notNull(),
  salaryMin: integer("salary_min", { mode: "number" }),
  salaryMax: integer("salary_max", { mode: "number" }),
  salaryCurrency: text("salary_currency").default("EUR"),
  salaryPeriod: text("salary_period").default("year"),
  salaryRaw: text("salary_raw"),
  status: text("status").default("open"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(timestampNow),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .default(timestampNow),
})

export const projectContacts = sqliteTable(
  "project_contact",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    contactId: integer("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    relRole: text("rel_role"),
  },
  (table) => ({
    pk: primaryKey({ columns: [ table.projectId, table.contactId ] }),
  }),
)

export const skills = sqliteTable("skill", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
})

export const projectSkills = sqliteTable(
  "project_skill",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [ table.projectId, table.skillId, table.kind ] }),
    kindCheck: check(
      "project_skill_kind_check",
      sql`${table.kind} in ('required', 'valuable')`,
    ),
  }),
)

export const projectSteps = sqliteTable("project_step", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  stepAt: integer("step_at", { mode: "number" }).notNull(),
  title: text("title").notNull(),
  comment: text("comment"),
  sortOrder: integer("sort_order", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(timestampNow),
})

export const projectNotes = sqliteTable("project_note", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  noteAt: integer("note_at", { mode: "number" }).notNull(),
  content: text("content").notNull(),
})

export const companiesRelations = relations(companies, ({ many }) => ({
  contacts: many(contacts),
  projects: many(projects),
}))

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  company: one(companies, {
    fields: [ contacts.companyId ],
    references: [ companies.id ],
  }),
  projectLinks: many(projectContacts),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, {
    fields: [ projects.companyId ],
    references: [ companies.id ],
  }),
  projectContacts: many(projectContacts),
  projectSkills: many(projectSkills),
  steps: many(projectSteps),
  notes: many(projectNotes),
}))

export const projectContactsRelations = relations(
  projectContacts,
  ({ one }) => ({
    project: one(projects, {
      fields: [ projectContacts.projectId ],
      references: [ projects.id ],
    }),
    contact: one(contacts, {
      fields: [ projectContacts.contactId ],
      references: [ contacts.id ],
    }),
  }),
)

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
  project: one(projects, {
    fields: [ projectSkills.projectId ],
    references: [ projects.id ],
  }),
  skill: one(skills, {
    fields: [ projectSkills.skillId ],
    references: [ skills.id ],
  }),
}))

export const projectStepsRelations = relations(projectSteps, ({ one }) => ({
  project: one(projects, {
    fields: [ projectSteps.projectId ],
    references: [ projects.id ],
  }),
}))

export const projectNotesRelations = relations(projectNotes, ({ one }) => ({
  project: one(projects, {
    fields: [ projectNotes.projectId ],
    references: [ projects.id ],
  }),
}))

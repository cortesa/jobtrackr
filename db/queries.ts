import { and, asc, desc, eq, inArray } from "drizzle-orm"
import { db, companies, contacts, projectContacts, projectNotes, projectTechs, projects, projectSteps, techs } from "./index"

export interface ProjectDetails {
  id: number;
  name: string;
  status: string | null;
  firstContactAt: number;
  salary: {
    min?: number | null;
    max?: number | null;
    currency: string | null;
    period: string | null;
    raw?: string | null;
  };
  createdAt: number;
  updatedAt: number;
  company: {
    id: number;
    name: string;
    website: string | null;
  };
  contacts: Array<{
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    role: string | null;
    notes: string | null;
  }>;
  techs: {
    required: string[];
    valuable: string[];
  };
  steps: Array<{
    id: number;
    title: string;
    comment: string | null;
    stepAt: number;
    sortOrder: number | null;
  }>;
  notes: Array<{
    id: number;
    content: string;
    noteAt: number;
  }>;
}

export async function getProjectsWithDetails(): Promise<ProjectDetails[]> {
  const baseProjects = await db
    .select()
    .from(projects)
    .leftJoin(companies, eq(projects.companyId, companies.id))
    .orderBy(desc(projects.createdAt))

  const projectIds = baseProjects.map((entry) => entry.project.id)
  if (projectIds.length === 0) {
    return []
  }
  const [ contactsByProject, techsByProject, stepsByProject, notesByProject ] = await Promise.all([
    db
      .select({
        projectId: projectContacts.projectId,
        contact: contacts,
      })
      .from(projectContacts)
      .innerJoin(contacts, eq(projectContacts.contactId, contacts.id))
      .where(inArray(projectContacts.projectId, projectIds)),
    db
      .select({
        projectId: projectTechs.projectId,
        kind: projectTechs.kind,
        tech: techs,
      })
      .from(projectTechs)
      .innerJoin(techs, eq(projectTechs.techId, techs.id))
      .where(inArray(projectTechs.projectId, projectIds)),
    db
      .select()
      .from(projectSteps)
      .where(inArray(projectSteps.projectId, projectIds))
      .orderBy(
        asc(projectSteps.sortOrder),
        asc(projectSteps.stepAt),
        asc(projectSteps.id),
      ),
    db
      .select()
      .from(projectNotes)
      .where(inArray(projectNotes.projectId, projectIds))
      .orderBy(desc(projectNotes.noteAt), desc(projectNotes.id)),
  ])

  return baseProjects.map(({ project, company }) => {
    const contactsForProject = contactsByProject
      .filter((entry) => entry.projectId === project.id)
      .map((entry) => entry.contact)

    const techsForProject = techsByProject.filter((entry) => entry.projectId === project.id)
    const requiredTechs = techsForProject
      .filter((entry) => entry.kind === "required")
      .map((entry) => entry.tech.name)
      .sort((a, b) => a.localeCompare(b))
    const valuableTechs = techsForProject
      .filter((entry) => entry.kind === "valuable")
      .map((entry) => entry.tech.name)
      .sort((a, b) => a.localeCompare(b))

    const stepsForProject = stepsByProject
      .filter((entry) => entry.projectId === project.id)
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        comment: entry.comment,
        stepAt: entry.stepAt,
        sortOrder: entry.sortOrder,
      }))

    const notesForProject = notesByProject
      .filter((entry) => entry.projectId === project.id)
      .map((entry) => ({
        id: entry.id,
        content: entry.content,
        noteAt: entry.noteAt,
      }))

    return {
      id: project.id,
      name: project.name,
      status: project.status,
      firstContactAt: project.firstContactAt,
      salary: {
        min: project.salaryMin,
        max: project.salaryMax,
        currency: project.salaryCurrency,
        period: project.salaryPeriod,
        raw: project.salaryRaw,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      company: {
        id: company?.id ?? project.companyId,
        name: company?.name ?? "Empresa sin nombre",
        website: company?.website ?? null,
      },
      contacts: contactsForProject.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        notes: contact.notes,
      })),
      techs: {
        required: requiredTechs,
        valuable: valuableTechs,
      },
      steps: stepsForProject,
      notes: notesForProject,
    } satisfies ProjectDetails
  })
}
export async function getProjectDetailsById(projectId: number): Promise<ProjectDetails | null> {
  const baseProject = await db
    .select()
    .from(projects)
    .leftJoin(companies, eq(projects.companyId, companies.id))
    .where(eq(projects.id, projectId))
    .limit(1)

  if (!baseProject.length) {
    return null
  }
  const { project, company } = baseProject[0]

  const [ contactsForProject, techsForProject, stepsForProject, notesForProject ] = await Promise.all([
    db
      .select({
        contact: contacts,
      })
      .from(projectContacts)
      .innerJoin(contacts, eq(projectContacts.contactId, contacts.id))
      .where(eq(projectContacts.projectId, projectId)),
    db
      .select({
        kind: projectTechs.kind,
        tech: techs,
      })
      .from(projectTechs)
      .innerJoin(techs, eq(projectTechs.techId, techs.id))
      .where(eq(projectTechs.projectId, projectId)),
    db
      .select()
      .from(projectSteps)
      .where(eq(projectSteps.projectId, projectId))
      .orderBy(
        asc(projectSteps.sortOrder),
        asc(projectSteps.stepAt),
        asc(projectSteps.id),
      ),
    db
      .select()
      .from(projectNotes)
      .where(eq(projectNotes.projectId, projectId))
      .orderBy(desc(projectNotes.noteAt), desc(projectNotes.id)),
  ])

  const requiredTechs = techsForProject
    .filter((entry) => entry.kind === "required")
    .map((entry) => entry.tech.name)
    .sort((a, b) => a.localeCompare(b))
  const valuableTechs = techsForProject
    .filter((entry) => entry.kind === "valuable")
    .map((entry) => entry.tech.name)
    .sort((a, b) => a.localeCompare(b))

  const detail: ProjectDetails = {
    id: project.id,
    name: project.name,
    status: project.status,
    firstContactAt: project.firstContactAt,
    salary: {
      min: project.salaryMin,
      max: project.salaryMax,
      currency: project.salaryCurrency,
      period: project.salaryPeriod,
      raw: project.salaryRaw,
    },
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    company: {
      id: company?.id ?? project.companyId,
      name: company?.name ?? "Empresa sin nombre",
      website: company?.website ?? null,
    },
    contacts: contactsForProject.map((entry) => ({
      id: entry.contact.id,
      name: entry.contact.name,
      email: entry.contact.email,
      phone: entry.contact.phone,
      role: entry.contact.role,
      notes: entry.contact.notes,
    })),
    techs: {
      required: requiredTechs,
      valuable: valuableTechs,
    },
    steps: stepsForProject.map((entry) => ({
      id: entry.id,
      title: entry.title,
      comment: entry.comment,
      stepAt: entry.stepAt,
      sortOrder: entry.sortOrder,
    })),
    notes: notesForProject.map((entry) => ({
      id: entry.id,
      content: entry.content,
      noteAt: entry.noteAt,
    })),
  }

  return detail
}
interface CreateTechInput {
  name: string;
}

export async function findOrCreateTech({ name }: CreateTechInput) {
  const trimmedName = name.trim()
  if (!trimmedName) {
    throw new Error("El nombre de la tecnología es obligatorio")
  }
  const existingTech = await db.query.techs.findFirst({
    where: eq(techs.name, trimmedName),
  })

  if (existingTech) {
    return existingTech
  }
  const [ inserted ] = await db.insert(techs).values({ name: trimmedName }).returning()

  return inserted
}
export async function linkTechToProject({
  projectId,
  techId,
  kind,
}: {
  projectId: number;
  techId: number;
  kind: "required" | "valuable";
}) {
  await db
    .insert(projectTechs)
    .values({ projectId, techId, kind })
    .onConflictDoNothing({
      target: [ projectTechs.projectId, projectTechs.techId, projectTechs.kind ],
    })
}
export async function projectExists(projectId: number) {
  const project = await db.query.projects.findFirst({
    columns: { id: true },
    where: eq(projects.id, projectId),
  })

  return Boolean(project)
}
export async function contactBelongsToCompany({
  contactId,
  companyId,
}: {
  contactId: number;
  companyId: number;
}) {
  const contact = await db.query.contacts.findFirst({
    columns: { id: true },
    where: and(eq(contacts.id, contactId), eq(contacts.companyId, companyId)),
  })

  return Boolean(contact)
}

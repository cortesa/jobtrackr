import { render, screen } from "@testing-library/react";

import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectDetails } from "@/db/queries";

const sampleProject: ProjectDetails = {
  id: 1,
  name: "Frontend React",
  status: "open",
  firstContactAt: Date.UTC(2024, 5, 12),
  salary: {
    min: 40000,
    max: 48000,
    currency: "EUR",
    period: "year",
    raw: "40k-48k € bruto/año",
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  company: {
    id: 10,
    name: "Tech Corp",
    website: "https://techcorp.example",
  },
  contacts: [
    {
      id: 5,
      name: "Ana García",
      email: "ana@techcorp.example",
      phone: "+34 600 000 001",
      role: "HR",
      notes: "Respuesta rápida",
    },
  ],
  skills: {
    required: ["React", "TypeScript"],
    valuable: ["Storybook"],
  },
  steps: [
    {
      id: 20,
      title: "Entrevista técnica",
      comment: "Pair programming de 1h",
      stepAt: Date.UTC(2024, 5, 20),
      sortOrder: 1,
    },
  ],
  notes: [
    {
      id: 30,
      content: "Enviar ejercicio antes del viernes",
      noteAt: Date.UTC(2024, 5, 15),
    },
  ],
};

describe("ProjectCard", () => {
  it("muestra los datos principales del proyecto", () => {
    render(<ProjectCard project={sampleProject} />);

    expect(screen.getByText(/Tech Corp/)).toBeInTheDocument();
    expect(screen.getByText(/Frontend React/)).toBeInTheDocument();
    expect(screen.getByText(/40k-48k € bruto\/año/)).toBeInTheDocument();
    expect(screen.getByText(/Ana García/)).toBeInTheDocument();
    expect(screen.getByText(/Entrevista técnica/)).toBeInTheDocument();
    expect(screen.getByText(/Storybook/)).toBeInTheDocument();
  });
});

import { NextResponse } from "next/server";

import { getProjectsWithDetails } from "@/db/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const projects = await getProjectsWithDetails();
  return NextResponse.json({ projects });
}

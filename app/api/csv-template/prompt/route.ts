import { NextResponse } from "next/server"

import { buildCsvAiPrompt } from "@/lib/csvTemplate"

export async function GET() {
  const prompt = buildCsvAiPrompt()

  return new NextResponse(prompt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=jobtrackr_csv_prompt.txt",
      "Cache-Control": "no-store",
    },
  })
}

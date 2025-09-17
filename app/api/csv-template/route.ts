import { NextResponse } from "next/server"

import { CSV_HEADERS } from "@/lib/csvTemplate"

export async function GET() {
  const content = `${CSV_HEADERS.join(",")}\n`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=jobtrackr_template.csv",
      "Cache-Control": "no-store",
    },
  })
}

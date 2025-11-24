import { type NextRequest, NextResponse } from "next/server"

// Mock OSHA 300 incidents
const incidents = []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get("year") || new Date().getFullYear().toString()

  const filteredIncidents = incidents.filter((i) => i.date.startsWith(year))

  return NextResponse.json({ incidents: filteredIncidents })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { employeeId, date, type, description, daysAway, daysRestricted, recordable } = body

  const newIncident = {
    id: `OSHA-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, "0")}`,
    employeeId,
    date,
    type,
    description,
    daysAway,
    daysRestricted,
    recordable,
    status: "Open",
    createdAt: new Date().toISOString(),
  }

  incidents.push(newIncident)

  // In production, this would:
  // 1. Validate incident details
  // 2. Calculate TRIR, DART rates
  // 3. Send notifications to safety team
  // 4. Update OSHA 300 log
  // 5. Trigger investigation workflow if severe

  return NextResponse.json({ incident: newIncident }, { status: 201 })
}

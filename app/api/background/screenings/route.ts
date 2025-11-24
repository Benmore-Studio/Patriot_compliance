import { type NextRequest, NextResponse } from "next/server"

// Mock data - in production, this would connect to your database
const screenings = [
  {
    id: "BG-2025-001",
    employeeId: "EMP-001",
    type: "Pre-Employment",
    status: "clear",
    orderedDate: "2025-01-15",
    completedDate: "2025-01-18",
    components: ["Criminal (County)", "Criminal (State)", "Criminal (Federal)", "MVR", "Employment Verification"],
    vendor: "TazWorks",
    vendorOrderId: "TW-12345",
    adjudicationScore: 0,
    findings: [],
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const employeeId = searchParams.get("employeeId")
  const status = searchParams.get("status")

  let filteredScreenings = screenings

  if (employeeId) {
    filteredScreenings = filteredScreenings.filter((s) => s.employeeId === employeeId)
  }

  if (status) {
    filteredScreenings = filteredScreenings.filter((s) => s.status === status)
  }

  return NextResponse.json({ screenings: filteredScreenings })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { employeeId, type, packageId, notes } = body

  // In production, this would:
  // 1. Validate employee exists
  // 2. Call TazWorks API to submit order
  // 3. Store order in database
  // 4. Return order confirmation

  const newScreening = {
    id: `BG-2025-${String(screenings.length + 1).padStart(3, "0")}`,
    employeeId,
    type,
    status: "pending",
    orderedDate: new Date().toISOString().split("T")[0],
    completedDate: null,
    components: [], // Would be populated based on packageId
    vendor: "TazWorks",
    vendorOrderId: `TW-${Math.floor(Math.random() * 100000)}`,
    adjudicationScore: null,
    findings: [],
    notes,
  }

  screenings.push(newScreening)

  return NextResponse.json({ screening: newScreening }, { status: 201 })
}

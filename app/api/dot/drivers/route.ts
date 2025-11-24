import { type NextRequest, NextResponse } from "next/server"

// Mock data - in production, this would connect to your database
const drivers = [
  {
    id: "D-001",
    employeeId: "EMP-001",
    name: "John Smith",
    license: "CDL-A",
    licenseNumber: "CDL123456",
    licenseState: "TX",
    licenseExpiration: "2026-03-15",
    medicalCertExpiration: "2025-06-15",
    medicalCertificationType: "NI",
    dqFileComplete: true,
    clearinghouseStatus: "clear",
    lastClearinghouseQuery: "2025-01-01",
    hosComplianceScore: 98,
    status: "compliant",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  let filteredDrivers = drivers

  if (status) {
    filteredDrivers = filteredDrivers.filter((d) => d.status === status)
  }

  return NextResponse.json({ drivers: filteredDrivers })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { employeeId, licenseNumber, licenseState, licenseExpiration, medicalCertExpiration } = body

  // In production, this would:
  // 1. Validate employee exists
  // 2. Create DQ file structure
  // 3. Store driver record in database
  // 4. Trigger clearinghouse pre-employment query

  const newDriver = {
    id: `D-${String(drivers.length + 1).padStart(3, "0")}`,
    employeeId,
    licenseNumber,
    licenseState,
    licenseExpiration,
    medicalCertExpiration,
    dqFileComplete: false,
    clearinghouseStatus: "pending",
    status: "pending",
  }

  drivers.push(newDriver)

  return NextResponse.json({ driver: newDriver }, { status: 201 })
}

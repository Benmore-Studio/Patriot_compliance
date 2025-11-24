import { type NextRequest, NextResponse } from "next/server"

// Mock surveillance programs
const programs = [
  {
    id: "SURV-001",
    name: "Hearing Conservation",
    regulation: "29 CFR 1910.95",
    frequency: "Annual",
    employees: 45,
    lastCompleted: "2024-12-15",
    nextDue: "2025-12-15",
    compliance: 100,
  },
]

export async function GET() {
  return NextResponse.json({ programs })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, regulation, frequency, employees } = body

  const newProgram = {
    id: `SURV-${String(programs.length + 1).padStart(3, "0")}`,
    name,
    regulation,
    frequency,
    employees,
    lastCompleted: null,
    nextDue: null,
    compliance: 0,
  }

  programs.push(newProgram)

  return NextResponse.json({ program: newProgram }, { status: 201 })
}

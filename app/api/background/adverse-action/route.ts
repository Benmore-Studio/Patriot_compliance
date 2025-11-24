import { type NextRequest, NextResponse } from "next/server"

// Mock adverse actions
const adverseActions = []

export async function GET() {
  return NextResponse.json({ adverseActions })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { screeningId, employeeId, reason } = body

  const newAdverseAction = {
    id: `AA-2025-${String(adverseActions.length + 1).padStart(3, "0")}`,
    screeningId,
    employeeId,
    stage: "pre-adverse-sent",
    preAdverseSentDate: new Date().toISOString().split("T")[0],
    waitingPeriodEnds: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    finalAdverseSentDate: null,
    reason,
    status: "active",
  }

  adverseActions.push(newAdverseAction)

  // In production, this would:
  // 1. Generate pre-adverse action notice PDF
  // 2. Send email/mail to candidate
  // 3. Schedule reminder for final notice
  // 4. Log in audit trail

  return NextResponse.json({ adverseAction: newAdverseAction }, { status: 201 })
}

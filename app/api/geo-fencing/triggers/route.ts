import { NextResponse } from "next/server"

export async function GET() {
  // Fetch all compliance triggers
  const triggers = [
    {
      id: "1",
      zoneId: "california",
      zoneName: "California",
      event: "employee_enters",
      action: "require_compliance",
      requirements: ["CA Background Check (10yr)"],
      status: "active",
    },
  ]

  return NextResponse.json({ triggers })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Create new compliance trigger
  // INSERT INTO compliance_triggers (zone_id, event, action, requirements) VALUES (...)

  return NextResponse.json({
    success: true,
    trigger: { id: "new-trigger-id", ...body },
  })
}

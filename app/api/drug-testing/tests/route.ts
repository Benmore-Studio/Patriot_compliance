import { NextResponse } from "next/server"

// GET /api/drug-testing/tests - List tests with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"
    const type = searchParams.get("type") || "all"

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100" },
        { status: 400 },
      )
    }

    // Mock data - replace with actual database query
    const mockTests = [
      {
        id: "DT-2025-001",
        employeeId: "EMP-001",
        type: "Random",
        testType: "DOT 5-Panel",
        date: "2025-01-15",
        status: "negative",
        vendor: "CRL",
      },
    ]

    return NextResponse.json({
      data: mockTests,
      pagination: {
        page,
        limit,
        total: mockTests.length,
        totalPages: Math.ceil(mockTests.length / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching drug tests:", error)
    return NextResponse.json({ error: "Failed to fetch drug tests. Please try again later." }, { status: 500 })
  }
}

// POST /api/drug-testing/tests - Schedule new test
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const requiredFields = ["employeeId", "type", "testType", "scheduledDate"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const scheduledDate = new Date(body.scheduledDate)
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format for scheduledDate" }, { status: 400 })
    }

    const validTestTypes = [
      "Pre-employment",
      "Random",
      "Post-accident",
      "Reasonable suspicion",
      "Return-to-duty",
      "Follow-up",
    ]
    if (!validTestTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid test type. Must be one of: ${validTestTypes.join(", ")}` },
        { status: 400 },
      )
    }

    // Mock response - replace with actual database insert and vendor API call
    const newTest = {
      id: `DT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...body,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newTest, { status: 201 })
  } catch (error) {
    console.error("[v0] Error scheduling drug test:", error)
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to schedule drug test. Please try again later." }, { status: 500 })
  }
}

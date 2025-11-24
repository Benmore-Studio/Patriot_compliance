import { NextResponse } from "next/server"

// GET /api/employees - List with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100" },
        { status: 400 },
      )
    }

    // Mock data - replace with actual database query
    const mockEmployees = [
      {
        id: "EMP-001",
        name: "John Smith",
        role: "CDL Driver",
        department: "Transportation",
        location: "Houston, TX",
        status: "active",
        compliance: "compliant",
      },
      // Add more mock data as needed
    ]

    return NextResponse.json({
      data: mockEmployees,
      pagination: {
        page,
        limit,
        total: mockEmployees.length,
        totalPages: Math.ceil(mockEmployees.length / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees. Please try again later." }, { status: 500 })
  }
}

// POST /api/employees - Create single employee
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "role", "department", "location"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Mock response - replace with actual database insert
    const newEmployee = {
      id: `EMP-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...body,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newEmployee, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating employee:", error)
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create employee. Please try again later." }, { status: 500 })
  }
}

import { NextResponse } from "next/server"

// GET /api/employees/:id - Employee 360°
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock data - replace with actual database query
  const employee = {
    id,
    name: "John Smith",
    role: "CDL Driver",
    department: "Transportation",
    location: "Houston, TX",
    hireDate: "2020-03-15",
    dob: "1985-06-20",
    email: "john.smith@company.com",
    phone: "(555) 123-4567",
    status: "active",
    compliance: {
      drugTesting: "compliant",
      background: "compliant",
      training: "at-risk",
      health: "compliant",
    },
  }

  return NextResponse.json(employee)
}

// PATCH /api/employees/:id - Update employee
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // Mock response - replace with actual database update
  const updatedEmployee = {
    id,
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(updatedEmployee)
}

// DELETE /api/employees/:id - Soft delete
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock response - replace with actual soft delete (set status to 'inactive')
  return NextResponse.json({ success: true, message: `Employee ${id} has been deactivated` })
}

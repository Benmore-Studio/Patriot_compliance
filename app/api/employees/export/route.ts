import { NextResponse } from "next/server"

// POST /api/employees/export - Generate shareable link
export async function POST(request: Request) {
  const body = await request.json()
  const { employeeIds, password } = body

  if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
    return NextResponse.json({ error: "No employee IDs provided" }, { status: 400 })
  }

  // Generate a secure token for the export link
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  // Mock response - replace with actual export generation and storage
  const exportLink = {
    token,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/exports/${token}`,
    employeeCount: employeeIds.length,
    passwordProtected: !!password,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(exportLink)
}

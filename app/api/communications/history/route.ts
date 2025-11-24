import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Mock data - replace with actual database query
    const communications = [
      {
        id: "comm_1",
        subject: "Critical: Billing Account Locked",
        recipient: "FastHaul Transport",
        channels: ["email", "sms"],
        priority: "critical",
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        deliveryStats: {
          total: 1,
          delivered: 1,
          read: 1,
          failed: 0,
        },
      },
      {
        id: "comm_2",
        subject: "Reminder: DOT Physicals Expiring Soon",
        recipient: "Premier Freight Inc.",
        channels: ["email", "push"],
        priority: "high",
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        deliveryStats: {
          total: 1,
          delivered: 1,
          read: 0,
          failed: 0,
        },
      },
    ]

    return NextResponse.json({
      communications,
      total: communications.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[v0] Error fetching communication history:", error)
    return NextResponse.json({ error: "Failed to fetch communication history" }, { status: 500 })
  }
}

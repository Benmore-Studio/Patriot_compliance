import { type NextRequest, NextResponse } from "next/server"
import { verifyPassword, isLinkExpired } from "@/lib/share/utils"
import type { AccessShareLinkRequest, ShareableLink, ShareLinkAccess } from "@/types/share"

// POST /api/share/:token - Validate password and access shared data
export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const body: AccessShareLinkRequest = await request.json()

    // TODO: Fetch shareable link from database
    // const shareableLink = await db.shareableLinks.findByToken(token)

    // Mock shareable link for demonstration
    const shareableLink: ShareableLink = {
      id: "share_123",
      token,
      resourceType: "employees",
      resourceId: ["emp_1", "emp_2"],
      createdBy: "user_123",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      passwordHash: "mock-hash",
      oneTimeUse: false,
      accessCount: 0,
      watermark: true,
    }

    if (!shareableLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Check if link is expired
    if (isLinkExpired(shareableLink.expiresAt)) {
      return NextResponse.json({ error: "Link has expired" }, { status: 403 })
    }

    // Check if one-time use link has been accessed
    if (shareableLink.oneTimeUse && shareableLink.accessCount > 0) {
      return NextResponse.json({ error: "Link has already been used" }, { status: 403 })
    }

    // Verify password
    if (!verifyPassword(body.password, shareableLink.passwordHash)) {
      // Log failed access attempt
      await logAccess(shareableLink.id, request, false)

      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Log successful access
    await logAccess(shareableLink.id, request, true)

    // Increment access count
    // await db.shareableLinks.incrementAccessCount(shareableLink.id)

    // Fetch the actual resource data based on resourceType and resourceId
    const resourceData = await fetchResourceData(shareableLink)

    return NextResponse.json({
      success: true,
      data: resourceData,
      metadata: shareableLink.metadata,
      watermark: shareableLink.watermark,
    })
  } catch (error) {
    console.error("[v0] Error accessing shareable link:", error)
    return NextResponse.json({ error: "Failed to access shareable link" }, { status: 500 })
  }
}

// DELETE /api/share/:token - Revoke a shareable link
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    // TODO: Delete from database
    // await db.shareableLinks.delete(token)

    return NextResponse.json({
      success: true,
      message: "Link revoked successfully",
    })
  } catch (error) {
    console.error("[v0] Error revoking shareable link:", error)
    return NextResponse.json({ error: "Failed to revoke shareable link" }, { status: 500 })
  }
}

async function logAccess(linkId: string, request: NextRequest, success: boolean) {
  const access: ShareLinkAccess = {
    id: `access_${Date.now()}`,
    linkId,
    accessedAt: new Date().toISOString(),
    ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
    success,
  }

  // TODO: Store in database
  // await db.shareLinkAccess.create(access)

  console.log("[v0] Share link access logged:", access)
}

async function fetchResourceData(link: ShareableLink) {
  // Mock data - replace with actual database queries
  switch (link.resourceType) {
    case "employees":
      return {
        type: "employees",
        count: Array.isArray(link.resourceId) ? link.resourceId.length : 1,
        employees: [
          { id: "emp_1", name: "John Doe", status: "Compliant", department: "Operations" },
          { id: "emp_2", name: "Jane Smith", status: "Pending", department: "Safety" },
        ],
      }
    case "report":
      return {
        type: "report",
        title: "Compliance Report",
        generatedAt: new Date().toISOString(),
        data: {
          /* report data */
        },
      }
    default:
      return { type: link.resourceType, data: {} }
  }
}

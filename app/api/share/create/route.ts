import { type NextRequest, NextResponse } from "next/server"
import { generateShareToken, hashPassword, calculateExpiration } from "@/lib/share/utils"
import type { CreateShareLinkRequest, ShareableLink } from "@/types/share"

// POST /api/share/create - Create a new shareable link
export async function POST(request: NextRequest) {
  try {
    const body: CreateShareLinkRequest = await request.json()

    // Validate required fields
    if (!body.resourceType || !body.resourceId || !body.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate secure token
    const token = generateShareToken()

    // Hash password
    const passwordHash = hashPassword(body.password)

    // Calculate expiration
    const expiresAt = calculateExpiration(body.expiresIn, body.customExpiration)

    // Create shareable link (mock - replace with database insert)
    const shareableLink: ShareableLink = {
      id: `share_${Date.now()}`,
      token,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      createdBy: "current-user-id", // Replace with actual user ID from session
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      passwordHash,
      oneTimeUse: body.oneTimeUse || false,
      accessCount: 0,
      watermark: body.watermark,
      metadata: body.metadata,
    }

    // TODO: Store in database
    // await db.shareableLinks.create(shareableLink)

    // Return the shareable link URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${token}`

    return NextResponse.json({
      success: true,
      link: {
        id: shareableLink.id,
        url: shareUrl,
        token,
        expiresAt: shareableLink.expiresAt,
        oneTimeUse: shareableLink.oneTimeUse,
      },
    })
  } catch (error) {
    console.error("[v0] Error creating shareable link:", error)
    return NextResponse.json({ error: "Failed to create shareable link" }, { status: 500 })
  }
}

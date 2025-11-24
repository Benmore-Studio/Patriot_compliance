"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link2, Trash2, Eye, Copy, CheckCircle2 } from "lucide-react"
import { formatExpirationTime } from "@/lib/share/utils"

export default function ShareableLinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Mock data - replace with actual API call
  const links = [
    {
      id: "share_1",
      token: "abc123",
      resourceType: "employees",
      metadata: { title: "Q4 Compliance Report - All Employees" },
      createdAt: "2024-01-15T10:00:00Z",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      accessCount: 3,
      oneTimeUse: false,
    },
    {
      id: "share_2",
      token: "def456",
      resourceType: "drug-test",
      metadata: { title: "Random Pool Selection Results" },
      createdAt: "2024-01-14T14:30:00Z",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      accessCount: 1,
      oneTimeUse: true,
    },
  ]

  const copyToClipboard = (token: string, id: string) => {
    const url = `${window.location.origin}/share/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const revokeLink = async (token: string) => {
    if (!confirm("Are you sure you want to revoke this link? It will no longer be accessible.")) {
      return
    }

    try {
      await fetch(`/api/share/${token}`, { method: "DELETE" })
      // Refresh the list
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error revoking link:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shareable Links</h1>
        <p className="text-muted-foreground mt-2">
          Manage secure, password-protected links for sharing compliance data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Links</CardTitle>
          <CardDescription>All links are password-protected, time-limited, and fully audited</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{link.metadata?.title || `${link.resourceType} data`}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Expires in {formatExpirationTime(link.expiresAt)}</span>
                    <span>•</span>
                    <span>
                      {link.accessCount} access{link.accessCount !== 1 ? "es" : ""}
                    </span>
                    {link.oneTimeUse && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          One-time use
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.token, link.id)}>
                    {copiedId === link.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(`/share/${link.token}`, "_blank")}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => revokeLink(link.token)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, FileCheck, Users, Briefcase, TrendingUp, CheckCircle2 } from "lucide-react"

const portalOptions = [
  {
    value: "service-company",
    label: "Service Company",
    icon: Building2,
    description: "Manage your workforce compliance",
    route: "/dashboard",
  },
  {
    value: "compliance-company",
    label: "Compliance Company",
    icon: FileCheck,
    description: "Oversee multiple service companies",
    route: "/compliance-portal",
  },
  {
    value: "field-worker",
    label: "PCS Pass", // Renamed from "Field Worker" to "PCS Pass"
    icon: Users,
    description: "View your compliance status",
    route: "/portals/pcs-pass", // Updated route
  },
  {
    value: "auditor",
    label: "Auditor",
    icon: Briefcase,
    description: "Audit compliance records",
    route: "/portals/auditor",
  },
  {
    value: "executive",
    label: "Executive",
    icon: TrendingUp,
    description: "Executive command center",
    route: "/portals/executive",
  },
]

export function RoleSwitcher() {
  const { user } = useAuth()
  const router = useRouter()
  const [switching, setSwitching] = useState<string | null>(null)

  const handleSwitchRole = async (portalValue: string, route: string) => {
    setSwitching(portalValue)
    // Simulate role switch delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push(route)
    setSwitching(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Switcher (Demo Mode)</CardTitle>
        <CardDescription>
          Switch between different portal views for demonstration purposes. This feature is only available for admin
          users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {portalOptions.map((portal) => {
            const Icon = portal.icon
            const isCurrentRole = user?.portalType === portal.value
            const isSwitching = switching === portal.value

            return (
              <div
                key={portal.value}
                className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  isCurrentRole ? "bg-primary/5 border-primary" : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isCurrentRole ? "bg-primary/10" : "bg-secondary"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isCurrentRole ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{portal.label}</h4>
                      {isCurrentRole && (
                        <Badge variant="default" className="bg-primary">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{portal.description}</p>
                  </div>
                </div>
                <Button
                  variant={isCurrentRole ? "outline" : "default"}
                  size="sm"
                  disabled={isCurrentRole || isSwitching !== null}
                  onClick={() => handleSwitchRole(portal.value, portal.route)}
                >
                  {isSwitching ? "Switching..." : isCurrentRole ? "Active" : "Switch"}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> This role switcher is for demonstration purposes only. In production, user roles are
            determined by their credentials and permissions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

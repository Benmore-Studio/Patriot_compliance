"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { Shield, Building2, Search, Briefcase, Users, LayoutDashboard, ArrowRight, CheckCircle2 } from "lucide-react"

const availablePortals = [
  {
    id: "service-company",
    name: "Service Company Portal",
    description: "Manage your company's compliance, employees, and operations",
    icon: Building2,
    route: "/dashboard",
    color: "bg-blue-500",
    features: ["Employee Management", "Compliance Tracking", "Drug Testing", "Training & Certifications"],
  },
  {
    id: "compliance-company",
    name: "Compliance Provider Portal",
    description: "Monitor and manage compliance for all your service companies",
    icon: Shield,
    route: "/compliance-portal",
    color: "bg-green-500",
    features: ["Multi-Company View", "Read-Only Access", "Compliance Reports", "Client Management"],
  },
  {
    id: "field-worker",
    name: "PCS Pass (Field Worker)",
    description: "Access your personal compliance documents and check-in",
    icon: Users,
    route: "/portals/pcs-pass",
    color: "bg-purple-500",
    features: ["Document Upload", "Geo Check-In", "Compliance Status", "Notifications"],
  },
  {
    id: "auditor",
    name: "Auditor Portal",
    description: "Review and audit compliance data across all companies",
    icon: Search,
    route: "/portals/auditor",
    color: "bg-orange-500",
    features: ["Compliance Review", "Audit Logs", "Export Data", "Detailed Reports"],
  },
  {
    id: "executive",
    name: "Executive Dashboard",
    description: "High-level analytics and performance metrics",
    icon: Briefcase,
    route: "/portals/executive",
    color: "bg-red-500",
    features: ["Analytics", "Performance Metrics", "Multi-Portal Access", "Strategic Overview"],
  },
  {
    id: "compliance-officer",
    name: "Compliance Officer Portal",
    description: "Dedicated compliance management and oversight",
    icon: Shield,
    route: "/portals/compliance-officer",
    color: "bg-teal-500",
    features: ["Compliance Oversight", "Policy Management", "Risk Assessment", "Reporting"],
  },
]

export default function PortalsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handlePortalClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Portal Access</h1>
        <p className="text-muted-foreground">
          Select a portal to access different views and functionalities based on your role
        </p>
      </div>

      {/* Current Portal Badge */}
      {user?.portalType && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <LayoutDashboard className="mr-2 h-3 w-3" />
            Currently in:{" "}
            {user.portalType === "service-company"
              ? "Service Company"
              : user.portalType === "compliance-company"
                ? "Compliance Provider"
                : user.portalType === "field-worker"
                  ? "PCS Pass"
                  : user.portalType === "auditor"
                    ? "Auditor"
                    : "Executive"}{" "}
            Portal
          </Badge>
        </div>
      )}

      {/* Portal Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availablePortals.map((portal) => {
          const Icon = portal.icon
          const isCurrentPortal = user?.portalType === portal.id

          return (
            <Card
              key={portal.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isCurrentPortal ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Color accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${portal.color}`} />

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${portal.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${portal.color.replace("bg-", "text-")}`} />
                  </div>
                  {isCurrentPortal && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{portal.name}</CardTitle>
                <CardDescription>{portal.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Key Features:</p>
                  <ul className="space-y-1">
                    {portal.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handlePortalClick(portal.route)}
                  className="w-full"
                  variant={isCurrentPortal ? "outline" : "default"}
                >
                  {isCurrentPortal ? "Go to Portal" : "Switch to Portal"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Help Text */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Need access to a different portal?</p>
              <p className="text-sm text-muted-foreground">
                Contact your system administrator to request access to additional portals based on your role and
                responsibilities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

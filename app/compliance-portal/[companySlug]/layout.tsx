import { useState } from "react"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, MapPin, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { mockCompanies } from "@/lib/data/mock-companies"
import { CommunicationsDialog } from "@/components/communications-dialog"

export default async function CompanyLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ companySlug: string }>
}) {
  const { companySlug } = await params
  const company = mockCompanies.find((c) => c.id === companySlug)

  if (!company) {
    notFound()
  }

  return (
    <div className="space-y-4">
      {/* Company Context Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link href="/compliance-portal">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </Button>
          </Link>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{company.name}</h2>
                <Badge variant="secondary" className="text-xs">
                  Read-Only
                </Badge>
                <Badge
                  variant={
                    company.status === "compliant"
                      ? "default"
                      : company.status === "at-risk"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {company.complianceScore}% Compliant
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {company.city}, {company.state}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {company.employeeCount} employees
                </span>
                <span className="text-xs">{company.industry}</span>
              </div>
            </div>
          </div>
        </div>
        <CommunicationsDialogTrigger companyName={company.name} />
      </div>

      {/* Module Content */}
      {children}
    </div>
  )
}

function CommunicationsDialogTrigger({ companyName }: { companyName: string }) {
  "use client"

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <MessageSquare className="h-4 w-4" />
        Request Changes
      </Button>
      <CommunicationsDialog open={open} onOpenChange={setOpen} companyName={companyName} />
    </>
  )
}

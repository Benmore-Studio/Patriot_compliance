"use client"

import { useState } from "react"
import { ServiceCompaniesSidebar } from "@/components/service-companies-sidebar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PortfolioView } from "@/components/portfolio-view"
import { AlertsActionsCenter } from "@/components/alerts-actions-center"
import { BillingPayments } from "@/components/billing-payments"
import { OccupationalHealthOversight } from "@/components/occupational-health-oversight"
import { TrainingCertifications } from "@/components/training-certifications"
import { RosterEmployee360 } from "@/components/roster-employee-360"
import { GeoFenceCompliance } from "@/components/geo-fence-compliance"
import { PoliciesAI } from "@/components/policies-ai"
import { MISReporting } from "@/components/mis-reporting"
import { Communications } from "@/components/communications"
import {
  LayoutDashboard,
  AlertTriangle,
  CreditCard,
  Stethoscope,
  GraduationCap,
  Users,
  MapPin,
  FileText,
  BarChart3,
  MessageSquare,
} from "lucide-react"

const navigationCards = [
  {
    id: "portfolio",
    title: "Portfolio View",
    description: "Overview of all service companies",
    icon: LayoutDashboard,
  },
  {
    id: "alerts",
    title: "Alerts & Actions",
    description: "Critical alerts and action items",
    icon: AlertTriangle,
  },
  {
    id: "billing",
    title: "Billing & Payments",
    description: "Financial overview and invoicing",
    icon: CreditCard,
  },
  {
    id: "oh",
    title: "Occupational Health",
    description: "Health monitoring and compliance",
    icon: Stethoscope,
  },
  {
    id: "training",
    title: "Training & Certs",
    description: "Training programs and certifications",
    icon: GraduationCap,
  },
  {
    id: "roster",
    title: "Roster & Employee 360°",
    description: "Employee management and profiles",
    icon: Users,
  },
  {
    id: "geo",
    title: "Geo-Fence",
    description: "Location-based compliance tracking",
    icon: MapPin,
  },
  {
    id: "policies",
    title: "Policies & AI",
    description: "Policy management and AI insights",
    icon: FileText,
  },
  {
    id: "mis",
    title: "MIS & Reporting",
    description: "Reports and analytics",
    icon: BarChart3,
  },
  {
    id: "comms",
    title: "Communications",
    description: "Announcements and notifications",
    icon: MessageSquare,
  },
]

export default function ComplianceDashboard() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<string>("portfolio")

  const renderActiveView = () => {
    switch (activeView) {
      case "portfolio":
        return <PortfolioView selectedCompany={selectedCompany} />
      case "alerts":
        return <AlertsActionsCenter />
      case "billing":
        return <BillingPayments />
      case "oh":
        return <OccupationalHealthOversight />
      case "training":
        return <TrainingCertifications />
      case "roster":
        return <RosterEmployee360 />
      case "geo":
        return <GeoFenceCompliance />
      case "policies":
        return <PoliciesAI />
      case "mis":
        return <MISReporting />
      case "comms":
        return <Communications />
      default:
        return <PortfolioView selectedCompany={selectedCompany} />
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
      <ServiceCompaniesSidebar selectedCompany={selectedCompany} onSelectCompany={setSelectedCompany} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">PolicyLink</h1>{" "}
            {/* Renamed from "Compliance Company Dashboard" to "PolicyLink" */}
            <p className="text-muted-foreground">Portfolio oversight and compliance management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {navigationCards.map((card) => {
              const Icon = card.icon
              const isActive = activeView === card.id
              return (
                <Card
                  key={card.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isActive ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setActiveView(card.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <CardTitle className="text-sm font-semibold">{card.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>

          <div className="mt-6">{renderActiveView()}</div>
        </div>
      </main>
    </div>
  )
}

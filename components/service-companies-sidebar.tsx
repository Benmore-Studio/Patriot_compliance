"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, Lock } from "lucide-react"

interface ServiceCompany {
  id: string
  name: string
  complianceScore: number
  status: "green" | "yellow" | "red" | "locked"
  modules: {
    drugAlcohol: "green" | "yellow" | "red"
    background: "green" | "yellow" | "red"
    oh: "green" | "yellow" | "red"
    training: "green" | "yellow" | "red"
    geo: "green" | "yellow" | "red"
    billing: "green" | "yellow" | "red" | "locked"
  }
  alertCount: number
}

const mockCompanies: ServiceCompany[] = [
  {
    id: "1",
    name: "ABC Trucking Co.",
    complianceScore: 94,
    status: "green",
    modules: {
      drugAlcohol: "green",
      background: "green",
      oh: "yellow",
      training: "green",
      geo: "green",
      billing: "green",
    },
    alertCount: 2,
  },
  {
    id: "2",
    name: "XYZ Logistics LLC",
    complianceScore: 78,
    status: "yellow",
    modules: {
      drugAlcohol: "yellow",
      background: "green",
      oh: "red",
      training: "yellow",
      geo: "green",
      billing: "green",
    },
    alertCount: 8,
  },
  {
    id: "3",
    name: "FastHaul Transport",
    complianceScore: 60,
    status: "locked",
    modules: { drugAlcohol: "red", background: "yellow", oh: "red", training: "red", geo: "yellow", billing: "locked" },
    alertCount: 15,
  },
  {
    id: "4",
    name: "SafeRoad Services",
    complianceScore: 88,
    status: "green",
    modules: {
      drugAlcohol: "green",
      background: "green",
      oh: "green",
      training: "yellow",
      geo: "green",
      billing: "green",
    },
    alertCount: 3,
  },
  {
    id: "5",
    name: "Premier Freight Inc.",
    complianceScore: 72,
    status: "yellow",
    modules: {
      drugAlcohol: "yellow",
      background: "yellow",
      oh: "yellow",
      training: "green",
      geo: "green",
      billing: "yellow",
    },
    alertCount: 6,
  },
]

interface ServiceCompaniesSidebarProps {
  selectedCompany: string | null
  onSelectCompany: (id: string) => void
}

export function ServiceCompaniesSidebar({ selectedCompany, onSelectCompany }: ServiceCompaniesSidebarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "yellow":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "red":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "locked":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <aside className="w-80 border-r border-border bg-card">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <h2 className="font-semibold text-foreground">Service Companies</h2>
        <Badge variant="secondary">{mockCompanies.length}</Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-2 p-4">
          {mockCompanies.map((company) => (
            <button
              key={company.id}
              onClick={() => onSelectCompany(company.id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                selectedCompany === company.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{company.name}</span>
                </div>
                {company.status === "locked" && <Lock className="h-4 w-4 text-gray-400" />}
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance Score</span>
                <span
                  className={`text-sm font-semibold ${
                    company.complianceScore >= 90
                      ? "text-green-400"
                      : company.complianceScore >= 70
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {company.complianceScore}%
                </span>
              </div>

              <div className="mb-2 flex flex-wrap gap-1">
                <Badge variant="outline" className={`text-xs ${getStatusColor(company.modules.drugAlcohol)}`}>
                  D&A
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(company.modules.background)}`}>
                  BG
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(company.modules.oh)}`}>
                  OH
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(company.modules.training)}`}>
                  Train
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(company.modules.geo)}`}>
                  Geo
                </Badge>
                <Badge variant="outline" className={`text-xs ${getStatusColor(company.modules.billing)}`}>
                  Bill
                </Badge>
              </div>

              {company.alertCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-medium text-red-400">{company.alertCount}</span> active alerts
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

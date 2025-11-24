"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Syringe, Stethoscope, GraduationCap, CreditCard, Download } from "lucide-react"

const alertCategories = [
  { id: "all", label: "All Alerts", count: 127 },
  { id: "background", label: "Background Checks", count: 12 },
  { id: "drug", label: "Drug/Alcohol", count: 8 },
  { id: "health", label: "Occupational Health", count: 34 },
  { id: "training", label: "Training/Certs", count: 45 },
  { id: "billing", label: "Billing", count: 3 },
  { id: "dot", label: "DOT File", count: 15 },
  { id: "expiring", label: "Expirations", count: 10 },
]

const alerts = [
  {
    id: 1,
    category: "drug",
    severity: "critical",
    title: "Failed Drug Test - Immediate Action Required",
    employee: "John Smith",
    employeeId: "EMP-1024",
    department: "Transportation",
    time: "15 minutes ago",
    moduleLink: "/modules/drug-alcohol",
    icon: Syringe,
  },
  {
    id: 2,
    category: "health",
    severity: "critical",
    title: "DOT Physical Expired",
    employee: "Sarah Johnson",
    employeeId: "EMP-2048",
    department: "Operations",
    time: "1 hour ago",
    moduleLink: "/modules/occupational-health",
    icon: Stethoscope,
  },
  {
    id: 3,
    category: "billing",
    severity: "critical",
    title: "Account Overdue >30 Days - Account Locked",
    employee: "N/A",
    employeeId: "N/A",
    department: "Billing",
    time: "2 hours ago",
    moduleLink: "/billing",
    icon: CreditCard,
  },
  {
    id: 4,
    category: "training",
    severity: "warning",
    title: "Certification Expiring in 14 Days",
    employee: "Mike Davis",
    employeeId: "EMP-3072",
    department: "Safety",
    time: "3 hours ago",
    moduleLink: "/modules/training-certs",
    icon: GraduationCap,
  },
  {
    id: 5,
    category: "background",
    severity: "warning",
    title: "Background Check Nearing Expiration",
    employee: "Emily Wilson",
    employeeId: "EMP-4096",
    department: "Administration",
    time: "5 hours ago",
    moduleLink: "/modules/background-checks",
    icon: FileText,
  },
]

export function AlertsCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAlerts, setSelectedAlerts] = useState<number[]>([])

  const filteredAlerts =
    selectedCategory === "all" ? alerts : alerts.filter((alert) => alert.category === selectedCategory)

  const toggleAlert = (id: number) => {
    setSelectedAlerts((prev) => (prev.includes(id) ? prev.filter((alertId) => alertId !== id) : [...prev, id]))
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Alerts Center</h2>
            <p className="mt-1 text-sm text-muted-foreground">Click any alert to navigate to the specific module</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
              <Download className="mr-2 inline-block h-4 w-4" />
              Export CSV
            </button>
            {selectedAlerts.length > 0 && (
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Bulk Assign ({selectedAlerts.length})
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {alertCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border">
        {filteredAlerts.map((alert) => {
          const Icon = alert.icon
          return (
            <Link
              key={alert.id}
              href={alert.moduleLink}
              className="flex items-start gap-4 p-6 transition-colors hover:bg-accent/50"
            >
              <input
                type="checkbox"
                checked={selectedAlerts.includes(alert.id)}
                onChange={(e) => {
                  e.preventDefault()
                  toggleAlert(alert.id)
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 h-4 w-4 rounded border-border"
              />
              <div
                className={`rounded-full p-2 ${alert.severity === "critical" ? "bg-destructive/10" : "bg-chart-5/10"}`}
              >
                <Icon className={`h-5 w-5 ${alert.severity === "critical" ? "text-destructive" : "text-chart-5"}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-card-foreground">{alert.title}</p>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      alert.severity === "critical"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-chart-5/10 text-chart-5"
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {alert.employee} ({alert.employeeId}) • {alert.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{alert.time}</p>
                <span className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                  Open Module →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

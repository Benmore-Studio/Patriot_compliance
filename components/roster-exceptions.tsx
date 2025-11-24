"use client"

import { AlertCircle, User, Upload } from "lucide-react"

const exceptions = [
  {
    id: 1,
    type: "Missing DOB/Photo",
    count: 12,
    employees: ["John Smith", "Sarah Johnson", "+10 more"],
    severity: "high",
    quickFix: "Bulk Upload",
  },
  {
    id: 2,
    type: "Missing Policy Assignment",
    count: 8,
    employees: ["Mike Davis", "Emily Wilson", "+6 more"],
    severity: "high",
    quickFix: "Assign Policy",
  },
  {
    id: 3,
    type: "Unlinked BG Order",
    count: 5,
    employees: ["Robert Brown", "Lisa Garcia", "+3 more"],
    severity: "medium",
    quickFix: "Link Order",
  },
  {
    id: 4,
    type: "Incomplete Training/Medical",
    count: 23,
    employees: ["David Martinez", "Jennifer Lee", "+21 more"],
    severity: "medium",
    quickFix: "Schedule",
  },
]

export function RosterExceptions() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Roster Exceptions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Data quality issues requiring attention</p>
          </div>
          <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent">
            <Upload className="mr-2 inline-block h-4 w-4" />
            Bulk Import
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {exceptions.map((exception) => (
          <div key={exception.id} className="p-4 transition-colors hover:bg-accent/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-full p-2 ${
                    exception.severity === "high" ? "bg-destructive/10" : "bg-chart-5/10"
                  }`}
                >
                  <AlertCircle
                    className={`h-4 w-4 ${exception.severity === "high" ? "text-destructive" : "text-chart-5"}`}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-card-foreground">{exception.type}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        exception.severity === "high"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-chart-5/10 text-chart-5"
                      }`}
                    >
                      {exception.count} EMPLOYEES
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{exception.employees.join(", ")}</p>
                  <button className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    <User className="h-3 w-3" />
                    View All Employees
                  </button>
                </div>
              </div>
              <button className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                {exception.quickFix}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

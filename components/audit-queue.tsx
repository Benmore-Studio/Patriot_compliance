"use client"

import { FileText, LinkIcon, Download } from "lucide-react"

const auditItems = [
  {
    id: 1,
    type: "SAP/RTD Review",
    employee: "John Smith",
    employeeId: "EMP-1024",
    description: "Return-to-duty evaluation pending review",
    priority: "high",
    dueDate: "Today",
    hasArtifacts: true,
  },
  {
    id: 2,
    type: "Chain of Custody",
    employee: "Sarah Johnson",
    employeeId: "EMP-2048",
    description: "COC documentation requires verification",
    priority: "high",
    dueDate: "Tomorrow",
    hasArtifacts: true,
  },
  {
    id: 3,
    type: "Background Correction",
    employee: "Mike Davis",
    employeeId: "EMP-3072",
    description: "Dispute filed on background check results",
    priority: "medium",
    dueDate: "In 3 days",
    hasArtifacts: true,
  },
  {
    id: 4,
    type: "Policy Exception",
    employee: "Emily Wilson",
    employeeId: "EMP-4096",
    description: "Medical accommodation request review",
    priority: "medium",
    dueDate: "In 5 days",
    hasArtifacts: false,
  },
]

export function AuditQueue() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Audit Queue</h2>
            <p className="mt-1 text-sm text-muted-foreground">Items requiring review and verification</p>
          </div>
          <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent">
            <Download className="mr-2 inline-block h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {auditItems.map((item) => (
          <div key={item.id} className="p-4 transition-colors hover:bg-accent/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${item.priority === "high" ? "bg-destructive/10" : "bg-chart-5/10"}`}>
                  <FileText className={`h-4 w-4 ${item.priority === "high" ? "text-destructive" : "text-chart-5"}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-card-foreground">{item.type}</p>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        item.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-5/10 text-chart-5"
                      }`}
                    >
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.employee} ({item.employeeId})
                  </p>
                  <p className="text-sm text-card-foreground">{item.description}</p>
                  {item.hasArtifacts && (
                    <button className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      <LinkIcon className="h-3 w-3" />
                      View Artifacts
                    </button>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-card-foreground">{item.dueDate}</p>
                <button className="mt-2 rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

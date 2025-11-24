import { FileText, ExternalLink } from "lucide-react"

const policies = [
  { name: "DOT Drug & Alcohol Policy", updated: "2024-01-15", status: "active" },
  { name: "Background Check Policy", updated: "2024-02-20", status: "active" },
  { name: "Training Requirements", updated: "2024-03-10", status: "active" },
  { name: "Safety Certification Policy", updated: "2023-12-05", status: "review" },
]

export function PolicyManagement() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Policy Management</h2>
            <p className="mt-1 text-sm text-muted-foreground">Active compliance policies and procedures</p>
          </div>
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {policies.map((policy) => (
          <div key={policy.name} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{policy.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">Updated {policy.updated}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  policy.status === "active" ? "bg-chart-2/10 text-chart-2" : "bg-chart-5/10 text-chart-5"
                }`}
              >
                {policy.status}
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

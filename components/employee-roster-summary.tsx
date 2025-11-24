import { Users } from "lucide-react"

const departments = [
  { name: "Transportation", count: 342, compliant: 289 },
  { name: "Operations", count: 256, compliant: 218 },
  { name: "Safety", count: 189, compliant: 167 },
  { name: "Administration", count: 237, compliant: 173 },
]

export function EmployeeRosterSummary() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Employee Roster</h2>
            <p className="mt-1 text-sm text-muted-foreground">Compliance status by department</p>
          </div>
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {departments.map((dept) => {
            const percentage = Math.round((dept.compliant / dept.count) * 100)
            return (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.compliant} / {dept.count}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-chart-2" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
        <button className="mt-6 w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
          View Full Roster
        </button>
      </div>
    </div>
  )
}

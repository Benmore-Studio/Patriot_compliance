import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react"

const stats = [
  {
    label: "Compliant Employees",
    value: "847",
    total: "1,024",
    percentage: 83,
    status: "success",
    icon: CheckCircle2,
  },
  {
    label: "Pending Reviews",
    value: "42",
    status: "warning",
    icon: Clock,
  },
  {
    label: "Expiring Soon",
    value: "89",
    status: "warning",
    icon: AlertTriangle,
  },
  {
    label: "Non-Compliant",
    value: "46",
    status: "error",
    icon: XCircle,
  },
]

export function ComplianceOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                  {stat.total && <p className="text-sm text-muted-foreground">/ {stat.total}</p>}
                </div>
                {stat.percentage && (
                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-chart-2" style={{ width: `${stat.percentage}%` }} />
                    </div>
                  </div>
                )}
              </div>
              <Icon
                className={`h-8 w-8 ${
                  stat.status === "success"
                    ? "text-chart-2"
                    : stat.status === "warning"
                      ? "text-chart-5"
                      : "text-destructive"
                }`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

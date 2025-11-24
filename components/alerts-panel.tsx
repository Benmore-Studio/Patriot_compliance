import { AlertTriangle, Clock, XCircle } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "DOT Drug Test Expired",
    employee: "John Smith",
    department: "Transportation",
    time: "2 hours ago",
    icon: XCircle,
  },
  {
    id: 2,
    type: "warning",
    title: "Background Check Expiring",
    employee: "Sarah Johnson",
    department: "Operations",
    time: "5 hours ago",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "info",
    title: "Training Certification Due",
    employee: "Mike Davis",
    department: "Safety",
    time: "1 day ago",
    icon: Clock,
  },
]

export function AlertsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-xl font-semibold text-card-foreground">Real-Time Alerts</h2>
        <p className="mt-1 text-sm text-muted-foreground">Critical compliance issues requiring immediate attention</p>
      </div>
      <div className="divide-y divide-border">
        {alerts.map((alert) => {
          const Icon = alert.icon
          return (
            <div key={alert.id} className="flex items-start gap-4 p-6 hover:bg-accent/50 transition-colors">
              <div
                className={`rounded-full p-2 ${
                  alert.type === "critical"
                    ? "bg-destructive/10"
                    : alert.type === "warning"
                      ? "bg-chart-5/10"
                      : "bg-chart-1/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    alert.type === "critical"
                      ? "text-destructive"
                      : alert.type === "warning"
                        ? "text-chart-5"
                        : "text-chart-1"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-card-foreground">{alert.title}</p>
                <p className="text-sm text-muted-foreground">
                  {alert.employee} • {alert.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{alert.time}</p>
                <button className="mt-2 text-sm font-medium text-primary hover:underline">Review</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

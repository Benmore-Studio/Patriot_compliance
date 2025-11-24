import { DollarSign, FileText, Clock, CheckCircle2, AlertTriangle, Lock } from "lucide-react"

const stats = [
  {
    label: "Total Revenue (MTD)",
    value: "$124,580",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Outstanding Invoices",
    value: "23",
    amount: "$45,230",
    icon: FileText,
  },
  {
    label: "Pending Payments",
    value: "15",
    amount: "$28,450",
    icon: Clock,
  },
  {
    label: "Paid This Month",
    value: "89",
    amount: "$96,130",
    icon: CheckCircle2,
  },
]

const accountStatus = [
  {
    label: "Accounts at Risk",
    value: "3",
    description: "Payment due within 7 days",
    icon: AlertTriangle,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    label: "Locked Accounts",
    value: "2",
    description: "30+ days overdue",
    icon: Lock,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    label: "Payment Warnings",
    value: "5",
    description: "1-30 days overdue",
    icon: Clock,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

export function BillingOverview() {
  return (
    <div className="space-y-6">
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
                  </div>
                  {stat.amount && <p className="mt-1 text-sm text-muted-foreground">{stat.amount}</p>}
                  {stat.change && (
                    <p
                      className={`mt-2 text-sm font-medium ${stat.trend === "up" ? "text-chart-2" : "text-destructive"}`}
                    >
                      {stat.change}
                    </p>
                  )}
                </div>
                <Icon className="h-8 w-8 text-chart-1" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Account Status Overview</h3>
          <p className="text-sm text-muted-foreground">Monitor accounts requiring attention</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {accountStatus.map((status) => {
            const Icon = status.icon
            return (
              <div key={status.label} className={`rounded-lg border border-border p-4 ${status.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${status.color}`} />
                      <p className="text-2xl font-bold text-card-foreground">{status.value}</p>
                    </div>
                    <p className="mt-1 text-sm font-medium text-card-foreground">{status.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{status.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="text-sm text-primary hover:underline">View Overdue Accounts</button>
          <span className="text-muted-foreground">•</span>
          <button className="text-sm text-primary hover:underline">Send Bulk Reminder</button>
        </div>
      </div>
    </div>
  )
}

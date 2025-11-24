"use client"

import { Activity, Clock, CheckCircle2, XCircle, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Testing Volume (30d)",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Avg Turnaround Time",
    value: "2.3 days",
    change: "-0.5d",
    trend: "up",
    icon: Clock,
  },
  {
    label: "Pass Rate",
    value: "96.8%",
    change: "+1.2%",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    label: "Roster Coverage",
    value: "98.2%",
    change: "+0.8%",
    trend: "up",
    icon: Users,
  },
  {
    label: "OH Completions",
    value: "892",
    change: "+45",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    label: "Cert Expirations (30d)",
    value: "67",
    change: "-12",
    trend: "up",
    icon: XCircle,
  },
]

export function KeyStatistics() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Key Statistics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-2 gap-4 p-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 text-chart-2">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

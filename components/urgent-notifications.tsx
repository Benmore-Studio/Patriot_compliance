"use client"

import Link from "next/link"
import { AlertCircle, Syringe, Stethoscope, CreditCard, FileX, Clock } from "lucide-react"

const urgentNotifications = [
  {
    id: 1,
    severity: "critical",
    title: "Failed Drug Test - John Smith (EMP-1024)",
    description: "Immediate removal from safety-sensitive duties required",
    moduleLink: "/modules/drug-alcohol",
    time: "15 minutes ago",
    icon: Syringe,
  },
  {
    id: 2,
    severity: "critical",
    title: "DOT Physical Expired - Sarah Johnson (EMP-2048)",
    description: "Employee cannot perform DOT-regulated duties",
    moduleLink: "/modules/occupational-health",
    time: "1 hour ago",
    icon: Stethoscope,
  },
  {
    id: 3,
    severity: "critical",
    title: "Billing Account Locked - Payment Overdue >30 Days",
    description: "Service access restricted until payment received",
    moduleLink: "/billing",
    time: "2 hours ago",
    icon: CreditCard,
  },
  {
    id: 4,
    severity: "warning",
    title: "DOT File Incomplete - 8 Employees",
    description: "Missing required documentation for DOT compliance",
    moduleLink: "/modules/dot-file",
    time: "3 hours ago",
    icon: FileX,
  },
  {
    id: 5,
    severity: "warning",
    title: "Random Testing Window Closing - 7 Days Remaining",
    description: "48% complete, need 50% to meet policy requirement",
    moduleLink: "/modules/drug-alcohol",
    time: "5 hours ago",
    icon: Clock,
  },
]

export function UrgentNotifications() {
  return (
    <div className="rounded-lg border-2 border-destructive/50 bg-card">
      <div className="border-b border-destructive/50 bg-destructive/5 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-destructive/10 p-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Urgent Notifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Critical alerts requiring immediate attention - click to navigate to module
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {urgentNotifications.map((notification) => {
          const Icon = notification.icon
          return (
            <Link
              key={notification.id}
              href={notification.moduleLink}
              className="flex items-start gap-4 p-6 transition-colors hover:bg-accent/50"
            >
              <div
                className={`rounded-full p-2 ${
                  notification.severity === "critical" ? "bg-destructive/10" : "bg-chart-5/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${notification.severity === "critical" ? "text-destructive" : "text-chart-5"}`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-card-foreground">{notification.title}</p>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      notification.severity === "critical"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-chart-5/10 text-chart-5"
                    }`}
                  >
                    {notification.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{notification.time}</p>
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

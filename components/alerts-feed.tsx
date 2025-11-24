"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Clock, Building2 } from "lucide-react"

interface Alert {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  module: string
  company: string
  message: string
  timestamp: string
  sla: string
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    module: "Billing",
    company: "FastHaul Transport",
    message: "Account locked due to 60+ days past due",
    timestamp: "2 hours ago",
    sla: "Overdue",
  },
  {
    id: "2",
    severity: "critical",
    module: "Drug & Alcohol",
    company: "XYZ Logistics LLC",
    message: "Random testing quota shortfall - Q1 2025",
    timestamp: "4 hours ago",
    sla: "2 days",
  },
  {
    id: "3",
    severity: "high",
    module: "Occupational Health",
    company: "Premier Freight Inc.",
    message: "8 DOT physicals expired, 12 expiring within 30 days",
    timestamp: "6 hours ago",
    sla: "5 days",
  },
  {
    id: "4",
    severity: "high",
    module: "Background",
    company: "XYZ Logistics LLC",
    message: "3 background orders pending beyond SLA",
    timestamp: "8 hours ago",
    sla: "1 day",
  },
  {
    id: "5",
    severity: "medium",
    module: "Training",
    company: "SafeRoad Services",
    message: "15 employees missing required HAZMAT training",
    timestamp: "1 day ago",
    sla: "7 days",
  },
  {
    id: "6",
    severity: "medium",
    module: "Geo-Fence",
    company: "FastHaul Transport",
    message: "Non-compliant employee detected on site",
    timestamp: "1 day ago",
    sla: "3 days",
  },
]

export function AlertsFeed() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>High-Level Alerts Feed</CardTitle>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="drug">Drug & Alcohol</SelectItem>
                <SelectItem value="oh">Occupational Health</SelectItem>
                <SelectItem value="background">Background</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="geo">Geo-Fence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <AlertTriangle
                className={`mt-1 h-5 w-5 ${
                  alert.severity === "critical"
                    ? "text-red-400"
                    : alert.severity === "high"
                      ? "text-orange-400"
                      : "text-yellow-400"
                }`}
              />

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{alert.module}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{alert.company}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div
                      className={`mt-1 font-medium ${
                        alert.sla === "Overdue" ? "text-red-400" : "text-muted-foreground"
                      }`}
                    >
                      SLA: {alert.sla}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground">{alert.message}</p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Assign
                  </Button>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

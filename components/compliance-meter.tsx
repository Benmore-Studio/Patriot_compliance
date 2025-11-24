"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"

export function ComplianceMeter() {
  const [compliance] = useState(87) // Overall compliance percentage

  // Determine color based on compliance percentage
  const getColor = () => {
    if (compliance >= 95) return { bg: "text-chart-2", stroke: "#10b981", label: "In Compliance" }
    if (compliance >= 80) return { bg: "text-chart-5", stroke: "#f59e0b", label: "At Risk" }
    return { bg: "text-destructive", stroke: "#ef4444", label: "Out of Compliance" }
  }

  const color = getColor()
  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (compliance / 100) * circumference

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Overall Compliance</h2>
      <p className="mt-1 text-sm text-muted-foreground">Company-wide compliance status</p>

      <div className="mt-6 flex flex-col items-center">
        <div className="relative h-48 w-48">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke={color.stroke}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${color.bg}`}>{compliance}%</span>
            <span className="mt-1 text-xs text-muted-foreground">Compliant</span>
          </div>
        </div>

        <div className="mt-6 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${color.bg}`}>{color.label}</span>
            <div className="flex items-center gap-1 text-chart-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+2.3%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">vs. last month</p>
        </div>
      </div>
    </div>
  )
}

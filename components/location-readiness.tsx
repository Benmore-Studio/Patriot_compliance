"use client"

import { MapPin, Users, AlertTriangle, CheckCircle2 } from "lucide-react"

const locations = [
  {
    id: 1,
    name: "Houston Terminal",
    readyPercentage: 95,
    readyCount: 38,
    totalCount: 40,
    status: "success",
    blockingIssues: ["2 employees pending DOT physical"],
  },
  {
    id: 2,
    name: "Dallas Distribution Center",
    readyPercentage: 78,
    readyCount: 62,
    totalCount: 80,
    status: "warning",
    blockingIssues: ["12 employees missing training", "6 background checks pending"],
  },
  {
    id: 3,
    name: "Austin Warehouse",
    readyPercentage: 100,
    readyCount: 25,
    totalCount: 25,
    status: "success",
    blockingIssues: [],
  },
  {
    id: 4,
    name: "San Antonio Depot",
    readyPercentage: 65,
    readyCount: 26,
    totalCount: 40,
    status: "error",
    blockingIssues: ["8 employees failed drug test", "6 certifications expired"],
  },
]

export function LocationReadiness() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground">Location Readiness</h2>
        <p className="mt-1 text-sm text-muted-foreground">Per-site crew readiness vs requirements</p>
      </div>

      <div className="divide-y divide-border">
        {locations.map((location) => {
          const Icon = location.status === "success" ? CheckCircle2 : AlertTriangle
          return (
            <div key={location.id} className="p-4 transition-colors hover:bg-accent/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-card-foreground">{location.name}</p>
                      <Icon
                        className={`h-4 w-4 ${
                          location.status === "success"
                            ? "text-chart-2"
                            : location.status === "warning"
                              ? "text-chart-5"
                              : "text-destructive"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {location.readyCount} / {location.totalCount} ready
                      </span>
                    </div>
                    <div className="w-64">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full ${
                            location.status === "success"
                              ? "bg-chart-2"
                              : location.status === "warning"
                                ? "bg-chart-5"
                                : "bg-destructive"
                          }`}
                          style={{ width: `${location.readyPercentage}%` }}
                        />
                      </div>
                    </div>
                    {location.blockingIssues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Blocking Issues:</p>
                        {location.blockingIssues.map((issue, idx) => (
                          <p key={idx} className="text-xs text-destructive">
                            • {issue}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-card-foreground">{location.readyPercentage}%</p>
                  <button className="mt-2 text-sm font-medium text-primary hover:underline">Drill Down</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

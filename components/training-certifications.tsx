"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award, AlertTriangle, CheckCircle2 } from "lucide-react"

export function TrainingCertifications() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Assignments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,842</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">3,456</div>
            <p className="text-xs text-muted-foreground">90% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,892</div>
            <p className="text-xs text-muted-foreground">Valid certifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">127</div>
            <p className="text-xs text-muted-foreground">Within 60 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Training Compliance by Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: "ABC Trucking Co.", completed: 94, total: 98, status: "green" },
                { company: "XYZ Logistics LLC", completed: 156, total: 178, status: "yellow" },
                { company: "FastHaul Transport", completed: 48, total: 72, status: "red" },
                { company: "SafeRoad Services", completed: 88, total: 92, status: "green" },
                { company: "Premier Freight Inc.", completed: 72, total: 86, status: "yellow" },
              ].map((item) => (
                <div key={item.company} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.company}</span>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "green"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : item.status === "yellow"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {item.completed}/{item.total}
                    </Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        item.status === "green"
                          ? "bg-green-500"
                          : item.status === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${(item.completed / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certification Status by Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: "ABC Trucking Co.", current: 142, expiring: 8, expired: 2, status: "green" },
                { company: "XYZ Logistics LLC", current: 218, expiring: 24, expired: 12, status: "yellow" },
                { company: "FastHaul Transport", current: 68, expiring: 18, expired: 22, status: "red" },
                { company: "SafeRoad Services", current: 96, expiring: 6, expired: 1, status: "green" },
                { company: "Premier Freight Inc.", current: 88, expiring: 14, expired: 5, status: "yellow" },
              ].map((item) => (
                <div key={item.company} className="rounded-lg border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.company}</span>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "green"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : item.status === "yellow"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {item.status === "green" ? "Compliant" : item.status === "yellow" ? "At Risk" : "Non-Compliant"}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-400">{item.current} Current</span>
                    <span className="text-yellow-400">{item.expiring} Expiring</span>
                    <span className="text-red-400">{item.expired} Expired</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

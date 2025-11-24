"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, AlertTriangle, CheckCircle2 } from "lucide-react"

export function GeoFenceCompliance() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Geo-fenced locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Site Now</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Active check-ins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Sites</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">44</div>
            <p className="text-xs text-muted-foreground">92% of sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geo Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">4</div>
            <p className="text-xs text-muted-foreground">Non-compliant on-site</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Site Compliance Status</CardTitle>
            <Button>View Full Map</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                site: "ABC Trucking - Dallas Yard",
                company: "ABC Trucking Co.",
                onSite: 42,
                compliant: 42,
                nonCompliant: 0,
                status: "green",
              },
              {
                site: "XYZ Logistics - Houston Hub",
                company: "XYZ Logistics LLC",
                onSite: 68,
                compliant: 65,
                nonCompliant: 3,
                status: "yellow",
              },
              {
                site: "FastHaul - Austin Terminal",
                company: "FastHaul Transport",
                onSite: 28,
                compliant: 26,
                nonCompliant: 2,
                status: "red",
              },
              {
                site: "SafeRoad - San Antonio",
                company: "SafeRoad Services",
                onSite: 35,
                compliant: 35,
                nonCompliant: 0,
                status: "green",
              },
              {
                site: "Premier Freight - Fort Worth",
                company: "Premier Freight Inc.",
                onSite: 52,
                compliant: 52,
                nonCompliant: 0,
                status: "green",
              },
            ].map((item) => (
              <div key={item.site} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{item.site}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.company}</span>
                  </div>
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
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">On-Site:</span>
                    <span className="font-medium text-foreground">{item.onSite}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-muted-foreground">Compliant:</span>
                    <span className="font-medium text-green-400">{item.compliant}</span>
                  </div>
                  {item.nonCompliant > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-muted-foreground">Non-Compliant:</span>
                      <span className="font-medium text-red-400">{item.nonCompliant}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

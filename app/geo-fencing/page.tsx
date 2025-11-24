"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, CheckCircle2, Plus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GeoFenceMapNoAPI } from "@/components/geo-fence-map-no-api"

export default function GeoFencingPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Geo-Fencing System</h1>
        <p className="text-muted-foreground">Location-based compliance triggers and site check-in management</p>
      </div>

      <Tabs defaultValue="live-map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live-map">Live Map</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="check-ins">Check-In History</TabsTrigger>
          <TabsTrigger value="triggers">Compliance Triggers</TabsTrigger>
          <TabsTrigger value="routes">Route Monitoring</TabsTrigger>
        </TabsList>

        {/* Live Map Tab */}
        <TabsContent value="live-map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employees On-Site</CardTitle>
              <CardDescription>Real-time location tracking of checked-in employees</CardDescription>
            </CardHeader>
            <CardContent>
              <GeoFenceMapNoAPI />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zones Tab */}
        <TabsContent value="zones" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Input placeholder="Search zones..." className="w-64" />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Zone
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              {
                name: "California",
                type: "State",
                sites: 12,
                requirements: ["CA Background Check (10yr)", "CA Drug Testing"],
                color: "blue",
              },
              {
                name: "Texas",
                type: "State",
                sites: 8,
                requirements: ["Standard Background Check", "DOT Physical"],
                color: "green",
              },
              {
                name: "Construction Site Alpha",
                type: "Site",
                sites: 1,
                requirements: ["OSHA 10", "Hard Hat Training", "Site Safety"],
                color: "amber",
              },
              {
                name: "Downtown Office",
                type: "Site",
                sites: 1,
                requirements: ["Background Check", "Security Clearance"],
                color: "purple",
              },
            ].map((zone) => (
              <Card key={zone.name} className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{zone.name}</h3>
                        <Badge variant="outline">{zone.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{zone.sites} site(s) in this zone</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Compliance Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {zone.requirements.map((req) => (
                            <Badge key={req} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Zone
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Check-In History Tab */}
        <TabsContent value="check-ins" className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Search employee..." className="w-64" />
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="site-a">Site A</SelectItem>
                <SelectItem value="site-b">Site B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    employee: "John Smith",
                    site: "Construction Site Alpha",
                    checkIn: "2024-01-15 08:15 AM",
                    checkOut: "2024-01-15 05:30 PM",
                    method: "GPS",
                    status: "success",
                  },
                  {
                    employee: "Jane Doe",
                    site: "Downtown Office",
                    checkIn: "2024-01-15 09:00 AM",
                    checkOut: "Still on-site",
                    method: "QR Code",
                    status: "active",
                  },
                  {
                    employee: "Mike Johnson",
                    site: "Construction Site Alpha",
                    checkIn: "2024-01-15 07:45 AM",
                    checkOut: "2024-01-15 04:15 PM",
                    method: "GPS",
                    status: "success",
                  },
                  {
                    employee: "Sarah Williams",
                    site: "Texas Warehouse",
                    checkIn: "2024-01-15 10:30 AM",
                    checkOut: "Still on-site",
                    method: "GPS",
                    status: "active",
                  },
                ].map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          record.status === "active" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {record.status === "active" ? (
                          <MapPin className="h-5 w-5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{record.employee}</p>
                        <p className="text-sm text-muted-foreground">{record.site}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-sm text-muted-foreground">Check-In</p>
                        <p className="text-sm font-medium text-foreground">{record.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-Out</p>
                        <p className="text-sm font-medium text-foreground">{record.checkOut}</p>
                      </div>
                      <Badge variant="outline">{record.method}</Badge>
                      {record.status === "active" && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On-Site</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Triggers Tab */}
        <TabsContent value="triggers" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Configure automatic compliance requirements based on location
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Trigger
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              {
                zone: "California",
                trigger: "Employee enters zone",
                action: "Require CA Background Check (10-year lookback)",
                status: "active",
              },
              {
                zone: "DOT Routes",
                trigger: "Driver assigned to route",
                action: "Require DOT Medical Exam + Drug Test",
                status: "active",
              },
              {
                zone: "Construction Sites",
                trigger: "Employee checks in",
                action: "Verify OSHA 10 + Hard Hat Training",
                status: "active",
              },
              {
                zone: "Healthcare Facilities",
                trigger: "Employee enters zone",
                action: "Require TB Test + Immunization Records",
                status: "active",
              },
            ].map((trigger, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{trigger.zone}</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {trigger.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">When:</span>
                          <span className="font-medium text-foreground">{trigger.trigger}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Then:</span>
                          <span className="font-medium text-foreground">{trigger.action}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Disable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Route Monitoring Tab */}
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Routes</CardTitle>
              <CardDescription>Monitor driver compliance across state boundaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    driver: "Mike Johnson",
                    route: "CA → NV → AZ",
                    status: "compliant",
                    states: ["California", "Nevada", "Arizona"],
                    violations: 0,
                  },
                  {
                    driver: "Sarah Williams",
                    route: "TX → NM → CO",
                    status: "compliant",
                    states: ["Texas", "New Mexico", "Colorado"],
                    violations: 0,
                  },
                  {
                    driver: "Tom Brown",
                    route: "FL → GA → SC",
                    status: "warning",
                    states: ["Florida", "Georgia", "South Carolina"],
                    violations: 1,
                  },
                ].map((route, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          route.status === "compliant" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {route.status === "compliant" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{route.driver}</p>
                        <p className="text-sm text-muted-foreground">{route.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">States Crossed</p>
                        <p className="text-sm font-medium text-foreground">{route.states.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Violations</p>
                        <p
                          className={`text-sm font-medium ${route.violations > 0 ? "text-amber-600" : "text-green-600"}`}
                        >
                          {route.violations}
                        </p>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geo-Fence Violations</CardTitle>
              <CardDescription>Employees who entered zones without required compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    employee: "Tom Brown",
                    zone: "South Carolina",
                    violation: "Missing SC-specific background check",
                    timestamp: "2024-01-15 02:30 PM",
                  },
                ].map((violation, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-foreground">{violation.employee}</p>
                        <p className="text-sm text-muted-foreground">
                          {violation.zone} - {violation.violation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Detected</p>
                        <p className="text-sm font-medium text-foreground">{violation.timestamp}</p>
                      </div>
                      <Button size="sm">Resolve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

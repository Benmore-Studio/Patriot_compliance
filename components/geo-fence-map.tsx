"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, AlertTriangle, CheckCircle2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface GeoFenceZone {
  id: string
  name: string
  type: "rig" | "yard" | "office"
  employees: number
  compliant: number
  alerts: number
  color: string
  position: { x: number; y: number }
}

const mockZones: GeoFenceZone[] = [
  {
    id: "zone-1",
    name: "Rig Site Alpha",
    type: "rig",
    employees: 24,
    compliant: 22,
    alerts: 2,
    color: "bg-blue-500",
    position: { x: 20, y: 30 },
  },
  {
    id: "zone-2",
    name: "Rig Site Bravo",
    type: "rig",
    employees: 18,
    compliant: 18,
    alerts: 0,
    color: "bg-green-500",
    position: { x: 60, y: 25 },
  },
  {
    id: "zone-3",
    name: "Equipment Yard",
    type: "yard",
    employees: 12,
    compliant: 10,
    alerts: 2,
    color: "bg-yellow-500",
    position: { x: 40, y: 60 },
  },
  {
    id: "zone-4",
    name: "Main Office",
    type: "office",
    employees: 8,
    compliant: 8,
    alerts: 0,
    color: "bg-purple-500",
    position: { x: 75, y: 70 },
  },
]

export function GeoFenceMap() {
  const [selectedZone, setSelectedZone] = useState<GeoFenceZone | null>(null)
  const [zoom, setZoom] = useState(1)

  const totalEmployees = mockZones.reduce((sum, zone) => sum + zone.employees, 0)
  const totalCompliant = mockZones.reduce((sum, zone) => sum + zone.compliant, 0)
  const totalAlerts = mockZones.reduce((sum, zone) => sum + zone.alerts, 0)

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockZones.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Employees On-Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalCompliant}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAlerts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Map Area */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Geo-Fence Monitoring</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(zoom + 0.2, 2))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] bg-muted/30 rounded-lg border overflow-hidden">
              {/* Grid Background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Zones */}
              {mockZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`absolute group transition-all duration-200 ${
                    selectedZone?.id === zone.id ? "scale-110 z-10" : "hover:scale-105"
                  }`}
                  style={{
                    left: `${zone.position.x}%`,
                    top: `${zone.position.y}%`,
                    transform: `translate(-50%, -50%) scale(${zoom})`,
                  }}
                >
                  {/* Zone Circle */}
                  <div className={`w-20 h-20 rounded-full ${zone.color} opacity-20 absolute -inset-4 animate-pulse`} />
                  <div
                    className={`w-12 h-12 rounded-full ${zone.color} flex items-center justify-center shadow-lg border-2 border-background`}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>

                  {/* Zone Label */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-background border rounded-lg px-2 py-1 shadow-lg">
                      <p className="text-xs font-medium">{zone.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {zone.employees}
                        </span>
                        {zone.alerts > 0 && (
                          <Badge variant="destructive" className="h-4 px-1 text-xs">
                            {zone.alerts}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-background border rounded-lg p-3 shadow-lg">
                <p className="text-xs font-medium mb-2">Zone Types</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Rig Site</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Yard</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Office</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{selectedZone ? "Zone Details" : "Select a Zone"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedZone ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {selectedZone.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Employees</span>
                    <span className="font-medium">{selectedZone.employees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Compliant</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">{selectedZone.compliant}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Alerts</span>
                    <div className="flex items-center gap-1">
                      {selectedZone.alerts > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-600">{selectedZone.alerts}</span>
                        </>
                      ) : (
                        <span className="font-medium text-green-600">None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full" size="sm">
                    View All Employees
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" size="sm">
                    Check-In History
                  </Button>
                  {selectedZone.alerts > 0 && (
                    <Button className="w-full" variant="destructive" size="sm">
                      View Alerts
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Recent Check-Ins</h4>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Employee {i + 1}</span>
                        <span className="text-muted-foreground">2 hours ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Click on a zone marker to view details and employee information
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

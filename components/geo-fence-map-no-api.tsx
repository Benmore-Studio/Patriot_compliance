"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, AlertTriangle, CheckCircle2, XCircle, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

// Texas construction site locations (using relative positioning)
const TEXAS_SITES = [
  {
    id: "dallas-site",
    name: "Dallas Construction Site",
    position: { x: 52, y: 35 }, // percentage position on map
    address: "1234 Commerce St, Dallas, TX 75201",
    radius: 80, // pixels
    activeEmployees: 24,
    alertCount: 3,
  },
  {
    id: "houston-site",
    name: "Houston Refinery",
    position: { x: 58, y: 68 },
    address: "5678 Industrial Blvd, Houston, TX 77002",
    radius: 100,
    activeEmployees: 42,
    alertCount: 1,
  },
  {
    id: "austin-site",
    name: "Austin Tech Campus",
    position: { x: 48, y: 52 },
    address: "9012 Tech Ridge, Austin, TX 78701",
    radius: 90,
    activeEmployees: 18,
    alertCount: 0,
  },
  {
    id: "san-antonio-site",
    name: "San Antonio Pipeline",
    position: { x: 45, y: 62 },
    address: "3456 Pipeline Rd, San Antonio, TX 78205",
    radius: 95,
    activeEmployees: 31,
    alertCount: 2,
  },
]

// Mock employee data with relative positions
const EMPLOYEES = [
  { id: 1, name: "John Smith", status: "compliant", position: { x: 52.5, y: 35.2 }, siteId: "dallas-site" },
  { id: 2, name: "Sarah Johnson", status: "alert", position: { x: 51.8, y: 35.5 }, siteId: "dallas-site" },
  { id: 3, name: "Mike Davis", status: "compliant", position: { x: 52.2, y: 34.8 }, siteId: "dallas-site" },
  { id: 4, name: "Emily Wilson", status: "non-compliant", position: { x: 51.5, y: 35.3 }, siteId: "dallas-site" },
  { id: 5, name: "David Brown", status: "compliant", position: { x: 58.3, y: 68.2 }, siteId: "houston-site" },
  { id: 6, name: "Lisa Anderson", status: "compliant", position: { x: 57.8, y: 67.8 }, siteId: "houston-site" },
  { id: 7, name: "James Taylor", status: "alert", position: { x: 58.5, y: 68.5 }, siteId: "houston-site" },
  { id: 8, name: "Maria Garcia", status: "compliant", position: { x: 48.2, y: 52.3 }, siteId: "austin-site" },
  { id: 9, name: "Robert Martinez", status: "compliant", position: { x: 47.8, y: 51.8 }, siteId: "austin-site" },
  { id: 10, name: "Jennifer Lee", status: "compliant", position: { x: 45.3, y: 62.2 }, siteId: "san-antonio-site" },
  { id: 11, name: "William Clark", status: "alert", position: { x: 44.8, y: 61.8 }, siteId: "san-antonio-site" },
  {
    id: 12,
    name: "Patricia Rodriguez",
    status: "non-compliant",
    position: { x: 45.5, y: 62.5 },
    siteId: "san-antonio-site",
  },
]

export function GeoFenceMapNoAPI() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [hoveredEmployee, setHoveredEmployee] = useState<number | null>(null)

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2))
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5))

  const selectedSiteData = TEXAS_SITES.find((s) => s.id === selectedSite)
  const siteEmployees = EMPLOYEES.filter((e) => e.siteId === selectedSite)
  const hoveredEmployeeData = EMPLOYEES.find((e) => e.id === hoveredEmployee)

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Map Container */}
      <div className="flex-1 relative rounded-lg overflow-hidden border bg-[#e5e3df]">
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            backgroundImage: `
              linear-gradient(to right, #d4d2ce 1px, transparent 1px),
              linear-gradient(to bottom, #d4d2ce 1px, transparent 1px),
              linear-gradient(to right, #c4c2be 2px, transparent 2px),
              linear-gradient(to bottom, #c4c2be 2px, transparent 2px)
            `,
            backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Simplified Texas outline */}
            <path
              d="M 30 20 L 70 20 L 75 30 L 80 40 L 80 70 L 70 85 L 50 90 L 30 85 L 25 70 L 20 50 L 25 30 Z"
              fill="#f0ede8"
              stroke="#b8b6b2"
              strokeWidth="0.5"
              opacity="0.3"
            />

            {/* Major highways (simplified) */}
            <line x1="30" y1="35" x2="70" y2="35" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />
            <line x1="45" y1="20" x2="45" y2="85" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />
            <line x1="55" y1="25" x2="55" y2="80" stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />
          </svg>

          {TEXAS_SITES.map((site) => (
            <div
              key={site.id}
              className="absolute"
              style={{
                left: `${site.position.x}%`,
                top: `${site.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Radius circle */}
              <div
                className={`absolute rounded-full border-2 transition-all ${
                  site.alertCount > 0 ? "border-red-500 bg-red-500/10" : "border-green-500 bg-green-500/10"
                }`}
                style={{
                  width: `${site.radius}px`,
                  height: `${site.radius}px`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />

              {/* Site marker */}
              <button
                onClick={() => setSelectedSite(site.id)}
                className={`relative z-10 w-8 h-8 rounded-full border-3 border-white shadow-lg transition-all hover:scale-110 ${
                  site.alertCount > 0 ? "bg-red-500" : "bg-green-500"
                } ${selectedSite === site.id ? "ring-4 ring-blue-500" : ""}`}
              >
                <MapPin className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </button>
            </div>
          ))}

          {EMPLOYEES.map((employee) => (
            <div
              key={employee.id}
              className="absolute z-20"
              style={{
                left: `${employee.position.x}%`,
                top: `${employee.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredEmployee(employee.id)}
              onMouseLeave={() => setHoveredEmployee(null)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-all hover:scale-125 ${
                  employee.status === "compliant"
                    ? "bg-green-500"
                    : employee.status === "alert"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
            </div>
          ))}
        </div>

        {hoveredEmployeeData && (
          <Card className="absolute top-4 left-1/2 -translate-x-1/2 p-3 z-30 shadow-lg">
            <div className="text-sm font-semibold">{hoveredEmployeeData.name}</div>
            <div
              className={`text-xs flex items-center gap-1 mt-1 ${
                hoveredEmployeeData.status === "compliant"
                  ? "text-green-600"
                  : hoveredEmployeeData.status === "alert"
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {hoveredEmployeeData.status === "compliant" && <CheckCircle2 className="h-3 w-3" />}
              {hoveredEmployeeData.status === "alert" && <AlertTriangle className="h-3 w-3" />}
              {hoveredEmployeeData.status === "non-compliant" && <XCircle className="h-3 w-3" />}
              {hoveredEmployeeData.status === "compliant"
                ? "Compliant"
                : hoveredEmployeeData.status === "alert"
                  ? "Alert"
                  : "Non-Compliant"}
            </div>
          </Card>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <Button size="icon" variant="secondary" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <Card className="absolute bottom-4 left-4 p-3 z-30">
          <div className="text-xs font-semibold mb-2">Legend</div>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Non-Compliant</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <Card className="w-80 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5" />
          <h3 className="font-semibold">Texas Sites</h3>
        </div>

        <div className="space-y-3">
          {TEXAS_SITES.map((site) => (
            <Card
              key={site.id}
              className={`p-3 cursor-pointer transition-colors ${
                selectedSite === site.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedSite(site.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-sm">{site.name}</div>
                {site.alertCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {site.alertCount} alerts
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-2">{site.address}</div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{site.activeEmployees} on-site</span>
                </div>
                <div className="text-muted-foreground">{site.radius * 5}ft radius</div>
              </div>
            </Card>
          ))}
        </div>

        {selectedSiteData && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-sm mb-3">On-Site Employees</h4>
            <div className="space-y-2">
              {siteEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between text-sm">
                  <span>{employee.name}</span>
                  {employee.status === "compliant" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {employee.status === "alert" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {employee.status === "non-compliant" && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

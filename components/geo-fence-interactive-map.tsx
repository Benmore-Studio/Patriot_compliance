"use client"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface Employee {
  id: string
  name: string
  lat: number
  lng: number
  status: "compliant" | "expiring" | "non-compliant"
  checkInTime: string
  location: string
}

interface GeoFenceZone {
  id: string
  name: string
  lat: number
  lng: number
  radius: 500 // feet
  color: string
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    lat: 32.7767,
    lng: -96.797,
    status: "compliant",
    checkInTime: "8:00 AM",
    location: "Dallas Site A",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    lat: 32.78,
    lng: -96.8,
    status: "compliant",
    checkInTime: "7:45 AM",
    location: "Dallas Site A",
  },
  {
    id: "3",
    name: "Mike Davis",
    lat: 29.7604,
    lng: -95.3698,
    status: "expiring",
    checkInTime: "8:15 AM",
    location: "Houston Site B",
  },
  {
    id: "4",
    name: "Emily Wilson",
    lat: 29.765,
    lng: -95.375,
    status: "non-compliant",
    checkInTime: "9:00 AM",
    location: "Houston Site B",
  },
  {
    id: "5",
    name: "David Brown",
    lat: 34.0522,
    lng: -118.2437,
    status: "compliant",
    checkInTime: "6:30 AM",
    location: "LA Site C",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    lat: 34.055,
    lng: -118.25,
    status: "expiring",
    checkInTime: "7:00 AM",
    location: "LA Site C",
  },
]

const zones: GeoFenceZone[] = [
  { id: "zone1", name: "Dallas Site A", lat: 32.7767, lng: -96.797, radius: 500, color: "#3b82f6" },
  { id: "zone2", name: "Houston Site B", lat: 29.7604, lng: -95.3698, radius: 500, color: "#8b5cf6" },
  { id: "zone3", name: "LA Site C", lat: 34.0522, lng: -118.2437, radius: 500, color: "#10b981" },
]

export function GeoFenceInteractiveMap({ companyFilter }: { companyFilter?: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  const stats = {
    onSite: mockEmployees.length,
    compliant: mockEmployees.filter((e) => e.status === "compliant").length,
    expiring: mockEmployees.filter((e) => e.status === "expiring").length,
    nonCompliant: mockEmployees.filter((e) => e.status === "non-compliant").length,
  }

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "compliant":
        return "#10b981"
      case "expiring":
        return "#f59e0b"
      case "non-compliant":
        return "#ef4444"
    }
  }

  const getStatusIcon = (status: Employee["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4" />
      case "expiring":
        return <AlertTriangle className="h-4 w-4" />
      case "non-compliant":
        return <XCircle className="h-4 w-4" />
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Live Geo-Fence Tracking</h3>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            On-Site: {stats.onSite}
          </Badge>
          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Compliant: {stats.compliant}
          </Badge>
          <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600">
            <AlertTriangle className="h-3 w-3" />
            Expiring: {stats.expiring}
          </Badge>
          <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
            <XCircle className="h-3 w-3" />
            Non-Compliant: {stats.nonCompliant}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Area */}
        <div
          className="lg:col-span-3 relative bg-slate-50 rounded-lg border-2 border-slate-200 overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Simulated US Map with zones */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 1000 600" className="w-full h-full">
              {/* Background */}
              <rect width="1000" height="600" fill="#f8fafc" />

              {/* Simplified US outline */}
              <path
                d="M 100 200 L 200 150 L 300 180 L 400 160 L 500 170 L 600 150 L 700 180 L 800 200 L 850 250 L 900 300 L 850 400 L 800 450 L 700 480 L 600 500 L 500 490 L 400 500 L 300 480 L 200 450 L 150 400 L 100 300 Z"
                fill="#e2e8f0"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Geo-fence zones with 500ft radius circles */}
              {zones.map((zone, idx) => {
                const x = 200 + idx * 300
                const y = 250 + (idx % 2 === 0 ? 0 : 50)
                return (
                  <g key={zone.id}>
                    {/* Zone circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r="60"
                      fill={zone.color}
                      fillOpacity="0.2"
                      stroke={zone.color}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="cursor-pointer transition-all hover:fill-opacity-30"
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                    />
                    {/* Zone label */}
                    <text x={x} y={y - 70} textAnchor="middle" fill="#1e293b" fontSize="14" fontWeight="600">
                      {zone.name}
                    </text>
                    <text x={x} y={y - 55} textAnchor="middle" fill="#64748b" fontSize="12">
                      500ft radius
                    </text>
                  </g>
                )
              })}

              {/* Employee location pins */}
              {mockEmployees.map((employee, idx) => {
                const x = 200 + Math.floor(idx / 2) * 300 + (idx % 2 === 0 ? -20 : 20)
                const y = 250 + (Math.floor(idx / 2) % 2 === 0 ? 0 : 50) + (idx % 2 === 0 ? -15 : 15)
                const color = getStatusColor(employee.status)

                return (
                  <g
                    key={employee.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setSelectedEmployee(employee)}
                    onMouseLeave={() => setSelectedEmployee(null)}
                  >
                    {/* Pin shadow */}
                    <ellipse cx={x} cy={y + 18} rx="8" ry="3" fill="#000" fillOpacity="0.2" />

                    {/* Pin body */}
                    <path
                      d={`M ${x} ${y - 15} C ${x - 10} ${y - 15} ${x - 15} ${y - 10} ${x - 15} ${y} C ${x - 15} ${y + 5} ${x} ${y + 15} ${x} ${y + 15} C ${x} ${y + 15} ${x + 15} ${y + 5} ${x + 15} ${y} C ${x + 15} ${y - 10} ${x + 10} ${y - 15} ${x} ${y - 15} Z`}
                      fill={color}
                      stroke="#fff"
                      strokeWidth="2"
                    />

                    {/* Pin center dot */}
                    <circle cx={x} cy={y - 5} r="4" fill="#fff" />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Hover tooltip */}
          {selectedEmployee && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 border-2 border-slate-200 z-10 min-w-[250px]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <Users className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{selectedEmployee.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedEmployee.location}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`gap-1 ${
                          selectedEmployee.status === "compliant"
                            ? "text-green-600 border-green-600"
                            : selectedEmployee.status === "expiring"
                              ? "text-yellow-600 border-yellow-600"
                              : "text-red-600 border-red-600"
                        }`}
                      >
                        {getStatusIcon(selectedEmployee.status)}
                        {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Check-in: {selectedEmployee.checkInTime}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zone info tooltip */}
          {hoveredZone && (
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border-2 border-slate-200 z-10">
              <p className="text-sm font-semibold">{zones.find((z) => z.id === hoveredZone)?.name}</p>
              <p className="text-xs text-muted-foreground">Geo-fence radius: 500 feet</p>
            </div>
          )}
        </div>

        {/* Employee List Sidebar */}
        <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto">
          <h4 className="font-semibold text-sm mb-3">On-Site Employees</h4>
          {mockEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="p-3 cursor-pointer hover:bg-slate-50 transition-colors"
              onMouseEnter={() => setSelectedEmployee(employee)}
              onMouseLeave={() => setSelectedEmployee(null)}
            >
              <div className="flex items-start gap-2">
                <div
                  className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: getStatusColor(employee.status) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{employee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{employee.location}</p>
                  <p className="text-xs text-muted-foreground">{employee.checkInTime}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Expiring Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Non-Compliant</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

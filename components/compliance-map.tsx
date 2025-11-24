"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  status: "green" | "yellow" | "red" | "locked"
  complianceScore: number
  alertCount: number
}

const mockLocations: MapLocation[] = [
  {
    id: "1",
    name: "ABC Trucking - Dallas Yard",
    lat: 32.7767,
    lng: -96.797,
    status: "green",
    complianceScore: 94,
    alertCount: 2,
  },
  {
    id: "2",
    name: "XYZ Logistics - Houston Hub",
    lat: 29.7604,
    lng: -95.3698,
    status: "yellow",
    complianceScore: 78,
    alertCount: 8,
  },
  {
    id: "3",
    name: "FastHaul - Austin Terminal",
    lat: 30.2672,
    lng: -97.7431,
    status: "locked",
    complianceScore: 60,
    alertCount: 15,
  },
  {
    id: "4",
    name: "SafeRoad - San Antonio",
    lat: 29.4241,
    lng: -98.4936,
    status: "green",
    complianceScore: 88,
    alertCount: 3,
  },
  {
    id: "5",
    name: "Premier Freight - Fort Worth",
    lat: 32.7555,
    lng: -97.3308,
    status: "yellow",
    complianceScore: 72,
    alertCount: 6,
  },
]

interface ComplianceMapProps {
  selectedCompany: string | null
}

export function ComplianceMap({ selectedCompany }: ComplianceMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      case "locked":
        return "bg-gray-500"
      default:
        return "bg-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "green":
        return "Compliant"
      case "yellow":
        return "At Risk"
      case "red":
        return "Non-Compliant"
      case "locked":
        return "Billing Hold"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interactive Compliance Map</span>
          <Button variant="outline" size="sm">
            <ZoomIn className="mr-2 h-4 w-4" />
            Full Screen
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[500px] rounded-lg border border-border bg-muted/20">
          {/* Map placeholder with pins */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interactive map showing service company locations</p>
              <p className="text-xs text-muted-foreground">Color-coded pins indicate compliance status</p>
            </div>
          </div>

          {/* Mock pins positioned on map */}
          <div className="absolute left-[20%] top-[30%]">
            <div className="group relative cursor-pointer">
              <div className={`h-4 w-4 rounded-full ${getStatusColor("green")} animate-pulse`} />
              <div className="absolute left-6 top-0 hidden w-64 rounded-lg border border-border bg-card p-3 shadow-lg group-hover:block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground">ABC Trucking - Dallas Yard</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">
                    Compliant
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Score:</span>
                    <span className="font-medium text-green-400">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Alerts:</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-[35%] top-[60%]">
            <div className="group relative cursor-pointer">
              <div className={`h-4 w-4 rounded-full ${getStatusColor("yellow")} animate-pulse`} />
              <div className="absolute left-6 top-0 hidden w-64 rounded-lg border border-border bg-card p-3 shadow-lg group-hover:block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground">XYZ Logistics - Houston Hub</span>
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
                    At Risk
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Score:</span>
                    <span className="font-medium text-yellow-400">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Alerts:</span>
                    <span className="font-medium text-yellow-400">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-[45%] top-[45%]">
            <div className="group relative cursor-pointer">
              <div className={`h-4 w-4 rounded-full ${getStatusColor("locked")} animate-pulse`} />
              <div className="absolute left-6 top-0 hidden w-64 rounded-lg border border-border bg-card p-3 shadow-lg group-hover:block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground">FastHaul - Austin Terminal</span>
                  <Badge variant="outline" className="bg-gray-500/20 text-gray-400">
                    Billing Hold
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Score:</span>
                    <span className="font-medium text-red-400">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Alerts:</span>
                    <span className="font-medium text-red-400">15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-[30%] top-[70%]">
            <div className="group relative cursor-pointer">
              <div className={`h-4 w-4 rounded-full ${getStatusColor("green")} animate-pulse`} />
            </div>
          </div>

          <div className="absolute left-[25%] top-[35%]">
            <div className="group relative cursor-pointer">
              <div className={`h-4 w-4 rounded-full ${getStatusColor("yellow")} animate-pulse`} />
            </div>
          </div>
        </div>

        {/* Map legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Compliant (Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">At Risk (Yellow)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Non-Compliant (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-500" />
            <span className="text-sm text-muted-foreground">Billing Hold (Locked)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

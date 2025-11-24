"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Syringe,
  FileCheck,
  Truck,
  Heart,
  GraduationCap,
  MapPin,
  AlertTriangle,
  Info,
  AlertCircle,
  Users,
  Clock,
  Calendar,
  Building2,
  TrendingUp,
  LayoutGrid,
  List,
  Eye,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GeoFenceMapNoAPI } from "@/components/geo-fence-map-no-api"

export default function DERAdminDashboard() {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"tiles" | "details" | "preview">("tiles")

  // Compliance data for policy tiles
  const policyData = [
    { name: "Drug Testing", percentage: 92, icon: Syringe, color: "text-green-600" },
    { name: "Background", percentage: 87, icon: FileCheck, color: "text-green-600" },
    { name: "DOT", percentage: 91, icon: Truck, color: "text-green-600" },
    { name: "Health", percentage: 96, icon: Heart, color: "text-green-600" },
    { name: "Training", percentage: 89, icon: GraduationCap, color: "text-yellow-600" },
    { name: "Geo-Fence", percentage: 98, icon: MapPin, color: "text-green-600" },
  ]

  // Alerts data
  const criticalAlerts = [
    {
      id: "1",
      title: "Drug Test Overdue",
      employee: "John Martinez",
      timestamp: "2 hours ago",
      icon: AlertCircle,
      details: {
        type: "Drug Test",
        dueDate: "2025-01-13",
        policy: "DOT Random Testing",
        location: "Houston Yard",
        notes: "Employee has not completed required random drug test. Immediate action required.",
      },
    },
    {
      id: "2",
      title: "Medical Certification Expired",
      employee: "Sarah Johnson",
      timestamp: "4 hours ago",
      icon: AlertCircle,
      details: {
        type: "Medical Certification",
        dueDate: "2025-01-12",
        policy: "DOT Medical Card",
        location: "Dallas Office",
        notes: "DOT medical certification expired. Employee cannot operate CMV until renewed.",
      },
    },
    {
      id: "3",
      title: "Background Check Failed",
      employee: "Mike Davis",
      timestamp: "6 hours ago",
      icon: AlertCircle,
      details: {
        type: "Background Check",
        dueDate: "2025-01-11",
        policy: "Pre-Employment Screening",
        location: "Austin Site",
        notes: "Background check returned with discrepancies. HR review required before hire.",
      },
    },
  ]

  const warningAlerts = [
    {
      id: "4",
      title: "Training Expiring Soon",
      employee: "Emily Chen",
      timestamp: "1 day ago",
      icon: AlertTriangle,
      details: {
        type: "Training Certification",
        dueDate: "2025-01-25",
        policy: "HAZMAT Training",
        location: "San Antonio Facility",
        notes: "HAZMAT certification expires in 10 days. Schedule renewal training.",
      },
    },
    {
      id: "5",
      title: "Physical Exam Due",
      employee: "Robert Wilson",
      timestamp: "1 day ago",
      icon: AlertTriangle,
      details: {
        type: "Physical Exam",
        dueDate: "2025-01-28",
        policy: "Annual Physical",
        location: "Houston Clinic",
        notes: "Annual physical exam due within 2 weeks. Schedule appointment.",
      },
    },
  ]

  const infoAlerts = [
    {
      id: "6",
      title: "New Employee Onboarded",
      employee: "Lisa Anderson",
      timestamp: "2 days ago",
      icon: Info,
      details: {
        type: "Onboarding",
        dueDate: "2025-01-13",
        policy: "New Hire Process",
        location: "Corporate Office",
        notes: "New employee successfully onboarded. All initial compliance checks complete.",
      },
    },
  ]

  // Audit queue data
  const auditQueue = [
    {
      id: "1",
      employee: "John Martinez",
      type: "Drug Test",
      action: "Review Results",
      priority: "High",
      dueDate: "Today",
      status: "Pending",
    },
    {
      id: "2",
      employee: "Sarah Johnson",
      type: "Medical Cert",
      action: "Verify Documents",
      priority: "High",
      dueDate: "Today",
      status: "Pending",
    },
    {
      id: "3",
      employee: "Mike Davis",
      type: "Background",
      action: "Review Report",
      priority: "Critical",
      dueDate: "Overdue",
      status: "Action Required",
    },
    {
      id: "4",
      employee: "Emily Chen",
      type: "Training",
      action: "Approve Certificate",
      priority: "Medium",
      dueDate: "Tomorrow",
      status: "Pending",
    },
    {
      id: "5",
      employee: "Robert Wilson",
      type: "Physical",
      action: "Schedule Exam",
      priority: "Medium",
      dueDate: "3 days",
      status: "Pending",
    },
  ]

  const handleSelectAlert = (id: string) => {
    setSelectedAlerts((prev) => (prev.includes(id) ? prev.filter((alertId) => alertId !== id) : [...prev, id]))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          {/* Circular Compliance Meter - Left Side */}
          <Card className="p-6 w-[280px] shrink-0">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-secondary"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#16a34a"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (94 / 100) * 427}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-green-600 leading-none">94%</span>
                  <span className="mt-2 text-xs text-muted-foreground">Overall</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+2.4% from last month</span>
              </div>
            </div>
          </Card>

          {/* Policy Compliance Grid - Top Right */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-3">Policy Compliance</h2>
            <div className="grid grid-cols-3 gap-3">
              {policyData.map((policy) => (
                <Card key={policy.name} className="p-3 cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg bg-secondary ${policy.color}`}>
                      <policy.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs truncate">{policy.name}</h3>
                    </div>
                  </div>
                  <p className="text-xl font-bold mb-1.5">{policy.percentage}%</p>
                  <Progress value={policy.percentage} className="h-1" />
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div>
          <GeoFenceMapNoAPI />
          <div className="mt-2 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <a href="/geo-fencing">View Full Map</a>
            </Button>
          </div>
        </div>

        {/* Policy-Specific Trackers */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Policy-Specific Trackers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">DOT Policy</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Random Tests</span>
                  <span className="font-medium">12/15</span>
                </div>
                <Progress value={80} className="h-1.5" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Medical Certs</span>
                  <span className="font-medium">78/87</span>
                </div>
                <Progress value={90} className="h-1.5" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Non-DOT Chevron</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pre-Employment</span>
                  <span className="font-medium">45/48</span>
                </div>
                <Progress value={94} className="h-1.5" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Random Pool</span>
                  <span className="font-medium">32/35</span>
                </div>
                <Progress value={91} className="h-1.5" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Non-DOT Exxon</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pre-Employment</span>
                  <span className="font-medium">28/30</span>
                </div>
                <Progress value={93} className="h-1.5" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Post-Incident</span>
                  <span className="font-medium">5/5</span>
                </div>
                <Progress value={100} className="h-1.5" />
              </div>
            </div>
          </div>
        </Card>

        {/* Alerts Center */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alerts Center</h2>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "tiles" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tiles")}
                className="h-8"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Tiles
              </Button>
              <Button
                variant={viewMode === "details" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("details")}
                className="h-8"
              >
                <List className="h-4 w-4 mr-1" />
                Details
              </Button>
              <Button
                variant={viewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="h-8"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
          <Tabs defaultValue="critical">
            <TabsList>
              <TabsTrigger value="critical">
                Critical <Badge className="ml-2 bg-red-600">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="warnings">
                Warnings <Badge className="ml-2 bg-yellow-600">12</Badge>
              </TabsTrigger>
              <TabsTrigger value="info">
                Info <Badge className="ml-2 bg-blue-600">5</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="critical" className="space-y-3 mt-4">
              <TooltipProvider>
                {criticalAlerts.map((alert) => (
                  <Tooltip key={alert.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <alert.icon className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.employee} • {alert.timestamp}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <a href={`/alerts/${alert.id}`} target="_blank" rel="noopener noreferrer">
                            Review
                          </a>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-base">{alert.title}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Employee:</span>
                            <span className="font-medium">{alert.employee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{alert.details.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{alert.details.dueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Policy:</span>
                            <span className="font-medium">{alert.details.policy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{alert.details.location}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{alert.details.notes}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </TabsContent>

            <TabsContent value="warnings" className="space-y-3 mt-4">
              <TooltipProvider>
                {warningAlerts.map((alert) => (
                  <Tooltip key={alert.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <alert.icon className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.employee} • {alert.timestamp}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/alerts/${alert.id}`} target="_blank" rel="noopener noreferrer">
                            Review
                          </a>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-base">{alert.title}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Employee:</span>
                            <span className="font-medium">{alert.employee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{alert.details.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{alert.details.dueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Policy:</span>
                            <span className="font-medium">{alert.details.policy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{alert.details.location}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{alert.details.notes}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </TabsContent>

            <TabsContent value="info" className="space-y-3 mt-4">
              <TooltipProvider>
                {infoAlerts.map((alert) => (
                  <Tooltip key={alert.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <alert.icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {alert.employee} • {alert.timestamp}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`/alerts/${alert.id}`} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="w-80 p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-base">{alert.title}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Employee:</span>
                            <span className="font-medium">{alert.employee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{alert.details.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{alert.details.dueDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Policy:</span>
                            <span className="font-medium">{alert.details.policy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{alert.details.location}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{alert.details.notes}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Audit Queue Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Audit Queue</h2>
            {selectedAlerts.length > 0 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Approve ({selectedAlerts.length})
                </Button>
                <Button size="sm" variant="outline">
                  Reject ({selectedAlerts.length})
                </Button>
              </div>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action Required</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditQueue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAlerts.includes(item.id)}
                      onCheckedChange={() => handleSelectAlert(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.employee}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                  </TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees Tracked</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-950">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tests Pending</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiring in 30 Days</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-950">
                <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sites Active</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

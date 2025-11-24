"use client"

import { useState } from "react"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Alert {
  id: string
  employee: string
  employeeId: string
  serviceCompany: string
  type: string
  alertType: "Expiring" | "Expired" | "Missing" | "Action Required"
  dueDate: string
  alertDate: string
  status: "Open" | "In Progress" | "Resolved"
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    employee: "John Smith",
    employeeId: "EMP-001",
    serviceCompany: "Acme Construction LLC",
    type: "Drug Test",
    alertType: "Expiring",
    dueDate: "2025-02-01",
    alertDate: "2025-01-15",
    status: "Open",
  },
  {
    id: "ALT-002",
    employee: "Sarah Johnson",
    employeeId: "EMP-002",
    serviceCompany: "Texas Pipeline Services",
    type: "Background Check",
    alertType: "Expired",
    dueDate: "2025-01-10",
    alertDate: "2025-01-11",
    status: "In Progress",
  },
  {
    id: "ALT-003",
    employee: "Mike Davis",
    employeeId: "EMP-003",
    serviceCompany: "Gulf Coast Drilling",
    type: "Training Certificate",
    alertType: "Missing",
    dueDate: "2025-01-20",
    alertDate: "2025-01-14",
    status: "Open",
  },
]

export default function ComplianceAlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")

  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSearch =
      alert.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    const matchesCompany = companyFilter === "all" || alert.serviceCompany === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const getAlertTypeBadge = (type: string) => {
    switch (type) {
      case "Expiring":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">{type}</Badge>
      case "Expired":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">{type}</Badge>
      case "Missing":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">{type}</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="outline">{status}</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">{status}</Badge>
      case "Resolved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alert Center</h1>
          <p className="text-muted-foreground">Compliance alerts across all service companies</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Alerts</CardDescription>
            <CardTitle className="text-3xl">{mockAlerts.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open</CardDescription>
            <CardTitle className="text-3xl">{mockAlerts.filter((a) => a.status === "Open").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{mockAlerts.filter((a) => a.status === "In Progress").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600 dark:text-blue-400">Being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-3xl">{mockAlerts.filter((a) => a.status === "Resolved").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or alert ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="Acme Construction LLC">Acme Construction LLC</SelectItem>
                <SelectItem value="Texas Pipeline Services">Texas Pipeline Services</SelectItem>
                <SelectItem value="Gulf Coast Drilling">Gulf Coast Drilling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>
            Showing {filteredAlerts.length} of {mockAlerts.length} alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Service Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Alert Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell>
                    <Link href={`/employees/${alert.employeeId}`} className="hover:underline">
                      {alert.employee}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{alert.serviceCompany}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>{getAlertTypeBadge(alert.alertType)}</TableCell>
                  <TableCell>{alert.dueDate}</TableCell>
                  <TableCell>{alert.alertDate}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

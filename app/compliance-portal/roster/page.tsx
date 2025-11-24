"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Users, Building2, AlertTriangle, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for combined roster
const mockEmployees = [
  {
    id: "EMP-001",
    name: "John Smith",
    company: "Acme Construction LLC",
    jobTitle: "CDL Driver",
    department: "Transportation",
    status: "active",
    complianceScore: 95,
    lastActivity: "2025-01-15",
    activeAlerts: 0,
  },
  {
    id: "EMP-002",
    name: "Sarah Johnson",
    company: "Texas Pipeline Services",
    jobTitle: "Safety Coordinator",
    department: "Safety",
    status: "active",
    complianceScore: 88,
    lastActivity: "2025-01-14",
    activeAlerts: 1,
  },
  {
    id: "EMP-003",
    name: "Mike Davis",
    company: "Gulf Coast Drilling",
    jobTitle: "Field Technician",
    department: "Operations",
    status: "active",
    complianceScore: 72,
    lastActivity: "2025-01-13",
    activeAlerts: 2,
  },
  {
    id: "EMP-004",
    name: "Emily Brown",
    company: "Acme Construction LLC",
    jobTitle: "Warehouse Manager",
    department: "Operations",
    status: "active",
    complianceScore: 100,
    lastActivity: "2025-01-15",
    activeAlerts: 0,
  },
  {
    id: "EMP-005",
    name: "Robert Wilson",
    company: "Lone Star Energy Co",
    jobTitle: "Equipment Operator",
    department: "Field Services",
    status: "on-leave",
    complianceScore: 85,
    lastActivity: "2024-12-20",
    activeAlerts: 0,
  },
]

export default function CombinedRosterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter
    const matchesCompany = companyFilter === "all" || emp.company === companyFilter
    return matchesSearch && matchesStatus && matchesCompany
  })

  const stats = {
    totalEmployees: mockEmployees.length,
    totalCompanies: new Set(mockEmployees.map((e) => e.company)).size,
    avgCompliance: Math.round(mockEmployees.reduce((sum, e) => sum + e.complianceScore, 0) / mockEmployees.length),
    criticalAlerts: mockEmployees.reduce((sum, e) => sum + e.activeAlerts, 0),
  }

  const getComplianceColor = (score: number) => {
    if (score >= 85) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getComplianceBadgeVariant = (score: number) => {
    if (score >= 85) return "default"
    if (score >= 70) return "secondary"
    return "destructive"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Combined Roster</h1>
          <p className="text-muted-foreground">All employees across portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">All companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Service companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(stats.avgCompliance)}`}>
              {stats.avgCompliance}%
            </div>
            <p className="text-xs text-muted-foreground">Portfolio average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="Acme Construction LLC">Acme Construction LLC</SelectItem>
                <SelectItem value="Texas Pipeline Services">Texas Pipeline Services</SelectItem>
                <SelectItem value="Gulf Coast Drilling">Gulf Coast Drilling</SelectItem>
                <SelectItem value="Lone Star Energy Co">Lone Star Energy Co</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Active Alerts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.company}</Badge>
                  </TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "active"
                          ? "default"
                          : employee.status === "on-leave"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.complianceScore} className="w-16 h-2" />
                      <Badge variant={getComplianceBadgeVariant(employee.complianceScore)}>
                        {employee.complianceScore}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{employee.lastActivity}</TableCell>
                  <TableCell>
                    {employee.activeAlerts > 0 ? (
                      <Badge variant="destructive">{employee.activeAlerts}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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

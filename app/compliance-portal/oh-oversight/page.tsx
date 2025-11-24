"use client"

import { useState } from "react"
import { Search, Eye, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface OHRecord {
  id: string
  employee: string
  employeeId: string
  serviceCompany: string
  medicalExam: string
  medicalStatus: "Current" | "Expiring" | "Expired"
  physicalExam: string
  physicalStatus: "Current" | "Expiring" | "Expired"
  respiratorFit: string
  respiratorStatus: "Current" | "Expiring" | "Expired"
  hearingTest: string
  hearingStatus: "Current" | "Expiring" | "Expired"
  overallStatus: "Compliant" | "At Risk" | "Non-Compliant"
}

const mockOHRecords: OHRecord[] = [
  {
    id: "OH-001",
    employee: "John Smith",
    employeeId: "EMP-001",
    serviceCompany: "Acme Construction LLC",
    medicalExam: "2025-06-15",
    medicalStatus: "Current",
    physicalExam: "2025-05-20",
    physicalStatus: "Current",
    respiratorFit: "2025-03-10",
    respiratorStatus: "Expiring",
    hearingTest: "2025-07-01",
    hearingStatus: "Current",
    overallStatus: "Compliant",
  },
  {
    id: "OH-002",
    employee: "Sarah Johnson",
    employeeId: "EMP-002",
    serviceCompany: "Texas Pipeline Services",
    medicalExam: "2025-02-28",
    medicalStatus: "Expiring",
    physicalExam: "2025-02-15",
    physicalStatus: "Expiring",
    respiratorFit: "2025-04-20",
    respiratorStatus: "Current",
    hearingTest: "2025-03-15",
    hearingStatus: "Current",
    overallStatus: "At Risk",
  },
  {
    id: "OH-003",
    employee: "Mike Davis",
    employeeId: "EMP-003",
    serviceCompany: "Gulf Coast Drilling",
    medicalExam: "2024-12-31",
    medicalStatus: "Expired",
    physicalExam: "2024-12-15",
    physicalStatus: "Expired",
    respiratorFit: "2025-01-10",
    respiratorStatus: "Current",
    hearingTest: "2024-11-20",
    hearingStatus: "Expired",
    overallStatus: "Non-Compliant",
  },
]

export default function OHOversightPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")

  const filteredRecords = mockOHRecords.filter((record) => {
    const matchesSearch =
      record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.overallStatus === statusFilter
    const matchesCompany = companyFilter === "all" || record.serviceCompany === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Current":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Current
          </Badge>
        )
      case "Expiring":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Expiring
          </Badge>
        )
      case "Expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getOverallStatusBadge = (status: string) => {
    switch (status) {
      case "Compliant":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
            Compliant
          </Badge>
        )
      case "At Risk":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
            At Risk
          </Badge>
        )
      case "Non-Compliant":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">
            Non-Compliant
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Occupational Health Oversight</h1>
          <p className="text-muted-foreground">Monitor medical surveillance across all service companies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">{mockOHRecords.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Under OH surveillance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliant</CardDescription>
            <CardTitle className="text-3xl">
              {mockOHRecords.filter((r) => r.overallStatus === "Compliant").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress
                value={Math.round(
                  (mockOHRecords.filter((r) => r.overallStatus === "Compliant").length / mockOHRecords.length) * 100,
                )}
                className="h-2"
              />
              <span className="text-xs text-green-600 dark:text-green-400">
                {Math.round(
                  (mockOHRecords.filter((r) => r.overallStatus === "Compliant").length / mockOHRecords.length) * 100,
                )}
                %
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>At Risk</CardDescription>
            <CardTitle className="text-3xl">
              {mockOHRecords.filter((r) => r.overallStatus === "At Risk").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Expiring within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Non-Compliant</CardDescription>
            <CardTitle className="text-3xl">
              {mockOHRecords.filter((r) => r.overallStatus === "Non-Compliant").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Immediate action required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or ID..."
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
                <SelectItem value="Compliant">Compliant</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
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
          <CardTitle>Occupational Health Records</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} of {mockOHRecords.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OH ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Service Company</TableHead>
                <TableHead>Medical Exam</TableHead>
                <TableHead>Physical Exam</TableHead>
                <TableHead>Respirator Fit</TableHead>
                <TableHead>Hearing Test</TableHead>
                <TableHead>Overall Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    <Link href={`/employees/${record.employeeId}`} className="hover:underline">
                      <div className="font-medium">{record.employee}</div>
                      <div className="text-xs text-muted-foreground">{record.employeeId}</div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.serviceCompany}</TableCell>
                  <TableCell>
                    <div className="text-sm">{record.medicalExam}</div>
                    {getStatusBadge(record.medicalStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.physicalExam}</div>
                    {getStatusBadge(record.physicalStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.respiratorFit}</div>
                    {getStatusBadge(record.respiratorStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.hearingTest}</div>
                    {getStatusBadge(record.hearingStatus)}
                  </TableCell>
                  <TableCell>{getOverallStatusBadge(record.overallStatus)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Occupational Health Requirements</CardTitle>
          <CardDescription>Medical surveillance program components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Medical Examinations</h4>
              <p className="text-sm text-muted-foreground">
                Annual medical exams for employees exposed to occupational hazards
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Physical Fitness Tests</h4>
              <p className="text-sm text-muted-foreground">
                Physical capability assessments for safety-sensitive positions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Respirator Fit Testing</h4>
              <p className="text-sm text-muted-foreground">
                Annual fit testing for employees required to wear respirators
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Hearing Conservation</h4>
              <p className="text-sm text-muted-foreground">
                Audiometric testing for employees exposed to noise hazards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

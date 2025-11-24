import { notFound } from "next/navigation"
import { mockCompanies } from "@/lib/data/mock-companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Truck, CheckCircle2, AlertCircle, Clock } from "lucide-react"

export default async function CompanyDOTPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params
  const company = mockCompanies.find((c) => c.id === companySlug)

  if (!company) {
    notFound()
  }

  // Mock DOT compliance data filtered by company
  const dotRecords = [
    {
      id: "DOT-2025-001",
      employee: "John Smith",
      employeeId: "EMP-001",
      type: "Medical Card",
      requirement: "DOT Physical",
      issueDate: "2024-06-15",
      expiryDate: "2026-06-15",
      status: "current" as const,
    },
    {
      id: "DOT-2025-002",
      employee: "Sarah Johnson",
      employeeId: "EMP-002",
      type: "HOS Training",
      requirement: "Hours of Service",
      issueDate: "2024-01-10",
      expiryDate: "2025-01-10",
      status: "expiring" as const,
    },
    {
      id: "DOT-2024-089",
      employee: "Mike Davis",
      employeeId: "EMP-003",
      type: "CDL License",
      requirement: "Class A CDL",
      issueDate: "2020-03-20",
      expiryDate: "2024-12-20",
      status: "expired" as const,
    },
  ]

  const stats = {
    totalDrivers: 18,
    compliant: 14,
    expiring: 2,
    expired: 2,
    complianceRate: 78,
  }

  const getStatusBadge = (status: "current" | "expiring" | "expired") => {
    switch (status) {
      case "current":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Current
          </Badge>
        )
      case "expiring":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Expiring Soon
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6" />
            DOT Compliance
          </h1>
          <p className="text-muted-foreground">DOT requirements for {company.name}</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Drivers</CardDescription>
            <CardTitle className="text-3xl">{stats.totalDrivers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">CDL holders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliant</CardDescription>
            <CardTitle className="text-3xl">{stats.compliant}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Up to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expiring Soon</CardDescription>
            <CardTitle className="text-3xl">{stats.expiring}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Within 90 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl">{stats.expired}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Requires renewal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.complianceRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* DOT Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent DOT Records</CardTitle>
          <CardDescription>
            Showing {dotRecords.length} recent records for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dotRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.employee}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.requirement}</TableCell>
                  <TableCell>{record.issueDate}</TableCell>
                  <TableCell>{record.expiryDate}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

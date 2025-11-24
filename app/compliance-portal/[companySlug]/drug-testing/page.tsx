import { notFound } from "next/navigation"
import { mockCompanies } from "@/lib/data/mock-companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TestTube, CheckCircle2, AlertCircle, Clock } from "lucide-react"

export default async function CompanyDrugTestingPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params
  const company = mockCompanies.find((c) => c.id === companySlug)

  if (!company) {
    notFound()
  }

  // Mock drug testing data filtered by company
  const drugTests = [
    {
      id: "DT-2025-001",
      employee: "John Smith",
      employeeId: "EMP-001",
      type: "Random",
      testType: "DOT 5-Panel",
      date: "2025-01-15",
      status: "negative" as const,
      turnaround: "24h",
      vendor: "CRL",
    },
    {
      id: "DT-2025-002",
      employee: "Sarah Johnson",
      employeeId: "EMP-002",
      type: "Pre-Employment",
      testType: "DOT 10-Panel",
      date: "2025-01-14",
      status: "pending" as const,
      turnaround: "48h",
      vendor: "Quest",
    },
    {
      id: "DT-2025-003",
      employee: "Mike Davis",
      employeeId: "EMP-003",
      type: "Reasonable Suspicion",
      testType: "DOT 5-Panel + Alcohol",
      date: "2025-01-13",
      status: "positive" as const,
      turnaround: "72h",
      vendor: "CRL",
    },
  ]

  const stats = {
    totalTests: 25,
    pending: 3,
    negative: 21,
    positive: 1,
    complianceRate: 96,
  }

  const getStatusBadge = (status: "negative" | "positive" | "pending") => {
    switch (status) {
      case "negative":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Negative
          </Badge>
        )
      case "positive":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Positive
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
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
            <TestTube className="h-6 w-6" />
            Drug & Alcohol Testing
          </h1>
          <p className="text-muted-foreground">DOT & Non-DOT compliance for {company.name}</p>
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
            <CardDescription>Total Tests (YTD)</CardDescription>
            <CardTitle className="text-3xl">{stats.totalTests}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All test types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Results</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Awaiting results</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Negative</CardDescription>
            <CardTitle className="text-3xl">{stats.negative}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Positive</CardDescription>
            <CardTitle className="text-3xl">{stats.positive}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Requires action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.complianceRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Above target</p>
          </CardContent>
        </Card>
      </div>

      {/* Test History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Drug Tests</CardTitle>
          <CardDescription>
            Showing {drugTests.length} recent tests for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Panel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Turnaround</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.id}</TableCell>
                  <TableCell>{test.employee}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{test.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{test.testType}</TableCell>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{test.vendor}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{test.turnaround}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

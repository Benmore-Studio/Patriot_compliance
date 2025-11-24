import { notFound } from "next/navigation"
import { mockCompanies } from "@/lib/data/mock-companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, BarChart3, TrendingUp, TrendingDown } from "lucide-react"

export default async function CompanyReportsPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params
  const company = mockCompanies.find((c) => c.id === companySlug)

  if (!company) {
    notFound()
  }

  // Mock MIS reports data filtered by company
  const reports = [
    {
      id: "RPT-2025-001",
      name: "Monthly Compliance Summary",
      type: "Compliance",
      period: "January 2025",
      generatedDate: "2025-01-31",
      status: "available" as const,
    },
    {
      id: "RPT-2024-012",
      name: "Annual Drug Testing Report",
      type: "Drug Testing",
      period: "2024",
      generatedDate: "2025-01-15",
      status: "available" as const,
    },
    {
      id: "RPT-2024-011",
      name: "Training Compliance Report",
      type: "Training",
      period: "Q4 2024",
      generatedDate: "2024-12-31",
      status: "available" as const,
    },
  ]

  const stats = {
    overallCompliance: 87,
    drugTesting: 96,
    backgroundChecks: 88,
    training: 84,
    dotCompliance: 78,
  }

  const getComplianceTrend = (rate: number) => {
    if (rate >= 90) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">Excellent</span>
        </div>
      )
    } else if (rate >= 80) {
      return (
        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">Good</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs">Needs Attention</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            MIS Reports
          </h1>
          <p className="text-muted-foreground">Analytics and reporting for {company.name}</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export All Reports
        </Button>
      </div>

      {/* Compliance Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Compliance</CardDescription>
            <CardTitle className="text-3xl">{stats.overallCompliance}%</CardTitle>
          </CardHeader>
          <CardContent>{getComplianceTrend(stats.overallCompliance)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drug Testing</CardDescription>
            <CardTitle className="text-3xl">{stats.drugTesting}%</CardTitle>
          </CardHeader>
          <CardContent>{getComplianceTrend(stats.drugTesting)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Background Checks</CardDescription>
            <CardTitle className="text-3xl">{stats.backgroundChecks}%</CardTitle>
          </CardHeader>
          <CardContent>{getComplianceTrend(stats.backgroundChecks)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Training</CardDescription>
            <CardTitle className="text-3xl">{stats.training}%</CardTitle>
          </CardHeader>
          <CardContent>{getComplianceTrend(stats.training)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>DOT Compliance</CardDescription>
            <CardTitle className="text-3xl">{stats.dotCompliance}%</CardTitle>
          </CardHeader>
          <CardContent>{getComplianceTrend(stats.dotCompliance)}</CardContent>
        </Card>
      </div>

      {/* Available Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Showing {reports.length} recent reports for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.period}</TableCell>
                  <TableCell>{report.generatedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Available
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
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

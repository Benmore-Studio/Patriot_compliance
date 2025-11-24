"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import { mockCompanies } from "@/lib/data/mock-companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Shield, Search, MessageSquare } from "lucide-react"
import { CommunicationsDialog } from "@/components/communications-dialog"

function generateMockBackgroundChecks(companyName: string) {
  const screeningTypes = ["Criminal", "MVR", "Employment Verification", "Education", "Credit", "Drug Screen"]
  const adjudications: ("PENDING" | "APPROVED" | "DENIED" | "CONDITIONAL")[] = [
    "PENDING",
    "APPROVED",
    "APPROVED",
    "APPROVED",
    "CONDITIONAL",
    "DENIED",
  ]
  const statuses: ("completed" | "pending" | "in-progress")[] = [
    "completed",
    "completed",
    "completed",
    "pending",
    "in-progress",
  ]

  return Array.from({ length: 25 }, (_, i) => {
    const orderDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const completionDate = new Date(orderDate)
    completionDate.setDate(completionDate.getDate() + Math.floor(Math.random() * 14) + 1)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const adjudication = adjudications[Math.floor(Math.random() * adjudications.length)]
    const numScreenings = Math.floor(Math.random() * 4) + 2
    const selectedScreenings = screeningTypes.sort(() => 0.5 - Math.random()).slice(0, numScreenings)

    return {
      id: `BG-2025-${String(i + 1).padStart(3, "0")}`,
      employee: `Employee ${i + 1}`,
      orderDate: orderDate.toISOString().split("T")[0],
      completionDate: status === "completed" ? completionDate.toISOString().split("T")[0] : "—",
      screeningTypes: selectedScreenings,
      overallResult: status === "completed" ? (Math.random() > 0.2 ? "Clear" : "Review Required") : "Pending",
      adjudication,
      vendor: "TazWorks",
      continuousMonitoring: Math.random() > 0.5,
      status,
    }
  })
}

export default function CompanyBackgroundPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = use(params)
  const company = mockCompanies.find((c) => c.id === companySlug)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [adjudicationFilter, setAdjudicationFilter] = useState("all")
  const [showCommsDialog, setShowCommsDialog] = useState(false)

  if (!company) {
    notFound()
  }

  const backgroundChecks = generateMockBackgroundChecks(company.name)

  const filteredChecks = backgroundChecks.filter((check) => {
    const matchesSearch = check.employee.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || check.status === statusFilter
    const matchesAdjudication = adjudicationFilter === "all" || check.adjudication === adjudicationFilter
    return matchesSearch && matchesStatus && matchesAdjudication
  })

  const stats = {
    totalChecks: backgroundChecks.length,
    pending: backgroundChecks.filter((c) => c.status === "pending").length,
    completed: backgroundChecks.filter((c) => c.status === "completed").length,
    avgTurnaround: "7 days",
  }

  const getAdjudicationBadge = (adjudication: string) => {
    switch (adjudication) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approved</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>
      case "DENIED":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Denied</Badge>
      case "CONDITIONAL":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">Conditional</Badge>
        )
      default:
        return <Badge variant="outline">{adjudication}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Background Checks
          </h1>
          <p className="text-muted-foreground">Background screening for {company.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="gap-2" onClick={() => setShowCommsDialog(true)}>
            <MessageSquare className="h-4 w-4" />
            Request Urgent Check
          </Button>
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
          <CardHeader className="pb-2">
            <CardDescription>Total Checks</CardDescription>
            <CardTitle className="text-3xl">{stats.totalChecks}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All background checks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{stats.completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Turnaround</CardDescription>
            <CardTitle className="text-3xl">{stats.avgTurnaround}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Processing time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={adjudicationFilter} onValueChange={setAdjudicationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Adjudication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Adjudication</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="DENIED">Denied</SelectItem>
                <SelectItem value="CONDITIONAL">Conditional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Background Check History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Background Check Records</CardTitle>
          <CardDescription>
            Showing {filteredChecks.length} of {backgroundChecks.length} checks for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Screening Types</TableHead>
                <TableHead>Overall Result</TableHead>
                <TableHead>Adjudication</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Monitoring</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell className="font-medium font-mono text-sm">{check.id}</TableCell>
                  <TableCell>{check.employee}</TableCell>
                  <TableCell>{check.orderDate}</TableCell>
                  <TableCell>{check.completionDate}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {check.screeningTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{check.overallResult}</TableCell>
                  <TableCell>{getAdjudicationBadge(check.adjudication)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{check.vendor}</Badge>
                  </TableCell>
                  <TableCell>
                    {check.continuousMonitoring ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CommunicationsDialog
        open={showCommsDialog}
        onOpenChange={setShowCommsDialog}
        companyName={company.name}
        subject="Urgent Background Check Request"
      />
    </div>
  )
}

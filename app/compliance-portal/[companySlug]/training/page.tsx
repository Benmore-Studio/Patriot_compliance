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
import { Download, GraduationCap, CheckCircle2, AlertCircle, Clock, Search, MessageSquare } from "lucide-react"
import { CommunicationsDialog } from "@/components/communications-dialog"

function generateMockTrainings(companyName: string) {
  const courses = [
    "OSHA 30-Hour Construction",
    "First Aid & CPR",
    "Hazmat Awareness",
    "Forklift Certification",
    "Confined Space Entry",
    "Fall Protection",
    "Bloodborne Pathogens",
    "Defensive Driving",
    "Fire Safety",
    "Electrical Safety",
  ]
  const types = ["Safety", "Medical", "DOT", "Equipment", "Compliance"]
  const providers = ["OSHA Training Institute", "Red Cross", "DOT Training Center", "SafetyFirst", "CompliancePro"]
  const statuses: ("current" | "expiring" | "expired")[] = [
    "current",
    "current",
    "current",
    "current",
    "expiring",
    "expired",
  ]

  return Array.from({ length: 30 }, (_, i) => {
    const completionDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const expiryDate = new Date(completionDate)
    expiryDate.setFullYear(expiryDate.getFullYear() + (Math.random() > 0.5 ? 2 : 3))
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      id: `TR-2025-${String(i + 1).padStart(3, "0")}`,
      employee: `Employee ${i + 1}`,
      employeeId: `EMP-${String(i + 1).padStart(3, "0")}`,
      course: courses[Math.floor(Math.random() * courses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      completionDate: completionDate.toISOString().split("T")[0],
      expiryDate: expiryDate.toISOString().split("T")[0],
      status,
      provider: providers[Math.floor(Math.random() * providers.length)],
    }
  })
}

export default function CompanyTrainingPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = use(params)
  const company = mockCompanies.find((c) => c.id === companySlug)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCommsDialog, setShowCommsDialog] = useState(false)

  if (!company) {
    notFound()
  }

  const trainings = generateMockTrainings(company.name)

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || training.status === statusFilter
    const matchesType = typeFilter === "all" || training.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    totalCertifications: trainings.length,
    current: trainings.filter((t) => t.status === "current").length,
    expiring: trainings.filter((t) => t.status === "expiring").length,
    expired: trainings.filter((t) => t.status === "expired").length,
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
            <GraduationCap className="h-6 w-6" />
            Certificates & Training
          </h1>
          <p className="text-muted-foreground">Training compliance for {company.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="gap-2" onClick={() => setShowCommsDialog(true)}>
            <MessageSquare className="h-4 w-4" />
            Request Urgent Training
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
            <CardDescription>Total Certifications</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCertifications}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All certificates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current</CardDescription>
            <CardTitle className="text-3xl">{stats.current}</CardTitle>
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
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee or course..."
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
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="DOT">DOT</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Training History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training Records</CardTitle>
          <CardDescription>
            Showing {filteredTrainings.length} of {trainings.length} certifications for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cert ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium font-mono text-sm">{training.id}</TableCell>
                  <TableCell>{training.employee}</TableCell>
                  <TableCell>{training.course}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{training.type}</Badge>
                  </TableCell>
                  <TableCell>{training.completionDate}</TableCell>
                  <TableCell>{training.expiryDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{training.provider}</TableCell>
                  <TableCell>{getStatusBadge(training.status)}</TableCell>
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
        subject="Urgent Training Request"
      />
    </div>
  )
}

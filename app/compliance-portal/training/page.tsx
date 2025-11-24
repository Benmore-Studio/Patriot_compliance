"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, GraduationCap, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

const mockTrainingRecords = [
  {
    id: "TRN-001",
    employeeName: "John Smith",
    company: "Acme Construction LLC",
    certificateType: "OSHA 30-Hour",
    certificateNumber: "OSHA-2024-001",
    issueDate: "2024-06-15",
    expiryDate: "2027-06-15",
    issuingAuthority: "OSHA",
    status: "active",
  },
  {
    id: "TRN-002",
    employeeName: "Sarah Johnson",
    company: "Texas Pipeline Services",
    certificateType: "CDL Class A",
    certificateNumber: "CDL-TX-2024-456",
    issueDate: "2024-03-10",
    expiryDate: "2025-03-10",
    issuingAuthority: "Texas DMV",
    status: "expiring-soon",
  },
  {
    id: "TRN-003",
    employeeName: "Mike Davis",
    company: "Gulf Coast Drilling",
    certificateType: "First Aid/CPR",
    certificateNumber: "FA-2023-789",
    issueDate: "2023-11-20",
    expiryDate: "2024-11-20",
    issuingAuthority: "Red Cross",
    status: "expired",
  },
]

export default function TrainingOversightPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredRecords = mockTrainingRecords.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.certificateType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    totalCertificates: mockTrainingRecords.length,
    expiringSoon: mockTrainingRecords.filter((r) => r.status === "expiring-soon").length,
    expired: mockTrainingRecords.filter((r) => r.status === "expired").length,
    activePrograms: 12,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "expiring-soon":
        return <Badge variant="secondary">Expiring Soon</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Oversight</h1>
          <p className="text-muted-foreground">Training programs across companies</p>
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
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground">All companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Requires renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePrograms}</div>
            <p className="text-xs text-muted-foreground">Training programs</p>
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
                placeholder="Search by employee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Certificate Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="OSHA 30-Hour">OSHA 30-Hour</SelectItem>
                <SelectItem value="CDL Class A">CDL Class A</SelectItem>
                <SelectItem value="First Aid/CPR">First Aid/CPR</SelectItem>
                <SelectItem value="Forklift">Forklift</SelectItem>
                <SelectItem value="Safety Training">Safety Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Training & Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Certificate Type</TableHead>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Issuing Authority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.company}</Badge>
                  </TableCell>
                  <TableCell>{record.certificateType}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.certificateNumber}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.issueDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.expiryDate}</TableCell>
                  <TableCell>{record.issuingAuthority}</TableCell>
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

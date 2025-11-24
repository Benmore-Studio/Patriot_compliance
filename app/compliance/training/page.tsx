"use client"

import { useState, useMemo } from "react"
import { Plus, Download, Upload, Camera, FileText, AlertCircle, CheckCircle2, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const mockCertificates = [
  {
    id: "CERT-001",
    employee: "John Smith",
    type: "CDL Class A",
    certNumber: "CDL-123456",
    issueDate: "2023-01-15",
    expirationDate: "2027-01-15",
    status: "valid",
  },
  {
    id: "CERT-002",
    employee: "Sarah Johnson",
    type: "Forklift Operator",
    certNumber: "FO-789012",
    issueDate: "2022-03-10",
    expirationDate: "2025-03-10",
    status: "expiring-soon",
  },
  {
    id: "CERT-003",
    employee: "Mike Davis",
    type: "CPR/First Aid",
    certNumber: "CPR-345678",
    issueDate: "2022-06-20",
    expirationDate: "2024-06-20",
    status: "expired",
  },
  {
    id: "CERT-004",
    employee: "Emily Brown",
    type: "HAZMAT Endorsement",
    certNumber: "HME-901234",
    issueDate: "2023-09-05",
    expirationDate: "2028-09-05",
    status: "valid",
  },
  {
    id: "CERT-005",
    employee: "David Wilson",
    type: "Confined Space Entry",
    certNumber: "CSE-567890",
    issueDate: "2023-11-12",
    expirationDate: "2024-11-12",
    status: "valid",
  },
]

const mockTrainingPrograms = [
  {
    name: "OSHA 10-Hour Construction",
    required: "All PCS Pass users", // Renamed from "All field workers" to "All PCS Pass users"
    frequency: "Initial + Refresher every 3 years",
    completed: 142,
    total: 150,
  },
  {
    name: "Hazard Communication (HazCom)",
    required: "All employees",
    frequency: "Annual",
    completed: 156,
    total: 156,
  },
  {
    name: "Forklift Operator Certification",
    required: "Warehouse staff",
    frequency: "Initial + Evaluation every 3 years",
    completed: 28,
    total: 35,
  },
  {
    name: "CPR/First Aid",
    required: "Safety team",
    frequency: "Every 2 years",
    completed: 12,
    total: 12,
  },
  {
    name: "Confined Space Entry",
    required: "Maintenance crew",
    frequency: "Annual",
    completed: 18,
    total: 25,
  },
]

export default function TrainingPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [certTypeFilter, setCertTypeFilter] = useState("all")

  const [certificates, setCertificates] = useState(mockCertificates)

  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [certificateType, setCertificateType] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [certificateNumber, setCertificateNumber] = useState("")

  const { toast } = useToast()

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch =
        cert.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certNumber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = certTypeFilter === "all" || cert.type.toLowerCase().includes(certTypeFilter.toLowerCase())

      return matchesSearch && matchesType
    })
  }, [certificates, searchQuery, certTypeFilter])

  const handleUploadCertificate = () => {
    if (!selectedEmployee || !certificateType || !issueDate || !expirationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newCertificate = {
      id: `CERT-${String(certificates.length + 1).padStart(3, "0")}`,
      employee: selectedEmployee,
      type: certificateType,
      certNumber: certificateNumber || `AUTO-${Date.now()}`,
      issueDate,
      expirationDate,
      status: "valid",
    }

    setCertificates([newCertificate, ...certificates])
    setUploadDialogOpen(false)
    setSelectedEmployee("")
    setCertificateType("")
    setIssueDate("")
    setExpirationDate("")
    setIssuingAuthority("")
    setCertificateNumber("")

    toast({
      title: "Certificate Added",
      description: `${certificateType} certificate added for ${selectedEmployee}`,
    })
  }

  const handleRenewCertificate = (certId: string) => {
    const cert = certificates.find((c) => c.id === certId)
    if (!cert) return

    toast({
      title: "Renewal Initiated",
      description: `Renewal process started for ${cert.employee}'s ${cert.type} certificate`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Valid
          </Badge>
        )
      case "expiring-soon":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Expiring Soon
          </Badge>
        )
      case "expired":
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training & Certifications</h1>
          <p className="text-muted-foreground">Manage employee training programs and certifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Certifications</CardDescription>
            <CardTitle className="text-3xl">{certificates.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across {new Set(certificates.map((c) => c.employee)).size} employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Training Completion</CardDescription>
            <CardTitle className="text-3xl">
              {Math.round(
                (mockTrainingPrograms.reduce((sum, p) => sum + p.completed, 0) /
                  mockTrainingPrograms.reduce((sum, p) => sum + p.total, 0)) *
                  100,
              )}
              %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={Math.round(
                (mockTrainingPrograms.reduce((sum, p) => sum + p.completed, 0) /
                  mockTrainingPrograms.reduce((sum, p) => sum + p.total, 0)) *
                  100,
              )}
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expiring Soon</CardDescription>
            <CardTitle className="text-3xl">
              {certificates.filter((c) => c.status === "expiring-soon").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl">{certificates.filter((c) => c.status === "expired").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Training Matrix</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="competency">Competency Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Matrix</CardTitle>
              <CardDescription>View required training by role and track completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrainingPrograms.map((program, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Required for: {program.required} • Frequency: {program.frequency}
                        </p>
                      </div>
                      <Badge
                        className={
                          program.completed === program.total
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : program.completed / program.total >= 0.8
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {program.completed} / {program.total} Complete
                      </Badge>
                    </div>
                    <Progress value={(program.completed / program.total) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Manager</CardTitle>
              <CardDescription>
                Showing {filteredCertificates.length} of {certificates.length} certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search certificates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={certTypeFilter} onValueChange={setCertTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="cdl">CDL</SelectItem>
                      <SelectItem value="forklift">Forklift</SelectItem>
                      <SelectItem value="cpr">CPR/First Aid</SelectItem>
                      <SelectItem value="hazmat">HAZMAT</SelectItem>
                      <SelectItem value="confined">Confined Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Certificate Type</TableHead>
                      <TableHead>Certificate #</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No certificates found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCertificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">{cert.employee}</TableCell>
                          <TableCell>{cert.type}</TableCell>
                          <TableCell>{cert.certNumber}</TableCell>
                          <TableCell>{cert.issueDate}</TableCell>
                          <TableCell>{cert.expirationDate}</TableCell>
                          <TableCell>{getStatusBadge(cert.status)}</TableCell>
                          <TableCell>
                            {cert.status === "expired" ? (
                              <Button variant="ghost" size="sm" onClick={() => handleRenewCertificate(cert.id)}>
                                Renew
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Certificates</CardTitle>
              <CardDescription>Certificates expiring in the next 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.filter((c) => c.status === "expired").length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900 dark:text-red-100">
                          Expired ({certificates.filter((c) => c.status === "expired").length} certificates)
                        </h4>
                        <div className="mt-2 space-y-2">
                          {certificates
                            .filter((c) => c.status === "expired")
                            .map((cert) => (
                              <div key={cert.id} className="flex items-center justify-between text-sm">
                                <span className="text-red-800 dark:text-red-200">
                                  {cert.employee} - {cert.type}
                                </span>
                                <span className="text-red-600 dark:text-red-400">Expired: {cert.expirationDate}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {certificates.filter((c) => c.status === "expiring-soon").length > 0 && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                          Expiring Soon ({certificates.filter((c) => c.status === "expiring-soon").length} certificates)
                        </h4>
                        <div className="mt-2 space-y-2">
                          {certificates
                            .filter((c) => c.status === "expiring-soon")
                            .map((cert) => (
                              <div key={cert.id} className="flex items-center justify-between text-sm">
                                <span className="text-yellow-800 dark:text-yellow-200">
                                  {cert.employee} - {cert.type}
                                </span>
                                <span className="text-yellow-600 dark:text-yellow-400">
                                  Expires: {cert.expirationDate}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {certificates.filter((c) => c.status === "expired" || c.status === "expiring-soon").length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="mx-auto h-12 w-12 mb-4 text-green-600 dark:text-green-400" />
                    <p>No certificates expiring in the next 90 days</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competency Tracker</CardTitle>
              <CardDescription>Monitor skill assessments and competency evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Competency Assessment</TableHead>
                      <TableHead>Last Evaluation</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Smith</TableCell>
                      <TableCell>Equipment Operator</TableCell>
                      <TableCell>Heavy Equipment Operation</TableCell>
                      <TableCell>02/15/2024</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={95} className="h-2 w-20" />
                          <span className="text-sm">95%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Proficient
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sarah Johnson</TableCell>
                      <TableCell>Warehouse Lead</TableCell>
                      <TableCell>Inventory Management</TableCell>
                      <TableCell>01/20/2024</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={88} className="h-2 w-20" />
                          <span className="text-sm">88%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Proficient
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mike Davis</TableCell>
                      <TableCell>Safety Coordinator</TableCell>
                      <TableCell>Emergency Response</TableCell>
                      <TableCell>03/05/2024</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={72} className="h-2 w-20" />
                          <span className="text-sm">72%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          Developing
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-base">Skills Gap Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Emergency Response Training</span>
                          <span className="text-sm text-muted-foreground">12 employees need training</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Advanced Equipment Operation</span>
                          <span className="text-sm text-muted-foreground">8 employees need training</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Leadership & Supervision</span>
                          <span className="text-sm text-muted-foreground">5 employees need training</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Certificate</DialogTitle>
            <DialogDescription>Upload and parse certificate information using OCR</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Employee *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                    <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                    <SelectItem value="David Wilson">David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Certificate Type *</Label>
                <Select value={certificateType} onValueChange={setCertificateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDL Class A">CDL Class A</SelectItem>
                    <SelectItem value="CDL Class B">CDL Class B</SelectItem>
                    <SelectItem value="Forklift Operator">Forklift Operator</SelectItem>
                    <SelectItem value="CPR/First Aid">CPR/First Aid</SelectItem>
                    <SelectItem value="HAZMAT Endorsement">HAZMAT Endorsement</SelectItem>
                    <SelectItem value="Confined Space Entry">Confined Space Entry</SelectItem>
                    <SelectItem value="Fall Protection">Fall Protection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Certificate</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports PDF, JPEG, PNG. OCR will extract certificate details automatically.
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag and drop certificate file here</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Issue Date *</Label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date *</Label>
                <Input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Issuing Authority</Label>
              <Input
                placeholder="e.g., OSHA, DMV, Red Cross"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Certificate Number</Label>
              <Input
                placeholder="Certificate ID or number"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadCertificate}>Upload & Parse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

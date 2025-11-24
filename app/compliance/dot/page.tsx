"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  Shield,
  AlertTriangle,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const mockDrivers = [
  {
    id: "D-001",
    name: "John Smith",
    employeeId: "EMP-001",
    license: "CDL-A",
    licenseExp: "2026-03-15",
    medicalCert: "2025-06-15",
    dqFile: "complete",
    clearinghouse: "clear",
    lastQuery: "2025-01-01",
    mvrStatus: "clear",
    hosCompliance: 98,
    status: "compliant",
  },
  {
    id: "D-002",
    name: "Sarah Johnson",
    employeeId: "EMP-002",
    license: "CDL-B",
    licenseExp: "2025-11-20",
    medicalCert: "2025-02-28",
    dqFile: "incomplete",
    clearinghouse: "clear",
    lastQuery: "2025-01-01",
    mvrStatus: "clear",
    hosCompliance: 95,
    status: "at-risk",
  },
  {
    id: "D-003",
    name: "Mike Davis",
    employeeId: "EMP-003",
    license: "CDL-A",
    licenseExp: "2026-08-10",
    medicalCert: "2024-12-31",
    dqFile: "complete",
    clearinghouse: "clear",
    lastQuery: "2024-12-15",
    mvrStatus: "violation",
    hosCompliance: 89,
    status: "non-compliant",
  },
]

const mockDQFileRequirements = [
  { name: "Application for Employment", required: true },
  { name: "Inquiry to Previous Employers (3 years)", required: true },
  { name: "Motor Vehicle Record", required: true },
  { name: "Road Test Certificate or Equivalent", required: true },
  { name: "Medical Examiner's Certificate", required: true },
  { name: "Annual Review of Driving Record", required: true },
  { name: "Annual Motor Vehicle Record", required: true },
  { name: "Violation Certifications", required: true },
]

const mockAccidents = [
  {
    id: "ACC-001",
    driver: "Mike Davis",
    date: "2024-11-15",
    location: "I-95, Mile Marker 142",
    type: "Preventable",
    injuries: "None",
    fatalities: 0,
    dotReportable: true,
    status: "Investigated",
  },
]

export default function DOTPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddDriverDialog, setShowAddDriverDialog] = useState(false)
  const [showReportAccidentDialog, setShowReportAccidentDialog] = useState(false)
  const [showUploadMedicalDialog, setShowUploadMedicalDialog] = useState(false)
  const [showClearinghouseQueryDialog, setShowClearinghouseQueryDialog] = useState(false)

  const [drivers, setDrivers] = useState(mockDrivers)
  const [accidents, setAccidents] = useState(mockAccidents)

  const [newDriverName, setNewDriverName] = useState("")
  const [newDriverLicense, setNewDriverLicense] = useState("")
  const [newDriverLicenseExp, setNewDriverLicenseExp] = useState("")

  const [selectedDriverForMedical, setSelectedDriverForMedical] = useState("")
  const [medicalCertDate, setMedicalCertDate] = useState("")

  const [accidentDriver, setAccidentDriver] = useState("")
  const [accidentDate, setAccidentDate] = useState("")
  const [accidentLocation, setAccidentLocation] = useState("")
  const [accidentType, setAccidentType] = useState("")

  const [queryType, setQueryType] = useState("")
  const [queryDriver, setQueryDriver] = useState("")

  const { toast } = useToast()

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.employeeId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || driver.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [drivers, searchQuery, statusFilter])

  const handleAddDriver = () => {
    if (!newDriverName || !newDriverLicense || !newDriverLicenseExp) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newDriver = {
      id: `D-${String(drivers.length + 1).padStart(3, "0")}`,
      name: newDriverName,
      employeeId: `EMP-${String(drivers.length + 1).padStart(3, "0")}`,
      license: newDriverLicense,
      licenseExp: newDriverLicenseExp,
      medicalCert: "Pending",
      dqFile: "incomplete",
      clearinghouse: "pending",
      lastQuery: "N/A",
      mvrStatus: "pending",
      hosCompliance: 0,
      status: "non-compliant",
    }

    setDrivers([...drivers, newDriver])
    setShowAddDriverDialog(false)
    setNewDriverName("")
    setNewDriverLicense("")
    setNewDriverLicenseExp("")

    toast({
      title: "Driver Added",
      description: `${newDriverName} has been added to the DOT driver roster`,
    })
  }

  const handleUploadMedical = () => {
    if (!selectedDriverForMedical || !medicalCertDate) {
      toast({
        title: "Missing Information",
        description: "Please select a driver and enter certificate expiration date",
        variant: "destructive",
      })
      return
    }

    setDrivers(
      drivers.map((driver) =>
        driver.name === selectedDriverForMedical
          ? { ...driver, medicalCert: medicalCertDate, status: "compliant" }
          : driver,
      ),
    )

    setShowUploadMedicalDialog(false)
    setSelectedDriverForMedical("")
    setMedicalCertDate("")

    toast({
      title: "Medical Certificate Updated",
      description: `Medical certificate uploaded for ${selectedDriverForMedical}`,
    })
  }

  const handleReportAccident = () => {
    if (!accidentDriver || !accidentDate || !accidentLocation || !accidentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newAccident = {
      id: `ACC-${String(accidents.length + 1).padStart(3, "0")}`,
      driver: accidentDriver,
      date: accidentDate,
      location: accidentLocation,
      type: accidentType,
      injuries: "Under Investigation",
      fatalities: 0,
      dotReportable: true,
      status: "Pending Investigation",
    }

    setAccidents([newAccident, ...accidents])
    setShowReportAccidentDialog(false)
    setAccidentDriver("")
    setAccidentDate("")
    setAccidentLocation("")
    setAccidentType("")

    toast({
      title: "Accident Reported",
      description: `Accident report ${newAccident.id} has been created`,
    })
  }

  const handleRunQuery = () => {
    if (!queryType || !queryDriver) {
      toast({
        title: "Missing Information",
        description: "Please select query type and driver",
        variant: "destructive",
      })
      return
    }

    setDrivers(
      drivers.map((driver) =>
        driver.name === queryDriver
          ? { ...driver, clearinghouse: "clear", lastQuery: new Date().toISOString().split("T")[0] }
          : driver,
      ),
    )

    setShowClearinghouseQueryDialog(false)
    setQueryType("")
    setQueryDriver("")

    toast({
      title: "Query Submitted",
      description: `${queryType} query submitted for ${queryDriver} to FMCSA Clearinghouse`,
    })
  }

  const handleGenerateAuditReport = () => {
    toast({
      title: "Generating Report",
      description: "DOT audit readiness report is being generated...",
    })

    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your audit report has been downloaded",
      })
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
        )
      case "at-risk":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            At Risk
          </Badge>
        )
      case "non-compliant":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Non-Compliant
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
          <h1 className="text-3xl font-bold text-foreground">DOT Compliance</h1>
          <p className="text-muted-foreground">Manage DOT driver qualification and FMCSA compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddDriverDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Drivers</CardDescription>
            <CardTitle className="text-3xl">{drivers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              CDL-A: {drivers.filter((d) => d.license === "CDL-A").length} | CDL-B:{" "}
              {drivers.filter((d) => d.license === "CDL-B").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliant</CardDescription>
            <CardTitle className="text-3xl">{drivers.filter((d) => d.status === "compliant").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress
                value={Math.round((drivers.filter((d) => d.status === "compliant").length / drivers.length) * 100)}
                className="h-2"
              />
              <span className="text-xs text-green-600 dark:text-green-400">
                {Math.round((drivers.filter((d) => d.status === "compliant").length / drivers.length) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expiring Soon</CardDescription>
            <CardTitle className="text-3xl">{drivers.filter((d) => d.status === "at-risk").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Non-Compliant</CardDescription>
            <CardTitle className="text-3xl">{drivers.filter((d) => d.status === "non-compliant").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Immediate action required</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="drivers">Driver Roster</TabsTrigger>
          <TabsTrigger value="dq-files">DQ Files</TabsTrigger>
          <TabsTrigger value="medical">Medical Certificates</TabsTrigger>
          <TabsTrigger value="clearinghouse">Clearinghouse</TabsTrigger>
          <TabsTrigger value="hos">Hours of Service</TabsTrigger>
          <TabsTrigger value="accidents">Accident Register</TabsTrigger>
          <TabsTrigger value="audit">Audit Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search drivers..."
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
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Drivers Table */}
          <Card>
            <CardHeader>
              <CardTitle>DOT Driver Roster</CardTitle>
              <CardDescription>
                Showing {filteredDrivers.length} of {drivers.length} drivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Medical Cert</TableHead>
                    <TableHead>DQ File</TableHead>
                    <TableHead>Clearinghouse</TableHead>
                    <TableHead>HOS Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No drivers found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-xs text-muted-foreground">{driver.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline">{driver.license}</Badge>
                            <div className="text-xs text-muted-foreground mt-1">Exp: {driver.licenseExp}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{driver.medicalCert}</div>
                        </TableCell>
                        <TableCell>
                          {driver.dqFile === "complete" ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              Complete
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                              Incomplete
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              {driver.clearinghouse === "clear" ? "Clear" : "Pending"}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">Last: {driver.lastQuery}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={driver.hosCompliance} className="h-2 w-16" />
                            <span className="text-sm">{driver.hosCompliance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(driver.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dq-files" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Driver Qualification Files</CardTitle>
                  <CardDescription>Manage required DOT documentation for each driver</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <FileText className="mr-2 h-4 w-4" />
                  DQ File Checklist
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{driver.name}</h4>
                        <p className="text-sm text-muted-foreground">{driver.license} Driver</p>
                      </div>
                      {driver.dqFile === "complete" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          Incomplete
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      {mockDQFileRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {driver.dqFile === "complete" || idx < 6 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          )}
                          <span className="text-sm">{req.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => (window.location.href = `/compliance/dot/drivers/${driver.id}`)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Full DQ File
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DQ File Requirements</CardTitle>
              <CardDescription>Federal Motor Carrier Safety Regulations §391.51</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockDQFileRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{req.name}</span>
                    </div>
                    <Badge variant="secondary">Required</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medical Certificate Tracker</CardTitle>
                  <CardDescription>Monitor DOT medical examiner's certificate expiration dates</CardDescription>
                </div>
                <Button onClick={() => setShowUploadMedicalDialog(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">Certificate Expires: {driver.medicalCert}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Medical Examiner: Dr. Smith (Registry #: 12345)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {driver.status === "non-compliant" ? (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Expired</Badge>
                      ) : driver.status === "at-risk" ? (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Valid
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDriverForMedical(driver.name)
                          setShowUploadMedicalDialog(true)
                        }}
                      >
                        Upload New
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Certification Types</CardTitle>
              <CardDescription>FMCSA medical certification categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Non-Excepted Interstate (NI)</h4>
                  <p className="text-sm text-muted-foreground">
                    Operates in interstate commerce and must meet FMCSA medical requirements
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Excepted Interstate (EI)</h4>
                  <p className="text-sm text-muted-foreground">
                    Operates in interstate commerce but exempt from FMCSA medical requirements
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Non-Excepted Intrastate (NA)</h4>
                  <p className="text-sm text-muted-foreground">
                    Operates only in intrastate commerce and must meet state medical requirements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clearinghouse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FMCSA Drug & Alcohol Clearinghouse</CardTitle>
              <CardDescription>Manage clearinghouse queries and reporting requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Annual Query Status</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Completed: {drivers.filter((d) => d.clearinghouse === "clear").length} / {drivers.length} drivers
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {Math.round((drivers.filter((d) => d.clearinghouse === "clear").length / drivers.length) * 100)}%
                      Complete
                    </Badge>
                  </div>
                  <Progress
                    value={Math.round(
                      (drivers.filter((d) => d.clearinghouse === "clear").length / drivers.length) * 100,
                    )}
                    className="h-2"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Pre-Employment Queries</CardDescription>
                      <CardTitle className="text-2xl">156</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">YTD 2025</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Annual Queries</CardDescription>
                      <CardTitle className="text-2xl">
                        {drivers.filter((d) => d.clearinghouse === "clear").length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">Completed Jan 2025</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Violations Found</CardDescription>
                      <CardTitle className="text-2xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-green-600 dark:text-green-400">All clear</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setQueryType("Pre-Employment")
                      setShowClearinghouseQueryDialog(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Run Pre-Employment Query
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQueryType("Annual")
                      setShowClearinghouseQueryDialog(true)
                    }}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Run Annual Queries
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clearinghouse Query Types</CardTitle>
              <CardDescription>Required queries under FMCSA regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Pre-Employment Query (Full Query)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required before hiring any CDL driver. Checks for drug and alcohol violations in the past 5 years.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Annual Query (Limited Query)</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required annually for all current CDL drivers. Checks for new violations since last query.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Reasonable Suspicion Query</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conducted when there is reasonable suspicion of drug or alcohol use.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hours of Service Compliance</CardTitle>
              <CardDescription>Monitor driver hours and ELD compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Available Hours: 8.5 / 11 driving | 12 / 14 on-duty
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Compliance Score</p>
                        <p className="text-2xl font-bold">{driver.hosCompliance}%</p>
                      </div>
                      <Progress value={driver.hosCompliance} className="h-2 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HOS Violations (Last 30 Days)</CardTitle>
              <CardDescription>Track hours of service violations and exceptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="mx-auto h-12 w-12 mb-4 text-green-600 dark:text-green-400" />
                <p>No HOS violations in the last 30 days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accidents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>DOT Accident Register</CardTitle>
                  <CardDescription>Track DOT-reportable accidents per §390.15</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowReportAccidentDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Report Accident
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accident ID</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Injuries</TableHead>
                    <TableHead>DOT Reportable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No accidents reported
                      </TableCell>
                    </TableRow>
                  ) : (
                    accidents.map((accident) => (
                      <TableRow key={accident.id}>
                        <TableCell className="font-medium">{accident.id}</TableCell>
                        <TableCell>{accident.driver}</TableCell>
                        <TableCell>{accident.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{accident.location}</TableCell>
                        <TableCell>
                          <Badge variant={accident.type === "Preventable" ? "destructive" : "secondary"}>
                            {accident.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{accident.injuries}</TableCell>
                        <TableCell>
                          {accident.dotReportable ? (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {accident.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DOT Reportable Accident Criteria</CardTitle>
              <CardDescription>§390.5 Definition of accident</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Fatality</h4>
                    <p className="text-sm text-muted-foreground">Results in death of a person</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Bodily Injury</h4>
                    <p className="text-sm text-muted-foreground">
                      Requires immediate medical treatment away from the scene
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Disabling Damage</h4>
                    <p className="text-sm text-muted-foreground">
                      Vehicle requires towing from the scene due to damage
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DOT Audit Readiness</CardTitle>
              <CardDescription>Prepare for FMCSA compliance reviews and audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Driver Qualification Files</h4>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {Math.round((drivers.filter((d) => d.dqFile === "complete").length / drivers.length) * 100)}%
                        Complete
                      </Badge>
                    </div>
                    <Progress
                      value={Math.round((drivers.filter((d) => d.dqFile === "complete").length / drivers.length) * 100)}
                      className="h-2 mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      {drivers.filter((d) => d.dqFile === "complete").length} of {drivers.length} files complete
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Medical Certificates</h4>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {Math.round((drivers.filter((d) => d.status === "compliant").length / drivers.length) * 100)}%
                        Current
                      </Badge>
                    </div>
                    <Progress
                      value={Math.round(
                        (drivers.filter((d) => d.status === "compliant").length / drivers.length) * 100,
                      )}
                      className="h-2 mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      {drivers.filter((d) => d.status === "compliant").length} of {drivers.length} valid
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Annual MVR Reviews</h4>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        100% Complete
                      </Badge>
                    </div>
                    <Progress value={100} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">All drivers reviewed</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Clearinghouse Queries</h4>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {Math.round((drivers.filter((d) => d.clearinghouse === "clear").length / drivers.length) * 100)}
                        % Complete
                      </Badge>
                    </div>
                    <Progress
                      value={Math.round(
                        (drivers.filter((d) => d.clearinghouse === "clear").length / drivers.length) * 100,
                      )}
                      className="h-2 mb-2"
                    />
                    <p className="text-sm text-muted-foreground">Annual queries completed</p>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleGenerateAuditReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Audit Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common DOT Audit Violations</CardTitle>
              <CardDescription>Top areas of focus during FMCSA compliance reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Incomplete or missing DQ files</span>
                  <Badge variant="secondary">High Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Expired medical certificates</span>
                  <Badge variant="secondary">High Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Missing annual MVR reviews</span>
                  <Badge variant="secondary">Medium Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Incomplete clearinghouse queries</span>
                  <Badge variant="secondary">High Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">HOS violations</span>
                  <Badge variant="secondary">Medium Risk</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddDriverDialog} onOpenChange={setShowAddDriverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New DOT Driver</DialogTitle>
            <DialogDescription>Add a new driver to the DOT compliance roster</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="driver-name">Driver Name *</Label>
              <Input
                id="driver-name"
                placeholder="Enter driver name"
                value={newDriverName}
                onChange={(e) => setNewDriverName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="license-type">License Type *</Label>
              <Select value={newDriverLicense} onValueChange={setNewDriverLicense}>
                <SelectTrigger id="license-type">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDL-A">CDL-A</SelectItem>
                  <SelectItem value="CDL-B">CDL-B</SelectItem>
                  <SelectItem value="CDL-C">CDL-C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="license-exp">License Expiration Date *</Label>
              <Input
                id="license-exp"
                type="date"
                value={newDriverLicenseExp}
                onChange={(e) => setNewDriverLicenseExp(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDriverDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDriver}>Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadMedicalDialog} onOpenChange={setShowUploadMedicalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Certificate</DialogTitle>
            <DialogDescription>Upload DOT medical examiner's certificate for a driver</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="medical-driver">Select Driver *</Label>
              <Select value={selectedDriverForMedical} onValueChange={setSelectedDriverForMedical}>
                <SelectTrigger id="medical-driver">
                  <SelectValue placeholder="Choose driver..." />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name} ({driver.license})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cert-exp">Certificate Expiration Date *</Label>
              <Input
                id="cert-exp"
                type="date"
                value={medicalCertDate}
                onChange={(e) => setMedicalCertDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cert-file">Upload Certificate (PDF)</Label>
              <Input id="cert-file" type="file" accept=".pdf" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadMedicalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadMedical}>Upload Certificate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportAccidentDialog} onOpenChange={setShowReportAccidentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report DOT Accident</DialogTitle>
            <DialogDescription>Report a DOT-reportable accident per §390.15</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accident-driver">Driver Involved *</Label>
              <Select value={accidentDriver} onValueChange={setAccidentDriver}>
                <SelectTrigger id="accident-driver">
                  <SelectValue placeholder="Select driver..." />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name} ({driver.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accident-date">Accident Date *</Label>
              <Input
                id="accident-date"
                type="date"
                value={accidentDate}
                onChange={(e) => setAccidentDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accident-location">Location *</Label>
              <Input
                id="accident-location"
                placeholder="e.g., I-95, Mile Marker 142"
                value={accidentLocation}
                onChange={(e) => setAccidentLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accident-type">Accident Type *</Label>
              <Select value={accidentType} onValueChange={setAccidentType}>
                <SelectTrigger id="accident-type">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventable">Preventable</SelectItem>
                  <SelectItem value="Non-Preventable">Non-Preventable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accident-description">Description</Label>
              <Textarea id="accident-description" placeholder="Describe the accident..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportAccidentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportAccident}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClearinghouseQueryDialog} onOpenChange={setShowClearinghouseQueryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Clearinghouse Query</DialogTitle>
            <DialogDescription>Submit query to FMCSA Drug & Alcohol Clearinghouse</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="query-type">Query Type *</Label>
              <Select value={queryType} onValueChange={setQueryType}>
                <SelectTrigger id="query-type">
                  <SelectValue placeholder="Select query type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-Employment">Pre-Employment (Full Query)</SelectItem>
                  <SelectItem value="Annual">Annual (Limited Query)</SelectItem>
                  <SelectItem value="Reasonable Suspicion">Reasonable Suspicion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="query-driver">Select Driver *</Label>
              <Select value={queryDriver} onValueChange={setQueryDriver}>
                <SelectTrigger id="query-driver">
                  <SelectValue placeholder="Choose driver..." />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.name}>
                      {driver.name} ({driver.license})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearinghouseQueryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunQuery}>Submit Query</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

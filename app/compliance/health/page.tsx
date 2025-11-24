"use client"

import { useState, useMemo } from "react"
import {
  Heart,
  Plus,
  Download,
  Activity,
  Search,
  AlertCircle,
  CheckCircle2,
  FileText,
  Shield,
  Calendar,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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

const mockEmployees = [
  {
    id: "EMP-001",
    name: "John Smith",
    department: "Operations",
    lastPhysical: "2024-06-15",
    nextPhysical: "2025-06-15",
    fitForDuty: true,
    workAccommodations: [],
    surveillancePrograms: ["Hearing Conservation", "Respiratory Protection"],
  },
  {
    id: "EMP-002",
    name: "Sarah Johnson",
    department: "Maintenance",
    lastPhysical: "2024-11-20",
    nextPhysical: "2025-11-20",
    fitForDuty: true,
    workAccommodations: ["No overhead lifting"],
    surveillancePrograms: ["Hearing Conservation"],
  },
  {
    id: "EMP-003",
    name: "Mike Davis",
    department: "Warehouse",
    lastPhysical: "2024-03-10",
    nextPhysical: "2025-03-10",
    fitForDuty: false,
    workAccommodations: ["Light duty only", "No driving"],
    surveillancePrograms: ["Respiratory Protection"],
  },
]

const mockOSHAIncidents = [
  {
    id: "OSHA-2025-001",
    employee: "Mike Davis",
    date: "2025-01-10",
    type: "Injury",
    description: "Strained back while lifting",
    daysAway: 3,
    daysAccommodated: 7,
    recordable: true,
    status: "Closed",
  },
  {
    id: "OSHA-2025-002",
    employee: "Jane Wilson",
    date: "2025-01-05",
    type: "Illness",
    description: "Occupational dermatitis",
    daysAway: 0,
    daysAccommodated: 0,
    recordable: true,
    status: "Open",
  },
]

const mockSurveillancePrograms = [
  {
    name: "Hearing Conservation",
    employees: 45,
    frequency: "Annual",
    lastCompleted: "2024-12-15",
    nextDue: "2025-12-15",
    compliance: 100,
  },
  {
    name: "Respiratory Protection",
    employees: 32,
    frequency: "Annual",
    lastCompleted: "2024-11-20",
    nextDue: "2025-11-20",
    compliance: 97,
  },
  {
    name: "Hazmat Exposure Monitoring",
    employees: 18,
    frequency: "Quarterly",
    lastCompleted: "2025-01-05",
    nextDue: "2025-04-05",
    compliance: 100,
  },
]

export default function HealthPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showScheduleExamDialog, setShowScheduleExamDialog] = useState(false)
  const [showLogIncidentDialog, setShowLogIncidentDialog] = useState(false)
  const [showUpdateAccommodationsDialog, setShowUpdateAccommodationsDialog] = useState(false)

  const [employees, setEmployees] = useState(mockEmployees)
  const [incidents, setIncidents] = useState(mockOSHAIncidents)

  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [examType, setExamType] = useState("")
  const [examDate, setExamDate] = useState("")
  const [examNotes, setExamNotes] = useState("")

  const [incidentEmployee, setIncidentEmployee] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [incidentType, setIncidentType] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [incidentDaysAway, setIncidentDaysAway] = useState("")
  const [incidentDaysAccommodated, setIncidentDaysAccommodated] = useState("")

  const [accommodationEmployee, setAccommodationEmployee] = useState("")
  const [newAccommodation, setNewAccommodation] = useState("")

  const { toast } = useToast()

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesStatus = true
      if (statusFilter === "fit") {
        matchesStatus = employee.fitForDuty && employee.workAccommodations.length === 0
      } else if (statusFilter === "with-accommodations") {
        matchesStatus = employee.workAccommodations.length > 0
      } else if (statusFilter === "upcoming") {
        const nextPhysicalDate = new Date(employee.nextPhysical)
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        matchesStatus = nextPhysicalDate <= thirtyDaysFromNow
      }

      return matchesSearch && matchesStatus
    })
  }, [employees, searchQuery, statusFilter])

  const handleScheduleExam = () => {
    if (!selectedEmployee || !examType || !examDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setEmployees(employees.map((emp) => (emp.name === selectedEmployee ? { ...emp, nextPhysical: examDate } : emp)))

    setShowScheduleExamDialog(false)
    setSelectedEmployee("")
    setExamType("")
    setExamDate("")
    setExamNotes("")

    toast({
      title: "Exam Scheduled",
      description: `${examType} scheduled for ${selectedEmployee} on ${examDate}`,
    })
  }

  const handleLogIncident = () => {
    if (!incidentEmployee || !incidentDate || !incidentType || !incidentDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newIncident = {
      id: `OSHA-2025-${String(incidents.length + 1).padStart(3, "0")}`,
      employee: incidentEmployee,
      date: incidentDate,
      type: incidentType,
      description: incidentDescription,
      daysAway: Number.parseInt(incidentDaysAway) || 0,
      daysAccommodated: Number.parseInt(incidentDaysAccommodated) || 0,
      recordable: true,
      status: "Open",
    }

    setIncidents([newIncident, ...incidents])
    setShowLogIncidentDialog(false)
    setIncidentEmployee("")
    setIncidentDate("")
    setIncidentType("")
    setIncidentDescription("")
    setIncidentDaysAway("")
    setIncidentDaysAccommodated("")

    toast({
      title: "Incident Logged",
      description: `OSHA incident ${newIncident.id} has been recorded`,
    })
  }

  const handleUpdateAccommodations = () => {
    if (!accommodationEmployee || !newAccommodation) {
      toast({
        title: "Missing Information",
        description: "Please select an employee and enter a work accommodation",
        variant: "destructive",
      })
      return
    }

    setEmployees(
      employees.map((emp) =>
        emp.name === accommodationEmployee
          ? { ...emp, workAccommodations: [...emp.workAccommodations, newAccommodation], fitForDuty: false }
          : emp,
      ),
    )

    setShowUpdateAccommodationsDialog(false)
    setAccommodationEmployee("")
    setNewAccommodation("")

    toast({
      title: "Work Accommodations Updated",
      description: `Work accommodations updated for ${accommodationEmployee}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Occupational Health</h1>
          <p className="text-muted-foreground">Manage health surveillance and OSHA compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowScheduleExamDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Physical Exams (YTD)</CardDescription>
            <CardTitle className="text-3xl">234</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">+15% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Exams</CardDescription>
            <CardTitle className="text-3xl">18</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fit for Duty</CardDescription>
            <CardTitle className="text-3xl">
              {Math.round((employees.filter((e) => e.fitForDuty).length / employees.length) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Above target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>OSHA Recordables</CardDescription>
            <CardTitle className="text-3xl">{incidents.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="surveillance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="surveillance">Health Surveillance</TabsTrigger>
          <TabsTrigger value="physicals">Physical Exams</TabsTrigger>
          <TabsTrigger value="osha">OSHA 300 Log</TabsTrigger>
          <TabsTrigger value="accommodations">Work Accommodations</TabsTrigger>
        </TabsList>

        <TabsContent value="surveillance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Surveillance Programs</CardTitle>
              <CardDescription>Monitor exposure-based medical surveillance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSurveillancePrograms.map((program, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.employees} employees | {program.frequency} testing
                        </p>
                      </div>
                      <Badge
                        className={
                          program.compliance === 100
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }
                      >
                        {program.compliance}% Compliant
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Last Completed:</span>
                        <span className="ml-2 font-medium">{program.lastCompleted}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Due:</span>
                        <span className="ml-2 font-medium">{program.nextDue}</span>
                      </div>
                    </div>
                    <Progress value={program.compliance} className="h-2 mb-3" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Tests
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Results
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Surveillance Program Requirements</CardTitle>
              <CardDescription>OSHA-mandated medical surveillance programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Hearing Conservation (29 CFR 1910.95)</h4>
                    <p className="text-sm text-muted-foreground">
                      Annual audiometric testing for noise exposure ≥85 dBA
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Respiratory Protection (29 CFR 1910.134)</h4>
                    <p className="text-sm text-muted-foreground">
                      Medical evaluation before respirator use, annual fit testing
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Hazmat Exposure (29 CFR 1910.1200)</h4>
                    <p className="text-sm text-muted-foreground">Periodic monitoring for hazardous chemical exposure</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physicals" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="fit">Fit for Duty</SelectItem>
                    <SelectItem value="with-accommodations">With Work Accommodations</SelectItem>
                    <SelectItem value="upcoming">Exams Due Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Physical Exam Tracker</CardTitle>
              <CardDescription>
                Showing {filteredEmployees.length} of {employees.length} employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Physical</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Fit for Duty</TableHead>
                    <TableHead>Work Accommodations</TableHead>
                    <TableHead>Surveillance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No employees found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">{employee.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.lastPhysical}</TableCell>
                        <TableCell>{employee.nextPhysical}</TableCell>
                        <TableCell>
                          {employee.fitForDuty ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Fit
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              With Accommodations
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {employee.workAccommodations.length > 0 ? (
                            <div className="text-sm">{employee.workAccommodations.join(", ")}</div>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {employee.surveillancePrograms.slice(0, 1).map((program) => (
                              <Badge key={program} variant="secondary" className="text-xs">
                                {program}
                              </Badge>
                            ))}
                            {employee.surveillancePrograms.length > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                +{employee.surveillancePrograms.length - 1}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
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

          <Card>
            <CardHeader>
              <CardTitle>Physical Exam Types</CardTitle>
              <CardDescription>Required medical examinations by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Pre-Employment Physical</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required before starting work. Ensures candidate can safely perform job duties.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Annual Physical</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Yearly health assessment for employees in safety-sensitive positions.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Return-to-Work Physical</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required after extended absence or work-related injury before returning to duty.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Fit-for-Duty Evaluation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conducted when there are concerns about an employee's ability to safely perform duties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="osha" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>OSHA 300 Log</CardTitle>
                  <CardDescription>Record and track work-related injuries and illnesses</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowLogIncidentDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Log New Incident
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 mb-4">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">OSHA Compliance Status</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All recordable incidents have been properly logged and reported. DART rate: 1.2 (Below industry
                  average)
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case #</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Days Away</TableHead>
                    <TableHead>Days with Accommodations</TableHead>
                    <TableHead>Recordable</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No incidents recorded
                      </TableCell>
                    </TableRow>
                  ) : (
                    incidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">{incident.id}</TableCell>
                        <TableCell>{incident.employee}</TableCell>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{incident.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{incident.description}</TableCell>
                        <TableCell>{incident.daysAway}</TableCell>
                        <TableCell>{incident.daysAccommodated}</TableCell>
                        <TableCell>
                          {incident.recordable ? (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              incident.status === "Closed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }
                          >
                            {incident.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Recordable Incident Rate (TRIR)</CardDescription>
                <CardTitle className="text-3xl">1.8</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600 dark:text-green-400">Below industry average (2.4)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Days Away, Restricted, Transfer (DART)</CardDescription>
                <CardTitle className="text-3xl">1.2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600 dark:text-green-400">Below industry average (1.8)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Lost Time Injury Frequency (LTIF)</CardDescription>
                <CardTitle className="text-3xl">0.9</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-green-600 dark:text-green-400">Excellent safety performance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>OSHA Recordability Criteria</CardTitle>
              <CardDescription>When to record an injury or illness on the OSHA 300 Log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Death</h4>
                    <p className="text-sm text-muted-foreground">Any work-related fatality</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Days Away from Work</h4>
                    <p className="text-sm text-muted-foreground">Employee cannot come to work due to injury/illness</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Work with Accommodations or Job Transfer</h4>
                    <p className="text-sm text-muted-foreground">
                      Employee cannot perform routine job functions or is transferred
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Medical Treatment Beyond First Aid</h4>
                    <p className="text-sm text-muted-foreground">
                      Treatment by physician or licensed healthcare professional
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accommodations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Work Accommodations</CardTitle>
                  <CardDescription>Manage temporary and permanent work accommodations</CardDescription>
                </div>
                <Button onClick={() => setShowUpdateAccommodationsDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Work Accommodation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.filter((e) => e.workAccommodations.length > 0).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <p>No active work accommodations</p>
                  </div>
                ) : (
                  employees
                    .filter((e) => e.workAccommodations.length > 0)
                    .map((employee) => (
                      <div key={employee.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{employee.name}</h4>
                            <p className="text-sm text-muted-foreground">{employee.department}</p>
                          </div>
                          <Badge
                            className={
                              employee.fitForDuty
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }
                          >
                            {employee.fitForDuty ? "Modified Duty" : "Not Fit for Duty"}
                          </Badge>
                        </div>
                        <div className="space-y-2 mb-3">
                          <h5 className="text-sm font-medium">Current Work Accommodations:</h5>
                          {employee.workAccommodations.map((accommodation, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              <span>{accommodation}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAccommodationEmployee(employee.name)
                              setShowUpdateAccommodationsDialog(true)
                            }}
                          >
                            Update Accommodations
                          </Button>
                          <Button variant="outline" size="sm">
                            Schedule Follow-up
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ADA Reasonable Accommodations</CardTitle>
              <CardDescription>Track accommodations under Americans with Disabilities Act</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <p>No active accommodation requests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showScheduleExamDialog} onOpenChange={setShowScheduleExamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Physical Exam</DialogTitle>
            <DialogDescription>Schedule a medical examination for an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exam-employee">Select Employee *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger id="exam-employee">
                  <SelectValue placeholder="Choose employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.name}>
                      {emp.name} ({emp.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-type">Exam Type *</Label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger id="exam-type">
                  <SelectValue placeholder="Select exam type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-Employment Physical">Pre-Employment Physical</SelectItem>
                  <SelectItem value="Annual Physical">Annual Physical</SelectItem>
                  <SelectItem value="Return-to-Work Physical">Return-to-Work Physical</SelectItem>
                  <SelectItem value="Fit-for-Duty Evaluation">Fit-for-Duty Evaluation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-date">Exam Date *</Label>
              <Input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="exam-notes">Notes (Optional)</Label>
              <Textarea
                id="exam-notes"
                placeholder="Add any special instructions..."
                value={examNotes}
                onChange={(e) => setExamNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleExamDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleExam}>Schedule Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogIncidentDialog} onOpenChange={setShowLogIncidentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log OSHA Incident</DialogTitle>
            <DialogDescription>Record a work-related injury or illness</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="incident-employee">Employee *</Label>
              <Select value={incidentEmployee} onValueChange={setIncidentEmployee}>
                <SelectTrigger id="incident-employee">
                  <SelectValue placeholder="Select employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.name}>
                      {emp.name} ({emp.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incident-date">Incident Date *</Label>
                <Input
                  id="incident-date"
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="incident-type">Type *</Label>
                <Select value={incidentType} onValueChange={setIncidentType}>
                  <SelectTrigger id="incident-type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Injury">Injury</SelectItem>
                    <SelectItem value="Illness">Illness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="incident-description">Description *</Label>
              <Textarea
                id="incident-description"
                placeholder="Describe the incident..."
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="days-away">Days Away from Work</Label>
                <Input
                  id="days-away"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={incidentDaysAway}
                  onChange={(e) => setIncidentDaysAway(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="days-accommodated">Days with Work Accommodations</Label>
                <Input
                  id="days-accommodated"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={incidentDaysAccommodated}
                  onChange={(e) => setIncidentDaysAccommodated(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogIncidentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogIncident}>Log Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpdateAccommodationsDialog} onOpenChange={setShowUpdateAccommodationsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Work Accommodations</DialogTitle>
            <DialogDescription>Add or modify work accommodations for an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accommodation-employee">Select Employee *</Label>
              <Select value={accommodationEmployee} onValueChange={setAccommodationEmployee}>
                <SelectTrigger id="accommodation-employee">
                  <SelectValue placeholder="Choose employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.name}>
                      {emp.name} ({emp.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-accommodation">Work Accommodation *</Label>
              <Input
                id="new-accommodation"
                placeholder="e.g., No lifting over 25 lbs"
                value={newAccommodation}
                onChange={(e) => setNewAccommodation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateAccommodationsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAccommodations}>Add Work Accommodation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

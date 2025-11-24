"use client"

import { useState, useMemo } from "react"
import {
  TestTube,
  Plus,
  Download,
  Filter,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  X,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

type TestStatus = "negative" | "positive" | "pending"
type TestType = "Pre-Employment" | "Random" | "Post-Accident" | "Reasonable Suspicion" | "Return-to-Duty" | "Follow-Up"

interface DrugTest {
  id: string
  employee: string
  employeeId: string
  type: TestType
  testType: string
  date: string
  status: TestStatus
  turnaround: string
  vendor: string
  mroReview?: string
}

const mockTests: DrugTest[] = [
  {
    id: "DT-2025-001",
    employee: "John Smith",
    employeeId: "EMP-001",
    type: "Random",
    testType: "DOT 5-Panel",
    date: "2025-01-15",
    status: "negative",
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
    status: "pending",
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
    status: "positive",
    turnaround: "72h",
    vendor: "CRL",
    mroReview: "pending",
  },
  {
    id: "DT-2025-004",
    employee: "Emily Brown",
    employeeId: "EMP-004",
    type: "Post-Accident",
    testType: "DOT 5-Panel",
    date: "2025-01-12",
    status: "negative",
    turnaround: "24h",
    vendor: "Quest",
  },
]

const randomPoolStats = {
  totalEligible: 150,
  requiredTests: 12,
  completedThisQuarter: 8,
  remainingTests: 4,
  complianceRate: 67,
  nextSelectionDate: "2025-02-01",
}

const violations = [
  {
    id: "VIO-001",
    employee: "Mike Davis",
    employeeId: "EMP-003",
    date: "2025-01-13",
    type: "Positive Test",
    substance: "THC",
    status: "SAP Referral",
    sapName: "Dr. Jane Wilson",
  },
]

export default function DrugTestingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [testTypeFilter, setTestTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showMoreFilters, setShowMoreFilters] = useState(false)

  // Dialog states
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showRandomSelectionDialog, setShowRandomSelectionDialog] = useState(false)
  const [showPoolRosterDialog, setShowPoolRosterDialog] = useState(false)
  const [showMroReviewDialog, setShowMroReviewDialog] = useState(false)
  const [showReturnToDutyDialog, setShowReturnToDutyDialog] = useState(false)
  const [showClearinghouseDialog, setShowClearinghouseDialog] = useState(false)
  const [showReportViolationDialog, setShowReportViolationDialog] = useState(false)
  const [showVendorConfigDialog, setShowVendorConfigDialog] = useState(false)

  // Form states
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedTestType, setSelectedTestType] = useState("")
  const [selectedVendor, setSelectedVendor] = useState("")
  const [clearinghouseQueryType, setClearinghouseQueryType] = useState<"limited" | "full">("limited")
  const [mroDecision, setMroDecision] = useState("")
  const [mroNotes, setMroNotes] = useState("")

  const [tests, setTests] = useState(mockTests)
  const [randomSelectionResults, setRandomSelectionResults] = useState<string[]>([])
  const [selectedRandomEmployees, setSelectedRandomEmployees] = useState<string[]>([])
  const [alternateSelections, setAlternateSelections] = useState<string[][]>([])
  const [randomSelectionView, setRandomSelectionView] = useState<"list" | "grid" | "export">("list")

  const { toast } = useToast()

  const [selectionHistory, setSelectionHistory] = useState([
    {
      date: "2025-01-15",
      count: 4,
      employees: ["John Smith", "Sarah Johnson", "Mike Davis", "Emily Brown"],
      pool: "DOT Pool",
      policyNumber: "DOT-2025",
      panelCode: "DOT5",
    },
    {
      date: "2024-12-15",
      count: 4,
      employees: ["Employee 5", "Employee 6", "Employee 7", "Employee 8"],
      pool: "Non-DOT Chevron",
      policyNumber: "PA36",
      panelCode: "PA36",
    },
  ])
  const [showSelectionHistoryDialog, setShowSelectionHistoryDialog] = useState(false)
  const [showContactEmployeeDialog, setShowContactEmployeeDialog] = useState(false)
  const [contactEmployee, setContactEmployee] = useState("")

  const testingPools = [
    {
      id: "dot",
      name: "DOT Pool",
      policy: "DOT Regulations",
      policyNumber: "DOT-2025",
      panelCode: "DOT5",
      eligible: 120,
      requiredRate: "50% Drug / 10% Alcohol",
      completedThisQuarter: 30,
      requiredTests: 60,
      color: "bg-blue-500",
    },
    {
      id: "chevron",
      name: "Non-DOT Chevron",
      policy: "Chevron Policy",
      policyNumber: "PA36",
      panelCode: "PA36",
      eligible: 85,
      requiredRate: "25% Annual",
      completedThisQuarter: 15,
      requiredTests: 21,
      color: "bg-purple-500",
    },
    {
      id: "exxon",
      name: "Non-DOT Exxon",
      policy: "Exxon Policy",
      policyNumber: "ML89",
      panelCode: "ML89",
      eligible: 62,
      requiredRate: "30% Annual",
      completedThisQuarter: 12,
      requiredTests: 19,
      color: "bg-green-500",
    },
    {
      id: "oxy",
      name: "Non-DOT Oxy",
      policy: "Oxy Policy",
      policyNumber: "CL36",
      panelCode: "CL36",
      eligible: 48,
      requiredRate: "20% Annual",
      completedThisQuarter: 8,
      requiredTests: 10,
      color: "bg-orange-500",
    },
  ]

  const [selectedPool, setSelectedPool] = useState<string>("dot")

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      // Search filter
      const matchesSearch =
        test.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.employeeId.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || test.status === statusFilter

      // Test type filter
      const matchesTestType = testTypeFilter === "all" || test.type === testTypeFilter

      // Date range filter
      const matchesDateRange = (!dateFrom || test.date >= dateFrom) && (!dateTo || test.date <= dateTo)

      return matchesSearch && matchesStatus && matchesTestType && matchesDateRange
    })
  }, [tests, searchQuery, statusFilter, testTypeFilter, dateFrom, dateTo])

  const handleScheduleTest = () => {
    if (!selectedEmployee || !selectedTestType || !selectedVendor) return

    const newTest: DrugTest = {
      id: `DT-2025-${String(tests.length + 1).padStart(3, "0")}`,
      employee: selectedEmployee,
      employeeId: `EMP-${String(tests.length + 1).padStart(3, "0")}`,
      type: selectedTestType as TestType,
      testType: "DOT 5-Panel",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      turnaround: "48h",
      vendor: selectedVendor,
    }

    setTests([newTest, ...tests])
    setShowScheduleDialog(false)
    setSelectedEmployee("")
    setSelectedTestType("")
    setSelectedVendor("")

    toast({
      title: "Test Scheduled",
      description: `Drug test scheduled for ${selectedEmployee} via ${selectedVendor}`,
    })
  }

  const handleGenerateRandomSelection = () => {
    const currentPool = testingPools.find((p) => p.id === selectedPool) || testingPools[0]
    const poolSize = currentPool.eligible
    const selectionCount = Math.min(4, currentPool.requiredTests - currentPool.completedThisQuarter)
    const selected: string[] = []

    const randomValues = new Uint32Array(selectionCount)
    crypto.getRandomValues(randomValues)

    for (let i = 0; i < selectionCount; i++) {
      const randomIndex = randomValues[i] % poolSize
      selected.push(`Employee ${randomIndex + 1}`)
    }

    setRandomSelectionResults(selected)
    setSelectedRandomEmployees([])
    setAlternateSelections([])
    setShowRandomSelectionDialog(true)

    setSelectionHistory([
      {
        date: new Date().toISOString().split("T")[0],
        count: selected.length,
        employees: selected,
        pool: currentPool.name,
        policyNumber: currentPool.policyNumber,
        panelCode: currentPool.panelCode,
      },
      ...selectionHistory,
    ])
  }

  const handleGenerateAlternates = () => {
    const alternates: string[][] = []
    const currentPool = testingPools.find((p) => p.id === selectedPool)
    const poolSize = currentPool?.eligible || randomPoolStats.totalEligible
    const selectionCount = randomSelectionResults.length

    for (let alt = 0; alt < 5; alt++) {
      const selected: string[] = []
      const randomValues = new Uint32Array(selectionCount)
      crypto.getRandomValues(randomValues)

      for (let i = 0; i < selectionCount; i++) {
        const randomIndex = randomValues[i] % poolSize
        selected.push(`Employee ${randomIndex + 1}`)
      }
      alternates.push(selected)
    }

    setAlternateSelections(alternates)
  }

  // Notify employees handler
  const handleNotifyEmployees = () => {
    toast({
      title: "Notifications Sent",
      description: `${randomSelectionResults.length} employees have been notified via email and SMS`,
    })
    setShowRandomSelectionDialog(false)
  }

  const handleMroReview = () => {
    if (!mroDecision) return

    setTests(
      tests.map((test) =>
        test.id === "DT-2025-003"
          ? { ...test, status: mroDecision === "confirmed" ? "positive" : ("negative" as TestStatus) }
          : test,
      ),
    )

    setShowMroReviewDialog(false)
    setMroDecision("")
    setMroNotes("")

    toast({
      title: "MRO Review Submitted",
      description: `Test result ${mroDecision === "confirmed" ? "confirmed as positive" : "overturned to negative"}`,
    })
  }

  // Contact employee handler
  const handleContactEmployee = (employeeName: string) => {
    setContactEmployee(employeeName)
    setShowContactEmployeeDialog(true)
  }

  const handleScheduleReturnToDuty = () => {
    const newTest: DrugTest = {
      id: `DT-2025-${String(tests.length + 1).padStart(3, "0")}`,
      employee: "Mike Davis",
      employeeId: "EMP-003",
      type: "Return-to-Duty",
      testType: "DOT 5-Panel",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      turnaround: "48h",
      vendor: "CRL",
    }

    setTests([newTest, ...tests])
    setShowReturnToDutyDialog(false)

    toast({
      title: "Return-to-Duty Test Scheduled",
      description: "Test has been added to the queue and employee has been notified",
    })
  }

  const handleClearinghouseQuery = () => {
    toast({
      title: "Clearinghouse Query Submitted",
      description: "Query is being processed. Results will be available in 2-5 minutes.",
    })

    setTimeout(() => {
      toast({
        title: "Query Complete",
        description: `${clearinghouseQueryType === "limited" ? "Limited" : "Full"} query completed. No violations found.`,
      })
      setShowClearinghouseDialog(false)
    }, 2000)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTestTypeFilter("all")
    setDateFrom("")
    setDateTo("")
  }

  const toggleEmployeeSelection = (employee: string) => {
    setSelectedRandomEmployees((prev) =>
      prev.includes(employee) ? prev.filter((e) => e !== employee) : [...prev, employee],
    )
  }

  const handleExportSelection = (format: "pdf" | "csv" | "print") => {
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: `Random selection results with company logo included`,
    })
  }

  const handleEmailSelection = () => {
    toast({
      title: "Email Sent",
      description: `Random selection results emailed with company logo`,
    })
  }

  const getStatusBadge = (status: TestStatus) => {
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
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drug & Alcohol Testing</h1>
          <p className="text-muted-foreground">DOT & Non-DOT compliance management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowScheduleDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Test
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tests (YTD)</CardDescription>
            <CardTitle className="text-3xl">247</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">+12% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Results</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Avg. 36h turnaround</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>MRO Review</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Positive Rate</CardDescription>
            <CardTitle className="text-3xl">2.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Below industry avg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Random Pool</CardDescription>
            <CardTitle className="text-3xl">{randomPoolStats.complianceRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              {randomPoolStats.remainingTests} tests needed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-foreground">DOT & Non-DOT Drug and Alcohol Testing Program</h3>
                <p className="text-base font-semibold text-foreground leading-relaxed">
                  This program includes DOT and non-DOT drug and alcohol testing programs, including pre-employment,
                  random, post-accident, reasonable suspicion, return-to-duty, follow-up, MRO review, SAP referrals, and
                  FMCSA Clearinghouse reporting.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Who Needs It</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-base font-bold text-foreground">CDL Drivers</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-base font-bold text-foreground">Safety-Sensitive Employees</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-base font-bold text-foreground">DOT-Regulated Positions</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Compliance Frequency</p>
                <p className="text-base font-bold text-foreground">
                  Random testing: 50% annually (drug), 10% annually (alcohol). Pre-employment within 12 months.
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Next Random Selection</p>
                <p className="text-base font-bold text-primary">{randomPoolStats.nextSelectionDate}</p>
                <p className="text-sm text-muted-foreground">
                  {randomPoolStats.remainingTests} tests remaining this quarter
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Test History</TabsTrigger>
          <TabsTrigger value="random-pool">Random Pool</TabsTrigger>
          <TabsTrigger value="random-generation">Random Generation</TabsTrigger>
          <TabsTrigger value="mro-review">MRO Review</TabsTrigger>
          <TabsTrigger value="violations">Violations & SAP</TabsTrigger>
          <TabsTrigger value="clearinghouse">Clearinghouse</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee name or test ID..."
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
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Test Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Pre-Employment">Pre-Employment</SelectItem>
                    <SelectItem value="Random">Random</SelectItem>
                    <SelectItem value="Post-Accident">Post-Accident</SelectItem>
                    <SelectItem value="Reasonable Suspicion">Reasonable Suspicion</SelectItem>
                    <SelectItem value="Return-to-Duty">Return-to-Duty</SelectItem>
                    <SelectItem value="Follow-Up">Follow-Up</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowMoreFilters(!showMoreFilters)}>
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
                {(searchQuery || statusFilter !== "all" || testTypeFilter !== "all" || dateFrom || dateTo) && (
                  <Button variant="ghost" onClick={handleClearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>

              {showMoreFilters && (
                <div className="mt-4 flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="date-from">Date From</Label>
                    <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="date-to">Date To</Label>
                    <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
              <CardDescription>
                Showing {filteredTests.length} of {tests.length} tests
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No tests found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.id}</TableCell>
                        <TableCell>
                          <Link href={`/employees/${test.employeeId}`} className="hover:underline">
                            {test.employee}
                          </Link>
                        </TableCell>
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

        <TabsContent value="random-pool" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Testing Pool</CardTitle>
              <CardDescription>Choose which policy-specific pool to manage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {testingPools.map((pool) => (
                  <button
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedPool === pool.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${pool.color}`} />
                      <h3 className="font-semibold text-sm">{pool.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{pool.policy}</p>
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Policy #:</span>
                        <span className="font-medium">{pool.policyNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Panel:</span>
                        <span className="font-medium">{pool.panelCode}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Eligible:</span>
                      <span className="font-medium">{pool.eligible}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{pool.requiredRate}</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium">
                          {pool.completedThisQuarter}/{pool.requiredTests}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div
                          className={`h-1.5 rounded-full ${pool.color}`}
                          style={{ width: `${(pool.completedThisQuarter / pool.requiredTests) * 100}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Random Testing Pool Management</CardTitle>
              <CardDescription>
                {testingPools.find((p) => p.id === selectedPool)?.name} - Policy{" "}
                {testingPools.find((p) => p.id === selectedPool)?.policyNumber} (Panel:{" "}
                {testingPools.find((p) => p.id === selectedPool)?.panelCode})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quarterly Progress</span>
                    <span className="font-medium">
                      {testingPools.find((p) => p.id === selectedPool)?.completedThisQuarter} /{" "}
                      {testingPools.find((p) => p.id === selectedPool)?.requiredTests}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${((testingPools.find((p) => p.id === selectedPool)?.completedThisQuarter || 0) / (testingPools.find((p) => p.id === selectedPool)?.requiredTests || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Eligible Employees</span>
                    <span className="font-medium">{testingPools.find((p) => p.id === selectedPool)?.eligible}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tests Remaining</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {(testingPools.find((p) => p.id === selectedPool)?.requiredTests || 0) -
                        (testingPools.find((p) => p.id === selectedPool)?.completedThisQuarter || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Required Rate</span>
                    <span className="font-medium">{testingPools.find((p) => p.id === selectedPool)?.requiredRate}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">DOT-Compliant Random Selection Algorithm</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our algorithm ensures true randomness and audit-proof selection. Each employee in the pool has an
                  equal chance of selection for every draw, meeting FMCSA requirements.
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleGenerateRandomSelection}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Generate Random Selection
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pool Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">DOT Safety-Sensitive</span>
                      <span className="font-medium">120 employees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Non-DOT</span>
                      <span className="font-medium">30 employees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Required Annual Rate</span>
                      <span className="font-medium">50% Drug / 10% Alcohol</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="random-generation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Testing Pool</CardTitle>
              <CardDescription>Choose which policy-specific pool to generate selections from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {testingPools.map((pool) => (
                  <button
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedPool === pool.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${pool.color}`} />
                      <h3 className="font-semibold text-sm">{pool.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{pool.policy}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Eligible:</span>
                      <span className="font-medium">{pool.eligible}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Random Selection Process</CardTitle>
              <CardDescription>Generate DOT-compliant random selections separate from pool management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">DOT-Compliant Random Selection Algorithm</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our algorithm ensures true randomness and audit-proof selection. Each employee in the pool has an
                  equal chance of selection for every draw, meeting FMCSA requirements.
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleGenerateRandomSelection}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Generate Random Selection
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selection Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Pool Size</span>
                      <span className="font-medium">{randomPoolStats.totalEligible} employees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quarterly Progress</span>
                      <span className="font-medium">
                        {randomPoolStats.completedThisQuarter} / {randomPoolStats.requiredTests}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tests Remaining</span>
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">
                        {randomPoolStats.remainingTests}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Selection Date</span>
                      <span className="font-medium">{randomPoolStats.nextSelectionDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mro-review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MRO Review Workflow</CardTitle>
              <CardDescription>Medical Review Officer interface for positive results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Test Date</TableHead>
                    <TableHead>Substance</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>MRO Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">DT-2025-003</TableCell>
                    <TableCell>
                      <Link href="/employees/EMP-003" className="hover:underline">
                        Mike Davis
                      </Link>
                    </TableCell>
                    <TableCell>2025-01-13</TableCell>
                    <TableCell>THC</TableCell>
                    <TableCell>65 ng/mL</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setShowMroReviewDialog(true)}>
                          Review
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleContactEmployee("Mike Davis")}>
                          Contact Employee
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DOT Violations & SAP Referrals</CardTitle>
              <CardDescription>Track violations, SAP referrals, and return-to-duty process</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Violation ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Substance</TableHead>
                    <TableHead>SAP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="font-medium">{violation.id}</TableCell>
                      <TableCell>
                        <Link href={`/employees/${violation.employeeId}`} className="hover:underline">
                          {violation.employee}
                        </Link>
                      </TableCell>
                      <TableCell>{violation.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        >
                          {violation.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{violation.substance}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{violation.sapName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        >
                          {violation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-medium">Return-to-Duty Process</h3>
                <p className="text-sm text-muted-foreground">
                  After SAP evaluation and treatment, employees must complete return-to-duty testing and follow-up
                  testing (minimum 6 tests in 12 months).
                </p>
                <Button variant="outline" onClick={() => setShowReturnToDutyDialog(true)}>
                  Schedule Return-to-Duty Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clearinghouse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DOT Drug & Alcohol Clearinghouse</CardTitle>
              <CardDescription>Query and report to the FMCSA Clearinghouse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Limited Query</CardTitle>
                    <CardDescription>Pre-employment screening</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Required before hiring a CDL driver. Checks for unresolved violations.
                    </p>
                    <Button
                      onClick={() => {
                        setClearinghouseQueryType("limited")
                        setShowClearinghouseDialog(true)
                      }}
                    >
                      Run Limited Query
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Full Query</CardTitle>
                    <CardDescription>Annual requirement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Required annually for all CDL drivers. Requires employee consent.
                    </p>
                    <Button
                      onClick={() => {
                        setClearinghouseQueryType("full")
                        setShowClearinghouseDialog(true)
                      }}
                    >
                      Run Full Query
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Employers must report positive tests, refusals, and other violations to the Clearinghouse within 2
                    business days.
                  </p>
                  <Button variant="outline" onClick={() => setShowReportViolationDialog(true)}>
                    Report Violation
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Integrations</CardTitle>
              <CardDescription>Internal vendor connection management (configured by system admin)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      CRL (Clinical Reference Laboratory)
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        Connected
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tests YTD</span>
                        <span className="font-medium">147</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Turnaround</span>
                        <span className="font-medium">32 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Webhook Status</span>
                        <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Managed by system administrator</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      Quest Diagnostics
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        Connected
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tests YTD</span>
                        <span className="font-medium">100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Turnaround</span>
                        <span className="font-medium">28 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Webhook Status</span>
                        <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Managed by system administrator</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Webhook Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vendors send real-time updates via webhooks when test results are available. Configure endpoints and
                    authentication below.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Webhook Endpoint</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">/api/webhooks/drug-testing</code>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events Received (24h)</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Test Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Drug Test</DialogTitle>
            <DialogDescription>Schedule a new drug or alcohol test for an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                  <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="test-type">Test Type</Label>
              <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-Employment">Pre-Employment</SelectItem>
                  <SelectItem value="Random">Random</SelectItem>
                  <SelectItem value="Post-Accident">Post-Accident</SelectItem>
                  <SelectItem value="Reasonable Suspicion">Reasonable Suspicion</SelectItem>
                  <SelectItem value="Return-to-Duty">Return-to-Duty</SelectItem>
                  <SelectItem value="Follow-Up">Follow-Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vendor">Testing Vendor</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRL">CRL</SelectItem>
                  <SelectItem value="Quest">Quest Diagnostics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleTest}>Schedule Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRandomSelectionDialog} onOpenChange={setShowRandomSelectionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Random Selection Results</DialogTitle>
            <DialogDescription>
              {randomSelectionResults.length} employees have been randomly selected for testing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 border-b pb-4">
            <div className="flex gap-2">
              <Button
                variant={randomSelectionView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setRandomSelectionView("list")}
              >
                List View
              </Button>
              <Button
                variant={randomSelectionView === "export" ? "default" : "outline"}
                size="sm"
                onClick={() => setRandomSelectionView("export")}
              >
                Export Options
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerateAlternates}>
                Generate Alternates
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExportSelection("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportSelection("print")}>
                <Download className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmailSelection}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {randomSelectionResults.map((employee, index) => (
              <button
                key={index}
                onClick={() => toggleEmployeeSelection(employee)}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  selectedRandomEmployees.includes(employee)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      selectedRandomEmployees.includes(employee) ? "bg-white text-blue-600" : "bg-muted"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{employee}</span>
                </div>
                <Badge variant={selectedRandomEmployees.includes(employee) ? "secondary" : "default"}>
                  {selectedRandomEmployees.includes(employee) ? "Selected" : "Click to Select"}
                </Badge>
              </button>
            ))}
          </div>

          {alternateSelections.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3">Alternate Selections</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {alternateSelections.map((alternate, altIndex) => (
                  <Card key={altIndex}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Alternate {altIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {alternate.map((emp, empIndex) => (
                          <Badge key={empIndex} variant="secondary">
                            {emp}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRandomSelectionDialog(false)}>
              Close
            </Button>
            <Button onClick={handleNotifyEmployees}>
              <Mail className="mr-2 h-4 w-4" />
              Notify Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pool Roster Dialog */}
      <Dialog open={showPoolRosterDialog} onOpenChange={setShowPoolRosterDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Random Testing Pool Roster</DialogTitle>
            <DialogDescription>{randomPoolStats.totalEligible} employees eligible for random testing</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Test</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>Employee {i + 1}</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>
                      <Badge variant="secondary">DOT</Badge>
                    </TableCell>
                    <TableCell>2024-11-15</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPoolRosterDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MRO Review Dialog */}
      <Dialog open={showMroReviewDialog} onOpenChange={setShowMroReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>MRO Review - DT-2025-003</DialogTitle>
            <DialogDescription>Medical Review Officer decision for Mike Davis</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Substance:</span>
                <p className="font-medium">THC</p>
              </div>
              <div>
                <span className="text-muted-foreground">Level:</span>
                <p className="font-medium">65 ng/mL</p>
              </div>
              <div>
                <span className="text-muted-foreground">Test Date:</span>
                <p className="font-medium">2025-01-13</p>
              </div>
              <div>
                <span className="text-muted-foreground">Test Type:</span>
                <p className="font-medium">Reasonable Suspicion</p>
              </div>
            </div>
            <div>
              <Label>MRO Decision</Label>
              <RadioGroup value={mroDecision} onValueChange={setMroDecision}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="confirmed" id="confirmed" />
                  <Label htmlFor="confirmed">Confirm Positive (Violation)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="negative" id="negative" />
                  <Label htmlFor="negative">Overturn to Negative (Legitimate Medical Use)</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="mro-notes">MRO Notes</Label>
              <Textarea
                id="mro-notes"
                placeholder="Enter review notes and justification..."
                value={mroNotes}
                onChange={(e) => setMroNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMroReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMroReview} disabled={!mroDecision}>
              Submit Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSelectionHistoryDialog} onOpenChange={setShowSelectionHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Random Selection History</DialogTitle>
            <DialogDescription>Past random selections for audit compliance</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {selectionHistory.map((selection, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{selection.date}</CardTitle>
                    <div className="flex gap-2">
                      <Badge>{selection.count} employees</Badge>
                      <Badge variant="outline">{selection.pool}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                    <span>Policy: {selection.policyNumber}</span>
                    <span>Panel: {selection.panelCode}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selection.employees.map((emp, i) => (
                      <Badge key={i} variant="secondary">
                        {emp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSelectionHistoryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showContactEmployeeDialog} onOpenChange={setShowContactEmployeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Employee</DialogTitle>
            <DialogDescription>Reach out to {contactEmployee} regarding MRO review</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Mail className="h-5 w-5" />
                <span>Send Email</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Phone className="h-5 w-5" />
                <span>Call Employee</span>
              </Button>
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" placeholder="Enter message for employee..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactEmployeeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Message Sent",
                  description: `${contactEmployee} has been contacted via email`,
                })
                setShowContactEmployeeDialog(false)
              }}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return-to-Duty Dialog */}
      <Dialog open={showReturnToDutyDialog} onOpenChange={setShowReturnToDutyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Return-to-Duty Test</DialogTitle>
            <DialogDescription>Schedule testing for employee returning after violation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rtd-employee">Employee</Label>
              <Select>
                <SelectTrigger id="rtd-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mike Davis">Mike Davis (VIO-001)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rtd-date">Test Date</Label>
              <Input id="rtd-date" type="date" />
            </div>
            <div>
              <Label htmlFor="rtd-vendor">Testing Vendor</Label>
              <Select>
                <SelectTrigger id="rtd-vendor">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRL">CRL</SelectItem>
                  <SelectItem value="Quest">Quest Diagnostics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnToDutyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleReturnToDuty}>Schedule Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clearinghouse Query Dialog */}
      <Dialog open={showClearinghouseDialog} onOpenChange={setShowClearinghouseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{clearinghouseQueryType === "limited" ? "Limited" : "Full"} Clearinghouse Query</DialogTitle>
            <DialogDescription>
              {clearinghouseQueryType === "limited"
                ? "Pre-employment screening for CDL drivers"
                : "Annual query for all CDL drivers (requires consent)"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ch-employee">Employee</Label>
              <Select>
                <SelectTrigger id="ch-employee">
                  <SelectValue placeholder="Select CDL driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-border p-4 space-y-2">
              <h4 className="font-medium text-sm">Query Information</h4>
              <p className="text-sm text-muted-foreground">
                {clearinghouseQueryType === "limited"
                  ? "This query checks for unresolved violations only. No consent required."
                  : "This query returns complete violation history. Employee consent is required."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearinghouseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClearinghouseQuery}>Run Query</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Violation Dialog */}
      <Dialog open={showReportViolationDialog} onOpenChange={setShowReportViolationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Violation to Clearinghouse</DialogTitle>
            <DialogDescription>Must be reported within 2 business days</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vio-employee">Employee</Label>
              <Select>
                <SelectTrigger id="vio-employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vio-type">Violation Type</Label>
              <Select>
                <SelectTrigger id="vio-type">
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive Test</SelectItem>
                  <SelectItem value="refusal">Refusal to Test</SelectItem>
                  <SelectItem value="adulteration">Adulteration/Substitution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vio-date">Violation Date</Label>
              <Input id="vio-date" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportViolationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowReportViolationDialog(false)}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vendor Configuration Dialog */}
      <Dialog open={showVendorConfigDialog} onOpenChange={setShowVendorConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vendor Integration Configuration</DialogTitle>
            <DialogDescription>Configure API credentials and webhook settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Enter API key" />
            </div>
            <div>
              <Label htmlFor="api-secret">API Secret</Label>
              <Input id="api-secret" type="password" placeholder="Enter API secret" />
            </div>
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input id="webhook-url" value="/api/webhooks/drug-testing" disabled />
            </div>
            <div className="rounded-lg border border-border p-4 space-y-2">
              <h4 className="font-medium text-sm">Webhook Events</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• test.result.available</p>
                <p>• test.result.updated</p>
                <p>• test.cancelled</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVendorConfigDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowVendorConfigDialog(false)}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import {
  UserCheck,
  Plus,
  Download,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Shield,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const mockScreenings = [
  {
    id: "BG-2025-001",
    employee: "John Smith",
    employeeId: "EMP-001",
    type: "Pre-Employment",
    status: "clear",
    date: "2025-01-15",
    completedDate: "2025-01-18",
    turnaround: "3 days",
    components: ["Criminal (County)", "Criminal (State)", "Criminal (Federal)", "MVR", "Employment Verification"],
    vendor: "TazWorks",
    adjudicationScore: 0,
  },
  {
    id: "BG-2025-002",
    employee: "Sarah Johnson",
    employeeId: "EMP-002",
    type: "7-Year Update",
    status: "in-progress",
    date: "2025-01-14",
    completedDate: null,
    turnaround: "5 days",
    components: ["Criminal (County)", "Criminal (State)", "MVR"],
    vendor: "TazWorks",
    adjudicationScore: null,
  },
  {
    id: "BG-2025-003",
    employee: "Mike Davis",
    employeeId: "EMP-003",
    type: "Pre-Employment",
    status: "review-required",
    date: "2025-01-13",
    completedDate: "2025-01-17",
    turnaround: "4 days",
    components: ["Criminal (County)", "Criminal (State)", "MVR", "Employment Verification", "Education Verification"],
    vendor: "TazWorks",
    adjudicationScore: 45,
    findings: ["Misdemeanor - Theft (2020)", "Traffic Violation - Speeding (2023)"],
  },
  {
    id: "BG-2025-004",
    employee: "Emily Brown",
    employeeId: "EMP-004",
    type: "Annual Review",
    status: "clear",
    date: "2025-01-12",
    completedDate: "2025-01-14",
    turnaround: "2 days",
    components: ["Criminal (County)", "MVR"],
    vendor: "TazWorks",
    adjudicationScore: 0,
  },
]

const mockAdverseActions = [
  {
    id: "AA-2025-001",
    employee: "Mike Davis",
    screeningId: "BG-2025-003",
    stage: "pre-adverse-sent",
    dateSent: "2025-01-17",
    waitingPeriodEnds: "2025-01-22",
    reason: "Misdemeanor conviction within lookback period",
  },
]

const mockAdjudicationRules = [
  {
    id: "RULE-001",
    category: "Criminal Records",
    severity: "High",
    condition: "Felony within 7 years",
    action: "Auto-Reject",
    lookbackYears: 7,
    active: true,
  },
  {
    id: "RULE-002",
    category: "Criminal Records",
    severity: "Medium",
    condition: "Misdemeanor within 5 years",
    action: "Manual Review",
    lookbackYears: 5,
    active: true,
  },
  {
    id: "RULE-003",
    category: "Motor Vehicle Records",
    severity: "High",
    condition: "DUI/DWI within 5 years",
    action: "Auto-Reject",
    lookbackYears: 5,
    active: true,
  },
  {
    id: "RULE-004",
    category: "Motor Vehicle Records",
    severity: "Medium",
    condition: "3+ moving violations within 3 years",
    action: "Manual Review",
    lookbackYears: 3,
    active: true,
  },
]

export default function BackgroundPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false)
  const [showAddOffenseDialog, setShowAddOffenseDialog] = useState(false)

  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [screeningType, setScreeningType] = useState("")
  const [screeningPackage, setScreeningPackage] = useState("")
  const [screeningNotes, setScreeningNotes] = useState("")

  const [screenings, setScreenings] = useState(mockScreenings)
  const [adjudicationRules, setAdjudicationRules] = useState(mockAdjudicationRules)
  const [disqualifyingOffenses, setDisqualifyingOffenses] = useState([
    "Violent crimes (murder, assault, robbery)",
    "Sexual offenses",
    "Drug trafficking",
  ])

  const { toast } = useToast()

  const filteredScreenings = useMemo(() => {
    return screenings.filter((screening) => {
      const matchesSearch =
        screening.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screening.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screening.employeeId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || screening.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [screenings, searchQuery, statusFilter])

  const handleOrderScreening = () => {
    if (!selectedEmployee || !screeningType || !screeningPackage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newScreening = {
      id: `BG-2025-${String(screenings.length + 1).padStart(3, "0")}`,
      employee: selectedEmployee,
      employeeId: `EMP-${String(screenings.length + 1).padStart(3, "0")}`,
      type: screeningType,
      status: "in-progress",
      date: new Date().toISOString().split("T")[0],
      completedDate: null,
      turnaround: "3-5 days",
      components:
        screeningPackage === "cdl"
          ? [
              "Criminal (County)",
              "Criminal (State)",
              "Criminal (Federal)",
              "MVR",
              "Employment Verification",
              "DOT Physical",
            ]
          : ["Criminal (County)", "Criminal (State)", "Employment Verification", "Education Verification"],
      vendor: "TazWorks",
      adjudicationScore: null,
    }

    setScreenings([newScreening, ...screenings])
    setShowOrderModal(false)
    setSelectedEmployee("")
    setScreeningType("")
    setScreeningPackage("")
    setScreeningNotes("")

    toast({
      title: "Screening Ordered",
      description: `Background check submitted for ${selectedEmployee} via TazWorks`,
    })
  }

  const handleToggleRule = (ruleId: string) => {
    setAdjudicationRules(
      adjudicationRules.map((rule) => (rule.id === ruleId ? { ...rule, active: !rule.active } : rule)),
    )

    const rule = adjudicationRules.find((r) => r.id === ruleId)
    toast({
      title: rule?.active ? "Rule Disabled" : "Rule Enabled",
      description: `Adjudication rule has been ${rule?.active ? "disabled" : "enabled"}`,
    })
  }

  const handleSendFinalNotice = () => {
    toast({
      title: "Final Notice Sent",
      description: "Final adverse action notice has been sent to the candidate",
    })
  }

  const handleAddOffense = (offense: string) => {
    if (!offense.trim()) return

    setDisqualifyingOffenses([...disqualifyingOffenses, offense])
    setShowAddOffenseDialog(false)

    toast({
      title: "Offense Added",
      description: "Disqualifying offense has been added to the list",
    })
  }

  const handleRemoveOffense = (offense: string) => {
    setDisqualifyingOffenses(disqualifyingOffenses.filter((o) => o !== offense))

    toast({
      title: "Offense Removed",
      description: "Disqualifying offense has been removed from the list",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clear":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Clear
          </Badge>
        )
      case "review-required":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Review Required
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        )
      case "adverse-action":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Adverse Action
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Medium</Badge>
      case "Low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Background Checks</h1>
          <p className="text-muted-foreground">Manage background screening and FCRA compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowOrderModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Order Screening
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Screenings (YTD)</CardDescription>
            <CardTitle className="text-3xl">156</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">+8% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Avg. 3.5 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Review Required</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Needs adjudication</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clear Rate</CardDescription>
            <CardTitle className="text-3xl">94%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Above industry avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="screenings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="screenings">Screening History</TabsTrigger>
          <TabsTrigger value="adjudication">Adjudication Matrix</TabsTrigger>
          <TabsTrigger value="adverse-action">Adverse Actions</TabsTrigger>
          <TabsTrigger value="continuous">Continuous Monitoring</TabsTrigger>
          <TabsTrigger value="fcra">FCRA Compliance</TabsTrigger>
          <TabsTrigger value="integration">TazWorks Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="screenings" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee name or screening ID..."
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
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review-required">Review Required</SelectItem>
                    <SelectItem value="adverse-action">Adverse Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Screenings</CardTitle>
              <CardDescription>
                Showing {filteredScreenings.length} of {screenings.length} screenings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Screening ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Date Ordered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScreenings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No screenings found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredScreenings.map((screening) => (
                      <TableRow key={screening.id}>
                        <TableCell className="font-medium">{screening.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{screening.employee}</div>
                            <div className="text-xs text-muted-foreground">{screening.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{screening.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {screening.components.slice(0, 2).map((comp) => (
                              <Badge key={comp} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                            {screening.components.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{screening.components.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{screening.date}</TableCell>
                        <TableCell>{getStatusBadge(screening.status)}</TableCell>
                        <TableCell>
                          {screening.adjudicationScore !== null ? (
                            <span
                              className={
                                screening.adjudicationScore > 50
                                  ? "text-red-600 dark:text-red-400 font-medium"
                                  : "text-green-600 dark:text-green-400"
                              }
                            >
                              {screening.adjudicationScore}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
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
        </TabsContent>

        <TabsContent value="adjudication" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Adjudication Matrix</CardTitle>
                  <CardDescription>Configure automated decision rules for background check results</CardDescription>
                </div>
                <Button onClick={() => setShowAddRuleDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Lookback Period</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjudicationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.category}</TableCell>
                      <TableCell>{rule.condition}</TableCell>
                      <TableCell>{getSeverityBadge(rule.severity)}</TableCell>
                      <TableCell>{rule.lookbackYears} years</TableCell>
                      <TableCell>
                        <Badge variant={rule.action === "Auto-Reject" ? "destructive" : "secondary"}>
                          {rule.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rule.active ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleToggleRule(rule.id)}>
                            {rule.active ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disqualifying Offenses</CardTitle>
              <CardDescription>Manage list of automatic disqualifying offenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {disqualifyingOffenses.map((offense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{offense}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveOffense(offense)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowAddOffenseDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Offense
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adverse-action" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adverse Action Workflow</CardTitle>
              <CardDescription>Manage FCRA-compliant adverse action process</CardDescription>
            </CardHeader>
            <CardContent>
              {mockAdverseActions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>AA ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Screening ID</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Date Sent</TableHead>
                      <TableHead>Waiting Period Ends</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAdverseActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell className="font-medium">{action.id}</TableCell>
                        <TableCell>{action.employee}</TableCell>
                        <TableCell>{action.screeningId}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            Pre-Adverse Sent
                          </Badge>
                        </TableCell>
                        <TableCell>{action.dateSent}</TableCell>
                        <TableCell>{action.waitingPeriodEnds}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{action.reason}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={handleSendFinalNotice}>
                            Send Final Notice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCheck className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p>No active adverse actions</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FCRA Adverse Action Process</CardTitle>
              <CardDescription>Automated workflow for compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Pre-Adverse Action Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sent when adjudication score exceeds threshold. Includes copy of background report
                      and FCRA summary of rights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Waiting Period (5 Days)</h4>
                    <p className="text-sm text-muted-foreground">
                      Candidate has 5 business days to dispute findings. System tracks waiting period and sends
                      reminders.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-between rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Final Adverse Action Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Sent after waiting period if decision stands. Includes final decision, contact info for screening
                      company, and FCRA rights.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="continuous" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Continuous Monitoring</CardTitle>
              <CardDescription>Ongoing background checks for existing employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Criminal Record Monitoring</h4>
                      <p className="text-sm text-muted-foreground">Real-time alerts for new criminal records</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">MVR Quarterly Updates</h4>
                      <p className="text-sm text-muted-foreground">Automatic MVR checks every 90 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">License Expiration Tracking</h4>
                      <p className="text-sm text-muted-foreground">Alerts 30 days before license expiration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">Inactive</Badge>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring Alerts (Last 30 Days)</CardTitle>
              <CardDescription>Recent findings from continuous monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <p>No new findings in the last 30 days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fcra" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FCRA Compliance Checklist</CardTitle>
              <CardDescription>Ensure Fair Credit Reporting Act compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">Disclosure forms signed by all candidates</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">Authorization forms on file</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">Pre-adverse action notices sent within 24h</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm">Adverse action notices sent within 5 days</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">92%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm">Summary of rights provided with all reports</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">100%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>FCRA-compliant forms and notices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Disclosure and Authorization Form</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Pre-Adverse Action Notice Template</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Final Adverse Action Notice Template</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Summary of FCRA Rights</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TazWorks Integration</CardTitle>
              <CardDescription>Configure API connection and webhook settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-medium">API Connection Active</h4>
                    <p className="text-sm text-muted-foreground">Last sync: 2 minutes ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Test Connection
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" value="••••••••••••••••" readOnly />
                </div>
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" value="https://pcs.example.com/api/webhooks/tazworks" readOnly />
                </div>
                <div>
                  <Label htmlFor="account-id">Account ID</Label>
                  <Input id="account-id" value="TW-12345" readOnly />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Webhook Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Order Status Updates</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Report Completion</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Continuous Monitoring Alerts</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Screening Package Configuration</CardTitle>
              <CardDescription>Define default screening packages for different roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">CDL Driver Package</h4>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Criminal (County)</Badge>
                    <Badge variant="secondary">Criminal (State)</Badge>
                    <Badge variant="secondary">Criminal (Federal)</Badge>
                    <Badge variant="secondary">MVR</Badge>
                    <Badge variant="secondary">Employment Verification</Badge>
                    <Badge variant="secondary">DOT Physical</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Office Staff Package</h4>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Criminal (County)</Badge>
                    <Badge variant="secondary">Criminal (State)</Badge>
                    <Badge variant="secondary">Employment Verification</Badge>
                    <Badge variant="secondary">Education Verification</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Background Screening</DialogTitle>
            <DialogDescription>Submit a new background check order to TazWorks</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee-select">Select Employee *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger id="employee-select">
                  <SelectValue placeholder="Choose employee..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith (EMP-001)</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson (EMP-002)</SelectItem>
                  <SelectItem value="Mike Davis">Mike Davis (EMP-003)</SelectItem>
                  <SelectItem value="Emily Brown">Emily Brown (EMP-004)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="screening-type">Screening Type *</Label>
              <Select value={screeningType} onValueChange={setScreeningType}>
                <SelectTrigger id="screening-type">
                  <SelectValue placeholder="Choose type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-Employment">Pre-Employment</SelectItem>
                  <SelectItem value="7-Year Update">7-Year Update</SelectItem>
                  <SelectItem value="Annual Review">Annual Review</SelectItem>
                  <SelectItem value="Post-Incident">Post-Incident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="package">Screening Package *</Label>
              <Select value={screeningPackage} onValueChange={setScreeningPackage}>
                <SelectTrigger id="package">
                  <SelectValue placeholder="Choose package..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdl">CDL Driver Package</SelectItem>
                  <SelectItem value="office">Office Staff Package</SelectItem>
                  <SelectItem value="custom">Custom Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions..."
                value={screeningNotes}
                onChange={(e) => setScreeningNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleOrderScreening}>Submit Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddOffenseDialog} onOpenChange={setShowAddOffenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Disqualifying Offense</DialogTitle>
            <DialogDescription>Add a new offense to the automatic disqualification list</DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="offense">Offense Description</Label>
            <Input
              id="offense"
              placeholder="e.g., Embezzlement"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddOffense(e.currentTarget.value)
                  e.currentTarget.value = ""
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOffenseDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                const input = document.getElementById("offense") as HTMLInputElement
                handleAddOffense(input.value)
                input.value = ""
              }}
            >
              Add Offense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Download,
  Search,
  Filter,
  Upload,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2,
  MapPin,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportDialog } from "@/components/export-dialog"

const mockEmployees = [
  {
    id: "EMP-001",
    name: "John Smith",
    role: "CDL Driver",
    department: "Transportation",
    rigLocation: "Rig 47",
    yard: "North Yard",
    city: "Houston",
    state: "TX",
    status: "active",
    compliance: "compliant",
    drugTesting: "compliant",
    background: "compliant",
    training: "at-risk",
    health: "compliant",
  },
  {
    id: "EMP-002",
    name: "Sarah Johnson",
    role: "Warehouse Manager",
    department: "Operations",
    rigLocation: "N/A",
    yard: "Central Warehouse",
    city: "Dallas",
    state: "TX",
    status: "active",
    compliance: "compliant",
    drugTesting: "compliant",
    background: "compliant",
    training: "compliant",
    health: "compliant",
  },
  {
    id: "EMP-003",
    name: "Mike Davis",
    role: "Field Technician",
    department: "Field Services",
    rigLocation: "Rig 23",
    yard: "East Yard",
    city: "Austin",
    state: "TX",
    status: "active",
    compliance: "at-risk",
    drugTesting: "at-risk",
    background: "compliant",
    training: "compliant",
    health: "non-compliant",
  },
  {
    id: "EMP-004",
    name: "Emily Brown",
    role: "Safety Coordinator",
    department: "Safety",
    rigLocation: "N/A",
    yard: "Main Office",
    city: "San Antonio",
    state: "TX",
    status: "active",
    compliance: "compliant",
    drugTesting: "compliant",
    background: "compliant",
    training: "compliant",
    health: "compliant",
  },
]

export default function EmployeesPage() {
  const router = useRouter()
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)

  const complianceStats = {
    compliant: mockEmployees.filter((e) => e.compliance === "compliant").length,
    atRisk: mockEmployees.filter((e) => e.compliance === "at-risk").length,
    nonCompliant: mockEmployees.filter((e) => e.compliance === "non-compliant").length,
    total: mockEmployees.length,
  }

  const compliantPercentage = (complianceStats.compliant / complianceStats.total) * 100
  const atRiskPercentage = (complianceStats.atRisk / complianceStats.total) * 100
  const nonCompliantPercentage = (complianceStats.nonCompliant / complianceStats.total) * 100

  const uniqueLocations = Array.from(new Set(mockEmployees.map((e) => `${e.city}, ${e.state}`)))
  const uniqueYards = Array.from(new Set(mockEmployees.map((e) => e.yard)))
  const uniqueRigs = Array.from(new Set(mockEmployees.map((e) => e.rigLocation).filter((r) => r !== "N/A")))

  const filteredEmployees =
    locationFilter === "all"
      ? mockEmployees
      : mockEmployees.filter(
          (e) =>
            `${e.city}, ${e.state}` === locationFilter || e.yard === locationFilter || e.rigLocation === locationFilter,
        )

  const handleEmployeeClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    setShowEmployeeModal(true)
  }

  const handleComplianceClick = (module: string) => {
    const routes: Record<string, string> = {
      dot: "/compliance/dot",
      drugTesting: "/compliance/drug-testing",
      background: "/compliance/background",
      training: "/compliance/training",
      health: "/compliance/health",
    }
    router.push(routes[module])
  }

  const selectedEmployee = mockEmployees.find((e) => e.id === selectedEmployeeId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Roster</h1>
          <p className="text-muted-foreground">Single source of truth for all employee data</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
            <DialogTrigger asChild>
              <Button variant={showBulkUpload ? "default" : "outline"}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Employees</DialogTitle>
                <DialogDescription>Upload CSV or Excel file with employee data</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Supported formats:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>CSV (.csv)</li>
                    <li>Excel (.xlsx, .xls)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Required fields:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Employee ID, Name, Role, Department, Location</li>
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowBulkUpload(false)}>
                    Cancel
                  </Button>
                  <Button>Upload & Process</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant={showExportDialog ? "default" : "outline"} onClick={() => setShowExportDialog(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Enter employee information manually</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Employee ID</label>
                    <Input placeholder="EMP-XXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Input placeholder="CDL Driver" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Input placeholder="Transportation" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="Houston, TX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddEmployee(false)}>
                    Cancel
                  </Button>
                  <Button>Create Employee</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Breakdown</CardTitle>
          <CardDescription>Interactive view of employee compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative h-48 w-48 shrink-0">
              <svg className="h-full w-full -rotate-90 transform">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#16a34a"
                  strokeWidth="32"
                  fill="none"
                  strokeDasharray={`${(compliantPercentage / 100) * 502} 502`}
                  strokeLinecap="round"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#ca8a04"
                  strokeWidth="32"
                  fill="none"
                  strokeDasharray={`${(atRiskPercentage / 100) * 502} 502`}
                  strokeDashoffset={-((compliantPercentage / 100) * 502)}
                  strokeLinecap="round"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#dc2626"
                  strokeWidth="32"
                  fill="none"
                  strokeDasharray={`${(nonCompliantPercentage / 100) * 502} 502`}
                  strokeDashoffset={-(((compliantPercentage + atRiskPercentage) / 100) * 502)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{complianceStats.total}</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-600" />
                  <div>
                    <p className="font-medium">Compliant</p>
                    <p className="text-sm text-muted-foreground">All requirements met</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{complianceStats.compliant}</p>
                  <p className="text-xs text-muted-foreground">{compliantPercentage.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-600" />
                  <div>
                    <p className="font-medium">At Risk</p>
                    <p className="text-sm text-muted-foreground">Expiring soon</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{complianceStats.atRisk}</p>
                  <p className="text-xs text-muted-foreground">{atRiskPercentage.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-600" />
                  <div>
                    <p className="font-medium">Non-Compliant</p>
                    <p className="text-sm text-muted-foreground">Action required</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{complianceStats.nonCompliant}</p>
                  <p className="text-xs text-muted-foreground">{nonCompliantPercentage.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">156</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">+8 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">152</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">97% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliant</CardDescription>
            <CardTitle className="text-3xl">143</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">92% compliance rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>At Risk</CardDescription>
            <CardTitle className="text-3xl">9</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, ID, location, or status..." className="pl-9" />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[250px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Cities</div>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Yards</div>
                {uniqueYards.map((yard) => (
                  <SelectItem key={yard} value={yard}>
                    {yard}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Rigs</div>
                {uniqueRigs.map((rig) => (
                  <SelectItem key={rig} value={rig}>
                    {rig}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>View and manage employee information with compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Rig Location</TableHead>
                <TableHead>Yard</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleEmployeeClick(employee.id)}
                      className="text-primary hover:underline font-medium text-left"
                    >
                      {employee.name}
                    </button>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{employee.rigLocation}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{employee.yard}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEmployeeClick(employee.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEmployee.name}</DialogTitle>
                <DialogDescription>
                  {selectedEmployee.role} • {selectedEmployee.department}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Employee ID</p>
                      <p className="font-medium">{selectedEmployee.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        {selectedEmployee.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {selectedEmployee.city}, {selectedEmployee.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rig Location</p>
                      <p className="font-medium">{selectedEmployee.rigLocation}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Yard</p>
                      <p className="font-medium">{selectedEmployee.yard}</p>
                    </div>
                  </div>
                </div>

                {/* Compliance Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Compliance Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div
                      className={`p-3 border rounded-lg ${
                        selectedEmployee.compliance !== "compliant"
                          ? "cursor-pointer hover:bg-accent/50 transition-colors"
                          : ""
                      }`}
                      onClick={() => selectedEmployee.compliance !== "compliant" && handleComplianceClick("dot")}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1">DOT Regulations</p>
                        {selectedEmployee.compliance !== "compliant" && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          selectedEmployee.compliance === "compliant"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : selectedEmployee.compliance === "at-risk"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {selectedEmployee.compliance}
                      </Badge>
                    </div>
                    <div
                      className={`p-3 border rounded-lg ${
                        selectedEmployee.drugTesting !== "compliant"
                          ? "cursor-pointer hover:bg-accent/50 transition-colors"
                          : ""
                      }`}
                      onClick={() =>
                        selectedEmployee.drugTesting !== "compliant" && handleComplianceClick("drugTesting")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1">Drug Testing</p>
                        {selectedEmployee.drugTesting !== "compliant" && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          selectedEmployee.drugTesting === "compliant"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : selectedEmployee.drugTesting === "at-risk"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {selectedEmployee.drugTesting}
                      </Badge>
                    </div>
                    <div
                      className={`p-3 border rounded-lg ${
                        selectedEmployee.background !== "compliant"
                          ? "cursor-pointer hover:bg-accent/50 transition-colors"
                          : ""
                      }`}
                      onClick={() => selectedEmployee.background !== "compliant" && handleComplianceClick("background")}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1">Background Check</p>
                        {selectedEmployee.background !== "compliant" && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          selectedEmployee.background === "compliant"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : selectedEmployee.background === "at-risk"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {selectedEmployee.background}
                      </Badge>
                    </div>
                    <div
                      className={`p-3 border rounded-lg ${
                        selectedEmployee.training !== "compliant"
                          ? "cursor-pointer hover:bg-accent/50 transition-colors"
                          : ""
                      }`}
                      onClick={() => selectedEmployee.training !== "compliant" && handleComplianceClick("training")}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1">Training & Certs</p>
                        {selectedEmployee.training !== "compliant" && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          selectedEmployee.training === "compliant"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : selectedEmployee.training === "at-risk"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {selectedEmployee.training}
                      </Badge>
                    </div>
                    <div
                      className={`p-3 border rounded-lg ${
                        selectedEmployee.health !== "compliant"
                          ? "cursor-pointer hover:bg-accent/50 transition-colors"
                          : ""
                      }`}
                      onClick={() => selectedEmployee.health !== "compliant" && handleComplianceClick("health")}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1">Health & Medical</p>
                        {selectedEmployee.health !== "compliant" && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          selectedEmployee.health === "compliant"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : selectedEmployee.health === "at-risk"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {selectedEmployee.health}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Policy-Specific Compliance */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Policy-Specific Compliance</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">NASAP Policy</h4>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          Compliant
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Drug Testing: Current</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Background: Clear</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Training: Up to date</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleComplianceClick("dot")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">FMCSA Regulations</h4>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        >
                          At Risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Medical Card: Valid</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-600" />
                          <span>HOS Training: Expiring</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>CDL: Current</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Chevron Policy (PA36)</h4>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          Compliant
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Safety Training: Current</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Site Access: Approved</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span>Background: Clear</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={() => {
                      setShowEmployeeModal(false)
                      router.push(`/employees/${selectedEmployee.id}`)
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        title="Export Employee Roster"
        description="Choose your preferred export format for employee data"
        recordCount={filteredEmployees.length}
      />
    </div>
  )
}

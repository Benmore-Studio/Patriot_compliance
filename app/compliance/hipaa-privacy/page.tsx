"use client"

import { useState, useMemo } from "react"
import {
  Shield,
  Lock,
  FileText,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  Key,
  Database,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock data for access controls
const mockAccessControls = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "HR Manager",
    accessLevel: "Admin",
    department: "Human Resources",
    lastAccess: "2025-01-22 14:30",
    grantedBy: "System Admin",
    reviewDate: "2025-06-15",
    overdue: false,
  },
  {
    id: 2,
    name: "Mike Davis",
    role: "Safety Director",
    accessLevel: "Read/Write",
    department: "Safety & Compliance",
    lastAccess: "2025-01-22 11:15",
    grantedBy: "Sarah Johnson",
    reviewDate: "2025-06-15",
    overdue: false,
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Occupational Health Nurse",
    accessLevel: "Read/Write",
    department: "Occupational Health",
    lastAccess: "2025-01-22 09:45",
    grantedBy: "Sarah Johnson",
    reviewDate: "2025-06-15",
    overdue: false,
  },
  {
    id: 4,
    name: "John Smith",
    role: "Compliance Officer",
    accessLevel: "Read Only",
    department: "Compliance",
    lastAccess: "2025-01-21 16:20",
    grantedBy: "Sarah Johnson",
    reviewDate: "2024-12-31",
    overdue: true,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Benefits Administrator",
    accessLevel: "Read Only",
    department: "Human Resources",
    lastAccess: "2025-01-20 13:10",
    grantedBy: "Sarah Johnson",
    reviewDate: "2025-06-15",
    overdue: false,
  },
]

// Mock data for audit logs (20+ entries)
const mockAuditLogs = [
  {
    id: 1,
    timestamp: "2025-01-22 14:30:15",
    user: "Sarah Johnson",
    role: "HR Manager",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "192.168.1.100",
    status: "Success",
    details: "Viewed employee medical file for EMP-001",
  },
  {
    id: 2,
    timestamp: "2025-01-22 14:25:42",
    user: "Mike Davis",
    role: "Safety Director",
    action: "Modified",
    dataType: "Drug Test",
    ipAddress: "192.168.1.105",
    status: "Success",
    details: "Updated drug test result for EMP-023",
  },
  {
    id: 3,
    timestamp: "2025-01-22 14:20:33",
    user: "Emily Chen",
    role: "Occupational Health Nurse",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "192.168.1.110",
    status: "Success",
    details: "Accessed physical exam results for EMP-045",
  },
  {
    id: 4,
    timestamp: "2025-01-22 14:15:18",
    user: "John Smith",
    role: "Compliance Officer",
    action: "Exported",
    dataType: "Background Check",
    ipAddress: "192.168.1.115",
    status: "Success",
    details: "Exported background check report for audit",
  },
  {
    id: 5,
    timestamp: "2025-01-22 14:10:55",
    user: "Lisa Anderson",
    role: "Benefits Administrator",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "192.168.1.120",
    status: "Success",
    details: "Reviewed health insurance enrollment",
  },
  {
    id: 6,
    timestamp: "2025-01-22 13:55:22",
    user: "Unknown User",
    role: "N/A",
    action: "Viewed",
    dataType: "Drug Test",
    ipAddress: "203.45.67.89",
    status: "Failed",
    details: "Unauthorized access attempt blocked",
  },
  {
    id: 7,
    timestamp: "2025-01-22 13:45:10",
    user: "Sarah Johnson",
    role: "HR Manager",
    action: "Modified",
    dataType: "Employee Record",
    ipAddress: "192.168.1.100",
    status: "Success",
    details: "Updated work accommodations for EMP-012",
  },
  {
    id: 8,
    timestamp: "2025-01-22 13:30:45",
    user: "Mike Davis",
    role: "Safety Director",
    action: "Viewed",
    dataType: "OSHA Incident",
    ipAddress: "192.168.1.105",
    status: "Success",
    details: "Reviewed OSHA 300 log entry",
  },
  {
    id: 9,
    timestamp: "2025-01-22 13:15:33",
    user: "Emily Chen",
    role: "Occupational Health Nurse",
    action: "Modified",
    dataType: "Employee Record",
    ipAddress: "192.168.1.110",
    status: "Success",
    details: "Added physical exam results for EMP-067",
  },
  {
    id: 10,
    timestamp: "2025-01-22 13:00:18",
    user: "John Smith",
    role: "Compliance Officer",
    action: "Viewed",
    dataType: "Training Record",
    ipAddress: "192.168.1.115",
    status: "Success",
    details: "Checked HIPAA training completion status",
  },
  {
    id: 11,
    timestamp: "2025-01-22 12:45:55",
    user: "Sarah Johnson",
    role: "HR Manager",
    action: "Deleted",
    dataType: "Employee Record",
    ipAddress: "192.168.1.100",
    status: "Flagged",
    details: "Deleted outdated medical record (retention policy)",
  },
  {
    id: 12,
    timestamp: "2025-01-22 12:30:22",
    user: "Mike Davis",
    role: "Safety Director",
    action: "Exported",
    dataType: "Drug Test",
    ipAddress: "192.168.1.105",
    status: "Success",
    details: "Exported quarterly drug testing report",
  },
  {
    id: 13,
    timestamp: "2025-01-22 12:15:10",
    user: "Emily Chen",
    role: "Occupational Health Nurse",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "192.168.1.110",
    status: "Success",
    details: "Reviewed vaccination records for EMP-089",
  },
  {
    id: 14,
    timestamp: "2025-01-22 12:00:45",
    user: "Lisa Anderson",
    role: "Benefits Administrator",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "192.168.1.120",
    status: "Success",
    details: "Accessed benefits enrollment information",
  },
  {
    id: 15,
    timestamp: "2025-01-22 11:45:33",
    user: "John Smith",
    role: "Compliance Officer",
    action: "Viewed",
    dataType: "Background Check",
    ipAddress: "192.168.1.115",
    status: "Success",
    details: "Reviewed background screening results",
  },
  {
    id: 16,
    timestamp: "2025-01-22 11:30:18",
    user: "Sarah Johnson",
    role: "HR Manager",
    action: "Modified",
    dataType: "Employee Record",
    ipAddress: "192.168.1.100",
    status: "Success",
    details: "Updated emergency contact information",
  },
  {
    id: 17,
    timestamp: "2025-01-22 11:15:55",
    user: "Mike Davis",
    role: "Safety Director",
    action: "Viewed",
    dataType: "Drug Test",
    ipAddress: "192.168.1.105",
    status: "Success",
    details: "Checked random selection pool results",
  },
  {
    id: 18,
    timestamp: "2025-01-22 11:00:22",
    user: "Emily Chen",
    role: "Occupational Health Nurse",
    action: "Modified",
    dataType: "Employee Record",
    ipAddress: "192.168.1.110",
    status: "Success",
    details: "Logged hearing conservation test results",
  },
  {
    id: 19,
    timestamp: "2025-01-22 10:45:10",
    user: "Unknown User",
    role: "N/A",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "198.51.100.42",
    status: "Failed",
    details: "Unauthorized access attempt from external IP",
  },
  {
    id: 20,
    timestamp: "2025-01-22 10:30:45",
    user: "Lisa Anderson",
    role: "Benefits Administrator",
    action: "Exported",
    dataType: "Employee Record",
    ipAddress: "192.168.1.120",
    status: "Success",
    details: "Exported employee health insurance roster",
  },
  {
    id: 21,
    timestamp: "2025-01-22 10:15:33",
    user: "John Smith",
    role: "Compliance Officer",
    action: "Viewed",
    dataType: "Training Record",
    ipAddress: "192.168.1.115",
    status: "Success",
    details: "Audited HIPAA training records",
  },
  {
    id: 22,
    timestamp: "2025-01-22 10:00:18",
    user: "Sarah Johnson",
    role: "HR Manager",
    action: "Viewed",
    dataType: "Employee Record",
    ipAddress: "192.168.1.100",
    status: "Success",
    details: "Reviewed pre-employment physical results",
  },
]

// Mock training data
const mockTrainingData = [
  { name: "Sarah Johnson", status: "Completed", completionDate: "2025-01-15", certificate: "CERT-2025-001" },
  { name: "Mike Davis", status: "Completed", completionDate: "2025-01-12", certificate: "CERT-2025-002" },
  { name: "Emily Chen", status: "Completed", completionDate: "2025-01-10", certificate: "CERT-2025-003" },
  { name: "John Smith", status: "Pending", completionDate: null, certificate: null },
  { name: "Lisa Anderson", status: "Completed", completionDate: "2025-01-08", certificate: "CERT-2025-004" },
]

export default function HIPAAPrivacyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [accessLevelFilter, setAccessLevelFilter] = useState("all")
  const [logSearchQuery, setLogSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dataTypeFilter, setDataTypeFilter] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [trainingFilter, setTrainingFilter] = useState("all")
  const { toast } = useToast()

  const filteredAccessControls = useMemo(() => {
    return mockAccessControls.filter((control) => {
      const matchesSearch =
        control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        control.department.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || control.role === roleFilter
      const matchesAccessLevel = accessLevelFilter === "all" || control.accessLevel === accessLevelFilter

      return matchesSearch && matchesRole && matchesAccessLevel
    })
  }, [searchQuery, roleFilter, accessLevelFilter])

  const filteredAuditLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.ipAddress.includes(logSearchQuery)

      const matchesAction = actionFilter === "all" || log.action === actionFilter
      const matchesDataType = dataTypeFilter === "all" || log.dataType === dataTypeFilter

      return matchesSearch && matchesAction && matchesDataType
    })
  }, [logSearchQuery, actionFilter, dataTypeFilter])

  const filteredTraining = useMemo(() => {
    return mockTrainingData.filter((training) => {
      if (trainingFilter === "all") return true
      return training.status === trainingFilter
    })
  }, [trainingFilter])

  const handleExportLogs = () => {
    toast({
      title: "Exporting Audit Logs",
      description: "Generating compliance report with all audit log entries...",
    })
  }

  const handleRevokeAccess = (name: string) => {
    toast({
      title: "Access Revoked",
      description: `PHI access has been revoked for ${name}`,
      variant: "destructive",
    })
  }

  const handleViewLogs = (name: string) => {
    toast({
      title: "Viewing Access Logs",
      description: `Loading all PHI access logs for ${name}...`,
    })
  }

  const trainingCompletionRate = Math.round(
    (mockTrainingData.filter((t) => t.status === "Completed").length / mockTrainingData.length) * 100,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HIPAA Privacy & Data Security</h1>
          <p className="text-muted-foreground">Manage protected health information access and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Audit Logs
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            Generate Compliance Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall HIPAA Compliance</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">98%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-xs text-muted-foreground">Last audit: Jan 15, 2025</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>PHI Access Controls</CardDescription>
            <CardTitle className="text-3xl">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">5 active policies</p>
            <p className="text-xs text-muted-foreground">Last review: Jan 10, 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Data Breach Count</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-xs text-muted-foreground">Incident-free since: Jan 1, 2020</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Security Assessments</CardDescription>
            <CardTitle className="text-3xl">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Current</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last: Jan 15, 2025</p>
            <p className="text-xs text-muted-foreground">Next: Jul 15, 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Access Controls Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>PHI Access Controls</CardTitle>
              <CardDescription>Manage user access to protected health information</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Grant Access
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Safety Director">Safety Director</SelectItem>
                <SelectItem value="Occupational Health Nurse">Occupational Health Nurse</SelectItem>
                <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={accessLevelFilter} onValueChange={setAccessLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access Levels</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Read/Write">Read/Write</SelectItem>
                <SelectItem value="Read Only">Read Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User/Role</TableHead>
                <TableHead>PHI Access Level</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead>Granted By</TableHead>
                <TableHead>Review Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccessControls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{control.name}</div>
                      <div className="text-xs text-muted-foreground">{control.role}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        control.accessLevel === "Admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          : control.accessLevel === "Read/Write"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      }
                    >
                      {control.accessLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{control.department}</TableCell>
                  <TableCell>{control.lastAccess}</TableCell>
                  <TableCell>{control.grantedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{control.reviewDate}</span>
                      {control.overdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewLogs(control.name)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRevokeAccess(control.name)}>
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Logs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Real-time PHI access activity monitoring</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                <Label htmlFor="auto-refresh" className="text-sm">
                  Auto-refresh
                </Label>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or IP address..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Viewed">Viewed</SelectItem>
                <SelectItem value="Modified">Modified</SelectItem>
                <SelectItem value="Exported">Exported</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Data Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data Types</SelectItem>
                <SelectItem value="Employee Record">Employee Record</SelectItem>
                <SelectItem value="Drug Test">Drug Test</SelectItem>
                <SelectItem value="Background Check">Background Check</SelectItem>
                <SelectItem value="Training Record">Training Record</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <Badge variant="secondary" className="text-xs">
                          {log.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.dataType}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "Success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : log.status === "Failed"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Data Encryption Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Data at Rest</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Encryption:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">AES-256</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Key Rotation:</span>
              <span className="text-sm font-medium">Auto (90 days)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Rotated:</span>
              <span className="text-sm font-medium">Jan 1, 2025</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Data in Transit</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Protocol:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">TLS 1.3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Certificate:</span>
              <span className="text-sm font-medium">Valid</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expires:</span>
              <span className="text-sm font-medium">Dec 31, 2025</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Backup Encryption</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Location:</span>
              <span className="text-sm font-medium">Encrypted Cloud</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Frequency:</span>
              <span className="text-sm font-medium">Daily</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Backup:</span>
              <span className="text-sm font-medium">Jan 22, 2025 02:00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Compliance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>HIPAA Training Compliance</CardTitle>
              <CardDescription>Annual privacy and security training for authorized personnel</CardDescription>
            </div>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Training
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-900 dark:text-green-100">Training Completion Status</h4>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {trainingCompletionRate}% Complete
              </Badge>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              {mockTrainingData.filter((t) => t.status === "Completed").length} of {mockTrainingData.length} authorized
              users have completed annual HIPAA training. Next training due: January 2026
            </p>
            <Progress value={trainingCompletionRate} className="h-2" />
          </div>

          <div className="flex gap-4 mb-4">
            <Select value={trainingFilter} onValueChange={setTrainingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTraining.map((training, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{training.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        training.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : training.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {training.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{training.completionDate || "—"}</TableCell>
                  <TableCell>
                    {training.certificate ? (
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        {training.certificate}
                      </Button>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {training.status === "Pending" && (
                      <Button variant="outline" size="sm">
                        Send Reminder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>HIPAA Compliance Checklist</CardTitle>
          <CardDescription>Verify all required privacy and security controls are in place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "PHI access controls configured",
              "Encryption enabled (at rest & transit)",
              "Audit logging active",
              "Annual security assessment completed",
              "Staff training up to date",
              "Incident response plan documented",
              "Business associate agreements signed",
              "Data retention policy implemented",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert System */}
      <Card>
        <CardHeader>
          <CardTitle>Alert & Notification Settings</CardTitle>
          <CardDescription>Configure automated compliance alerts and escalation rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Unauthorized Access Attempts</h4>
                <p className="text-sm text-muted-foreground">Notify security team immediately</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Access Review Overdue</h4>
                <p className="text-sm text-muted-foreground">Alert HR manager 30 days before review date</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Training Expiration</h4>
                <p className="text-sm text-muted-foreground">Remind employees 60 days before expiration</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Encryption Key Rotation</h4>
                <p className="text-sm text-muted-foreground">Notify IT team 7 days before rotation</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

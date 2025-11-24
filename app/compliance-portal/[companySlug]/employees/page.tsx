import { notFound } from "next/navigation"
import { mockCompanies } from "@/lib/data/mock-companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Users, CheckCircle2, AlertCircle, Clock } from "lucide-react"

export default async function CompanyEmployeesPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params
  const company = mockCompanies.find((c) => c.id === companySlug)

  if (!company) {
    notFound()
  }

  // Mock employee roster data filtered by company
  const employees = [
    {
      id: "EMP-001",
      name: "John Smith",
      position: "CDL Driver",
      department: "Transportation",
      location: "Houston, TX",
      hireDate: "2020-03-15",
      status: "compliant" as const,
    },
    {
      id: "EMP-002",
      name: "Sarah Johnson",
      position: "Safety Coordinator",
      department: "Safety",
      location: "Houston, TX",
      hireDate: "2021-06-20",
      status: "compliant" as const,
    },
    {
      id: "EMP-003",
      name: "Mike Davis",
      position: "CDL Driver",
      department: "Transportation",
      location: "Dallas, TX",
      hireDate: "2019-01-10",
      status: "at-risk" as const,
    },
  ]

  const stats = {
    totalEmployees: 45,
    compliant: 38,
    atRisk: 5,
    nonCompliant: 2,
    complianceRate: 84,
  }

  const getStatusBadge = (status: "compliant" | "at-risk" | "non-compliant") => {
    switch (status) {
      case "compliant":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
        )
      case "at-risk":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            At Risk
          </Badge>
        )
      case "non-compliant":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Non-Compliant
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
            <Users className="h-6 w-6" />
            Employee Roster
          </h1>
          <p className="text-muted-foreground">Employee compliance overview for {company.name}</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">{stats.totalEmployees}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active roster</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliant</CardDescription>
            <CardTitle className="text-3xl">{stats.compliant}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Up to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>At Risk</CardDescription>
            <CardTitle className="text-3xl">{stats.atRisk}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Non-Compliant</CardDescription>
            <CardTitle className="text-3xl">{stats.nonCompliant}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Action required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compliance Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.complianceRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">Good standing</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Roster Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Roster</CardTitle>
          <CardDescription>
            Showing {employees.length} employees for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.position}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{employee.department}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{employee.location}</TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

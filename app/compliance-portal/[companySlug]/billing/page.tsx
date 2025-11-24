import { notFound } from "next/navigation"
import { mockCompanies } from "@/lib/data/mock-companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, DollarSign, CheckCircle2, AlertCircle, Clock } from "lucide-react"

export default async function CompanyBillingPage({ params }: { params: Promise<{ companySlug: string }> }) {
  const { companySlug } = await params
  const company = mockCompanies.find((c) => c.id === companySlug)

  if (!company) {
    notFound()
  }

  // Mock billing data filtered by company
  const invoices = [
    {
      id: "INV-2025-001",
      date: "2025-01-01",
      dueDate: "2025-01-31",
      amount: 2450.0,
      status: "paid" as const,
      services: "Drug Testing, Background Checks",
    },
    {
      id: "INV-2024-012",
      date: "2024-12-01",
      dueDate: "2024-12-31",
      amount: 3200.0,
      status: "paid" as const,
      services: "Drug Testing, Training, DOT Compliance",
    },
    {
      id: "INV-2024-011",
      date: "2024-11-01",
      dueDate: "2024-11-30",
      amount: 1850.0,
      status: "overdue" as const,
      services: "Background Checks, Health Screening",
    },
  ]

  const stats = {
    currentBalance: 1850.0,
    ytdTotal: 28500.0,
    avgMonthly: 2375.0,
    paidInvoices: 11,
    overdueInvoices: 1,
  }

  const getStatusBadge = (status: "paid" | "pending" | "overdue") => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Overdue
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
            <DollarSign className="h-6 w-6" />
            Billing
          </h1>
          <p className="text-muted-foreground">Billing overview for {company.name}</p>
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
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-3xl">${stats.currentBalance.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>YTD Total</CardDescription>
            <CardTitle className="text-3xl">${stats.ytdTotal.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Monthly</CardDescription>
            <CardTitle className="text-3xl">${stats.avgMonthly.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">12-month avg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Invoices</CardDescription>
            <CardTitle className="text-3xl">{stats.paidInvoices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600 dark:text-green-400">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl">{stats.overdueInvoices}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600 dark:text-red-400">Requires payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Showing {invoices.length} recent invoices for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{invoice.services}</TableCell>
                  <TableCell className="font-medium">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockCompanies } from "@/lib/data/mock-companies"
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Search,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  TestTube,
  GraduationCap,
  UserCheck,
  Truck,
  BarChart3,
  UsersIcon,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { GeoFenceMapNoAPI } from "@/components/geo-fence-map-no-api"

const navigationCards = [
  {
    id: "portfolio",
    title: "Portfolio View",
    description: "Overview of all service companies",
    href: "/compliance-portal/portfolio",
    icon: Building2,
  },
  {
    id: "alerts",
    title: "Alerts & Actions",
    description: "Critical alerts and action items",
    href: "/compliance-portal/alerts",
    icon: AlertTriangle,
  },
  {
    id: "billing",
    title: "Billing Management",
    description: "Financial overview and invoicing",
    href: "/compliance-portal/billing",
    icon: TrendingUp,
  },
  {
    id: "oh-oversight",
    title: "OH Monitoring",
    description: "Occupational health oversight",
    href: "/compliance-portal/oh-oversight",
    icon: Users,
  },
  {
    id: "training",
    title: "Training Oversight",
    description: "Training programs across companies",
    href: "/compliance-portal/training",
    icon: Users,
  },
  {
    id: "roster",
    title: "Combined Roster",
    description: "All employees across portfolio",
    href: "/compliance-portal/roster",
    icon: Users,
  },
  {
    id: "geo-fence",
    title: "Geo Monitoring",
    description: "Location-based compliance",
    href: "/compliance-portal/geo-fence",
    icon: MapPin,
  },
  {
    id: "policies",
    title: "Policy & AI Tools",
    description: "Policy management and insights",
    href: "/compliance-portal/policies",
    icon: Users,
  },
  {
    id: "mis",
    title: "MIS Reports",
    description: "Analytics and reporting",
    href: "/compliance-portal/mis",
    icon: Users,
  },
  {
    id: "communications",
    title: "Communications Hub",
    description: "Announcements and messaging",
    href: "/compliance-portal/communications",
    icon: Users,
  },
]

export default function CompliancePortalDashboard() {
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("30")
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([])

  const filteredCompanies =
    selectedCompany === "all" ? mockCompanies : mockCompanies.filter((c) => c.id === selectedCompany)

  const searchedCompanies = searchQuery
    ? filteredCompanies.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredCompanies

  const stats = {
    total: mockCompanies.length,
    compliant: mockCompanies.filter((c) => c.status === "compliant").length,
    atRisk: mockCompanies.filter((c) => c.status === "at-risk").length,
    nonCompliant: mockCompanies.filter((c) => c.status === "non-compliant").length,
    criticalAlerts: mockCompanies.reduce((sum, c) => sum + c.activeAlerts, 0),
    pendingReviews: mockCompanies.filter((c) => c.status !== "compliant").length,
  }

  const compliancePercentage = Math.round((stats.compliant / stats.total) * 100)

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId],
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Service Companies Sidebar */}
      <div className="w-[280px] border-r bg-muted/30 overflow-y-auto">
        <div className="p-4 border-b bg-background sticky top-0 z-10">
          <h3 className="font-semibold">Service Companies</h3>
          <p className="text-xs text-muted-foreground">Expand to view modules</p>
          <div className="mt-3 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
        </div>
        <div className="p-2 space-y-1">
          {searchedCompanies.map((company) => {
            const isExpanded = expandedCompanies.includes(company.id)
            return (
              <div key={company.id} className="border rounded-lg bg-background">
                <button
                  onClick={() => toggleCompany(company.id)}
                  className="w-full text-left p-3 hover:bg-accent/50 transition-colors rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <p className="font-medium text-sm truncate">{company.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">{company.industry}</p>
                    </div>
                    <Badge
                      variant={
                        company.status === "compliant"
                          ? "default"
                          : company.status === "at-risk"
                            ? "secondary"
                            : "destructive"
                      }
                      className="shrink-0 text-xs"
                    >
                      {company.complianceScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 ml-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {company.employeeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.city}, {company.state}
                    </span>
                  </div>
                  {company.activeAlerts > 0 && (
                    <div className="mt-2 ml-6 flex items-center gap-1 text-xs text-red-500">
                      <AlertTriangle className="h-3 w-3" />
                      {company.activeAlerts} alert{company.activeAlerts > 1 ? "s" : ""}
                    </div>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-1 border-t">
                    <Link
                      href={`/compliance-portal/${company.id}/drug-testing`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <TestTube className="h-3 w-3" />
                      Drug Testing
                    </Link>
                    <Link
                      href={`/compliance-portal/${company.id}/training`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <GraduationCap className="h-3 w-3" />
                      Certificates & Training
                    </Link>
                    <Link
                      href={`/compliance-portal/${company.id}/background`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <UserCheck className="h-3 w-3" />
                      Background
                    </Link>
                    <Link
                      href={`/compliance-portal/${company.id}/dot`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <Truck className="h-3 w-3" />
                      DOT
                    </Link>
                    <Link
                      href={`/compliance-portal/${company.id}/reports`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <BarChart3 className="h-3 w-3" />
                      MIS Reports
                    </Link>
                    <Link
                      href={`/compliance-portal/${company.id}/employees`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <UsersIcon className="h-3 w-3" />
                      Employee Roster
                    </Link>
                    <Link
                      href={`/compliance-portal/${company.id}/billing`}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-md transition-colors"
                    >
                      <DollarSign className="h-3 w-3" />
                      Billing
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Compliance Company Dashboard</h1>
              <p className="text-muted-foreground">Portfolio oversight and compliance management</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export All Data
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Service Companies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Across 15 states</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Companies in Compliance</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{compliancePercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.compliant} of {stats.total} companies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</div>
                <Badge variant="destructive" className="mt-1">
                  Immediate attention
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <XCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{stats.pendingReviews}</div>
                <p className="text-xs text-muted-foreground">Requires action</p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Geo-Fence Map */}
          <Card>
            <CardHeader>
              <CardTitle>Live Geo-Fence Tracking - All Service Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <GeoFenceMapNoAPI />
            </CardContent>
          </Card>

          {/* Recent Alerts Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockCompanies
                  .filter((c) => c.activeAlerts > 0)
                  .slice(0, 6)
                  .map((company) => (
                    <div key={company.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${
                          company.status === "non-compliant"
                            ? "text-red-500"
                            : company.status === "at-risk"
                              ? "text-yellow-500"
                              : "text-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {company.activeAlerts} active alert{company.activeAlerts > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Last audit: {company.lastAudit}</p>
                      </div>
                      <Badge
                        variant={
                          company.status === "non-compliant"
                            ? "destructive"
                            : company.status === "at-risk"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {company.status === "non-compliant" ? "Critical" : "Warning"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {navigationCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link key={card.id} href={card.href}>
                    <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-sm font-semibold">{card.title}</CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

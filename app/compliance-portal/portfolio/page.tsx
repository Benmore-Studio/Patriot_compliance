"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCompanies } from "@/lib/data/mock-companies"
import {
  Building2,
  Users,
  MapPin,
  ArrowLeft,
  Search,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Filter,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [complianceRange, setComplianceRange] = useState([0, 100])
  const [employeeRange, setEmployeeRange] = useState([0, 2000])
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const totalCompanies = mockCompanies.length
  const avgCompliance = Math.round(mockCompanies.reduce((sum, c) => sum + c.complianceScore, 0) / totalCompanies)
  const totalEmployees = mockCompanies.reduce((sum, c) => sum + c.employeeCount, 0)
  const totalMRR = mockCompanies.reduce((sum, c) => sum + c.monthlyRevenue, 0)

  const filteredCompanies = mockCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompliance =
      company.complianceScore >= complianceRange[0] && company.complianceScore <= complianceRange[1]
    const matchesEmployees = company.employeeCount >= employeeRange[0] && company.employeeCount <= employeeRange[1]
    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    const matchesLocation = locationFilter === "all" || company.state === locationFilter

    return matchesSearch && matchesCompliance && matchesEmployees && matchesStatus && matchesLocation
  })

  const uniqueStates = Array.from(new Set(mockCompanies.map((c) => c.state))).sort()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/compliance-portal">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Portfolio View</h1>
            <p className="text-muted-foreground">Comprehensive overview of all service companies</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Bulk Actions
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Across {uniqueStates.length} states</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{avgCompliance}%</div>
            <p className="text-xs text-muted-foreground">Portfolio average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalMRR / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Compliance Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Compliance Score: {complianceRange[0]}% - {complianceRange[1]}%
              </label>
              <Slider
                value={complianceRange}
                onValueChange={setComplianceRange}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            {/* Employee Count Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Employees: {employeeRange[0]} - {employeeRange[1]}
              </label>
              <Slider
                value={employeeRange}
                onValueChange={setEmployeeRange}
                min={0}
                max={2000}
                step={50}
                className="mt-2"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCompanies.length} of {totalCompanies} companies
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setComplianceRange([0, 100])
                setEmployeeRange([0, 2000])
                setStatusFilter("all")
                setLocationFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <Card
            key={company.id}
            className="transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden"
          >
            {company.pinned && (
              <div className="absolute top-2 right-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{company.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
                <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Circular Compliance Score */}
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(company.complianceScore / 100) * 251.2} 251.2`}
                      className={
                        company.complianceScore >= 90
                          ? "text-green-500"
                          : company.complianceScore >= 70
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{company.complianceScore}%</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge
                  variant={
                    company.status === "compliant"
                      ? "default"
                      : company.status === "at-risk"
                        ? "secondary"
                        : "destructive"
                  }
                  className="capitalize"
                >
                  {company.status === "at-risk" ? "At Risk" : company.status}
                </Badge>
              </div>

              {/* Company Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Employees
                  </span>
                  <span className="font-medium">{company.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Revenue
                  </span>
                  <span className="font-medium">${(company.monthlyRevenue / 1000).toFixed(1)}K/mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Location
                  </span>
                  <span className="font-medium">
                    {company.city}, {company.state}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Last Activity
                  </span>
                  <span className="font-medium">{company.lastActivity}</span>
                </div>
              </div>

              {/* View Details Button */}
              <Button className="w-full bg-transparent" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setComplianceRange([0, 100])
                setEmployeeRange([0, 2000])
                setStatusFilter("all")
                setLocationFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

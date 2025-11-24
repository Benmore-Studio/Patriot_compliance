"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Download,
  Filter,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  MoreVertical,
  Mail,
  FileText,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { mockHOSDrivers } from "@/lib/data/mock-hos-drivers"
import { cn } from "@/lib/utils"

export default function HoursOfServicePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState("off")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Filter states
  const [complianceRange, setComplianceRange] = useState([0, 100])
  const [hoursRange, setHoursRange] = useState([0, 70])
  const [showViolationsOnly, setShowViolationsOnly] = useState(false)
  const [violationType, setViolationType] = useState("all")
  const [violationSeverity, setViolationSeverity] = useState("all")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("last-7-days")
  const [employmentStatus, setEmploymentStatus] = useState<string[]>(["active"])
  const [sortBy, setSortBy] = useState("available-hours-low")
  const [perPage, setPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  const { toast } = useToast()

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh || refreshInterval === "off") return

    const intervals = {
      "30s": 30000,
      "1m": 60000,
      "5m": 300000,
    }

    const interval = setInterval(
      () => {
        setLastRefresh(new Date())
        toast({
          title: "Data Refreshed",
          description: "Hours of Service data has been updated",
        })
      },
      intervals[refreshInterval as keyof typeof intervals],
    )

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, toast])

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (complianceRange[0] !== 0 || complianceRange[1] !== 100) count++
    if (hoursRange[0] !== 0 || hoursRange[1] !== 70) count++
    if (showViolationsOnly) count++
    if (violationType !== "all") count++
    if (violationSeverity !== "all") count++
    if (selectedLocations.length > 0) count++
    if (selectedDepartments.length > 0) count++
    if (dateRange !== "last-7-days") count++
    if (employmentStatus.length !== 1 || !employmentStatus.includes("active")) count++
    return count
  }, [
    complianceRange,
    hoursRange,
    showViolationsOnly,
    violationType,
    violationSeverity,
    selectedLocations,
    selectedDepartments,
    dateRange,
    employmentStatus,
  ])

  // Filter and sort drivers
  const filteredDrivers = useMemo(() => {
    const filtered = mockHOSDrivers.filter((driver) => {
      // Search filter
      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.location.toLowerCase().includes(searchQuery.toLowerCase())

      // Compliance range filter
      const matchesCompliance =
        driver.complianceScore >= complianceRange[0] && driver.complianceScore <= complianceRange[1]

      // Hours range filter
      const matchesHours = driver.availableHours >= hoursRange[0] && driver.availableHours <= hoursRange[1]

      // Violations filter
      const matchesViolations = !showViolationsOnly || driver.violations > 0

      // Violation type filter
      const matchesViolationType = violationType === "all" || driver.violationType === violationType

      // Violation severity filter
      const matchesViolationSeverity = violationSeverity === "all" || driver.violationSeverity === violationSeverity

      // Location filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(driver.location)

      // Department filter
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(driver.department)

      // Employment status filter
      const matchesEmploymentStatus = employmentStatus.includes(driver.employmentStatus)

      return (
        matchesSearch &&
        matchesCompliance &&
        matchesHours &&
        matchesViolations &&
        matchesViolationType &&
        matchesViolationSeverity &&
        matchesLocation &&
        matchesDepartment &&
        matchesEmploymentStatus
      )
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "available-hours-low":
          return a.availableHours - b.availableHours
        case "available-hours-high":
          return b.availableHours - a.availableHours
        case "compliance-low":
          return a.complianceScore - b.complianceScore
        case "compliance-high":
          return b.complianceScore - a.complianceScore
        case "name-az":
          return a.name.localeCompare(b.name)
        case "name-za":
          return b.name.localeCompare(a.name)
        case "violations-most":
          return b.violations - a.violations
        case "violations-least":
          return a.violations - b.violations
        case "hours-worked-most":
          return b.hoursWorked - a.hoursWorked
        case "hours-worked-least":
          return a.hoursWorked - b.hoursWorked
        default:
          return 0
      }
    })

    return filtered
  }, [
    searchQuery,
    complianceRange,
    hoursRange,
    showViolationsOnly,
    violationType,
    violationSeverity,
    selectedLocations,
    selectedDepartments,
    employmentStatus,
    sortBy,
  ])

  // Pagination
  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * perPage
    const end = start + perPage
    return filteredDrivers.slice(start, end)
  }, [filteredDrivers, currentPage, perPage])

  const totalPages = Math.ceil(filteredDrivers.length / perPage)

  // Quick stats
  const stats = useMemo(() => {
    const lowHoursDrivers = filteredDrivers.filter((d) => d.availableHours < 10)
    const avgCompliance = filteredDrivers.reduce((sum, d) => sum + d.complianceScore, 0) / filteredDrivers.length || 0
    const totalViolations = filteredDrivers.reduce((sum, d) => sum + d.violations, 0)

    return {
      totalDrivers: filteredDrivers.length,
      lowHoursCount: lowHoursDrivers.length,
      avgCompliance: Math.round(avgCompliance),
      totalViolations,
    }
  }, [filteredDrivers])

  const clearAllFilters = () => {
    setComplianceRange([0, 100])
    setHoursRange([0, 70])
    setShowViolationsOnly(false)
    setViolationType("all")
    setViolationSeverity("all")
    setSelectedLocations([])
    setSelectedDepartments([])
    setDateRange("last-7-days")
    setEmploymentStatus(["active"])
  }

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: `Exporting ${selectedRows.size > 0 ? selectedRows.size : filteredDrivers.length} driver records...`,
    })
  }

  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedRows(newSelection)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedDrivers.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedDrivers.map((d) => d.id)))
    }
  }

  const getHoursColor = (hours: number) => {
    if (hours < 10) return "text-red-600 dark:text-red-400"
    if (hours < 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-green-600 dark:text-green-400"
  }

  const getComplianceColor = (score: number) => {
    if (score < 85) return "bg-red-500"
    if (score < 95) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hours of Service</h1>
          <p className="text-muted-foreground">Monitor driver hours and compliance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Updated {Math.floor((Date.now() - lastRefresh.getTime()) / 1000)}s ago</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLastRefresh(new Date())}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Drivers Tracked</CardDescription>
            <CardTitle className="text-3xl">{stats.totalDrivers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drivers with Low Hours</CardDescription>
            <CardTitle className={cn("text-3xl", stats.lowHoursCount > 0 && "text-red-600 dark:text-red-400")}>
              {stats.lowHoursCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">&lt;10 hours available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Compliance Score</CardDescription>
            <CardTitle className="text-3xl">{stats.avgCompliance}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.avgCompliance} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Violations Count</CardDescription>
            <CardTitle className={cn("text-3xl", stats.totalViolations > 0 && "text-red-600 dark:text-red-400")}>
              {stats.totalViolations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by employee name, ID, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available-hours-low">Available Hours (Low to High)</SelectItem>
                <SelectItem value="available-hours-high">Available Hours (High to Low)</SelectItem>
                <SelectItem value="compliance-low">Compliance Score (Low to High)</SelectItem>
                <SelectItem value="compliance-high">Compliance Score (High to Low)</SelectItem>
                <SelectItem value="name-az">Last Name (A-Z)</SelectItem>
                <SelectItem value="name-za">Last Name (Z-A)</SelectItem>
                <SelectItem value="violations-most">Violation Count (Most to Least)</SelectItem>
                <SelectItem value="violations-least">Violation Count (Least to Most)</SelectItem>
                <SelectItem value="hours-worked-most">Hours Worked (Most to Least)</SelectItem>
                <SelectItem value="hours-worked-least">Hours Worked (Least to Most)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            Showing {paginatedDrivers.length} of {filteredDrivers.length} drivers
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Advanced Filters</CardTitle>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compliance Score Range */}
            <div className="space-y-2">
              <Label>
                Compliance Score Range: {complianceRange[0]}% - {complianceRange[1]}%
              </Label>
              <Slider
                value={complianceRange}
                onValueChange={setComplianceRange}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex gap-2 text-xs">
                <span className="text-red-600 dark:text-red-400">&lt;85% Red</span>
                <span className="text-yellow-600 dark:text-yellow-400">85-94% Yellow</span>
                <span className="text-green-600 dark:text-green-400">≥95% Green</span>
              </div>
            </div>

            {/* Available Hours Range */}
            <div className="space-y-2">
              <Label>
                Available Hours Range: {hoursRange[0]}h - {hoursRange[1]}h
              </Label>
              <Slider value={hoursRange} onValueChange={setHoursRange} min={0} max={70} step={5} className="w-full" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setHoursRange([0, 10])}>
                  Low (&lt;10h)
                </Button>
                <Button variant="outline" size="sm" onClick={() => setHoursRange([10, 40])}>
                  Medium (10-40h)
                </Button>
                <Button variant="outline" size="sm" onClick={() => setHoursRange([40, 70])}>
                  High (&gt;40h)
                </Button>
              </div>
            </div>

            {/* HOS Violations */}
            <div className="space-y-3">
              <Label>HOS Violations</Label>
              <div className="flex items-center gap-2">
                <Switch checked={showViolationsOnly} onCheckedChange={setShowViolationsOnly} />
                <span className="text-sm">Show only violations</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-xs">Violation Type</Label>
                  <Select value={violationType} onValueChange={setViolationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Form & Manner">Form & Manner</SelectItem>
                      <SelectItem value="Hours Exceeded">Hours Exceeded</SelectItem>
                      <SelectItem value="30-minute Break">30-minute Break</SelectItem>
                      <SelectItem value="11-Hour Driving Limit">11-Hour Driving Limit</SelectItem>
                      <SelectItem value="14-Hour On-Duty Limit">14-Hour On-Duty Limit</SelectItem>
                      <SelectItem value="60/70 Hour Limit">60/70 Hour Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Severity</Label>
                  <Select value={violationSeverity} onValueChange={setViolationSeverity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location/Terminal */}
            <div className="space-y-2">
              <Label>Location/Terminal</Label>
              <div className="space-y-2">
                {[
                  "Houston Terminal",
                  "Dallas Terminal",
                  "Austin Terminal",
                  "San Antonio Terminal",
                  "Fort Worth Terminal",
                ].map((location) => (
                  <div key={location} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLocations([...selectedLocations, location])
                        } else {
                          setSelectedLocations(selectedLocations.filter((l) => l !== location))
                        }
                      }}
                    />
                    <span className="text-sm">{location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department</Label>
              <div className="space-y-2">
                {["Drivers", "Dispatch", "Maintenance", "Safety", "Operations"].map((dept) => (
                  <div key={dept} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedDepartments.includes(dept)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDepartments([...selectedDepartments, dept])
                        } else {
                          setSelectedDepartments(selectedDepartments.filter((d) => d !== dept))
                        }
                      }}
                    />
                    <span className="text-sm">{dept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range for Hours Calculation</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="current-cycle">Current cycle</SelectItem>
                  <SelectItem value="last-cycle">Last cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <Label>Employment Status</Label>
              <div className="space-y-2">
                {[
                  { value: "active", label: "Active" },
                  { value: "on-leave", label: "On Leave" },
                  { value: "suspended", label: "Suspended" },
                  { value: "training", label: "Training" },
                ].map((status) => (
                  <div key={status.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={employmentStatus.includes(status.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEmploymentStatus([...employmentStatus, status.value])
                        } else {
                          setEmploymentStatus(employmentStatus.filter((s) => s !== status.value))
                        }
                      }}
                    />
                    <span className="text-sm">{status.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {(complianceRange[0] !== 0 || complianceRange[1] !== 100) && (
            <Badge variant="secondary" className="gap-1">
              Compliance: {complianceRange[0]}-{complianceRange[1]}%
              <X className="h-3 w-3 cursor-pointer" onClick={() => setComplianceRange([0, 100])} />
            </Badge>
          )}
          {(hoursRange[0] !== 0 || hoursRange[1] !== 70) && (
            <Badge variant="secondary" className="gap-1">
              Hours: {hoursRange[0]}-{hoursRange[1]}h
              <X className="h-3 w-3 cursor-pointer" onClick={() => setHoursRange([0, 70])} />
            </Badge>
          )}
          {showViolationsOnly && (
            <Badge variant="secondary" className="gap-1">
              Violations Only
              <X className="h-3 w-3 cursor-pointer" onClick={() => setShowViolationsOnly(false)} />
            </Badge>
          )}
          {selectedLocations.map((location) => (
            <Badge key={location} variant="secondary" className="gap-1">
              {location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedLocations(selectedLocations.filter((l) => l !== location))}
              />
            </Badge>
          ))}
          {selectedDepartments.map((dept) => (
            <Badge key={dept} variant="secondary" className="gap-1">
              {dept}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedDepartments(selectedDepartments.filter((d) => d !== dept))}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Driver Hours of Service</CardTitle>
              <CardDescription>
                {selectedRows.size > 0 && `${selectedRows.size} selected • `}
                Showing {paginatedDrivers.length} of {filteredDrivers.length} drivers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedRows.size > 0 && (
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Message Selected
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export {selectedRows.size > 0 ? "Selected" : "All"}
              </Button>
              <div className="flex items-center gap-2 border-l pl-2">
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                <span className="text-sm">Auto-refresh</span>
                {autoRefresh && (
                  <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30s">30s</SelectItem>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size === paginatedDrivers.length && paginatedDrivers.length > 0}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Available Hours</TableHead>
                  <TableHead>Compliance Score</TableHead>
                  <TableHead>HOS Violations</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDrivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                      No drivers found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDrivers.map((driver) => (
                    <TableRow
                      key={driver.id}
                      className={cn(
                        driver.availableHours < 10 && "bg-red-50 dark:bg-red-950/20",
                        driver.violations > 0 && "bg-yellow-50 dark:bg-yellow-950/20",
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(driver.id)}
                          onCheckedChange={() => toggleRowSelection(driver.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-xs text-muted-foreground">{driver.email}</div>
                          </div>
                          {driver.complianceScore === 100 && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{driver.employeeId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{driver.location}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{driver.department}</Badge>
                      </TableCell>
                      <TableCell>{driver.hoursWorked}h</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium", getHoursColor(driver.availableHours))}>
                            {driver.availableHours}h
                          </span>
                          {driver.availableHours < 10 && (
                            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className={cn("h-2 rounded-full", getComplianceColor(driver.complianceScore))}
                              style={{ width: `${driver.complianceScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{driver.complianceScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {driver.violations > 0 ? (
                          <div className="space-y-1">
                            <Badge variant="destructive">{driver.violations}</Badge>
                            {driver.violationType && (
                              <div className="text-xs text-muted-foreground">{driver.violationType}</div>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(driver.lastUpdated).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Full Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="mr-2 h-4 w-4" />
                              Log Hours
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="mr-2 h-4 w-4" />
                              View Violation History
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact Employee
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Employee Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

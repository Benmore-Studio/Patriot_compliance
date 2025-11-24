"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  DollarSign,
  AlertTriangle,
  FileText,
  BarChart3,
  MapPin,
  Building2,
  Download,
} from "lucide-react"
import { useState } from "react"
import { generateExecutiveReportPDF, type ExecutiveReportData } from "@/lib/pdf-generator"
import { toast } from "sonner"

export default function ExecutivePortalPage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGenerateReport = async () => {
    setIsGeneratingPDF(true)
    try {
      const executiveData: ExecutiveReportData = {
        generatedDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        kpis: {
          overallCompliance: 94.2,
          activeEmployees: 1247,
          revenue: 124500,
          criticalRisks: 7,
        },
        locations: [
          { location: "Houston, TX", compliance: 96, employees: 342 },
          { location: "Dallas, TX", compliance: 91, employees: 287 },
          { location: "Austin, TX", compliance: 94, employees: 198 },
          { location: "San Antonio, TX", compliance: 88, employees: 156 },
          { location: "El Paso, TX", compliance: 97, employees: 264 },
        ],
        topRisks: [
          { risk: "Expired DOT Physicals", count: 12, severity: "high" },
          { risk: "Missing Background Checks", count: 8, severity: "high" },
          { risk: "Training Certifications Expiring", count: 24, severity: "medium" },
          { risk: "Random Testing Below Target", count: 3, severity: "medium" },
          { risk: "Incomplete DOT Files", count: 15, severity: "medium" },
        ],
        complianceByModule: [
          { name: "Drug & Alcohol Testing", score: 96 },
          { name: "Background Checks", score: 94 },
          { name: "DOT Compliance", score: 91 },
          { name: "Occupational Health", score: 97 },
          { name: "Training & Certifications", score: 89 },
        ],
        serviceCompanies: [
          { company: "ABC Transportation LLC", compliance: 94, employees: 487 },
          { company: "XYZ Logistics Inc", compliance: 89, employees: 312 },
          { company: "Premier Safety Services", compliance: 96, employees: 448 },
        ],
      }

      await generateExecutiveReportPDF(executiveData)
      toast.success("Executive report generated successfully!")
    } catch (error) {
      console.error("[v0] PDF generation error:", error)
      toast.error("Failed to generate report. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Executive Command Center</h1>
          <p className="mt-1 text-muted-foreground">High-level compliance and business intelligence</p>
        </div>
        <Button className="gap-2" onClick={handleGenerateReport} disabled={isGeneratingPDF}>
          <Download className="h-4 w-4" />
          {isGeneratingPDF ? "Generating..." : "Generate PDF Report"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
            <div className="flex items-center gap-1 text-xs text-chart-2">
              <TrendingUp className="h-3 w-3" />
              <span>+2.4% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              <span>+18 this month</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Turnover: 3.2% | Risk Score: Low</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (MRR)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$124,500</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7</div>
            <div className="flex items-center gap-1 text-xs text-chart-2">
              <TrendingDown className="h-3 w-3" />
              <span>-3 from yesterday</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Audit Readiness: 92%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Heat Map
            </CardTitle>
            <CardDescription>Compliance status by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { location: "Houston, TX", compliance: 96, employees: 342, status: "green" },
                { location: "Dallas, TX", compliance: 91, employees: 287, status: "yellow" },
                { location: "Austin, TX", compliance: 94, employees: 198, status: "green" },
                { location: "San Antonio, TX", compliance: 88, employees: 156, status: "yellow" },
                { location: "El Paso, TX", compliance: 97, employees: 264, status: "green" },
              ].map((site) => (
                <div
                  key={site.location}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        site.status === "green"
                          ? "bg-chart-2"
                          : site.status === "yellow"
                            ? "bg-chart-5"
                            : "bg-destructive"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-foreground">{site.location}</p>
                      <p className="text-xs text-muted-foreground">{site.employees} employees</p>
                    </div>
                  </div>
                  <Badge variant={site.status === "green" ? "default" : "secondary"}>{site.compliance}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Top 10 Compliance Risks
            </CardTitle>
            <CardDescription>Prioritized risk register</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { risk: "Expired DOT Physicals", count: 12, severity: "high", trend: "up" },
                { risk: "Missing Background Checks", count: 8, severity: "high", trend: "down" },
                { risk: "Training Certifications Expiring", count: 24, severity: "medium", trend: "stable" },
                { risk: "Random Testing Below Target", count: 3, severity: "medium", trend: "up" },
                { risk: "Incomplete DOT Files", count: 15, severity: "medium", trend: "down" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.risk}</p>
                      <p className="text-xs text-muted-foreground">{item.count} affected employees</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.severity === "high" ? "destructive" : "secondary"}>
                      {item.severity.toUpperCase()}
                    </Badge>
                    {item.trend === "up" && <TrendingUp className="h-4 w-4 text-destructive" />}
                    {item.trend === "down" && <TrendingDown className="h-4 w-4 text-chart-2" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Module */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance by Module</CardTitle>
          <CardDescription>Performance across all compliance areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Drug & Alcohol Testing", score: 96, status: "green" },
              { name: "Background Checks", score: 94, status: "green" },
              { name: "DOT Compliance", score: 91, status: "yellow" },
              { name: "Occupational Health", score: 97, status: "green" },
              { name: "Training & Certifications", score: 89, status: "yellow" },
            ].map((module) => (
              <div key={module.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={module.status === "green" ? "default" : "secondary"} className="w-16">
                    {module.score}%
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">{module.name}</span>
                </div>
                <div className="h-2 w-48 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${module.status === "green" ? "bg-green-500" : "bg-yellow-500"}`}
                    style={{ width: `${module.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest compliance and business reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Monthly Compliance Summary", date: "Jan 15, 2025", type: "Compliance" },
              { name: "Q4 2024 Financial Report", date: "Jan 10, 2025", type: "Financial" },
              { name: "Annual Safety Review", date: "Jan 5, 2025", type: "Safety" },
            ].map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Executive Actions</CardTitle>
            <CardDescription>Quick access to key functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Executive Report
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Review User Roles & Permissions
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              View Audit Trail
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Service Company Portfolio
          </CardTitle>
          <CardDescription>Multi-company compliance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { company: "ABC Transportation LLC", compliance: 94, employees: 487, status: "green" },
              { company: "XYZ Logistics Inc", compliance: 89, employees: 312, status: "yellow" },
              { company: "Premier Safety Services", compliance: 96, employees: 448, status: "green" },
            ].map((company) => (
              <div
                key={company.company}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-lg ${
                      company.status === "green" ? "bg-chart-2/10" : "bg-chart-5/10"
                    } flex items-center justify-center`}
                  >
                    <Building2 className={`h-6 w-6 ${company.status === "green" ? "text-chart-2" : "text-chart-5"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{company.company}</p>
                    <p className="text-sm text-muted-foreground">{company.employees} employees</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{company.compliance}%</div>
                  <p className="text-xs text-muted-foreground">Compliance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

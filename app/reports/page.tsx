"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { BarChart3, Download, FileText, Calendar, Clock, TrendingUp, Users, Link2 } from "lucide-react"

export default function ReportsPage() {
  const [selectedModules, setSelectedModules] = useState<string[]>(["all"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & MIS</h1>
        <p className="text-muted-foreground mt-2">Generate comprehensive compliance reports and analytics</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Build a custom report with specific data and filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type */}
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select defaultValue="compliance">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance Summary</SelectItem>
                    <SelectItem value="drug-testing">Drug Testing MIS</SelectItem>
                    <SelectItem value="background">Background Checks</SelectItem>
                    <SelectItem value="dot">DOT Compliance</SelectItem>
                    <SelectItem value="health">Occupational Health</SelectItem>
                    <SelectItem value="training">Training & Certifications</SelectItem>
                    <SelectItem value="billing">Billing & Revenue</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" defaultValue="2025-01-01" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" defaultValue="2025-01-31" />
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-3">
                <Label>Include Modules</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { id: "drug-testing", name: "Drug & Alcohol Testing" },
                    { id: "background", name: "Background Checks" },
                    { id: "dot", name: "DOT Compliance" },
                    { id: "health", name: "Occupational Health" },
                    { id: "training", name: "Training & Certifications" },
                    { id: "geo-fencing", name: "Geo-Fencing" },
                  ].map((module) => (
                    <div key={module.id} className="flex items-center space-x-2">
                      <Switch
                        id={module.id}
                        checked={selectedModules.includes(module.id) || selectedModules.includes("all")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedModules([...selectedModules.filter((m) => m !== "all"), module.id])
                          } else {
                            setSelectedModules(selectedModules.filter((m) => m !== module.id))
                          }
                        }}
                      />
                      <Label htmlFor={module.id} className="cursor-pointer">
                        {module.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Companies */}
              <div className="space-y-2">
                <Label>Service Companies</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="specific">Specific Companies</SelectItem>
                    <SelectItem value="group">Company Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export Format */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="shareable">Shareable Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Monthly Compliance Summary",
                description: "Overall compliance metrics and trends across all modules",
                category: "Compliance",
                frequency: "Monthly",
              },
              {
                name: "DOT MIS Report",
                description: "DOT-required Management Information System report",
                category: "Drug Testing",
                frequency: "Quarterly",
              },
              {
                name: "Background Check Status",
                description: "Background screening status and adjudication results",
                category: "Background",
                frequency: "Weekly",
              },
              {
                name: "Training Certification Matrix",
                description: "Employee training and certification compliance status",
                category: "Training",
                frequency: "Monthly",
              },
              {
                name: "Occupational Health Summary",
                description: "Medical surveillance, exams, and OSHA 300 log",
                category: "Health",
                frequency: "Monthly",
              },
              {
                name: "Billing & Revenue Report",
                description: "Financial summary, invoicing, and payment tracking",
                category: "Billing",
                frequency: "Monthly",
              },
            ].map((template) => (
              <Card key={template.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <CardTitle className="mt-4 text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{template.frequency}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated and delivered reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Monthly Compliance Summary",
                    schedule: "1st of every month at 9:00 AM",
                    recipients: "executives@company.com",
                    format: "PDF",
                    nextRun: "Feb 1, 2025 09:00 AM",
                  },
                  {
                    name: "Weekly Background Check Status",
                    schedule: "Every Monday at 8:00 AM",
                    recipients: "compliance@company.com",
                    format: "Excel",
                    nextRun: "Jan 20, 2025 08:00 AM",
                  },
                  {
                    name: "Quarterly DOT MIS Report",
                    schedule: "Last day of quarter at 5:00 PM",
                    recipients: "dot-admin@company.com",
                    format: "PDF",
                    nextRun: "Mar 31, 2025 05:00 PM",
                  },
                ].map((report, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{report.name}</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{report.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{report.recipients}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{report.format}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">Next: {report.nextRun}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Run Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Disable
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Monthly Compliance Summary - January 2025",
                    generatedAt: "Jan 15, 2025 10:30 AM",
                    generatedBy: "John Doe",
                    format: "PDF",
                    size: "2.4 MB",
                    shareLink: true,
                  },
                  {
                    name: "DOT MIS Report - Q4 2024",
                    generatedAt: "Jan 10, 2025 03:15 PM",
                    generatedBy: "Jane Smith",
                    format: "PDF",
                    size: "1.8 MB",
                    shareLink: true,
                  },
                  {
                    name: "Background Check Status - Week 2",
                    generatedAt: "Jan 8, 2025 08:00 AM",
                    generatedBy: "System (Scheduled)",
                    format: "Excel",
                    size: "856 KB",
                    shareLink: false,
                  },
                ].map((report, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{report.name}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{report.generatedAt}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{report.generatedBy}</span>
                          </div>
                          <span>•</span>
                          <span>
                            {report.format} ({report.size})
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        {report.shareLink && (
                          <Button variant="outline" size="sm">
                            <Link2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Reports Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground mt-1">Active schedules</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Shared Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground mt-1">Via secure links</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3s</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">-0.5s</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Generated Reports</CardTitle>
              <CardDescription>Top 5 reports by generation count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Monthly Compliance Summary", count: 342, trend: "+5%" },
                  { name: "DOT MIS Report", count: 289, trend: "+12%" },
                  { name: "Background Check Status", count: 234, trend: "+8%" },
                  { name: "Training Certification Matrix", count: 198, trend: "+3%" },
                  { name: "Occupational Health Summary", count: 184, trend: "+7%" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium">{report.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{report.count} generated</span>
                      <Badge variant="secondary" className="text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {report.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

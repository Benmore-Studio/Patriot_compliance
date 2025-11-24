"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar } from "lucide-react"

export function MISReporting() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              MIS & Reporting
            </CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="12months">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export MIS Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-4 font-semibold text-foreground">DOT MIS Reporting</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Tests Conducted</span>
                  <div className="text-2xl font-bold text-foreground">1,842</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Random Tests</span>
                  <div className="text-2xl font-bold text-foreground">1,156</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Random Rate Achieved</span>
                  <div className="text-2xl font-bold text-green-400">52.3%</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Positive Results</span>
                  <div className="text-2xl font-bold text-red-400">12</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Refusals</span>
                  <div className="text-2xl font-bold text-red-400">3</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Negative Results</span>
                  <div className="text-2xl font-bold text-green-400">1,827</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-4 font-semibold text-foreground">Non-DOT MIS Reporting</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Tests Conducted</span>
                  <div className="text-2xl font-bold text-foreground">486</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Random Tests</span>
                  <div className="text-2xl font-bold text-foreground">298</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Random Rate Achieved</span>
                  <div className="text-2xl font-bold text-green-400">26.8%</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Positive Results</span>
                  <div className="text-2xl font-bold text-red-400">8</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Refusals</span>
                  <div className="text-2xl font-bold text-red-400">1</div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Negative Results</span>
                  <div className="text-2xl font-bold text-green-400">477</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-4 font-semibold text-foreground">Available Reports</h3>
              <div className="space-y-3">
                {[
                  { name: "DOT MIS Report - Q1 2025", date: "Jan 1 - Mar 31, 2025", type: "DOT" },
                  { name: "Non-DOT MIS Report - Q1 2025", date: "Jan 1 - Mar 31, 2025", type: "Non-DOT" },
                  { name: "Portfolio Compliance Summary", date: "Rolling 12 Months", type: "Summary" },
                  { name: "Occupational Health Status Report", date: "Current", type: "OH" },
                  { name: "Training & Certifications Report", date: "Current", type: "Training" },
                  { name: "Billing Audit Log", date: "Last 12 Months", type: "Billing" },
                ].map((report) => (
                  <div
                    key={report.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{report.name}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MISExpress() {
  const [dateFrom, setDateFrom] = useState("2024-01-01")
  const [dateTo, setDateTo] = useState("2025-01-15")
  const { toast } = useToast()

  const handleExport = (reportType: string) => {
    toast({
      title: "Exporting Report",
      description: `Generating ${reportType} report...`,
    })

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${reportType} report has been downloaded`,
      })
    }, 1500)
  }

  // Mock DOT data
  const dotData = {
    totalTests: 247,
    randomTests: 124,
    preEmployment: 45,
    postAccident: 12,
    reasonableSuspicion: 8,
    returnToDuty: 3,
    followUp: 5,
    positiveTests: 6,
    negativeTests: 239,
    refusals: 2,
    poolSize: 150,
    requiredRate: 50,
    complianceRate: 82.7,
  }

  // Mock Non-DOT data
  const nonDotData = {
    totalTests: 89,
    preEmployment: 62,
    random: 18,
    postAccident: 5,
    reasonableSuspicion: 4,
    positiveTests: 2,
    negativeTests: 87,
    refusals: 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">MIS Express</h2>
        <p className="text-muted-foreground">Management Information System reporting for DOT and Non-DOT programs</p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
          <CardDescription>Select date range for MIS reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="date-from">From Date</Label>
              <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="flex-1">
              <Label htmlFor="date-to">To Date</Label>
              <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Update Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dot" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dot">DOT Reporting</TabsTrigger>
          <TabsTrigger value="non-dot">Non-DOT Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="dot" className="space-y-4">
          {/* DOT Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Tests</CardDescription>
                <CardTitle className="text-3xl">{dotData.totalTests}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">All test types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Random Tests</CardDescription>
                <CardTitle className="text-3xl">{dotData.randomTests}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{dotData.complianceRate}% compliance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Positive Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {((dotData.positiveTests / dotData.totalTests) * 100).toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{dotData.positiveTests} positive tests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Refusals</CardDescription>
                <CardTitle className="text-3xl">{dotData.refusals}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Refusal to test</p>
              </CardContent>
            </Card>
          </div>

          {/* DOT Test Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>DOT Test Type Breakdown</CardTitle>
              <CardDescription>Tests by category for FMCSA reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Positive</TableHead>
                    <TableHead>Negative</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Random</TableCell>
                    <TableCell>{dotData.randomTests}</TableCell>
                    <TableCell>{((dotData.randomTests / dotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        3
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        121
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-Employment</TableCell>
                    <TableCell>{dotData.preEmployment}</TableCell>
                    <TableCell>{((dotData.preEmployment / dotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        1
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        44
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Post-Accident</TableCell>
                    <TableCell>{dotData.postAccident}</TableCell>
                    <TableCell>{((dotData.postAccident / dotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        1
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        11
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reasonable Suspicion</TableCell>
                    <TableCell>{dotData.reasonableSuspicion}</TableCell>
                    <TableCell>{((dotData.reasonableSuspicion / dotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        1
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        7
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Return-to-Duty</TableCell>
                    <TableCell>{dotData.returnToDuty}</TableCell>
                    <TableCell>{((dotData.returnToDuty / dotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        0
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        3
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Follow-Up</TableCell>
                    <TableCell>{dotData.followUp}</TableCell>
                    <TableCell>{((dotData.followUp / dotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        0
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        5
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export DOT Reports</CardTitle>
              <CardDescription>Download MIS reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" onClick={() => handleExport("DOT MIS Report (PDF)")}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF Report
                </Button>
                <Button variant="outline" onClick={() => handleExport("DOT MIS Report (Excel)")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel Export
                </Button>
                <Button variant="outline" onClick={() => handleExport("DOT MIS Report (CSV)")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non-dot" className="space-y-4">
          {/* Non-DOT Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Tests</CardDescription>
                <CardTitle className="text-3xl">{nonDotData.totalTests}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">All test types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pre-Employment</CardDescription>
                <CardTitle className="text-3xl">{nonDotData.preEmployment}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {((nonDotData.preEmployment / nonDotData.totalTests) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Positive Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {((nonDotData.positiveTests / nonDotData.totalTests) * 100).toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{nonDotData.positiveTests} positive tests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Refusals</CardDescription>
                <CardTitle className="text-3xl">{nonDotData.refusals}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Refusal to test</p>
              </CardContent>
            </Card>
          </div>

          {/* Non-DOT Test Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Non-DOT Test Type Breakdown</CardTitle>
              <CardDescription>Tests by category for internal reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Positive</TableHead>
                    <TableHead>Negative</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Pre-Employment</TableCell>
                    <TableCell>{nonDotData.preEmployment}</TableCell>
                    <TableCell>{((nonDotData.preEmployment / nonDotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        1
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        61
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Random</TableCell>
                    <TableCell>{nonDotData.random}</TableCell>
                    <TableCell>{((nonDotData.random / nonDotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        1
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        17
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Post-Accident</TableCell>
                    <TableCell>{nonDotData.postAccident}</TableCell>
                    <TableCell>{((nonDotData.postAccident / nonDotData.totalTests) * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        0
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        5
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Reasonable Suspicion</TableCell>
                    <TableCell>{nonDotData.reasonableSuspicion}</TableCell>
                    <TableCell>
                      {((nonDotData.reasonableSuspicion / nonDotData.totalTests) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        0
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        4
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Non-DOT Reports</CardTitle>
              <CardDescription>Download MIS reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" onClick={() => handleExport("Non-DOT MIS Report (PDF)")}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF Report
                </Button>
                <Button variant="outline" onClick={() => handleExport("Non-DOT MIS Report (Excel)")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel Export
                </Button>
                <Button variant="outline" onClick={() => handleExport("Non-DOT MIS Report (CSV)")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

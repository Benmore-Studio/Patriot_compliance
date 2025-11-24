"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, Shield, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"

export default function AuditorPortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Auditor Portal</h1>
        <p className="text-muted-foreground mt-1">Evidence repository and compliance verification</p>
      </div>

      <Tabs defaultValue="evidence" className="space-y-6">
        <TabsList>
          <TabsTrigger value="evidence">Evidence Repository</TabsTrigger>
          <TabsTrigger value="controls">Control Matrix</TabsTrigger>
          <TabsTrigger value="qa">Q&A Workflow</TabsTrigger>
          <TabsTrigger value="sampling">Sampling Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="evidence" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence Repository</CardTitle>
              <CardDescription>Search and review compliance documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by employee, document type, or date..." className="pl-9" />
                </div>
                <Button>Search</Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Statistics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">12,458</div>
                <p className="text-xs text-gray-500">Across all modules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">11,742</div>
                <p className="text-xs text-gray-500">94.3% compliance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Non-Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">716</div>
                <p className="text-xs text-gray-500">5.7% requiring action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">142</div>
                <p className="text-xs text-gray-500">Awaiting verification</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Audit Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Items</CardTitle>
              <CardDescription>Latest compliance records for review</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      employee: "John Smith",
                      module: "Drug Testing",
                      type: "Test Result",
                      date: "Jan 15, 2025",
                      status: "compliant",
                    },
                    {
                      employee: "Sarah Johnson",
                      module: "Background",
                      type: "Criminal Check",
                      date: "Jan 14, 2025",
                      status: "compliant",
                    },
                    {
                      employee: "Mike Davis",
                      module: "DOT",
                      type: "Medical Certificate",
                      date: "Jan 14, 2025",
                      status: "pending",
                    },
                    {
                      employee: "Emily Brown",
                      module: "Training",
                      type: "Safety Course",
                      date: "Jan 13, 2025",
                      status: "compliant",
                    },
                    {
                      employee: "David Wilson",
                      module: "Health",
                      type: "Physical Exam",
                      date: "Jan 13, 2025",
                      status: "non-compliant",
                    },
                  ].map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.employee}</TableCell>
                      <TableCell>{item.module}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "compliant"
                              ? "default"
                              : item.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            item.status === "compliant"
                              ? "bg-green-600"
                              : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                          }
                        >
                          {item.status === "compliant" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {item.status === "non-compliant" && <XCircle className="mr-1 h-3 w-3" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Control Matrix</CardTitle>
              <CardDescription>SOC2, CMMC, and HIPAA compliance controls</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="soc2">
                <TabsList>
                  <TabsTrigger value="soc2">SOC 2</TabsTrigger>
                  <TabsTrigger value="cmmc">CMMC</TabsTrigger>
                  <TabsTrigger value="hipaa">HIPAA</TabsTrigger>
                </TabsList>
                <TabsContent value="soc2" className="space-y-3 mt-4">
                  {[
                    { control: "CC6.1 - Logical Access Controls", status: "verified", evidence: 45 },
                    { control: "CC6.2 - System Monitoring", status: "verified", evidence: 32 },
                    { control: "CC7.2 - Change Management", status: "pending", evidence: 12 },
                    { control: "CC8.1 - Risk Assessment", status: "verified", evidence: 28 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.control}</p>
                          <p className="text-xs text-muted-foreground">{item.evidence} evidence items</p>
                        </div>
                      </div>
                      <Badge variant={item.status === "verified" ? "default" : "secondary"}>
                        {item.status === "verified" ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="cmmc" className="space-y-3 mt-4">
                  {[
                    { control: "AC.L2-3.1.1 - Access Control", status: "verified", evidence: 38 },
                    { control: "AU.L2-3.3.1 - Audit Logging", status: "verified", evidence: 52 },
                    { control: "IA.L2-3.5.1 - Identification", status: "verified", evidence: 41 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.control}</p>
                          <p className="text-xs text-muted-foreground">{item.evidence} evidence items</p>
                        </div>
                      </div>
                      <Badge variant="default">Verified</Badge>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="hipaa" className="space-y-3 mt-4">
                  {[
                    { control: "164.308(a)(1) - Security Management", status: "verified", evidence: 29 },
                    { control: "164.312(a)(1) - Access Control", status: "verified", evidence: 44 },
                    { control: "164.312(b) - Audit Controls", status: "pending", evidence: 8 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.control}</p>
                          <p className="text-xs text-muted-foreground">{item.evidence} evidence items</p>
                        </div>
                      </div>
                      <Badge variant={item.status === "verified" ? "default" : "secondary"}>
                        {item.status === "verified" ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Q&A Workflow</CardTitle>
                  <CardDescription>Submit questions and track responses</CardDescription>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  New Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    question: "Can you provide evidence of random pool selection methodology?",
                    module: "Drug Testing",
                    status: "answered",
                    date: "Jan 14, 2025",
                  },
                  {
                    question: "What is the process for adjudicating background check adverse findings?",
                    module: "Background",
                    status: "pending",
                    date: "Jan 15, 2025",
                  },
                  {
                    question: "How are DOT medical certificates tracked and renewed?",
                    module: "DOT",
                    status: "answered",
                    date: "Jan 13, 2025",
                  },
                ].map((item, index) => (
                  <div key={index} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{item.module}</Badge>
                      <Badge variant={item.status === "answered" ? "default" : "secondary"}>
                        {item.status === "answered" ? "Answered" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{item.question}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sampling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sampling Tools</CardTitle>
              <CardDescription>Random selection algorithms for audit sampling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Population Size</label>
                    <Input type="number" placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sample Size</label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sampling Method</label>
                    <Select defaultValue="random">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Simple Random</SelectItem>
                        <SelectItem value="systematic">Systematic</SelectItem>
                        <SelectItem value="stratified">Stratified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Module</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="drug">Drug Testing</SelectItem>
                        <SelectItem value="background">Background</SelectItem>
                        <SelectItem value="dot">DOT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Generate Sample</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

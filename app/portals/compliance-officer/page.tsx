"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle, User, FileText, Zap } from "lucide-react"

export default function ComplianceOfficerWorkstationPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const workQueueItems = [
    {
      id: 1,
      employee: "John Smith",
      type: "Background Check",
      action: "Adjudicate",
      priority: "high",
      dueDate: "Today",
      status: "pending",
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      type: "MRO Result",
      action: "Review",
      priority: "high",
      dueDate: "Today",
      status: "pending",
    },
    {
      id: 3,
      employee: "Mike Davis",
      type: "Document Upload",
      action: "Approve",
      priority: "medium",
      dueDate: "Tomorrow",
      status: "pending",
    },
    {
      id: 4,
      employee: "Emily Brown",
      type: "Adverse Action",
      action: "Process",
      priority: "high",
      dueDate: "Today",
      status: "pending",
    },
    {
      id: 5,
      employee: "David Wilson",
      type: "Training Completion",
      action: "Verify",
      priority: "low",
      dueDate: "Jan 20",
      status: "pending",
    },
  ]

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedItems((prev) => (prev.length === workQueueItems.length ? [] : workQueueItems.map((item) => item.id)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Officer Workstation</h1>
          <p className="text-muted-foreground mt-1">Task-oriented workflow management</p>
        </div>
        <Button>
          <User className="mr-2 h-4 w-4" />
          Employee 360°
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-muted-foreground">Due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">28</div>
            <p className="text-xs text-muted-foreground">+15% vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.2h</div>
            <p className="text-xs text-muted-foreground">Per task completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="queue">Work Queue</TabsTrigger>
          <TabsTrigger value="alerts">Real-Time Alerts</TabsTrigger>
          <TabsTrigger value="automations">Workflow Automations</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          {/* Filters and Bulk Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Work Queue</CardTitle>
                  <CardDescription>Sortable and filterable task list</CardDescription>
                </div>
                {selectedItems.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve ({selectedItems.length})
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject ({selectedItems.length})
                    </Button>
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Assign
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by employee or task type..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="background">Background Check</SelectItem>
                    <SelectItem value="mro">MRO Result</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="adverse">Adverse Action</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox checked={selectedItems.length === workQueueItems.length} onCheckedChange={toggleAll} />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action Required</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workQueueItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.employee}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {item.priority === "high" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Alerts Feed</CardTitle>
              <CardDescription>Live compliance notifications and flags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    type: "critical",
                    title: "Positive Drug Test Result",
                    employee: "John Smith",
                    time: "2 minutes ago",
                  },
                  {
                    type: "warning",
                    title: "Background Check Adverse Finding",
                    employee: "Sarah Johnson",
                    time: "15 minutes ago",
                  },
                  {
                    type: "info",
                    title: "Document Uploaded for Review",
                    employee: "Mike Davis",
                    time: "1 hour ago",
                  },
                  {
                    type: "critical",
                    title: "Medical Certificate Expired",
                    employee: "Emily Brown",
                    time: "2 hours ago",
                  },
                  {
                    type: "warning",
                    title: "Training Deadline Approaching",
                    employee: "David Wilson",
                    time: "3 hours ago",
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {alert.type === "critical" && <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />}
                      {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                      {alert.type === "info" && <Clock className="h-5 w-5 text-blue-600 mt-0.5" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.employee} • {alert.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Automations</CardTitle>
              <CardDescription>Configure automated compliance workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Auto-Approve Clear Background Checks",
                    description: "Automatically approve background checks with no adverse findings",
                    enabled: true,
                  },
                  {
                    name: "Auto-Assign MRO Reviews",
                    description: "Automatically assign MRO results to designated reviewers",
                    enabled: true,
                  },
                  {
                    name: "Bulk Status Updates",
                    description: "Update multiple employee statuses based on criteria",
                    enabled: false,
                  },
                  {
                    name: "Expiration Notifications",
                    description: "Send automated alerts 30 days before certificate expiration",
                    enabled: true,
                  },
                  {
                    name: "Document Auto-Classification",
                    description: "Automatically classify uploaded documents by type",
                    enabled: false,
                  },
                ].map((automation, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-start gap-3">
                      <Zap
                        className={`h-5 w-5 mt-0.5 ${automation.enabled ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{automation.name}</p>
                        <p className="text-xs text-muted-foreground">{automation.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={automation.enabled ? "default" : "secondary"}>
                        {automation.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Webhook,
  RefreshCw,
  Settings,
  Download,
  ArrowRight,
  Database,
  Home,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function WorkforceIntegrationPage() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const { toast } = useToast()

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both API Key and API Secret",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    // Simulate API connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setIsConnecting(false)

    toast({
      title: "Connection Successful",
      description: "Workforce integration is now active and syncing data",
    })
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setApiKey("")
    setApiSecret("")
    toast({
      title: "Disconnected",
      description: "Workforce integration has been disconnected",
    })
  }

  const handleTestConnection = async () => {
    toast({
      title: "Testing Connection",
      description: "Verifying API credentials...",
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Connection Test Successful",
      description: "API credentials are valid and connection is working",
    })
  }

  const handleSyncNow = async () => {
    toast({
      title: "Sync Started",
      description: "Syncing employee data from Workforce...",
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Sync Complete",
      description: "156 employee records updated successfully",
    })
  }

  const handleMigrateData = async () => {
    toast({
      title: "Migration Started",
      description: "Importing 20,000+ existing entries from Workforce...",
    })

    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Migration Complete",
      description: "20,247 records successfully imported into PCS",
    })
  }

  // Mock data
  const syncHistory = [
    { date: "2025-01-15 08:00 AM", records: 156, status: "success", duration: "2.3s" },
    { date: "2025-01-14 08:00 AM", records: 156, status: "success", duration: "2.1s" },
    { date: "2025-01-13 08:00 AM", records: 155, status: "success", duration: "2.4s" },
    { date: "2025-01-12 08:00 AM", records: 155, status: "success", duration: "2.2s" },
  ]

  const webhookEvents = [
    { event: "employee.created", timestamp: "2025-01-15 09:30 AM", status: "processed" },
    { event: "employee.updated", timestamp: "2025-01-15 08:15 AM", status: "processed" },
    { event: "employee.terminated", timestamp: "2025-01-14 04:45 PM", status: "processed" },
    { event: "employee.updated", timestamp: "2025-01-14 02:20 PM", status: "processed" },
  ]

  const misReports = [
    { name: "DOT Random Testing Report", date: "2025-01-01", type: "Quarterly", status: "Available" },
    { name: "Non-DOT Testing Summary", date: "2025-01-01", type: "Monthly", status: "Available" },
    { name: "Violation Report", date: "2024-12-01", type: "Annual", status: "Available" },
  ]

  const migrationPreview = [
    { id: "WF-001", name: "John Smith", department: "Operations", position: "Driver", status: "Active" },
    { id: "WF-002", name: "Sarah Johnson", department: "Safety", position: "Safety Manager", status: "Active" },
    { id: "WF-003", name: "Mike Davis", department: "Operations", position: "Driver", status: "Active" },
    { id: "WF-004", name: "Emily Brown", department: "Compliance", position: "Compliance Officer", status: "Active" },
    { id: "WF-005", name: "Robert Wilson", department: "Operations", position: "Driver", status: "Active" },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/settings" className="hover:text-foreground transition-colors">
          Integrations
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Workforce</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Workforce Integration</h1>
        <p className="text-muted-foreground">Connect and sync employee data with Workforce management system</p>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Workforce API integration and data synchronization</CardDescription>
            </div>
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                <XCircle className="mr-1 h-3 w-3" />
                Disconnected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Setup Instructions:</strong> Enter your Workforce API credentials below to establish a
                  connection. Once connected, employee data will automatically sync every 24 hours.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="text"
                    placeholder="Enter your Workforce API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="Enter your API secret"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Connect to Workforce"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Last Sync</CardDescription>
                    <CardTitle className="text-2xl">2 hours ago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">156 records synced</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Sync Status</CardDescription>
                    <CardTitle className="text-2xl">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Next sync in 22 hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Webhook Status</CardDescription>
                    <CardTitle className="text-2xl">Healthy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">4 events today</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSyncNow}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </Button>
                <Button variant="outline" onClick={handleTestConnection}>
                  Test Connection
                </Button>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="api-config" className="space-y-4">
          <TabsList>
            <TabsTrigger value="api-config">API Configuration</TabsTrigger>
            <TabsTrigger value="mis-reports">MIS Report Preview</TabsTrigger>
            <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="webhooks">Webhook Status</TabsTrigger>
            <TabsTrigger value="connection-history">Connection History</TabsTrigger>
            <TabsTrigger value="formfox">FormFox Chain of Custody</TabsTrigger>
            <TabsTrigger value="migration">Data Migration</TabsTrigger>
          </TabsList>

          <TabsContent value="api-config">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Manage API credentials and connection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="current-api-key">API Key</Label>
                    <Input id="current-api-key" type="password" value="••••••••••••••••" disabled />
                  </div>
                  <div>
                    <Label htmlFor="current-api-secret">API Secret</Label>
                    <Input id="current-api-secret" type="password" value="••••••••••••••••" disabled />
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="font-medium">Connection Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">API Endpoint</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">https://api.workforce.com/v1</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Authentication</span>
                      <span className="font-medium">OAuth 2.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate Limit</span>
                      <span className="font-medium">1000 requests/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connection Established</span>
                      <span className="font-medium">2025-01-10 14:30 PM</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                  <select
                    id="sync-frequency"
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="24">Every 24 hours</option>
                    <option value="12">Every 12 hours</option>
                    <option value="6">Every 6 hours</option>
                    <option value="1">Every hour</option>
                  </select>
                </div>

                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Update Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mis-reports">
            <Card>
              <CardHeader>
                <CardTitle>MIS Report Preview</CardTitle>
                <CardDescription>Management Information System reports from Workforce</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {misReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-mapping">
            <Card>
              <CardHeader>
                <CardTitle>Data Mapping Configuration</CardTitle>
                <CardDescription>Map Workforce fields to PCS database schema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="font-medium">Field Mappings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">workforce_id</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">employee_id</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">full_name</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">name</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">dept_name</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">department</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">job_title</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">role</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">hire_date</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">start_date</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>

                <Button>Add Custom Mapping</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Status</CardTitle>
                <CardDescription>Real-time event notifications from Workforce</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Webhook Endpoint</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">URL</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">/api/webhooks/workforce</code>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events Received (24h)</span>
                      <span className="font-medium">4</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recent Webhook Events</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhookEvents.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{event.event}</TableCell>
                          <TableCell>{event.timestamp}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            >
                              {event.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connection-history">
            <Card>
              <CardHeader>
                <CardTitle>Connection History</CardTitle>
                <CardDescription>Recent data sync operations from Workforce</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Records Synced</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncHistory.map((sync, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{sync.date}</TableCell>
                        <TableCell>{sync.records}</TableCell>
                        <TableCell>{sync.duration}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {sync.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formfox">
            <Card>
              <CardHeader>
                <CardTitle>FormFox Electronic Chain of Custody</CardTitle>
                <CardDescription>Track drug test data flow from lab to PCS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    FormFox provides electronic chain of custody for drug testing, ensuring secure data transmission
                    from collection sites through labs to your compliance system.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Data Flow Diagram</h4>
                  <div className="flex items-center justify-between p-6 border rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">CRL Lab</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>

                    <ArrowRight className="h-8 w-8 text-muted-foreground" />

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">FormFox</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    </div>

                    <ArrowRight className="h-8 w-8 text-muted-foreground" />

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Webhook className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Workforce</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Syncing
                      </Badge>
                    </div>

                    <ArrowRight className="h-8 w-8 text-muted-foreground" />

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium">PCS</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Receiving
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="font-medium">Chain of Custody Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lab Partner</span>
                      <span className="font-medium">CRL (Clinical Reference Laboratory)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">FormFox Status</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tests Processed (YTD)</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Processing Time</span>
                      <span className="font-medium">32 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Integrity</span>
                      <span className="font-medium text-green-600 dark:text-green-400">100% Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration">
            <Card>
              <CardHeader>
                <CardTitle>Data Migration Tool</CardTitle>
                <CardDescription>Import existing employee records from Workforce</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        20,247 Existing Entries Ready to Import
                      </p>
                      <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                        All historical employee data from Workforce is available for one-time migration into PCS.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Migration Preview (First 5 Records)</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workforce ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {migrationPreview.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>{record.position}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing 5 of 20,247 records. Full dataset will be imported during migration.
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="font-medium">Migration Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-terminated" defaultChecked />
                      <Label htmlFor="include-terminated" className="text-sm">
                        Include terminated employees
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-historical" defaultChecked />
                      <Label htmlFor="include-historical" className="text-sm">
                        Include historical compliance data
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="merge-duplicates" defaultChecked />
                      <Label htmlFor="merge-duplicates" className="text-sm">
                        Automatically merge duplicate records
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleMigrateData}>
                    <Database className="mr-2 h-4 w-4" />
                    Start Migration
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Preview
                  </Button>
                </div>

                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                        One-Time Migration Process
                      </p>
                      <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                        This migration can only be performed once. After completion, ongoing sync will handle new and
                        updated records automatically. Estimated time: 15-20 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

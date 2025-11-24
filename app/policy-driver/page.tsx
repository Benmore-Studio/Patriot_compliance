"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CheckCircle, Play, FileText, Settings2 } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PolicyDriverPage() {
  const [simulationMode, setSimulationMode] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Policy Driver</h1>
          <p className="text-muted-foreground mt-1">Configure automated compliance rules and workflows</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Template Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Policy Template Library</DialogTitle>
                <DialogDescription>
                  Pre-configured compliance policies for common industries and roles
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Card className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">DOT Commercial Driver</CardTitle>
                    <CardDescription>
                      Complete DOT compliance policy including random testing (50%), medical certificates, and
                      Clearinghouse integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm">Apply Template</Button>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">Construction Laborer</CardTitle>
                    <CardDescription>
                      OSHA compliance, safety training requirements, and background screening for construction sites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm">Apply Template</Button>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">Healthcare Worker</CardTitle>
                    <CardDescription>
                      HIPAA compliance, health surveillance, immunization tracking, and background checks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm">Apply Template</Button>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">Office Administrator</CardTitle>
                    <CardDescription>
                      Basic background screening, annual training requirements, and standard compliance checks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm">Apply Template</Button>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant={simulationMode ? "default" : "outline"} onClick={() => setSimulationMode(!simulationMode)}>
            <Play className="mr-2 h-4 w-4" />
            {simulationMode ? "Exit Simulation" : "Simulation Mode"}
          </Button>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Policy Rule
          </Button>
        </div>
      </div>

      {simulationMode && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">Simulation Mode Active</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Test policy changes without affecting live data. Changes will not be saved.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSimulationMode(false)}>
              Exit Simulation
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="drug-testing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="matrices">Requirement Matrices</TabsTrigger>
          <TabsTrigger value="drug-testing">Drug Testing</TabsTrigger>
          <TabsTrigger value="background">Background Checks</TabsTrigger>
          <TabsTrigger value="dot">DOT Compliance</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="jurisdictions">Multi-Jurisdiction</TabsTrigger>
        </TabsList>

        <TabsContent value="matrices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Requirement Matrices</CardTitle>
                  <CardDescription>Define requirements by role, location, and agency</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Matrix
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Drug Testing</TableHead>
                    <TableHead>Background</TableHead>
                    <TableHead>DOT</TableHead>
                    <TableHead>Training</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Commercial Driver</TableCell>
                    <TableCell>All States</TableCell>
                    <TableCell>Transportation</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Construction Laborer</TableCell>
                    <TableCell>California</TableCell>
                    <TableCell>Construction</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Optional</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Not Required</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Healthcare Worker</TableCell>
                    <TableCell>All States</TableCell>
                    <TableCell>Healthcare</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Not Required</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Required
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Light Logic - Warning Periods</CardTitle>
              <CardDescription>Configure when compliance status changes from green to amber to red</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Green (Compliant)</Label>
                  <div className="rounded-lg border-2 border-green-500 bg-green-50 p-6 dark:bg-green-950 min-h-[140px] flex flex-col justify-center">
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">More than 60 days</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Until expiration</p>
                    <div className="mt-3 pt-3 border-t border-green-300 dark:border-green-700">
                      <p className="text-xs text-green-600 dark:text-green-400">✓ Fully compliant status</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Amber (Warning)</Label>
                  <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 p-6 dark:bg-yellow-950 min-h-[140px] flex flex-col justify-center">
                    <Input type="number" defaultValue="30" className="mb-2 text-lg font-semibold" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Days before expiration</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Red (Critical)</Label>
                  <div className="rounded-lg border-2 border-red-500 bg-red-50 p-6 dark:bg-red-950 min-h-[140px] flex flex-col justify-center">
                    <Input type="number" defaultValue="7" className="mb-2 text-lg font-semibold" />
                    <p className="text-sm text-red-700 dark:text-red-300">Days before expiration</p>
                  </div>
                </div>
              </div>
              <Button>Save Warning Periods</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jurisdictions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Multi-Jurisdiction Rules</CardTitle>
                  <CardDescription>Configure state-specific compliance requirements</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Jurisdiction Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">California - Background Check Lookback</CardTitle>
                      <Badge>Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">10-Year Criminal History Lookback</p>
                        <p className="text-xs text-muted-foreground">
                          California law requires 10-year lookback instead of standard 7-year
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Ban the Box Compliance</p>
                        <p className="text-xs text-muted-foreground">
                          Delay criminal history questions until after conditional offer
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">New York - Drug Testing Requirements</CardTitle>
                      <Badge>Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Exclude Cannabis Testing (Non-DOT)</p>
                        <p className="text-xs text-muted-foreground">
                          NY law prohibits pre-employment cannabis testing for non-safety-sensitive roles
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Massachusetts - CORI Requirements</CardTitle>
                      <Badge>Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">CORI Acknowledgment Form</p>
                        <p className="text-xs text-muted-foreground">
                          Require signed CORI acknowledgment before background check
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Random Testing Policy */}
        <TabsContent value="drug-testing" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Random Testing Policy</CardTitle>
                  <CardDescription>Configure random drug testing pool and selection rules</CardDescription>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="annual-rate">Annual Testing Rate (%)</Label>
                  <Input id="annual-rate" type="number" defaultValue="50" />
                  <p className="text-xs text-muted-foreground">
                    DOT requires minimum 50% for safety-sensitive positions
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selection-frequency">Selection Frequency</Label>
                  <Select defaultValue="quarterly">
                    <SelectTrigger id="selection-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Exclude Recent Tests</p>
                  <p className="text-xs text-muted-foreground">Don't select employees tested within last 30 days</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Weighted Selection</p>
                  <p className="text-xs text-muted-foreground">Prioritize employees with no recent tests</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset to Default</Button>
              </div>
            </CardContent>
          </Card>

          {/* Post-Accident Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Post-Accident Testing</CardTitle>
              <CardDescription>Automatic test triggers based on incident criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Trigger on Fatality</p>
                  <p className="text-xs text-muted-foreground">Immediately require test for all involved employees</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Trigger on Injury with Medical Treatment</p>
                  <p className="text-xs text-muted-foreground">Require test within 8 hours of incident</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-window">Testing Window (hours)</Label>
                <Input id="test-window" type="number" defaultValue="8" />
                <p className="text-xs text-muted-foreground">Maximum time allowed to complete post-accident test</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Check Policy */}
        <TabsContent value="background" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Background Check Policy</CardTitle>
              <CardDescription>Configure screening requirements and adjudication rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lookback-period">Criminal History Lookback Period (years)</Label>
                <Input id="lookback-period" type="number" defaultValue="7" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Continuous Monitoring</p>
                  <p className="text-xs text-muted-foreground">Receive alerts for new criminal records</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Adjudication</p>
                  <p className="text-xs text-muted-foreground">Automatically approve clear results</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOT Compliance Policy */}
        <TabsContent value="dot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DOT Compliance Policy</CardTitle>
              <CardDescription>Configure DOT-specific requirements and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical-expiry-alert">Medical Certificate Expiry Alert (days before)</Label>
                <Input id="medical-expiry-alert" type="number" defaultValue="30" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Clearinghouse Daily Query</p>
                  <p className="text-xs text-muted-foreground">Automatically check FMCSA Clearinghouse daily</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Block Assignments for Non-Compliant Drivers</p>
                  <p className="text-xs text-muted-foreground">
                    Prevent scheduling drivers without valid medical certificates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Policy */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Policy</CardTitle>
              <CardDescription>Configure training requirements and renewal schedules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="training-renewal">Default Training Renewal Period (months)</Label>
                <Input id="training-renewal" type="number" defaultValue="12" />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Assign Required Training</p>
                  <p className="text-xs text-muted-foreground">Automatically assign training based on job role</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Send Renewal Reminders</p>
                  <p className="text-xs text-muted-foreground">Email employees 30 days before training expires</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

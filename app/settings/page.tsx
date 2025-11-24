"use client"

import { Users, Shield, Database, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RoleSwitcher } from "@/components/auth/role-switcher"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="policies">Policy Driver</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Company Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">Acme Corporation</p>
                </div>
                <div>
                  <Label>Industry</Label>
                  <p className="text-sm text-muted-foreground mt-1">Construction</p>
                </div>
                <div>
                  <Label>Company Size</Label>
                  <p className="text-sm text-muted-foreground mt-1">51-200 employees</p>
                </div>
                <div>
                  <Label>Time Zone</Label>
                  <p className="text-sm text-muted-foreground mt-1">America/New_York (EST)</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Edit Company Info</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your application experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">Show more data in tables and lists</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and role-based access control</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Users className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">john.doe@acme.com</p>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">jane.smith@acme.com</p>
                  </div>
                  <Badge variant="secondary">Compliance Officer</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Mike Johnson</p>
                    <p className="text-sm text-muted-foreground">mike.johnson@acme.com</p>
                  </div>
                  <Badge variant="secondary">User</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Admin</h4>
                    <Badge>Full Access</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Complete access to all features, settings, and data</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Compliance Officer</h4>
                    <Badge variant="secondary">Limited Access</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can view and edit compliance data, approve actions, generate reports
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Driver Configuration</CardTitle>
              <CardDescription>Configure automated compliance rules and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">DOT Random Testing Policy</h4>
                    <p className="text-sm text-muted-foreground">50% annual rate for drug testing</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100">Active</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Testing Rate:</span>
                    <span className="font-medium">50% annually</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pool Size:</span>
                    <span className="font-medium">87 drivers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auto-Selection:</span>
                    <span className="font-medium">Quarterly</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                  Edit Policy
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">Background Check Policy</h4>
                    <p className="text-sm text-muted-foreground">7-year lookback for criminal records</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100">Active</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lookback Period:</span>
                    <span className="font-medium">7 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auto-Adjudication:</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FCRA Compliance:</span>
                    <span className="font-medium">Enforced</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                  Edit Policy
                </Button>
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                <Shield className="mr-2 h-4 w-4" />
                Create New Policy
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geo-Fence Configuration</CardTitle>
              <CardDescription>Manage location-based compliance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Site Check-In Required</h4>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Require employees to check in when entering job sites</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Geo-Fence Radius</h4>
                    <Badge variant="secondary">500 ft</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Distance from site center for automatic check-in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive compliance alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications in the application</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily summary of compliance status</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Management</CardTitle>
              <CardDescription>Connect external services and manage API integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                      <Database className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Workforce</h4>
                      <p className="text-sm text-muted-foreground">Employee data synchronization</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <Link href="/integrations/workforce">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </Link>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Oracle ERP</h4>
                      <p className="text-sm text-muted-foreground">Employee data synchronization</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Tazworks</h4>
                      <p className="text-sm text-muted-foreground">Background check provider</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <Zap className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">CRL Drug Testing</h4>
                      <p className="text-sm text-muted-foreground">Drug testing laboratory</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Connected</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quest Diagnostics</h4>
                      <p className="text-sm text-muted-foreground">Health testing services</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Connected</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <RoleSwitcher />
        </TabsContent>
      </Tabs>
    </div>
  )
}

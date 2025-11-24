"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Send, Mail, MessageSquare, Bell, FileText, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function CommunicationsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string[]>(["email"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communications</h1>
        <p className="text-muted-foreground mt-2">
          Send announcements and notifications to service companies and employees
        </p>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Announcement</CardTitle>
              <CardDescription>Send notifications via email, SMS, or push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Channel Selection */}
              <div className="space-y-3">
                <Label>Delivery Channels</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email"
                      checked={selectedChannel.includes("email")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChannel([...selectedChannel, "email"])
                        } else {
                          setSelectedChannel(selectedChannel.filter((c) => c !== "email"))
                        }
                      }}
                    />
                    <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms"
                      checked={selectedChannel.includes("sms")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChannel([...selectedChannel, "sms"])
                        } else {
                          setSelectedChannel(selectedChannel.filter((c) => c !== "sms"))
                        }
                      }}
                    />
                    <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      SMS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push"
                      checked={selectedChannel.includes("push")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChannel([...selectedChannel, "push"])
                        } else {
                          setSelectedChannel(selectedChannel.filter((c) => c !== "push"))
                        }
                      }}
                    />
                    <Label htmlFor="push" className="flex items-center gap-2 cursor-pointer">
                      <Bell className="w-4 h-4" />
                      Push
                    </Label>
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Service Companies</SelectItem>
                      <SelectItem value="der">DER/Admins Only</SelectItem>
                      <SelectItem value="field-workers">PCS Pass Users</SelectItem>
                      <SelectItem value="specific">Specific Companies</SelectItem>
                      <SelectItem value="custom">Custom List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Enter announcement subject" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Enter your message..." className="min-h-[150px]" />
                <p className="text-xs text-muted-foreground">
                  Use variables: {"{company_name}"}, {"{employee_name}"}, {"{expiration_date}"}
                </p>
              </div>

              {/* Schedule */}
              <div className="flex items-center space-x-2">
                <Switch id="schedule" />
                <Label htmlFor="schedule">Schedule for later</Label>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>View all sent announcements and their delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "comm_1",
                    subject: "Critical: Billing Account Locked",
                    recipient: "FastHaul Transport",
                    channels: ["email", "sms"],
                    priority: "critical",
                    sentAt: "2 hours ago",
                    delivered: 1,
                    read: 1,
                    failed: 0,
                  },
                  {
                    id: "comm_2",
                    subject: "Reminder: DOT Physicals Expiring Soon",
                    recipient: "Premier Freight Inc.",
                    channels: ["email", "push"],
                    priority: "high",
                    sentAt: "6 hours ago",
                    delivered: 1,
                    read: 0,
                    failed: 0,
                  },
                  {
                    id: "comm_3",
                    subject: "Q1 2025 Compliance Summary Available",
                    recipient: "All Service Companies (45)",
                    channels: ["email"],
                    priority: "normal",
                    sentAt: "1 day ago",
                    delivered: 45,
                    read: 32,
                    failed: 0,
                  },
                ].map((comm) => (
                  <div key={comm.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comm.subject}</span>
                          <Badge
                            variant="outline"
                            className={
                              comm.priority === "critical"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : comm.priority === "high"
                                  ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }
                          >
                            {comm.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{comm.recipient}</span>
                          </div>
                          <span>•</span>
                          <span>{comm.sentAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {comm.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {channel === "email" && <Mail className="w-3 h-3 mr-1" />}
                            {channel === "sms" && <MessageSquare className="w-3 h-3 mr-1" />}
                            {channel === "push" && <Bell className="w-3 h-3 mr-1" />}
                            {channel}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{comm.delivered} delivered</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Mail className="w-4 h-4" />
                          <span>{comm.read} read</span>
                        </div>
                        {comm.failed > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>{comm.failed} failed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Pre-built templates for common communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: "Expiration Reminder",
                    description: "Notify about expiring certifications or documents",
                    category: "Compliance",
                  },
                  {
                    name: "Random Test Selection",
                    description: "Inform employees of random drug test selection",
                    category: "Drug Testing",
                  },
                  {
                    name: "Background Check Complete",
                    description: "Notify when background check results are available",
                    category: "Background",
                  },
                  {
                    name: "Training Assignment",
                    description: "Assign required training to employees",
                    category: "Training",
                  },
                  {
                    name: "Billing Reminder",
                    description: "Send invoice or payment reminder",
                    category: "Billing",
                  },
                  {
                    name: "System Maintenance",
                    description: "Notify about scheduled system downtime",
                    category: "System",
                  },
                ].map((template) => (
                  <Card key={template.name}>
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{template.category}</Badge>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Messages</CardTitle>
              <CardDescription>Messages scheduled for future delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    subject: "Monthly Compliance Report",
                    recipient: "All Service Companies",
                    scheduledFor: "2025-02-01 09:00 AM",
                    channels: ["email"],
                  },
                  {
                    subject: "Q1 Training Deadline Reminder",
                    recipient: "All PCS Pass Users",
                    scheduledFor: "2025-01-25 08:00 AM",
                    channels: ["email", "push"],
                  },
                ].map((msg, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{msg.subject}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{msg.recipient}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{msg.scheduledFor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Notifications</CardTitle>
              <CardDescription>Configure which events trigger automatic notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Billing Account Locked", enabled: true, channels: ["email", "sms"] },
                  { name: "Certification Expiring (30 days)", enabled: true, channels: ["email"] },
                  { name: "Random Testing Quota Shortfall", enabled: true, channels: ["email", "push"] },
                  { name: "Geo-Fence Non-Compliance", enabled: true, channels: ["push"] },
                  { name: "Background Check SLA Breach", enabled: true, channels: ["email"] },
                  { name: "Training Assignment Overdue", enabled: false, channels: ["email"] },
                  { name: "DOT Physical Expiring (60 days)", enabled: true, channels: ["email", "sms"] },
                ].map((alert) => (
                  <div key={alert.name} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{alert.name}</div>
                      <div className="flex items-center gap-2">
                        {alert.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Switch checked={alert.enabled} />
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

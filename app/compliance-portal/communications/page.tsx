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
import { Send, Mail, MessageSquare, Bell, Users, CheckCircle2 } from "lucide-react"

export default function CompliancePortalCommunicationsPage() {
  const [selectedChannel, setSelectedChannel] = useState<string[]>(["email"])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communications Hub</h1>
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
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Announcement</CardTitle>
              <CardDescription>Send notifications via email, SMS, or push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Enter announcement subject" />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Enter your message..." className="min-h-[150px]" />
              </div>

              <div className="flex gap-2">
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
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
                    subject: "Critical: Billing Account Locked",
                    recipient: "FastHaul Transport",
                    sentAt: "2 hours ago",
                    delivered: 1,
                    read: 1,
                  },
                  {
                    subject: "Reminder: DOT Physicals Expiring Soon",
                    recipient: "Premier Freight Inc.",
                    sentAt: "6 hours ago",
                    delivered: 1,
                    read: 0,
                  },
                ].map((comm, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{comm.subject}</div>
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
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{comm.delivered} delivered</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Mail className="w-4 h-4" />
                        <span>{comm.read} read</span>
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
                  { name: "Expiration Reminder", category: "Compliance" },
                  { name: "Random Test Selection", category: "Drug Testing" },
                  { name: "Background Check Complete", category: "Background" },
                  { name: "Training Assignment", category: "Training" },
                ].map((template) => (
                  <Card key={template.name}>
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
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
              <div className="text-center py-8 text-muted-foreground">No scheduled messages</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

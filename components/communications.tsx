"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Send, AlertTriangle } from "lucide-react"

export function Communications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Recipients</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Service Companies</SelectItem>
                    <SelectItem value="der">DER/Admins Only</SelectItem>
                    <SelectItem value="specific">Specific Companies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Priority</label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
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
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input placeholder="Enter announcement subject" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea placeholder="Enter your announcement message..." className="min-h-[120px]" />
            </div>
            <div className="flex gap-2">
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Announcement
              </Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                subject: "Critical: Billing Account Locked",
                recipient: "FastHaul Transport",
                type: "Automated",
                priority: "critical",
                timestamp: "2 hours ago",
                status: "Delivered",
              },
              {
                subject: "Reminder: DOT Physicals Expiring Soon",
                recipient: "Premier Freight Inc.",
                type: "Automated",
                priority: "high",
                timestamp: "6 hours ago",
                status: "Delivered",
              },
              {
                subject: "Q1 2025 Compliance Summary Available",
                recipient: "All Service Companies",
                type: "Manual",
                priority: "normal",
                timestamp: "1 day ago",
                status: "Delivered",
              },
              {
                subject: "Random Testing Quota Shortfall Alert",
                recipient: "XYZ Logistics LLC",
                type: "Automated",
                priority: "critical",
                timestamp: "1 day ago",
                status: "Delivered",
              },
              {
                subject: "System Maintenance Scheduled",
                recipient: "All Service Companies",
                type: "Manual",
                priority: "normal",
                timestamp: "3 days ago",
                status: "Delivered",
              },
            ].map((comm, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium text-foreground">{comm.subject}</span>
                      <Badge
                        variant="outline"
                        className={
                          comm.priority === "critical"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : comm.priority === "high"
                              ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }
                      >
                        {comm.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{comm.recipient}</span>
                      </div>
                      <span>•</span>
                      <span>{comm.type}</span>
                      <span>•</span>
                      <span>{comm.timestamp}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {comm.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Automated Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Configure which alerts trigger automatic notifications to service companies:
            </p>
            <div className="space-y-2">
              {[
                { name: "Billing Account Locked", enabled: true },
                { name: "Occupational Health Expiration (30 days)", enabled: true },
                { name: "Random Testing Quota Shortfall", enabled: true },
                { name: "Geo-Fence Non-Compliance", enabled: true },
                { name: "Background Check SLA Breach", enabled: true },
                { name: "Training Assignment Overdue", enabled: false },
                { name: "Certification Expiring (60 days)", enabled: true },
              ].map((alert) => (
                <div key={alert.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-foreground">{alert.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      alert.enabled
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }
                  >
                    {alert.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

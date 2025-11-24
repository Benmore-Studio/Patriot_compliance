"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, CheckCircle, ChevronRight, Trash2 } from "lucide-react"
import { mockWorkerData } from "@/lib/data/mock-worker-data"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(mockWorkerData.notifications)

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "urgent") return notif.type === "warning"
    if (activeTab === "info") return notif.type === "info"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your compliance status</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="h-8 px-3">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Important updates and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="urgent">
                Urgent ({notifications.filter((n) => n.type === "warning").length})
              </TabsTrigger>
              <TabsTrigger value="info">Info ({notifications.filter((n) => n.type === "info").length})</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">No notifications to display</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                      !notif.read ? "bg-muted/50" : ""
                    } ${
                      notif.type === "warning"
                        ? "border-yellow-200 dark:border-yellow-800"
                        : notif.type === "info"
                          ? "border-blue-200 dark:border-blue-800"
                          : "border-green-200 dark:border-green-800"
                    }`}
                  >
                    {notif.type === "warning" && (
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                    )}
                    {notif.type === "info" && <Bell className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />}
                    {notif.type === "success" && (
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{notif.title}</p>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notif.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {notif.actionText && (
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            {notif.actionText} <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                        {!notif.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-destructive"
                          onClick={() => handleDelete(notif.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { DerIqChatWidget } from "@/components/der-iq-chat-widget"
import { QuickActionsFAB } from "./quick-actions-fab"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-card p-6">{children}</main>
      </div>
      <QuickActionsFAB />
      <DerIqChatWidget />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, TestTube, UserCheck, Upload, Calendar, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"

export function QuickActionsFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  // Don't show FAB for PCS Pass users
  if (user?.portalType === "pcs-pass") {
    return null
  }

  const quickActions = [
    { name: "Schedule Drug Test", icon: TestTube, href: "/compliance/drug-testing#schedule" },
    { name: "Order Background Check", icon: UserCheck, href: "/compliance/background#order" },
    { name: "Upload Document", icon: Upload, href: "/employees#upload" },
    { name: "Create Report", icon: FileText, href: "/reports#create" },
    { name: "Schedule Training", icon: Calendar, href: "/compliance/training#schedule" },
  ]

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col-reverse items-end gap-3">
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-2 animate-in slide-in-from-bottom-2">
          {quickActions.map((action, index) => (
            <Button
              key={action.name}
              variant="secondary"
              size="sm"
              className="gap-2 shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => {
                window.location.href = action.href
                setIsOpen(false)
              }}
            >
              <action.icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{action.name}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Main FAB button */}
      <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}

"use client"

import {
  Bell,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  Users,
  TestTube,
  UserCheck,
  Building2,
  Shield,
  Briefcase,
  Eye,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "./breadcrumbs"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"

interface AppHeaderProps {
  onMenuClick: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [portalSwitcherOpen, setPortalSwitcherOpen] = useState(false)
  const { user, logout, switchPortal, switchRole } = useAuth()

  const availablePortals = [
    { id: "service-company", name: "Service Company", icon: Building2, href: "/dashboard" },
    { id: "compliance-company", name: "Compliance Company", icon: Shield, href: "/compliance-portal" },
    { id: "executive", name: "Executive View", icon: Briefcase, href: "/portals/executive" },
    { id: "auditor", name: "Auditor View", icon: Eye, href: "/portals/auditor" },
    { id: "field-worker", name: "PCS Pass", icon: User, href: "/portals/pcs-pass" }, // Renamed from "Field Worker" to "PCS Pass"
  ]

  const currentPortal = availablePortals.find((p) => p.id === user?.portalType) || availablePortals[0]

  const currentRole = user?.userRole === "admin" ? "global-admin" : "site-supervisor"

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen])

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Left side: Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumbs />
      </div>

      {/* Right side: Search, Role Switcher, Portal Switcher, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search... (⌘K)"
            className="w-64 pl-9"
            onClick={() => setSearchOpen(true)}
            readOnly
          />
        </div>

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <UserCog className="h-4 w-4" />
              <span className="hidden md:inline text-sm">
                {currentRole === "global-admin" ? "Global Admin" : "Site Supervisor"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={`cursor-pointer ${currentRole === "global-admin" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => {
                console.log("[v0] Switching to global-admin")
                switchRole("global-admin")
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span className="flex-1">Global Admin</span>
              {currentRole === "global-admin" && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer ${currentRole === "site-supervisor" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => {
                console.log("[v0] Switching to site-supervisor")
                switchRole("site-supervisor")
              }}
            >
              <UserCog className="mr-2 h-4 w-4" />
              <span className="flex-1">Site Supervisor</span>
              {currentRole === "site-supervisor" && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {currentRole === "global-admin"
                ? "Full access to all metrics and settings"
                : "Limited to site operations and action items"}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Portal Switcher */}
        <DropdownMenu open={portalSwitcherOpen} onOpenChange={setPortalSwitcherOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <currentPortal.icon className="h-4 w-4" />
              <span className="hidden md:inline text-sm">{currentPortal.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch Portal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-1">
              {availablePortals.map((portal) => {
                const isActive = portal.id === user?.portalType
                return (
                  <DropdownMenuItem
                    key={portal.id}
                    className={`flex items-center gap-3 cursor-pointer ${isActive ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => {
                      console.log("[v0] Portal clicked:", portal.id)
                      switchPortal(portal.id as User["portalType"])
                      setTimeout(() => {
                        window.location.href = portal.href
                      }, 100)
                    }}
                  >
                    <portal.icon className="h-4 w-4" />
                    <span className="flex-1">{portal.name}</span>
                    {isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </DropdownMenuItem>
                )
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">Critical Alert</p>
                <p className="text-xs text-red-700 dark:text-red-300">5 employees have expired certifications</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Warning</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Random drug test pool needs review</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Info</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">New compliance report available</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{user?.name || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSearchOpen(false)}>
          <div className="flex min-h-screen items-start justify-center p-4 pt-[10vh]">
            <div className="w-full max-w-2xl bg-background rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 border-b border-border p-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search employees, compliance records, reports..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {searchQuery ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Employees</div>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">John Smith</p>
                        <p className="text-xs text-muted-foreground">CDL Driver • Compliant</p>
                      </div>
                    </button>

                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground mt-4">Quick Actions</div>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent">
                      <TestTube className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Schedule Drug Test</span>
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Order Background Check</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Recent Searches</div>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Expired certifications</span>
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Pending drug tests</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-border p-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">↵</kbd> Select
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

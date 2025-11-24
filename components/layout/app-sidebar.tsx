"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  TestTube,
  UserCheck,
  Truck,
  Heart,
  GraduationCap,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRightIcon,
  Briefcase,
  Search,
  FileText,
  BarChart3,
  BookOpen,
  MessageSquare,
  LinkIcon,
  MapPin,
  ShieldIcon,
  Upload,
  Bell,
  User,
  Building2,
  DollarSign,
  Activity,
  TrendingUp,
  Palette,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"
import Image from "next/image"
import { mockCompanies } from "@/lib/data/mock-companies"

const serviceCompanyNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employee Roster", href: "/employees", icon: Users },
  {
    name: "Compliance",
    icon: Shield,
    submenu: [
      { name: "Drug Testing", href: "/compliance/drug-testing", icon: TestTube },
      { name: "Background Checks", href: "/compliance/background", icon: UserCheck },
      { name: "DOT Compliance", href: "/compliance/dot", icon: Truck },
      { name: "Occupational Health", href: "/compliance/health", icon: Heart },
      { name: "Training & Certs", href: "/compliance/training", icon: GraduationCap },
      { name: "MIS Express", href: "/reports/mis-express", icon: BarChart3 },
    ],
  },
  { name: "HIPAA Privacy", href: "/compliance/hipaa-privacy", icon: ShieldIcon },
  { name: "Onboarding & Requirements", href: "/onboarding/requirements", icon: BookOpen },
  { name: "Policy Link", href: "/policy-driver", icon: LinkIcon },
  { name: "Geo-Fencing", href: "/geo-fencing", icon: MapPin },
  { name: "Communications", href: "/communications", icon: MessageSquare },
  { name: "Billing", href: "/billing", icon: DollarSign },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  {
    name: "Settings",
    icon: Settings,
    submenu: [{ name: "General Settings", href: "/settings", icon: Settings }],
  },
]

const complianceCompanyNavigation = [
  { name: "Dashboard", href: "/compliance-portal", icon: LayoutDashboard },
  ...mockCompanies.map((company) => ({
    name: company.name,
    icon: Building2,
    submenu: [
      { name: "Drug Testing", href: `/compliance-portal/${company.id}/drug-testing`, icon: TestTube },
      { name: "Certificates & Training", href: `/compliance-portal/${company.id}/training`, icon: GraduationCap },
      { name: "Billing", href: `/compliance-portal/${company.id}/billing`, icon: DollarSign },
      { name: "Background Checks", href: `/compliance-portal/${company.id}/background`, icon: UserCheck },
      { name: "DOT Compliance", href: `/compliance-portal/${company.id}/dot`, icon: Truck },
      { name: "MIS Reports", href: `/compliance-portal/${company.id}/reports`, icon: BarChart3 },
      { name: "Employee Roster", href: `/compliance-portal/${company.id}/employees`, icon: Users },
    ],
  })),
  { name: "Settings", href: "/settings", icon: Settings },
]

const fieldWorkerNavigation = [
  { name: "My Compliance", href: "/portals/pcs-pass", icon: Shield },
  { name: "Documents", href: "/portals/pcs-pass/documents", icon: Upload },
  { name: "Check-In", href: "/portals/pcs-pass/check-in", icon: MapPin },
  { name: "Notifications", href: "/portals/pcs-pass/notifications", icon: Bell },
  { name: "Profile", href: "/portals/pcs-pass/profile", icon: User },
]

const auditorNavigation = [
  { name: "Dashboard", href: "/portals/auditor", icon: LayoutDashboard },
  {
    name: "Compliance Review",
    icon: Shield,
    submenu: [
      { name: "Drug Testing", href: "/compliance/drug-testing", icon: TestTube },
      { name: "Background Checks", href: "/compliance/background", icon: UserCheck },
      { name: "DOT Compliance", href: "/compliance/dot", icon: Truck },
      { name: "Occupational Health", href: "/compliance/health", icon: Heart },
      { name: "Training & Certs", href: "/compliance/training", icon: GraduationCap },
    ],
  },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Audit Logs", href: "/audit-logs", icon: FileText },
  { name: "Export Data", href: "/reports#export", icon: FileText },
]

const executiveNavigation = [
  { name: "Executive Dashboard", href: "/portals/executive", icon: LayoutDashboard },
  { name: "Analytics", href: "/reports", icon: TrendingUp },
  { name: "Compliance Overview", href: "/compliance", icon: Shield },
  { name: "Performance Metrics", href: "/reports#metrics", icon: Activity },
  {
    name: "Portal Access",
    icon: Briefcase,
    submenu: [
      { name: "Service Companies", href: "/compliance-portal/portfolio", icon: Building2 },
      { name: "Compliance Officer", href: "/portals/compliance-officer", icon: Shield },
      { name: "Auditor View", href: "/portals/auditor", icon: Search },
    ],
  },
]

interface AppSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function AppSidebar({ isOpen, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Compliance"])
  const [darkMode, setDarkMode] = useState(false)
  const [chevronTheme, setChevronTheme] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }
    const isChevron = localStorage.getItem("chevronTheme") === "true"
    setChevronTheme(isChevron)
    if (isChevron) {
      document.documentElement.classList.add("chevron-theme")
    }
  }, [])

  useEffect(() => {
    console.log("[v0] Sidebar - Current user portal type:", user?.portalType)
  }, [user?.portalType])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleChevronTheme = () => {
    const newChevronTheme = !chevronTheme
    setChevronTheme(newChevronTheme)
    localStorage.setItem("chevronTheme", String(newChevronTheme))
    if (newChevronTheme) {
      document.documentElement.classList.add("chevron-theme")
    } else {
      document.documentElement.classList.remove("chevron-theme")
    }
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const getNavigationForPortal = () => {
    if (!user) {
      console.log("[v0] No user, returning service company navigation")
      return serviceCompanyNavigation
    }

    console.log("[v0] Getting navigation for portal type:", user.portalType)

    switch (user.portalType) {
      case "service-company":
        return serviceCompanyNavigation
      case "compliance-company":
        return complianceCompanyNavigation
      case "field-worker":
        return fieldWorkerNavigation
      case "auditor":
        return auditorNavigation
      case "executive":
        return executiveNavigation
      default:
        console.log("[v0] Unknown portal type, returning service company navigation")
        return serviceCompanyNavigation
    }
  }

  const navigation = getNavigationForPortal()

  useEffect(() => {
    console.log(
      "[v0] Sidebar navigation items:",
      navigation.map((n) => n.name),
    )
  }, [navigation])

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {isOpen ? (
          <>
            <div className="flex items-center gap-2">
              {chevronTheme ? (
                <Image
                  src="/images/chevron-logo.svg"
                  alt="Chevron"
                  width={70}
                  height={30}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src = "/images/chevron-logo.png"
                  }}
                />
              ) : (
                <>
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold text-foreground">
                    {user?.portalType === "field-worker" ? "PCS Pass" : "Patriot CS"}
                  </span>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => {
          if ("submenu" in item) {
            const isExpanded = expandedItems.includes(item.name)
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    {isOpen && <span className="truncate">{item.name}</span>}
                  </div>
                  {isOpen &&
                    (isExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    ))}
                </button>
                {isExpanded && isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                    {item.submenu.map((subItem) => {
                      const isActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                          }`}
                        >
                          <subItem.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{subItem.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-3">
        <div className={`flex items-center gap-3 rounded-lg p-2 hover:bg-accent ${isOpen ? "" : "justify-center"}`}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {user?.portalType === "service-company"
                  ? "Service Co."
                  : user?.portalType === "compliance-company"
                    ? "Compliance Co."
                    : user?.portalType === "field-worker"
                      ? "PCS Pass"
                      : user?.portalType === "auditor"
                        ? "Auditor"
                        : "Executive"}
              </Badge>
            </div>
          )}
        </div>
        {isOpen && (
          <>
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="mt-2 w-full justify-start gap-2">
              {darkMode ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
              <span className="truncate">Dark Mode</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleChevronTheme} className="mt-1 w-full justify-start gap-2">
              <Palette className="h-4 w-4 shrink-0" />
              <span className="truncate">Chevron Theme</span>
            </Button>
          </>
        )}
      </div>
    </aside>
  )
}

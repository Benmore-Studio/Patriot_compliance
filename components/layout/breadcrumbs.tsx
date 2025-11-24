"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Breadcrumbs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const companyId = searchParams.get("company")

  const showBackButton = returnTo === "compliance-portal"

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return { name, href }
    }),
  ]

  if (showBackButton && breadcrumbs.length > 1) {
    breadcrumbs.splice(1, 0, {
      name: "Compliance Portal",
      href: "/compliance-portal",
    })
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      {showBackButton && (
        <Link href="/compliance-portal">
          <Button variant="ghost" size="sm" className="gap-2 h-8 px-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Portal</span>
          </Button>
        </Link>
      )}
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">{crumb.name}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {index === 0 ? <Home className="h-4 w-4" /> : crumb.name}
            </Link>
          )}
        </div>
      ))}
      {companyId && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Company {companyId}</span>
        </>
      )}
    </nav>
  )
}

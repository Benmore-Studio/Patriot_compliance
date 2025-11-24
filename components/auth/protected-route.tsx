"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import type { Role } from "@/lib/auth/rbac"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
  requireAuth?: boolean
}

export function ProtectedRoute({ children, allowedRoles, requireAuth = true }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    // Check authentication
    if (requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`)
      return
    }

    // Check role permissions
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/403")
      return
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, requireAuth, router, pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Check role permissions
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

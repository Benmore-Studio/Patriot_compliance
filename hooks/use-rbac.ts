"use client"

import { type Role, type Permission, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/rbac/permissions"

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@patriotcs.com",
  role: "der" as Role,
}

export function useRBAC() {
  // TODO: Get user from auth context/session
  const user = mockUser

  return {
    user,
    role: user.role,
    can: (permission: Permission) => hasPermission(user.role, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(user.role, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(user.role, permissions),
  }
}

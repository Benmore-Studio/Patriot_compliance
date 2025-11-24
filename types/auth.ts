import type { Role } from "@/lib/auth/rbac"

export interface User {
  id: string
  email: string
  name: string
  role: Role
  companyId?: string
  avatar?: string
  phone?: string
  mfaEnabled: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface Session {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface MFAChallenge {
  code: string
  sessionId: string
}

export interface SSOProvider {
  id: string
  name: string
  type: "okta" | "azure" | "google"
  enabled: boolean
}

export interface ShareableLink {
  id: string
  token: string
  resourceType: "employee" | "employees" | "drug-test" | "background-check" | "dot-driver" | "report" | "invoice"
  resourceId: string | string[]
  createdBy: string
  createdAt: string
  expiresAt: string
  passwordHash: string
  oneTimeUse: boolean
  accessCount: number
  maxAccessCount?: number
  watermark?: boolean
  metadata?: {
    title?: string
    description?: string
    filters?: Record<string, any>
  }
}

export interface ShareLinkAccess {
  id: string
  linkId: string
  accessedAt: string
  ipAddress: string
  userAgent: string
  success: boolean
}

export interface CreateShareLinkRequest {
  resourceType: ShareableLink["resourceType"]
  resourceId: string | string[]
  password: string
  expiresIn: "1h" | "1d" | "1w" | "custom"
  customExpiration?: string
  oneTimeUse?: boolean
  watermark?: boolean
  metadata?: ShareableLink["metadata"]
}

export interface AccessShareLinkRequest {
  token: string
  password: string
}

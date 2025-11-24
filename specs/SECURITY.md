# Patriot Compliance Systems - Security & RBAC Documentation

**Version:** 1.0 | **Last Updated:** November 2025 | **Classification:** Internal Engineering

---

## Table of Contents

1. [RBAC System Overview](#1-rbac-system-overview)
2. [Complete Permission Matrix](#2-complete-permission-matrix)
3. [Role Definitions](#3-role-definitions)
4. [Production-Ready Security Patterns](#4-production-ready-security-patterns)
5. [API Authentication Middleware](#5-api-authentication-middleware)
6. [Tenant Isolation](#6-tenant-isolation)
7. [Audit Logging](#7-audit-logging)
8. [Compliance Requirements](#8-compliance-requirements)

---

## 1. RBAC System Overview

### 1.1 Architecture

The RBAC system follows a role-based access control model where:

- **Permissions** are atomic actions (e.g., `employees:read`, `drug-testing:write`)
- **Roles** are collections of permissions assigned to users
- **Resources** are protected entities (employees, drug tests, background checks, etc.)

```
┌─────────────────────────────────────────────────────────────────┐
│                      RBAC ENFORCEMENT LAYERS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: API Gateway / Middleware                               │
│  ├── JWT Verification (signature, expiration, claims)            │
│  ├── Tenant Resolution (from JWT or header)                      │
│  └── Rate Limiting (per tenant, per endpoint)                    │
│                                                                  │
│  Layer 2: Route Handler / Controller                             │
│  ├── Role Check (user.role in allowedRoles)                      │
│  ├── Permission Check (hasPermission(role, permission))          │
│  └── Resource Ownership Check (for :own permissions)             │
│                                                                  │
│  Layer 3: Database / Query Level                                 │
│  ├── Tenant Filter (WHERE tenant_id = ?)                         │
│  ├── Row-Level Security (PostgreSQL RLS)                         │
│  └── Field-Level Encryption (SSN, DOB)                           │
│                                                                  │
│  Layer 4: Response / Presentation                                │
│  ├── Field Masking (based on role)                               │
│  ├── PII Redaction (SSN → ***-**-1234)                           │
│  └── Audit Log Entry                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Permission Naming Convention

```
{resource}:{action}

Resources: dashboard, employees, drug-testing, background, dot, health,
           training, billing, policy-driver, audit-logs, settings

Actions:   read   - View data
           write  - Create/update data
           delete - Remove data
           export - Download/export data
           own    - Access only own records (self-service)
```

---

## 2. Complete Permission Matrix

### 2.1 Full 42-Permission × 7-Role Matrix

| Permission | super_admin | system_admin | der | safety_manager | compliance_officer | field_worker | auditor |
|:-----------|:-----------:|:------------:|:---:|:--------------:|:------------------:|:------------:|:-------:|
| **Dashboard** |
| `dashboard:read` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `dashboard:write` | ✓ | ✓ | ✓ | - | - | - | - |
| **Employees** |
| `employees:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `employees:write` | ✓ | ✓ | ✓ | ✓ | - | - | - |
| `employees:delete` | ✓ | ✓ | - | - | - | - | - |
| `employees:export` | ✓ | ✓ | ✓ | ✓ | - | - | - |
| `employees:own` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Drug Testing** |
| `drug-testing:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `drug-testing:write` | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| `drug-testing:delete` | ✓ | ✓ | - | - | - | - | - |
| `drug-testing:export` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `drug-testing:own` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Background Checks** |
| `background:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `background:write` | ✓ | ✓ | ✓ | - | ✓ | - | - |
| `background:delete` | ✓ | ✓ | - | - | - | - | - |
| `background:export` | ✓ | ✓ | ✓ | - | ✓ | - | - |
| `background:own` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **DOT Compliance** |
| `dot:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `dot:write` | ✓ | ✓ | ✓ | - | ✓ | - | - |
| `dot:delete` | ✓ | ✓ | - | - | - | - | - |
| `dot:export` | ✓ | ✓ | ✓ | - | ✓ | - | ✓ |
| `dot:own` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Occupational Health** |
| `health:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `health:write` | ✓ | ✓ | ✓ | ✓ | - | - | - |
| `health:delete` | ✓ | ✓ | - | - | - | - | - |
| `health:export` | ✓ | ✓ | ✓ | ✓ | - | - | ✓ |
| `health:own` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Training & Certifications** |
| `training:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `training:write` | ✓ | ✓ | ✓ | ✓ | - | - | - |
| `training:delete` | ✓ | ✓ | - | - | - | - | - |
| `training:export` | ✓ | ✓ | ✓ | ✓ | - | - | ✓ |
| `training:own` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Billing** |
| `billing:read` | ✓ | ✓ | ✓ | - | - | - | - |
| `billing:write` | ✓ | ✓ | - | - | - | - | - |
| `billing:delete` | ✓ | - | - | - | - | - | - |
| `billing:export` | ✓ | - | - | - | - | - | - |
| **Policy Driver** |
| `policy-driver:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| `policy-driver:write` | ✓ | ✓ | ✓ | - | - | - | - |
| **Audit Logs** |
| `audit-logs:read` | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| **Settings** |
| `settings:read` | ✓ | ✓ | ✓ | - | - | - | - |
| `settings:write` | ✓ | ✓ | - | - | - | - | - |

**Legend:**
- ✓ = Full access
- `-` = No access

### 2.2 Permission Count by Role

| Role | Total Permissions | Read | Write | Delete | Export | Own |
|:-----|:-----------------:|:----:|:-----:|:------:|:------:|:---:|
| super_admin | 42 | 12 | 10 | 7 | 7 | 6 |
| system_admin | 39 | 12 | 9 | 5 | 7 | 6 |
| der | 32 | 11 | 8 | 0 | 6 | 6 |
| safety_manager | 23 | 9 | 6 | 0 | 4 | 6 |
| compliance_officer | 19 | 9 | 4 | 0 | 4 | 6 |
| field_worker | 7 | 1 | 0 | 0 | 0 | 6 |
| auditor | 16 | 10 | 0 | 0 | 3 | 6 |

---

## 3. Role Definitions

### 3.1 Role Hierarchy

```
super_admin (PCS Internal)
├── system_admin (Tenant Admin)
│   ├── der (Designated Employer Representative)
│   │   ├── safety_manager
│   │   │   └── field_worker
│   │   └── compliance_officer
│   └── auditor (Read-only)
```

### 3.2 Detailed Role Specifications

#### SUPER_ADMIN (PCS Internal Only)

**Purpose:** Platform administration, cross-tenant operations, system configuration

**Portal Access:** All portals

**Key Capabilities:**
- Cross-tenant data access (for support/debugging)
- Tenant provisioning and management
- System-wide policy templates
- Platform billing overrides
- All delete operations

**Security Requirements:**
- Hardware MFA required
- IP allowlisting recommended
- All actions logged to separate audit trail
- Session timeout: 15 minutes

```typescript
const SUPER_ADMIN_RESTRICTIONS = {
  mfaRequired: true,
  mfaType: 'hardware', // FIDO2/WebAuthn
  sessionTimeout: 15 * 60 * 1000, // 15 minutes
  ipAllowlist: ['10.0.0.0/8', '192.168.0.0/16'], // Internal network
  crossTenantAccess: true,
  auditLevel: 'verbose'
}
```

---

#### SYSTEM_ADMIN (Tenant Administrator)

**Purpose:** Full company administration within tenant boundary

**Portal Access:** Service Company Portal, Executive Portal

**Key Capabilities:**
- User management (CRUD)
- Company settings and integrations
- Policy configuration
- Billing management
- Most delete operations (except billing records)

**Security Requirements:**
- MFA required (TOTP or SMS)
- Session timeout: 30 minutes
- Audit logging on all mutations

```typescript
const SYSTEM_ADMIN_RESTRICTIONS = {
  mfaRequired: true,
  mfaType: 'totp', // Google Authenticator, Authy
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  tenantBound: true, // Cannot access other tenants
  canManageUsers: true
}
```

---

#### DER (Designated Employer Representative)

**Purpose:** Primary compliance administrator, MRO reviews, adjudication decisions

**Portal Access:** Service Company Portal, Executive Portal

**Key Capabilities:**
- Employee management (CRUD except delete)
- Compliance module management (CRUD except delete)
- MRO review workflow
- Adjudication decisions
- Policy configuration
- Report generation

**Security Requirements:**
- MFA recommended
- Session timeout: 1 hour
- DOT-specific training attestation required

```typescript
const DER_RESTRICTIONS = {
  mfaRequired: false, // Recommended but not required
  mfaRecommended: true,
  sessionTimeout: 60 * 60 * 1000, // 1 hour
  canAdjudicate: true,
  canMROReview: true,
  dotComplianceRequired: true // Must complete DOT training
}
```

---

#### SAFETY_MANAGER

**Purpose:** Day-to-day compliance operations, employee management

**Portal Access:** Service Company Portal

**Key Capabilities:**
- Employee management (CRUD except delete)
- Drug testing management (read + write)
- Health records management (read + write)
- Training management (read + write)
- Report viewing (read-only)

**Security Requirements:**
- Standard authentication
- Session timeout: 2 hours

---

#### COMPLIANCE_OFFICER

**Purpose:** Cross-company compliance oversight (MSP role)

**Portal Access:** Compliance Portal, Service Company Portal (read-only)

**Key Capabilities:**
- View all companies in portfolio
- Drug testing review
- Background check adjudication
- DOT compliance monitoring
- Policy monitoring (read-only)

**Security Requirements:**
- MFA required (handles multiple companies)
- Session timeout: 1 hour
- BAA (Business Associate Agreement) required

---

#### FIELD_WORKER (PCS Pass)

**Purpose:** Self-service for field employees

**Portal Access:** PCS Pass Portal only

**Key Capabilities:**
- View own compliance records
- Upload own documents
- Geo check-in
- View own notifications

**Security Requirements:**
- ID.me identity proofing recommended
- Session timeout: 24 hours (mobile)
- Can only access employeeId = self

```typescript
const FIELD_WORKER_RESTRICTIONS = {
  ownRecordsOnly: true, // CRITICAL: Can only access own data
  portalAccess: ['pcs-pass'],
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours for mobile
  identityProofing: 'id.me' // Recommended
}
```

---

#### AUDITOR

**Purpose:** External audit access, evidence collection

**Portal Access:** Auditor Portal

**Key Capabilities:**
- Read-only access to all compliance data
- Export compliance evidence
- View audit logs
- Generate audit reports

**Security Requirements:**
- Time-limited access tokens
- All access logged
- IP logging required
- SSN/DOB masking enforced

```typescript
const AUDITOR_RESTRICTIONS = {
  readOnly: true,
  piiMasking: true, // SSN: ***-**-1234, DOB: ****-**-15
  accessExpiration: true, // Token expires after audit period
  exportWatermarking: true, // PDFs watermarked with auditor ID
  ipLogging: true
}
```

---

## 4. Production-Ready Security Patterns

### 4.1 Password Hashing (Production)

```typescript
// lib/auth/password.ts
import bcrypt from 'bcryptjs'

const BCRYPT_ROUNDS = 12 // ~300ms on modern hardware

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return { valid: errors.length === 0, errors }
}
```

### 4.2 JWT Token Structure

```typescript
// lib/auth/jwt.ts
import { SignJWT, jwtVerify } from 'jose'

interface JWTPayload {
  sub: string           // User ID
  email: string         // User email
  role: Role            // User role
  tenantId: string      // Tenant ID (REQUIRED)
  permissions: string[] // Cached permissions
  iat: number           // Issued at
  exp: number           // Expiration
  jti: string           // JWT ID (for revocation)
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const JWT_ISSUER = 'pcs.patriotcompliance.com'
const JWT_AUDIENCE = 'pcs-api'

export async function createAccessToken(
  user: User,
  tenantId: string
): Promise<string> {
  const permissions = rolePermissions[user.role]

  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    tenantId,
    permissions
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime('15m') // Short-lived access tokens
    .setJti(crypto.randomUUID())
    .sign(JWT_SECRET)
}

export async function createRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setExpirationTime('7d') // Long-lived refresh tokens
    .setJti(crypto.randomUUID())
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  })
  return payload as JWTPayload
}
```

### 4.3 Session Management

```typescript
// lib/auth/session.ts

interface Session {
  userId: string
  tenantId: string
  role: Role
  createdAt: Date
  expiresAt: Date
  ipAddress: string
  userAgent: string
  mfaVerified: boolean
}

// Store sessions in Redis with tenant-scoped keys
const SESSION_PREFIX = 'session:'
const SESSION_TTL = 24 * 60 * 60 // 24 hours

export async function createSession(
  user: User,
  tenantId: string,
  request: Request
): Promise<string> {
  const sessionId = crypto.randomUUID()
  const session: Session = {
    userId: user.id,
    tenantId,
    role: user.role,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_TTL * 1000),
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    mfaVerified: false
  }

  await redis.setex(
    `${SESSION_PREFIX}${sessionId}`,
    SESSION_TTL,
    JSON.stringify(session)
  )

  return sessionId
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const data = await redis.get(`${SESSION_PREFIX}${sessionId}`)
  return data ? JSON.parse(data) : null
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await redis.del(`${SESSION_PREFIX}${sessionId}`)
}

// Invalidate all sessions for a user (e.g., on password change)
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  const keys = await redis.keys(`${SESSION_PREFIX}*`)
  for (const key of keys) {
    const session = await redis.get(key)
    if (session && JSON.parse(session).userId === userId) {
      await redis.del(key)
    }
  }
}
```

---

## 5. API Authentication Middleware

### 5.1 Next.js Middleware (Production Pattern)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

const PUBLIC_ROUTES = [
  '/login',
  '/mfa-challenge',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/webhooks/tazworks',
  '/api/webhooks/drug-testing'
]

const ROLE_PORTAL_ACCESS: Record<string, string[]> = {
  super_admin: ['/', '/compliance-portal', '/portals/pcs-pass', '/portals/executive', '/portals/auditor'],
  system_admin: ['/', '/portals/executive'],
  der: ['/', '/portals/executive'],
  safety_manager: ['/'],
  compliance_officer: ['/compliance-portal', '/'],
  field_worker: ['/portals/pcs-pass'],
  auditor: ['/portals/auditor']
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get token from cookie or Authorization header
  const token = request.cookies.get('access_token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return redirectToLogin(request)
  }

  try {
    const payload = await verifyToken(token)

    // Check portal access
    const portal = getPortalFromPath(pathname)
    const allowedPortals = ROLE_PORTAL_ACCESS[payload.role] || []

    if (!allowedPortals.some(p => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    // Add user info to request headers for API routes
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.sub)
    response.headers.set('x-tenant-id', payload.tenantId)
    response.headers.set('x-user-role', payload.role)

    return response
  } catch (error) {
    // Token invalid or expired
    return redirectToLogin(request)
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

function getPortalFromPath(pathname: string): string {
  if (pathname.startsWith('/compliance-portal')) return '/compliance-portal'
  if (pathname.startsWith('/portals/pcs-pass')) return '/portals/pcs-pass'
  if (pathname.startsWith('/portals/executive')) return '/portals/executive'
  if (pathname.startsWith('/portals/auditor')) return '/portals/auditor'
  return '/'
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
```

### 5.2 API Route Handler Wrapper

```typescript
// lib/api/with-auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { hasPermission, Permission, Role } from '@/lib/rbac/permissions'

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
    role: Role
    tenantId: string
    permissions: Permission[]
  }
}

type RouteHandler = (
  request: AuthenticatedRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>

interface WithAuthOptions {
  permissions?: Permission[]
  anyPermission?: Permission[]
  allowedRoles?: Role[]
}

export function withAuth(handler: RouteHandler, options: WithAuthOptions = {}) {
  return async (
    request: NextRequest,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      // Get token
      const token = request.headers.get('Authorization')?.replace('Bearer ', '')

      if (!token) {
        return NextResponse.json(
          { error: { code: 'UNAUTHORIZED', message: 'Missing authentication token' } },
          { status: 401 }
        )
      }

      // Verify token
      const payload = await verifyToken(token)

      // Check role restriction
      if (options.allowedRoles && !options.allowedRoles.includes(payload.role)) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'Insufficient role' } },
          { status: 403 }
        )
      }

      // Check all required permissions
      if (options.permissions) {
        const hasAll = options.permissions.every(p => hasPermission(payload.role, p))
        if (!hasAll) {
          return NextResponse.json(
            { error: { code: 'FORBIDDEN', message: 'Missing required permissions' } },
            { status: 403 }
          )
        }
      }

      // Check any permission
      if (options.anyPermission) {
        const hasAny = options.anyPermission.some(p => hasPermission(payload.role, p))
        if (!hasAny) {
          return NextResponse.json(
            { error: { code: 'FORBIDDEN', message: 'Missing required permissions' } },
            { status: 403 }
          )
        }
      }

      // Attach user to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId,
        permissions: payload.permissions
      }

      return handler(authenticatedRequest, context)
    } catch (error) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
        { status: 401 }
      )
    }
  }
}

// Usage example:
// export const GET = withAuth(async (request) => {
//   const employees = await prisma.employee.findMany({
//     where: { tenantId: request.user.tenantId }
//   })
//   return NextResponse.json({ data: employees })
// }, { permissions: ['employees:read'] })
```

---

## 6. Tenant Isolation

### 6.1 Database Query Patterns

```typescript
// lib/db/tenant-client.ts
import { PrismaClient } from '@prisma/client'

// NEVER use the base prisma client directly
// Always use getTenantClient(tenantId)

export function getTenantClient(tenantId: string) {
  const prisma = new PrismaClient()

  // Extend with tenant filtering
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, tenantId }
          return query(args)
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, tenantId }
          return query(args)
        },
        async findUnique({ args, query }) {
          // For findUnique, we need to verify after fetch
          const result = await query(args)
          if (result && result.tenantId !== tenantId) {
            return null // Hide cross-tenant data
          }
          return result
        },
        async create({ args, query }) {
          args.data = { ...args.data, tenantId }
          return query(args)
        },
        async update({ args, query }) {
          // Ensure we only update our tenant's data
          args.where = { ...args.where, tenantId }
          return query(args)
        },
        async delete({ args, query }) {
          args.where = { ...args.where, tenantId }
          return query(args)
        }
      }
    }
  })
}

// Example usage in API route:
export const GET = withAuth(async (request) => {
  const db = getTenantClient(request.user.tenantId)

  const employees = await db.employee.findMany({
    // No need to add tenantId filter - automatically applied
    where: { status: 'ACTIVE' },
    orderBy: { lastName: 'asc' }
  })

  return NextResponse.json({ data: employees })
}, { permissions: ['employees:read'] })
```

### 6.2 PostgreSQL Row-Level Security (Production)

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE drug_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dot_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY tenant_isolation ON employees
  USING (tenant_id = current_setting('app.tenant_id')::TEXT);

CREATE POLICY tenant_isolation ON drug_tests
  USING (tenant_id = current_setting('app.tenant_id')::TEXT);

-- Similar policies for other tables...

-- Set tenant context before queries
-- This should be done at the connection level
SET app.tenant_id = 'tenant_123';
```

---

## 7. Audit Logging

### 7.1 Audit Log Schema

```typescript
// Audit log entry structure
interface AuditLogEntry {
  id: string
  tenantId: string
  userId: string
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'LOGIN' | 'LOGOUT'
  resource: string        // e.g., 'employees', 'drug_tests'
  resourceId: string | null
  details: {
    before?: Record<string, unknown>  // Previous state (for updates)
    after?: Record<string, unknown>   // New state
    query?: string                    // For reads/exports
    count?: number                    // For bulk operations
  }
  ipAddress: string
  userAgent: string
  result: 'SUCCESS' | 'FAILURE'
  errorMessage?: string
  duration: number        // Request duration in ms
  createdAt: Date
}
```

### 7.2 Automatic Audit Logging

```typescript
// lib/audit/logger.ts
import { prisma } from '@/lib/db'

export async function logAuditEvent(
  tenantId: string,
  userId: string,
  action: string,
  resource: string,
  resourceId: string | null,
  details: Record<string, unknown>,
  request: Request,
  result: 'SUCCESS' | 'FAILURE',
  errorMessage?: string
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      result,
      errorMessage,
      createdAt: new Date()
    }
  })
}

// Decorator for automatic logging
export function withAuditLogging<T>(
  action: string,
  resource: string,
  handler: (request: AuthenticatedRequest) => Promise<{ data: T, resourceId?: string }>
) {
  return async (request: AuthenticatedRequest): Promise<NextResponse> => {
    const startTime = Date.now()

    try {
      const { data, resourceId } = await handler(request)

      await logAuditEvent(
        request.user.tenantId,
        request.user.id,
        action,
        resource,
        resourceId || null,
        { responseSize: JSON.stringify(data).length },
        request,
        'SUCCESS'
      )

      return NextResponse.json({ success: true, data })
    } catch (error) {
      await logAuditEvent(
        request.user.tenantId,
        request.user.id,
        action,
        resource,
        null,
        { error: error instanceof Error ? error.message : 'Unknown error' },
        request,
        'FAILURE',
        error instanceof Error ? error.message : undefined
      )

      throw error
    }
  }
}
```

---

## 8. Compliance Requirements

### 8.1 HIPAA Requirements

| Requirement | Implementation |
|:------------|:---------------|
| Access Controls | RBAC with role-based permissions |
| Audit Controls | All PHI access logged with timestamps |
| Integrity Controls | Field-level encryption, checksums |
| Transmission Security | TLS 1.3, end-to-end encryption |
| Unique User Identification | UUID-based user IDs, no shared accounts |
| Automatic Logoff | Session timeout per role (15min-24hr) |
| Encryption | AES-256 at rest, TLS 1.3 in transit |

### 8.2 SOC 2 Requirements

| Trust Service Criteria | Implementation |
|:-----------------------|:---------------|
| Security | MFA, RBAC, network isolation, pen testing |
| Availability | 99.9% SLA, multi-AZ deployment, backups |
| Processing Integrity | Input validation, idempotency, audit logs |
| Confidentiality | Encryption, access controls, data masking |
| Privacy | Consent management, data retention policies |

### 8.3 PCI DSS (if handling payments)

| Requirement | Implementation |
|:------------|:---------------|
| Cardholder Data Protection | Stripe tokenization (no card data stored) |
| Access Control | Only `billing:*` permissions access Stripe data |
| Audit Trails | All billing operations logged |
| Network Security | WAF, DDoS protection, TLS |

---

## Security Checklist for Production

- [ ] Replace `btoa()` password hashing with bcrypt (cost factor 12)
- [ ] Implement JWT with short-lived access tokens (15min) + refresh tokens (7 days)
- [ ] Enable middleware.ts route protection
- [ ] Add tenant filtering to ALL database queries
- [ ] Implement PostgreSQL Row-Level Security
- [ ] Set up audit logging for all data access
- [ ] Configure rate limiting per tenant/endpoint
- [ ] Enable MFA for privileged roles (super_admin, system_admin)
- [ ] Implement session management with Redis
- [ ] Add CSRF protection for all mutations
- [ ] Configure secure cookie attributes (httpOnly, secure, sameSite)
- [ ] Set up WAF rules (SQL injection, XSS prevention)
- [ ] Schedule security audit (penetration testing)
- [ ] Document incident response procedures

---

**Document Version:** 1.0
**Last Updated:** November 2025
**Security Contact:** security@patriotcompliance.com

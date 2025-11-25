# Hybrid Microservices Architecture for FedRAMP Moderate

**Document Version:** 1.0
**Created:** 2025-11-24
**Status:** Design Phase
**Architecture Pattern:** Hybrid (Core Monolith + Extracted Services)

---

## Executive Summary

This document defines the hybrid microservices architecture for Patriot Compliance Systems, balancing FedRAMP compliance requirements with operational simplicity. The hybrid approach extracts **4 critical services** from the core monolith to simplify compliance boundaries, improve security isolation, and enable independent scaling.

**Why Hybrid vs Full Microservices?**
- **Faster FedRAMP timeline:** Fewer system boundaries = simpler SSP (System Security Plan)
- **Lower operational complexity:** 4 services vs 15+ services = easier to manage
- **Pragmatic isolation:** Separate auth, integrations, audit for security without over-engineering
- **Team size:** Small team can maintain 4 services; 15+ requires dedicated DevOps

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Service Definitions](#service-definitions)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Service-to-Service Communication](#service-communication)
5. [FedRAMP Compliance Boundaries](#compliance-boundaries)
6. [Deployment Architecture](#deployment-architecture)
7. [Technology Stack](#technology-stack)
8. [Scaling Strategy](#scaling-strategy)

---

## Architecture Overview {#architecture-overview}

```
HYBRID MICROSERVICES ARCHITECTURE
════════════════════════════════════════════════════════════════

                    ┌─────────────────────────┐
                    │    CLIENT LAYER         │
                    │  (Web, Mobile, API)     │
                    └────────────┬────────────┘
                                 │
                                 │ HTTPS
                                 ↓
                    ┌─────────────────────────┐
                    │    API GATEWAY          │
                    │  (Kong or AWS ALB)      │
                    │  - TLS termination      │
                    │  - Rate limiting        │
                    │  - Request routing      │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         │                       │                       │
         ↓                       ↓                       ↓
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  AUTH SERVICE   │   │  CORE COMPLIANCE│   │  INTEGRATIONS   │
│                 │   │     SERVICE     │   │    GATEWAY      │
│ - id.me         │   │                 │   │                 │
│ - SAML/OAuth    │   │ - Employees     │   │ - Checkr        │
│ - MFA (TOTP)    │   │ - Rosters       │   │ - TazWorks      │
│ - JWT issuing   │   │ - Policies      │   │ - Quest ECCF    │
│ - Session mgmt  │   │ - Dashboard     │   │ - FMCSA API     │
│                 │   │ - Reports       │   │ - Vendor events │
│ Next.js API     │   │ - Drug Testing  │   │                 │
│ Routes          │   │ - Background    │   │ Node.js/Express │
│                 │   │ - DOT/Health    │   │                 │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                      │
         │                     │                      │
         └─────────────────────┼──────────────────────┘
                               │
                               ↓
                    ┌─────────────────────────┐
                    │  AUDIT & LOGGING        │
                    │     SERVICE             │
                    │                         │
                    │ - Immutable logs        │
                    │ - SIEM integration      │
                    │ - Security events       │
                    │ - Compliance reports    │
                    │                         │
                    │ PostgreSQL (append-only)│
                    └─────────────────────────┘


         ┌──────────────────────────────────────────────┐
         │            DATA LAYER                         │
         ├──────────────────────────────────────────────┤
         │  ┌──────────────┐  ┌──────────────┐          │
         │  │ PostgreSQL   │  │    Redis     │          │
         │  │ (Neon/RDS)   │  │  (Upstash)   │          │
         │  │              │  │              │          │
         │  │ - Tenants    │  │ - Sessions   │          │
         │  │ - Employees  │  │ - Cache      │          │
         │  │ - Compliance │  │ - Rate limit │          │
         │  └──────────────┘  └──────────────┘          │
         │                                               │
         │  ┌──────────────┐  ┌──────────────┐          │
         │  │  S3/MinIO    │  │ Kafka/Upstash│          │
         │  │              │  │              │          │
         │  │ - Documents  │  │ - Events     │          │
         │  │ - PHI vault  │  │ - Webhooks   │          │
         │  └──────────────┘  └──────────────┘          │
         └──────────────────────────────────────────────┘
```

---

## Service Definitions {#service-definitions}

### 1. Auth Service (Next.js API Routes)

**Purpose:** Centralized authentication, authorization, and identity management

**Responsibilities:**

```
AUTH SERVICE RESPONSIBILITIES
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                            │
├─────────────────────────────────────────────────────────────┤
│  ✓ Password-based login (bcrypt)                             │
│  ✓ SAML 2.0 SSO (Okta, Azure AD, Google Workspace)          │
│  ✓ OAuth 2.0 / OpenID Connect                               │
│  ✓ id.me integration (IAL2 identity verification)           │
│  ✓ MFA enforcement (TOTP, SMS, hardware keys)               │
│  ✓ Session management (Redis-backed)                        │
│  ✓ JWT token issuance (access + refresh)                    │
│  ✓ Failed login lockout (AC-7)                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION                             │
├─────────────────────────────────────────────────────────────┤
│  ✓ RBAC permission checks                                    │
│  ✓ Role assignment and recertification                      │
│  ✓ Tenant resolution (from JWT claims)                      │
│  ✓ Service-to-service authentication                        │
│  ✓ API key management (for integrations)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ACCOUNT LIFECYCLE                         │
├─────────────────────────────────────────────────────────────┤
│  ✓ User provisioning (manager approval workflow)            │
│  ✓ Automated deprovisioning (termination)                   │
│  ✓ Role changes (dual control for privileged)               │
│  ✓ Password resets (email verification)                     │
│  ✓ Inactive account detection (90-day auto-disable)         │
│  ✓ Emergency "break-glass" access                           │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/auth/login                     # Username + password
POST   /api/auth/mfa-challenge              # MFA verification
POST   /api/auth/refresh                    # Refresh JWT tokens
POST   /api/auth/logout                     # Invalidate session
GET    /api/auth/session                    # Get current session
POST   /api/auth/saml/login                 # SAML SSO initiation
POST   /api/auth/saml/acs                   # SAML assertion consumer
POST   /api/auth/idme/callback              # id.me OAuth callback
POST   /api/auth/password/reset-request     # Forgot password
POST   /api/auth/password/reset-confirm     # Reset with token
POST   /api/auth/mfa/enroll                 # Setup TOTP MFA
POST   /api/auth/mfa/verify                 # Verify MFA code
GET    /api/auth/validate                   # Service-to-service token validation
POST   /api/auth/users/provision            # Create new user
PUT    /api/auth/users/{id}/role            # Change user role
DELETE /api/auth/users/{id}                 # Deprovision user
GET    /api/auth/users/{id}/sessions        # List active sessions
DELETE /api/auth/users/{id}/sessions/{sid}  # Kill session
```

**Technology Stack:**
- **Framework:** Next.js 14 API Routes (TypeScript)
- **Auth Libraries:** `jose` (JWT), `@node-saml/node-saml`, `speakeasy` (TOTP)
- **Session Store:** Redis (Upstash)
- **Database:** PostgreSQL (users, roles, permissions)

**FedRAMP Controls Implemented:**
- AC-2 (Account Management)
- AC-3 (Access Enforcement)
- AC-7 (Unsuccessful Login Attempts)
- AC-11 (Session Lock)
- AC-17 (Remote Access)
- IA-2 (Identification and Authentication)
- IA-5 (Authenticator Management)

---

### 2. Core Compliance Service (Next.js + Prisma)

**Purpose:** Main business logic for compliance management

**Responsibilities:**

```
CORE COMPLIANCE SERVICE RESPONSIBILITIES
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                    EMPLOYEE MANAGEMENT                       │
├─────────────────────────────────────────────────────────────┤
│  ✓ Employee CRUD (roster management)                         │
│  ✓ Bulk upload (CSV/Excel)                                   │
│  ✓ Compliance status aggregation                            │
│  ✓ PII/PHI field encryption                                 │
│  ✓ Export to PDF/Excel (with watermarking)                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    COMPLIANCE MODULES                        │
├─────────────────────────────────────────────────────────────┤
│  ✓ Drug & Alcohol Testing                                    │
│     - Random selection algorithm                             │
│     - MRO review workflow                                    │
│     - DOT clearinghouse queries                              │
│                                                              │
│  ✓ Background Checks                                         │
│     - FCRA adverse action workflow                           │
│     - Adjudication (individualized assessment)              │
│     - Continuous monitoring                                  │
│                                                              │
│  ✓ DOT Compliance                                            │
│     - Driver Qualification (DQ) files                        │
│     - FMCSA clearinghouse integration                        │
│     - Hours of Service tracking                              │
│                                                              │
│  ✓ Occupational Health                                       │
│     - Medical surveillance                                   │
│     - OSHA 300 logging                                       │
│     - Respirator fit tests                                   │
│                                                              │
│  ✓ Training & Certifications                                 │
│     - Certificate tracking                                   │
│     - Expiration alerts (30/60/90 days)                     │
│     - Compliance matrix                                      │
│                                                              │
│  ✓ Geo-Fencing                                               │
│     - Location-based compliance                              │
│     - GPS/QR code check-ins                                  │
│     - PostGIS zone management                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    POLICY DRIVER                             │
├─────────────────────────────────────────────────────────────┤
│  ✓ Policy configuration (rules, thresholds)                  │
│  ✓ Compliance status calculation (green/amber/red)          │
│  ✓ Alert generation (expiring certificates, violations)     │
│  ✓ Dashboard aggregation (compliance metrics)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    REPORTING & ANALYTICS                     │
├─────────────────────────────────────────────────────────────┤
│  ✓ Ad-hoc reports (filter, export)                           │
│  ✓ Scheduled reports (email delivery)                       │
│  ✓ MIS reports (Management Information System)              │
│  ✓ Compliance dashboards                                    │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:** (Already exist in `/app/api/`)

```
# Employees
GET    /api/employees
POST   /api/employees
GET    /api/employees/{id}
PUT    /api/employees/{id}
DELETE /api/employees/{id}
POST   /api/employees/bulk-upload
GET    /api/employees/export

# Drug Testing
GET    /api/drug-testing/tests
POST   /api/drug-testing/tests
GET    /api/drug-testing/random-selection
POST   /api/drug-testing/mro-review
GET    /api/drug-testing/clearinghouse

# Background Checks
GET    /api/background/screenings
POST   /api/background/screenings
POST   /api/background/adjudication
POST   /api/background/adverse-action

# DOT Compliance
GET    /api/dot/drivers
POST   /api/dot/drivers
GET    /api/dot/documents
POST   /api/dot/documents
GET    /api/dot/clearinghouse

# Occupational Health
GET    /api/health/surveillance
POST   /api/health/surveillance
GET    /api/health/osha-300

# Training
GET    /api/training/certificates
POST   /api/training/certificates
GET    /api/training/matrix

# Geo-Fencing
GET    /api/geo-fencing/zones
POST   /api/geo-fencing/zones
POST   /api/geo-fencing/check-in
GET    /api/geo-fencing/triggers

# Reports
GET    /api/reports/compliance-summary
GET    /api/reports/employee-roster
POST   /api/reports/schedule
```

**Technology Stack:**
- **Framework:** Next.js 14 (TypeScript, App Router)
- **ORM:** Prisma (PostgreSQL)
- **Validation:** Zod
- **File Processing:** `xlsx`, `pdf-lib`
- **Queue:** Kafka/Upstash (for background jobs)

---

### 3. Integrations Gateway (Node.js/Express)

**Purpose:** Isolated service for external vendor API integrations

**Why Separate Service?**
1. **Credential isolation:** Vendor API keys stored only in this service
2. **Rate limiting:** Independent rate limits per vendor
3. **Webhook reliability:** Dedicated uptime for webhook receivers
4. **Failure isolation:** Vendor API downtime doesn't affect core service
5. **Compliance boundary:** Easier to audit external data flows

**Responsibilities:**

```
INTEGRATIONS GATEWAY RESPONSIBILITIES
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                    VENDOR INTEGRATIONS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Checkr (Background Checks)                            │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  • Invitation API (send candidate link)               │ │
│  │  • Reports API (order background check)                │ │
│  │  • Webhooks (receive completed reports)               │ │
│  │  • OAuth 2.0 authentication                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  TazWorks (Background Checks - Alternative)            │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  • TazAPI v2 (JSON REST API)                           │ │
│  │  • Order screening products                            │ │
│  │  • Retrieve reports (credit, criminal, references)    │ │
│  │  • Webhooks for report completion                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Quest Diagnostics (Drug Testing)                      │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  • eCCF ordering (electronic custody control form)     │ │
│  │  • ESP portal integration (Employer Solutions Portal)  │ │
│  │  • Web Services API (24/7 result downloads)           │ │
│  │  • MRO letter retrieval                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  FMCSA Clearinghouse (DOT Drug & Alcohol)              │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  • API Swagger: clearinghouse.fmcsa.dot.gov/api       │ │
│  │  • Pre-employment full query                          │ │
│  │  • Annual limited query (all CDL drivers)             │ │
│  │  • Report violations (MROs, employers)                │ │
│  │  • OAuth 2.0 + PIV/CAC card authentication            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  id.me (Identity Verification)                         │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  • OAuth 2.0 / OpenID Connect                          │ │
│  │  • IAL2 identity verification (NIST 800-63-3)          │ │
│  │  • Document verification (driver's license, passport) │ │
│  │  • Liveness detection (selfie)                        │ │
│  │  • Military/veteran status verification               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    WEBHOOK RECEIVERS                         │
├─────────────────────────────────────────────────────────────┤
│  ✓ Signature verification (HMAC-SHA256)                      │
│  ✓ Idempotency (prevent duplicate processing)               │
│  ✓ Retry handling (exponential backoff)                     │
│  ✓ Dead letter queue (failed webhooks)                      │
│  ✓ Event publishing (to Kafka for core service)             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    VENDOR ADAPTERS                           │
├─────────────────────────────────────────────────────────────┤
│  ✓ Parse vendor-specific payloads                            │
│  ✓ Transform to universal ComplianceEvent schema            │
│  ✓ Handle vendor-specific error codes                       │
│  ✓ Rate limiting per vendor (respect API limits)            │
│  ✓ Circuit breaker (fail fast if vendor down)               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
# Webhook Receivers (called by vendors)
POST   /webhooks/checkr
POST   /webhooks/tazworks
POST   /webhooks/quest
POST   /webhooks/fmcsa

# Vendor API Proxies (called by core service)
POST   /integrations/checkr/invitations
POST   /integrations/checkr/reports
GET    /integrations/checkr/reports/{id}

POST   /integrations/tazworks/screenings
GET    /integrations/tazworks/reports/{id}

POST   /integrations/quest/eccf/order
GET    /integrations/quest/results/{specimen_id}

POST   /integrations/fmcsa/query/full
POST   /integrations/fmcsa/query/limited
POST   /integrations/fmcsa/violations/report

GET    /integrations/idme/authorize        # OAuth initiation
POST   /integrations/idme/callback         # OAuth callback

# Health Checks
GET    /integrations/health
GET    /integrations/checkr/status
GET    /integrations/tazworks/status
GET    /integrations/quest/status
GET    /integrations/fmcsa/status
```

**Technology Stack:**
- **Framework:** Node.js + Express (TypeScript)
- **HTTP Client:** `axios` with retry logic
- **Webhook Security:** `crypto` (HMAC verification)
- **Queue:** Kafka/Upstash (publish events to core)
- **Circuit Breaker:** `opossum`

**FedRAMP Controls Implemented:**
- AC-4 (Information Flow Enforcement) - vendor data isolation
- SC-7 (Boundary Protection) - API gateway between vendors and core
- SC-13 (Cryptographic Protection) - webhook signature verification

---

### 4. Audit & Logging Service (PostgreSQL + SIEM)

**Purpose:** Immutable audit trail and security event monitoring

**Why Separate Service?**
1. **Immutable logs:** Append-only database, no DELETE operations
2. **Compliance requirement:** FedRAMP requires centralized audit logging
3. **Performance:** Heavy write operations don't affect core service
4. **Security:** Audit logs isolated from operational data
5. **Retention:** 7-year retention policy for compliance

**Responsibilities:**

```
AUDIT & LOGGING SERVICE RESPONSIBILITIES
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                    AUDIT LOGGING (AU-2, AU-3)                │
├─────────────────────────────────────────────────────────────┤
│  ✓ All API requests (who, what, when, IP, user-agent)        │
│  ✓ Authentication events (login, logout, failed attempts)   │
│  ✓ Authorization failures (403 Forbidden)                   │
│  ✓ Data access (READ operations on PII/PHI)                 │
│  ✓ Data modifications (CREATE, UPDATE, DELETE)              │
│  ✓ Configuration changes (policy updates, role changes)     │
│  ✓ Administrative actions (user provisioning, MFA resets)   │
│  ✓ Security events (account lockout, privilege escalation)  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SECURITY MONITORING                       │
├─────────────────────────────────────────────────────────────┤
│  ✓ Real-time anomaly detection                               │
│     - Multiple failed logins from same IP                   │
│     - Unusual access patterns (midnight logins)             │
│     - Privilege escalation attempts                         │
│     - Cross-tenant access attempts                          │
│                                                              │
│  ✓ Automated alerts                                          │
│     - Email/SMS to security officer                         │
│     - Slack/PagerDuty integration                           │
│     - Incident creation in ticketing system                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    COMPLIANCE REPORTING                      │
├─────────────────────────────────────────────────────────────┤
│  ✓ FedRAMP audit reports (monthly)                           │
│  ✓ SOC 2 audit trails (quarterly)                           │
│  ✓ HIPAA access logs (on-demand for BAA)                    │
│  ✓ User activity reports (for role recertification)         │
│  ✓ Incident response logs (security events)                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SIEM INTEGRATION                          │
├─────────────────────────────────────────────────────────────┤
│  ✓ Forward logs to Splunk/ELK/Datadog                        │
│  ✓ Structured logging (JSON format)                         │
│  ✓ Log correlation (trace IDs across services)              │
│  ✓ Retention management (7-year cold storage to S3)         │
└─────────────────────────────────────────────────────────────┘
```

**Audit Log Schema:**

```typescript
interface AuditLogEntry {
  id: string                     // UUID
  timestamp: Date                // ISO 8601
  tenantId: string               // Tenant scope
  userId: string                 // Actor
  userRole: Role                 // Actor's role at time of action
  action: AuditAction            // CREATE, READ, UPDATE, DELETE, etc.
  resource: string               // e.g., "employees", "drug_tests"
  resourceId: string | null      // Specific record ID (if applicable)

  // Context
  ipAddress: string              // Source IP (from X-Forwarded-For)
  userAgent: string              // Browser/client info
  requestId: string              // Trace ID for correlation

  // Details
  details: {
    before?: Record<string, unknown>   // Previous state (for UPDATE)
    after?: Record<string, unknown>    // New state (for CREATE/UPDATE)
    query?: string                     // For READ operations
    count?: number                     // For bulk operations
    reason?: string                    // For administrative actions
  }

  // Result
  result: 'SUCCESS' | 'FAILURE'
  errorMessage?: string          // If FAILURE
  errorCode?: string             // Application error code

  // Performance
  duration: number               // Request duration (ms)

  // Immutability
  createdAt: Date                // Append-only (no updates)
}

enum AuditAction {
  // Data operations
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',

  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  MFA_ENROLLED = 'MFA_ENROLLED',
  PASSWORD_RESET = 'PASSWORD_RESET',

  // Authorization
  ACCESS_DENIED = 'ACCESS_DENIED',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',

  // Account management
  USER_CREATED = 'USER_CREATED',
  USER_DISABLED = 'USER_DISABLED',
  ROLE_CHANGED = 'ROLE_CHANGED',

  // Security
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',

  // Compliance
  POLICY_UPDATED = 'POLICY_UPDATED',
  AUDIT_INITIATED = 'AUDIT_INITIATED',
  REPORT_GENERATED = 'REPORT_GENERATED',
}
```

**API Endpoints:**

```
# Log Ingestion (called by other services)
POST   /audit/log                     # Single log entry
POST   /audit/log/batch               # Batch insert (up to 1000)

# Query & Reporting (called by security officers, auditors)
GET    /audit/logs                    # Search logs (with filters)
GET    /audit/logs/{id}               # Get specific entry
GET    /audit/user/{userId}/activity  # User activity report
GET    /audit/resource/{resource}     # Resource access history
GET    /audit/security-events         # Security alerts

# Compliance Reports
GET    /audit/reports/fedramp         # Monthly FedRAMP report
GET    /audit/reports/soc2            # Quarterly SOC 2 report
GET    /audit/reports/hipaa           # HIPAA access logs
POST   /audit/reports/custom          # Custom report (date range, filters)

# Monitoring
GET    /audit/health
GET    /audit/metrics                 # Write rate, storage used
```

**Technology Stack:**
- **Database:** PostgreSQL (append-only table, no DELETE statements)
- **ORM:** Prisma (with RLS for tenant isolation)
- **SIEM:** Splunk, ELK, or Datadog (forwarding)
- **Storage:** PostgreSQL hot (1 year) → S3 cold storage (6 years)
- **Framework:** Node.js + Express (TypeScript)

**Database Partitioning:**

```sql
-- Partition by month for efficient queries and archival
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  -- ... other columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_logs_2025_11 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE TABLE audit_logs_2025_12 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Indexes for fast queries
CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_action ON audit_logs(action, result);
```

**FedRAMP Controls Implemented:**
- AU-2 (Audit Events)
- AU-3 (Content of Audit Records)
- AU-4 (Audit Storage Capacity)
- AU-5 (Response to Audit Processing Failures)
- AU-6 (Audit Review, Analysis, and Reporting)
- AU-9 (Protection of Audit Information)
- AU-11 (Audit Record Retention)

---

## Data Flow Diagrams {#data-flow-diagrams}

### Flow 1: User Login with MFA

```
USER LOGIN FLOW (with MFA enforcement)
════════════════════════════════════════════════════════════════

Client (Browser)
      │
      ├──(1)── POST /api/auth/login ───────────────────┐
      │        { email, password }                      │
      │                                                 ↓
      │                                     ┌─────────────────────┐
      │                                     │   AUTH SERVICE      │
      │                                     ├─────────────────────┤
      │                                     │ 1. Verify password  │
      │                                     │    (bcrypt compare) │
      │                                     │ 2. Check MFA setup  │
      │                                     │ 3. Create temp      │
      │                                     │    session (Redis)  │
      │                                     └──────────┬──────────┘
      │                                                │
      │◀──(2)── { mfa_required: true, temp_token } ───┤
      │                                                │
      │                                                ├──(3)── Audit Log ──┐
      │                                                │    "LOGIN_MFA_REQ" │
      │                                                │                    ↓
      │                                                │         ┌────────────────┐
      │                                                │         │  AUDIT SERVICE │
      │                                                │         └────────────────┘
      │
      ├──(4)── POST /api/auth/mfa-challenge ──────────┐
      │        { temp_token, mfa_code: "123456" }      │
      │                                                ↓
      │                                     ┌─────────────────────┐
      │                                     │   AUTH SERVICE      │
      │                                     ├─────────────────────┤
      │                                     │ 1. Verify TOTP code │
      │                                     │ 2. Create session   │
      │                                     │    (Redis, 1hr TTL) │
      │                                     │ 3. Issue JWT tokens │
      │                                     └──────────┬──────────┘
      │                                                │
      │◀──(5)── { access_token, refresh_token } ──────┤
      │                                                │
      │                                                ├──(6)── Audit Log ──┐
      │                                                │    "LOGIN_SUCCESS" │
      │                                                │                    ↓
      │                                                │         ┌────────────────┐
      │                                                │         │  AUDIT SERVICE │
      │                                                │         └────────────────┘
      │
      ├──(7)── GET /api/employees ────────────────────┐
      │        Authorization: Bearer <access_token>    │
      │                                                ↓
      │                                     ┌─────────────────────┐
      │                                     │  CORE COMPLIANCE    │
      │                                     ├─────────────────────┤
      │                                     │ 1. Verify JWT       │
      │                                     │ 2. Extract tenantId │
      │                                     │ 3. Check permission │
      │                                     │    employees:read   │
      │                                     │ 4. Query DB with    │
      │                                     │    tenant filter    │
      │                                     └──────────┬──────────┘
      │                                                │
      │◀──(8)── { employees: [...] } ─────────────────┤
      │                                                │
      │                                                ├──(9)── Audit Log ──┐
      │                                                │    "READ employees"│
      │                                                │                    ↓
      │                                                │         ┌────────────────┐
      │                                                │         │  AUDIT SERVICE │
      │                                                │         └────────────────┘
```

---

### Flow 2: Background Check Webhook Processing

```
BACKGROUND CHECK WEBHOOK FLOW (Checkr)
════════════════════════════════════════════════════════════════

Checkr API
      │
      ├──(1)── POST /webhooks/checkr ──────────────────┐
      │        {                                        │
      │          type: "report.completed",              │
      │          id: "report_xyz123",                   │
      │          candidate_id: "emp_456"                │
      │        }                                        │
      │        X-Checkr-Signature: <HMAC-SHA256>        │
      │                                                 ↓
      │                                     ┌─────────────────────┐
      │                                     │  INTEGRATIONS       │
      │                                     │  GATEWAY            │
      │                                     ├─────────────────────┤
      │                                     │ 1. Verify signature │
      │                                     │    (HMAC-SHA256)    │
      │                                     │ 2. Check idempotency│
      │                                     │    (Redis: webhook  │
      │                                     │     ID processed?)  │
      │                                     │ 3. Parse payload    │
      │                                     └──────────┬──────────┘
      │                                                │
      │◀──(2)── 200 OK (immediate ACK) ───────────────┤
      │                                                │
      │                                                ├──(3)── Fetch Full Report ──┐
      │                                                │                            │
      │                                                │         GET /v1/reports/xyz│
      │◀────────────────────────────────────────────────────────────────────────────┤
      │                                                │
      ├──(4)── Full Report JSON ──────────────────────┐
      │        {                                       │
      │          status: "clear",                      │
      │          screenings: {                         │
      │            criminal: {...},                    │
      │            ssn_trace: {...}                    │
      │          }                                     │
      │        }                                       │
      │                                                ↓
      │                                     ┌─────────────────────┐
      │                                     │  INTEGRATIONS       │
      │                                     │  GATEWAY            │
      │                                     ├─────────────────────┤
      │                                     │ 4. Transform to     │
      │                                     │    ComplianceEvent  │
      │                                     │ 5. Publish to Kafka │
      │                                     └──────────┬──────────┘
      │                                                │
      │                                                ↓
      │                                     ┌─────────────────────┐
      │                                     │   Kafka Topic       │
      │                                     │  "compliance.       │
      │                                     │   background.       │
      │                                     │   completed"        │
      │                                     └──────────┬──────────┘
      │                                                │
      │                                                ↓
      │                                     ┌─────────────────────┐
      │                                     │  CORE COMPLIANCE    │
      │                                     │  (Kafka Consumer)   │
      │                                     ├─────────────────────┤
      │                                     │ 1. Consume event    │
      │                                     │ 2. Validate against │
      │                                     │    policy rules     │
      │                                     │ 3. Calculate status │
      │                                     │    (green/amber/red)│
      │                                     │ 4. Update employee  │
      │                                     │    complianceData   │
      │                                     │ 5. Trigger alerts   │
      │                                     │    (if non-compliant│
      │                                     └──────────┬──────────┘
      │                                                │
      │                                                ├──(5)── Audit Log ──┐
      │                                                │    "BACKGROUND_     │
      │                                                │     COMPLETED"      │
      │                                                │                    ↓
      │                                                │         ┌────────────────┐
      │                                                │         │  AUDIT SERVICE │
      │                                                │         └────────────────┘
      │
      │                                                ├──(6)── Send Alert ──┐
      │                                                │    (if amber/red)    │
      │                                                │                      ↓
      │                                                │         ┌────────────────┐
      │                                                │         │  Email Service │
      │                                                │         │  (SendGrid)    │
      │                                                │         └────────────────┘
```

---

### Flow 3: Service-to-Service Authentication

```
SERVICE-TO-SERVICE AUTH (Core → Integrations)
════════════════════════════════════════════════════════════════

┌─────────────────────┐
│  CORE COMPLIANCE    │
│     SERVICE         │
└──────────┬──────────┘
           │
           │  (User requests: "Order background check")
           │
           ├──(1)── Generate Service Token ──────────────┐
           │        (signed with shared secret)          │
           │                                             ↓
           │                              ┌────────────────────────┐
           │                              │  SERVICE TOKEN STRUCT  │
           │                              ├────────────────────────┤
           │                              │  iss: "core-service"   │
           │                              │  aud: "integrations"   │
           │                              │  tenantId: "acme_corp" │
           │                              │  requestId: "req_123"  │
           │                              │  exp: 5min from now    │
           │                              └────────────────────────┘
           │
           ├──(2)── POST /integrations/checkr/reports ───┐
           │        Authorization: Bearer <service_token> │
           │        X-Request-ID: req_123                 │
           │        {                                     │
           │          candidate_id: "emp_456",            │
           │          package: "standard"                 │
           │        }                                     │
           │                                             ↓
           │                              ┌────────────────────────┐
           │                              │  INTEGRATIONS GATEWAY  │
           │                              ├────────────────────────┤
           │                              │ 1. Verify service token│
           │                              │    signature (HMAC)    │
           │                              │ 2. Check expiration    │
           │                              │ 3. Validate tenantId   │
           │                              │ 4. Check service ACL:  │
           │                              │    core → integrations │
           │                              │    allowed? ✅         │
           │                              └────────┬───────────────┘
           │                                       │
           │                                       ├──(3)── Call Checkr API ─┐
           │                                       │                         │
           │                                       │  POST /v1/reports       │
           │                                       │  Authorization: Bearer  │
           │                                       │    <checkr_api_key>     │
           │◀─────────────────────────────────────────────────────────────────┤
           │                                       │
           ├──(4)── Response: { report_id: "xyz" }┤
           │                                       │
           │                                       ├──(5)── Audit Log ───────┐
           │                                       │    "SERVICE_CALL:       │
           │                                       │     core→integrations"  │
           │                                       │                         ↓
           │                                       │              ┌────────────────┐
           │                                       │              │ AUDIT SERVICE  │
           │                                       │              └────────────────┘
           │
           └──(6)── Store report_id in DB
                    (for status polling)
```

---

## Service-to-Service Communication {#service-communication}

```
COMMUNICATION PATTERNS
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│              Pattern 1: SYNCHRONOUS (REST API)               │
├─────────────────────────────────────────────────────────────┤
│  Use Case: User-initiated actions that need immediate reply │
│                                                              │
│  Examples:                                                   │
│  • Core → Auth: Validate JWT token                          │
│  • Core → Integrations: Order background check              │
│  • Integrations → Auth: Verify service token                │
│                                                              │
│  Protocol: HTTP/REST with service tokens                    │
│  Timeout: 10 seconds                                        │
│  Retry: 3 attempts with exponential backoff                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           Pattern 2: ASYNCHRONOUS (Kafka Events)             │
├─────────────────────────────────────────────────────────────┤
│  Use Case: Background processing, eventual consistency      │
│                                                              │
│  Examples:                                                   │
│  • Integrations → Core: Webhook received (background report)│
│  • Core → Audit: Log audit event                            │
│  • Core → Core: Policy re-evaluation (after rule change)    │
│                                                              │
│  Protocol: Kafka/Upstash                                    │
│  Delivery: At-least-once (idempotency required)             │
│  Ordering: Partitioned by employeeId (same employee events  │
│            processed in order)                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Pattern 3: FIRE-AND-FORGET (Audit)              │
├─────────────────────────────────────────────────────────────┤
│  Use Case: Audit logging (must not block main request)      │
│                                                              │
│  Examples:                                                   │
│  • All services → Audit: Log API request                    │
│  • Auth → Audit: Log login attempt                          │
│                                                              │
│  Protocol: HTTP POST (async, no wait for response)          │
│  Fallback: If audit service down, log to local file         │
│  Recovery: Background job retries failed logs               │
└─────────────────────────────────────────────────────────────┘


SERVICE COMMUNICATION MATRIX
────────────────────────────────────────────────────────────────

From ↓ / To →  │  Auth  │  Core  │ Integrations │  Audit
───────────────┼────────┼────────┼──────────────┼────────
Auth           │   -    │   -    │      -       │  Async
Core           │  Sync  │   -    │     Sync     │  Async
Integrations   │  Sync  │ Async  │      -       │  Async
Audit          │   -    │   -    │      -       │   -


FAILURE MODES & CIRCUIT BREAKERS
────────────────────────────────────────────────────────────────

Scenario: Integrations Gateway Down
───────────────────────────────────
Core Service → Integrations Gateway (timeout)
       ↓
Circuit Breaker Opens (after 5 failures)
       ↓
Subsequent requests fail fast (no network call)
       ↓
Fallback: Queue request for later (Kafka)
       ↓
Alert: Send notification to ops team
       ↓
Recovery: Circuit breaker tries half-open after 30 sec


Scenario: Audit Service Down
─────────────────────────────
Core Service → Audit Service (timeout)
       ↓
Fallback: Write audit log to local file
       ↓
Background Job: Retry sending logs every 5 min
       ↓
Recovery: Once audit service up, drain local logs
```

---

**Status:** Design in progress. Next sections to add:
- FedRAMP Compliance Boundaries
- Deployment Architecture (AWS/Railway)
- Technology Stack Details
- Scaling Strategy

Does this hybrid architecture and service breakdown look correct? Should I continue with the remaining sections?

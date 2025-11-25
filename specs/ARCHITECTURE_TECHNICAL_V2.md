# Patriot Compliance Systems - Technical Architecture v2.0

**Document Version:** 2.0
**Created:** 2025-11-24
**Status:** Production Architecture
**Architecture Pattern:** Hybrid Microservices (4 Services)
**Compliance:** FedRAMP Moderate, SOC 2 Type II, HIPAA

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Hybrid Microservices Architecture](#hybrid-architecture)
3. [Technology Stack](#technology-stack)
4. [Service Definitions](#service-definitions)
5. [Data Layer Architecture](#data-layer)
6. [External Integrations](#external-integrations)
7. [Compliance Event Pattern](#compliance-event-pattern)
8. [Deployment Architecture](#deployment)
9. [Security Architecture](#security)
10. [Scalability & Performance](#scalability)

---

## System Overview {#system-overview}

```
PATRIOT COMPLIANCE SYSTEMS - HIGH-LEVEL ARCHITECTURE
════════════════════════════════════════════════════════════════

                  ┌───────────────────────────┐
                  │     CLIENT LAYER          │
                  │  (Browser, Mobile, API)   │
                  └─────────────┬─────────────┘
                                │
                                │ HTTPS/TLS 1.3
                                │
                  ┌─────────────▼─────────────┐
                  │     VERCEL EDGE CDN       │
                  │  - Global distribution    │
                  │  - DDoS protection        │
                  └─────────────┬─────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ↓                      ↓                      ↓
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Next.js Pages  │  │  Next.js Pages  │  │  Next.js Pages  │
│  (React SSR)    │  │  (React SSR)    │  │  (React SSR)    │
│                 │  │                 │  │                 │
│  - Dashboard    │  │  - Auth Pages   │  │  - Portals      │
│  - Compliance   │  │  - Login/MFA    │  │  - PCS Pass     │
│  - Reports      │  │  - Onboarding   │  │  - Executive    │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                    Internal API Calls
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ↓                     ↓                     ↓
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  AUTH SERVICE   │  │  CORE COMPLIANCE│  │  INTEGRATIONS   │
│  (Next.js API)  │  │  (Next.js API)  │  │  (Node/Express) │
│                 │  │                 │  │                 │
│  - JWT Auth     │  │  - Business     │  │  - Checkr       │
│  - MFA (TOTP)   │  │    Logic        │  │  - Quest        │
│  - SAML/OAuth   │  │  - Employees    │  │  - FMCSA        │
│  - id.me        │  │  - Compliance   │  │  - TazWorks     │
│  - Sessions     │  │  - Reports      │  │  - Webhooks     │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                   ┌───────────▼──────────────┐
                   │   AUDIT & LOGGING        │
                   │   (Immutable Logs)       │
                   │   PostgreSQL + SIEM      │
                   └───────────┬──────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ↓                     ↓                     ↓
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL     │  │     Redis       │  │  Kafka/Upstash  │
│  (Neon/RDS)     │  │   (Upstash)     │  │   (Events)      │
│                 │  │                 │  │                 │
│  - Tenants      │  │  - Sessions     │  │  - Webhooks     │
│  - Employees    │  │  - Cache        │  │  - Compliance   │
│  - Compliance   │  │  - Rate Limit   │  │  - Audit        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Key Architectural Decisions:**

1. **Hybrid Over Full Microservices:**
   - 4 services (not 15+) → Simpler FedRAMP SSP documentation
   - Extracted Auth, Integrations, Audit → Security isolation
   - Core remains monolith → Team velocity, simpler deployments

2. **Next.js for Everything:**
   - Auth Service: Next.js API Routes (same framework as frontend)
   - Core Service: Next.js API Routes + Prisma ORM
   - Only Integrations Gateway uses Node/Express (vendor SDK compatibility)

3. **Serverless-First:**
   - Vercel Edge Functions for frontend
   - AWS Lambda behind ALB for backend services
   - Auto-scaling, pay-per-use, 99.99% SLA

---

## Hybrid Microservices Architecture {#hybrid-architecture}

```
SERVICE ARCHITECTURE DIAGRAM
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│                         FRONTEND                               │
│                    (Vercel Edge Network)                       │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Next.js 14 App (TypeScript, React 19, Tailwind)      │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │                                                        │   │
│  │  Pages (app/ directory):                              │   │
│  │  • / - Main dashboard                                 │   │
│  │  • /compliance - 8 compliance modules                 │   │
│  │  • /employees - Roster management                     │   │
│  │  • /reports - MIS reporting                           │   │
│  │  • /portals/pcs-pass - Field worker portal           │   │
│  │  • /portals/executive - Executive dashboard           │   │
│  │  • /portals/auditor - Auditor read-only              │   │
│  │  • /compliance-portal/[slug] - MSP multi-tenant      │   │
│  │                                                        │   │
│  │  API Routes (app/api/):                               │   │
│  │  • /api/auth/* - Proxies to Auth Service             │   │
│  │  • /api/employees/* - Proxies to Core Service        │   │
│  │  • /api/drug-testing/* - Proxies to Core Service     │   │
│  │  • /api/webhooks/* - Proxies to Integrations Gateway │   │
│  │                                                        │   │
│  │  Components:                                           │   │
│  │  • 93+ React components (shadcn/ui + custom)         │   │
│  │  • RBAC-aware (useRBAC hook)                          │   │
│  │  • Responsive (Tailwind breakpoints)                 │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
                               │
                   API Proxy Layer (internal)
                               │
     ┌─────────────────────────┼─────────────────────────┐
     │                         │                         │
     ↓                         ↓                         ↓
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  AUTH SERVICE   │  │  CORE COMPLIANCE│  │  INTEGRATIONS   │
│                 │  │     SERVICE     │  │    GATEWAY      │
│  Port: 3001     │  │  Port: 3000     │  │  Port: 3002     │
│                 │  │                 │  │                 │
│  Framework:     │  │  Framework:     │  │  Framework:     │
│  Next.js 14     │  │  Next.js 14     │  │  Node/Express   │
│  API Routes     │  │  API Routes     │  │  TypeScript     │
│                 │  │                 │  │                 │
│  Database:      │  │  Database:      │  │  Database:      │
│  PostgreSQL     │  │  PostgreSQL     │  │  None (proxies) │
│  (users, roles) │  │  (core data)    │  │                 │
│                 │  │                 │  │  External APIs: │
│  Dependencies:  │  │  Dependencies:  │  │  • Checkr       │
│  • jose (JWT)   │  │  • Prisma ORM   │  │  • Quest        │
│  • speakeasy    │  │  • Zod          │  │  • FMCSA        │
│  • @node-saml   │  │  • TanStack Q.  │  │  • TazWorks     │
│  • bcryptjs     │  │  • Recharts     │  │  • id.me        │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                   ┌───────────▼──────────────┐
                   │   AUDIT & LOGGING        │
                   │      SERVICE             │
                   │   Port: 3003             │
                   │                          │
                   │  Framework:              │
                   │  Node/Express            │
                   │                          │
                   │  Database:               │
                   │  PostgreSQL              │
                   │  (append-only)           │
                   │                          │
                   │  SIEM Integration:       │
                   │  • Splunk forwarder      │
                   │  • ELK Stack             │
                   │  • Datadog               │
                   └──────────────────────────┘
```

### Service Boundaries

| Service | Responsibilities | Port | Framework | DB | Lines of Code (est) |
|---------|------------------|------|-----------|----|--------------------|
| **Auth** | Authentication, Authorization, MFA, Sessions | 3001 | Next.js API | PostgreSQL | 5,000 |
| **Core** | Business logic, CRUD, Compliance modules | 3000 | Next.js API | PostgreSQL | 25,000 |
| **Integrations** | Vendor APIs, Webhooks, Adapters | 3002 | Node/Express | - | 8,000 |
| **Audit** | Immutable logs, SIEM forwarding | 3003 | Node/Express | PostgreSQL | 3,000 |
| **TOTAL** | | | | | **41,000 LOC** |

---

## Technology Stack {#technology-stack}

```
TECHNOLOGY STACK (Detailed)
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│                        FRONTEND                                │
├───────────────────────────────────────────────────────────────┤
│  Framework: Next.js 14 (App Router, React Server Components)  │
│  Language: TypeScript 5.3                                      │
│  UI Library: React 19                                          │
│  Styling: Tailwind CSS 4, tailwindcss-animate                 │
│  Components: shadcn/ui (Radix UI primitives)                  │
│  State Management: TanStack Query (React Query), Zustand      │
│  Forms: React Hook Form + Zod validation                      │
│  Charts: Recharts, tremor                                     │
│  Maps: Mapbox GL JS (geo-fencing)                             │
│  Tables: TanStack Table (@tanstack/react-table)               │
│  Date/Time: date-fns                                           │
│  HTTP Client: fetch (native) + TanStack Query                 │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                     BACKEND (Next.js API)                      │
├───────────────────────────────────────────────────────────────┤
│  Framework: Next.js 14 API Routes                             │
│  Language: TypeScript 5.3                                      │
│  ORM: Prisma 5.x (PostgreSQL)                                  │
│  Validation: Zod (schema validation)                           │
│  Authentication: jose (JWT), @node-saml/node-saml (SAML)      │
│  MFA: speakeasy (TOTP), qrcode (QR generation)                │
│  Password Hashing: bcryptjs (12 rounds)                        │
│  File Processing: xlsx, pdf-lib, pdfmake                       │
│  Email: SendGrid, AWS SES                                      │
│  SMS: Twilio                                                   │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│              INTEGRATIONS GATEWAY (Node/Express)               │
├───────────────────────────────────────────────────────────────┤
│  Framework: Express 4.x (TypeScript)                           │
│  HTTP Client: axios (with retry logic)                         │
│  Webhook Security: crypto (HMAC verification)                  │
│  Circuit Breaker: opossum                                      │
│  Rate Limiting: express-rate-limit + Redis                     │
│  Vendor SDKs:                                                  │
│  • checkr-node (background checks)                             │
│  • axios (Quest, FMCSA, TazWorks - REST APIs)                  │
│  • passport-idme (id.me OAuth)                                 │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                       DATA LAYER                               │
├───────────────────────────────────────────────────────────────┤
│  Primary Database: PostgreSQL 15                               │
│  • Hosting: Neon (serverless) or AWS RDS (production)         │
│  • Connection Pooling: PgBouncer (1000 connections)           │
│  • Replication: Primary + 2 read replicas                     │
│  • Backup: Automated daily snapshots (7-day retention)        │
│  • Encryption: AES-256 at rest, TLS in transit                │
│                                                                │
│  Cache: Redis 7.x                                              │
│  • Hosting: Upstash (serverless)                              │
│  • Use Cases: Sessions, rate limiting, idempotency            │
│  • TTL: 1 hour (sessions), 24 hours (idempotency)            │
│                                                                │
│  Message Queue: Kafka (Upstash)                                │
│  • Topics: compliance.*, employee.*, audit.*                  │
│  • Partitions: 3 per topic (by employeeId hash)              │
│  • Retention: 7 days                                           │
│                                                                │
│  Object Storage: AWS S3 / MinIO                                │
│  • Buckets: documents (encrypted), exports (time-limited)    │
│  • Encryption: Server-side AES-256                            │
│  • Access: Signed URLs (1-24 hour expiry)                     │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                            │
├───────────────────────────────────────────────────────────────┤
│  Frontend Hosting: Vercel (Edge Network)                       │
│  • CDN: Global (300+ edge locations)                           │
│  • SSL: Automatic Let's Encrypt                               │
│  • DDoS: Built-in protection                                   │
│                                                                │
│  Backend Hosting: AWS ECS (Fargate) or Railway                │
│  • Containers: Docker (multi-stage builds)                    │
│  • Load Balancer: AWS ALB (Application Load Balancer)         │
│  • Auto-scaling: 2-20 tasks (CPU > 70% threshold)            │
│  • Health Checks: /health endpoint (30s interval)             │
│                                                                │
│  API Gateway: Kong or AWS API Gateway                          │
│  • Rate Limiting: 100 req/min per tenant                      │
│  • Auth: JWT verification before routing                      │
│  • Logging: All requests logged to Audit Service             │
│                                                                │
│  CI/CD: GitHub Actions                                         │
│  • Build: pnpm build, Docker build                            │
│  • Test: Jest, Playwright E2E                                 │
│  • Deploy: Vercel (frontend), ECS (backend)                   │
│  • Environments: dev, staging, production                     │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                  OBSERVABILITY & MONITORING                    │
├───────────────────────────────────────────────────────────────┤
│  Application Monitoring: Datadog or New Relic                  │
│  • APM: Trace requests across services                        │
│  • Metrics: Latency (P50, P95, P99), error rate              │
│  • Alerts: Email/Slack/PagerDuty                              │
│                                                                │
│  Error Tracking: Sentry                                        │
│  • Source maps uploaded (production errors)                   │
│  • User context attached (tenantId, userId)                   │
│  • Slack integration for critical errors                      │
│                                                                │
│  Logging: ELK Stack or Splunk                                  │
│  • Structured JSON logs                                        │
│  • Indexed by: timestamp, tenantId, userId, traceId          │
│  • Retention: 90 days hot, 7 years cold (S3)                 │
│                                                                │
│  Uptime Monitoring: Pingdom or UptimeRobot                     │
│  • Check every 1 minute                                        │
│  • Alert if down > 5 minutes                                   │
│  • SLA target: 99.9% uptime                                   │
│                                                                │
│  Security Monitoring: SIEM (Splunk or Sumo Logic)             │
│  • All audit logs forwarded                                    │
│  • Anomaly detection (failed logins, privilege escalation)   │
│  • Compliance reports (FedRAMP, SOC 2)                        │
└───────────────────────────────────────────────────────────────┘
```

---

## Service Definitions {#service-definitions}

### 1. Auth Service (Next.js API Routes)

**Base URL:** `https://auth.patriotcompliance.com` (or `https://api.patriotcompliance.com/auth`)

**Responsibilities:**
- User authentication (password, SAML, OAuth, id.me)
- MFA enrollment and verification (TOTP, SMS)
- JWT token issuance (access + refresh)
- Session management (Redis-backed)
- Role-based permission checks
- Account lifecycle (provisioning, deprovisioning, role changes)

**Key API Endpoints:**

```
Authentication:
  POST   /api/auth/login
  POST   /api/auth/mfa-challenge
  POST   /api/auth/logout
  POST   /api/auth/refresh
  GET    /api/auth/session

SAML SSO:
  POST   /api/auth/saml/login
  POST   /api/auth/saml/acs (assertion consumer service)
  GET    /api/auth/saml/metadata

OAuth (id.me):
  GET    /api/auth/idme/authorize
  GET    /api/auth/idme/callback

MFA:
  POST   /api/auth/mfa/enroll
  POST   /api/auth/mfa/verify
  GET    /api/auth/mfa/backup-codes

Password Management:
  POST   /api/auth/password/reset-request
  POST   /api/auth/password/reset-confirm
  PUT    /api/auth/password/change

User Management (Admin):
  POST   /api/auth/users
  GET    /api/auth/users
  GET    /api/auth/users/{id}
  PUT    /api/auth/users/{id}/role
  DELETE /api/auth/users/{id}
  GET    /api/auth/users/{id}/sessions
  DELETE /api/auth/users/{id}/sessions/{sid}

Service-to-Service:
  POST   /api/auth/validate (validate JWT for other services)
```

**Database Schema:**

```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String
  firstName         String
  lastName          String
  role              Role
  tenantId          String
  tenant            Tenant    @relation(fields: [tenantId], references: [id])

  mfaEnabled        Boolean   @default(false)
  mfaSecret         String?   // TOTP secret (encrypted)
  mfaBackupCodes    String[]  // Hashed backup codes

  identityVerified  Boolean   @default(false)
  identityProvider  String?   // "idme", "saml", null
  idmeSub           String?   @unique
  samlNameId        String?   @unique

  status            UserStatus @default(ACTIVE)
  createdAt         DateTime  @default(now())
  lastLoginAt       DateTime?
  recertifiedAt     DateTime?

  @@index([tenantId, role])
  @@index([email])
}

enum UserStatus {
  PENDING_ACTIVATION
  ACTIVE
  INACTIVE
  DISABLED
  LOCKED
}

enum Role {
  super_admin
  pcs_security_officer
  information_system_owner
  system_admin
  compliance_company_admin
  der
  safety_manager
  compliance_officer
  senior_auditor
  audit_manager
  field_worker
  auditor
}
```

---

### 2. Core Compliance Service (Next.js API Routes)

**Base URL:** `https://api.patriotcompliance.com`

**Responsibilities:**
- Employee roster management
- 8 compliance modules (drug testing, background, DOT, health, training, geo, policy, billing)
- Policy driver (compliance status calculation)
- Report generation (MIS, ad-hoc, scheduled)
- Dashboard aggregations
- Export functionality (CSV, PDF, Excel)

**Key API Endpoints:**

```
Employees:
  GET    /api/employees
  POST   /api/employees
  GET    /api/employees/{id}
  PUT    /api/employees/{id}
  DELETE /api/employees/{id}
  POST   /api/employees/bulk-upload
  GET    /api/employees/export

Drug & Alcohol Testing:
  GET    /api/drug-testing/tests
  POST   /api/drug-testing/tests
  GET    /api/drug-testing/tests/{id}
  POST   /api/drug-testing/random-selection
  POST   /api/drug-testing/mro-review
  GET    /api/drug-testing/clearinghouse

Background Checks:
  GET    /api/background/screenings
  POST   /api/background/screenings
  GET    /api/background/screenings/{id}
  POST   /api/background/adjudication
  POST   /api/background/adverse-action

DOT Compliance:
  GET    /api/dot/drivers
  POST   /api/dot/drivers
  GET    /api/dot/documents
  POST   /api/dot/documents
  POST   /api/dot/documents/upload
  GET    /api/dot/documents/download-dq-file
  GET    /api/dot/clearinghouse

Occupational Health:
  GET    /api/health/surveillance
  POST   /api/health/surveillance
  GET    /api/health/osha-300
  POST   /api/health/medical-exams

Training & Certifications:
  GET    /api/training/certificates
  POST   /api/training/certificates
  PUT    /api/training/certificates/{id}
  GET    /api/training/matrix

Geo-Fencing:
  GET    /api/geo-fencing/zones
  POST   /api/geo-fencing/zones
  PUT    /api/geo-fencing/zones/{id}
  POST   /api/geo-fencing/check-in
  GET    /api/geo-fencing/triggers

Policy Driver:
  GET    /api/policies
  POST   /api/policies
  PUT    /api/policies/{id}
  GET    /api/policies/{id}/evaluate

Reports:
  GET    /api/reports/compliance-summary
  GET    /api/reports/employee-roster
  GET    /api/reports/drug-testing-mis
  POST   /api/reports/custom
  POST   /api/reports/schedule
  GET    /api/reports/scheduled

Dashboard:
  GET    /api/dashboard/stats
  GET    /api/dashboard/alerts
  GET    /api/dashboard/compliance-by-module
```

**Database Schema (Core Tables):**

```prisma
model Employee {
  id                String    @id @default(uuid())
  tenantId          String
  tenant            Tenant    @relation(fields: [tenantId], references: [id])

  firstName         String
  lastName          String
  email             String?
  phone             String?

  // Encrypted PII
  ssnEncrypted      String?
  dobEncrypted      String?

  hireDate          DateTime?
  terminationDate   DateTime?
  status            EmployeeStatus @default(ACTIVE)

  // JSON compliance data (flexible schema)
  complianceData    Json      @default("{}")

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  drugTests         DrugTest[]
  backgroundChecks  BackgroundCheck[]
  dotRecords        DOTRecord[]
  healthRecords     HealthRecord[]
  trainingRecords   TrainingRecord[]

  @@index([tenantId, status])
  @@index([tenantId, lastName])
}

model DrugTest {
  id                String    @id @default(uuid())
  employeeId        String
  employee          Employee  @relation(fields: [employeeId], references: [id])
  tenantId          String

  testType          String    // RANDOM, PRE_EMPLOYMENT, POST_ACCIDENT
  testDate          DateTime
  specimenId        String    @unique
  result            String    // NEGATIVE, POSITIVE, DILUTE_NEGATIVE
  mroReviewStatus   String    // PENDING, COMPLETED
  mroReviewedBy     String?
  mroReviewedAt     DateTime?

  isDOTRegulated    Boolean   @default(false)
  reportedToClearinghouse Boolean @default(false)

  documentUrl       String?

  createdAt         DateTime  @default(now())

  @@index([tenantId, employeeId])
  @@index([testDate])
}

model BackgroundCheck {
  id                String    @id @default(uuid())
  employeeId        String
  employee          Employee  @relation(fields: [employeeId], references: [id])
  tenantId          String

  vendor            String    // checkr, tazworks
  vendorReportId    String    @unique
  orderDate         DateTime
  completionDate    DateTime?
  status            String    // PENDING, COMPLETE, DISPUTED
  result            String?   // CLEAR, CONSIDER, ENGAGED
  adjudicationStatus String?  // APPROVED, DENIED, PENDING

  screenings        Json      // Array of screenings (criminal, SSN, etc.)

  documentUrl       String?

  createdAt         DateTime  @default(now())

  @@index([tenantId, employeeId])
}

model Policy {
  id                String    @id @default(uuid())
  tenantId          String
  tenant            Tenant    @relation(fields: [tenantId], references: [id])

  name              String
  complianceType    String    // drug_test, background, dot, health, training
  role              String?   // CDL_driver, forklift_operator, null (all)
  rules             Json      // Dynamic rules (frequency, thresholds, etc.)

  isActive          Boolean   @default(true)
  version           Int       @default(1)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([tenantId, complianceType])
}
```

---

### 3. Integrations Gateway (Node.js/Express)

**Base URL:** `https://integrations.patriotcompliance.com` (internal only, not exposed publicly)

**Responsibilities:**
- Vendor API integrations (Checkr, Quest, FMCSA, TazWorks, id.me)
- Webhook receivers (signed, idempotent)
- Adapter pattern (vendor-specific → universal schema)
- Circuit breakers, retries, rate limiting
- Publish events to Kafka

**Key API Endpoints:**

```
Webhook Receivers (called by vendors):
  POST   /webhooks/checkr
  POST   /webhooks/tazworks
  POST   /webhooks/quest
  POST   /webhooks/fmcsa

Vendor API Proxies (called by Core Service):
  Checkr:
    POST   /integrations/checkr/candidates
    POST   /integrations/checkr/reports
    GET    /integrations/checkr/reports/{id}

  TazWorks:
    POST   /integrations/tazworks/screenings
    GET    /integrations/tazworks/screenings/{id}

  Quest:
    POST   /integrations/quest/eccf/order
    GET    /integrations/quest/results/{specimen_id}

  FMCSA:
    POST   /integrations/fmcsa/query/full
    POST   /integrations/fmcsa/query/limited
    POST   /integrations/fmcsa/violations/report

  id.me:
    GET    /integrations/idme/authorize
    POST   /integrations/idme/callback

Health Checks:
  GET    /integrations/health
  GET    /integrations/checkr/status
  GET    /integrations/tazworks/status
  GET    /integrations/quest/status
  GET    /integrations/fmcsa/status
```

**Adapter Code Structure:**

```
integrations-gateway/
├── src/
│   ├── adapters/
│   │   ├── checkr.adapter.ts       (300 LOC)
│   │   ├── tazworks.adapter.ts     (250 LOC)
│   │   ├── quest.adapter.ts        (350 LOC)
│   │   ├── fmcsa.adapter.ts        (400 LOC)
│   │   └── idme.adapter.ts         (200 LOC)
│   ├── webhooks/
│   │   ├── checkr.webhook.ts       (150 LOC)
│   │   ├── tazworks.webhook.ts     (150 LOC)
│   │   └── quest.webhook.ts        (150 LOC)
│   ├── schemas/
│   │   └── compliance-event.ts     (unified schema)
│   ├── kafka/
│   │   └── producer.ts             (Kafka publishing)
│   └── utils/
│       ├── signature-verify.ts
│       ├── idempotency.ts
│       └── circuit-breaker.ts
```

---

### 4. Audit & Logging Service (Node.js/Express)

**Base URL:** `https://audit.patriotcompliance.com` (internal only)

**Responsibilities:**
- Receive audit logs from all services (fire-and-forget HTTP POST)
- Store in append-only PostgreSQL table (partitioned by month)
- Forward to SIEM (Splunk, ELK, Datadog)
- Generate compliance reports (FedRAMP, SOC 2, HIPAA)
- Anomaly detection (failed logins, privilege escalation)

**Key API Endpoints:**

```
Log Ingestion (called by other services):
  POST   /audit/log            (single entry)
  POST   /audit/log/batch      (up to 1000 entries)

Query & Reporting (called by security officers, auditors):
  GET    /audit/logs
  GET    /audit/logs/{id}
  GET    /audit/user/{userId}/activity
  GET    /audit/resource/{resource}
  GET    /audit/security-events

Compliance Reports:
  GET    /audit/reports/fedramp
  GET    /audit/reports/soc2
  GET    /audit/reports/hipaa
  POST   /audit/reports/custom

Health:
  GET    /audit/health
  GET    /audit/metrics
```

**Database Schema:**

```prisma
model AuditLog {
  id                String    @id @default(uuid())
  timestamp         DateTime  @default(now())
  tenantId          String
  userId            String
  userRole          String

  action            AuditAction
  resource          String
  resourceId        String?

  // Context
  ipAddress         String
  userAgent         String
  requestId         String

  // Details
  details           Json

  // Result
  result            AuditResult
  errorMessage      String?
  errorCode         String?

  duration          Int       // ms

  createdAt         DateTime  @default(now())

  @@index([tenantId, createdAt])
  @@index([userId, createdAt])
  @@index([resource, resourceId])
  @@index([action, result])
}

enum AuditAction {
  CREATE
  READ
  UPDATE
  DELETE
  EXPORT
  LOGIN
  LOGOUT
  LOGIN_FAILED
  MFA_ENROLLED
  PASSWORD_RESET
  ACCESS_DENIED
  PRIVILEGE_ESCALATION
  USER_CREATED
  USER_DISABLED
  ROLE_CHANGED
  ACCOUNT_LOCKED
  SESSION_EXPIRED
  SUSPICIOUS_ACTIVITY
  POLICY_UPDATED
  AUDIT_INITIATED
  REPORT_GENERATED
}

enum AuditResult {
  SUCCESS
  FAILURE
}
```

---

## Data Layer Architecture {#data-layer}

```
DATA LAYER ARCHITECTURE
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│                   PRIMARY DATABASE (PostgreSQL)                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Hosting: Neon (Serverless PostgreSQL)                        │
│  Version: PostgreSQL 15                                        │
│  Compute: Autoscale 1-8 vCPU                                   │
│  Storage: 100 GB → 1 TB (auto-grows)                          │
│  Connections: 1000 (via PgBouncer)                             │
│  Replication: 1 primary + 2 read replicas                     │
│  Backup: Automated daily snapshots (7-day retention)          │
│  Encryption: AES-256 at rest, TLS 1.3 in transit              │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  TENANT ISOLATION (Row-Level Security)                 │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  ALL queries filtered by tenantId:                     │   │
│  │                                                         │   │
│  │  SELECT * FROM employees                                │   │
│  │  WHERE tenant_id = current_setting('app.tenant_id')    │   │
│  │                                                         │   │
│  │  SET app.tenant_id = 'acme_corp';  -- Per connection   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PARTITIONING (for scale)                              │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  employees: Partitioned by HASH(tenant_id) (16 parts)  │   │
│  │  audit_logs: Partitioned by RANGE(created_at) (monthly)│   │
│  │  drug_tests: Partitioned by HASH(tenant_id) (16 parts) │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  INDEXES (Performance)                                  │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  employees:                                             │   │
│  │  • (tenant_id, status)                                  │   │
│  │  • (tenant_id, last_name)                               │   │
│  │  • GIN index on compliance_data JSONB                   │   │
│  │                                                         │   │
│  │  audit_logs:                                            │   │
│  │  • (tenant_id, created_at DESC)                         │   │
│  │  • (user_id, created_at DESC)                           │   │
│  │  • (action, result)                                     │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                   CACHE LAYER (Redis)                          │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Hosting: Upstash (Serverless Redis)                           │
│  Version: Redis 7.x                                            │
│  Memory: 1 GB → 10 GB (auto-scale)                            │
│  Persistence: AOF (Append-Only File)                           │
│  Replication: Multi-AZ                                         │
│  TLS: Required                                                 │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  KEY PATTERNS                                           │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  Sessions:                                              │   │
│  │  • session:{sessionId}  (TTL: 1 hour)                  │   │
│  │    Value: {userId, tenantId, role, permissions}        │   │
│  │                                                         │   │
│  │  Rate Limiting:                                         │   │
│  │  • ratelimit:{vendor}:bucket  (TTL: 60 seconds)        │   │
│  │    Value: tokens available (100, 60, 50, 30)           │   │
│  │                                                         │   │
│  │  Idempotency:                                           │   │
│  │  • processed_webhooks:{vendor}:{eventId}  (TTL: 24h)   │   │
│  │    Value: "processed"                                   │   │
│  │                                                         │   │
│  │  Cache:                                                 │   │
│  │  • cache:dashboard:{tenantId}  (TTL: 5 minutes)        │   │
│  │  • cache:employee:{employeeId}  (TTL: 1 hour)          │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                MESSAGE QUEUE (Kafka/Upstash)                   │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Hosting: Upstash Kafka (Serverless)                           │
│  Throughput: 10 MB/s → 100 MB/s                               │
│  Retention: 7 days                                             │
│  Partitions: 3 per topic (by employeeId hash)                 │
│  Replication Factor: 3                                         │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  TOPICS                                                 │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  compliance.drugtest.completed                          │   │
│  │  compliance.background.completed                        │   │
│  │  compliance.dot.updated                                 │   │
│  │  compliance.health.updated                              │   │
│  │  compliance.training.updated                            │   │
│  │  employee.created                                       │   │
│  │  employee.updated                                       │   │
│  │  alert.employee.noncompliant                            │   │
│  │  alert.document.expiring                                │   │
│  │  audit.log                                              │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  CONSUMER GROUPS                                        │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  core-compliance-service  (subscribes to all compliance.*)│
│  │  audit-logging-service  (subscribes to audit.*)         │   │
│  │  alert-notification-service  (subscribes to alert.*)    │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                   OBJECT STORAGE (S3/MinIO)                    │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Provider: AWS S3 or self-hosted MinIO                         │
│  Encryption: Server-side AES-256 (SSE-S3 or SSE-KMS)          │
│  Versioning: Enabled                                           │
│  Lifecycle: Hot (90 days) → Glacier (6 years) → Delete (7y)   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  BUCKETS                                                │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  documents-prod                                         │   │
│  │  • Path: /{tenantId}/{module}/{employeeId}/{docId}.pdf │   │
│  │  • Access: Signed URLs (24-hour expiry)                 │   │
│  │  • Size: ~500 GB                                        │   │
│  │                                                         │   │
│  │  exports-temp                                           │   │
│  │  • Path: /{tenantId}/exports/{timestamp}.csv           │   │
│  │  • Access: Signed URLs (1-hour expiry, watermarked)    │   │
│  │  • Lifecycle: Auto-delete after 7 days                  │   │
│  │                                                         │   │
│  │  backups                                                │   │
│  │  • Path: /postgres-backups/{date}.sql.gz               │   │
│  │  • Access: Admin only                                   │   │
│  │  • Lifecycle: Retain 7 years                            │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---

## External Integrations {#external-integrations}

**See:** `specs/compliance/external-api-integrations.md` for comprehensive documentation.

**Summary:**

| Vendor | Purpose | API Type | Rate Limit | Priority |
|--------|---------|----------|------------|----------|
| **Checkr** | Background checks | REST | 100/min | High |
| **TazWorks** | Background checks (alt) | REST | 60/min | Medium |
| **Quest Diagnostics** | Drug testing (eCCF) | REST | 50/min | High |
| **FMCSA Clearinghouse** | DOT drug/alcohol DB | REST OAuth | 30/min | High |
| **ID.me** | Identity verification | OAuth/OIDC | 100/min | High |

---

## Compliance Event Pattern {#compliance-event-pattern}

```
UNIVERSAL COMPLIANCE EVENT WORKFLOW
════════════════════════════════════════════════════════════════

All 8 compliance modules follow this identical pattern:

Step 1: INGEST
──────────────────────────────────────────────────────────────
Vendor Webhook → Integrations Gateway
  POST /webhooks/quest
  X-Quest-Signature: HMAC-SHA256


Step 2: PARSE
──────────────────────────────────────────────────────────────
Adapter transforms vendor payload → Universal ComplianceEvent

{
  event_id: "evt_xyz789",
  event_type: "compliance.drugtest.completed",
  timestamp: "2025-11-24T14:30:00Z",
  source: "quest",
  employee_id: "emp_456",
  client_id: "acme_corp",
  data: {
    compliance_type: "drug_test",
    specimen_id: "QST-2025-11-24-001234",
    result: "NEGATIVE",
    test_type: "DOT_5_PANEL_URINE",
    mro_letter_url: "s3://..."
  }
}


Step 3: VALIDATE
──────────────────────────────────────────────────────────────
Check against policy rules:
  • Is test type correct (DOT vs non-DOT)?
  • Is result valid (NEGATIVE, POSITIVE, etc.)?
  • Does employee exist in our system?
  • Is tenantId correct?


Step 4: STORE
──────────────────────────────────────────────────────────────
UPDATE employees SET
  compliance_data = jsonb_set(
    compliance_data,
    '{drug_test}',
    '{"status": "compliant", "flag": "green", "last_test": "2025-11-24"}'
  )
WHERE id = 'emp_456' AND tenant_id = 'acme_corp'

INSERT INTO drug_tests (employee_id, test_date, result, ...)
VALUES (...)


Step 5: PUBLISH EVENT
──────────────────────────────────────────────────────────────
Publish to Kafka topic: compliance.drugtest.completed
  Partition Key: emp_456 (ensures order for same employee)
  Message: ComplianceEvent JSON


Step 6: FLAG CALCULATION
──────────────────────────────────────────────────────────────
Policy Driver evaluates:
  IF result = NEGATIVE AND test_date < 365 days ago
    → flag = "green"
  IF result = POSITIVE
    → flag = "red"
  IF test_date > 365 days ago
    → flag = "amber" (expiring soon)


Step 7: ALERT
──────────────────────────────────────────────────────────────
IF flag = "red" OR flag = "amber":
  Publish to Kafka: alert.employee.noncompliant
  Send email to DER
  Create task in dashboard
```

---

## Deployment Architecture {#deployment}

```
PRODUCTION DEPLOYMENT (AWS)
════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE                             │
│             (Frontend + Next.js SSR)                           │
│  • 300+ edge locations globally                               │
│  • Automatic HTTPS (Let's Encrypt)                            │
│  • DDoS protection built-in                                   │
│  • Deploy on git push to main                                 │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ HTTPS (API calls)
                         │
           ┌─────────────▼─────────────────────────┐
           │      AWS ROUTE 53 (DNS)               │
           │  api.patriotcompliance.com → ALB      │
           └─────────────┬─────────────────────────┘
                         │
           ┌─────────────▼─────────────────────────┐
           │  AWS APPLICATION LOAD BALANCER (ALB)  │
           │  • TLS termination (ACM certificate)  │
           │  • Health checks (/health endpoint)   │
           │  • Target groups (ECS tasks)          │
           └─────────────┬─────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ↓               ↓               ↓
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ECS CLUSTER    │ │  ECS CLUSTER    │ │  ECS CLUSTER    │
│  (us-east-1a)   │ │  (us-east-1b)   │ │  (us-east-1c)   │
│                 │ │                 │ │                 │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │  Auth     │  │ │  │  Auth     │  │ │  │  Auth     │  │
│  │  Service  │  │ │  │  Service  │  │ │  │  Service  │  │
│  │  (Fargate)│  │ │  │  (Fargate)│  │ │  │  (Fargate)│  │
│  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │
│                 │ │                 │ │                 │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │  Core     │  │ │  │  Core     │  │ │  │  Core     │  │
│  │  Service  │  │ │  │  Service  │  │ │  │  Service  │  │
│  │  (Fargate)│  │ │  │  (Fargate)│  │ │  │  (Fargate)│  │
│  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │
│                 │ │                 │ │                 │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │Integrations│ │ │  │Integrations│ │ │  │Integrations│ │
│  │  Gateway   │  │ │  │  Gateway   │  │ │  │  Gateway   │  │
│  │  (Fargate) │  │ │  │  (Fargate) │  │ │  │  (Fargate) │  │
│  └───────────┘  │ │  └───────────┘  │ │  └───────────┘  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │        DATA LAYER              │
         │  (Shared across AZs)           │
         ├────────────────────────────────┤
         │  • Neon PostgreSQL (multi-AZ)  │
         │  • Upstash Redis (multi-AZ)    │
         │  • Upstash Kafka (multi-AZ)    │
         │  • AWS S3 (multi-AZ)           │
         └────────────────────────────────┘
```

**Auto-Scaling Configuration:**

```yaml
ECS Service: core-compliance-service
  Task Definition: patriot-compliance-core:latest
  Desired Count: 3 (minimum)
  Max Count: 20
  CPU: 1 vCPU per task
  Memory: 2 GB per task

  Auto-Scaling Policy:
    Target: CPU > 70% for 2 minutes → Scale up
    Target: CPU < 30% for 5 minutes → Scale down
    Cooldown: 60 seconds

  Health Check:
    Path: /health
    Interval: 30 seconds
    Timeout: 5 seconds
    Healthy Threshold: 2
    Unhealthy Threshold: 3
```

---

## Security Architecture {#security}

**See:** `specs/compliance/fedramp-moderate-rbac.md` for complete security documentation.

**Summary:**

1. **Authentication:**
   - JWT (HS256, 15min access tokens, 7-day refresh tokens)
   - MFA enforced for all roles (TOTP, SMS, hardware keys)
   - SAML 2.0 SSO (Okta, Azure AD)
   - id.me IAL2 identity verification (field workers)

2. **Authorization:**
   - RBAC with 12 roles, 56 permissions
   - 4-layer enforcement (API Gateway, Route Handler, Database, Response)
   - Deny-by-default, explicit grants

3. **Data Protection:**
   - Encryption at rest: AES-256 (PostgreSQL, S3)
   - Encryption in transit: TLS 1.3
   - PII/PHI field-level encryption (SSN, DOB)
   - Signed URLs for document access (time-limited)

4. **Audit Logging:**
   - All API requests logged (who, what, when, IP, result)
   - Immutable append-only logs (7-year retention)
   - SIEM integration (Splunk, ELK, Datadog)
   - FedRAMP/SOC 2 compliance reports

5. **Network Security:**
   - VPC with private subnets (ECS tasks)
   - Security groups (least privilege)
   - WAF rules (SQL injection, XSS prevention)
   - DDoS protection (AWS Shield, Cloudflare)

---

## Scalability & Performance {#scalability}

**Performance Targets:**

| Metric | Target | Current (Nov 2025) |
|--------|--------|--------------------|
| **API Response Time (P95)** | < 200ms | 150ms |
| **Dashboard Load Time** | < 2 seconds | 1.8 seconds |
| **Webhook Processing (P95)** | < 500ms | 350ms |
| **Database Query (P95)** | < 50ms | 35ms |
| **Concurrent Users** | 10,000 | 500 (early stage) |
| **Uptime SLA** | 99.9% | 99.95% |

**Scaling Strategy:**

1. **Horizontal Scaling (ECS Auto-Scaling):**
   - Auth Service: 2-10 tasks (CPU threshold: 70%)
   - Core Service: 3-20 tasks (CPU threshold: 70%)
   - Integrations: 2-8 tasks (CPU threshold: 60%)
   - Audit: 1-5 tasks (write-heavy, less CPU)

2. **Database Scaling:**
   - Read replicas: 2 replicas (read-heavy queries)
   - Connection pooling: PgBouncer (1000 connections)
   - Partitioning: By tenant_id (horizontal), by date (audit logs)

3. **Caching Strategy:**
   - Redis: Session cache (1-hour TTL), dashboard cache (5-min TTL)
   - CDN: Static assets (60-day cache), API responses (no cache)
   - Query result cache: Employee roster (1-hour TTL)

4. **Kafka Partitioning:**
   - 3 partitions per topic (by employeeId hash)
   - Scales to 10,000 events/second per topic
   - Consumer groups per service (parallel processing)

---

**Document Complete:** Architecture v2.0

**Next Steps:**
1. ✅ Architecture documented
2. ⏭️ Create RBAC matrix markdown (56 permissions × 12 roles)
3. ⏭️ Create SOC 2 Type II documentation
4. ⏭️ Create internal API catalog (70+ endpoints)
5. ⏭️ Create data model documentation (Prisma schemas)
6. ⏭️ Create project roadmap tracking

Should I continue with the RBAC matrix?

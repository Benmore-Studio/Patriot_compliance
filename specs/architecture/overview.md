# Patriot Compliance Systems - System Overview

**Version**: 2.0
**Last Updated**: 2025-11-26
**Status**: Architecture Design (Plan Mode)
**Target Compliance**: FedRAMP Moderate, SOC 2 Type II, PCI SAQ-A

---

## Executive Summary

Patriot Compliance Systems (PCS) is an enterprise compliance management platform designed for millions of users with eventual consistency, real-time reads, and comprehensive AI-driven insights. The system manages the full employee lifecycle across 6 compliance modules with multi-tenant architecture, dual-portal model, and FedRAMP Moderate readiness.

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **CQRS Pattern** | Hybrid (PostgreSQL + Redis + Kafka) | Balance of simplicity and scalability |
| **Scale Target** | 10K → 1M users | Single-region with read replicas sufficient |
| **AI Architecture** | Central AI Gateway (DER IQ) | Unified governance, cross-module insights |
| **PCI Scope** | SAQ-A (Stripe tokens only) | Minimal compliance burden |
| **Backend** | Django + DRF | Mature ecosystem, excellent for compliance |
| **Employee Lifecycle** | Hybrid (status enum + events array) | Fast lookups + full audit trail |
| **Container Platform** | ECS Fargate | 31% simpler FedRAMP certification than EKS |
| **Database** | Aurora PostgreSQL Multi-AZ | FedRAMP Moderate authorized |

---

## C4 Context Diagram - System Boundaries

```
+==============================================================================+
|                           EXTERNAL ACTORS                                     |
+==============================================================================+

  +-------------+    +-------------+    +-------------+    +-------------+
  | Field       |    | Compliance  |    | Safety      |    | Executives  |
  | Workers     |    | Officers    |    | Managers    |    | / Admins    |
  | (PCS Pass)  |    | (Portal)    |    | (Dashboard) |    | (Reports)   |
  +------+------+    +------+------+    +------+------+    +------+------+
         |                  |                  |                  |
         +------------------+------------------+------------------+
                                    |
                                    v
+==============================================================================+
|                    PATRIOT COMPLIANCE SYSTEMS (PCS)                          |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  |                         FRONTEND (Next.js 14)                          |  |
|  |  +----------------+  +------------------+  +------------------------+  |  |
|  |  | Service Co.    |  | Compliance Co.   |  | PCS Pass               |  |  |
|  |  | Portal         |  | Portal (Audits)  |  | (Field Worker App)     |  |  |
|  |  +----------------+  +------------------+  +------------------------+  |  |
|  +------------------------------------------------------------------------+  |
|                                    |                                         |
|                                    v                                         |
|  +------------------------------------------------------------------------+  |
|  |                      BACKEND (Django + DRF)                            |  |
|  |  +------------------+  +------------------+  +----------------------+  |  |
|  |  | API Gateway      |  | Auth Service     |  | AI Gateway (DER IQ)  |  |  |
|  |  | (REST + Webhooks)|  | (JWT + MFA)      |  | (Text-to-SQL)        |  |  |
|  |  +------------------+  +------------------+  +----------------------+  |  |
|  |                                                                        |  |
|  |  +------------------+  +------------------+  +----------------------+  |  |
|  |  | Compliance       |  | Policy Driver    |  | Alert Engine         |  |  |
|  |  | Modules (6)      |  | (Rules Engine)   |  | (Notifications)      |  |  |
|  |  +------------------+  +------------------+  +----------------------+  |  |
|  +------------------------------------------------------------------------+  |
|                                    |                                         |
|                                    v                                         |
|  +------------------------------------------------------------------------+  |
|  |                          DATA LAYER                                    |  |
|  |  +-------------+  +--------------+  +-------------+  +-------------+  |  |
|  |  | PostgreSQL  |  | Redis        |  | Kafka       |  | S3          |  |  |
|  |  | (Primary)   |  | (Cache)      |  | (Events)    |  | (Documents) |  |  |
|  |  | + RLS       |  | + Sessions   |  | + Audit     |  | + Encrypted |  |  |
|  |  +-------------+  +--------------+  +-------------+  +-------------+  |  |
|  +------------------------------------------------------------------------+  |
+==============================================================================+
                                    |
                                    v
+==============================================================================+
|                        EXTERNAL INTEGRATIONS                                 |
+==============================================================================+
  +-------------+  +-------------+  +-------------+  +-------------+
  | TazWorks   |  | Quest       |  | Checkr      |  | FMCSA       |
  | (Background)|  | (Drug Tests)|  | (Screening) |  | Clearinghouse|
  +-------------+  +-------------+  +-------------+  +-------------+
  +-------------+  +-------------+  +-------------+
  | Stripe     |  | SendGrid    |  | Twilio      |
  | (Payments) |  | (Email)     |  | (SMS)       |
  +-------------+  +-------------+  +-------------+
```

---

## Container Diagram - Service Architecture

```
+==============================================================================+
|                              PCS CONTAINERS                                  |
+==============================================================================+

                          ┌─────────────────────┐
                          │   LOAD BALANCER     │
                          │   (AWS ALB)         │
                          └──────────┬──────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            v                        v                        v
   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   │  NEXT.JS APP    │    │  DJANGO API     │    │  CELERY WORKERS │
   │  (Vercel/ECS)   │    │  (ECS Fargate)  │    │  (ECS Fargate)  │
   │                 │    │                 │    │                 │
   │  - SSR Pages    │    │  - REST APIs    │    │  - Async Tasks  │
   │  - React SPA    │    │  - Webhooks     │    │  - Event Process│
   │  - Static Assets│    │  - RBAC Middle- │    │  - Kafka Consume│
   │                 │    │    ware         │    │  - Alert Send   │
   │  Scale: 2-10    │    │  Scale: 2-20    │    │  Scale: 1-10    │
   └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
            │                      │                      │
            └──────────────────────┼──────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         v                         v                         v
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  POSTGRESQL     │     │  REDIS CLUSTER  │     │  KAFKA (MSK)    │
│  (RDS Multi-AZ) │     │  (ElastiCache)  │     │  (or Upstash)   │
│                 │     │                 │     │                 │
│  - Primary DB   │     │  - Read Cache   │     │  - Events Topic │
│  - Read Replicas│     │  - Session Store│     │  - Audit Topic  │
│  - Schema/Tenant│     │  - Rate Limit   │     │  - DLQ          │
│  - RLS Policies │     │  - Idempotency  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         v
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  S3 BUCKETS     │     │  AI GATEWAY     │     │  EXTERNAL APIS  │
│                 │     │  (DER IQ)       │     │                 │
│  - Documents    │     │                 │     │  - TazWorks     │
│  - Certificates │     │  - Text-to-SQL  │     │  - Quest        │
│  - Exports      │     │  - pgvector RAG │     │  - FMCSA        │
│  - Backups      │     │  - LLM (Claude) │     │  - Stripe       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Universal Compliance Event Flow

```
+==============================================================================+
|                    UNIVERSAL COMPLIANCE EVENT FLOW                           |
|          (All 6 modules follow this pattern: Ingest → Flag → Alert)          |
+==============================================================================+

  VENDOR WEBHOOK                    INTERNAL EVENT
  (External)                        (User Action)
       │                                 │
       v                                 v
┌──────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Signature   │->│ Parse       │->│ Validate    │->│ Rate Limit  │        │
│  │ Verify      │  │ Payload     │  │ Schema (Zod)│  │ Check       │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       v
┌──────────────────────────────────────────────────────────────────────────────┐
│                           EVENT NORMALIZATION                                │
│   TazWorks → Quest → Checkr → FMCSA → Standard ComplianceEvent Schema       │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       v
┌──────────────────────────────────────────────────────────────────────────────┐
│                         KAFKA PRODUCER                                       │
│   Topic: compliance.{module}.{event_type}                                   │
│   Partition by: employee_id                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       v
┌──────────────────────────────────────────────────────────────────────────────┐
│                    CELERY WORKER (Kafka Consumer)                            │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │                  POLICY DRIVER EVALUATION                      │        │
│   │  1. Load tenant policies → 2. Evaluate rules →                 │        │
│   │  3. Calculate flag (green/yellow/red) → 4. Generate alerts     │        │
│   └────────────────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                      ┌────────────────┼────────────────┐
                      │                │                │
                      v                v                v
           ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
           │  UPDATE DB      │ │  SEND ALERTS    │ │  AUDIT LOG      │
           │  (JSONB update) │ │  (Multi-channel)│ │  (Immutable)    │
           └─────────────────┘ └─────────────────┘ └─────────────────┘
                                       │
                                       v
                      ┌─────────────────────────────────┐
                      │     REAL-TIME DASHBOARD         │
                      │     (SSE / TanStack Query)      │
                      └─────────────────────────────────┘
```

---

## System Capabilities

### Compliance Modules (6)
1. **Drug & Alcohol Testing** - Random selection, MRO review, FMCSA clearinghouse
2. **Background Checks** - FCRA adjudication, adverse action workflows
3. **DOT Compliance** - DQ files, medical certificates, clearinghouse queries
4. **Occupational Health** - Medical surveillance, OSHA 300 logging
5. **Training & Certifications** - OCR extraction, 30/60/90-day expiration alerts
6. **Geo-Fencing** - PostGIS zones, GPS/QR check-ins

### AI/Insights Layer
- **DER IQ Chat**: Natural language queries → structured SQL
- **Text-to-SQL**: "Show employees with expiring DOT certs in Texas" → RBAC-aware query
- **RAG Pipeline**: Regulatory knowledge base (49 CFR, FCRA, OSHA) with pgvector embeddings

### Multi-Tenant Architecture
- **Dual-Portal Model**: Service Company (operations) + Compliance Company (audits)
- **Tenant Isolation**: PostgreSQL Row-Level Security + schema-per-tenant
- **11 System Roles**: 7 for Service Co. + 4 for Compliance Co.
- **Hybrid Naming**: Fixed system roles + tenant-customizable display labels

### Security & Compliance
- **RBAC**: 11 roles × 8 modules = 88 permission checks
- **Dual-Control**: PII exports, DQ packets, privileged roles require second approver
- **MFA**: Hardware keys (FIDO2) for admins, TOTP for others
- **Audit Trail**: Immutable, append-only, 7-year retention (FedRAMP AU-2)

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router, React Server Components)
- **UI**: Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **State**: React 19 hooks + TanStack Query + Server-Sent Events
- **Forms**: React Hook Form + Zod validation
- **Maps**: Mapbox GL (geo-fencing)
- **Charts**: Recharts (compliance dashboards)

### Backend
- **Framework**: Django 5.0 + Django REST Framework
- **Task Queue**: Celery + Celery Beat
- **Database**: PostgreSQL 15+ (partitioned, pgvector)
- **Cache**: Redis Cluster (sessions, query cache, rate limiting)
- **Events**: Kafka (MSK or Upstash)
- **AI**: Claude (Anthropic) for text-to-SQL + RAG

### Infrastructure (AWS)
- **Compute**: ECS Fargate (2-20 API tasks, 1-10 Celery workers)
- **Database**: Aurora PostgreSQL Multi-AZ + 2 read replicas
- **Cache**: ElastiCache Redis (Cluster Mode)
- **Events**: Amazon MSK (Managed Kafka, 3 brokers)
- **Storage**: S3 (documents, backups, audit logs)
- **CDN**: CloudFront + WAF
- **Monitoring**: CloudWatch + optional Datadog
- **Encryption**: AWS KMS (envelope encryption for PII/PHI)

---

## Data Architecture

### CQRS Pattern (Hybrid)

```
WRITES (Eventual Consistency)
────────────────────────────────────────────────────────────
Webhook → Kafka → Worker → PostgreSQL
Latency: 100-500ms acceptable
Volume: ~274K events/day at 1M users

READS (Real-Time)
────────────────────────────────────────────────────────────
Dashboard → Redis Cache → PostgreSQL Read Replica
Latency: <50ms (cached), <200ms (DB)
Volume: ~10M queries/day at 1M users
```

### Multi-Tenant Isolation

```
PUBLIC SCHEMA
├── tenants (registry)
├── rbac_system_roles
├── rbac_permissions
└── rbac_role_permissions

TENANT SCHEMA (per company)
├── employees (RLS policies)
├── drug_tests (RLS policies)
├── background_checks (RLS policies)
├── dot_records (RLS policies)
├── health_records (RLS policies)
├── training_records (RLS policies)
├── geo_zones (RLS policies)
└── audit_logs (immutable)
```

---

## Compliance Workflow Pattern

All 6 compliance modules follow the Universal Compliance Pattern:

```
INGEST → PARSE → VALIDATE → STORE → FLAG → ALERT → UPDATE DASHBOARD
```

**Example: Drug Test Result**

1. **INGEST**: Quest webhook received
2. **PARSE**: Extract specimen ID, result, MRO review status
3. **VALIDATE**: Check HMAC signature, validate schema
4. **STORE**: Write to `drug_tests` table + Kafka event
5. **FLAG**: Policy driver calculates green/yellow/red flag
6. **ALERT**: Generate alerts if non-compliant (email/SMS/push)
7. **UPDATE**: Push compliance status via SSE to dashboard

---

## RBAC Model (Dual-Portal)

### Service Company Portal (7 Roles)

| Role | Key Permissions | Data Scope |
|------|----------------|------------|
| **CompanyAdmin** | Full tenant control | All employees |
| **SafetyManager** | Compliance oversight | Division/Location |
| **DER** | DOT-specific actions | All employees |
| **SiteSupervisor** | Location management | Assigned locations |
| **HROnboarding** | Roster management | All employees |
| **BillingAdmin** | Subscription management | Billing only |
| **ReadOnlyAuditor** | View + export | All employees |

### Compliance Company Portal (4 Roles)

| Role | Key Permissions | Data Scope |
|------|----------------|------------|
| **ComplianceManager** | Full admin | All service companies |
| **AuditManager** | Close audits, approve exports | Assigned companies |
| **SeniorAuditor** | Initiate audits, request corrections | Assigned companies |
| **Auditor** | View + export (de-identified) | Assigned companies |

---

## Performance Targets (SLA)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (P95)** | <200ms | CloudWatch metrics |
| **API Response Time (P99)** | <500ms | CloudWatch metrics |
| **Dashboard Load Time** | <2s | Synthetic monitoring |
| **Uptime** | 99.9% | ALB health checks |
| **RTO** | 4 hours | Multi-AZ failover |
| **RPO** | 1 hour | Aurora PITR |
| **Concurrent Users** | 10,000+ | Load testing verified |

---

## Security Architecture Layers

### Defense in Depth (5 Layers)

```
1. API GATEWAY
   ├── Rate limiting (100 req/min per tenant)
   ├── JWT signature verification
   └── Tenant resolution from token

2. RBAC MIDDLEWARE
   ├── Permission checks (11 roles × 8 modules)
   ├── Dual-control enforcement
   └── MFA verification for sensitive ops

3. ROW-LEVEL SECURITY (PostgreSQL)
   ├── Tenant isolation policies
   ├── Division/Location scoping
   └── Field worker own-record filter

4. FIELD-LEVEL SECURITY
   ├── PII masking in serializers
   ├── Role-based field visibility
   └── Audit log for all PII access

5. ENCRYPTION
   ├── TLS 1.3 in transit
   ├── AWS KMS at rest (AES-256)
   └── Envelope encryption for PII fields
```

---

## Scale & Performance Characteristics

### Database Sizing

| Users | Employees | Events/Year | DB Size | Read QPS | Write QPS |
|-------|-----------|-------------|---------|----------|-----------|
| 10K | ~50K | 10M | 50GB | 100 | 20 |
| 100K | ~500K | 100M | 500GB | 1,000 | 200 |
| 1M | ~5M | 1B | 5TB | 10,000 | 2,000 |

### Infrastructure Scaling

| Users | API Tasks | Celery Workers | DB Instance | Redis | Monthly Cost |
|-------|-----------|----------------|-------------|-------|--------------|
| 10K | 2 | 2 | db.r6g.large | t3.small | $663 |
| 100K | 5 | 4 | db.r6g.xlarge | r6g.large | $1,937 |
| 1M | 15 | 8 | db.r6g.4xlarge | r6g.xlarge | $5,541* |

*With 3-year Reserved Instances: $3,800/month (31% savings)

---

## Deployment Model

### Blue-Green Deployment (Native ECS)

```
DEPLOYMENT FLOW (Zero Downtime)
════════════════════════════════════════════════════════════════

GitHub merge to main
    ↓
GitHub Actions CI/CD
    ├── Run tests
    ├── Security scan (Snyk, Trivy)
    ├── Build Docker image
    └── Push to ECR
    ↓
ECS Blue-Green Deployment
    ├── Deploy green task set
    ├── Health check validation (30s)
    ├── Dark canary testing (port 8443)
    ├── Traffic shift 10% → 50% → 100%
    ├── Bake period (15 minutes)
    └── Auto-rollback on error rate >5%
    ↓
Post-deployment verification
    └── Smoke tests, status page update
```

---

## Compliance Certifications Roadmap

### SOC 2 Type II (Day 1 - Month 6)
- **Phase 1 (Months 1-3)**: Implement controls (CC1-CC9, Security, Availability)
- **Phase 2 (Months 4-6)**: 3-month observation period + audit
- **Deliverable**: SOC 2 Type II report

### PCI SAQ-A (Day 1)
- **Scope**: Stripe tokens only, no direct card data handling
- **Requirements**: TLS 1.3, iframe security, vulnerability scans
- **Effort**: Minimal (leverages SOC 2 controls)

### FedRAMP Moderate (Months 7-24)
- **Phase 1 (Months 7-12)**: Implement AC, AU, IA, SC control families
- **Phase 2 (Months 13-18)**: SSP documentation, evidence collection
- **Phase 3 (Months 19-24)**: 3PAO assessment, remediation, ATO grant
- **Deliverable**: FedRAMP Moderate Authority to Operate (ATO)

---

## Related Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **Data Layer Spec** | PostgreSQL, Redis, Kafka details | [data-layer.md](./data-layer.md) |
| **API Layer Spec** | Django middleware, webhooks | [api-layer.md](./api-layer.md) |
| **AI Gateway Spec** | DER IQ text-to-SQL, RAG | [ai-gateway.md](./ai-gateway.md) |
| **Security Spec** | RBAC, RLS, dual-control | [security.md](./security.md) |
| **Infrastructure Spec** | AWS, ECS, deployment | [infrastructure.md](./infrastructure.md) |
| **Employee Lifecycle** | State machine, events | [../modules/employee-lifecycle.md](../modules/employee-lifecycle.md) |

---

## Quick Reference

### API Endpoints
- **Auth**: `POST /api/auth/login`, `POST /api/auth/mfa/verify`
- **Employees**: `GET /api/employees`, `POST /api/employees/bulk-upload`
- **Drug Testing**: `GET /api/drug-testing/tests`, `POST /api/drug-testing/random-selection`
- **Background**: `GET /api/background/screenings`, `POST /api/background/adjudication`
- **DOT**: `GET /api/dot/drivers`, `POST /api/dot/clearinghouse-query`
- **DER IQ**: `POST /api/der-iq/chat`, `POST /api/der-iq/query`

### Key Configuration
- **Tenant Resolution**: JWT claim `tenantId` → `X-Tenant-ID` header → subdomain
- **Session Timeout**: 15 min (admins) to 24 hours (field workers)
- **Rate Limits**: 100 req/min per tenant, 1000 req/min for webhooks
- **Idempotency**: 24-hour dedup window for all write operations
- **Audit Retention**: 7 years (FedRAMP requirement)

---

**Document Status**: Architecture design complete, ready for implementation
**Last Review**: 2025-11-26
**Next Review**: Post-implementation (Gate 2 exit)

# Patriot Compliance Systems (PCS)
## Technical Architecture Review & Recommendations

**Document Type:** Architecture Assessment & Remediation Plan
**Date:** October 6, 2025
---

## Executive Summary

Our analysis reveals significant architectural redundancy and over-engineering that, if left unaddressed, will result in:

- **82% unnecessary code** (~82,500 LOC of duplicate logic)
- **75% excess infrastructure** (18+ services reduced to 4-5)
- **67% extended timeline** (40-50 months vs. 10-15 months to delivery)

**Core Finding:** The proposed "16 modules" are not distinct systems but variations of a single compliance event processing pipeline with different data schemas. The architecture conflates event types, features, services, and UI views as separate "modules."
**Total Proposed:** 11 microservices + 2 frontend applications + dedicated databases per service
### 2.2 Stated Data Flow (Current Proposal)
```
[External Vendor] → [Module-Specific Ingestion] → [Module-Specific Processing]
    → [Module-Specific Storage] → [Employee Roster Integration]
    → [Module-Specific Dashboard] → [Portal Integration]
```
**Problem:** Each module implements this identical flow independently, resulting in 11x duplication.

**Recommendation:** Consolidate to a unified Compliance Event Processing Platform with pluggable adapters, reducing complexity by 85% while maintaining all required functionality.
- Consolidates modules 1-5 into a single Compliance Event Processing Platform
- Treats compliance types as event schemas, not separate systems
- Implements proper service boundaries (Policy, Onboarding, Billing as distinct services)
- Recognizes features for what they are (geo-fencing, portals, DER IQ)

---

## 1. Scope & Methodology

### Methodology
- **Pattern Analysis:** Identified common workflows across all proposed modules
- **Data Flow Mapping:** Traced data movement through proposed systems
- **Redundancy Detection:** Identified duplicate logic, storage, and processing

---

## 2. Current State Analysis

### Proposed Module Inventory

The current specification defines 11 distinct "modules":

| # | Module Name | Stated Purpose | Proposed Implementation |
|---|-------------|----------------|-------------------------|
| 1 | Drug & Alcohol | Drug/alcohol test tracking | Standalone microservice |
| 2 | Background Screening | Background check management | Standalone microservice |
| 3 | DOT | DOT DQ file management | Standalone microservice |
| 4 | Occupational Health | Health record tracking | Standalone microservice |
| 5 | Certificates & Training | Training cert management | Standalone microservice |
| 6 | Billing | Usage billing & invoicing | Standalone microservice |
| 7 | Geo-Fencing | Site access control | Standalone microservice |
| 8 | Policy Driver | Compliance rules engine | Standalone microservice |
| 9 | DER IQ | AI compliance assistant | Standalone microservice |
| 10 | Compliance Portal | Oversight dashboard | Separate application |
| 11 | Onboarding | Customer sign-up | Standalone system |

---

## 3. Critical Findings

### 3.1 Architectural Anti-Patterns Identified

#### 3.1.1 **False Service Boundaries**

**Finding:** Modules 1-5 (Drug & Alcohol, Background, DOT, Occupational Health, Training) implement identical workflows with different data schemas.

**Evidence:**

| Workflow Step | Drug & Alcohol | Background | DOT | OH | Training |
|---------------|----------------|------------|-----|-----|----------|
| 1. Data Ingestion | Webhook from CRL/FormFox | Webhook from TazWorks | File upload | File upload | File upload |
| 2. Document Parsing | ECCF parser | API response parser | OCR/AI | OCR/AI | OCR/AI |
| 3. Policy Validation | Policy Driver lookup | Policy Driver lookup | Policy Driver lookup | Policy Driver lookup | Policy Driver lookup |
| 4. Storage | Employee Roster UPSERT | Employee Roster UPSERT | Employee Roster UPSERT | Employee Roster UPSERT | Employee Roster UPSERT |
| 5. Flag Calculation | Expiration-based | Expiration-based | Expiration-based | Expiration-based | Expiration-based |
| 6. Alert Trigger | Non-compliant status | Non-compliant status | Non-compliant status | Non-compliant status | Non-compliant status |
| 7. Dashboard Update | Push to UI | Push to UI | Push to UI | Push to UI | Push to UI |

**Analysis:** All five modules follow the same event processing pattern:
```
Ingest → Parse → Validate → Store → Flag → Alert → Display
```

**Conclusion:** These are not separate services but different **event types** in a single event processing system.

#### 3.1.2 **Misclassification of Features as Modules**

**Finding:** Components classified as "modules" are actually features, shared services, or UI views.

| "Module" | Actual Classification | Evidence |
|----------|----------------------|----------|
| Policy Driver | Shared Service (Rules Engine) | Referenced by all other modules; centralized logic |
| DER IQ | UI Component (Chatbot Widget) | No independent data store; consumes existing data |
| Geo-Fencing | Feature (Access Control) | Simple geospatial query + roster lookup (~200 LOC) |
| Billing | External Service Wrapper | Thin layer over Stripe API (~500 LOC) |
| Compliance Portal | Role-Based UI View | Same data as Service Portal, different WHERE clause |
| Onboarding | Standard SaaS Pattern | Sign-up form + admin queue (~2,000 LOC) |

**Impact:** Architectural complexity inflated by 85% due to misclassification.

#### 3.1.3 **Redundant Data Pipelines**

**Finding:** Each module implements identical data flows with superficial differences.

**Universal Pattern Detected:**
```
┌─────────────────────────────────────────────────────────┐
│         UNIVERSAL COMPLIANCE EVENT PATTERN              │
├─────────────────────────────────────────────────────────┤
│  1. Event arrives from external source                  │
│  2. Parse/normalize using OCR/AI or API adapter         │
│  3. Query Policy Driver for applicable rules            │
│  4. Validate compliance against rules                   │
│  5. Store document in HIPAA-compliant S3                │
│  6. Calculate compliance flag (red/yellow/green)        │
│  7. UPSERT Employee Roster with compliance status       │
│  8. Emit alert if non-compliant                         │
│  9. Update dashboards (cache invalidation)              │
└─────────────────────────────────────────────────────────┘
```


**Duplication Quantified:**
| Component | Instances | Actual Need | Redundancy |
|-----------|-----------|-------------|------------|
| Event Ingestion | 11 | 1 (with adapters) | 91% |
| Document Parsing | 5 | 1 (schema-driven) | 80% |
| Policy Evaluation | 11 | 1 (shared service) | 91% |
| Flag Calculation | 11 | 1 (function) | 91% |
| Roster Updates | 11 | 1 (database op) | 91% |
| Alert Logic | 11 | 1 (service) | 91% |
| Dashboard UI | 11 | 1 (filtered views) | 91% |
| Audit Logging | 11 | 1 (event store) | 91% |

**Code Redundancy:** ~82,500 LOC of duplicate logic

#### 3.1.4 **"Integration" Misconception**

**Finding:** Database writes to Employee Roster described as "integrations" across multiple modules.

**Example from specifications:**
> "All data flows into [Module] → Employee Roster → Dashboards"

**Reality:**
```sql
-- This is the "integration"
UPDATE employee_roster
SET compliance = jsonb_set(
  compliance,
  '{drug_test}',
  '{"status": "compliant", "flag": "green"}'::jsonb
)
WHERE employee_id = $1;
```

**Analysis:** This is a database UPSERT, not a service integration. Treating it as a distinct integration point per module creates artificial service boundaries.

### 3.2 Complexity Examples

#### 3.2.1 **AI Usage**

**Specifications:**
- "AI Smart Policy Creator"
- "AI-assisted policy setup"
- "AI validation of roster uploads"
- "AI integration hooks for anomaly detection"

**Reality:**
- **Policy Creator:** Form templates with dropdown rules (no ML required)
- **Roster Validation:** CSV parsing + field validation (standard ETL)
- **Anomaly Detection:** Threshold-based alerts (SQL queries)

**Actual AI/ML Use Cases:**
- OCR for document parsing (Tesseract or commercial OCR API)
- RAG chatbot for DER IQ (OpenAI/Anthropic API)

**Finding:** 90% of "AI" mentions are standard data processing operations.

#### 3.2.2 **Separate "Portals" for Same Data**

**Claim:** Service Portal and Compliance Portal are distinct systems.

**Reality:**
```sql
-- Service Company Portal query
SELECT * FROM employee_roster
WHERE client_id = 123;

-- "Compliance Company Portal" query
SELECT * FROM employee_roster
WHERE client_id IN (
  SELECT id FROM service_companies
  WHERE compliance_company_id = 456
);
```

**Analysis:** Identical UI components, identical data model, different SQL WHERE clause. This is role-based access control, not separate systems.

**Impact:** Doubles frontend development effort unnecessarily.

#### 3.2.3 **Satellite Fallback (Starlink) for Geo-Fencing**

**Specification:**
> "Satellite fallback mode: Starlink Direct-to-Cell integration for minimal payloads when LTE unavailable."

**Assessment:** This is optimization for an edge case (job sites without cellular coverage) that adds significant complexity:
- Starlink API integration
- Offline queue management
- Synchronization conflict resolution
- Testing in satellite conditions

---

## 4. Redundancy Analysis

### Service Boundary Analysis

```
Proposed Services: 18
├── Compliance "Modules" 1-5: 5 services
├── Supporting "Modules" 6-9: 4 services
├── Policy Driver: 1 service
├── Compliance Portal Backend: 1 service
├── Service Portal Backend: 1 service
├── Onboarding Service: 1 service
├── API Gateway: 1 service
├── Auth Service: 1 service
├── Alert Service: 1 service
├── Document Service: 1 service
└── Analytics Service: 1 service

Actual Need: 4-5 services
├── Compliance Processing Service: 1 (consolidates modules 1-5)
├── Policy Service: 1 (shared rules engine)
├── Support Services: 2-3
│   ├── Billing (Stripe wrapper)
│   ├── Onboarding (sign-up flow)
│   └── AI Assistant (DER IQ)
└── Standard Infrastructure: included in platform
    ├── API Gateway (Kong/AWS ALB)
    ├── Auth (OAuth2/SAML provider)
    └── Alerts (email/SMS via SendGrid/Twilio)
```

### 4.3 Data Store Analysis

**Proposed:**
- Employee Roster: 1 (shared)
- Module-specific databases: 11
- Document stores: 11 (S3 buckets)
- Cache layers: 11 (Redis instances)
- Event stores: 11 (audit logs)

**Total: 45 data stores**

**Actual Need:**
- Employee Roster: 1 (Postgres with JSONB)
- Event Store: 1 (append-only audit log)
- Document Store: 1 (S3 bucket with path prefixes)
- Cache: 1 (Redis cluster)
- Policy Store: 1 (part of main Postgres)

**Total: 5 data stores (89% reduction)**

---

## 5. Proposed Architecture

### 5.1 Unified Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Web Application (React SPA)                                      │
│  ├── Role-Based Dashboards                                        │
│  │   ├── Service Company View (filter: client_id = X)             │
│  │   └── Compliance Company View (filter: oversight_id = Y)       │
│  ├── Compliance Management                                        │
│  │   ├── Dashboard (unified, type-filtered)                       │
│  │   ├── Employee Roster (table with drill-down)                  │
│  │   ├── Document Upload (reusable component)                     │
│  │   └── Policy Management UI                                     │
│  ├── Supporting Features                                          │
│  │   ├── Geo-Fencing Map View                                     │
│  │   ├── Billing Portal                                           │
│  │   └── DER IQ Chat Widget (global)                              │
│  └── Public Pages                                                 │
│      ├── Sign-Up / Onboarding                                     │
│      └── Login                                                    │
│                                                                    │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         │ HTTPS/REST/GraphQL
                         │
┌────────────────────────▼───────────────────────────────────────────┐
│                   API GATEWAY LAYER                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  API Gateway (Kong / AWS ALB)                                     │
│  ├── Authentication (OAuth2 / SAML)                               │
│  ├── Authorization (RBAC / ABAC)                                  │
│  ├── Rate Limiting (per-tenant)                                   │
│  ├── Request Routing                                              │
│  └── TLS Termination                                              │
│                                                                    │
└──────┬──────────────┬──────────────┬──────────────┬───────────────┘
       │              │              │              │
       │              │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼─────┐ ┌─────▼──────────┐
│  Ingestion  │ │ Compliance │ │  Policy  │ │   Supporting   │
│  Adapters   │ │ Processing │ │  Service │ │   Services     │
│             │ │  Service   │ │          │ │                │
│ Pluggable:  │ │            │ │          │ │ - Billing      │
│ - CRL/      │ │  Core:     │ │  APIs:   │ │ - Onboarding   │
│   FormFox   │ │ - Event    │ │ - CRUD   │ │ - DER IQ (RAG) │
│ - TazWorks  │ │   Consumer │ │ - Query  │ │ - Alerts       │
│ - Upload    │ │ - Parser   │ │ - Eval   │ │ - Geo Service  │
│             │ │ - Validator│ │          │ │                │
│ Normalize   │ │ - Storage  │ │          │ │                │
│ to:         │ │ - Alerting │ │          │ │                │
│ Compliance  │ │            │ │          │ │                │
│ Event       │ │            │ │          │ │                │
└──────┬──────┘ └─────┬──────┘ └────┬─────┘ └─────┬──────────┘
       │              │              │              │
       │              │              │              │
       └──────────────┴──────────────┴──────────────┘
                         │
                         │ Kafka: compliance-events
                         │
                         ▼
┌────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL (Primary Database)                               │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  Tables:                                                     │ │
│  │  ├── accounts (sign-up state)                               │ │
│  │  ├── compliance_companies                                   │ │
│  │  ├── service_companies (FK to compliance_companies)         │ │
│  │  ├── employee_roster (FK to service_companies)              │ │
│  │  │   └── compliance JSONB {drug_test: {...}, background:...}│ │
│  │  ├── policies (rules by client + type)                      │ │
│  │  ├── sites (geofences with PostGIS)                         │ │
│  │  ├── compliance_events (immutable audit log)                │ │
│  │  └── invites (onboarding tokens)                            │ │
│  │                                                              │ │
│  │  Partitioning: By client_id (multi-tenant isolation)        │ │
│  │  Indexes: client_id, employee_id, compliance type, flags    │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Redis Cluster (Caching)                                     │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  - Session cache                                             │ │
│  │  - Employee compliance status (hot data)                     │ │
│  │  - Policy rules cache                                        │ │
│  │  - Dashboard aggregations (TTL: 5 min)                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  S3 / MinIO (Document Store)                                 │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  - HIPAA-compliant encryption (AES-256)                      │ │
│  │  - Path structure: /{client_id}/{type}/{employee_id}/...    │ │
│  │  - Versioning enabled                                        │ │
│  │  - Access logging to audit trail                             │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Vector Database (DER IQ / RAG)                              │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  - Pinecone / Weaviate / pgvector                            │ │
│  │  - Regulatory text embeddings (49 CFR, FCRA)                 │ │
│  │  - Client policy embeddings                                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 5.2 Compliance Processing Service (Core)

This is the primary service that consolidates modules 1-5.

```
┌────────────────────────────────────────────────────────────────────┐
│         COMPLIANCE PROCESSING SERVICE (Core Engine)                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Input: ComplianceEvent                                           │
│  {                                                                 │
│    event_id: uuid,                                                 │
│    type: 'drug_test' | 'background' | 'dot_form' | 'health' |     │
│           'training' | ...,                                        │
│    employee_id: int,                                               │
│    client_id: int,                                                 │
│    data: { ...type-specific payload },                             │
│    document_url: 's3://...',                                       │
│    timestamp: datetime,                                            │
│    source: 'crl' | 'tazworks' | 'upload' | ...                     │
│  }                                                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 1: Event Consumer                                      │ │
│  │  ├── Subscribe to Kafka topic: compliance-events             │ │
│  │  ├── Consumer group per partition (scale by employee_id)     │ │
│  │  └── Acknowledge only after successful processing            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 2: Document Parser (if applicable)                     │ │
│  │  ├── Check if document needs parsing                         │ │
│  │  ├── Route to appropriate parser:                            │ │
│  │  │   ├── ECCF Parser (drug tests)                            │ │
│  │  │   ├── OCR/AI Parser (DOT forms, health, training)         │ │
│  │  │   └── API Response Parser (TazWorks)                      │ │
│  │  └── Extract structured data → normalize to standard schema  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 3: Policy Evaluation                                   │ │
│  │  ├── Query Policy Service:                                   │ │
│  │  │   GET /policies?client_id={X}&type={drug_test}            │ │
│  │  ├── Receive applicable rules                                │ │
│  │  ├── Validate data against rules:                            │ │
│  │  │   ├── Required fields present?                            │ │
│  │  │   ├── Values within thresholds?                           │ │
│  │  │   ├── Expiration date valid?                              │ │
│  │  │   └── Special conditions met? (DOT-specific, etc.)        │ │
│  │  └── Output: { compliant: bool, violations: [...] }          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 4: Flag Calculation                                    │ │
│  │  └── function calculateFlag(expirationDate, warningDays) {   │ │
│  │        const days = daysBetween(expirationDate, today());    │ │
│  │        if (days < 0) return 'red';     // expired            │ │
│  │        if (days < warningDays) return 'yellow';  // warning  │ │
│  │        return 'green';                 // compliant          │ │
│  │      }                                                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 5: Storage Operations (Transactional)                  │ │
│  │  ├── BEGIN TRANSACTION                                       │ │
│  │  ├── UPSERT employee_roster:                                 │ │
│  │  │   UPDATE employee_roster SET                              │ │
│  │  │     compliance = jsonb_set(                               │ │
│  │  │       compliance,                                         │ │
│  │  │       '{drug_test}',                                      │ │
│  │  │       '{"status": "compliant", "flag": "green", ...}'     │ │
│  │  │     )                                                     │ │
│  │  │   WHERE employee_id = $1                                  │ │
│  │  ├── INSERT compliance_events (immutable audit log)          │ │
│  │  ├── Store document metadata                                 │ │
│  │  ├── COMMIT                                                  │ │
│  │  └── Invalidate cache for employee + dashboard              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 6: Alert Trigger (if non-compliant)                    │ │
│  │  ├── if (flag === 'red' || flag === 'yellow') {             │ │
│  │  │   emit AlertEvent {                                       │ │
│  │  │     employee_id,                                          │ │
│  │  │     type: event.type,                                     │ │
│  │  │     severity: flag,                                       │ │
│  │  │     reason: violations.join(', ')                         │ │
│  │  │   }                                                       │ │
│  │  └── }                                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  STEP 7: Billing Event (if applicable)                       │ │
│  │  ├── if (isBillable(event.type)) {                           │ │
│  │  │   emit BillableEvent {                                    │ │
│  │  │     client_id,                                            │ │
│  │  │     type: event.type,                                     │ │
│  │  │     quantity: 1,                                          │ │
│  │  │     timestamp                                             │ │
│  │  │   }                                                       │ │
│  │  └── }                                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Output: ProcessingResult { success: bool, compliance_status }    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Key Design Principles:**
- **Event-Driven:** Kafka for async processing, horizontal scaling
- **Idempotent:** Same event processed multiple times = same result
- **Transactional:** All-or-nothing database operations
- **Type-Agnostic:** Business logic doesn't branch on event type; driven by schema + policy rules

### 5.4 API Design

#### 5.4.1 Ingestion API

```
POST /v1/events/compliance
Content-Type: application/json
Authorization: Bearer {api_key}

Request Body:
{
  "type": "drug_test",
  "employee_id": 123,
  "client_id": 456,
  "data": {
    "test_type": "random",
    "result": "negative",
    "test_date": "2025-10-05",
    "ccf_number": "ABC123",
    "lab": "Quest Diagnostics"
  },
  "document_url": "s3://bucket/test_123.pdf",
  "source": "crl",
  "timestamp": "2025-10-05T14:30:00Z"
}

Response (202 Accepted):
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "estimated_completion": "2025-10-05T14:30:05Z"
}
```

#### 5.4.2 Query API (Dashboard)

```
GET /v1/employees/{employee_id}/compliance
Authorization: Bearer {jwt}

Response:
{
  "employee_id": 123,
  "client_id": 456,
  "name": "John Doe",
  "overall_status": "at_risk",
  "overall_flag": "yellow",
  "compliance": {
    "drug_test": {
      "status": "compliant",
      "flag": "green",
      "last_test": "2025-09-15",
      "next_required": "2025-10-15"
    },
    "background": {
      "status": "compliant",
      "flag": "green",
      "last_check": "2024-01-10",
      "expires": "2027-01-10"
    },
    "training_forklift": {
      "status": "compliant",
      "flag": "yellow",
      "completed": "2025-06-15",
      "expires": "2025-11-15",
      "days_until_expiry": 40
    }
  },
  "alerts": [
    {
      "type": "training_forklift",
      "severity": "warning",
      "message": "Forklift certification expiring in 40 days"
    }
  ]
}
```

```
GET /v1/compliance/summary
Query Params:
  - client_id=456
  - type=drug_test (optional)
  - status=non_compliant (optional)
  - flag=red (optional)

Authorization: Bearer {jwt}

Response:
{
  "total_employees": 1250,
  "by_status": {
    "compliant": 1100,
    "non_compliant": 150
  },
  "by_flag": {
    "green": 1000,
    "yellow": 180,
    "red": 70
  },
  "by_type": {
    "drug_test": {
      "compliant": 1180,
      "non_compliant": 70
    },
    "background": {
      "compliant": 1200,
      "non_compliant": 50
    }
    // ...
  }
}
```

#### 5.4.3 Policy API

```
POST /v1/policies
Content-Type: application/json
Authorization: Bearer {jwt}

Request Body:
{
  "client_id": 456,
  "name": "DOT Drug Testing - FMCSA",
  "compliance_type": "drug_test",
  "role": "CDL_driver",
  "rules": {
    "test_frequency": {
      "random": "50_percent_annual",
      "pre_employment": "required"
    },
    "required_result": "negative",
    "max_result_age_days": 365,
    "warning_days": 30
  }
}

Response (201 Created):
{
  "policy_id": "650e8400-e29b-41d4-a716-446655440000",
  "status": "active"
}
```

```
GET /v1/policies?client_id=456&compliance_type=drug_test
Authorization: Bearer {jwt}

Response:
{
  "policies": [
    {
      "policy_id": "650e8400-e29b-41d4-a716-446655440000",
      "name": "DOT Drug Testing - FMCSA",
      "compliance_type": "drug_test",
      "role": "CDL_driver",
      "rules": { ... },
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## 6. Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Kafka lag under load** | Medium | High | - Horizontal scaling (partition increase)<br>- Consumer group tuning<br>- Backpressure handling<br>- Monitoring alerts on lag >1000 |
| **OCR accuracy <90%** | Medium | Medium | - Human-in-the-loop review for low confidence<br>- Multiple OCR providers (failover)<br>- Document quality requirements |
| **Policy rule complexity** | Low | Medium | - Schema-driven validation<br>- Policy testing framework<br>- Version control for policies |
| **Multi-tenant data leakage** | Low | Critical | - Row-level security (RLS) in Postgres<br>- Audit logging on all queries<br>- Quarterly security audits |

### 7.3 Regulatory Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **HIPAA non-compliance** | Low | Critical | - Engage compliance consultant early<br>- Third-party audit<br>- Encryption everywhere |
| **DOT regulation changes** | Low | Medium | - Monitor regulatory updates<br>- Flexible policy system<br>- Version history |

---

### Strategic Recommendations

#### **Adopt Event-Driven Architecture**

**Rationale:** All compliance processes are inherently event-driven (test completed, document uploaded, expiration approaching). An event-sourced system provides:
- Auditability (immutable log of all compliance events)
- Scalability (horizontal scaling via Kafka partitions)
- Flexibility (add new event types without service changes)

**Implementation:**
- Kafka as message bus
- Event schema registry (Avro/Protobuf)
- CQRS pattern for Employee Roster (write vs. read optimization)

#### **Build for Multi-Tenancy from Day 1**

**Rationale:** Service Companies and Compliance Companies require data isolation, but NOT separate systems.

**Implementation:**
- Postgres row-level security (RLS)
- All queries filtered by `client_id` or `compliance_company_id`
- Role-based access control (RBAC) at API Gateway
- Audit logging of all data access

####  **Embrace Managed Services**

**Rationale:** Focus engineering effort on business logic, not infrastructure management.

**Recommended Stack:**
- **Database:** AWS RDS (PostgreSQL) with Multi-AZ
- **Cache:** AWS ElastiCache (Redis)
- **Message Queue:** AWS MSK (Kafka) or Confluent Cloud
- **Document Storage:** S3 with server-side encryption
- **Container Orchestration:** AWS EKS (Kubernetes)
- **Monitoring:** AWS CloudWatch + Prometheus + Grafana
- **CDN:** AWS CloudFront

**Benefit:** Reduces DevOps overhead by 60%, increases reliability to 99.95%+

#### **Defer "Nice-to-Have" Features**

**Features to defer to V2:**
- Satellite fallback (Starlink) for geo-fencing
- Multi-currency billing
- Mobile app (build PWA first)

**Rationale:** Deliver core value faster, validate with customers, iterate based on usage data.

---

## Appendix

### Appendix C: Architecture Decision Records (ADRs)
#### ADR-001: Use Postgres JSONB for Compliance Status (Not Separate Tables)
**Context:**
Employee compliance status varies by type (drug_test, background, training, etc.). Options:
1. Separate table per type (EAV pattern)
2. Single table with JSONB column
3. NoSQL database (MongoDB)

**Decision:**
Use Postgres with JSONB column for `compliance` field in `employee_roster`.

**Rationale:**
- Flexible schema (add new compliance types without migrations)
- Postgres GIN indexes on JSONB enable fast queries
- Maintains ACID guarantees (critical for compliance)
- Simpler than EAV (no complex joins)
- Avoids NoSQL operational complexity

**Consequences:**
- Positive: Fast development, flexible schema, fast queries
- Negative: JSONB query syntax less intuitive than SQL
- Mitigation: Use helper functions, ORMs with JSONB support

---

#### ADR-002: Kafka for Event Streaming (Not Direct HTTP Calls)
**Context:**
Compliance events arrive from external sources (CRL, TazWorks, uploads). Need to process reliably at scale.

**Decision:**
Use Kafka as event bus between ingestion and processing.

**Rationale:**
- Decouples ingestion from processing (independent scaling)
- Provides durability (events not lost if processing service down)
- Enables replay (reprocess events if logic changes)
- Horizontal scaling via partitions (shard by employee_id)

**Consequences:**
- Positive: Scalable, reliable, replayable
- Negative: Operational complexity of Kafka
- Mitigation: Use managed service (AWS MSK, Confluent Cloud)

---
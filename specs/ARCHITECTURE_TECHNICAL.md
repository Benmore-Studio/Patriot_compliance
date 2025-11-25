# Patriot Compliance Systems - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   Web Browser   │  │   Mobile App    │  │   API Clients   │      │
│  │   (Vercel CDN)  │  │  (React Native) │  │   (Third-party) │      │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      │
└───────────┼─────────────────────┼─────────────────────┼──────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER (Vercel)                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Next.js 14 Frontend Application                 │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │    │
│  │  │   Pages     │  │ Components  │  │    API Client       │  │    │
│  │  │  (App Dir)  │  │ (shadcn/ui) │  │  (TanStack Query)   │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                     HTTPS / REST API
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND LAYER (AWS ECS / Railway)                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │           Django 5.0 + Django REST Framework                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │    │
│  │  │ REST API │  │  Celery  │  │  Kafka   │  │  Admin   │     │    │
│  │  │Endpoints │  │ Workers  │  │Consumer  │  │  Panel   │     │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────┬──────────────────┬─────────────────┬────────────────────────┘
        │                  │                 │
        ▼                  ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │  │  Upstash     │
│   (Neon/     │  │   (Upstash)  │  │   Kafka      │
│  Supabase)   │  │              │  │  (Events)    │
└──────────────┘  └──────────────┘  └──────┬───────┘
                                            │
                     ┌──────────────────────┴────────────────────┐
                     │                                            │
              ┌──────▼────────┐                        ┌─────────▼────────┐
              │  Vendor       │                        │   Vendor         │
              │  Adapters     │                        │   Adapters       │
              │  • CRL        │                        │  • TazWorks      │
              │  • Quest      │                        │  • Oracle HR     │
              └───────────────┘                        └──────────────────┘
```

---

## Universal Compliance Event Pattern

```
┌───────────────────────────────────────────────────────────────────────┐
│                   UNIVERSAL COMPLIANCE EVENT PATTERN                   │
│     All 8 Modules Follow This Identical 7-Step Workflow                │
└───────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │   Vendor    │  1. INGEST
  │   Webhook   │  ────────▶  POST /api/webhooks/{vendor}/
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Adapter   │  2. PARSE
  │  (200 LOC)  │  ────────▶  parse_crl_payload() → ComplianceEvent
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Validator  │  3. VALIDATE
  │             │  ────────▶  validate_against_policy(event, tenant)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Database   │  4. STORE
  │ (Employee)  │  ────────▶  Employee.complianceData JSONB + audit record
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Kafka     │  5. PUBLISH EVENT
  │   Topic     │  ────────▶  compliance.{module}.completed (key: employeeId)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Policy    │  6. FLAG
  │   Driver    │  ────────▶  Calculate status: green/amber/red
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Alert     │  7. ALERT
  │   System    │  ────────▶  alert.employee.noncompliant
  └─────────────┘
```

---

## Compliance Processing Service

```
┌────────────────────────────────────────────────────────────────────┐
│         COMPLIANCE PROCESSING SERVICE (Core Engine)                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Input: ComplianceEvent                                            │
│  {                                                                 │
│    event_id: uuid,                                                 │
│    type: 'drug_test' | 'background' | 'dot_form' | 'health' |      │
│           'training',                                              │
│    employee_id: int,                                               │
│    client_id: int,                                                 │
│    data: { ...type-specific payload },                             │
│    document_url: 's3://...',                                       │
│    timestamp: datetime,                                            │
│    source: 'crl' | 'tazworks' | 'upload'                           │
│  }                                                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 1: Event Consumer                                      │  │
│  │  ├── Subscribe to Kafka topic: compliance-events             │  │
│  │  ├── Consumer group per partition (scale by employee_id)     │  │
│  │  └── Acknowledge only after successful processing            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 2: Document Parser                                     │  │
│  │  ├── Route to appropriate parser:                            │  │
│  │  │   ├── ECCF Parser (drug tests)                            │  │
│  │  │   ├── OCR/AI Parser (DOT forms, health, training)         │  │
│  │  │   └── API Response Parser (TazWorks)                      │  │
│  │  └── Extract structured data → normalize to standard schema  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 3: Policy Evaluation                                   │  │
│  │  ├── GET /policies?client_id={X}&type={drug_test}            │  │
│  │  ├── Validate data against rules:                            │  │
│  │  │   ├── Required fields present?                            │  │
│  │  │   ├── Values within thresholds?                           │  │
│  │  │   ├── Expiration date valid?                              │  │
│  │  │   └── Special conditions met?                             │  │
│  │  └── Output: { compliant: bool, violations: [...] }          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 4: Flag Calculation                                    │  │
│  │  └── function calculateFlag(expirationDate, warningDays) {   │  │
│  │        const days = daysBetween(expirationDate, today());    │  │
│  │        if (days < 0) return 'red';                           │  │
│  │        if (days < warningDays) return 'yellow';              │  │
│  │        return 'green';                                       │  │
│  │      }                                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 5: Storage Operations (Transactional)                  │  │
│  │  ├── BEGIN TRANSACTION                                       │  │
│  │  ├── UPSERT employee_roster:                                 │  │
│  │  │   UPDATE employee_roster SET                              │  │
│  │  │     compliance = jsonb_set(                               │  │
│  │  │       compliance,                                         │  │
│  │  │       '{drug_test}',                                      │  │
│  │  │       '{"status": "compliant", "flag": "green"}'          │  │
│  │  │     )                                                     │  │
│  │  │   WHERE employee_id = $1                                  │  │
│  │  ├── INSERT compliance_events (audit log)                    │  │
│  │  ├── COMMIT                                                  │  │
│  │  └── Invalidate cache                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 6: Alert Trigger                                       │  │
│  │  ├── if (flag === 'red' || flag === 'yellow') {              │  │
│  │  │   emit AlertEvent {                                       │  │
│  │  │     employee_id,                                          │  │
│  │  │     type: event.type,                                     │  │
│  │  │     severity: flag,                                       │  │
│  │  │     reason: violations.join(', ')                         │  │
│  │  │   }                                                       │  │
│  │  └── }                                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  STEP 7: Billing Event                                       │  │
│  │  ├── if (isBillable(event.type)) {                           │  │
│  │  │   emit BillableEvent {                                    │  │
│  │  │     client_id, type: event.type, quantity: 1              │  │
│  │  │   }                                                       │  │
│  │  └── }                                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Service Architecture

```
┌─────────────────────────────────────────────┐
│         FRONTEND (React SPA)                │
│  - Role-based dashboards                    │
│  - Compliance management UI                 │
│  - DER IQ chat widget                       │
└──────────────────┬──────────────────────────┘
                   │ HTTPS/GraphQL
┌──────────────────▼──────────────────────────┐
│         API GATEWAY (Kong/AWS ALB)          │
│  - Auth (OAuth2/SAML)                       │
│  - Rate limiting                            │
│  - Request routing                          │
└──┬────────┬──────────┬──────────┬───────────┘
   │        │          │          │
┌──▼────┐ ┌─▼──────┐ ┌▼──────┐ ┌─▼─────────┐
│Ingest │ │ Core   │ │Policy │ │Supporting │
│Adapters│ │Compl.  │ │Service│ │Services   │
│        │ │Process.│ │       │ │           │
│- CRL   │ │        │ │- CRUD │ │- Billing  │
│- TazWrk│ │- Event │ │- Eval │ │- Onboard  │
│- Upload│ │  Cons. │ │- Rules│ │- DER IQ   │
│        │ │- Parser│ │       │ │- Alerts   │
│        │ │- Valid.│ │       │ │- Geo      │
└────┬───┘ └───┬────┘ └───┬───┘ └───────────┘
     │         │          │
     └─────────┴──────────┘
              │ Kafka
┌─────────────▼─────────────────────────────┐
│            DATA LAYER                     │
│  - PostgreSQL (partitioned by client_id)  │
│  - Redis (caching layer)                  │
│  - S3 (document storage)                  │
│  - Vector DB (DER IQ RAG)                 │
└───────────────────────────────────────────┘
```

---

## Data Layer Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL (Primary Database)                               │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Tables:                                                     │  │
│  │  ├── accounts (sign-up state)                                │  │
│  │  ├── compliance_companies                                    │  │
│  │  ├── service_companies (FK to compliance_companies)          │  │
│  │  ├── employee_roster (FK to service_companies)               │  │
│  │  │   └── compliance JSONB {drug_test: {...}, background:...} │  │
│  │  ├── policies (rules by client + type)                       │  │
│  │  ├── sites (geofences with PostGIS)                          │  │
│  │  ├── compliance_events (immutable audit log)                 │  │
│  │  └── invites (onboarding tokens)                             │  │
│  │                                                              │  │
│  │  Partitioning: By client_id (multi-tenant isolation)         │  │
│  │  Indexes: client_id, employee_id, compliance type, flags     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Redis Cluster (Caching)                                     │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  - Session cache                                             │  │
│  │  - Employee compliance status (hot data)                     │  │
│  │  - Policy rules cache                                        │  │
│  │  - Dashboard aggregations (TTL: 5 min)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  S3 / MinIO (Document Store)                                 │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  - HIPAA-compliant encryption (AES-256)                      │  │
│  │  - Path structure: /{client_id}/{type}/{employee_id}/...     │  │
│  │  - Versioning enabled                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Vector Database (DER IQ / RAG)                              │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  - Pinecone / Weaviate / pgvector                            │  │
│  │  - Regulatory text embeddings (49 CFR, FCRA)                 │  │
│  │  - Client policy embeddings                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Multi-Tenant Schema Isolation

```
Database: patriot_compliance_prod
├── Schema: public (Tenant Registry)
│   └── tenants
│       ├── id: UUID
│       ├── name: "Acme Corp"
│       ├── schema_name: "tenant_acme"
│       └── created_at
│
├── Schema: tenant_acme (Isolated)
│   ├── employees
│   ├── drug_tests
│   ├── background_checks
│   └── audit_logs
│
├── Schema: tenant_chevron (Isolated)
│   └── [all tables]
│
└── Schema: tenant_halliburton (Isolated)
    └── [all tables]
```

**Connection Pattern:**
```
Request → JWT (tenantId) → Middleware → SET search_path TO tenant_acme → Query
```

---

## Kafka Topic Architecture

```
Upstash Kafka Cluster
├── compliance.drug_test.completed
│   ├── Partition 0 (employeeId hash % 3 == 0)
│   ├── Partition 1 (employeeId hash % 3 == 1)
│   └── Partition 2 (employeeId hash % 3 == 2)
│
├── compliance.background.completed
│   └── [3 partitions by employeeId]
│
├── compliance.dot.updated
├── compliance.health.updated
├── compliance.training.updated
│
├── employee.created
├── employee.updated
│
├── alert.employee.noncompliant
└── alert.document.expiring
```

---

## API Endpoints

### Ingestion API

```http
POST /v1/events/compliance
Content-Type: application/json
Authorization: Bearer {api_key}

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
  "status": "processing"
}
```

### Query API (Employee Compliance)

```http
GET /v1/employees/{employee_id}/compliance
Authorization: Bearer {jwt}

Response:
{
  "employee_id": 123,
  "client_id": 456,
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

### Query API (Summary)

```http
GET /v1/compliance/summary?client_id=456&type=drug_test&flag=red
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
    "drug_test": { "compliant": 1180, "non_compliant": 70 },
    "background": { "compliant": 1200, "non_compliant": 50 }
  }
}
```

### Policy API

```http
POST /v1/policies
Content-Type: application/json
Authorization: Bearer {jwt}

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

```http
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

## SQL Queries

### Portal Query Distinction

```sql
-- Service Company Portal
SELECT * FROM employee_roster WHERE client_id = 123;

-- Compliance Company Portal (same data, different filter)
SELECT * FROM employee_roster
WHERE client_id IN (
  SELECT id FROM service_companies
  WHERE compliance_company_id = 456
);
```

### Employee Compliance UPSERT

```sql
UPDATE employee_roster
SET compliance = jsonb_set(
  compliance,
  '{drug_test}',
  '{"status": "compliant", "flag": "green"}'::jsonb
)
WHERE employee_id = $1;
```

### Partitioned Tables (Scale)

```sql
-- Partitioned by client_id for tenant isolation
CREATE TABLE employee_roster (
  id BIGSERIAL,
  client_id INT NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  PRIMARY KEY (id, client_id)
) PARTITION BY HASH (client_id);

-- Separate normalized table for compliance records
CREATE TABLE compliance_records (
  id BIGSERIAL,
  employee_id BIGINT NOT NULL,
  client_id INT NOT NULL,
  compliance_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  flag VARCHAR(10) NOT NULL,
  data JSONB,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  PRIMARY KEY (id, client_id, compliance_type)
) PARTITION BY HASH (client_id);

-- Create partitions
CREATE TABLE employee_roster_p0 PARTITION OF employee_roster
  FOR VALUES WITH (MODULUS 16, REMAINDER 0);
-- ... repeat for p1-p15
```

### Materialized View (Dashboard)

```sql
CREATE MATERIALIZED VIEW compliance_summary AS
SELECT
  employee_id,
  client_id,
  json_object_agg(
    compliance_type,
    json_build_object('status', status, 'flag', flag, 'expires_at', expires_at)
  ) as compliance
FROM compliance_records
GROUP BY employee_id, client_id;
```

### Indexes

```sql
CREATE INDEX idx_compliance_client_flag ON compliance_records(client_id, flag);
CREATE INDEX idx_compliance_expires ON compliance_records(expires_at)
  WHERE flag IN ('yellow', 'red');
CREATE INDEX ON employees (tenant_id, status);
CREATE INDEX ON employees USING GIN (compliance_data);
```

---

## Data Models (Django)

### Employee Model

```python
class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    tenant = models.ForeignKey('accounts.Tenant', on_delete=models.CASCADE)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)

    # Encrypted PII
    ssn_encrypted = models.CharField(max_length=200, null=True, blank=True)
    dob_encrypted = models.CharField(max_length=200, null=True, blank=True)

    hire_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVE', 'Active'),
            ('INACTIVE', 'Inactive'),
            ('TERMINATED', 'Terminated'),
        ],
        default='ACTIVE'
    )

    # Compliance Data (JSONB)
    compliance_data = models.JSONField(default=dict)

    @property
    def overall_compliance_status(self):
        statuses = [
            self.compliance_data.get('drug_testing', {}).get('status'),
            self.compliance_data.get('background', {}).get('status'),
            self.compliance_data.get('dot', {}).get('status'),
        ]
        if 'red' in statuses:
            return 'red'
        elif 'amber' in statuses:
            return 'amber'
        return 'green'
```

### Tenant Model

```python
class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=200)
    schema_name = models.CharField(max_length=63, unique=True)
    is_active = models.BooleanField(default=True)
    subscription_tier = models.CharField(max_length=20, default='STANDARD')
    subscription_status = models.CharField(max_length=20, default='ACTIVE')
```

### Compliance Models

```python
class DrugTest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    test_type = models.CharField(max_length=30)  # PRE_EMPLOYMENT, RANDOM
    test_date = models.DateField()
    result = models.CharField(max_length=20)  # NEGATIVE, POSITIVE, DILUTE
    mro_review_status = models.CharField(max_length=30)
    vendor_id = models.CharField(max_length=50)

class BackgroundCheck(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    order_date = models.DateField()
    completion_date = models.DateField(null=True)
    status = models.CharField(max_length=20)
    adjudication_status = models.CharField(max_length=30)
    vendor_id = models.CharField(max_length=50)

class AuditLog(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20)  # CREATE, UPDATE, DELETE, VIEW
    resource = models.CharField(max_length=50)
    resource_id = models.UUIDField(null=True)
    changes = models.JSONField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## Employee complianceData Schema

```json
{
  "drug_testing": {
    "status": "green|amber|red",
    "last_test_date": "2025-09-15",
    "next_random_date": "2026-01-10",
    "violations": [],
    "mro_reviews": []
  },
  "background": {
    "status": "green|amber|red",
    "last_check_date": "2024-06-01",
    "expiration_date": "2026-06-01",
    "adjudication": "approved",
    "continuous_monitoring": true,
    "reports": []
  },
  "dot": { ... },
  "health": { ... },
  "training": { ... },
  "geo_fencing": { ... },
  "policy": { ... },
  "billing": { ... }
}
```

---

## Kafka Event Schema (Avro)

```json
{
  "event_id": "uuid-v4",
  "event_version": "1.0",
  "event_type": "compliance.drug_test.result_received",
  "timestamp": "2025-10-07T12:00:00Z",
  "source": "crl_webhook",
  "client_id": 456,
  "employee_id": 789,
  "partition_key": "456_789",
  "idempotency_key": "sha256_hash_of_payload",
  "payload": {
    "compliance_type": "drug_test",
    "test_date": "2025-10-05",
    "result": "negative",
    "document_url": "s3://bucket/doc.pdf",
    "metadata": {
      "ccf_number": "ABC123",
      "lab": "Quest Diagnostics"
    }
  },
  "context": {
    "tenant_id": 456,
    "trace_id": "distributed-tracing-id"
  }
}
```

### Kafka Consumer Config

```yaml
consumer:
  group.id: compliance-processor-group
  auto.offset.reset: earliest
  enable.auto.commit: false
  max.poll.records: 100
  session.timeout.ms: 30000
  max.poll.interval.ms: 300000
```

---

## Vendor Adapter Pattern

```python
# apps/integrations/crl/adapter.py
def handle_crl_webhook(payload: dict) -> DrugTest:
    # 1. Validate signature
    validate_webhook_signature(payload)

    # 2. Parse vendor format
    result = parse_crl_payload(payload)

    # 3. Find employee
    employee = Employee.objects.get(id=result['donor_id'])

    # 4. Create record
    drug_test = DrugTest.objects.create(
        employee=employee,
        test_type=map_test_type(result['test_type']),
        result=map_result(result['result']),
    )

    # 5. Publish to Kafka
    publish_event('compliance.drug_test.completed', {
        'id': str(drug_test.id),
        'employeeId': str(employee.id),
        'result': drug_test.result,
    })

    # 6. Audit log
    log_audit(employee.tenant, 'system', 'CREATE', 'drug_test', drug_test.id)

    return drug_test
```

---

## Policy Evaluation

```python
def evaluate_compliance(employee, module):
    rules = get_policy_rules(employee.tenant, module)

    if module == 'drug_testing':
        return evaluate_drug_testing_rules(employee, rules)
    elif module == 'background':
        return evaluate_background_rules(employee, rules)
```

---

## Idempotency Pattern

```python
# Before processing
idempotency_key = event['idempotency_key']
if redis.exists(f"processed:{idempotency_key}"):
    logger.info(f"Event {event_id} already processed, skipping")
    return

# Process event
process_compliance_event(event)

# Mark as processed
redis.setex(f"processed:{idempotency_key}", 86400, 'processed')
```

---

## Cache Invalidation

```python
def invalidate_employee_cache(employee_id, client_id):
    redis.delete(f"employee:{employee_id}:compliance")
    redis.delete(f"client:{client_id}:summary")
    redis.delete(f"dashboard:{client_id}:stats")
```

---

## Authentication Flow

```
┌─────────┐                 ┌─────────┐                 ┌─────────┐
│ Browser │                 │ Django  │                 │ Email   │
└────┬────┘                 └────┬────┘                 └────┬────┘
     │                           │                           │
     │  1. POST /auth/request-otp│                           │
     ├──────────────────────────▶│                           │
     │    { email }              │                           │
     │                           │  2. Generate OTP          │
     │                           ├──────────────────────────▶│
     │                           │                           │
     │  4. OTP sent to email     │◀──────────────────────────┤
     │◀──────────────────────────┤                           │
     │                           │                           │
     │  5. POST /auth/verify-otp │                           │
     ├──────────────────────────▶│                           │
     │    { email, otp }         │                           │
     │                           │  6. Validate OTP          │
     │                           │                           │
     │  7. Return JWT tokens     │                           │
     │◀──────────────────────────┤                           │
     │    { access_token,        │                           │
     │      refresh_token }      │                           │
     │                           │                           │
     │  8. Authorization:        │                           │
     │     Bearer {access_token} │                           │
     ├──────────────────────────▶│                           │
```

---

## RBAC Permission Matrix

| Role               | Permissions                                           |
|--------------------|-------------------------------------------------------|
| SUPER_ADMIN        | * (all)                                               |
| EXECUTIVE          | view_employees, view_compliance, view_billing, view_audit_log, export_data |
| COMPLIANCE_OFFICER | view_employees, edit_employees, view_compliance, edit_compliance, approve_compliance, export_data |
| FIELD_WORKER       | view_own_compliance, update_own_profile, check_in     |
| AUDITOR            | view_employees (PHI masked), view_compliance, view_audit_log, export_data |

---

## Caching Layers

```
┌─────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                        │
├─────────────────────────────────────────────────────────┤
│ 1. Browser Cache:                                       │
│    • Static assets (60 days)                            │
│    • API responses (5 minutes)                          │
│                                                         │
│ 2. CDN (CloudFront):                                    │
│    • Next.js static pages (immutable)                   │
│    • Images, documents (365 days)                       │
│                                                         │
│ 3. Redis Cache (Backend):                               │
│    • Employee compliance status (5 minutes)             │
│    • Dashboard aggregates (1 minute)                    │
│    • Policy rules (1 hour)                              │
│                                                         │
│ 4. PostgreSQL:                                          │
│    • shared_buffers (25% of RAM)                        │
└─────────────────────────────────────────────────────────┘
```

---

## Redis Architecture

```
┌─────────────────────────────────────────┐
│         Redis Cluster (3 nodes)         │
├─────────────────────────────────────────┤
│ Cache Layer (TTL: 5 minutes)            │
│  - employee:{id}:compliance             │
│  - client:{id}:summary                  │
│  - dashboard:{client_id}:stats          │
│                                         │
│ Session Store (TTL: 24 hours)           │
│  - session:{token}                      │
│                                         │
│ Idempotency Keys (TTL: 24 hours)        │
│  - processed:{idempotency_key}          │
│                                         │
│ Rate Limiting (TTL: 1 minute)           │
│  - ratelimit:{client_id}:{endpoint}     │
└─────────────────────────────────────────┘
```

---

## Encryption

```
┌──────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION AT REST                             │
├──────────────────────────────────────────────────────────────────┤
│  PII/PHI Fields: AES-256-GCM (ssn_encrypted, dob_encrypted)      │
│  Documents (S3): AES-256, AWS KMS managed                        │
│  Database: PostgreSQL TDE (optional)                             │
│  Backups: AES-256                                                │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   ENCRYPTION IN TRANSIT                           │
├──────────────────────────────────────────────────────────────────┤
│  Frontend ↔ Backend: TLS 1.3                                     │
│  Backend ↔ Database: PostgreSQL SSL/TLS                          │
│  Backend ↔ Kafka: SASL_SSL                                       │
│  Backend ↔ Redis: TLS (Upstash)                                  │
│  Backend ↔ Vendors: HTTPS (TLS 1.2+)                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Deployment

```
┌────────────────────────────────────────────────────────────┐
│                        VERCEL                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js App (auto-deployed from main)               │  │
│  │  • Edge Functions                                    │  │
│  │  • Serverless Functions                              │  │
│  │  • Static Asset CDN                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌────────────────────────────────────────────────────────────┐
│                    AWS ECS (Fargate)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Django API (Docker)                                 │  │
│  │  • Auto-scaling (2-20 tasks)                         │  │
│  │  • Application Load Balancer                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Celery Workers (Docker)                             │  │
│  │  • Auto-scaling (1-10 workers)                       │  │
│  │  • Kafka consumers                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  Neon      │  │  Upstash   │  │  Upstash   │
    │ PostgreSQL │  │   Redis    │  │   Kafka    │
    └────────────┘  └────────────┘  └────────────┘
```

---

## File Structure

```
pcs-mod/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes
│   ├── api/                      # 29 API route handlers
│   ├── compliance/               # 6 compliance module pages
│   ├── compliance-portal/        # MSP portal [companySlug]
│   ├── portals/                  # PCS Pass, Executive, Auditor
│   ├── dashboard/
│   ├── employees/
│   ├── geo-fencing/
│   ├── reports/
│   ├── settings/
│   └── share/
│
├── components/                   # 93+ React components
│   ├── ui/                       # shadcn/ui
│   ├── layout/                   # AppShell, Header, Sidebar
│   ├── auth/                     # ProtectedRoute, RoleSwitcher
│   └── dashboard/
│
├── hooks/
│   ├── use-rbac.ts
│   ├── use-der-iq.ts
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/
│   ├── auth/
│   ├── rbac/                     # 42 permissions
│   ├── data/
│   └── utils.ts
│
├── types/
│   ├── auth.ts
│   └── share.ts
│
└── prisma/
    └── schema.prisma             # 13 models, 17 enums
```

---

## 8 Compliance Modules (Event Types)

| Module              | Source            | Data Flow                       |
|---------------------|-------------------|---------------------------------|
| Drug & Alcohol      | CRL/FormFox API   | Webhook → Parse → Flag          |
| Background          | TazWorks API      | API Pull → Validate → Store     |
| DOT/DQ              | Manual Upload     | Upload → OCR/AI → Extract       |
| Occupational Health | Upload/Clinic API | Ingest → Validate → HIPAA Store |
| Certs/Training      | Upload/Manual     | Upload → Parse → Expire Track   |
| Geo-Fencing         | Mobile App GPS    | GPS → PostGIS Query → Log       |
| Policy Module       | Internal Admin    | Define → Validate → Apply       |
| Billing             | Usage Events      | Track → Stripe API → Invoice    |

All store to: `Employee.complianceData.{module_name}`

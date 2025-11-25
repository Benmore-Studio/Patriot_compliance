# External API Integrations Catalog

**Document Version:** 1.0
**Created:** 2025-11-24
**Status:** Design Phase
**Total Integrations:** 5 vendors

---

## Table of Contents

1. [Integration Architecture Overview](#integration-architecture)
2. [Checkr - Background Screening](#checkr)
3. [TazWorks - Background Screening (Alternative)](#tazworks)
4. [Quest Diagnostics - Drug Testing](#quest)
5. [FMCSA Clearinghouse - DOT Compliance](#fmcsa)
6. [ID.me - Identity Verification](#idme)
7. [Webhook Security & Idempotency](#webhook-security)
8. [Error Handling & Retries](#error-handling)
9. [Rate Limiting & Circuit Breakers](#rate-limiting)
10. [Integration Testing Strategy](#testing)

---

## Integration Architecture Overview {#integration-architecture}

```
EXTERNAL INTEGRATIONS FLOW
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                  INTEGRATIONS GATEWAY                        │
│                 (Isolated Microservice)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│   │   Adapter    │  │   Adapter    │  │   Adapter    │     │
│   │   Layer      │  │   Layer      │  │   Layer      │     │
│   │              │  │              │  │              │     │
│   │  • Parse     │  │  • Parse     │  │  • Parse     │     │
│   │  • Transform │  │  • Transform │  │  • Transform │     │
│   │  • Validate  │  │  • Validate  │  │  • Validate  │     │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│          │                 │                 │              │
└──────────┼─────────────────┼─────────────────┼──────────────┘
           │                 │                 │
           ↓                 ↓                 ↓
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Checkr     │  │   TazWorks   │  │    Quest     │
    │  Background  │  │  Background  │  │  Drug Test   │
    │   Checks     │  │   Checks     │  │    (eCCF)    │
    └──────────────┘  └──────────────┘  └──────────────┘

           ↓                 ↓                 ↓
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │    FMCSA     │  │    id.me     │  │              │
    │ Clearinghouse│  │   Identity   │  │   Future     │
    │  (DOT Drug)  │  │ Verification │  │ Integrations │
    └──────────────┘  └──────────────┘  └──────────────┘

           │                 │
           ↓                 ↓
    ┌─────────────────────────────────┐
    │      Kafka Event Bus            │
    │  compliance.background.completed│
    │  compliance.drugtest.completed  │
    │  compliance.identity.verified   │
    └──────────────┬──────────────────┘
                   │
                   ↓
    ┌─────────────────────────────────┐
    │    Core Compliance Service      │
    │  • Process compliance events    │
    │  • Update employee records      │
    │  • Trigger alerts               │
    └─────────────────────────────────┘
```

**Key Design Principles:**

1. **Credential Isolation:** Vendor API keys stored ONLY in Integrations Gateway (never in Core)
2. **Adapter Pattern:** Each vendor has dedicated adapter (200-300 LOC) for parsing/transformation
3. **Async Processing:** Webhooks return 200 OK immediately, process in background
4. **Universal Schema:** All vendors transform to `ComplianceEvent` schema before publishing to Kafka
5. **Idempotency:** Duplicate webhooks detected via Redis (24-hour TTL)

---

## Checkr - Background Screening {#checkr}

**Official Documentation:** https://docs.checkr.com/

### Overview

Checkr provides comprehensive background screening APIs with FCRA-compliant workflows for adverse action, adjudication, and continuous monitoring.

### Authentication

```typescript
// Stored in Integrations Gateway environment variables
const CHECKR_API_KEY = process.env.CHECKR_API_KEY
const CHECKR_WEBHOOK_SECRET = process.env.CHECKR_WEBHOOK_SECRET

// All API requests
headers: {
  'Authorization': `Bearer ${CHECKR_API_KEY}`,
  'Content-Type': 'application/json'
}

// Base URL
Production: https://api.checkr.com/v1
Sandbox: https://api.checkr-sandbox.com/v1
```

### API Endpoints Used

```
CHECKR API ENDPOINTS
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                   CANDIDATES (IAL2 Verified)                 │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/candidates                                         │
│  ────────────────────────────────────────────────────────── │
│  Create candidate record (SSN, DOB, address required)       │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "first_name": "John",                                     │
│    "last_name": "Doe",                                       │
│    "email": "john.doe@acme.com",                             │
│    "ssn": "123-45-6789",                                     │
│    "dob": "1985-06-15",                                      │
│    "zipcode": "94103",                                       │
│    "phone": "415-555-1234"                                   │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "id": "cand_abc123xyz",                                   │
│    "object": "candidate",                                    │
│    "created_at": "2025-11-24T10:00:00Z"                      │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   INVITATIONS (Email Link)                   │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/invitations                                        │
│  ────────────────────────────────────────────────────────── │
│  Send candidate email to complete background check          │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "candidate_id": "cand_abc123xyz",                         │
│    "package": "standard_criminal",                           │
│    "work_locations": [                                       │
│      {                                                       │
│        "country": "US",                                      │
│        "state": "CA",                                        │
│        "city": "San Francisco"                               │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "id": "invitation_xyz789",                                │
│    "status": "pending",                                      │
│    "invitation_url": "https://checkr.com/invites/..."       │
│  }                                                           │
│                                                              │
│  Note: Candidate receives email with secure link            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   REPORTS (Direct Order)                     │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/reports                                            │
│  ────────────────────────────────────────────────────────── │
│  Order background check report (no candidate email)         │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "candidate_id": "cand_abc123xyz",                         │
│    "package": "standard_plus_criminal",                      │
│    "consider": [                                             │
│      "felony",                                               │
│      "misdemeanor"                                           │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "id": "report_rpt123abc",                                 │
│    "status": "pending",                                      │
│    "package": "standard_plus_criminal",                      │
│    "created_at": "2025-11-24T10:05:00Z",                     │
│    "completed_at": null,                                     │
│    "eta": "2025-11-26T10:05:00Z"                             │
│  }                                                           │
│                                                              │
│  Packages Available:                                         │
│  • standard_criminal (county + national)                    │
│  • standard_plus_criminal (adds SSN trace)                  │
│  • pro_criminal (adds sex offender, global watchlist)       │
│  • motor_vehicle_report                                     │
│  • employment_verification                                  │
│  • education_verification                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   RETRIEVE REPORT                            │
├─────────────────────────────────────────────────────────────┤
│  GET /v1/reports/{report_id}                                 │
│  ────────────────────────────────────────────────────────── │
│  Get completed report with all screenings                   │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "id": "report_rpt123abc",                                 │
│    "status": "complete",                                     │
│    "adjudication": "engaged",                                │
│    "result": "consider",                                     │
│    "completed_at": "2025-11-25T14:30:00Z",                   │
│    "screenings": [                                           │
│      {                                                       │
│        "type": "county_criminal_search",                     │
│        "status": "complete",                                 │
│        "result": "consider",                                 │
│        "records": [                                          │
│          {                                                   │
│            "case_number": "CR-2015-12345",                   │
│            "file_date": "2015-03-15",                        │
│            "arresting_agency": "SFPD",                       │
│            "court_jurisdiction": "San Francisco Superior",   │
│            "charges": [                                      │
│              {                                               │
│                "charge": "Theft",                            │
│                "classification": "Misdemeanor",              │
│                "disposition": "Guilty",                      │
│                "sentence": "Probation - 1 year"             │
│              }                                               │
│            ]                                                 │
│          }                                                   │
│        ]                                                     │
│      },                                                      │
│      {                                                       │
│        "type": "ssn_trace",                                  │
│        "status": "complete",                                 │
│        "result": "clear",                                    │
│        "addresses": [...]                                    │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Status Values:                                              │
│  • pending: Report ordered, in progress                     │
│  • complete: All screenings finished                        │
│  • disputed: Candidate disputed findings                    │
│  • canceled: Report canceled                                │
│                                                              │
│  Result Values (adjudication outcome):                      │
│  • clear: No records found, hire recommended                │
│  • consider: Records found, requires review                 │
│  • engaged: Currently under adjudication review             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ADVERSE ACTION (FCRA)                      │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/reports/{report_id}/adverse_actions                │
│  ────────────────────────────────────────────────────────── │
│  Initiate FCRA-compliant adverse action workflow            │
│                                                              │
│  Step 1: Pre-Adverse Action Notice                          │
│  Request:                                                    │
│  {                                                           │
│    "status": "pending",                                      │
│    "adverse_items": [                                        │
│      {                                                       │
│        "text": "Criminal conviction: Theft (2015)",          │
│        "reason": "felony"                                    │
│      }                                                       │
│    ],                                                        │
│    "individualized_assessment_engaged": true                │
│  }                                                           │
│                                                              │
│  Result: Candidate receives pre-adverse notice + 7 days     │
│          to dispute findings                                 │
│                                                              │
│  Step 2: Final Adverse Action (after 7 days)                │
│  PUT /v1/reports/{report_id}/adverse_actions/{aa_id}         │
│  {                                                           │
│    "status": "canceled" | "complete"                         │
│  }                                                           │
│                                                              │
│  • canceled: Candidate dispute successful, hire approved    │
│  • complete: Adverse action finalized, hire denied          │
└─────────────────────────────────────────────────────────────┘
```

### Webhook Events

Checkr sends webhooks to notify us of report status changes:

```
CHECKR WEBHOOKS
════════════════════════════════════════════════════════════════

Endpoint: POST /webhooks/checkr
Security: X-Checkr-Signature (HMAC-SHA256)

Event Types:
────────────────────────────────────────────────────────────────

1. report.created
   ────────────────────────────────────────────────────────────
   Triggered: When background check report is ordered

   Payload:
   {
     "type": "report.created",
     "object": "event",
     "id": "evt_abc123",
     "created_at": "2025-11-24T10:05:00Z",
     "data": {
       "object": {
         "id": "report_rpt123abc",
         "status": "pending",
         "candidate_id": "cand_abc123xyz",
         "package": "standard_plus_criminal"
       }
     }
   }

   Action: Log event, update status to "background_check_ordered"


2. report.completed
   ────────────────────────────────────────────────────────────
   Triggered: When all screenings are finished

   Payload:
   {
     "type": "report.completed",
     "object": "event",
     "id": "evt_xyz789",
     "created_at": "2025-11-25T14:30:00Z",
     "data": {
       "object": {
         "id": "report_rpt123abc",
         "status": "complete",
         "result": "consider",
         "adjudication": "engaged",
         "candidate_id": "cand_abc123xyz"
       }
     }
   }

   Action:
   1. Fetch full report: GET /v1/reports/{report_id}
   2. Parse screenings (criminal records, SSN trace, etc.)
   3. Transform to ComplianceEvent
   4. Publish to Kafka: compliance.background.completed
   5. Core service: Update employee.complianceData.background


3. report.disputed
   ────────────────────────────────────────────────────────────
   Triggered: When candidate disputes findings

   Payload:
   {
     "type": "report.disputed",
     "data": {
       "object": {
         "id": "report_rpt123abc",
         "status": "disputed",
         "dispute_reason": "Incorrect case number"
       }
     }
   }

   Action: Pause adjudication, notify DER, await resolution


4. adverse_action.created
   ────────────────────────────────────────────────────────────
   Triggered: When pre-adverse notice is sent

   Action: Log start of 7-day waiting period


5. adverse_action.completed
   ────────────────────────────────────────────────────────────
   Triggered: When final adverse action is taken

   Action: Update hire status (approved/denied)
```

### Adapter Implementation

```typescript
// integrations-gateway/src/adapters/checkr.adapter.ts

import axios from 'axios'
import crypto from 'crypto'

export class CheckrAdapter {
  private apiKey: string
  private webhookSecret: string
  private baseURL: string

  constructor() {
    this.apiKey = process.env.CHECKR_API_KEY!
    this.webhookSecret = process.env.CHECKR_WEBHOOK_SECRET!
    this.baseURL = process.env.CHECKR_BASE_URL || 'https://api.checkr.com/v1'
  }

  /**
   * Order background check report
   */
  async orderReport(candidateData: {
    employeeId: string
    firstName: string
    lastName: string
    email: string
    ssn: string
    dob: string
    zipcode: string
  }): Promise<{ reportId: string }> {
    // Step 1: Create candidate
    const candidate = await axios.post(
      `${this.baseURL}/candidates`,
      {
        first_name: candidateData.firstName,
        last_name: candidateData.lastName,
        email: candidateData.email,
        ssn: candidateData.ssn,
        dob: candidateData.dob,
        zipcode: candidateData.zipcode,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const candidateId = candidate.data.id

    // Step 2: Order report
    const report = await axios.post(
      `${this.baseURL}/reports`,
      {
        candidate_id: candidateId,
        package: 'standard_plus_criminal', // Configurable
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return { reportId: report.data.id }
  }

  /**
   * Verify webhook signature (HMAC-SHA256)
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Parse Checkr webhook → Universal ComplianceEvent
   */
  parseWebhookToComplianceEvent(webhook: any): ComplianceEvent {
    const report = webhook.data.object

    return {
      event_id: webhook.id,
      event_type: 'compliance.background.completed',
      timestamp: webhook.created_at,
      source: 'checkr',
      employee_id: report.candidate_id, // Map to our employee ID
      client_id: report.custom_id, // We set this when ordering
      data: {
        compliance_type: 'background',
        report_id: report.id,
        status: report.status,
        result: report.result, // clear | consider | engaged
        screenings: report.screenings,
        document_url: report.report_url,
      },
    }
  }

  /**
   * Fetch full report details
   */
  async getReport(reportId: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })

    return response.data
  }
}

interface ComplianceEvent {
  event_id: string
  event_type: string
  timestamp: string
  source: string
  employee_id: string
  client_id: string
  data: Record<string, any>
}
```

---

## TazWorks - Background Screening (Alternative) {#tazworks}

**Official Documentation:** https://tazworks.com/api/

### Overview

TazWorks is an alternative background screening provider with more customizable packages and integrated drug screening providers.

### Authentication

```typescript
// TazAPI v2 (JSON REST API)
const TAZWORKS_API_KEY = process.env.TAZWORKS_API_KEY
const TAZWORKS_CLIENT_ID = process.env.TAZWORKS_CLIENT_ID

// Base URL
Production: https://api.tazworks.com/v2
Sandbox: https://sandbox.api.tazworks.com/v2

// Authentication
headers: {
  'Authorization': `Bearer ${TAZWORKS_API_KEY}`,
  'X-Client-Id': TAZWORKS_CLIENT_ID
}
```

### API Endpoints Used

```
TAZWORKS API ENDPOINTS
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                   ORDER SCREENING                            │
├─────────────────────────────────────────────────────────────┤
│  POST /v2/screenings                                         │
│  ────────────────────────────────────────────────────────── │
│  Order background screening product                          │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "product_id": "standard_criminal_credit",                 │
│    "applicant": {                                            │
│      "first_name": "Jane",                                   │
│      "last_name": "Smith",                                   │
│      "ssn": "987-65-4321",                                   │
│      "dob": "1990-03-20",                                    │
│      "address": {                                            │
│        "street": "123 Main St",                              │
│        "city": "Houston",                                    │
│        "state": "TX",                                        │
│        "zip": "77001"                                        │
│      }                                                       │
│    },                                                        │
│    "searches": [                                             │
│      "county_criminal",                                      │
│      "national_criminal",                                    │
│      "credit_report",                                        │
│      "employment_verification"                               │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "screening_id": "scr_xyz456",                             │
│    "status": "processing",                                   │
│    "estimated_completion": "2025-11-27T10:00:00Z"            │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   RETRIEVE REPORT                            │
├─────────────────────────────────────────────────────────────┤
│  GET /v2/screenings/{screening_id}                           │
│  ────────────────────────────────────────────────────────── │
│  Response includes:                                          │
│  • Criminal records (county, state, federal, national)      │
│  • Credit report (Experian/Equifax/TransUnion)              │
│  • Employment verification                                  │
│  • Education verification                                   │
│  • Professional license verification                        │
│  • References                                                │
│  • Drug screening results (if integrated)                   │
└─────────────────────────────────────────────────────────────┘
```

### Webhook Implementation

```typescript
// TazWorks webhook handler
export class TazWorksAdapter {
  parseWebhookToComplianceEvent(webhook: any): ComplianceEvent {
    return {
      event_id: webhook.webhook_id,
      event_type: 'compliance.background.completed',
      timestamp: webhook.completed_at,
      source: 'tazworks',
      employee_id: webhook.applicant.custom_id,
      client_id: webhook.client_id,
      data: {
        compliance_type: 'background',
        screening_id: webhook.screening_id,
        status: webhook.status,
        criminal_records: webhook.searches.criminal.records,
        credit_score: webhook.searches.credit?.score,
        document_url: webhook.report_pdf_url,
      },
    }
  }
}
```

**Key Difference from Checkr:**
- TazWorks provides credit reports (Checkr doesn't)
- TazWorks has integrated drug screening (LabCorp, Quest, Omega)
- Pricing: ~20% cheaper than Checkr for standard criminal

---

## Quest Diagnostics - Drug Testing {#quest}

**Official Documentation:** https://blog.employersolutions.com/eccf-documentation/

### Overview

Quest Diagnostics provides DOT and non-DOT drug testing with eCCF (electronic Custody and Control Form). All results go through MRO (Medical Review Officer) review before employer receives them.

### Authentication

```typescript
// Quest ESP (Employer Solutions Portal) Web Services API
const QUEST_API_KEY = process.env.QUEST_API_KEY
const QUEST_ACCOUNT_ID = process.env.QUEST_ACCOUNT_ID

// Base URL
Production: https://api.employersolutions.com/v1
Sandbox: https://sandbox.employersolutions.com/v1

// Authentication
headers: {
  'Authorization': `Bearer ${QUEST_API_KEY}`,
  'X-Account-Id': QUEST_ACCOUNT_ID
}
```

### API Endpoints Used

```
QUEST DIAGNOSTICS API
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                   ORDER eCCF                                 │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/eccf/orders                                        │
│  ────────────────────────────────────────────────────────── │
│  Create electronic custody control form                     │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "donor": {                                                │
│      "first_name": "Mike",                                   │
│      "last_name": "Johnson",                                 │
│      "ssn_last_4": "6789",                                   │
│      "dob": "1988-05-10",                                    │
│      "phone": "713-555-9876"                                 │
│    },                                                        │
│    "test_type": "DOT_5_PANEL_URINE",                         │
│    "reason": "RANDOM",                                       │
│    "collection_site": {                                      │
│      "site_id": "QST_Houston_001",                           │
│      "address": "5601 S Broadway, Houston TX 77051"          │
│    },                                                        │
│    "donor_notification": {                                   │
│      "method": "email",                                      │
│      "email": "mike.johnson@acme.com"                        │
│    }                                                         │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "specimen_id": "QST-2025-11-24-001234",                   │
│    "ccf_number": "ABC123456789",                             │
│    "status": "pending_collection",                           │
│    "collection_deadline": "2025-11-27T17:00:00Z",            │
│    "donor_instructions_url": "https://..."                   │
│  }                                                           │
│                                                              │
│  Test Types:                                                 │
│  • DOT_5_PANEL_URINE (amp, coc, mar, opi, pcp)              │
│  • DOT_10_PANEL_URINE (adds bar, bzo, mdma, mth, oxy)       │
│  • NON_DOT_9_PANEL_URINE                                     │
│  • ORAL_FLUID (non-DOT only)                                │
│  • HAIR_FOLLICLE (90-day history)                           │
│                                                              │
│  Reason Codes:                                               │
│  • PRE_EMPLOYMENT, RANDOM, POST_ACCIDENT, REASONABLE_SUSPICION│
│  • RETURN_TO_DUTY, FOLLOW_UP                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   GET RESULTS                                │
├─────────────────────────────────────────────────────────────┤
│  GET /v1/results/{specimen_id}                               │
│  ────────────────────────────────────────────────────────── │
│  Retrieve test results (available after MRO review)          │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "specimen_id": "QST-2025-11-24-001234",                   │
│    "ccf_number": "ABC123456789",                             │
│    "collection_date": "2025-11-25T09:15:00Z",                │
│    "test_type": "DOT_5_PANEL_URINE",                         │
│    "result": "NEGATIVE",                                     │
│    "mro_review": {                                           │
│      "status": "COMPLETED",                                  │
│      "reviewed_by": "Dr. Sarah Mitchell",                    │
│      "reviewed_at": "2025-11-26T14:30:00Z",                  │
│      "mro_letter_url": "https://..."                         │
│    },                                                        │
│    "substances_tested": [                                    │
│      { "substance": "Amphetamines", "result": "NEGATIVE" }, │
│      { "substance": "Cocaine", "result": "NEGATIVE" },      │
│      { "substance": "Marijuana", "result": "NEGATIVE" },    │
│      { "substance": "Opiates", "result": "NEGATIVE" },      │
│      { "substance": "PCP", "result": "NEGATIVE" }           │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Result Values:                                              │
│  • NEGATIVE: No drugs detected                              │
│  • POSITIVE: Drugs detected (confirmed by GC/MS)            │
│  • DILUTE_NEGATIVE: Negative but sample diluted             │
│  • REFUSAL_TO_TEST: Donor refused collection                │
│  • ADULTERATED: Sample tampered                             │
│  • INVALID: Insufficient specimen                           │
│  • CANCELLED: Lab error, recollection required              │
└─────────────────────────────────────────────────────────────┘
```

### MRO Review Process

```
QUEST MRO REVIEW WORKFLOW
════════════════════════════════════════════════════════════════

Step 1: Collection
──────────────────────────────────────────────────────────────
Donor goes to Quest collection site
      ↓
Provides specimen (urine, oral fluid, or hair)
      ↓
Collector seals specimen, signs eCCF
      ↓
Status: "specimen_collected"


Step 2: Lab Analysis
──────────────────────────────────────────────────────────────
Specimen shipped to Quest lab
      ↓
Initial screening (immunoassay)
      ↓
      ├── Negative → Status: "lab_negative"
      │
      └── Positive → Confirmation testing (GC/MS)
                      ↓
                Status: "lab_positive_unconfirmed"


Step 3: MRO Review (if positive)
──────────────────────────────────────────────────────────────
MRO (Medical Review Officer) reviews lab results
      ↓
MRO calls donor (3 attempts over 24 hours)
      ↓
      ├── Legitimate medical explanation? (prescription)
      │        ↓
      │   MRO changes result to "NEGATIVE"
      │   MRO letter: "Negative (MRO verified prescription)"
      │
      └── No legitimate explanation
               ↓
          Result remains "POSITIVE"
          MRO letter: "Positive for Opiates (Oxycodone)"


Step 4: Employer Notification
──────────────────────────────────────────────────────────────
MRO releases results to employer (webhook + API)
      ↓
Employer receives:
  • Final result (NEGATIVE or POSITIVE)
  • MRO letter (PDF)
  • Chain of custody documentation


Step 5: DOT Clearinghouse Reporting (if DOT test)
──────────────────────────────────────────────────────────────
IF test type = DOT AND result = POSITIVE:
      ↓
MRO reports to FMCSA Clearinghouse within 2 business days
      ↓
Driver status: "PROHIBITED" (cannot drive CDL vehicle)
      ↓
Employer must:
  1. Remove driver from safety-sensitive duties immediately
  2. Provide SAP (Substance Abuse Professional) referral
  3. Monitor return-to-duty process
```

### Webhook Events

```
QUEST WEBHOOKS
════════════════════════════════════════════════════════════════

Endpoint: POST /webhooks/quest
Security: X-Quest-Signature (HMAC-SHA256)

Event Types:
────────────────────────────────────────────────────────────────

1. specimen.collected
   ────────────────────────────────────────────────────────────
   Donor completed collection at Quest site

   Action: Update status to "drug_test_collected"


2. result.released
   ────────────────────────────────────────────────────────────
   MRO released final results to employer

   Payload:
   {
     "event": "result.released",
     "specimen_id": "QST-2025-11-24-001234",
     "result": "NEGATIVE",
     "mro_reviewed": true,
     "reviewed_at": "2025-11-26T14:30:00Z"
   }

   Action:
   1. Fetch full results: GET /v1/results/{specimen_id}
   2. Download MRO letter PDF
   3. Transform to ComplianceEvent
   4. Publish to Kafka: compliance.drugtest.completed
   5. IF result = POSITIVE AND test_type = DOT:
        → Query FMCSA clearinghouse for confirmation
        → Alert DER immediately


3. result.positive
   ────────────────────────────────────────────────────────────
   HIGH PRIORITY: Positive drug test result

   Action:
   1. Immediate email/SMS to DER
   2. Create urgent task for compliance officer
   3. IF DOT test:
      → Verify reported to clearinghouse
      → Remove driver from safety-sensitive duties
```

### Adapter Implementation

```typescript
export class QuestAdapter {
  async orderTest(testOrder: {
    employeeId: string
    firstName: string
    lastName: string
    ssnLast4: string
    dob: string
    testType: 'DOT_5_PANEL' | 'NON_DOT_9_PANEL'
    reason: 'RANDOM' | 'PRE_EMPLOYMENT' | 'POST_ACCIDENT'
  }): Promise<{ specimenId: string }> {
    const response = await axios.post(
      `${this.baseURL}/eccf/orders`,
      {
        donor: {
          first_name: testOrder.firstName,
          last_name: testOrder.lastName,
          ssn_last_4: testOrder.ssnLast4,
          dob: testOrder.dob,
        },
        test_type: testOrder.testType,
        reason: testOrder.reason,
        donor_notification: {
          method: 'email',
          // Quest sends donor instructions via email
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'X-Account-Id': this.accountId,
        },
      }
    )

    return { specimenId: response.data.specimen_id }
  }

  parseWebhookToComplianceEvent(webhook: any): ComplianceEvent {
    return {
      event_id: webhook.event_id,
      event_type: 'compliance.drugtest.completed',
      timestamp: webhook.reviewed_at,
      source: 'quest',
      employee_id: webhook.custom_employee_id,
      client_id: webhook.client_id,
      data: {
        compliance_type: 'drug_test',
        specimen_id: webhook.specimen_id,
        test_type: webhook.test_type,
        result: webhook.result, // NEGATIVE, POSITIVE, DILUTE_NEGATIVE, etc.
        substances_tested: webhook.substances,
        mro_letter_url: webhook.mro_letter_url,
        collection_date: webhook.collection_date,
        is_dot_regulated: webhook.test_type.startsWith('DOT'),
      },
    }
  }
}
```

---

## FMCSA Clearinghouse - DOT Compliance {#fmcsa}

**Official Documentation:** https://clearinghouse.fmcsa.dot.gov/api/swagger/index.html

### Overview

The FMCSA Drug & Alcohol Clearinghouse is a **federally-mandated database** for CDL drivers. Employers MUST:
- Query clearinghouse before hiring any CDL driver (pre-employment full query)
- Query all current CDL drivers annually (limited query)
- Report all drug/alcohol violations within 2 business days

### Authentication

```typescript
// OAuth 2.0 with PIV/CAC card (for high-security queries)
const FMCSA_CLIENT_ID = process.env.FMCSA_CLIENT_ID
const FMCSA_CLIENT_SECRET = process.env.FMCSA_CLIENT_SECRET

// Base URL
Production: https://clearinghouse.fmcsa.dot.gov/api
Sandbox: https://clearinghouse-sandbox.fmcsa.dot.gov/api

// OAuth token endpoint
POST https://clearinghouse.fmcsa.dot.gov/oauth/token
{
  "grant_type": "client_credentials",
  "client_id": FMCSA_CLIENT_ID,
  "client_secret": FMCSA_CLIENT_SECRET
}

Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### API Endpoints Used

```
FMCSA CLEARINGHOUSE API
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│               FULL QUERY (Pre-Employment)                    │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/queries/full                                       │
│  ────────────────────────────────────────────────────────── │
│  Required before hiring any CDL driver                       │
│  Requires driver's electronic consent                        │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "driver": {                                               │
│      "cdl_number": "T1234567",                               │
│      "cdl_state": "TX",                                      │
│      "dob": "1985-08-15",                                    │
│      "last_name": "Rodriguez"                                │
│    },                                                        │
│    "consent": {                                              │
│      "consent_id": "consent_abc123",                         │
│      "obtained_at": "2025-11-24T10:00:00Z",                  │
│      "ip_address": "192.168.1.50"                            │
│    }                                                         │
│  }                                                           │
│                                                              │
│  Response (if NO RECORDS):                                   │
│  {                                                           │
│    "query_id": "query_xyz789",                               │
│    "status": "complete",                                     │
│    "records_found": false,                                   │
│    "message": "No drug or alcohol violations on record"      │
│  }                                                           │
│                                                              │
│  Response (if RECORDS FOUND):                                │
│  {                                                           │
│    "query_id": "query_xyz789",                               │
│    "status": "complete",                                     │
│    "records_found": true,                                    │
│    "violations": [                                           │
│      {                                                       │
│        "violation_date": "2023-06-10",                       │
│        "violation_type": "POSITIVE_DRUG_TEST",               │
│        "substance": "Marijuana",                             │
│        "employer": "ABC Trucking LLC",                       │
│        "sap_process": {                                      │
│          "completed": false,                                 │
│          "status": "IN_PROGRESS",                            │
│          "started_at": "2023-07-01"                          │
│        },                                                    │
│        "return_to_duty_test": {                              │
│          "completed": false,                                 │
│          "required": true                                    │
│        }                                                     │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Decision Logic:                                             │
│  IF records_found = false → HIRE APPROVED                    │
│  IF records_found = true:                                    │
│    IF sap_process.completed = true AND                       │
│       return_to_duty_test.completed = true                   │
│       → HIRE APPROVED (driver completed RTD)                 │
│    ELSE                                                      │
│       → HIRE DENIED (driver still prohibited)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               LIMITED QUERY (Annual)                         │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/queries/limited                                    │
│  ────────────────────────────────────────────────────────── │
│  Required annually for all current CDL drivers               │
│  Does NOT require driver consent                             │
│  Returns YES/NO only (no details)                            │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "drivers": [                                              │
│      {                                                       │
│        "cdl_number": "T1234567",                             │
│        "cdl_state": "TX",                                    │
│        "dob": "1985-08-15",                                  │
│        "last_name": "Rodriguez"                              │
│      },                                                      │
│      // ... up to 1000 drivers per batch                    │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "query_id": "batch_limited_xyz",                          │
│    "status": "complete",                                     │
│    "results": [                                              │
│      {                                                       │
│        "cdl_number": "T1234567",                             │
│        "records_found": true,  // YES, record exists         │
│        "message": "Record(s) found. Full query required."    │
│      }                                                       │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  Action if records_found = true:                             │
│  1. Immediately remove driver from safety-sensitive duties   │
│  2. Conduct full query (requires driver consent)            │
│  3. Review violation details                                │
│  4. Determine if return-to-duty completed                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               REPORT VIOLATION                               │
├─────────────────────────────────────────────────────────────┤
│  POST /v1/violations                                         │
│  ────────────────────────────────────────────────────────── │
│  REQUIRED within 2 business days of positive test           │
│  MRO (Medical Review Officer) typically reports this         │
│                                                              │
│  Request:                                                    │
│  {                                                           │
│    "driver": {                                               │
│      "cdl_number": "T9876543",                               │
│      "cdl_state": "CA",                                      │
│      "dob": "1992-03-25",                                    │
│      "last_name": "Chen"                                     │
│    },                                                        │
│    "violation": {                                            │
│      "type": "POSITIVE_DRUG_TEST",                           │
│      "substance": "Cocaine",                                 │
│      "test_date": "2025-11-20",                              │
│      "test_type": "RANDOM",                                  │
│      "mro": {                                                │
│        "name": "Dr. Sarah Mitchell",                         │
│        "npi": "1234567890",                                  │
│        "contact": "sarah.mitchell@mro.com"                   │
│      }                                                       │
│    },                                                        │
│    "employer": {                                             │
│      "name": "XYZ Logistics Inc",                            │
│      "dot_number": "1234567",                                │
│      "contact_name": "John Smith (DER)",                     │
│      "contact_email": "john.smith@xyzlogistics.com"          │
│    }                                                         │
│  }                                                           │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "violation_id": "vio_abc123",                             │
│    "status": "reported",                                     │
│    "reported_at": "2025-11-24T15:30:00Z",                    │
│    "driver_status": "PROHIBITED"                             │
│  }                                                           │
│                                                              │
│  Note: Driver CANNOT operate CMV until:                      │
│  1. SAP evaluation completed                                │
│  2. SAP-recommended treatment completed                     │
│  3. Return-to-duty test NEGATIVE                            │
│  4. Follow-up testing plan in place                         │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Quest/LabCorp

```
FMCSA CLEARINGHOUSE + DRUG TESTING INTEGRATION
════════════════════════════════════════════════════════════════

Scenario: Positive DOT Drug Test
────────────────────────────────────────────────────────────────

Day 0: Random Drug Test
──────────────────────────────────────────────────────────────
PCS System → Quest API: Order DOT 5-panel urine test
      ↓
Quest: Send donor to collection site
      ↓
Collection completed


Day 2: Lab Analysis
──────────────────────────────────────────────────────────────
Quest Lab: Positive for Cocaine (confirmed by GC/MS)
      ↓
Status: "lab_positive_unconfirmed"


Day 3: MRO Review
──────────────────────────────────────────────────────────────
MRO calls driver (3 attempts)
      ↓
Driver: No legitimate prescription
      ↓
MRO: Confirms positive result
      ↓
MRO → Quest: Release results to employer
      ↓
MRO → FMCSA: Report violation to clearinghouse


Day 4: Employer Notification
──────────────────────────────────────────────────────────────
Quest Webhook → PCS Integrations Gateway
      ↓
Event: result.released (POSITIVE for Cocaine)
      ↓
PCS System Actions:
  1. Parse webhook
  2. Update employee status: "PROHIBITED"
  3. Alert DER immediately (email + SMS)
  4. Query FMCSA clearinghouse (verify reported)
  5. Create urgent task: "Remove driver from duties"
  6. Generate RTD (return-to-duty) checklist:
     ☐ SAP evaluation
     ☐ Treatment program
     ☐ RTD drug test
     ☐ Follow-up testing plan (6 tests over 12 months)


Parallel: FMCSA Clearinghouse Update
──────────────────────────────────────────────────────────────
MRO → FMCSA: POST /v1/violations
      ↓
FMCSA Database: Driver status = PROHIBITED
      ↓
ALL employers who query this driver will see violation


Day 5: PCS Compliance Check
──────────────────────────────────────────────────────────────
PCS Background Job: Query FMCSA for confirmation
      ↓
GET /v1/queries/full (driver_id)
      ↓
Response: violations: [{ type: "POSITIVE_DRUG_TEST", substance: "Cocaine" }]
      ↓
PCS System: Confirm status synced with federal database ✅
```

### Adapter Implementation

```typescript
export class FMCSAAdapter {
  private accessToken: string

  async authenticate(): Promise<void> {
    const response = await axios.post(
      'https://clearinghouse.fmcsa.dot.gov/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    )

    this.accessToken = response.data.access_token
  }

  async queryFullPreEmployment(driver: {
    cdlNumber: string
    cdlState: string
    dob: string
    lastName: string
    consentId: string
  }): Promise<{ recordsFound: boolean; violations?: any[] }> {
    const response = await axios.post(
      `${this.baseURL}/v1/queries/full`,
      {
        driver: {
          cdl_number: driver.cdlNumber,
          cdl_state: driver.cdlState,
          dob: driver.dob,
          last_name: driver.lastName,
        },
        consent: {
          consent_id: driver.consentId,
          obtained_at: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    return {
      recordsFound: response.data.records_found,
      violations: response.data.violations,
    }
  }

  async queryLimitedAnnual(
    drivers: Array<{
      cdlNumber: string
      cdlState: string
      dob: string
      lastName: string
    }>
  ): Promise<Array<{ cdlNumber: string; recordsFound: boolean }>> {
    const response = await axios.post(
      `${this.baseURL}/v1/queries/limited`,
      { drivers },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    return response.data.results
  }
}
```

---

## ID.me - Identity Verification {#idme}

**Official Documentation:** https://developers.id.me/

### Overview

ID.me provides NIST 800-63-3 IAL2 identity verification for field workers accessing PCS Pass (self-service portal). This prevents unauthorized access to PHI/PII.

### Authentication

```typescript
// OAuth 2.0 / OpenID Connect
const IDME_CLIENT_ID = process.env.IDME_CLIENT_ID
const IDME_CLIENT_SECRET = process.env.IDME_CLIENT_SECRET
const IDME_REDIRECT_URI = 'https://app.patriotcompliance.com/auth/idme/callback'

// Base URL
Production: https://api.id.me/oauth/authorize
Sandbox: https://api.id.me-sandbox.com/oauth/authorize
```

### Integration Flow

```
ID.ME IDENTITY VERIFICATION FLOW
════════════════════════════════════════════════════════════════

Step 1: User Initiates Login (PCS Pass Portal)
──────────────────────────────────────────────────────────────
Field Worker clicks "Log in with ID.me"
      ↓
PCS Auth Service redirects to ID.me:

GET https://api.id.me/oauth/authorize?
  client_id=patriot_compliance_prod&
  redirect_uri=https://app.patriotcompliance.com/auth/idme/callback&
  response_type=code&
  scope=openid email profile military&
  state=random_csrf_token_xyz


Step 2: ID.me Identity Verification
──────────────────────────────────────────────────────────────
User presented with verification options:
  ┌─────────────────────────────────────┐
  │  How do you want to verify?         │
  ├─────────────────────────────────────┤
  │  [Upload Driver's License]          │
  │  [Upload Passport]                  │
  │  [Video Selfie + ID]                │
  │  [In-Person Verification]           │
  └─────────────────────────────────────┘

User chooses: "Upload Driver's License"
      ↓
1. Takes photo of front + back of driver's license
2. ID.me OCR extracts: Name, DOB, Address, License #
3. Takes selfie (liveness detection)
4. ID.me facial recognition: Selfie matches DL photo? ✅
5. ID.me database check: Is DL valid in state database? ✅
      ↓
Verification Level: IAL2 (NIST 800-63-3)
      ↓
ID.me redirects back to PCS:

GET https://app.patriotcompliance.com/auth/idme/callback?
  code=AUTH_CODE_ABC123&
  state=random_csrf_token_xyz


Step 3: Token Exchange
──────────────────────────────────────────────────────────────
PCS Auth Service → ID.me Token Endpoint:

POST https://api.id.me/oauth/token
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE_ABC123",
  "client_id": "patriot_compliance_prod",
  "client_secret": "SECRET_XYZ",
  "redirect_uri": "https://app.patriotcompliance.com/auth/idme/callback"
}

Response:
{
  "access_token": "idme_access_token_xyz",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}


Step 4: Get User Info
──────────────────────────────────────────────────────────────
PCS Auth Service → ID.me UserInfo Endpoint:

GET https://api.id.me/api/public/v3/userinfo
Authorization: Bearer idme_access_token_xyz

Response:
{
  "sub": "idme_user_abc123",  // Unique ID.me identifier
  "email": "mike.worker@acme.com",
  "email_verified": true,
  "given_name": "Mike",
  "family_name": "Worker",
  "birthdate": "1990-05-15",
  "verified_at": "2025-11-24T10:00:00Z",
  "verification_level": "IAL2",  // NIST 800-63-3
  "attributes": {
    "military": {
      "status": "veteran",
      "branch": "Army",
      "verified": true
    }
  }
}


Step 5: Create/Link PCS Account
──────────────────────────────────────────────────────────────
PCS Auth Service logic:

1. Check if user exists (by email or idme_sub)
      ↓
   ├── User exists → Link ID.me sub to existing account
   │                  ↓
   │              Update: identity_verified = true
   │                      identity_verification_date = now()
   │                      identity_verification_level = "IAL2"
   │
   └── User does NOT exist → Create new account
                              ↓
                        firstName: Mike
                        lastName: Worker
                        email: mike.worker@acme.com
                        role: field_worker
                        identity_verified: true
                        identity_provider: "idme"
                        idme_sub: idme_user_abc123

2. Create PCS session (Redis)

3. Issue PCS JWT tokens
      ↓
   {
     "sub": "emp_456",  // PCS employee ID
     "email": "mike.worker@acme.com",
     "role": "field_worker",
     "tenantId": "acme_corp",
     "identity_verified": true,
     "identity_verification_level": "IAL2",
     "permissions": ["employees:own", "drug-testing:own", ...]
   }

4. Redirect to PCS Pass dashboard
```

### Adapter Implementation

```typescript
export class IDmeAdapter {
  getAuthorizationURL(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile military',
      state: state, // CSRF protection
    })

    return `https://api.id.me/oauth/authorize?${params.toString()}`
  }

  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string
    idToken: string
  }> {
    const response = await axios.post('https://api.id.me/oauth/token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    })

    return {
      accessToken: response.data.access_token,
      idToken: response.data.id_token,
    }
  }

  async getUserInfo(accessToken: string): Promise<{
    sub: string
    email: string
    firstName: string
    lastName: string
    verificationLevel: string
  }> {
    const response = await axios.get(
      'https://api.id.me/api/public/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return {
      sub: response.data.sub,
      email: response.data.email,
      firstName: response.data.given_name,
      lastName: response.data.family_name,
      verificationLevel: response.data.verification_level, // IAL1, IAL2, IAL3
    }
  }
}
```

**Why ID.me for Field Workers?**
- **Prevents account sharing:** Facial recognition ensures only verified person logs in
- **FedRAMP requirement:** IA-2 (Identification and Authentication) requires IAL2 for remote access
- **HIPAA compliance:** PHI access requires verified identity
- **DOT compliance:** DOT-regulated workers accessing own records need identity proofing

---

## Webhook Security & Idempotency {#webhook-security}

```
WEBHOOK SECURITY IMPLEMENTATION
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                  SIGNATURE VERIFICATION                      │
├─────────────────────────────────────────────────────────────┤
│  All vendor webhooks signed with HMAC-SHA256                 │
│                                                              │
│  Example (Checkr):                                           │
│  ────────────────────────────────────────────────────────── │
│  Incoming Request:                                           │
│    POST /webhooks/checkr                                     │
│    X-Checkr-Signature: abc123def456...                       │
│    Body: {"type": "report.completed", ...}                   │
│                                                              │
│  Verification:                                               │
│    const expectedSignature = crypto                          │
│      .createHmac('sha256', CHECKR_WEBHOOK_SECRET)            │
│      .update(requestBody)                                    │
│      .digest('hex')                                          │
│                                                              │
│    if (expectedSignature !== receivedSignature) {            │
│      return res.status(401).json({ error: 'Invalid signature' })│
│    }                                                         │
│                                                              │
│  Why: Prevents spoofed webhooks from malicious actors       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  IDEMPOTENCY HANDLING                        │
├─────────────────────────────────────────────────────────────┤
│  Vendors may send duplicate webhooks (retries)               │
│  We must process each event exactly once                     │
│                                                              │
│  Implementation:                                             │
│  ────────────────────────────────────────────────────────── │
│  1. Extract unique event ID from webhook                     │
│     (e.g., Checkr: webhook.id, Quest: specimen_id)           │
│                                                              │
│  2. Check Redis: Has this event been processed?              │
│     GET processed_webhooks:{vendor}:{event_id}               │
│                                                              │
│  3. If exists → Return 200 OK (acknowledge but skip)         │
│                                                              │
│  4. If not exists:                                           │
│     a. SET processed_webhooks:{vendor}:{event_id} "processed"│
│        EX 86400 (24-hour TTL)                                │
│     b. Process webhook normally                              │
│     c. Publish to Kafka                                      │
│                                                              │
│  Redis Schema:                                               │
│    Key: processed_webhooks:checkr:evt_abc123                │
│    Value: "processed"                                        │
│    TTL: 86400 seconds (24 hours)                             │
│                                                              │
│  Why: Kafka guarantees at-least-once delivery                │
│       Idempotency ensures exactly-once processing            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  WEBHOOK RETRY HANDLING                      │
├─────────────────────────────────────────────────────────────┤
│  If our webhook endpoint is down, vendors retry              │
│                                                              │
│  Vendor Retry Schedules:                                     │
│  ────────────────────────────────────────────────────────── │
│  Checkr: 5 retries over 24 hours                             │
│    - Immediate                                               │
│    - 5 minutes                                               │
│    - 1 hour                                                  │
│    - 6 hours                                                 │
│    - 24 hours                                                │
│                                                              │
│  Quest: 3 retries over 6 hours                               │
│    - 5 minutes                                               │
│    - 30 minutes                                              │
│    - 6 hours                                                 │
│                                                              │
│  Our Guarantee:                                              │
│  ────────────────────────────────────────────────────────── │
│  1. Return 200 OK within 5 seconds (fast acknowledgment)    │
│  2. Process webhook async (Kafka consumer)                   │
│  3. If processing fails, Kafka retries with backoff          │
│  4. Dead letter queue (DLQ) for permanent failures           │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling & Retries {#error-handling}

```
ERROR HANDLING STRATEGY
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│           TRANSIENT ERRORS (Retry with Backoff)              │
├─────────────────────────────────────────────────────────────┤
│  • Network timeout (ETIMEDOUT)                               │
│  • 5xx Server Error (vendor API down)                        │
│  • 429 Rate Limit Exceeded                                   │
│  • Connection refused                                        │
│                                                              │
│  Retry Strategy (Exponential Backoff):                       │
│  ────────────────────────────────────────────────────────── │
│  Attempt 1: Immediate                                        │
│  Attempt 2: Wait 1 second                                    │
│  Attempt 3: Wait 2 seconds                                   │
│  Attempt 4: Wait 4 seconds                                   │
│  Attempt 5: Wait 8 seconds                                   │
│  Attempt 6: Wait 16 seconds                                  │
│  Max Attempts: 6                                             │
│  Max Total Time: 31 seconds                                  │
│                                                              │
│  After 6 failures → Move to Dead Letter Queue (DLQ)          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           PERMANENT ERRORS (No Retry, Alert)                 │
├─────────────────────────────────────────────────────────────┤
│  • 400 Bad Request (invalid payload)                         │
│  • 401 Unauthorized (invalid API key)                        │
│  • 403 Forbidden (insufficient permissions)                  │
│  • 404 Not Found (resource doesn't exist)                    │
│  • 422 Unprocessable Entity (validation failed)              │
│                                                              │
│  Actions:                                                    │
│  ────────────────────────────────────────────────────────── │
│  1. Log error details (full request/response)                │
│  2. Create alert ticket (PagerDuty/Jira)                     │
│  3. Notify ops team (Slack #integrations-alerts)             │
│  4. Store in error database for manual review                │
│  5. Do NOT retry (will always fail)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           CIRCUIT BREAKER PATTERN                            │
├─────────────────────────────────────────────────────────────┤
│  Prevents cascading failures when vendor API is down         │
│                                                              │
│  States:                                                     │
│  ────────────────────────────────────────────────────────── │
│  CLOSED (Normal):                                            │
│    All requests go through                                   │
│                                                              │
│  OPEN (Vendor Down):                                         │
│    Fail fast, no network calls                               │
│    Triggered after: 5 consecutive failures                   │
│                                                              │
│  HALF-OPEN (Testing):                                        │
│    After 30 seconds, try 1 request                           │
│    If success → CLOSED                                       │
│    If failure → OPEN (wait another 30 seconds)               │
│                                                              │
│  Implementation (opossum library):                           │
│  ────────────────────────────────────────────────────────── │
│  const breaker = new CircuitBreaker(checkrAPI.orderReport, {│
│    timeout: 10000,        // 10 seconds                      │
│    errorThresholdPercentage: 50,                             │
│    resetTimeout: 30000    // 30 seconds                      │
│  })                                                          │
│                                                              │
│  breaker.on('open', () => {                                  │
│    alert('Checkr API circuit breaker OPEN')                  │
│  })                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Rate Limiting & Circuit Breakers {#rate-limiting}

```
VENDOR RATE LIMITS (as of Nov 2024)
════════════════════════════════════════════════════════════════

┌──────────────┬─────────────────┬───────────────────────────┐
│   Vendor     │   Rate Limit    │   Strategy                │
├──────────────┼─────────────────┼───────────────────────────┤
│ Checkr       │ 100 req/min     │ Token bucket (Redis)      │
│              │ 10,000 req/day  │ Daily quota tracking      │
├──────────────┼─────────────────┼───────────────────────────┤
│ TazWorks     │ 60 req/min      │ Sliding window (Redis)    │
│              │ Burst: 10 req/s │ Short-term burst limiter  │
├──────────────┼─────────────────┼───────────────────────────┤
│ Quest        │ 50 req/min      │ Fixed window (1 min)      │
│              │ No daily limit  │                           │
├──────────────┼─────────────────┼───────────────────────────┤
│ FMCSA        │ 30 req/min      │ Token bucket + OAuth      │
│ Clearinghouse│ 500 req/day     │ Daily quota (strict)      │
├──────────────┼─────────────────┼───────────────────────────┤
│ ID.me        │ 100 req/min     │ OAuth rate limit          │
│              │ Per client_id   │ Automatic throttling      │
└──────────────┴─────────────────┴───────────────────────────┘


RATE LIMITER IMPLEMENTATION (Token Bucket)
────────────────────────────────────────────────────────────────

Redis Schema:
  Key: ratelimit:checkr:bucket
  Value: 100 (tokens available)
  TTL: Auto-refill 100 tokens per minute

Pseudocode:
──────────────────────────────────────────────────────────────
function checkRateLimit(vendor: string): boolean {
  const key = `ratelimit:${vendor}:bucket`
  const tokens = redis.get(key) || 100

  if (tokens > 0) {
    redis.decr(key)
    return true  // Allow request
  } else {
    throw new RateLimitError('Rate limit exceeded, retry in 1 minute')
  }
}

Background Job (every minute):
──────────────────────────────────────────────────────────────
redis.set('ratelimit:checkr:bucket', 100, 'EX', 60)
redis.set('ratelimit:tazworks:bucket', 60, 'EX', 60)
redis.set('ratelimit:quest:bucket', 50, 'EX', 60)
redis.set('ratelimit:fmcsa:bucket', 30, 'EX', 60)
```

---

## Integration Testing Strategy {#testing}

```
INTEGRATION TESTING APPROACH
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│              UNIT TESTS (Adapter Layer)                      │
├─────────────────────────────────────────────────────────────┤
│  • Mock vendor API responses                                 │
│  • Test signature verification logic                         │
│  • Test idempotency handling                                 │
│  • Test error handling (4xx, 5xx)                            │
│  • Test ComplianceEvent transformation                       │
│                                                              │
│  Framework: Jest + nock (HTTP mocking)                       │
│  Coverage Target: 90%                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              SANDBOX TESTING (Vendor Staging)                │
├─────────────────────────────────────────────────────────────┤
│  All vendors provide sandbox environments:                   │
│                                                              │
│  • Checkr Sandbox: api.checkr-sandbox.com                    │
│    - Mock candidates return predefined results              │
│    - Webhook delivery testing                               │
│                                                              │
│  • Quest Sandbox: sandbox.employersolutions.com              │
│    - Test eCCF ordering                                      │
│    - Mock specimens return NEGATIVE/POSITIVE                │
│                                                              │
│  • FMCSA Test Environment: clearinghouse-test.fmcsa.dot.gov  │
│    - Test CDL queries                                        │
│    - Mock violation data                                    │
│                                                              │
│  Strategy:                                                   │
│  ────────────────────────────────────────────────────────── │
│  1. Deploy to staging environment                            │
│  2. Configure sandbox API keys                               │
│  3. Run E2E test suite:                                      │
│     - Order background check → Receive webhook              │
│     - Order drug test → Receive positive result             │
│     - Query clearinghouse → Get mock violations             │
│  4. Verify Kafka events published correctly                  │
│  5. Verify Core Service updates employee records             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              PRODUCTION MONITORING                           │
├─────────────────────────────────────────────────────────────┤
│  • Uptime monitoring (Pingdom/UptimeRobot)                   │
│    - Monitor /webhooks/checkr endpoint (200 OK expected)    │
│    - Alert if down > 5 minutes                              │
│                                                              │
│  • Error rate monitoring (Sentry/Datadog)                    │
│    - Alert if error rate > 5%                               │
│    - Track 4xx vs 5xx errors                                │
│                                                              │
│  • Latency monitoring (P50, P95, P99)                        │
│    - Target: P95 < 2 seconds for API calls                  │
│    - Target: P95 < 500ms for webhook processing            │
│                                                              │
│  • Webhook delivery success rate                             │
│    - Track: Received → Processed → Published to Kafka       │
│    - Target: > 99.9% success rate                           │
└─────────────────────────────────────────────────────────────┘
```

---

**Summary: 5 External Integrations**

| Vendor | Purpose | API Type | Authentication | Webhook | Priority |
|--------|---------|----------|----------------|---------|----------|
| **Checkr** | Background screening | REST | Bearer token | Yes (HMAC) | High |
| **TazWorks** | Background screening (alt) | REST JSON | Bearer token | Yes (HMAC) | Medium |
| **Quest Diagnostics** | Drug testing (eCCF) | REST | Bearer token | Yes (HMAC) | High |
| **FMCSA Clearinghouse** | DOT drug/alcohol database | REST | OAuth 2.0 | No (pull only) | High |
| **ID.me** | Identity verification (IAL2) | OAuth/OIDC | OAuth 2.0 | No (redirect flow) | High |

**Next Steps:**
1. ✅ External API catalog documented
2. ⏭️ Update ARCHITECTURE_TECHNICAL.md
3. ⏭️ Create comprehensive RBAC matrix markdown
4. ⏭️ Create SOC 2 Type II documentation
5. ⏭️ Create internal API catalog (70+ endpoints)
6. ⏭️ Create deployment architecture
7. ⏭️ Create data model documentation
8. ⏭️ Create project roadmap tracking

Should I continue with updating ARCHITECTURE_TECHNICAL.md?

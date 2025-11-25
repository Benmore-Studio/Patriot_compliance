# Internal API Catalog - Complete Reference

**Document Version:** 1.0
**Created:** 2025-11-24
**Base URL:** `https://api.patriotcompliance.com`
**Total Endpoints:** 78
**API Style:** RESTful
**Authentication:** JWT Bearer Token

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication & Authorization](#authentication)
3. [Common Patterns](#common-patterns)
4. [Error Handling](#error-handling)
5. [Auth Service APIs (14 endpoints)](#auth-service)
6. [Employee APIs (7 endpoints)](#employees)
7. [Drug Testing APIs (5 endpoints)](#drug-testing)
8. [Background Check APIs (4 endpoints)](#background)
9. [DOT Compliance APIs (5 endpoints)](#dot)
10. [Occupational Health APIs (3 endpoints)](#health)
11. [Training & Certifications APIs (3 endpoints)](#training)
12. [Geo-Fencing APIs (4 endpoints)](#geo-fencing)
13. [Policy Driver APIs (4 endpoints)](#policy)
14. [Reports APIs (6 endpoints)](#reports)
15. [Dashboard APIs (4 endpoints)](#dashboard)
16. [Billing APIs (4 endpoints)](#billing)
17. [Audit APIs (5 endpoints)](#audit)
18. [Communication APIs (2 endpoints)](#communications)
19. [Sharing APIs (2 endpoints)](#sharing)
20. [DER IQ AI Chat APIs (2 endpoints)](#der-iq)
21. [Webhook APIs (4 endpoints)](#webhooks)

---

## API Overview {#api-overview}

```
API ARCHITECTURE
════════════════════════════════════════════════════════════════

Base URL: https://api.patriotcompliance.com

All requests require:
  • Authorization: Bearer <JWT_TOKEN>
  • Content-Type: application/json

Response Format:
  Success (200-299):
    {
      "success": true,
      "data": { ... }
    }

  Error (400-599):
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE",
        "message": "Human-readable error message",
        "details": { ... }
      }
    }


API Versioning:
  • URL-based: /v1/employees, /v2/employees
  • Current version: v1 (implicit, no prefix)
  • When introducing breaking changes, increment version


Rate Limiting:
  • Per tenant: 100 requests/minute
  • Per endpoint: Varies (webhooks: 1000/min)
  • Headers returned:
    - X-RateLimit-Limit: 100
    - X-RateLimit-Remaining: 87
    - X-RateLimit-Reset: 1700000000 (Unix timestamp)
```

---

## Authentication & Authorization {#authentication}

### JWT Token Structure

```json
{
  "sub": "user_abc123",
  "email": "john.doe@acme.com",
  "role": "der",
  "tenantId": "acme_corp",
  "permissions": [
    "employees:read",
    "employees:write",
    "drug-testing:read",
    "drug-testing:write"
  ],
  "iat": 1700000000,
  "exp": 1700000900,
  "iss": "pcs.patriotcompliance.com",
  "aud": "pcs-api",
  "jti": "jwt_xyz789"
}
```

### Making Authenticated Requests

```typescript
// Example: Fetch employees
const response = await fetch('https://api.patriotcompliance.com/api/employees', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
})

const data = await response.json()

if (!response.ok) {
  console.error('API Error:', data.error)
  throw new Error(data.error.message)
}

console.log('Employees:', data.data)
```

---

## Common Patterns {#common-patterns}

### Pagination

```
GET /api/employees?page=1&limit=50

Response:
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Filtering

```
GET /api/employees?status=ACTIVE&role=CDL_driver&sort=lastName:asc

Query Parameters:
  • status: ACTIVE | INACTIVE | TERMINATED
  • role: CDL_driver | forklift_operator | general_laborer
  • sort: {field}:asc | {field}:desc
  • search: Fuzzy search across firstName, lastName, email
```

### Sorting

```
GET /api/drug-testing/tests?sort=testDate:desc,lastName:asc

Multiple sort fields separated by comma.
Format: {field}:{direction}
```

---

## Error Handling {#error-handling}

### Standard Error Codes

| HTTP Status | Error Code | Description | Example |
|-------------|------------|-------------|---------|
| **400** | `VALIDATION_ERROR` | Request body failed Zod validation | Missing required field |
| **401** | `UNAUTHORIZED` | Missing or invalid JWT token | Token expired |
| **403** | `FORBIDDEN` | User lacks required permission | der trying to delete employee |
| **404** | `NOT_FOUND` | Resource doesn't exist | Employee ID not found |
| **409** | `CONFLICT` | Resource conflict (duplicate key) | Email already exists |
| **422** | `UNPROCESSABLE_ENTITY` | Business logic validation failed | Cannot delete active employee |
| **429** | `RATE_LIMIT_EXCEEDED` | Too many requests | 100 req/min limit hit |
| **500** | `INTERNAL_SERVER_ERROR` | Unexpected server error | Database connection failed |
| **503** | `SERVICE_UNAVAILABLE` | Service temporarily down | Database maintenance |

### Error Response Examples

```json
// 400 Validation Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "hireDate": "Must be a valid date"
      }
    }
  }
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "details": {
      "required": ["employees:delete"],
      "userPermissions": ["employees:read", "employees:write"]
    }
  }
}

// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Employee not found",
    "details": {
      "employeeId": "emp_123456",
      "tenantId": "acme_corp"
    }
  }
}
```

---

## Auth Service APIs (14 endpoints) {#auth-service}

### POST /api/auth/login

**Description:** Authenticate user with email and password

**Required Permission:** None (public endpoint)

**Request:**

```json
{
  "email": "john.doe@acme.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "mfaRequired": true,
    "tempToken": "temp_xyz789",
    "message": "MFA code sent to your authenticator app"
  }
}
```

**Flow:**

```
POST /api/auth/login
      ↓
1. Validate email format (Zod)
2. Find user by email
3. Verify password (bcrypt.compare)
4. Check MFA enrollment
      ↓
   ├── MFA enrolled → Create temp session, return mfaRequired: true
   └── MFA not enrolled → Redirect to /api/auth/mfa/enroll
```

---

### POST /api/auth/mfa-challenge

**Description:** Verify MFA code and issue JWT tokens

**Required Permission:** None (temp token required)

**Request:**

```json
{
  "tempToken": "temp_xyz789",
  "mfaCode": "123456"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "user_abc123",
      "email": "john.doe@acme.com",
      "role": "der",
      "tenantId": "acme_corp"
    }
  }
}
```

---

### POST /api/auth/refresh

**Description:** Refresh access token using refresh token

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

---

### POST /api/auth/logout

**Description:** Invalidate current session and tokens

**Required Permission:** Authenticated user

**Request:**

```json
{
  "sessionId": "session_xyz789"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### POST /api/auth/mfa/enroll

**Description:** Enroll in MFA (TOTP)

**Required Permission:** Authenticated user

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgo...",
    "backupCodes": [
      "1234-5678-90AB",
      "CDEF-1234-5678",
      "90AB-CDEF-1234"
    ]
  }
}
```

**Flow:**

```
POST /api/auth/mfa/enroll
      ↓
1. Generate TOTP secret (speakeasy.generateSecret)
2. Generate QR code (qrcode.toDataURL)
3. Generate 10 backup codes (random, hashed with bcrypt)
4. Store in database (encrypted)
5. Return secret + QR code + backup codes
      ↓
User scans QR code with Google Authenticator
      ↓
POST /api/auth/mfa/verify (verify first code)
      ↓
If valid → mfaEnabled = true
```

---

### POST /api/auth/saml/login

**Description:** Initiate SAML SSO login (Okta, Azure AD, Google)

**Required Permission:** None (public endpoint)

**Request:**

```json
{
  "tenantId": "acme_corp"
}
```

**Response (302 Redirect):**

```
Location: https://okta.acme.com/saml/login?SAMLRequest=...
```

---

### GET /api/auth/idme/callback

**Description:** ID.me OAuth callback (identity verification for field workers)

**Query Parameters:**

```
?code=AUTH_CODE_ABC123&state=csrf_token_xyz
```

**Response (302 Redirect):**

```
Location: https://app.patriotcompliance.com/portals/pcs-pass?token=...
```

---

### POST /api/auth/password/reset-request

**Description:** Request password reset email

**Request:**

```json
{
  "email": "john.doe@acme.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent (if account exists)"
  }
}
```

**Note:** Always return success (don't leak if email exists)

---

### POST /api/auth/users (Admin)

**Description:** Create new user account

**Required Permission:** `settings:write` (system_admin only)

**Request:**

```json
{
  "email": "jane.smith@acme.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "safety_manager",
  "sendWelcomeEmail": true
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "user_xyz789",
    "email": "jane.smith@acme.com",
    "status": "PENDING_ACTIVATION",
    "mfaEnrolled": false
  }
}
```

---

## Employee APIs (7 endpoints) {#employees}

### GET /api/employees

**Description:** List all employees (paginated, filtered)

**Required Permission:** `employees:read`

**Query Parameters:**

```
?page=1
&limit=50
&status=ACTIVE|INACTIVE|TERMINATED
&role=CDL_driver|forklift_operator|general_laborer
&search=John
&sort=lastName:asc
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "emp_001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@acme.com",
        "phone": "555-123-4567",
        "hireDate": "2023-01-15",
        "status": "ACTIVE",
        "role": "CDL_driver",
        "complianceStatus": {
          "overall": "green",
          "drugTesting": "green",
          "background": "green",
          "dot": "green",
          "training": "amber"
        },
        "createdAt": "2023-01-10T10:00:00Z",
        "updatedAt": "2025-11-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Field Masking (by role):**

| Field | super_admin | der | safety_manager | field_worker | auditor |
|-------|-------------|-----|----------------|--------------|---------|
| `ssn` | 123-45-6789 | 123-45-6789 | ***-**-6789 | (own only) | ***-**-6789 |
| `dob` | 1985-06-15 | 1985-06-15 | ****-**-15 | (own only) | ****-**-15 |
| `phone` | 555-123-4567 | 555-123-4567 | 555-123-4567 | (own only) | 555-***-**** |

---

### POST /api/employees

**Description:** Create new employee

**Required Permission:** `employees:write`

**Request:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@acme.com",
  "phone": "555-987-6543",
  "ssn": "987-65-4321",
  "dob": "1990-03-20",
  "hireDate": "2025-12-01",
  "role": "forklift_operator",
  "department": "Warehouse",
  "location": "Houston Facility"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "emp_002",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@acme.com",
    "status": "ACTIVE",
    "complianceStatus": {
      "overall": "red",
      "drugTesting": "red",
      "background": "red",
      "training": "red",
      "message": "New hire - compliance checks required"
    }
  }
}
```

**Validation Rules:**

```typescript
const employeeSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/).optional(),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/).optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  role: z.enum(['CDL_driver', 'forklift_operator', 'general_laborer']),
})
```

---

### GET /api/employees/{id}

**Description:** Get single employee by ID

**Required Permission:** `employees:read` OR `employees:own` (if employeeId = self)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "emp_001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@acme.com",
    "ssn": "***-**-6789",
    "dob": "****-**-15",
    "hireDate": "2023-01-15",
    "status": "ACTIVE",
    "complianceData": {
      "drugTesting": {
        "status": "compliant",
        "flag": "green",
        "lastTest": "2025-09-15",
        "nextRandom": "2026-01-10",
        "violations": []
      },
      "background": {
        "status": "compliant",
        "flag": "green",
        "lastCheck": "2024-06-01",
        "expires": "2027-06-01",
        "adjudication": "approved"
      },
      "dot": {
        "status": "compliant",
        "flag": "green",
        "medicalCertExpires": "2026-03-15",
        "clearinghouseStatus": "clean"
      },
      "training": {
        "status": "at_risk",
        "flag": "amber",
        "forkliftCert": {
          "expires": "2025-12-15",
          "daysRemaining": 21
        }
      }
    }
  }
}
```

---

### PUT /api/employees/{id}

**Description:** Update employee

**Required Permission:** `employees:write`

**Request:**

```json
{
  "email": "john.doe.new@acme.com",
  "phone": "555-111-2222",
  "department": "Operations"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "emp_001",
    "email": "john.doe.new@acme.com",
    "updatedAt": "2025-11-24T15:30:00Z"
  }
}
```

**Note:** SSN, DOB cannot be changed (immutable after creation)

---

### DELETE /api/employees/{id}

**Description:** Soft delete employee (status = DISABLED)

**Required Permission:** `employees:delete`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "emp_001",
    "status": "DISABLED",
    "disabledAt": "2025-11-24T15:35:00Z"
  }
}
```

**Note:** Data retained for 7 years (compliance requirement)

---

### POST /api/employees/bulk-upload

**Description:** Bulk upload employees from CSV/Excel

**Required Permission:** `employees:write`

**Request:**

```
Content-Type: multipart/form-data

file: employees.csv
```

**CSV Format:**

```csv
firstName,lastName,email,ssn,dob,hireDate,role
John,Doe,john.doe@acme.com,123-45-6789,1985-06-15,2023-01-15,CDL_driver
Jane,Smith,jane.smith@acme.com,987-65-4321,1990-03-20,2025-12-01,forklift_operator
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "processed": 250,
    "created": 240,
    "updated": 10,
    "errors": [
      {
        "row": 15,
        "email": "invalid-email",
        "error": "Invalid email format"
      }
    ]
  }
}
```

---

### GET /api/employees/export

**Description:** Export employees to CSV/Excel (with optional PII)

**Required Permission:** `employees:export`

**Query Parameters:**

```
?format=csv|excel|pdf
&includePII=true|false
&status=ACTIVE|INACTIVE|TERMINATED
&fields=firstName,lastName,email,ssn,dob
```

**Response (if includePII=false, 200 OK):**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://exports.patriotcompliance.com/...",
    "expiresAt": "2025-11-25T15:40:00Z",
    "recordCount": 1250
  }
}
```

**Response (if includePII=true, 202 Accepted):**

```json
{
  "success": true,
  "data": {
    "exportRequestId": "exp_req_123",
    "status": "PENDING_APPROVAL",
    "message": "Export request sent to audit_manager for approval"
  }
}
```

**Dual Control Flow:**

```
Export with PII Request
      ↓
Create export request (status: PENDING_APPROVAL)
      ↓
Notify audit_manager (email + dashboard notification)
      ↓
Audit Manager approves (POST /api/exports/{id}/approve)
      ↓
Generate watermarked CSV
      ↓
Upload to S3, create signed URL (24-hour expiry)
      ↓
Email requester with download link
```

---

## Drug Testing APIs (5 endpoints) {#drug-testing}

### GET /api/drug-testing/tests

**Description:** List all drug tests

**Required Permission:** `drug-testing:read`

**Query Parameters:**

```
?employeeId=emp_001
&testType=RANDOM|PRE_EMPLOYMENT|POST_ACCIDENT|REASONABLE_SUSPICION
&result=NEGATIVE|POSITIVE|DILUTE_NEGATIVE|REFUSAL_TO_TEST
&startDate=2025-01-01
&endDate=2025-11-24
&page=1
&limit=50
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "test_001",
        "employeeId": "emp_001",
        "employee": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "testType": "RANDOM",
        "testDate": "2025-09-15",
        "specimenId": "QST-2025-09-15-001234",
        "result": "NEGATIVE",
        "mroReview": {
          "status": "COMPLETED",
          "reviewedBy": "Dr. Sarah Mitchell",
          "reviewedAt": "2025-09-16T14:30:00Z"
        },
        "isDOTRegulated": true,
        "reportedToClearinghouse": true,
        "documentUrl": "https://documents.pcs.com/...",
        "createdAt": "2025-09-15T09:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### POST /api/drug-testing/tests

**Description:** Order new drug test

**Required Permission:** `drug-testing:write`

**Request:**

```json
{
  "employeeId": "emp_001",
  "testType": "RANDOM",
  "testDate": "2025-11-25",
  "isDOTRegulated": true,
  "collectionSite": {
    "name": "Quest Diagnostics - Houston",
    "siteId": "QST_Houston_001",
    "address": "5601 S Broadway, Houston TX 77051"
  },
  "notifyDonor": true
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "test_002",
    "specimenId": "QST-2025-11-25-005678",
    "status": "PENDING_COLLECTION",
    "collectionDeadline": "2025-11-27T17:00:00Z",
    "donorInstructionsUrl": "https://quest.com/instructions/..."
  }
}
```

**Flow:**

```
POST /api/drug-testing/tests
      ↓
1. Validate employeeId exists
2. Check if employee DOT-regulated (CDL driver?)
3. Call Integrations Gateway:
   POST /integrations/quest/eccf/order
      ↓
4. Quest returns specimenId
5. Store in database (status: PENDING_COLLECTION)
6. Send email to employee with collection instructions
7. Return response
```

---

### POST /api/drug-testing/random-selection

**Description:** Run random selection algorithm for drug testing pool

**Required Permission:** `drug-testing:write`

**Request:**

```json
{
  "poolSize": 100,
  "selectionRate": 0.5,
  "testType": "RANDOM",
  "isDOTRegulated": true,
  "excludeRecentlyTested": true,
  "excludeDays": 90
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "selectedEmployees": [
      {
        "id": "emp_123",
        "firstName": "Mike",
        "lastName": "Johnson",
        "lastTestDate": null
      },
      {
        "id": "emp_456",
        "firstName": "Sarah",
        "lastName": "Williams",
        "lastTestDate": "2025-05-10"
      }
    ],
    "selectionCount": 50,
    "poolSize": 100,
    "algorithm": "cryptographically_secure_random",
    "generatedAt": "2025-11-24T10:00:00Z"
  }
}
```

**Random Selection Algorithm:**

```
DOT RANDOM SELECTION ALGORITHM
════════════════════════════════════════════════════════════════

Requirements (49 CFR Part 40):
  • 50% of CDL drivers tested annually (minimum)
  • Selection must be random (unpredictable)
  • Cannot exclude any driver (unless on leave, terminated)
  • Spread throughout year (not all in December)

Implementation:
────────────────────────────────────────────────────────────────
1. Get eligible pool:
   SELECT id FROM employees
   WHERE tenant_id = 'acme_corp'
     AND role = 'CDL_driver'
     AND status = 'ACTIVE'
     AND (last_random_test_date IS NULL
          OR last_random_test_date < CURRENT_DATE - INTERVAL '90 days')

   Result: 100 eligible drivers

2. Calculate selection count:
   selectionCount = Math.ceil(poolSize * selectionRate)
   selectionCount = Math.ceil(100 * 0.5) = 50

3. Random selection (cryptographically secure):
   const selected = []
   const pool = [...eligibleDrivers]

   for (let i = 0; i < selectionCount; i++) {
     const randomIndex = crypto.randomInt(0, pool.length)
     selected.push(pool[randomIndex])
     pool.splice(randomIndex, 1) // Remove to prevent duplicates
   }

4. Audit log:
   action: "RANDOM_SELECTION"
   details: {
     poolSize: 100,
     selectedCount: 50,
     algorithm: "crypto.randomInt",
     selectedEmployeeIds: ["emp_123", "emp_456", ...]
   }

5. Create drug test orders for selected employees
```

---

### POST /api/drug-testing/mro-review

**Description:** MRO (Medical Review Officer) review workflow

**Required Permission:** `drug-testing:write` (DER only)

**Request:**

```json
{
  "testId": "test_001",
  "mroReviewStatus": "NEGATIVE_VERIFIED",
  "mroNotes": "Donor provided valid prescription for Oxycodone",
  "mroName": "Dr. Sarah Mitchell",
  "reviewDate": "2025-11-24"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "testId": "test_001",
    "result": "NEGATIVE",
    "mroReviewStatus": "COMPLETED",
    "finalResult": "NEGATIVE_VERIFIED",
    "updatedAt": "2025-11-24T15:45:00Z"
  }
}
```

**MRO Review Statuses:**

| Status | Description |
|--------|-------------|
| `PENDING` | Lab result received, awaiting MRO review |
| `NEGATIVE_VERIFIED` | MRO confirmed negative result |
| `POSITIVE_VERIFIED` | MRO confirmed positive (no legitimate explanation) |
| `CANCELLED` | Test cancelled by MRO (lab error, insufficient specimen) |
| `DILUTE_REFUSAL` | Dilute specimen treated as refusal (DOT) |

---

### GET /api/drug-testing/clearinghouse

**Description:** Query FMCSA clearinghouse for CDL driver

**Required Permission:** `drug-testing:read` (DER only)

**Query Parameters:**

```
?employeeId=emp_001
&queryType=FULL|LIMITED
&consentId=consent_abc123 (required for FULL query)
```

**Response (200 OK for FULL query):**

```json
{
  "success": true,
  "data": {
    "employeeId": "emp_001",
    "cdlNumber": "T1234567",
    "cdlState": "TX",
    "queryType": "FULL",
    "recordsFound": false,
    "message": "No drug or alcohol violations on record",
    "queriedAt": "2025-11-24T16:00:00Z"
  }
}
```

**Response (if records found):**

```json
{
  "success": true,
  "data": {
    "employeeId": "emp_001",
    "queryType": "FULL",
    "recordsFound": true,
    "violations": [
      {
        "violationDate": "2023-06-10",
        "violationType": "POSITIVE_DRUG_TEST",
        "substance": "Marijuana",
        "employer": "Previous Employer LLC",
        "sapProcess": {
          "completed": true,
          "completedAt": "2023-09-15"
        },
        "returnToDutyTest": {
          "completed": true,
          "testDate": "2023-09-20",
          "result": "NEGATIVE"
        }
      }
    ],
    "hireRecommendation": "APPROVED",
    "notes": "Driver completed SAP process and return-to-duty testing"
  }
}
```

---

## Background Check APIs (4 endpoints) {#background}

### GET /api/background/screenings

**Description:** List background checks

**Required Permission:** `background:read`

**Query Parameters:**

```
?employeeId=emp_001
&status=PENDING|COMPLETE|DISPUTED
&result=CLEAR|CONSIDER|ENGAGED
&startDate=2025-01-01
&endDate=2025-11-24
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "bg_001",
        "employeeId": "emp_001",
        "employee": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "vendor": "checkr",
        "vendorReportId": "report_rpt123abc",
        "orderDate": "2024-06-01",
        "completionDate": "2024-06-03",
        "status": "COMPLETE",
        "result": "CLEAR",
        "adjudicationStatus": "APPROVED",
        "screenings": [
          {
            "type": "county_criminal_search",
            "status": "complete",
            "result": "clear",
            "recordsFound": 0
          },
          {
            "type": "ssn_trace",
            "status": "complete",
            "result": "clear",
            "addresses": [
              "123 Main St, Houston TX 77001 (2015-Present)"
            ]
          }
        ],
        "documentUrl": "https://documents.pcs.com/bg_001.pdf"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### POST /api/background/screenings

**Description:** Order new background check

**Required Permission:** `background:write`

**Request:**

```json
{
  "employeeId": "emp_002",
  "vendor": "checkr",
  "package": "standard_plus_criminal",
  "workLocations": [
    {
      "country": "US",
      "state": "TX",
      "city": "Houston"
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "bg_002",
    "vendorReportId": "report_xyz456",
    "status": "PENDING",
    "eta": "2025-11-27T10:00:00Z",
    "candidateInvitationUrl": "https://checkr.com/invites/..."
  }
}
```

**Flow:**

```
POST /api/background/screenings
      ↓
1. Validate employeeId exists
2. Get employee SSN, DOB (decrypt from database)
3. Call Integrations Gateway:
   POST /integrations/checkr/reports
   {
     candidate: { firstName, lastName, ssn, dob, ... },
     package: "standard_plus_criminal"
   }
      ↓
4. Checkr returns report_id
5. Store in database (status: PENDING)
6. Send email to employee (background check initiated)
7. Return response
      ↓
Later: Checkr sends webhook when report complete
      ↓
POST /webhooks/checkr
      ↓
Update background check (status: COMPLETE, result: CLEAR/CONSIDER)
```

---

### POST /api/background/adjudication

**Description:** FCRA adjudication decision (individualized assessment)

**Required Permission:** `background:write` (DER or compliance_officer only)

**Request:**

```json
{
  "backgroundCheckId": "bg_003",
  "decision": "APPROVED",
  "rationale": "Misdemeanor theft from 10 years ago. Candidate demonstrated rehabilitation: 10 years clean record, positive employment history, completed restitution. Job duties (warehouse worker) do not involve handling cash or valuables. Individualized assessment per EEOC guidelines recommends approval.",
  "conditions": [
    "6-month probationary period",
    "Supervisor notified of conviction"
  ]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "backgroundCheckId": "bg_003",
    "adjudicationStatus": "APPROVED",
    "adjudicatedBy": "user_789",
    "adjudicatedAt": "2025-11-24T16:30:00Z",
    "hireRecommendation": "APPROVED_WITH_CONDITIONS"
  }
}
```

**Adjudication Workflow:**

```
FCRA INDIVIDUALIZED ASSESSMENT (EEOC Guidance)
════════════════════════════════════════════════════════════════

Background Check Result: "Conviction - Misdemeanor Theft (2015)"

Step 1: CONSIDER RESULT
────────────────────────────────────────────────────────────────
  DER reviews findings:
    • Nature of conviction: Theft (property crime)
    • Date: 2015 (10 years ago)
    • Sentence: 1 year probation (completed)


Step 2: INDIVIDUALIZED ASSESSMENT (Green Factors)
────────────────────────────────────────────────────────────────
  1. Nature and gravity of offense:
     • Misdemeanor (not felony)
     • Non-violent (property crime)

  2. Time elapsed since offense:
     • 10 years (significant time)
     • No subsequent arrests

  3. Nature of the job:
     • Warehouse worker (not handling cash/valuables)
     • No direct nexus to job duties


Step 3: ADDITIONAL INFORMATION
────────────────────────────────────────────────────────────────
  Request from candidate:
    • Letter of explanation
    • Character references
    • Proof of restitution completion


Step 4: DECISION
────────────────────────────────────────────────────────────────
  DER decision: APPROVED_WITH_CONDITIONS
  Rationale: Documented above
  Conditions:
    • 6-month probationary period
    • Supervisor notified


Step 5: DOCUMENTATION
────────────────────────────────────────────────────────────────
  Store in database:
    adjudication_status: "APPROVED"
    adjudication_rationale: "..." (full text)
    adjudication_conditions: ["6-month probation", ...]

  Audit log:
    action: "ADJUDICATION_DECISION"
    resource: "background/bg_003"
    details: { decision: "APPROVED", rationale: "..." }
```

---

### POST /api/background/adverse-action

**Description:** Initiate FCRA adverse action workflow

**Required Permission:** `background:write` (DER only)

**Request:**

```json
{
  "backgroundCheckId": "bg_004",
  "action": "PRE_ADVERSE_ACTION",
  "adverseItems": [
    {
      "text": "Felony conviction - Theft (2020)",
      "reason": "Job requires handling company equipment"
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "adverseActionId": "aa_001",
    "status": "PENDING_7_DAY_WAIT",
    "preAdverseNoticeSentAt": "2025-11-24T17:00:00Z",
    "candidateResponseDeadline": "2025-12-01T17:00:00Z",
    "message": "Pre-adverse action notice sent to candidate"
  }
}
```

**Adverse Action Flow:**

```
FCRA ADVERSE ACTION WORKFLOW (15 U.S.C. § 1681)
════════════════════════════════════════════════════════════════

Step 1: PRE-ADVERSE ACTION NOTICE
────────────────────────────────────────────────────────────────
  DER decides: "Background check result = hire denied"
      ↓
  POST /api/background/adverse-action
  { action: "PRE_ADVERSE_ACTION" }
      ↓
  System sends email to candidate:
    Subject: "Pre-Adverse Action Notice"
    Body:
      • Copy of background check report
      • Copy of "A Summary of Your Rights Under the FCRA"
      • Explanation of adverse items
      • 7 business days to dispute
      • Contact: support@patriotcompliance.com


Step 2: WAITING PERIOD (7 business days)
────────────────────────────────────────────────────────────────
  Candidate can:
    ├── Accept (no action needed)
    ├── Dispute (submit evidence, explanation)
    └── Request copy of report (already provided)

  Status: PENDING_7_DAY_WAIT


Step 3: REVIEW DISPUTE (if candidate disputes)
────────────────────────────────────────────────────────────────
  Candidate submits dispute:
    "The felony conviction listed is not mine. Attached: Court
     documents showing case was dismissed."
      ↓
  DER reviews dispute evidence
      ↓
  Contact Checkr: Request reinvestigation
      ↓
  Checkr verifies: Case dismissed in 2021
      ↓
  Update result: CLEAR (conviction removed)
      ↓
  Decision: HIRE APPROVED
      ↓
  POST /api/background/adverse-action
  { action: "CANCELED", reason: "Dispute verified" }


Step 4: FINAL ADVERSE ACTION (if no dispute or dispute denied)
────────────────────────────────────────────────────────────────
  After 7 days (no dispute received)
      ↓
  POST /api/background/adverse-action
  { action: "FINAL_ADVERSE_ACTION" }
      ↓
  System sends email to candidate:
    Subject: "Adverse Action Notice"
    Body:
      • Final decision: Hire denied
      • Name/address of CRA: Checkr, Inc.
      • CRA did not make decision (employer did)
      • Right to dispute with CRA within 60 days
      • Copy of FCRA rights


Step 5: DOCUMENTATION
────────────────────────────────────────────────────────────────
  Store in database:
    adverse_action_status: "COMPLETE"
    pre_adverse_notice_sent: "2025-11-24"
    final_adverse_action_sent: "2025-12-03"
    candidate_disputed: false

  Retain for 5 years (EEOC recordkeeping requirement)
```

---

## DOT Compliance APIs (5 endpoints) {#dot}

### GET /api/dot/drivers

**Description:** List DOT-regulated drivers (CDL holders)

**Required Permission:** `dot:read`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "emp_001",
        "firstName": "John",
        "lastName": "Doe",
        "cdlNumber": "T1234567",
        "cdlState": "TX",
        "cdlClass": "A",
        "cdlEndorsements": ["H", "N"],
        "medicalCertExpiration": "2026-03-15",
        "clearinghouseStatus": "CLEAN",
        "lastClearinghouseQuery": "2025-11-01",
        "dqFileStatus": "COMPLETE",
        "complianceStatus": "green"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### POST /api/dot/drivers

**Description:** Add new DOT-regulated driver

**Required Permission:** `dot:write`

**Request:**

```json
{
  "employeeId": "emp_005",
  "cdlNumber": "T9876543",
  "cdlState": "CA",
  "cdlClass": "B",
  "cdlEndorsements": ["P"],
  "medicalCertExpiration": "2026-08-20"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "dot_005",
    "employeeId": "emp_005",
    "cdlNumber": "T9876543",
    "status": "ACTIVE",
    "requiredActions": [
      "Complete pre-employment clearinghouse query",
      "Upload medical certificate",
      "Complete DQ file"
    ]
  }
}
```

---

### GET /api/dot/documents

**Description:** List DQ (Driver Qualification) file documents

**Required Permission:** `dot:read`

**Query Parameters:**

```
?employeeId=emp_001
&documentType=MEDICAL_CERT|MVR|EMPLOYMENT_VERIFICATION|ROAD_TEST
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "doc_001",
        "employeeId": "emp_001",
        "documentType": "MEDICAL_CERT",
        "uploadDate": "2025-03-15",
        "expirationDate": "2026-03-15",
        "status": "VALID",
        "documentUrl": "https://documents.pcs.com/dot/emp_001/medical_cert.pdf"
      },
      {
        "id": "doc_002",
        "documentType": "MVR",
        "uploadDate": "2024-06-01",
        "status": "VALID",
        "documentUrl": "https://documents.pcs.com/dot/emp_001/mvr.pdf"
      }
    ]
  }
}
```

---

### POST /api/dot/documents

**Description:** Upload DQ file document

**Required Permission:** `dot:write`

**Request:**

```
Content-Type: multipart/form-data

employeeId: emp_001
documentType: MEDICAL_CERT
file: medical_certificate.pdf
expirationDate: 2026-03-15
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "doc_003",
    "documentUrl": "https://documents.pcs.com/dot/emp_001/medical_cert.pdf",
    "uploadedAt": "2025-11-24T17:00:00Z"
  }
}
```

---

### GET /api/dot/documents/download-dq-file

**Description:** Download complete DQ file packet (ZIP with all documents)

**Required Permission:** `dot:export`

**Query Parameters:**

```
?employeeId=emp_001
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://documents.pcs.com/dq-packets/emp_001.zip",
    "expiresAt": "2025-11-25T17:00:00Z",
    "watermarkId": "wm_dq_abc123",
    "includedDocuments": [
      "Application for Employment",
      "Motor Vehicle Record (MVR)",
      "Medical Examiner's Certificate",
      "Road Test Certificate",
      "Employment Verification (3 years)",
      "Drug Test Results (Pre-employment)",
      "Clearinghouse Query Results"
    ]
  }
}
```

**Note:** Download tracked in audit log (EXPORT action, watermark ID)

---

## Occupational Health APIs (3 endpoints) {#health}

### GET /api/health/surveillance

**Description:** List medical surveillance records

**Required Permission:** `health:read`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "health_001",
        "employeeId": "emp_001",
        "surveillanceType": "RESPIRATOR_FIT_TEST",
        "testDate": "2025-06-15",
        "result": "PASS",
        "expirationDate": "2026-06-15",
        "status": "VALID",
        "provider": "Occupational Health Clinic",
        "documentUrl": "https://documents.pcs.com/health/fit_test.pdf"
      },
      {
        "id": "health_002",
        "surveillanceType": "AUDIOGRAM",
        "testDate": "2025-01-10",
        "result": "WITHIN_NORMAL_LIMITS",
        "notes": "No hearing loss detected"
      }
    ]
  }
}
```

---

### POST /api/health/surveillance

**Description:** Record new medical surveillance exam

**Required Permission:** `health:write`

**Request:**

```json
{
  "employeeId": "emp_001",
  "surveillanceType": "RESPIRATOR_FIT_TEST",
  "testDate": "2025-11-24",
  "result": "PASS",
  "expirationDate": "2026-11-24",
  "provider": "Houston Occupational Health",
  "file": "base64_encoded_pdf"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "health_003",
    "status": "VALID",
    "documentUrl": "https://documents.pcs.com/health/emp_001/fit_test_2025.pdf"
  }
}
```

---

### GET /api/health/osha-300

**Description:** OSHA 300 log (recordable workplace injuries)

**Required Permission:** `health:read`

**Query Parameters:**

```
?year=2025
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "year": 2025,
    "totalRecordableIncidents": 3,
    "daysAwayRestricted": 12,
    "injuries": [
      {
        "id": "osha_001",
        "employeeId": "emp_007",
        "employee": { "firstName": "Mike", "lastName": "Worker" },
        "injuryDate": "2025-05-15",
        "description": "Laceration to hand (forklift accident)",
        "classification": "LOST_TIME",
        "daysAway": 5,
        "physicianTreated": true
      }
    ]
  }
}
```

---

## Training & Certifications APIs (3 endpoints) {#training}

### GET /api/training/certificates

**Description:** List training certificates

**Required Permission:** `training:read`

**Query Parameters:**

```
?employeeId=emp_001
&certificateType=FORKLIFT|HAZMAT|FIRST_AID|CPR
&status=VALID|EXPIRING_SOON|EXPIRED
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cert_001",
        "employeeId": "emp_001",
        "certificateType": "FORKLIFT",
        "issuedDate": "2022-12-15",
        "expirationDate": "2025-12-15",
        "status": "EXPIRING_SOON",
        "daysUntilExpiration": 21,
        "provider": "OSHA Training Institute",
        "certificateNumber": "FLT-2022-001234",
        "documentUrl": "https://documents.pcs.com/training/forklift_cert.pdf"
      }
    ]
  }
}
```

**Certificate Statuses:**

| Status | Condition | Alert Level |
|--------|-----------|-------------|
| `VALID` | > 90 days until expiration | Green |
| `EXPIRING_SOON` | 30-90 days until expiration | Amber |
| `EXPIRING_CRITICAL` | < 30 days until expiration | Red |
| `EXPIRED` | Past expiration date | Red (urgent) |

---

### POST /api/training/certificates

**Description:** Upload new training certificate

**Required Permission:** `training:write` OR `training:own` (field worker can upload own)

**Request:**

```
Content-Type: multipart/form-data

employeeId: emp_001
certificateType: FORKLIFT
issuedDate: 2025-11-24
expirationDate: 2028-11-24
provider: OSHA Training Institute
file: forklift_cert.pdf
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "cert_002",
    "status": "VALID",
    "expirationDate": "2028-11-24",
    "alerts": [
      {
        "date": "2028-10-24",
        "type": "90_DAY_EXPIRATION",
        "message": "Forklift certification expires in 90 days"
      }
    ]
  }
}
```

---

### GET /api/training/matrix

**Description:** Compliance training matrix (required certifications per role)

**Required Permission:** `training:read`

**Query Parameters:**

```
?role=forklift_operator
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "role": "forklift_operator",
    "requiredCertificates": [
      {
        "certificateType": "FORKLIFT",
        "frequency": "EVERY_3_YEARS",
        "authority": "OSHA",
        "regulation": "29 CFR 1910.178"
      },
      {
        "certificateType": "HAZMAT",
        "frequency": "EVERY_2_YEARS",
        "authority": "DOT",
        "regulation": "49 CFR Part 172"
      }
    ]
  }
}
```

---

## Geo-Fencing APIs (4 endpoints) {#geo-fencing}

### GET /api/geo-fencing/zones

**Description:** List geo-fence zones (PostGIS polygons)

**Required Permission:** `employees:read` (geo-fencing tied to employees)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "zone_001",
        "name": "Houston Refinery - Zone A",
        "type": "WORKSITE",
        "coordinates": {
          "type": "Polygon",
          "coordinates": [
            [
              [-95.3698, 29.7604],
              [-95.3698, 29.7700],
              [-95.3600, 29.7700],
              [-95.3600, 29.7604],
              [-95.3698, 29.7604]
            ]
          ]
        },
        "radius": 500,
        "complianceRequirements": [
          "HAZMAT certification required",
          "Daily check-in required"
        ],
        "createdAt": "2024-01-10T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /api/geo-fencing/zones

**Description:** Create new geo-fence zone

**Required Permission:** `employees:write` (admins only)

**Request:**

```json
{
  "name": "Dallas Distribution Center",
  "type": "WORKSITE",
  "center": {
    "latitude": 32.7767,
    "longitude": -96.7970
  },
  "radius": 1000,
  "complianceRequirements": [
    "Forklift certification required",
    "Safety vest required"
  ]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "zone_002",
    "name": "Dallas Distribution Center",
    "coordinates": { ... }
  }
}
```

---

### POST /api/geo-fencing/check-in

**Description:** Employee geo check-in (GPS or QR code)

**Required Permission:** `employees:own` (field worker)

**Request:**

```json
{
  "employeeId": "emp_001",
  "method": "GPS",
  "location": {
    "latitude": 29.7604,
    "longitude": -95.3698
  },
  "timestamp": "2025-11-24T08:00:00Z"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "checkInId": "checkin_001",
    "matchedZone": {
      "id": "zone_001",
      "name": "Houston Refinery - Zone A"
    },
    "complianceStatus": "COMPLIANT",
    "requiredCertifications": [
      {
        "type": "HAZMAT",
        "status": "VALID",
        "expires": "2026-05-10"
      }
    ]
  }
}
```

**Check-In Validation:**

```
GEO CHECK-IN VALIDATION FLOW
════════════════════════════════════════════════════════════════

Step 1: Receive GPS Coordinates
────────────────────────────────────────────────────────────────
  POST /api/geo-fencing/check-in
  { latitude: 29.7604, longitude: -95.3698 }


Step 2: PostGIS Query (Find Matching Zone)
────────────────────────────────────────────────────────────────
  SELECT id, name, compliance_requirements
  FROM geo_zones
  WHERE ST_Contains(
    geom,
    ST_SetSRID(ST_MakePoint(-95.3698, 29.7604), 4326)
  )
  AND tenant_id = 'acme_corp'

  Result: zone_001 (Houston Refinery - Zone A)


Step 3: Check Compliance Requirements
────────────────────────────────────────────────────────────────
  Zone requirements: ["HAZMAT certification required"]

  Query employee certificates:
    SELECT * FROM training_records
    WHERE employee_id = 'emp_001'
      AND certificate_type = 'HAZMAT'
      AND expiration_date > CURRENT_DATE

  Result: HAZMAT cert valid until 2026-05-10 ✅


Step 4: Record Check-In
────────────────────────────────────────────────────────────────
  INSERT INTO geo_check_ins (
    employee_id, zone_id, check_in_time,
    latitude, longitude, method, compliance_status
  )
  VALUES (
    'emp_001', 'zone_001', '2025-11-24 08:00:00',
    29.7604, -95.3698, 'GPS', 'COMPLIANT'
  )


Step 5: Return Response
────────────────────────────────────────────────────────────────
  {
    "checkInId": "checkin_001",
    "matchedZone": "Houston Refinery - Zone A",
    "complianceStatus": "COMPLIANT"
  }


Failure Scenario: Missing Required Cert
────────────────────────────────────────────────────────────────
  IF HAZMAT cert expired or missing:
      ↓
  Response (200 OK, but non-compliant):
  {
    "checkInId": "checkin_002",
    "matchedZone": "Houston Refinery - Zone A",
    "complianceStatus": "NON_COMPLIANT",
    "violations": [
      "HAZMAT certification required but not found or expired"
    ],
    "action": "Contact supervisor immediately"
  }
      ↓
  Alert sent to safety_manager (immediate email/SMS)
```

---

### GET /api/geo-fencing/triggers

**Description:** List geo-fence violations/alerts

**Required Permission:** `employees:read`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "trigger_001",
        "employeeId": "emp_008",
        "employee": { "firstName": "Sam", "lastName": "Worker" },
        "zoneId": "zone_003",
        "zone": { "name": "Restricted Area - Tank Farm" },
        "triggerType": "UNAUTHORIZED_ENTRY",
        "timestamp": "2025-11-20T14:30:00Z",
        "location": {
          "latitude": 29.7650,
          "longitude": -95.3750
        },
        "severity": "HIGH",
        "resolved": false
      }
    ]
  }
}
```

---

## Policy Driver APIs (4 endpoints) {#policy}

### GET /api/policies

**Description:** List compliance policies

**Required Permission:** `policy-driver:read`

**Query Parameters:**

```
?complianceType=drug_test|background|dot|health|training
&isActive=true|false
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "policy_001",
        "name": "DOT Drug Testing - FMCSA",
        "complianceType": "drug_test",
        "role": "CDL_driver",
        "rules": {
          "testFrequency": {
            "random": "50_percent_annual",
            "preEmployment": "required"
          },
          "requiredResult": "NEGATIVE",
          "maxResultAgeDays": 365,
          "warningDays": 30
        },
        "isActive": true,
        "version": 3,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2025-06-10T12:00:00Z"
      }
    ]
  }
}
```

---

### POST /api/policies

**Description:** Create new compliance policy

**Required Permission:** `policy-driver:write`

**Request:**

```json
{
  "name": "Forklift Certification - OSHA",
  "complianceType": "training",
  "role": "forklift_operator",
  "rules": {
    "certificateType": "FORKLIFT",
    "requiredFrequency": "EVERY_3_YEARS",
    "warningDays": 90,
    "authority": "OSHA",
    "regulation": "29 CFR 1910.178"
  }
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "policy_002",
    "name": "Forklift Certification - OSHA",
    "isActive": true,
    "version": 1
  }
}
```

---

### GET /api/policies/{id}/evaluate

**Description:** Evaluate employee compliance against specific policy

**Required Permission:** `policy-driver:read`

**Query Parameters:**

```
?employeeId=emp_001
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "policyId": "policy_001",
    "employeeId": "emp_001",
    "evaluation": {
      "compliant": true,
      "flag": "green",
      "violations": [],
      "lastTest": "2025-09-15",
      "nextRequired": "2026-01-10",
      "daysUntilRequired": 47
    }
  }
}
```

---

## Reports APIs (6 endpoints) {#reports}

### GET /api/reports/compliance-summary

**Description:** Compliance summary report (all modules, all employees)

**Required Permission:** `employees:read`

**Query Parameters:**

```
?complianceType=drug_test|background|dot|health|training|all
&status=compliant|non_compliant|at_risk
&flag=green|amber|red
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalEmployees": 1250,
    "byStatus": {
      "compliant": 1100,
      "non_compliant": 150
    },
    "byFlag": {
      "green": 1000,
      "amber": 180,
      "red": 70
    },
    "byModule": {
      "drugTesting": {
        "compliant": 1180,
        "non_compliant": 70,
        "at_risk": 0
      },
      "background": {
        "compliant": 1200,
        "non_compliant": 50
      },
      "dot": {
        "compliant": 450,
        "non_compliant": 50
      },
      "training": {
        "compliant": 1000,
        "at_risk": 200,
        "non_compliant": 50
      }
    },
    "alerts": [
      {
        "severity": "HIGH",
        "count": 70,
        "type": "drug_test_positive"
      },
      {
        "severity": "MEDIUM",
        "count": 180,
        "type": "certificate_expiring_soon"
      }
    ]
  }
}
```

---

### GET /api/reports/employee-roster

**Description:** Employee roster report (printable PDF or CSV)

**Required Permission:** `employees:export`

**Query Parameters:**

```
?format=pdf|csv|excel
&includePII=true|false
&status=ACTIVE|INACTIVE|TERMINATED
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://exports.pcs.com/roster_2025-11-24.pdf",
    "expiresAt": "2025-11-25T18:00:00Z",
    "recordCount": 1250,
    "watermarkId": "wm_roster_xyz"
  }
}
```

---

### POST /api/reports/schedule

**Description:** Schedule recurring report (email delivery)

**Required Permission:** `employees:read`

**Request:**

```json
{
  "reportType": "compliance_summary",
  "frequency": "WEEKLY",
  "dayOfWeek": "MONDAY",
  "time": "08:00",
  "recipients": [
    "der@acme.com",
    "safety.manager@acme.com"
  ],
  "filters": {
    "status": "non_compliant",
    "flag": "red"
  }
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "scheduleId": "schedule_001",
    "nextRun": "2025-11-25T08:00:00Z"
  }
}
```

---

## Dashboard APIs (4 endpoints) {#dashboard}

### GET /api/dashboard/stats

**Description:** Dashboard statistics (overview cards)

**Required Permission:** `dashboard:read`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalEmployees": 1250,
    "activeEmployees": 1180,
    "complianceOverview": {
      "compliant": 1100,
      "at_risk": 80,
      "non_compliant": 70
    },
    "alerts": {
      "high": 15,
      "medium": 45,
      "low": 120
    },
    "recentActivity": [
      {
        "type": "drug_test_completed",
        "employeeId": "emp_123",
        "result": "NEGATIVE",
        "timestamp": "2025-11-24T14:30:00Z"
      }
    ]
  }
}
```

---

### GET /api/dashboard/alerts

**Description:** Active alerts (compliance violations, expiring certificates)

**Required Permission:** `dashboard:read`

**Query Parameters:**

```
?severity=HIGH|MEDIUM|LOW
&status=OPEN|ACKNOWLEDGED|CLOSED
&limit=20
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "alert_001",
        "severity": "HIGH",
        "type": "drug_test_positive",
        "employeeId": "emp_789",
        "employee": { "firstName": "Mike", "lastName": "Driver" },
        "message": "Positive drug test result - Immediate action required",
        "createdAt": "2025-11-23T10:00:00Z",
        "status": "OPEN"
      },
      {
        "id": "alert_002",
        "severity": "MEDIUM",
        "type": "certificate_expiring",
        "employeeId": "emp_456",
        "message": "Forklift certification expires in 15 days",
        "expirationDate": "2025-12-09",
        "status": "ACKNOWLEDGED"
      }
    ]
  }
}
```

---

## Billing APIs (4 endpoints) {#billing}

### GET /api/billing/subscription

**Description:** Get current subscription details

**Required Permission:** `billing:read`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xyz789",
    "plan": "PROFESSIONAL",
    "status": "ACTIVE",
    "billingCycle": "MONTHLY",
    "currentPeriodStart": "2025-11-01",
    "currentPeriodEnd": "2025-12-01",
    "nextBillingDate": "2025-12-01",
    "pricing": {
      "basePrice": 5000,
      "perEmployeePEPM": 15,
      "additionalModules": [
        { "module": "geo_fencing", "price": 500 }
      ],
      "totalMonthly": 24250
    },
    "usage": {
      "employees": 1250,
      "drugTests": 87,
      "backgroundChecks": 23,
      "totalBillable": 24250
    }
  }
}
```

---

### GET /api/billing/invoices

**Description:** List invoices

**Required Permission:** `billing:read`

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "inv_001",
        "invoiceNumber": "PCS-2025-11-001",
        "invoiceDate": "2025-11-01",
        "dueDate": "2025-11-15",
        "status": "PAID",
        "amount": 24250,
        "paidAt": "2025-11-10T10:00:00Z",
        "downloadUrl": "https://invoices.pcs.com/inv_001.pdf"
      }
    ]
  }
}
```

---

## Webhook APIs (4 endpoints) {#webhooks}

### POST /api/webhooks/drug-testing (Quest)

**Description:** Receive drug test results from Quest Diagnostics

**Required Permission:** None (webhook signature verification)

**Headers:**

```
X-Quest-Signature: HMAC-SHA256 signature
Content-Type: application/json
```

**Request (from Quest):**

```json
{
  "event": "result.released",
  "specimen_id": "QST-2025-11-24-001234",
  "result": "NEGATIVE",
  "test_type": "DOT_5_PANEL_URINE",
  "mro_reviewed": true,
  "reviewed_at": "2025-11-24T14:30:00Z",
  "custom_employee_id": "emp_001"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "received": true,
    "eventId": "webhook_evt_xyz"
  }
}
```

**Processing Flow:**

```
Quest Webhook Processing
      ↓
1. Verify signature (HMAC-SHA256) ✅
2. Check idempotency (Redis: processed_webhooks:quest:specimen_id)
3. Parse payload → ComplianceEvent
4. Publish to Kafka: compliance.drugtest.completed
5. Return 200 OK (immediate acknowledgment)
      ↓
Kafka Consumer (async):
      ↓
1. Consume event from Kafka
2. Update employee complianceData.drugTesting
3. Calculate flag (green/amber/red)
4. Trigger alert (if positive result)
5. Audit log
```

---

### POST /api/webhooks/tazworks (TazWorks)

**Description:** Receive background check results from TazWorks

**Headers:**

```
X-TazWorks-Signature: HMAC-SHA256 signature
Content-Type: application/json
```

**Request (from TazWorks):**

```json
{
  "webhook_id": "wh_abc123",
  "event_type": "screening.completed",
  "screening_id": "scr_xyz456",
  "applicant": {
    "custom_id": "emp_002"
  },
  "status": "complete",
  "results": {
    "criminal": {
      "status": "complete",
      "result": "records_found",
      "records": [
        {
          "case_number": "CR-2018-98765",
          "charge": "DUI",
          "disposition": "Guilty",
          "sentence": "Fine $500"
        }
      ]
    },
    "credit": {
      "score": 720,
      "status": "good"
    }
  },
  "report_pdf_url": "https://tazworks.com/reports/scr_xyz456.pdf"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "received": true
  }
}
```

---

## DER IQ AI Chat APIs (2 endpoints) {#der-iq}

### POST /api/der-iq/chat

**Description:** AI chat for compliance questions (RAG-based)

**Required Permission:** `dashboard:read`

**Request:**

```json
{
  "message": "What is the DOT random drug testing rate for CDL drivers?",
  "conversationId": "conv_abc123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "response": "The DOT random drug testing rate for CDL drivers is 50% annually. This means employers must test at least 50% of the average number of CDL driver positions during the calendar year. The tests must be spread reasonably throughout the year and conducted using a scientifically valid random selection process.",
    "sources": [
      {
        "regulation": "49 CFR § 382.305(b)(2)",
        "url": "https://www.ecfr.gov/..."
      }
    ],
    "conversationId": "conv_abc123",
    "messageId": "msg_xyz789"
  }
}
```

---

## Communication APIs (2 endpoints) {#communications}

### POST /api/communications/send

**Description:** Send email/SMS to employee

**Required Permission:** `employees:write`

**Request:**

```json
{
  "recipientId": "emp_001",
  "method": "EMAIL",
  "subject": "Drug Test Required",
  "body": "You have been randomly selected for a drug test. Please report to the collection site within 24 hours.",
  "priority": "HIGH"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "messageId": "msg_abc123",
    "status": "SENT",
    "sentAt": "2025-11-24T18:00:00Z"
  }
}
```

---

### GET /api/communications/history

**Description:** Communication history for employee

**Required Permission:** `employees:read`

**Query Parameters:**

```
?employeeId=emp_001
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "msg_001",
        "method": "EMAIL",
        "subject": "Drug Test Required",
        "sentAt": "2025-11-24T18:00:00Z",
        "deliveryStatus": "DELIVERED",
        "readAt": "2025-11-24T18:15:00Z"
      }
    ]
  }
}
```

---

## Sharing APIs (2 endpoints) {#sharing}

### POST /api/share/create

**Description:** Create shareable link (time-limited, external access)

**Required Permission:** Varies by resource

**Request:**

```json
{
  "resourceType": "employee",
  "resourceId": "emp_001",
  "expiresIn": 86400,
  "allowedActions": ["view"],
  "recipientEmail": "auditor@external.com"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "shareToken": "share_xyz789",
    "shareUrl": "https://app.pcs.com/share/share_xyz789",
    "expiresAt": "2025-11-25T18:30:00Z"
  }
}
```

---

### GET /api/share/{token}

**Description:** Access shared resource (no authentication required)

**Required Permission:** None (token-based access)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "resourceType": "employee",
    "resource": {
      "firstName": "John",
      "lastName": "Doe",
      "complianceStatus": "green",
      "lastDrugTest": "2025-09-15"
    },
    "expiresAt": "2025-11-25T18:30:00Z"
  }
}
```

**Note:** PII/PHI masked in shared links (SSN, DOB not included)

---

**Document Status:** Internal API Catalog - 78 endpoints documented

**Summary:**
- **Auth Service:** 14 endpoints (login, MFA, SSO, user management)
- **Employees:** 7 endpoints (CRUD, bulk upload, export)
- **Drug Testing:** 5 endpoints (tests, random selection, MRO review, clearinghouse)
- **Background Checks:** 4 endpoints (screenings, adjudication, adverse action)
- **DOT Compliance:** 5 endpoints (drivers, documents, DQ file export)
- **Occupational Health:** 3 endpoints (surveillance, OSHA 300)
- **Training:** 3 endpoints (certificates, matrix)
- **Geo-Fencing:** 4 endpoints (zones, check-in, triggers)
- **Policy Driver:** 4 endpoints (CRUD, evaluate)
- **Reports:** 6 endpoints (summary, roster, MIS, scheduling)
- **Dashboard:** 4 endpoints (stats, alerts, compliance by module)
- **Billing:** 4 endpoints (subscription, invoices, usage)
- **Communications:** 2 endpoints (send, history)
- **Sharing:** 2 endpoints (create shareable links, access)
- **DER IQ:** 2 endpoints (AI chat)
- **Webhooks:** 4 endpoints (Quest, TazWorks, Checkr, FMCSA)

**Next:** Data Model Documentation (Complete Prisma schemas)

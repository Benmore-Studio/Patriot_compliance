# FedRAMP Moderate RBAC Requirements & Design

**Document Version:** 1.0
**Created:** 2025-11-24
**Status:** Design Phase
**Compliance Target:** FedRAMP Moderate (323 controls, NIST SP 800-53 Rev. 5)

---

## Executive Summary

This document outlines the Role-Based Access Control (RBAC) requirements for achieving FedRAMP Moderate authorization. FedRAMP Moderate is required for systems handling PII/PHI and is the most common authorization level for government SaaS vendors (73% of all FedRAMP CSOs as of July 2025).

**Key Statistics:**
- **323 security controls** required (vs 125 for Low, 421 for High)
- **12-18 month** authorization timeline
- **$500K-1.5M** estimated cost
- **NIST SP 800-53 Rev. 5** compliance baseline

---

## Table of Contents

1. [Gap Analysis: Current vs FedRAMP Moderate](#gap-analysis)
2. [Access Control (AC) Family Requirements](#ac-family-requirements)
3. [Expanded Role Definitions (12 Roles)](#expanded-role-definitions)
4. [Permission Matrix (12 Roles × 56 Permissions)](#permission-matrix)
5. [Multi-Factor Authentication Requirements](#mfa-requirements)
6. [Session Management & Timeout](#session-management)
7. [Audit Logging Requirements](#audit-logging)
8. [Account Lifecycle Management](#account-lifecycle)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Gap Analysis: Current vs FedRAMP Moderate {#gap-analysis}

### Current System State

```
┌─────────────────────────────────────────────────────────────┐
│                 CURRENT RBAC SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│  Roles: 7 (super_admin, system_admin, der, safety_manager,  │
│           compliance_officer, field_worker, auditor)         │
│  Permissions: 42 (resource:action format)                    │
│  Auth: Basic JWT (not implemented in code)                   │
│  MFA: Optional/recommended (not enforced)                    │
│  Session: Documented timeouts (not enforced)                 │
│  Audit: Schema defined (not implemented)                     │
│  Tenant Isolation: Documented (not enforced in queries)      │
└─────────────────────────────────────────────────────────────┘
```

### FedRAMP Moderate Requirements

```
┌─────────────────────────────────────────────────────────────┐
│           FEDRAMP MODERATE REQUIREMENTS                      │
├─────────────────────────────────────────────────────────────┤
│  ✅ RBAC model defined                                       │
│  ❌ RBAC enforcement at ALL layers (API, DB, UI)            │
│  ❌ Account lifecycle automation (provision/deprovision)     │
│  ❌ Role recertification (quarterly for privileged users)    │
│  ❌ MFA enforced for ALL users (not just recommended)        │
│  ❌ Session timeout enforcement (automatic logout)           │
│  ❌ Unsuccessful login lockout (5 attempts → 30min lock)     │
│  ❌ Concurrent session limits (max 3 per user)               │
│  ❌ Separation of duties (dual control for sensitive ops)    │
│  ❌ Least privilege enforcement (deny-by-default)            │
│  ❌ Cross-tenant data flow controls                          │
│  ❌ Comprehensive audit logging (all access + changes)       │
│  ❌ Security officer role (manages POAM, incidents)          │
└─────────────────────────────────────────────────────────────┘
```

### Critical Gaps

| Control | Description | Risk Level | Effort |
|---------|-------------|------------|--------|
| **AC-2** | Account Management | 🔴 Critical | High |
| **AC-3** | Access Enforcement | 🔴 Critical | High |
| **AC-4** | Information Flow Enforcement | 🔴 Critical | Medium |
| **AC-7** | Unsuccessful Login Attempts | 🔴 Critical | Low |
| **AC-17** | Remote Access (MFA) | 🔴 Critical | Medium |
| **AC-5** | Separation of Duties | 🟡 Medium | Medium |
| **AC-11** | Session Lock/Timeout | 🟡 Medium | Low |
| **AU-2** | Audit Events | 🟡 Medium | High |

---

## Access Control (AC) Family Requirements {#ac-family-requirements}

### AC-2: Account Management (HIGH PRIORITY)

**Requirement:**
The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.

**Implementation:**

```
USER LIFECYCLE FLOW
════════════════════════════════════════════════════════════════

Step 1: PROVISIONING
────────────────────
User Request → Manager Approval → System Admin Creates Account
                                              ↓
                                   Assign Role + Permissions
                                              ↓
                                    Send Welcome Email (MFA setup)
                                              ↓
                                   Status: PENDING_ACTIVATION


Step 2: ACTIVATION
──────────────────
User Logs In → MFA Setup Required → Email Verification
                                              ↓
                               Status: ACTIVE (first_login_at recorded)


Step 3: PERIODIC REVIEW (Quarterly for Privileged, Annually for Standard)
──────────────────────────────────────────────────────────────────────────
Automated Report Generated → Manager Reviews Access
                                              ↓
                        ┌─────────────────────┴─────────────────────┐
                        ↓                                           ↓
              Access Still Needed?                         Access No Longer Needed?
                        ↓                                           ↓
              Recertify (log approval)                     Flag for Removal
                        ↓                                           ↓
              Status: ACTIVE (recertified_at updated)      Status: PENDING_REMOVAL


Step 4: MODIFICATION
────────────────────
Role Change Request → Security Officer Approval → Update Permissions
                                              ↓
                            Log: OLD_ROLE → NEW_ROLE (audit trail)
                                              ↓
                         Send Notification to User + Manager


Step 5: DEACTIVATION (Temporary)
─────────────────────────────────
90 Days Inactive → Status: INACTIVE
                          ↓
              Sessions Invalidated, Cannot Login
                          ↓
           Reactivation requires Manager Approval


Step 6: REMOVAL (Permanent)
────────────────────────────
Employee Termination → Manager Initiates Offboarding
                                              ↓
                        Immediate Session Invalidation
                                              ↓
                  Status: DISABLED (soft delete, keep audit trail)
                                              ↓
              Data Retention: 7 years (compliance requirement)
```

**Key Controls:**

- ✅ **Unique user identification** (no shared accounts)
- ✅ **Automated deprovisioning** within 24 hours of termination
- ✅ **Role recertification** (quarterly for privileged, annually for standard)
- ✅ **Privileged account monitoring** (separate audit trail)
- ✅ **Emergency account procedures** (break-glass access with dual control)

---

### AC-3: Access Enforcement (HIGH PRIORITY)

**Requirement:**
The information system enforces approved authorizations for logical access to information and system resources.

**Implementation: 4-Layer Enforcement**

```
ENFORCEMENT LAYERS
══════════════════════════════════════════════════════════════

Layer 1: API GATEWAY / MIDDLEWARE
──────────────────────────────────
Incoming Request
      ↓
JWT Verification (signature, expiration, claims)
      ↓
Tenant Resolution (from JWT.tenantId)
      ↓
Rate Limiting (per tenant, per endpoint)
      ↓
      ├── Valid? → Pass to Layer 2
      └── Invalid? → 401 Unauthorized


Layer 2: ROUTE HANDLER / CONTROLLER
────────────────────────────────────
Request + JWT Payload
      ↓
Role Check (user.role in allowedRoles[])
      ↓
Permission Check (hasPermission(role, 'employees:read'))
      ↓
Resource Ownership Check (if :own permission, verify employeeId === userId)
      ↓
      ├── Authorized? → Pass to Layer 3
      └── Unauthorized? → 403 Forbidden


Layer 3: DATABASE / QUERY LEVEL
────────────────────────────────
Query Request + tenantId
      ↓
Tenant Filter (WHERE tenant_id = $tenantId)
      ↓
Row-Level Security (PostgreSQL RLS policy)
      ↓
Field-Level Encryption (decrypt SSN/DOB only if permission granted)
      ↓
      ├── In Scope? → Return Data
      └── Out of Scope? → Empty Result (hide cross-tenant data)


Layer 4: RESPONSE / PRESENTATION
─────────────────────────────────
Raw Data from Database
      ↓
Field Masking (based on role: auditor sees SSN → ***-**-1234)
      ↓
PII Redaction (if no pii:read permission, null sensitive fields)
      ↓
Audit Log Entry (who, what, when, IP, user-agent)
      ↓
Return Response to Client
```

**Example: Employee Read Request**

```
GET /api/employees/12345

User: safety_manager (tenantId: acme_corp)

Layer 1: JWT valid ✅ → Extract tenantId: acme_corp
Layer 2: Role check → safety_manager has 'employees:read' ✅
Layer 3: Query filters → WHERE employee_id = 12345 AND tenant_id = 'acme_corp'
Layer 4: Response masks SSN → returns { ssn: "***-**-6789", ... }

Audit Log: {
  userId: "user_456",
  action: "READ",
  resource: "employees/12345",
  result: "SUCCESS",
  ip: "192.168.1.50"
}
```

---

### AC-4: Information Flow Enforcement (HIGH PRIORITY)

**Requirement:**
The information system enforces approved authorizations for controlling the flow of information within the system and between connected systems.

**Cross-Tenant Data Flow Control:**

```
TENANT ISOLATION ENFORCEMENT
════════════════════════════════════════════════════════════════

Scenario: User from Tenant A tries to access Tenant B data

Request: GET /api/employees/999 (belongs to Tenant B)
User JWT: { tenantId: "tenant_a", userId: "user_123" }

Flow:
─────
1. Middleware extracts tenantId: "tenant_a"
          ↓
2. Query: SELECT * FROM employees WHERE id = 999 AND tenant_id = 'tenant_a'
          ↓
3. Result: EMPTY (employee 999 belongs to tenant_b)
          ↓
4. Response: 404 Not Found (NEVER reveal existence of cross-tenant data)
          ↓
5. Audit Log: FAILED_ACCESS_ATTEMPT (security event)
          ↓
6. If >= 5 failed attempts in 10 min → Alert Security Officer


INTER-SERVICE DATA FLOW
────────────────────────────────────────────────────────────────

Service-to-Service Authentication:

┌──────────────┐                      ┌──────────────┐
│ Core Service │ ──── API Call ──────▶│ Auth Service │
└──────────────┘                      └──────────────┘
       │                                      │
       │  1. Generate Service Token          │
       │     (signed with service secret)    │
       │◀─────────────────────────────────────┤
       │                                      │
       │  2. Request: GET /api/user/validate │
       │     Headers:                         │
       │       Authorization: Bearer <token>  │
       │       X-Service-ID: core-service     │
       │       X-Tenant-ID: tenant_a          │
       ├─────────────────────────────────────▶│
       │                                      │
       │  3. Auth Service verifies:           │
       │     - Service token signature ✅     │
       │     - Service allowed to call API ✅ │
       │     - Tenant scope valid ✅          │
       │◀─────────────────────────────────────┤
       │                                      │
       │  4. Response: User details           │
       │     (scoped to tenant_a only)        │
       └──────────────────────────────────────┘


EXPORT DATA FLOW CONTROL
─────────────────────────────────────────────────────────────────

User Requests: Export Employee Roster (contains PII/PHI)

Step 1: Permission Check
        ↓
   employees:export ✅ (user has permission)
        ↓
Step 2: Dual Control Check (for PII/PHI exports)
        ↓
   Create Export Request (status: PENDING_APPROVAL)
        ↓
   Notify Approver (audit_manager or security_officer)
        ↓
Step 3: Approver Reviews & Approves
        ↓
   Export Request → status: APPROVED
        ↓
Step 4: Generate Export
        ↓
   Query with tenant filter + field-level encryption
        ↓
   Add Watermark: "Generated by: user_123, Approved by: user_789, Date: 2025-11-24"
        ↓
Step 5: Deliver Securely
        ↓
   Upload to encrypted S3 bucket
        ↓
   Send time-limited signed URL (expires in 24 hours)
        ↓
Step 6: Audit Log
        ↓
   Log: EXPORT, resource: employees, count: 1250, approver: user_789
```

---

### AC-5: Separation of Duties (MEDIUM PRIORITY)

**Requirement:**
The organization separates duties of individuals to reduce the risk of malevolent activity without collusion.

**Dual Control Scenarios:**

```
DUAL CONTROL WORKFLOWS
════════════════════════════════════════════════════════════════

Scenario 1: BACKGROUND CHECK ADJUDICATION
──────────────────────────────────────────
Background Check Result: "Conviction - Felony Theft (10 years ago)"

Actor 1: compliance_officer (reviews findings)
              ↓
   Recommendation: "APPROVE with conditions"
              ↓
   Status: PENDING_SECOND_REVIEW
              ↓
Actor 2: der or audit_manager (second review)
              ↓
   Reviews recommendation + rationale
              ↓
   Decision: APPROVE or OVERRIDE
              ↓
   Status: FINAL (both actors logged in audit trail)


Scenario 2: PRIVILEGED ROLE ASSIGNMENT
───────────────────────────────────────
Request: Grant "super_admin" role to new_user@acme.com

Actor 1: system_admin (initiates request)
              ↓
   Create Role Change Request
              ↓
   Status: PENDING_SECURITY_REVIEW
              ↓
Actor 2: pcs_security_officer (approves privileged role changes)
              ↓
   Reviews justification + user background
              ↓
   Decision: APPROVE or DENY
              ↓
   If APPROVED → Role granted + MFA enforced
              ↓
   Audit Log: "super_admin granted to new_user by system_admin,
               approved by security_officer_xyz"


Scenario 3: BULK DATA DELETION
───────────────────────────────
Request: Delete 500 employee records (compliance retention expired)

Actor 1: system_admin (initiates deletion)
              ↓
   Verify retention policy (7 years expired ✅)
              ↓
   Create Deletion Request
              ↓
   Status: PENDING_APPROVAL
              ↓
Actor 2: information_system_owner (approves data destruction)
              ↓
   Reviews legal/compliance requirements
              ↓
   Decision: APPROVE or DENY
              ↓
   If APPROVED → Soft delete (archive to cold storage)
              ↓
   Audit Log: "500 records deleted by system_admin,
               approved by iso_user_456, archived to s3://..."
```

---

### AC-7: Unsuccessful Login Attempts (HIGH PRIORITY)

**Requirement:**
The information system enforces a limit of consecutive invalid login attempts by a user during a 15-minute time period and automatically locks the account for 30 minutes when the maximum number of unsuccessful attempts is exceeded.

**Implementation:**

```
FAILED LOGIN LOCKOUT FLOW
════════════════════════════════════════════════════════════════

User attempts login with incorrect password

Attempt 1:
    ↓
Response: "Invalid credentials" (generic message)
    ↓
Redis: INCR failed_login:<user_email> → 1
    ↓
Redis: EXPIRE failed_login:<user_email> 900 (15 minutes)


Attempt 2-4:
    ↓
Response: "Invalid credentials. X attempts remaining."
    ↓
Redis: INCR failed_login:<user_email> → 2, 3, 4


Attempt 5 (THRESHOLD):
    ↓
Redis: INCR failed_login:<user_email> → 5
    ↓
Account Status: LOCKED
    ↓
Redis: SET account_locked:<user_email> true EX 1800 (30 minutes)
    ↓
Send Email: "Your account has been locked due to failed login attempts"
    ↓
Send Alert: Security Officer notified (potential brute force attack)
    ↓
Audit Log: {
  action: "ACCOUNT_LOCKED",
  reason: "5_failed_attempts",
  ip: "192.168.1.100",
  timestamp: "2025-11-24T10:30:00Z"
}


During Lockout (next 30 minutes):
    ↓
All login attempts return: "Account temporarily locked. Try again in X minutes."
    ↓
No password validation performed (prevent timing attacks)


After 30 Minutes:
    ↓
Redis: account_locked:<user_email> expires (auto-unlocked)
    ↓
Redis: DEL failed_login:<user_email> (reset counter)
    ↓
User can attempt login again


Manual Unlock (by Security Officer):
    ↓
Security Officer verifies user identity (phone call, ticket)
    ↓
Execute: UNLOCK_ACCOUNT command
    ↓
Redis: DEL account_locked:<user_email>
    ↓
Redis: DEL failed_login:<user_email>
    ↓
Send Email: "Your account has been unlocked by security team"
    ↓
Audit Log: "Account unlocked by security_officer_xyz"
```

**Key Parameters:**
- Max failed attempts: **5**
- Lockout duration: **30 minutes**
- Time window: **15 minutes**
- Security alert threshold: **3 lockouts in 24 hours** (potential credential stuffing)

---

### AC-11: Session Lock & Timeout (MEDIUM PRIORITY)

**Requirement:**
The information system prevents further access to the system by initiating a session lock after a period of inactivity and retains the session lock until the user reestablishes access using established identification and authentication procedures.

**Implementation:**

```
SESSION TIMEOUT ENFORCEMENT
════════════════════════════════════════════════════════════════

Role-Based Timeout Durations:

Role                         | Inactivity Timeout | Absolute Timeout
─────────────────────────────┼────────────────────┼──────────────────
super_admin                  | 15 minutes         | 4 hours
pcs_security_officer         | 15 minutes         | 8 hours
information_system_owner     | 30 minutes         | 8 hours
system_admin                 | 30 minutes         | 8 hours
der                          | 1 hour             | 12 hours
safety_manager               | 2 hours            | 12 hours
compliance_officer           | 1 hour             | 12 hours
auditor                      | 1 hour             | 8 hours
field_worker                 | 24 hours           | 7 days (mobile)


TIMEOUT FLOW
────────────────────────────────────────────────────────────────

Session Created (on login):
    ↓
Redis: SET session:<session_id> <session_data> EX <timeout_seconds>
    ↓
Session Data: {
  userId, tenantId, role,
  createdAt, lastActivityAt, expiresAt
}


User Activity (API request):
    ↓
Check: session:<session_id> exists in Redis?
    ↓
    ├── YES → Update lastActivityAt, extend TTL
    │          ↓
    │      Redis: EXPIRE session:<session_id> <timeout_seconds>
    │          ↓
    │      Process request normally
    │
    └── NO → Session expired or invalid
               ↓
         Response: 401 Unauthorized
               ↓
         Redirect to: /login?reason=session_expired


Inactivity Timeout Reached:
    ↓
Redis: session:<session_id> expires (TTL = 0)
    ↓
Next API request fails with 401
    ↓
Frontend detects 401 → Shows modal: "Session expired. Please log in again."
    ↓
Audit Log: "Session expired (inactivity) for user_123"


Absolute Timeout Reached (even if active):
    ↓
Background Job checks: (createdAt + absoluteTimeout) < now()?
    ↓
    ├── YES → Force logout
    │          ↓
    │      Redis: DEL session:<session_id>
    │          ↓
    │      WebSocket: Send "FORCE_LOGOUT" message to client
    │          ↓
    │      Frontend: Immediate redirect to login
    │
    └── NO → Continue session


Concurrent Session Limits (AC-12):
────────────────────────────────────────────────────────────────
Max concurrent sessions per user: 3 (desktop + mobile + tablet)

Session Creation:
    ↓
Query: COUNT sessions WHERE userId = $userId
    ↓
    ├── Count < 3 → Create new session
    │
    └── Count >= 3 → Terminate oldest session
                      ↓
                  Redis: DEL session:<oldest_session_id>
                      ↓
                  Send notification: "You were logged out from another device"
```

---

### AC-17: Remote Access (HIGH PRIORITY)

**Requirement:**
The organization authorizes remote access to the system prior to allowing connections, enforces multi-factor authentication for remote access, and monitors and controls all methods of remote access.

**MFA Enforcement:**

```
MFA ENFORCEMENT FLOW
════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                   MFA REQUIRED FOR ALL ROLES                 │
├─────────────────────────────────────────────────────────────┤
│  super_admin           → Hardware MFA (FIDO2/WebAuthn)      │
│  pcs_security_officer  → Hardware MFA (FIDO2/WebAuthn)      │
│  information_system_owner → TOTP or Hardware              │
│  system_admin          → TOTP (Authenticator app)           │
│  der                   → TOTP (Authenticator app)           │
│  safety_manager        → TOTP or SMS                        │
│  compliance_officer    → TOTP (multi-tenant access)         │
│  auditor               → TOTP (time-limited access)         │
│  field_worker          → SMS or Push (mobile-first)         │
└─────────────────────────────────────────────────────────────┘


LOGIN WITH MFA
──────────────────────────────────────────────────────────────

Step 1: Username + Password
    ↓
Validate credentials (bcrypt hash comparison)
    ↓
    ├── Invalid → Increment failed_login counter (AC-7)
    │
    └── Valid → Check MFA enrollment
                    ↓
              ├── MFA Not Enrolled → Redirect to MFA setup
              │                        ↓
              │                   Generate TOTP secret
              │                        ↓
              │                   Show QR code (scan with app)
              │                        ↓
              │                   User enters first code
              │                        ↓
              │                   Verify code ✅ → MFA enabled
              │
              └── MFA Enrolled → Send MFA challenge
                                    ↓
                              Create temporary session
                                    ↓
                       Redis: SET mfa_challenge:<temp_token>
                              {userId, createdAt} EX 300 (5 min)


Step 2: MFA Challenge
    ↓
User enters 6-digit TOTP code (from Authenticator app)
    ↓
Backend: Verify TOTP code (speakeasy.totp.verify)
    ↓
    ├── Invalid → "Invalid code. X attempts remaining."
    │              ↓
    │          After 3 failed MFA attempts → Lock account (AC-7)
    │
    └── Valid → Delete mfa_challenge, Create full session
                    ↓
              Redis: SET session:<session_id> <full_session_data>
                    ↓
              Return JWT access token + refresh token
                    ↓
              Audit Log: "Successful MFA login for user_123 from IP x.x.x.x"


BACKUP CODES (Account Recovery)
────────────────────────────────────────────────────────────────
On MFA enrollment, generate 10 one-time backup codes
    ↓
Display: "Save these codes in a secure location"
    ↓
Store: {userId, backupCodes: [hash1, hash2, ..., hash10]}
    ↓
If user loses MFA device:
    ↓
Login → MFA challenge → "Lost device? Use backup code"
    ↓
User enters backup code → Verify hash → Allow login
    ↓
Mark backup code as USED (can only be used once)
    ↓
Remaining codes: 9 → Send alert: "You have 9 backup codes remaining"
```

---

## Expanded Role Definitions (12 Roles) {#expanded-role-definitions}

```
ROLE HIERARCHY
════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────┐
│                    PLATFORM LEVEL (PCS Internal)              │
├──────────────────────────────────────────────────────────────┤
│  super_admin                (Cross-tenant, all permissions)   │
│      ↓                                                        │
│  pcs_security_officer       (Security controls, POAM, SSP)   │
│      ↓                                                        │
│  information_system_owner   (System authorizations)          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│              TENANT LEVEL (Service Company)                   │
├──────────────────────────────────────────────────────────────┤
│  system_admin               (Tenant administrator)            │
│      ├─────────────┬───────────────┐                         │
│      ↓             ↓               ↓                         │
│     der    safety_manager   compliance_officer               │
│      ↓             ↓               ↓                         │
│  field_worker  field_worker  (read-only access)              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│        COMPLIANCE COMPANY LEVEL (MSP Multi-Tenant)            │
├──────────────────────────────────────────────────────────────┤
│  compliance_company_admin   (Manages portfolio of companies) │
│      ↓                                                        │
│  senior_auditor             (Initiates audits, acknowledges) │
│      ↓                                                        │
│  audit_manager              (Closes audits, approves exports)│
│      ↓                                                        │
│  auditor                    (Read-only, time-limited access) │
└──────────────────────────────────────────────────────────────┘
```

### NEW ROLES (Added for FedRAMP Moderate)

#### 1. pcs_security_officer

**Purpose:** Manages FedRAMP security controls, maintains POAM, handles security incidents

**Portal Access:** PCS Internal Admin Portal

**Key Capabilities:**
- Manage security controls (323 FedRAMP Moderate controls)
- Maintain POAM (Plan of Action & Milestones)
- Review security incidents and coordinate response
- Approve privileged role assignments (dual control)
- Configure security settings (MFA policies, session timeouts)
- Review and approve security audit findings

**FedRAMP Responsibilities:**
- **SSP Maintenance:** Update System Security Plan as system changes
- **POAM Management:** Track remediation of security findings
- **Incident Response:** Coordinate with FMCSA, clients on security events
- **Continuous Monitoring:** Review weekly security scans, vulnerability reports

**Security Requirements:**
- Hardware MFA required (FIDO2/WebAuthn)
- Session timeout: 15 minutes
- Dedicated audit trail (separate from general logs)
- Cannot perform operational tasks (separation of duties)

**Permissions:** (14 new permissions)
```
security-controls:read, security-controls:write
poam:read, poam:write, poam:approve
incidents:read, incidents:write, incidents:escalate
role-assignments:approve (dual control)
security-settings:read, security-settings:write
audit-reports:read, audit-reports:export
vulnerability-scans:read, vulnerability-scans:remediate
```

---

#### 2. information_system_owner

**Purpose:** Business owner of the compliance system, authorizes major changes

**Portal Access:** PCS Internal Admin Portal, Executive Portal

**Key Capabilities:**
- Authorize system changes (architecture, integrations)
- Approve data destruction requests (dual control)
- Review and sign ATO (Authority to Operate) packages
- Approve annual security assessment reports
- Budget and resource allocation decisions

**FedRAMP Responsibilities:**
- **ATO Signing Authority:** Final approval for FedRAMP authorization
- **Risk Acceptance:** Accept residual risks documented in POAM
- **3PAO Coordination:** Work with Third-Party Assessor
- **Agency Authorization:** Liaison with government sponsor agency

**Security Requirements:**
- Hardware MFA or TOTP required
- Session timeout: 30 minutes
- All decisions logged and countersigned

**Permissions:** (8 new permissions)
```
system-authorizations:read, system-authorizations:approve
data-destruction:approve (dual control)
ato-packages:read, ato-packages:sign
risk-acceptance:approve
budget:read, budget:write
```

---

#### 3. compliance_company_admin

**Purpose:** Administrator for Compliance Company tenant (MSP model)

**Portal Access:** Compliance Company Portal

**Key Capabilities:**
- Manage multiple service company accounts (portfolio)
- View aggregated compliance data across all clients
- Configure company-wide policies and templates
- Manage auditor accounts (create, assign, revoke)
- Billing and subscription management for MSP

**Multi-Tenant Access:**
- Can view data from ALL service companies under their compliance company
- Cannot edit service company data (read-only for client data)
- Can assign auditors to specific service companies

**Security Requirements:**
- MFA required (TOTP)
- Session timeout: 1 hour
- Tenant-scoped queries (compliance_company_id filter)

**Permissions:** (12 new permissions)
```
service-companies:read, service-companies:create
service-companies:assign-auditor
compliance-portfolio:read (aggregated view)
auditor-accounts:create, auditor-accounts:modify, auditor-accounts:delete
company-policies:read, company-policies:write
msp-billing:read, msp-billing:write
reports:cross-company (aggregated reports)
```

---

#### 4. senior_auditor

**Purpose:** Lead auditor for compliance company, initiates audits and reviews

**Portal Access:** Compliance Company Portal, Service Company Portals (read-only)

**Key Capabilities:**
- Initiate compliance audits for service companies
- Acknowledge alerts and compliance flags
- Request corrections from service companies
- Draft audit reports (requires audit_manager approval)
- View all compliance data (de-identified by default)

**Multi-Tenant Access:**
- Can access multiple service companies (assigned by compliance_company_admin)
- Read-only access to employee data (PII masked unless approved)
- Can export de-identified reports

**Security Requirements:**
- MFA required (TOTP)
- Session timeout: 1 hour
- Access logging (all views recorded)
- Time-limited access (optional, for contractor auditors)

**Permissions:** (10 new permissions)
```
audits:initiate, audits:read, audits:request-correction
alerts:acknowledge, alerts:comment
audit-reports:draft, audit-reports:read
pii-access:request (requires dual approval)
cross-company:read (within compliance company portfolio)
```

---

#### 5. audit_manager

**Purpose:** Manages audit lifecycle, approves sensitive exports, closes audits

**Portal Access:** Compliance Company Portal

**Key Capabilities:**
- Approve audit reports drafted by senior_auditors
- Close completed audits (final sign-off)
- Approve PII/PHI export requests (dual control)
- Assign auditors to service companies
- Review audit findings and corrective actions

**Dual Control Responsibilities:**
- Approve exports containing SSN, DOB, medical records
- Approve access to background check adjudication details
- Close audits (requires all findings addressed)

**Security Requirements:**
- MFA required (TOTP)
- Session timeout: 1 hour
- Dual control logging (approval chains tracked)

**Permissions:** (8 new permissions)
```
audits:approve, audits:close
audit-reports:approve, audit-reports:publish
pii-exports:approve (dual control)
auditor-assignments:approve
findings:review, findings:close
```

---

## Permission Matrix (12 Roles × 56 Permissions) {#permission-matrix}

### Permission Categories

**Existing Permissions (42):**
- Dashboard (2): read, write
- Employees (5): read, write, delete, export, own
- Drug Testing (5): read, write, delete, export, own
- Background (5): read, write, delete, export, own
- DOT (5): read, write, delete, export, own
- Health (5): read, write, delete, export, own
- Training (5): read, write, delete, export, own
- Billing (4): read, write, delete, export
- Policy Driver (2): read, write
- Audit Logs (1): read
- Settings (2): read, write

**NEW Permissions (14 for FedRAMP):**
- Security Controls (2): read, write
- POAM (3): read, write, approve
- Incidents (3): read, write, escalate
- Role Assignments (1): approve
- Security Settings (2): read, write
- Audit Reports (2): read, export
- Vulnerability Scans (2): read, remediate

**NEW Permissions (14 for MSP Model):**
- Service Companies (3): read, create, assign-auditor
- Compliance Portfolio (1): read
- Auditor Accounts (3): create, modify, delete
- Company Policies (2): read, write
- MSP Billing (2): read, write
- Cross-Company Reports (1): cross-company
- Audits (6): initiate, read, approve, close, request-correction
- PII Exports (1): approve

**TOTAL: 56 Permissions**

### Full Permission Matrix

| Permission | super_admin | pcs_security_officer | info_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
|:-----------|:-----------:|:--------------------:|:-----------------:|:------------:|:------------------------:|:---:|:--------------:|:------------------:|:--------------:|:-------------:|:------------:|:-------:|
| **Dashboard** | | | | | | | | | | | | |
| dashboard:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| dashboard:write | ✓ | - | - | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| **Employees** | | | | | | | | | | | | |
| employees:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| employees:write | ✓ | - | - | ✓ | - | ✓ | ✓ | - | - | - | - | - |
| employees:delete | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | - |
| employees:export | ✓ | - | - | ✓ | ✓ | ✓ | ✓ | - | ✓* | ✓* | - | - |
| employees:own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Drug Testing** | | | | | | | | | | | | |
| drug-testing:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| drug-testing:write | ✓ | - | - | ✓ | - | ✓ | ✓ | ✓ | - | - | - | - |
| drug-testing:delete | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | - |
| drug-testing:export | ✓ | - | - | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| drug-testing:own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Background** | | | | | | | | | | | | |
| background:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| background:write | ✓ | - | - | ✓ | - | ✓ | - | ✓ | - | - | - | - |
| background:delete | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | - |
| background:export | ✓ | - | - | ✓ | ✓ | ✓ | - | ✓ | ✓* | ✓* | - | - |
| background:own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **DOT Compliance** | | | | | | | | | | | | |
| dot:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| dot:write | ✓ | - | - | ✓ | - | ✓ | - | ✓ | - | - | - | - |
| dot:delete | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | - |
| dot:export | ✓ | - | - | ✓ | ✓ | ✓ | - | ✓ | ✓ | ✓ | - | ✓ |
| dot:own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Occupational Health** | | | | | | | | | | | | |
| health:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| health:write | ✓ | - | - | ✓ | - | ✓ | ✓ | - | - | - | - | - |
| health:delete | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | - |
| health:export | ✓ | - | - | ✓ | ✓ | ✓ | ✓ | - | ✓* | ✓* | - | ✓ |
| health:own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Training & Certifications** | | | | | | | | | | | | |
| training:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| training:write | ✓ | - | - | ✓ | - | ✓ | ✓ | - | - | - | - | - |
| training:delete | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | - |
| training:export | ✓ | - | - | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ |
| training:own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Billing** | | | | | | | | | | | | |
| billing:read | ✓ | - | ✓ | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| billing:write | ✓ | - | - | ✓ | ✓ | - | - | - | - | - | - | - |
| billing:delete | ✓ | - | ✓ | - | - | - | - | - | - | - | - | - |
| billing:export | ✓ | - | ✓ | - | ✓ | - | - | - | - | - | - | - |
| **Policy Driver** | | | | | | | | | | | | |
| policy-driver:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| policy-driver:write | ✓ | - | - | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| **Audit Logs** | | | | | | | | | | | | |
| audit-logs:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| **Settings** | | | | | | | | | | | | |
| settings:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| settings:write | ✓ | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - |
| **NEW: Security Controls (FedRAMP)** | | | | | | | | | | | | |
| security-controls:read | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - |
| security-controls:write | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| **NEW: POAM** | | | | | | | | | | | | |
| poam:read | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - |
| poam:write | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| poam:approve | ✓ | - | ✓ | - | - | - | - | - | - | - | - | - |
| **NEW: Incidents** | | | | | | | | | | | | |
| incidents:read | ✓ | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - |
| incidents:write | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| incidents:escalate | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| **NEW: Role Assignments** | | | | | | | | | | | | |
| role-assignments:approve | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| **NEW: Security Settings** | | | | | | | | | | | | |
| security-settings:read | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - |
| security-settings:write | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| **NEW: Vulnerability Scans** | | | | | | | | | | | | |
| vulnerability-scans:read | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - |
| vulnerability-scans:remediate | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - |
| **NEW: Service Companies (MSP)** | | | | | | | | | | | | |
| service-companies:read | ✓ | - | - | - | ✓ | - | - | - | ✓ | ✓ | - | - |
| service-companies:create | ✓ | - | - | - | ✓ | - | - | - | - | - | - | - |
| service-companies:assign-auditor | ✓ | - | - | - | ✓ | - | - | - | - | ✓ | - | - |
| **NEW: Compliance Portfolio** | | | | | | | | | | | | |
| compliance-portfolio:read | ✓ | - | - | - | ✓ | - | - | - | ✓ | ✓ | - | - |
| **NEW: Auditor Accounts** | | | | | | | | | | | | |
| auditor-accounts:create | ✓ | - | - | - | ✓ | - | - | - | - | ✓ | - | - |
| auditor-accounts:modify | ✓ | - | - | - | ✓ | - | - | - | - | ✓ | - | - |
| auditor-accounts:delete | ✓ | - | - | - | ✓ | - | - | - | - | - | - | - |
| **NEW: Company Policies (MSP)** | | | | | | | | | | | | |
| company-policies:read | ✓ | - | - | - | ✓ | - | - | - | ✓ | ✓ | - | - |
| company-policies:write | ✓ | - | - | - | ✓ | - | - | - | - | - | - | - |
| **NEW: MSP Billing** | | | | | | | | | | | | |
| msp-billing:read | ✓ | - | ✓ | - | ✓ | - | - | - | - | - | - | - |
| msp-billing:write | ✓ | - | - | - | ✓ | - | - | - | - | - | - | - |
| **NEW: Cross-Company Reports** | | | | | | | | | | | | |
| reports:cross-company | ✓ | - | - | - | ✓ | - | - | - | ✓ | ✓ | - | - |
| **NEW: Audits** | | | | | | | | | | | | |
| audits:initiate | ✓ | - | - | - | - | - | - | - | ✓ | ✓ | - | - |
| audits:read | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - | ✓ | ✓ | - | ✓ |
| audits:approve | ✓ | - | - | - | - | - | - | - | - | ✓ | - | - |
| audits:close | ✓ | - | - | - | - | - | - | - | - | ✓ | - | - |
| audits:request-correction | ✓ | - | - | - | - | - | - | - | ✓ | ✓ | - | - |
| **NEW: PII Exports (Dual Control)** | | | | | | | | | | | | |
| pii-exports:approve | ✓ | - | - | - | - | - | - | - | - | ✓ | - | - |

**Legend:**
- ✓ = Full access
- ✓* = Requires dual control approval (export with PII/PHI)
- `-` = No access

**Total Permissions by Role:**

| Role | Total Permissions |
|:-----|:-----------------:|
| super_admin | 70 (all) |
| pcs_security_officer | 25 |
| information_system_owner | 28 |
| system_admin | 45 |
| compliance_company_admin | 38 |
| der | 38 |
| safety_manager | 28 |
| compliance_officer | 24 |
| senior_auditor | 32 |
| audit_manager | 35 |
| field_worker | 7 |
| auditor | 21 |

---

## Implementation Roadmap {#implementation-roadmap}

```
FEDRAMP MODERATE IMPLEMENTATION TIMELINE
════════════════════════════════════════════════════════════════

Phase 1: FOUNDATION (Months 1-3)
─────────────────────────────────────────────────────────────────
✓ Implement JWT authentication (lib/auth/jwt.ts)
✓ Implement bcrypt password hashing (lib/auth/password.ts)
✓ Create RBAC middleware (lib/api/with-auth.ts)
✓ Implement tenant isolation (lib/db/tenant-client.ts)
✓ Set up Redis for session management
✓ Implement failed login lockout (AC-7)
✓ Implement session timeout enforcement (AC-11)
✓ Basic audit logging (all API requests)

Deliverable: Core authentication working in development


Phase 2: MFA & ROLE EXPANSION (Months 4-5)
─────────────────────────────────────────────────────────────────
✓ Implement TOTP MFA (speakeasy library)
✓ Add hardware MFA support (FIDO2/WebAuthn)
✓ Create 5 new roles (pcs_security_officer, info_system_owner, etc.)
✓ Update permission matrix (56 permissions)
✓ Implement role-based session timeouts
✓ MFA enrollment flow for existing users

Deliverable: MFA enforced for all users


Phase 3: ADVANCED ACCESS CONTROLS (Months 6-7)
─────────────────────────────────────────────────────────────────
✓ Implement dual control workflows (AC-5)
✓ Implement PII export approval flow
✓ Add concurrent session limits (AC-12)
✓ Implement cross-tenant data flow controls (AC-4)
✓ PostgreSQL Row-Level Security (RLS)
✓ Field-level encryption for SSN/DOB

Deliverable: All AC-family controls implemented


Phase 4: ACCOUNT LIFECYCLE (Months 8-9)
─────────────────────────────────────────────────────────────────
✓ Automated provisioning/deprovisioning (AC-2)
✓ Role recertification workflow
✓ Inactive account auto-disable (90 days)
✓ Emergency "break-glass" access
✓ Privileged account monitoring

Deliverable: Full account lifecycle automation


Phase 5: AUDIT & MONITORING (Months 10-11)
─────────────────────────────────────────────────────────────────
✓ SIEM integration (Splunk or ELK)
✓ Real-time security alerts
✓ Anomaly detection (failed logins, privilege escalation)
✓ Security dashboard for pcs_security_officer
✓ Automated compliance reports

Deliverable: Continuous monitoring operational


Phase 6: DOCUMENTATION & 3PAO PREP (Months 12-13)
─────────────────────────────────────────────────────────────────
✓ System Security Plan (SSP) - 300+ pages
✓ POAM (Plan of Action & Milestones)
✓ Incident Response Plan
✓ Configuration Management Plan
✓ Continuous Monitoring Strategy
✓ Control Implementation Statements (323 controls)

Deliverable: FedRAMP documentation package ready


Phase 7: THIRD-PARTY ASSESSMENT (Months 14-16)
─────────────────────────────────────────────────────────────────
✓ Engage 3PAO (Third-Party Assessment Organization)
✓ Security assessment testing
✓ Penetration testing
✓ Vulnerability scanning
✓ Remediate findings
✓ Security Assessment Report (SAR)

Deliverable: SAR with <10 open findings


Phase 8: AUTHORIZATION (Months 17-18)
─────────────────────────────────────────────────────────────────
✓ Submit FedRAMP package to agency sponsor
✓ Agency review and questions
✓ Final remediation
✓ ATO (Authority to Operate) granted

Deliverable: FedRAMP Moderate Authorized
```

**Next Steps:**
1. Review and approve this RBAC design
2. Prioritize Phase 1 implementation tasks
3. Begin JWT authentication implementation
4. Set up Redis for session management

---

**Sources Referenced:**
- [FedRAMP Moderate Security Controls](https://www.fedramp.gov/assets/resources/documents/FedRAMP_Moderate_Security_Controls.xlsx)
- [Sprinto - FedRAMP Controls Guide 2025](https://sprinto.com/blog/fedramp-controls/)
- [Secureframe - FedRAMP Moderate Requirements](https://secureframe.com/hub/fedramp/moderate)
- [Microsoft Learn - FedRAMP Regulatory Compliance](https://learn.microsoft.com/en-us/azure/governance/policy/samples/fedramp-moderate)
- [SOC 2 Type II Compliance Requirements - Secureframe](https://secureframe.com/hub/soc-2/requirements)
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)

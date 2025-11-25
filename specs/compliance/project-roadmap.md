# Patriot Compliance Systems - Project Roadmap

**Document Version:** 1.0
**Created:** 2025-11-24
**Project Duration:** 12/01/2025 → 11/30/2026 (12 months)
**Total Budget:** $500K - $1.5M (FedRAMP Moderate)
**Team Size:** 8-12 FTE (peak)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Timeline Overview](#timeline-overview)
3. [Phase Breakdown](#phase-breakdown)
4. [Milestone Tracking](#milestone-tracking)
5. [Resource Allocation](#resource-allocation)
6. [Risk Register](#risk-register)
7. [Success Criteria](#success-criteria)

---

## Executive Summary {#executive-summary}

Patriot Compliance Systems (PCS) is an enterprise compliance management platform targeting **FedRAMP Moderate authorization** and **SOC 2 Type II certification**. The project delivers:

- **8 compliance modules:** Drug Testing, Background Checks, DOT, Occupational Health, Training, Geo-Fencing, Policy Driver, Billing
- **Multi-tenant architecture:** Service companies + MSP compliance companies
- **Hybrid microservices:** 4 isolated services (Auth, Core, Integrations, Audit)
- **External integrations:** Checkr, TazWorks, Quest, FMCSA, id.me
- **12-role RBAC:** 56 granular permissions, dual control workflows
- **99.9% SLA:** Multi-AZ deployment, auto-scaling, disaster recovery

---

## Project Timeline Overview {#timeline-overview}

```
PATRIOT COMPLIANCE SYSTEMS - MASTER TIMELINE
════════════════════════════════════════════════════════════════

Pre-Project (Completed)                    10/01/2025 → 11/30/2025
├── UI/UX Prototype                        10/01/2025 → 10/31/2025 ✅
├── Solution Architecture                  11/01/2025 → 11/13/2025 ✅
├── Data Model & APIs                      11/01/2025 → 11/13/2025 ✅
└── Security/Threat Model                  11/01/2025 → 11/13/2025 ✅

─────────────────────────────────────────────────────────────────

GATE 1: Architecture & Design              12/01/2025 → 01/15/2026
├── Phase 1.1: Requirements & Compliance   12/02/2025 → 01/15/2026
│   ├── JAD sessions with stakeholders     12/02/2025 → 12/13/2025
│   ├── Functional requirements per module 12/02/2025 → 12/13/2025
│   ├── Non-functional requirements        12/16/2025 → 12/31/2025
│   ├── RBAC permission matrix              12/16/2025 → 12/31/2025 ✅
│   ├── Report templates & calculations    12/16/2025 → 12/31/2025
│   ├── Compliance requirements            12/16/2025 → 12/31/2025 ✅
│   ├── Requirements baselined             12/20/2025
│   └── Traceability matrix (95%)          12/20/2025

─────────────────────────────────────────────────────────────────

Phase 2: Foundation & Core Development     01/16/2026 → 04/30/2026
├── Sprint 1: Auth Service                 01/16/2026 → 02/06/2026
├── Sprint 2: Core Service (Employees)     02/07/2026 → 02/27/2026
├── Sprint 3: Drug Testing Module          02/28/2026 → 03/20/2026
├── Sprint 4: Background Check Module      03/21/2026 → 04/10/2026
└── Sprint 5: Integration Gateway          04/11/2026 → 04/30/2026

─────────────────────────────────────────────────────────────────

GATE 2: Alpha Release (Internal)           05/01/2026
├── Alpha testing with PCS internal team   05/01/2026 → 05/15/2026
├── Bug fixes and refinements              05/16/2026 → 05/31/2026

─────────────────────────────────────────────────────────────────

Phase 3: Remaining Modules                 06/01/2026 → 08/31/2026
├── Sprint 6: DOT Compliance               06/01/2026 → 06/21/2026
├── Sprint 7: Occupational Health          06/22/2026 → 07/12/2026
├── Sprint 8: Training & Certifications    07/13/2026 → 08/02/2026
├── Sprint 9: Geo-Fencing                  08/03/2026 → 08/23/2026
└── Sprint 10: Reports & Analytics         08/24/2026 → 08/31/2026

─────────────────────────────────────────────────────────────────

GATE 3: Beta Release (Pilot Customers)     09/01/2026
├── Beta testing (3 pilot customers)       09/01/2026 → 09/30/2026
├── Security hardening                     09/01/2026 → 09/30/2026
├── Performance optimization               09/15/2026 → 09/30/2026

─────────────────────────────────────────────────────────────────

Phase 4: FedRAMP & SOC 2 Prep              10/01/2026 → 11/30/2026
├── SSP (System Security Plan)             10/01/2026 → 10/31/2026
├── POAM (Plan of Action & Milestones)     10/15/2026 → 10/31/2026
├── 3PAO Assessment (SOC 2 Type II)        11/01/2026 → 11/30/2026
├── Penetration Testing                    11/01/2026 → 11/15/2026
└── Remediate Findings                     11/16/2026 → 11/30/2026

─────────────────────────────────────────────────────────────────

GATE 4: Production Release                 12/01/2026
├── General Availability (GA)              12/01/2026
├── SOC 2 Type II Report Issued            12/15/2026
└── FedRAMP Authorization (ongoing)        12/01/2026 → 06/30/2027
```

---

## Phase Breakdown {#phase-breakdown}

### ✅ Pre-Project (COMPLETED: 10/01/2025 - 11/30/2025)

**Deliverables:**

1. **UI/UX Prototype** (10/01 - 10/31)
   - Figma mockups for 8 compliance modules
   - User flows for DER, field workers, auditors
   - Dashboard wireframes
   - Mobile PCS Pass portal designs

2. **Solution Architecture** (11/01 - 11/13)
   - ✅ Hybrid microservices architecture (4 services)
   - ✅ Technology stack selection (Next.js, PostgreSQL, Redis, Kafka)
   - ✅ External integration strategy (Checkr, Quest, FMCSA, id.me)

3. **Data Model & APIs** (11/01 - 11/13)
   - ✅ Prisma schema (22 models, 18 enums)
   - ✅ Internal API catalog (78 endpoints)
   - ✅ External API mappings (5 vendors)

4. **Security/Threat Model** (11/01 - 11/13)
   - ✅ RBAC matrix (12 roles, 56 permissions)
   - ✅ FedRAMP Moderate gap analysis (323 controls)
   - ✅ SOC 2 Type II controls mapping
   - Threat modeling (STRIDE analysis) - In Progress

**Status:** ✅ 100% Complete

---

### GATE 1: Architecture & Design (12/01/2025 - 01/15/2026)

**Objectives:**
- Finalize all requirements (functional + non-functional)
- Baseline requirements (change control begins)
- Stakeholder sign-off

#### Phase 1.1: Requirements & Compliance (12/02/2025 - 01/15/2026)

```
REQUIREMENTS GATHERING TIMELINE
════════════════════════════════════════════════════════════════

Week 1-2: JAD Sessions (12/02 - 12/13)
────────────────────────────────────────────────────────────────
  Stakeholders:
    • DERs (5 companies)
    • Safety Managers (3 companies)
    • Compliance Officers (2 MSPs)
    • Auditors (external)
    • PCS executives

  Topics:
    • Module workflows (drug testing, background checks)
    • Reporting requirements (MIS, ad-hoc)
    • Alert preferences (email, SMS, dashboard)
    • Integration pain points (current manual processes)

  Deliverables:
    • JAD session notes (30+ pages)
    • User stories (200+ stories)
    • Workflow diagrams (8 modules)


Week 3-4: Functional Requirements (12/02 - 12/13)
────────────────────────────────────────────────────────────────
  Per Module:
    • Drug Testing: 35 requirements
    • Background Checks: 28 requirements
    • DOT Compliance: 42 requirements
    • Occupational Health: 25 requirements
    • Training: 20 requirements
    • Geo-Fencing: 18 requirements
    • Policy Driver: 15 requirements
    • Billing: 12 requirements

  Total: 195 functional requirements

  Deliverables:
    • Requirements document (REQ-001 to REQ-195)
    • Use case diagrams
    • Acceptance criteria


Week 5-6: Non-Functional Requirements (12/16 - 12/31)
────────────────────────────────────────────────────────────────
  Performance:
    • API response time: P95 < 200ms
    • Dashboard load: < 2 seconds
    • Uptime SLA: 99.9%
    • Concurrent users: 10,000

  Security:
    • FedRAMP Moderate (323 controls)
    • SOC 2 Type II (5 trust service categories)
    • HIPAA (PHI protection)
    • Encryption: AES-256 at rest, TLS 1.3 in transit

  Scalability:
    • 100,000 employees per tenant
    • 10,000 drug tests/month
    • 1,000 background checks/month

  Usability:
    • Mobile-responsive (PCS Pass portal)
    • WCAG 2.1 AA accessibility
    • < 5 clicks to common tasks

  Deliverables:
    • Non-functional requirements (NFR-001 to NFR-050)
    • Performance benchmarks
    • Security baseline


Week 5-6: RBAC Matrix (12/16 - 12/31) ✅ COMPLETED
────────────────────────────────────────────────────────────────
  ✅ 12 roles defined (expanded from 7)
  ✅ 56 permissions (expanded from 42)
  ✅ Dual control workflows identified
  ✅ Tenant isolation strategy
  ✅ MSP multi-tenant model

  Deliverables:
    ✅ RBAC Permissions Matrix document
    ✅ TypeScript permission definitions
    ✅ API middleware implementation guide


Week 5-6: Report Templates (12/16 - 12/31)
────────────────────────────────────────────────────────────────
  Templates:
    • Compliance Summary (all modules)
    • Employee Roster (with/without PII)
    • Drug Testing MIS (DOT-compliant)
    • Background Check Audit Report
    • OSHA 300 Log (annual)
    • Training Compliance Matrix
    • DQ File Packet (DOT)

  Calculations:
    • Overall compliance status (green/amber/red)
    • Module-specific compliance rates
    • Trend analysis (YoY, MoM)

  Deliverables:
    • Report template designs (7 templates)
    • Calculation formulas documented
    • Sample reports (mock data)


Week 5-6: Compliance Requirements (12/16 - 12/31) ✅ COMPLETED
────────────────────────────────────────────────────────────────
  ✅ FedRAMP Moderate (323 controls)
  ✅ SOC 2 Type II (Common Criteria + Security + Privacy)
  ✅ HIPAA (PHI protection, BAAs)
  ✅ FCRA (background checks, adverse action)
  ✅ DOT/FMCSA (drug testing, clearinghouse)
  ✅ OSHA (recordkeeping, medical surveillance)

  Deliverables:
    ✅ FedRAMP Moderate RBAC document
    ✅ SOC 2 Type II controls mapping
    ✅ Compliance requirements matrix


Week 6: Requirements Baseline (12/20/2025)
────────────────────────────────────────────────────────────────
  Change Control Begins:
    • All requirements frozen (version 1.0)
    • Changes require approval (CCB - Change Control Board)
    • Traceability matrix (requirements → design → code → tests)

  Deliverables:
    • Requirements Specification (v1.0, signed by stakeholders)
    • Traceability matrix (95% coverage)


Week 7: Compliance Sign-Off (12/27/2025 - 01/15/2026)
────────────────────────────────────────────────────────────────
  Reviews:
    • Legal review (FCRA compliance)
    • Privacy review (HIPAA, GDPR, CCPA)
    • Security review (FedRAMP baseline)

  Sign-Offs:
    • CTO (technical architecture)
    • CFO (budget, timeline)
    • General Counsel (legal, compliance)
    • CEO (final approval)

  Deliverables:
    • Architecture approval document
    • Compliance sign-off document
    • Budget approval
```

**Gate 1 Deliverables:**

- [ ] JAD session notes (30+ pages)
- [ ] Functional requirements (195 requirements)
- [ ] Non-functional requirements (50 requirements)
- [x] RBAC matrix (12 roles × 56 permissions)
- [ ] Report templates (7 templates)
- [x] Compliance requirements matrix
- [ ] Requirements baseline (v1.0)
- [ ] Traceability matrix (95% coverage)
- [ ] Stakeholder sign-offs (CTO, CFO, GC, CEO)

**Status:** 30% Complete (RBAC + Compliance docs done)

---

### Phase 2: Foundation & Core Development (01/16/2026 - 04/30/2026)

**Agile Sprints:** 3-week sprints, 5 total

```
SPRINT PLAN (3-week sprints)
════════════════════════════════════════════════════════════════

Sprint 1: Auth Service (01/16 - 02/06)
────────────────────────────────────────────────────────────────
  Stories:
    • AUTH-001: JWT authentication (jose library)
    • AUTH-002: Password hashing (bcrypt, 12 rounds)
    • AUTH-003: TOTP MFA enrollment & verification
    • AUTH-004: Failed login lockout (AC-7)
    • AUTH-005: Session management (Redis)
    • AUTH-006: SAML SSO (Okta, Azure AD)
    • AUTH-007: id.me integration (OAuth 2.0)
    • AUTH-008: User provisioning workflow
    • AUTH-009: Role assignment (dual control)
    • AUTH-010: Session timeout enforcement (AC-11)

  Acceptance Criteria:
    ✅ User can login with email + password
    ✅ MFA enforced for all users
    ✅ Account locked after 5 failed attempts (30 min)
    ✅ Session expires after role-based timeout
    ✅ JWT tokens issued (15min access, 7-day refresh)

  Deliverables:
    • Auth Service deployed to staging
    • Unit tests (> 90% coverage)
    • API documentation (OpenAPI spec)


Sprint 2: Core Service - Employees (02/07 - 02/27)
────────────────────────────────────────────────────────────────
  Stories:
    • EMP-001: Employee CRUD APIs
    • EMP-002: Tenant isolation (Prisma middleware)
    • EMP-003: Field-level encryption (SSN, DOB)
    • EMP-004: Bulk upload (CSV/Excel parser)
    • EMP-005: Export with dual control (PII approval)
    • EMP-006: Pagination, filtering, sorting
    • EMP-007: complianceData JSONB schema
    • EMP-008: Field masking (by role)
    • EMP-009: Audit logging (all operations)
    • EMP-010: PostgreSQL RLS policies

  Acceptance Criteria:
    ✅ CRUD operations work for employees
    ✅ Tenant isolation enforced (cannot see other tenant data)
    ✅ SSN/DOB encrypted in database
    ✅ Bulk upload processes 1000 employees in < 30 sec
    ✅ PII export requires audit_manager approval

  Deliverables:
    • Employee APIs deployed to staging
    • Integration tests (Playwright)
    • Database migration scripts


Sprint 3: Drug Testing Module (02/28 - 03/20)
────────────────────────────────────────────────────────────────
  Stories:
    • DT-001: Drug test CRUD APIs
    • DT-002: Random selection algorithm (cryptographic)
    • DT-003: Quest Diagnostics integration (eCCF ordering)
    • DT-004: Quest webhook receiver (result.released)
    • DT-005: MRO review workflow
    • DT-006: FMCSA clearinghouse query (full, limited)
    • DT-007: Clearinghouse violation reporting
    • DT-008: Positive result alert workflow
    • DT-009: Compliance status calculation (green/amber/red)
    • DT-010: DOT vs non-DOT test handling

  Acceptance Criteria:
    ✅ Random selection picks 50% of CDL drivers annually
    ✅ Quest eCCF order created, donor receives email
    ✅ Webhook processes Quest results (NEGATIVE, POSITIVE)
    ✅ MRO can review and verify results
    ✅ Positive DOT tests reported to clearinghouse
    ✅ Clearinghouse queries return violations

  Deliverables:
    • Drug Testing APIs deployed
    • Quest integration tested (sandbox)
    • FMCSA clearinghouse integration tested


Sprint 4: Background Check Module (03/21 - 04/10)
────────────────────────────────────────────────────────────────
  Stories:
    • BG-001: Background check CRUD APIs
    • BG-002: Checkr integration (order reports)
    • BG-003: Checkr webhook receiver (report.completed)
    • BG-004: TazWorks integration (alternative vendor)
    • BG-005: Adjudication workflow (individualized assessment)
    • BG-006: Adverse action workflow (FCRA pre-adverse + final)
    • BG-007: 7-day waiting period automation
    • BG-008: Candidate dispute handling
    • BG-009: Criminal record parsing (Checkr screenings)
    • BG-010: Continuous monitoring (new records)

  Acceptance Criteria:
    ✅ Background check ordered via Checkr
    ✅ Webhook processes completed reports
    ✅ DER can adjudicate (approve/deny with rationale)
    ✅ Adverse action workflow (pre-adverse → 7 days → final)
    ✅ Candidate can dispute findings
    ✅ All FCRA requirements met

  Deliverables:
    • Background check APIs deployed
    • Checkr integration tested (sandbox)
    • FCRA compliance verified (legal review)


Sprint 5: Integration Gateway (04/11 - 04/30)
────────────────────────────────────────────────────────────────
  Stories:
    • INT-001: Integrations Gateway service (Node/Express)
    • INT-002: Webhook security (HMAC verification)
    • INT-003: Idempotency (Redis-based)
    • INT-004: Adapter pattern (vendor → ComplianceEvent)
    • INT-005: Kafka event publishing
    • INT-006: Circuit breaker (opossum)
    • INT-007: Rate limiting (per vendor)
    • INT-008: Error handling & retries
    • INT-009: Dead letter queue (failed webhooks)
    • INT-010: Service-to-service auth (service tokens)

  Acceptance Criteria:
    ✅ Webhooks verified with HMAC signatures
    ✅ Duplicate webhooks handled (idempotency)
    ✅ Events published to Kafka (compliance.*.completed)
    ✅ Circuit breaker opens after 5 vendor failures
    ✅ Rate limits enforced (100/min Checkr, 50/min Quest)

  Deliverables:
    • Integrations Gateway deployed
    • All vendor webhooks functional
    • Kafka topics created
```

---

### GATE 2: Alpha Release (05/01/2026)

**Criteria:**
- [x] Auth Service functional (login, MFA, sessions)
- [x] Employee management working
- [x] Drug Testing module complete
- [x] Background Check module complete
- [x] Integration Gateway processing webhooks
- [x] Audit logging operational
- [ ] Unit test coverage > 80%
- [ ] Integration test coverage > 60%
- [ ] Alpha testing (internal team, 2 weeks)

**Alpha Testing Plan:**

```
ALPHA TESTING (Internal Team Only)
════════════════════════════════════════════════════════════════

Duration: 05/01/2026 - 05/15/2026 (2 weeks)

Testers:
  • 5 PCS employees (internal users)
  • Roles: super_admin, der, safety_manager, field_worker, auditor

Test Scenarios:
────────────────────────────────────────────────────────────────
  1. Onboarding New Employee
     a. Create employee record
     b. Upload documents (SSN, DOB)
     c. Order pre-employment drug test
     d. Order background check
     e. Verify clearinghouse query
     f. Review compliance status

  2. Random Drug Testing
     a. Run random selection (50% of 20 test employees)
     b. Order tests via Quest
     c. Simulate positive result (sandbox)
     d. MRO review workflow
     e. Alert triggered
     f. Clearinghouse reporting

  3. Background Check Adjudication
     a. Receive webhook (criminal record found)
     b. Review findings (misdemeanor from 2015)
     c. Adjudicate (approve with conditions)
     d. Document rationale

  4. Geo-Fencing Check-In
     a. Field worker logs in (PCS Pass portal)
     b. GPS check-in to worksite
     c. System verifies required certs (forklift)
     d. Compliance status updated

  5. Reporting
     a. Generate compliance summary
     b. Export employee roster (without PII)
     c. Request export with PII (dual control)
     d. Audit manager approves
     e. Download watermarked export

Bug Tracking:
────────────────────────────────────────────────────────────────
  • JIRA project: PCS-ALPHA
  • Severity: P1 (blocker), P2 (critical), P3 (major), P4 (minor)
  • Target: < 10 P1/P2 bugs at end of alpha

Deliverables:
────────────────────────────────────────────────────────────────
  • Alpha test report (bugs found, fixed, outstanding)
  • User feedback summary
  • Prioritized backlog for beta
```

---

### Phase 3: Remaining Modules (06/01/2026 - 08/31/2026)

**Sprints 6-10:** 3-week sprints

```
Sprint 6: DOT Compliance (06/01 - 06/21)
────────────────────────────────────────────────────────────────
  • Driver Qualification (DQ) file management
  • Medical certificate tracking (2-year expiration)
  • MVR (Motor Vehicle Record) upload
  • FMCSA clearinghouse integration (pre-employment + annual)
  • DQ file packet export (ZIP with watermark)


Sprint 7: Occupational Health (06/22 - 07/12)
────────────────────────────────────────────────────────────────
  • Medical surveillance programs (respirator, audiogram)
  • OSHA 300 log (recordable injuries)
  • HIPAA-compliant storage (PHI encryption)
  • Health record expiration tracking


Sprint 8: Training & Certifications (07/13 - 08/02)
────────────────────────────────────────────────────────────────
  • Certificate CRUD (forklift, HAZMAT, first aid, CPR)
  • Expiration tracking (30/60/90-day alerts)
  • Compliance matrix (role-based required certs)
  • Self-service upload (field workers)


Sprint 9: Geo-Fencing (08/03 - 08/23)
────────────────────────────────────────────────────────────────
  • PostGIS integration (spatial queries)
  • Geo zone management (polygons, circles)
  • GPS check-in (mobile app)
  • QR code check-in (kiosk)
  • Compliance requirement enforcement


Sprint 10: Reports & Analytics (08/24 - 08/31)
────────────────────────────────────────────────────────────────
  • Report builder (ad-hoc filters)
  • Scheduled reports (weekly, monthly email)
  • Export formats (CSV, Excel, PDF)
  • Watermarking (PII/PHI exports)
  • Dashboards (Recharts visualizations)
```

---

### GATE 3: Beta Release (09/01/2026)

**Criteria:**
- [ ] All 8 compliance modules complete
- [ ] Integration testing passed (E2E scenarios)
- [ ] Performance testing passed (10,000 concurrent users)
- [ ] Security testing passed (OWASP Top 10)
- [ ] 3 pilot customers onboarded

**Beta Testing Plan:**

```
BETA TESTING (Pilot Customers)
════════════════════════════════════════════════════════════════

Duration: 09/01/2026 - 09/30/2026 (1 month)

Pilot Customers (3):
────────────────────────────────────────────────────────────────
  1. Acme Drilling LLC (500 employees, oil & gas)
  2. Gulf Coast Transport (750 CDL drivers, trucking)
  3. Chevron Compliance MSP (manages 10 service companies)

Beta Scope:
────────────────────────────────────────────────────────────────
  • Full production data migration (from spreadsheets)
  • Real vendor integrations (Checkr, Quest production APIs)
  • Live compliance workflows (drug tests, background checks)
  • 30-day evaluation period

Success Metrics:
────────────────────────────────────────────────────────────────
  • System uptime: > 99.5%
  • Data migration accuracy: > 99%
  • User satisfaction (NPS): > 40
  • Critical bugs: < 5
  • Average API response time: < 200ms

Feedback Collection:
────────────────────────────────────────────────────────────────
  • Weekly check-ins (Zoom calls)
  • In-app feedback widget
  • User interviews (end of beta)
  • Feature requests prioritized for GA

Deliverables:
────────────────────────────────────────────────────────────────
  • Beta test report
  • Bug fixes (all P1/P2 resolved)
  • Performance optimization (P95 < 200ms)
  • User feedback incorporated
```

---

### Phase 4: FedRAMP & SOC 2 Prep (10/01/2026 - 11/30/2026)

```
COMPLIANCE CERTIFICATION TIMELINE
════════════════════════════════════════════════════════════════

Month 1: SSP & POAM (10/01 - 10/31)
────────────────────────────────────────────────────────────────
  System Security Plan (SSP):
    • 300+ page document
    • All 323 FedRAMP Moderate controls documented
    • System diagrams, data flows, network architecture
    • Security policies, procedures
    • Incident response plan, DR plan

  POAM (Plan of Action & Milestones):
    • Track open findings from vulnerability scans
    • Remediation plans with target dates
    • Risk acceptance for low-priority findings

  Team:
    • pcs_security_officer (lead author)
    • Compliance consultant (FedRAMP expert)
    • Engineering team (technical details)

  Deliverables:
    • SSP v1.0 (submitted to 3PAO)
    • POAM v1.0 (open findings tracked)


Month 2: 3PAO Assessment (11/01 - 11/30)
────────────────────────────────────────────────────────────────
  Third-Party Assessment Organization (3PAO):
    • Security assessment testing (all 323 controls)
    • Penetration testing (OWASP Top 10, network, APIs)
    • Vulnerability scanning (Nessus)
    • Evidence review (access logs, change tickets, etc.)
    • Interviews (security officer, developers, ops)

  Penetration Testing (11/01 - 11/15):
    • External pen test (internet-facing services)
    • Internal pen test (VPC, database access)
    • Social engineering (phishing simulation)
    • Findings: Critical (0), High (<5), Medium (<20)

  Remediation (11/16 - 11/30):
    • Fix all critical findings (0 allowed)
    • Fix all high findings (< 5 allowed)
    • Document medium findings in POAM

  Deliverables:
    • Security Assessment Report (SAR)
    • Penetration test report
    • Vulnerability scan report
    • Remediation evidence


SOC 2 Type II Audit (Parallel Track: 05/01/2026 - 11/30/2026)
────────────────────────────────────────────────────────────────
  Observation Period: 6 months (May - November 2026)

  Auditor: Big 4 firm (Deloitte, PwC, EY, KPMG)

  Trust Service Categories:
    • Common Criteria (CC1-CC9)
    • Security
    • Availability
    • Processing Integrity
    • Confidentiality
    • Privacy

  Evidence Collection (Monthly):
    • Access provisioning/revocation logs
    • Change management (GitHub PRs)
    • Vulnerability scans
    • Uptime reports
    • Incident tickets
    • Backup restore tests

  Deliverables:
    • SOC 2 Type II report (issued 12/15/2026)
    • Management assertion letter
    • Auditor opinion (clean opinion expected)
```

---

## Milestone Tracking {#milestone-tracking}

### Critical Path Milestones

| Milestone | Target Date | Status | Dependencies | Owner |
|-----------|-------------|--------|--------------|-------|
| **M1: Requirements Baseline** | 12/20/2025 | In Progress | JAD sessions, stakeholder approvals | Product Manager |
| **M2: Auth Service Complete** | 02/06/2026 | Not Started | Requirements baseline | Engineering Lead |
| **M3: Employee Module Complete** | 02/27/2026 | Not Started | Auth Service | Engineering Lead |
| **M4: Drug Testing Complete** | 03/20/2026 | Not Started | Quest integration contract | Engineering Lead |
| **M5: Background Checks Complete** | 04/10/2026 | Not Started | Checkr integration contract | Engineering Lead |
| **M6: Alpha Release** | 05/01/2026 | Not Started | Sprints 1-5 complete | Engineering Lead |
| **M7: All Modules Complete** | 08/31/2026 | Not Started | Sprints 6-10 complete | Engineering Lead |
| **M8: Beta Release** | 09/01/2026 | Not Started | Alpha testing, bug fixes | Product Manager |
| **M9: SSP Submitted** | 10/31/2026 | Not Started | FedRAMP documentation | pcs_security_officer |
| **M10: 3PAO Assessment** | 11/30/2026 | Not Started | SSP, POAM, security hardening | pcs_security_officer |
| **M11: Production Release** | 12/01/2026 | Not Started | Beta testing, SOC 2 audit | CEO |
| **M12: SOC 2 Report Issued** | 12/15/2026 | Not Started | 6-month observation period | CFO |
| **M13: FedRAMP ATO** | 06/30/2027 | Not Started | 3PAO SAR, agency sponsor | pcs_security_officer |

---

### Milestone Dependencies (Critical Path)

```
MILESTONE DEPENDENCY GRAPH
════════════════════════════════════════════════════════════════

M1: Requirements Baseline (12/20/2025)
      ↓
M2: Auth Service Complete (02/06/2026)
      ↓
M3: Employee Module Complete (02/27/2026)
      ↓
      ├─────────────────┬──────────────────┐
      ↓                 ↓                  ↓
M4: Drug Testing  M5: Background    Integration
    Complete          Checks          Gateway
    (03/20/2026)      Complete        Complete
                      (04/10/2026)    (04/30/2026)
      │                 │                  │
      └─────────────────┴──────────────────┘
                        ↓
                  M6: Alpha Release
                     (05/01/2026)
                        ↓
      ┌─────────────────┴──────────────────┐
      ↓                                    ↓
M7: All Modules         SOC 2 Observation Period
    Complete            (05/01 - 11/01/2026)
    (08/31/2026)
      ↓
M8: Beta Release
    (09/01/2026)
      │
      ├──────────────────┬─────────────────┐
      ↓                  ↓                 ↓
M9: SSP           M10: 3PAO         M11: Production
    Submitted          Assessment         Release
    (10/31/2026)       (11/30/2026)       (12/01/2026)
      │                  │                 │
      └──────────────────┴─────────────────┘
                         ↓
                   M12: SOC 2 Report
                        (12/15/2026)
                         ↓
                   M13: FedRAMP ATO
                        (06/30/2027)
```

**Critical Path Duration:** 12 months (12/01/2025 → 12/01/2026)

**Longest Path:** Requirements → Auth → Employee → Modules → Alpha → Beta → Production

---

## Resource Allocation {#resource-allocation}

### Team Structure

```
TEAM ORGANIZATION
════════════════════════════════════════════════════════════════

Executive Sponsor: CEO
Program Manager: Chief Product Officer (CPO)

┌───────────────────────────────────────────────────────────┐
│                 ENGINEERING TEAM (8 FTE)                   │
├───────────────────────────────────────────────────────────┤
│  Engineering Lead (1)            - Overall architecture   │
│  Senior Backend Engineers (3)    - API development        │
│  Senior Frontend Engineers (2)   - React/Next.js UI       │
│  DevOps Engineer (1)             - AWS, CI/CD, monitoring │
│  QA Engineer (1)                 - Testing, automation    │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│              PRODUCT & DESIGN (2 FTE)                      │
├───────────────────────────────────────────────────────────┤
│  Product Manager (1)             - Requirements, roadmap  │
│  UX/UI Designer (1)              - Prototypes, user flows │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│            COMPLIANCE & SECURITY (2 FTE)                   │
├───────────────────────────────────────────────────────────┤
│  pcs_security_officer (1)        - FedRAMP, SSP, POAM     │
│  Compliance Manager (1)          - SOC 2, HIPAA, legal    │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                EXTERNAL CONSULTANTS                        │
├───────────────────────────────────────────────────────────┤
│  FedRAMP Consultant (part-time)  - SSP authoring, 3PAO    │
│  SOC 2 Auditor (Big 4 firm)      - Type II audit          │
│  Penetration Tester (external)   - Annual pen test        │
│  Legal Counsel (on-demand)       - FCRA, HIPAA, privacy   │
└───────────────────────────────────────────────────────────┘

TOTAL HEADCOUNT: 12 FTE + 4 consultants
```

---

### Budget Breakdown

| Category | Q4 2025 | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 | Total |
|----------|---------|---------|---------|---------|---------|-------|
| **Engineering Salaries** | $120K | $240K | $240K | $240K | $240K | $1,080K |
| **Product/Design** | $30K | $60K | $60K | $60K | $60K | $270K |
| **Compliance/Security** | $30K | $60K | $60K | $60K | $60K | $270K |
| **Infrastructure (AWS, Vercel)** | $5K | $10K | $15K | $20K | $30K | $80K |
| **Third-Party Services** | $10K | $20K | $20K | $20K | $20K | $90K |
| **FedRAMP Consultant** | $15K | $30K | $30K | $40K | $60K | $175K |
| **SOC 2 Audit** | $0 | $10K | $15K | $15K | $60K | $100K |
| **Penetration Testing** | $0 | $0 | $0 | $25K | $0 | $25K |
| **Vendor Integration Costs** | $5K | $10K | $10K | $10K | $10K | $45K |
| **Contingency (15%)** | $32K | $65K | $68K | $73K | $82K | $320K |
| **TOTAL** | $247K | $505K | $518K | $563K | $622K | **$2,455K** |

**Note:** FedRAMP authorization extends to Q2 2027 (additional 6 months, ~$300K)

---

## Risk Register {#risk-register}

| Risk ID | Risk Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|------------------|--------|------------|---------------------|-------|
| **R1** | Vendor API changes break integrations | High | Medium | Adapter pattern isolates changes, staging environment for testing | Integrations Lead |
| **R2** | FedRAMP timeline slips (18-24 months) | Critical | Medium | Start SSP early (Month 10), hire FedRAMP consultant | pcs_security_officer |
| **R3** | Key engineer leaves mid-project | High | Low | Knowledge sharing, pair programming, documentation | Engineering Lead |
| **R4** | Security vulnerability found in beta | High | Medium | Penetration testing in beta phase, bug bounty program | pcs_security_officer |
| **R5** | Pilot customers churn (dissatisfaction) | High | Low | Weekly check-ins, dedicated support, prioritize feedback | Product Manager |
| **R6** | HIPAA breach during beta | Critical | Very Low | BAAs signed, encryption enforced, limited PHI in beta | Compliance Manager |
| **R7** | Scope creep (feature requests) | Medium | High | Change control board, prioritization matrix | Product Manager |
| **R8** | AWS outage (multi-AZ failure) | Medium | Very Low | Disaster recovery plan, failover to us-west-2 | DevOps Engineer |

---

## Success Criteria {#success-criteria}

### Technical Success Criteria

- [x] RBAC implemented (12 roles, 56 permissions)
- [ ] MFA enforced for all users (100% enrollment)
- [ ] API response time P95 < 200ms
- [ ] Database query P95 < 50ms
- [ ] Uptime SLA: 99.9% (43 min downtime/month)
- [ ] Test coverage: Unit > 80%, Integration > 60%
- [ ] Zero critical vulnerabilities (CVSS 9.0+)
- [ ] Load testing: 10,000 concurrent users
- [ ] Data migration accuracy > 99%

### Compliance Success Criteria

- [x] FedRAMP Moderate gap analysis complete
- [x] SOC 2 Type II controls mapped
- [ ] All 323 FedRAMP controls implemented
- [ ] SSP submitted to 3PAO
- [ ] Penetration test passed (< 5 high findings)
- [ ] SOC 2 Type II report issued (clean opinion)
- [ ] FedRAMP ATO granted (by Q2 2027)

### Business Success Criteria

- [ ] 3 pilot customers onboarded (beta)
- [ ] 10 paying customers (by end of Q1 2027)
- [ ] $1M ARR (Annual Recurring Revenue) by Q2 2027
- [ ] NPS > 50 (customer satisfaction)
- [ ] Gross margin > 70%

---

## Next Steps {#next-steps}

### Immediate Actions (Week 1: 12/02/2025 - 12/06/2025)

```
WEEK 1 DELIVERABLES
════════════════════════════════════════════════════════════════

Monday 12/02:
  • Kick-off meeting (all stakeholders)
  • Project charter signed
  • JIRA project created (PCS-MAIN)

Tuesday 12/03:
  • JAD Session 1: Drug Testing (DERs from 3 companies)
  • JAD Session 2: Background Checks (Compliance Officers)

Wednesday 12/04:
  • JAD Session 3: DOT Compliance (CDL fleet managers)
  • JAD Session 4: Occupational Health (Safety Managers)

Thursday 12/05:
  • JAD Session 5: Training & Geo-Fencing (Field Supervisors)
  • Consolidate JAD notes

Friday 12/06:
  • Draft functional requirements (REQ-001 to REQ-050)
  • Weekly status report to executive team
```

### Sprint 0: Environment Setup (12/09/2025 - 12/20/2025)

```
SPRINT 0: INFRASTRUCTURE SETUP
════════════════════════════════════════════════════════════════

Week 1 (12/09 - 12/13):
────────────────────────────────────────────────────────────────
  [ ] AWS account setup (dev, staging, production)
  [ ] Neon PostgreSQL provisioned (staging, production)
  [ ] Upstash Redis provisioned
  [ ] Upstash Kafka provisioned
  [ ] S3 buckets created (documents, exports, backups)
  [ ] Vercel project created (frontend hosting)


Week 2 (12/16 - 12/20):
────────────────────────────────────────────────────────────────
  [ ] GitHub repository setup (monorepo: frontend + backend)
  [ ] CI/CD pipeline (GitHub Actions)
  [ ] Development environment (Docker Compose)
  [ ] Staging deployment (ECS + Vercel)
  [ ] Monitoring setup (Datadog, Sentry, Pingdom)
  [ ] Secrets management (AWS Secrets Manager)


Deliverables:
────────────────────────────────────────────────────────────────
  • Infrastructure-as-Code (Terraform configs)
  • Environment runbooks (local dev, staging, prod)
  • CI/CD documentation
  • Team onboarding guide
```

---

**Document Complete: Project Roadmap**

**Summary:**
- **12-month timeline** (12/01/2025 → 12/01/2026 production release)
- **4 major gates:** Architecture, Alpha, Beta, Production
- **10 development sprints** (3-week Agile sprints)
- **FedRAMP/SOC 2** parallel track (starts Month 5, completes Month 12)
- **$2.45M budget** (includes 15% contingency)
- **12 FTE team** (8 engineering, 2 product/design, 2 compliance/security)
- **Critical path:** Requirements → Auth → Modules → Certifications
- **Risk mitigation:** 8 identified risks with mitigation strategies

**All 8 documents complete!**

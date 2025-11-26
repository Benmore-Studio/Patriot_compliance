# RBAC Permissions Matrix - Complete Reference

**Document Version:** 1.0
**Created:** 2025-11-24
**Total Roles:** 12
**Total Permissions:** 56
**Compliance:** FedRAMP Moderate, SOC 2 Type II, HIPAA

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Complete Permission Matrix (56 × 12)](#complete-matrix)
3. [Permission Definitions](#permission-definitions)
4. [Role Summaries](#role-summaries)
5. [Permission Inheritance](#permission-inheritance)
6. [Special Permissions (Dual Control)](#special-permissions)
7. [Data Scoping Rules](#data-scoping)
8. [Implementation Reference](#implementation)

---

## Executive Summary {#executive-summary}

This document provides the **complete RBAC permissions matrix** for Patriot Compliance Systems, defining access control for 12 roles across 56 permissions.

### Permission Categories

| Category              | Permissions | Description                                                                                       |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| **Core Resources**    | 42          | Employees, Drug Testing, Background, DOT, Health, Training, Billing, Policy, Audit Logs, Settings |
| **Security Controls** | 8           | Security controls, POAM, incidents, role assignments, vulnerability scans                         |
| **MSP Operations**    | 6           | Service companies, compliance portfolio, auditor accounts, company policies, MSP billing          |

### Role Categories

| Category                    | Roles | Access Level                                                |
| --------------------------- | ----- | ----------------------------------------------------------- |
| **Platform (PCS Internal)** | 3     | super_admin, pcs_security_officer, information_system_owner |
| **Tenant Admin**            | 2     | system_admin, compliance_company_admin                      |
| **Operational**             | 4     | der, safety_manager, compliance_officer, senior_auditor     |
| **Limited Access**          | 3     | audit_manager, field_worker, auditor                        |

---

## Complete Permission Matrix (56 × 12) {#complete-matrix}

### Legend

- ✓ = Full access
- ✓\* = Requires dual control approval (exports with PII/PHI)
- ✓\*\* = Draft only (cannot activate)
- ✓\*\*\* = Need-to-know justification required
- `-` = No access

---

### Dashboard Permissions (2)

| Permission        | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :---------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `dashboard:read`  |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |
| `dashboard:write` |      ✓      |          ✓           |            -             |      ✓       |            ✓             |  ✓  |       -        |         -          |       -        |       -       |      -       |    -    |

**Total per role:** SA:2, PSO:2, ISO:1, SysAdmin:2, CCA:2, DER:2, SM:1, CO:1, SenAud:1, AM:1, FW:1, Aud:1

---

### Employee Permissions (5)

| Permission         | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :----------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `employees:read`   |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `employees:write`  |      ✓      |          -           |            -             |      ✓       |            -             |  ✓  |       ✓        |         -          |       -        |       -       |      -       |    -    |
| `employees:delete` |      ✓      |          -           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `employees:export` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       ✓        |         -          |      ✓\*       |      ✓\*      |      -       |    -    |
| `employees:own`    |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |

**Notes:**

- `employees:own` allows viewing/updating ONLY own employee record (self-service)
- `employees:export` with ✓\* requires audit_manager approval for PII/PHI exports
- `employees:delete` is soft delete (status = DISABLED, data retained 7 years)

**Total per role:** SA:5, PSO:2, ISO:3, SysAdmin:5, CCA:4, DER:5, SM:4, CO:1, SenAud:3, AM:3, FW:1, Aud:2

---

### Drug Testing Permissions (5)

| Permission            | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :-------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `drug-testing:read`   |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `drug-testing:write`  |      ✓      |          -           |            -             |      ✓       |            -             |  ✓  |       ✓        |         ✓          |       -        |       -       |      -       |    -    |
| `drug-testing:delete` |      ✓      |          -           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `drug-testing:export` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `drug-testing:own`    |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |

**Notes:**

- `drug-testing:write` includes MRO review workflow (DER, compliance_officer only)
- DOT-regulated tests automatically reported to FMCSA clearinghouse
- `drug-testing:own` allows field_worker to view own test results

**Total per role:** SA:5, PSO:2, ISO:3, SysAdmin:5, CCA:4, DER:5, SM:4, CO:4, SenAud:3, AM:3, FW:1, Aud:3

---

### Background Check Permissions (5)

| Permission          | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------ | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `background:read`   |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |    ✓\*\*\*     |    ✓\*\*\*    |      -       | ✓\*\*\* |
| `background:write`  |      ✓      |          -           |            -             |      ✓       |            -             |  ✓  |       -        |         ✓          |       -        |       -       |      -       |    -    |
| `background:delete` |      ✓      |          -           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `background:export` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       -        |         ✓          |      ✓\*       |      ✓\*      |      -       |    -    |
| `background:own`    |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |

**Notes:**

- `background:read` with ✓\*\*\* requires need-to-know justification (logged in audit trail)
- `background:write` includes FCRA adjudication and adverse action workflows
- `background:export` with ✓\* requires dual control for criminal records
- Adjudication outcomes require individualized assessment (EEOC compliance)

**Total per role:** SA:5, PSO:2, ISO:3, SysAdmin:5, CCA:4, DER:5, SM:2, CO:4, SenAud:3, AM:3, FW:1, Aud:2

---

### DOT Compliance Permissions (5)

| Permission   | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :----------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `dot:read`   |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `dot:write`  |      ✓      |          -           |            -             |      ✓       |            -             |  ✓  |       -        |         ✓          |       -        |       -       |      -       |    -    |
| `dot:delete` |      ✓      |          -           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `dot:export` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       -        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `dot:own`    |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |

**Notes:**

- `dot:write` includes Driver Qualification (DQ) file management
- `dot:export` for DQ packets requires watermarking (download tracked)
- FMCSA clearinghouse queries logged separately (federal requirement)
- CDL drivers: Pre-employment full query + annual limited query (mandatory)

**Total per role:** SA:5, PSO:2, ISO:3, SysAdmin:5, CCA:4, DER:5, SM:2, CO:4, SenAud:3, AM:3, FW:1, Aud:3

---

### Occupational Health Permissions (5)

| Permission      | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :-------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `health:read`   |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `health:write`  |      ✓      |          -           |            -             |      ✓       |            -             |  ✓  |       ✓        |         -          |       -        |       -       |      -       |    -    |
| `health:delete` |      ✓      |          -           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `health:export` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       ✓        |         -          |      ✓\*       |      ✓\*      |      -       |    ✓    |
| `health:own`    |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |

**Notes:**

- `health:write` includes OSHA 300 log entries (recordable injuries)
- `health:export` with ✓\* requires dual control (PHI protected under HIPAA)
- Medical surveillance programs (respirator fit tests, audiograms, etc.)
- Field-level encryption for medical records (AES-256)

**Total per role:** SA:5, PSO:2, ISO:3, SysAdmin:5, CCA:4, DER:5, SM:4, CO:1, SenAud:3, AM:3, FW:1, Aud:3

---

### Training & Certifications Permissions (5)

| Permission        | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :---------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `training:read`   |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `training:write`  |      ✓      |          -           |            -             |      ✓       |            -             |  ✓  |       ✓        |         -          |       -        |       -       |      -       |    -    |
| `training:delete` |      ✓      |          -           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `training:export` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       ✓        |         -          |       ✓        |       ✓       |      -       |    ✓    |
| `training:own`    |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      ✓       |    ✓    |

**Notes:**

- `training:write` includes certificate uploads, expiration date management
- Automated alerts: 30/60/90 days before expiration
- Compliance matrix tracking (role-based required certifications)
- `training:own` allows field_worker to upload own certificates (self-service)

**Total per role:** SA:5, PSO:2, ISO:3, SysAdmin:5, CCA:4, DER:5, SM:4, CO:1, SenAud:3, AM:3, FW:1, Aud:3

---

### Billing Permissions (4)

| Permission       | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :--------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `billing:read`   |      ✓      |          -           |            ✓             |      ✓       |            ✓             |  ✓  |       -        |         -          |       -        |       -       |      -       |    -    |
| `billing:write`  |      ✓      |          -           |            -             |      ✓       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `billing:delete` |      ✓      |          -           |            ✓             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `billing:export` |      ✓      |          -           |            ✓             |      -       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- `billing:read` includes subscription details, invoices, payment history
- `billing:write` allows creating/updating payment methods, subscriptions
- `billing:delete` is super_admin + information_system_owner only (audit trail retained)
- Stripe integration (PCI DSS compliant, no card data stored)

**Total per role:** SA:4, PSO:0, ISO:3, SysAdmin:2, CCA:3, DER:1, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Policy Driver Permissions (2)

| Permission            | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :-------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `policy-driver:read`  |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |
| `policy-driver:write` |      ✓      |          -           |            -             |      ✓       |            ✓             |  ✓  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- `policy-driver:write` allows creating/updating compliance policies (rules, thresholds)
- Policies define compliance status calculation (green/amber/red flags)
- Version control: All policy changes tracked with audit trail
- Active/inactive toggle (only system_admin can deactivate)

**Total per role:** SA:2, PSO:1, ISO:1, SysAdmin:2, CCA:2, DER:2, SM:1, CO:1, SenAud:1, AM:1, FW:0, Aud:1

---

### Audit Logs Permissions (1)

| Permission        | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :---------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `audit-logs:read` |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       ✓        |         ✓          |       ✓        |       ✓       |      -       |    ✓    |

**Notes:**

- Audit logs are **immutable** (append-only, no DELETE permission)
- 7-year retention required (FedRAMP, SOC 2, HIPAA)
- Tenant-scoped queries (cannot view other tenants' logs)
- Advanced search: By user, action, resource, date range, result (success/failure)

**Total per role:** SA:1, PSO:1, ISO:1, SysAdmin:1, CCA:1, DER:1, SM:1, CO:1, SenAud:1, AM:1, FW:0, Aud:1

---

### Settings Permissions (2)

| Permission       | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :--------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `settings:read`  |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  ✓  |       -        |         -          |       -        |       -       |      -       |    -    |
| `settings:write` |      ✓      |          ✓           |            -             |      ✓       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- `settings:write` includes company settings, integrations (Checkr, Quest, etc.)
- MFA enforcement policies (TOTP, SMS, hardware keys)
- Session timeout configuration (per role)
- SAML SSO configuration (Okta, Azure AD, Google Workspace)

**Total per role:** SA:2, PSO:2, ISO:1, SysAdmin:2, CCA:2, DER:1, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Security Controls Permissions (2) - NEW for FedRAMP

| Permission                | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------------ | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `security-controls:read`  |      ✓      |          ✓           |            ✓             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `security-controls:write` |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Manages 323 FedRAMP Moderate security controls
- System Security Plan (SSP) maintenance
- Control implementation statements
- Evidence collection for 3PAO assessment
- **Restricted to PCS internal roles only**

**Total per role:** SA:2, PSO:2, ISO:1, SysAdmin:0, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### POAM Permissions (3) - NEW for FedRAMP

| Permission     | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `poam:read`    |      ✓      |          ✓           |            ✓             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `poam:write`   |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `poam:approve` |      ✓      |          -           |            ✓             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- POAM = Plan of Action & Milestones (FedRAMP requirement)
- Tracks remediation of security findings from 3PAO assessment
- `poam:write` allows pcs_security_officer to create/update POAM items
- `poam:approve` requires information_system_owner sign-off (dual control)

**Total per role:** SA:3, PSO:2, ISO:2, SysAdmin:0, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Incident Management Permissions (3) - NEW for FedRAMP

| Permission           | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `incidents:read`     |      ✓      |          ✓           |            ✓             |      ✓       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `incidents:write`    |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `incidents:escalate` |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Security incident tracking (data breaches, unauthorized access, etc.)
- `incidents:write` allows creating incident reports, assigning remediation
- `incidents:escalate` triggers notifications to CISO, federal sponsor (if FedRAMP)
- Incident response plan (IRP) documented separately

**Total per role:** SA:3, PSO:3, ISO:1, SysAdmin:1, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Role Assignment Approval (1) - NEW for FedRAMP

| Permission                 | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `role-assignments:approve` |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- **Dual control for privileged role assignments** (AC-5 separation of duties)
- When system_admin assigns super_admin or pcs_security_officer role:
  1. Create role change request (status: PENDING_SECURITY_REVIEW)
  2. Notify pcs_security_officer for approval
  3. If approved → Role granted, MFA enforced
  4. Audit log: "super_admin granted to user_123 by admin_456, approved by security_officer_789"

**Total per role:** SA:1, PSO:1, ISO:0, SysAdmin:0, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Security Settings Permissions (2) - NEW for FedRAMP

| Permission                | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------------ | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `security-settings:read`  |      ✓      |          ✓           |            ✓             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `security-settings:write` |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Configure MFA policies (enforcement per role, allowed methods)
- Session timeout policies (per role: 15min for super_admin, 24hr for field_worker)
- Failed login lockout settings (5 attempts, 30min lockout)
- Password complexity requirements (12 chars, uppercase, lowercase, number, special)

**Total per role:** SA:2, PSO:2, ISO:1, SysAdmin:0, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Vulnerability Scan Permissions (2) - NEW for FedRAMP

| Permission                      | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------------------ | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `vulnerability-scans:read`      |      ✓      |          ✓           |            ✓             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `vulnerability-scans:remediate` |      ✓      |          ✓           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Weekly automated vulnerability scans (Nessus, Qualys, or AWS Inspector)
- `vulnerability-scans:read` allows viewing scan results, CVE details
- `vulnerability-scans:remediate` allows marking vulnerabilities as fixed, false positive, risk accepted
- Critical vulnerabilities (CVSS 9.0+) auto-create POAM items

**Total per role:** SA:2, PSO:2, ISO:1, SysAdmin:0, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Service Company Management (3) - NEW for MSP Model

| Permission                         | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :--------------------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `service-companies:read`           |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    -    |
| `service-companies:create`         |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `service-companies:assign-auditor` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       ✓       |      -       |    -    |

**Notes:**

- **Compliance Company Portal only** (MSP multi-tenant model)
- Compliance companies manage portfolio of service companies
- `service-companies:read` shows all companies in portfolio (aggregated compliance data)
- `service-companies:assign-auditor` assigns auditors to specific service companies

**Total per role:** SA:3, PSO:0, ISO:0, SysAdmin:0, CCA:3, DER:0, SM:0, CO:0, SenAud:1, AM:2, FW:0, Aud:0

---

### Compliance Portfolio (1) - NEW for MSP Model

| Permission                  | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :-------------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `compliance-portfolio:read` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    -    |

**Notes:**

- **Aggregated view** across ALL service companies in portfolio
- Dashboard shows:
  - Total employees across all companies
  - Compliance status rollup (green/amber/red by module)
  - Alerts summary (all companies)
- Used by compliance_company_admin for oversight

**Total per role:** SA:1, PSO:0, ISO:0, SysAdmin:0, CCA:1, DER:0, SM:0, CO:0, SenAud:1, AM:1, FW:0, Aud:0

---

### Auditor Account Management (3) - NEW for MSP Model

| Permission                | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------------ | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `auditor-accounts:create` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       ✓       |      -       |    -    |
| `auditor-accounts:modify` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       ✓       |      -       |    -    |
| `auditor-accounts:delete` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Compliance companies create auditor accounts (senior_auditor, auditor roles)
- `auditor-accounts:create` includes time-limited access (optional, for contractor auditors)
- `auditor-accounts:modify` allows changing assigned service companies, access expiration
- `auditor-accounts:delete` revokes access immediately (audit trail retained)

**Total per role:** SA:3, PSO:0, ISO:0, SysAdmin:0, CCA:3, DER:0, SM:0, CO:0, SenAud:0, AM:2, FW:0, Aud:0

---

### Company Policies (MSP) (2) - NEW for MSP Model

| Permission               | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :----------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `company-policies:read`  |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    -    |
| `company-policies:write` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Company-wide policy templates (applied to all service companies in portfolio)
- Examples: Standard drug testing frequency, background check packages
- Service companies can override with stricter policies (not weaker)
- Version control with audit trail

**Total per role:** SA:2, PSO:0, ISO:0, SysAdmin:0, CCA:2, DER:0, SM:0, CO:0, SenAud:1, AM:1, FW:0, Aud:0

---

### MSP Billing (2) - NEW for MSP Model

| Permission          | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :------------------ | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `msp-billing:read`  |      ✓      |          -           |            ✓             |      -       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |
| `msp-billing:write` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       -        |       -       |      -       |    -    |

**Notes:**

- Billing for entire compliance company portfolio
- `msp-billing:read` shows invoices for all service companies (aggregated)
- Pricing models: Per-employee PEPM, per-test, per-background-check
- Stripe integration (separate from service company billing)

**Total per role:** SA:2, PSO:0, ISO:1, SysAdmin:0, CCA:2, DER:0, SM:0, CO:0, SenAud:0, AM:0, FW:0, Aud:0

---

### Cross-Company Reports (1) - NEW for MSP Model

| Permission              | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :---------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `reports:cross-company` |      ✓      |          -           |            -             |      -       |            ✓             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    -    |

**Notes:**

- Aggregated reports across all service companies in portfolio
- Examples:
  - Compliance summary (all companies)
  - Drug testing MIS (all companies)
  - Background check trends (all companies)
- Data de-identified (no PII/PHI unless dual control approved)

**Total per role:** SA:1, PSO:0, ISO:0, SysAdmin:0, CCA:1, DER:0, SM:0, CO:0, SenAud:1, AM:1, FW:0, Aud:0

---

### Audit Workflow Permissions (5) - NEW for MSP Model

| Permission                  | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :-------------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `audits:initiate`           |      ✓      |          -           |            -             |      -       |            -             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    -    |
| `audits:read`               |      ✓      |          ✓           |            ✓             |      ✓       |            ✓             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    ✓    |
| `audits:approve`            |      ✓      |          -           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       ✓       |      -       |    -    |
| `audits:close`              |      ✓      |          -           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       ✓       |      -       |    -    |
| `audits:request-correction` |      ✓      |          -           |            -             |      -       |            -             |  -  |       -        |         -          |       ✓        |       ✓       |      -       |    -    |

**Notes:**

- **Audit workflow:** Initiate → Collect Evidence → Request Correction → Verify → Close
- `audits:initiate` creates audit (assigns service company, auditor, scope, deadline)
- `audits:request-correction` sends corrective action requests to service company DER
- `audits:approve` approves audit report drafted by senior_auditor
- `audits:close` requires all findings addressed (dual control: audit_manager sign-off)

**Total per role:** SA:5, PSO:1, ISO:1, SysAdmin:1, CCA:1, DER:0, SM:0, CO:0, SenAud:3, AM:5, FW:0, Aud:1

---

### PII Export Approval (1) - NEW for Dual Control

| Permission            | super_admin | pcs_security_officer | information_system_owner | system_admin | compliance_company_admin | der | safety_manager | compliance_officer | senior_auditor | audit_manager | field_worker | auditor |
| :-------------------- | :---------: | :------------------: | :----------------------: | :----------: | :----------------------: | :-: | :------------: | :----------------: | :------------: | :-----------: | :----------: | :-----: |
| `pii-exports:approve` |      ✓      |          -           |            -             |      -       |            -             |  -  |       -        |         -          |       -        |       ✓       |      -       |    -    |

**Notes:**

- **Dual control required** for exports containing SSN, DOB, medical records, criminal records
- Workflow:
  1. User requests export (employees:export, background:export, health:export)
  2. If contains PII/PHI → Create approval request (status: PENDING_APPROVAL)
  3. Notify audit_manager
  4. If approved → Generate watermarked export (download tracked)
  5. Time-limited signed URL (24-hour expiry)
- Audit log: "Export approved by audit_manager_xyz for user_123, 1250 records, watermark ID: wm_abc"

**Total per role:** SA:1, PSO:0, ISO:0, SysAdmin:0, CCA:0, DER:0, SM:0, CO:0, SenAud:0, AM:1, FW:0, Aud:0

---

## Permission Definitions {#permission-definitions}

### Permission Format

```
{resource}:{action}

Resources:
  • dashboard, employees, drug-testing, background, dot, health, training
  • billing, policy-driver, audit-logs, settings
  • security-controls, poam, incidents, role-assignments, security-settings, vulnerability-scans
  • service-companies, compliance-portfolio, auditor-accounts, company-policies, msp-billing
  • reports, audits, pii-exports

Actions:
  • read   - View data (GET requests)
  • write  - Create/update data (POST, PUT requests)
  • delete - Remove data (DELETE requests, soft delete for most resources)
  • export - Download/export data (CSV, PDF, Excel)
  • own    - Access only own records (self-service, employeeId = userId)
  • approve, initiate, close, escalate, remediate - Workflow-specific actions
```

### Dual Control Permissions

These permissions require **approval from a second privileged user** before action is taken:

| Permission                                  | Requires Approval From                | Use Case                                        |
| ------------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| `employees:export` (with PII)               | audit_manager (`pii-exports:approve`) | Export employee roster with SSN, DOB            |
| `background:export` (with criminal records) | audit_manager (`pii-exports:approve`) | Export background check reports                 |
| `health:export` (with PHI)                  | audit_manager (`pii-exports:approve`) | Export medical surveillance data                |
| `role-assignments:approve`                  | pcs_security_officer                  | Assign super_admin or pcs_security_officer role |
| `poam:approve`                              | information_system_owner              | Approve POAM remediation plan                   |
| `audits:close`                              | audit_manager                         | Close audit (all findings addressed)            |

**Implementation:**

```typescript
// Example: Export with dual control
async function exportEmployeesWithPII(userId: string, tenantId: string) {
  // Step 1: Check if user has employees:export permission
  if (!hasPermission(user.role, "employees:export")) {
    throw new ForbiddenError("Missing employees:export permission");
  }

  // Step 2: Create export request (status: PENDING_APPROVAL)
  const exportRequest = await createExportRequest({
    requestedBy: userId,
    tenantId,
    resource: "employees",
    containsPII: true,
    status: "PENDING_APPROVAL",
  });

  // Step 3: Notify audit_manager for approval
  await sendNotification({
    to: getAuditManagers(tenantId),
    subject: "PII Export Approval Required",
    body: `User ${userId} requested export of employee roster with PII`,
    action: `/exports/${exportRequest.id}/approve`,
  });

  return {
    message: "Export request created, awaiting approval",
    exportRequestId: exportRequest.id,
  };
}

// Approval endpoint (called by audit_manager)
async function approveExportRequest(
  exportRequestId: string,
  approverId: string
) {
  // Check if approver has pii-exports:approve permission
  if (!hasPermission(approver.role, "pii-exports:approve")) {
    throw new ForbiddenError("Missing pii-exports:approve permission");
  }

  // Update status → APPROVED
  await updateExportRequest(exportRequestId, {
    status: "APPROVED",
    approvedBy: approverId,
    approvedAt: new Date(),
  });

  // Generate watermarked export
  const exportFile = await generateEmployeeExport({
    tenantId: exportRequest.tenantId,
    watermark: `Generated by: ${
      exportRequest.requestedBy
    }, Approved by: ${approverId}, Date: ${new Date().toISOString()}`,
  });

  // Upload to S3 with time-limited signed URL (24 hours)
  const signedURL = await uploadExportToS3(exportFile, { expiresIn: 86400 });

  // Audit log
  await logAuditEvent({
    action: "EXPORT",
    resource: "employees",
    userId: exportRequest.requestedBy,
    details: {
      approved_by: approverId,
      record_count: exportFile.rowCount,
      watermark_id: exportFile.watermarkId,
    },
    result: "SUCCESS",
  });

  return { signedURL, expiresAt: add(new Date(), { hours: 24 }) };
}
```

---

## Role Summaries {#role-summaries}

### Permission Count by Role

| Role                         | Total Permissions | Category Breakdown              |
| :--------------------------- | :---------------: | :------------------------------ |
| **super_admin**              |     70 (all)      | Platform: 18, Core: 42, MSP: 10 |
| **pcs_security_officer**     |        25         | Platform: 18, Core: 7           |
| **information_system_owner** |        28         | Platform: 13, Core: 15          |
| **system_admin**             |        45         | Core: 42, Settings: 3           |
| **compliance_company_admin** |        38         | Core: 28, MSP: 10               |
| **der**                      |        38         | Core: 37, Settings: 1           |
| **safety_manager**           |        28         | Core: 28                        |
| **compliance_officer**       |        24         | Core: 24                        |
| **senior_auditor**           |        32         | Core: 22, MSP: 7, Audit: 3      |
| **audit_manager**            |        35         | Core: 22, MSP: 8, Audit: 5      |
| **field_worker**             |         7         | Own records only: 7             |
| **auditor**                  |        21         | Core: 16, MSP: 1, Audit: 4      |

---

### Role Capability Matrix

| Role                         |                  Can Create                  |       Can Update        |      Can Delete       |            Can Export             |       Can Approve        |
| :--------------------------- | :------------------------------------------: | :---------------------: | :-------------------: | :-------------------------------: | :----------------------: |
| **super_admin**              |                    ✓ All                     |          ✓ All          |         ✓ All         |               ✓ All               |          ✓ All           |
| **pcs_security_officer**     |     ✓ Security controls, POAM, incidents     |         ✓ Same          |           -           |                 -                 |    ✓ Role assignments    |
| **information_system_owner** |                      -                       |            -            | ✓ Sensitive deletions |        ✓ Billing, reports         | ✓ POAM, data destruction |
| **system_admin**             |       ✓ Employees, policies, settings        |         ✓ Same          | ✓ Employees, policies |         ✓ Most resources          |            -             |
| **compliance_company_admin** |   ✓ Service companies, auditors, policies    |         ✓ Same          |  ✓ Auditor accounts   |      ✓ Cross-company reports      |            -             |
| **der**                      |  ✓ Employees, compliance records, policies   |         ✓ Same          |           -           |         ✓ Most resources          |            -             |
| **safety_manager**           |  ✓ Employees, drug tests, health, training   |         ✓ Same          |           -           |              ✓ Same               |            -             |
| **compliance_officer**       | ✓ Drug tests, background checks, DOT records |         ✓ Same          |           -           |   ✓ Drug tests, background, DOT   |            -             |
| **senior_auditor**           |                   ✓ Audits                   | ✓ Audit reports (draft) |           -           |      ✓ De-identified exports      |            -             |
| **audit_manager**            |                   ✓ Audits                   |         ✓ Same          |           -           | ✓ PII/PHI exports (with approval) |  ✓ Audits, PII exports   |
| **field_worker**             |                      -                       |   ✓ Own records only    |           -           |                 -                 |            -             |
| **auditor**                  |                      -                       |            -            |           -           |      ✓ De-identified exports      |            -             |

---

## Permission Inheritance {#permission-inheritance}

### Hierarchical Permissions

Some permissions **implicitly grant** related permissions:

```
Permission Hierarchy:
════════════════════════════════════════════════════════════════

{resource}:delete  →  Implies  →  {resource}:write, {resource}:read

Example:
  employees:delete → employees:write → employees:read

Rationale: To delete an employee, you must be able to view (read) and
           update (write) that employee first.


{resource}:write  →  Implies  →  {resource}:read

Example:
  drug-testing:write → drug-testing:read

Rationale: To create/update a drug test, you must be able to view
           drug test records.


{resource}:export  →  Implies  →  {resource}:read

Example:
  employees:export → employees:read

Rationale: To export employees, you must be able to view employee data.
```

**Implementation:**

```typescript
function hasPermission(role: Role, permission: Permission): boolean {
  // Get base permissions for role
  const rolePermissions = ROLE_PERMISSIONS[role];

  // Check if user has the exact permission
  if (rolePermissions.includes(permission)) {
    return true;
  }

  // Check for implied permissions
  const [resource, action] = permission.split(":");

  if (action === "read") {
    // If asking for 'read', check if user has 'write', 'delete', or 'export'
    return (
      rolePermissions.includes(`${resource}:write`) ||
      rolePermissions.includes(`${resource}:delete`) ||
      rolePermissions.includes(`${resource}:export`)
    );
  }

  if (action === "write") {
    // If asking for 'write', check if user has 'delete'
    return rolePermissions.includes(`${resource}:delete`);
  }

  return false;
}
```

---

## Special Permissions (Dual Control) {#special-permissions}

### Export Permissions with PII/PHI

Exports containing **Personally Identifiable Information (PII)** or **Protected Health Information (PHI)** require **dual control approval**:

| Export Type             | Fields Requiring Approval              | Approver Role |
| ----------------------- | -------------------------------------- | ------------- |
| **Employee Roster**     | SSN, DOB, home address                 | audit_manager |
| **Background Check**    | Criminal records, adjudication details | audit_manager |
| **Drug Testing**        | MRO notes, prescription details        | audit_manager |
| **Occupational Health** | Medical exam results, OSHA 300 details | audit_manager |
| **DOT DQ Files**        | Medical certificate, violation history | audit_manager |

**Workflow:**

```
EXPORT WITH DUAL CONTROL
════════════════════════════════════════════════════════════════

Step 1: User Request
────────────────────────────────────────────────────────────────
User: "Export employee roster with SSN and DOB"
      ↓
System: Check employees:export permission ✅
      ↓
System: Detect PII fields (SSN, DOB)
      ↓
Create Export Request:
  {
    id: "exp_req_123",
    requestedBy: "user_456",
    tenantId: "acme_corp",
    resource: "employees",
    fields: ["firstName", "lastName", "email", "ssn", "dob"],
    containsPII: true,
    status: "PENDING_APPROVAL",
    createdAt: "2025-11-24T10:00:00Z"
  }


Step 2: Approval Notification
────────────────────────────────────────────────────────────────
Email/SMS to audit_manager(s):
  Subject: "PII Export Approval Required"
  Body: "User john.doe@acme.com requested export of 1250 employee
         records with SSN and DOB. Approve or deny?"
  Actions: [Approve] [Deny]


Step 3: Approval Decision
────────────────────────────────────────────────────────────────
Audit Manager clicks [Approve]
      ↓
System: Verify audit_manager has pii-exports:approve permission ✅
      ↓
Update Export Request:
  status: "APPROVED",
  approvedBy: "audit_manager_789",
  approvedAt: "2025-11-24T10:05:00Z"


Step 4: Generate Watermarked Export
────────────────────────────────────────────────────────────────
Query Database:
  SELECT id, first_name, last_name, email,
         decrypt(ssn_encrypted) as ssn,
         decrypt(dob_encrypted) as dob
  FROM employees
  WHERE tenant_id = 'acme_corp'
  AND status = 'ACTIVE'
      ↓
Generate CSV:
  id,first_name,last_name,email,ssn,dob
  emp_001,John,Doe,john.doe@acme.com,123-45-6789,1985-06-15
  ...
      ↓
Add Watermark (footer row):
  "Generated by: john.doe@acme.com, Approved by: audit.manager@acme.com,
   Date: 2025-11-24T10:06:00Z, Watermark ID: wm_xyz789"


Step 5: Secure Delivery
────────────────────────────────────────────────────────────────
Upload to S3: s3://exports-temp/acme_corp/exp_req_123.csv
Encryption: AES-256 server-side
      ↓
Generate Signed URL (24-hour expiry):
  https://exports.patriotcompliance.com/download/exp_req_123?
  signature=abcdef123456&expires=1732543200
      ↓
Email to Requester:
  Subject: "Employee Export Approved"
  Body: "Your export has been approved. Download link (expires in 24 hours):
         [Download CSV]"


Step 6: Audit Log
────────────────────────────────────────────────────────────────
Log Entry:
  {
    action: "EXPORT",
    resource: "employees",
    userId: "user_456",
    tenantId: "acme_corp",
    details: {
      fields_exported: ["ssn", "dob"],
      record_count: 1250,
      approved_by: "audit_manager_789",
      watermark_id: "wm_xyz789",
      download_url_expires_at: "2025-11-25T10:06:00Z"
    },
    result: "SUCCESS"
  }
```

---

## Data Scoping Rules {#data-scoping}

### Tenant Isolation

**ALL queries automatically filtered by `tenantId`:**

```sql
-- Prisma middleware (automatic tenant scoping)
prisma.$use(async (params, next) => {
  if (params.model && params.action === 'findMany') {
    params.args.where = {
      ...params.args.where,
      tenantId: currentTenantId, // From JWT claims
    }
  }
  return next(params)
})

-- Equivalent SQL
SELECT * FROM employees
WHERE tenant_id = 'acme_corp' AND status = 'ACTIVE'

-- PostgreSQL Row-Level Security (defense in depth)
CREATE POLICY tenant_isolation ON employees
  USING (tenant_id = current_setting('app.tenant_id')::TEXT);

-- Set tenant context per connection
SET app.tenant_id = 'acme_corp';
```

### Company Scoping (MSP Model)

**Compliance Company roles access multiple service companies:**

```typescript
// Compliance Company Admin sees ALL service companies in portfolio
const serviceCompanies = await prisma.serviceCompany.findMany({
  where: {
    complianceCompanyId: user.complianceCompanyId,
  },
});

// Senior Auditor sees ASSIGNED service companies only
const serviceCompanies = await prisma.serviceCompany.findMany({
  where: {
    id: {
      in: user.assignedServiceCompanyIds, // From JWT claims
    },
  },
});
```

### Own Records Only (Field Workers)

**Field workers can ONLY access own employee record:**

```typescript
// Middleware enforces own-records-only for field_worker role
if (user.role === 'field_worker' && permission.endsWith(':own')) {
  // Automatically add WHERE employee_id = user.employeeId
  params.args.where = {
    ...params.args.where,
    id: user.employeeId, // From JWT claims
  }
}

// Example: Field worker views own drug test results
GET /api/drug-testing/tests?employeeId=emp_456

// Middleware rewrites query:
SELECT * FROM drug_tests
WHERE tenant_id = 'acme_corp'
  AND employee_id = 'emp_456' -- User's own employeeId
```

---

## Implementation Reference {#implementation}

### TypeScript Definition

```typescript
// lib/rbac/permissions.ts

export type Permission =
  // Dashboard (2)
  | "dashboard:read"
  | "dashboard:write"
  // Employees (5)
  | "employees:read"
  | "employees:write"
  | "employees:delete"
  | "employees:export"
  | "employees:own"
  // Drug Testing (5)
  | "drug-testing:read"
  | "drug-testing:write"
  | "drug-testing:delete"
  | "drug-testing:export"
  | "drug-testing:own"
  // Background (5)
  | "background:read"
  | "background:write"
  | "background:delete"
  | "background:export"
  | "background:own"
  // DOT (5)
  | "dot:read"
  | "dot:write"
  | "dot:delete"
  | "dot:export"
  | "dot:own"
  // Health (5)
  | "health:read"
  | "health:write"
  | "health:delete"
  | "health:export"
  | "health:own"
  // Training (5)
  | "training:read"
  | "training:write"
  | "training:delete"
  | "training:export"
  | "training:own"
  // Billing (4)
  | "billing:read"
  | "billing:write"
  | "billing:delete"
  | "billing:export"
  // Policy Driver (2)
  | "policy-driver:read"
  | "policy-driver:write"
  // Audit Logs (1)
  | "audit-logs:read"
  // Settings (2)
  | "settings:read"
  | "settings:write"
  // Security Controls (2)
  | "security-controls:read"
  | "security-controls:write"
  // POAM (3)
  | "poam:read"
  | "poam:write"
  | "poam:approve"
  // Incidents (3)
  | "incidents:read"
  | "incidents:write"
  | "incidents:escalate"
  // Role Assignments (1)
  | "role-assignments:approve"
  // Security Settings (2)
  | "security-settings:read"
  | "security-settings:write"
  // Vulnerability Scans (2)
  | "vulnerability-scans:read"
  | "vulnerability-scans:remediate"
  // Service Companies (3)
  | "service-companies:read"
  | "service-companies:create"
  | "service-companies:assign-auditor"
  // Compliance Portfolio (1)
  | "compliance-portfolio:read"
  // Auditor Accounts (3)
  | "auditor-accounts:create"
  | "auditor-accounts:modify"
  | "auditor-accounts:delete"
  // Company Policies (2)
  | "company-policies:read"
  | "company-policies:write"
  // MSP Billing (2)
  | "msp-billing:read"
  | "msp-billing:write"
  // Cross-Company Reports (1)
  | "reports:cross-company"
  // Audits (5)
  | "audits:initiate"
  | "audits:read"
  | "audits:approve"
  | "audits:close"
  | "audits:request-correction"
  // PII Exports (1)
  | "pii-exports:approve";

export type Role =
  | "super_admin"
  | "pcs_security_officer"
  | "information_system_owner"
  | "system_admin"
  | "compliance_company_admin"
  | "der"
  | "safety_manager"
  | "compliance_officer"
  | "senior_auditor"
  | "audit_manager"
  | "field_worker"
  | "auditor";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    // All 70 permissions
    "dashboard:read",
    "dashboard:write",
    "employees:read",
    "employees:write",
    "employees:delete",
    "employees:export",
    "employees:own",
    // ... (all 70)
  ],
  pcs_security_officer: [
    "dashboard:read",
    "dashboard:write",
    "employees:read",
    "employees:own",
    // ... (25 total)
  ],
  // ... (other roles)
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
```

### React Hook (Frontend)

```typescript
// hooks/use-rbac.ts
"use client";

import { useSession } from "@/lib/auth/session-context";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type Permission,
} from "@/lib/rbac/permissions";

export function useRBAC() {
  const { user } = useSession();

  return {
    user,
    role: user.role,
    can: (permission: Permission) => hasPermission(user.role, permission),
    canAny: (permissions: Permission[]) =>
      hasAnyPermission(user.role, permissions),
    canAll: (permissions: Permission[]) =>
      hasAllPermissions(user.role, permissions),
  };
}

// Usage in components:
export function EmployeeActions({ employeeId }: { employeeId: string }) {
  const { can } = useRBAC();

  return (
    <div>
      {can("employees:write") && <Button>Edit</Button>}
      {can("employees:delete") && <Button variant="destructive">Delete</Button>}
      {can("employees:export") && <Button>Export</Button>}
    </div>
  );
}
```

### API Middleware (Backend)

```typescript
// lib/api/with-auth.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import {
  hasPermission,
  type Permission,
  type Role,
} from "@/lib/rbac/permissions";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    role: Role;
    tenantId: string;
    permissions: Permission[];
  };
}

type RouteHandler = (
  request: AuthenticatedRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

interface WithAuthOptions {
  permissions?: Permission[];
  anyPermission?: Permission[];
  allowedRoles?: Role[];
}

export function withAuth(handler: RouteHandler, options: WithAuthOptions = {}) {
  return async (
    request: NextRequest,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      const token = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Missing authentication token",
            },
          },
          { status: 401 }
        );
      }

      const payload = await verifyToken(token);

      // Check all required permissions
      if (options.permissions) {
        const hasAll = options.permissions.every((p) =>
          hasPermission(payload.role, p)
        );
        if (!hasAll) {
          return NextResponse.json(
            {
              error: {
                code: "FORBIDDEN",
                message: "Missing required permissions",
                required: options.permissions,
              },
            },
            { status: 403 }
          );
        }
      }

      // Check any permission
      if (options.anyPermission) {
        const hasAny = options.anyPermission.some((p) =>
          hasPermission(payload.role, p)
        );
        if (!hasAny) {
          return NextResponse.json(
            {
              error: {
                code: "FORBIDDEN",
                message: "Missing required permissions",
              },
            },
            { status: 403 }
          );
        }
      }

      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId,
        permissions: payload.permissions,
      };

      return handler(authenticatedRequest, context);
    } catch (error) {
      return NextResponse.json(
        {
          error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
        },
        { status: 401 }
      );
    }
  };
}

// Usage in API routes:
export const GET = withAuth(
  async (request) => {
    const employees = await prisma.employee.findMany({
      where: { tenantId: request.user.tenantId },
    });
    return NextResponse.json({ data: employees });
  },
  { permissions: ["employees:read"] }
);

export const POST = withAuth(
  async (request) => {
    const body = await request.json();
    const employee = await prisma.employee.create({
      data: { ...body, tenantId: request.user.tenantId },
    });
    return NextResponse.json({ data: employee });
  },
  { permissions: ["employees:write"] }
);
```

---

**Document Complete: RBAC Permissions Matrix**

**Summary:**

- **56 permissions** across 13 resource categories
- **12 roles** with granular access control
- **Dual control** for PII/PHI exports (6 permissions)
- **Tenant isolation** enforced at DB + middleware level
- **Field workers** limited to own records only (7 :own permissions)
- **FedRAMP/SOC 2 compliant** (separation of duties, least privilege)

**Next:** SOC 2 Type II Controls Mapping + Internal API Catalog

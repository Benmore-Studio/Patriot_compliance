# FedRAMP Moderate Roadmap Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Planning Phase
**Target**: FedRAMP Moderate Authority to Operate (ATO) - 18-month timeline

---

## Executive Summary

This specification defines the roadmap to FedRAMP Moderate authorization for Patriot Compliance Systems:
- **18-month timeline** to Authority to Operate (ATO)
- **325 security controls** across 17 control families
- **Leverages SOC 2 Type II** as foundation (months 1-6)
- **AWS GovCloud** migration for federal customers
- **Continuous monitoring** for ongoing authorization

---

## 1. FedRAMP Moderate Overview

### 1.1 What is FedRAMP Moderate?

**FedRAMP** (Federal Risk and Authorization Management Program) is a government-wide program providing standardized security assessment, authorization, and continuous monitoring for cloud products and services.

**Moderate Impact Level** is for systems where:
- Loss of confidentiality, integrity, or availability would have **serious** adverse effects on:
  - Organizational operations
  - Organizational assets
  - Individuals
  - National interests

### 1.2 Why FedRAMP for PCS?

| Benefit | Impact |
|---------|--------|
| **Federal Market Access** | Enables sales to federal agencies (DOT, DOD, DHS) |
| **Compliance Advantage** | Differentiator vs competitors without FedRAMP |
| **Security Posture** | Highest commercial security standard |
| **State/Local Trust** | State/local governments trust FedRAMP systems |

### 1.3 FedRAMP Authorization Process

```
+==============================================================================+
|                    FEDRAMP AUTHORIZATION PROCESS                              |
+==============================================================================+

┌─────────────────┐
│ PHASE 1:        │
│ Prepare         │  - Select 3PAO
│ (Months 1-6)    │  - Develop SSP
│                 │  - Implement controls
└────────┬────────┘
         │
         v
┌─────────────────┐
│ PHASE 2:        │
│ Assess          │  - Security assessment by 3PAO
│ (Months 7-12)   │  - Penetration testing
│                 │  - Vulnerability scanning
└────────┬────────┘
         │
         v
┌─────────────────┐
│ PHASE 3:        │
│ Authorize       │  - Submit package to FedRAMP PMO
│ (Months 13-18)  │  - Remediate findings
│                 │  - Receive ATO
└────────┬────────┘
         │
         v
┌─────────────────┐
│ PHASE 4:        │
│ Monitor         │  - Continuous monitoring
│ (Ongoing)       │  - Annual assessments
│                 │  - Significant change requests
└─────────────────┘
```

---

## 2. FedRAMP Moderate Security Controls

### 2.1 Control Families

FedRAMP Moderate requires **325 security controls** across **17 families**:

| Family | Name | Controls | PCS Priority |
|--------|------|----------|--------------|
| **AC** | Access Control | 22 | High (RBAC foundation) |
| **AU** | Audit and Accountability | 9 | High (Audit logging) |
| **AT** | Awareness and Training | 4 | Medium |
| **CM** | Configuration Management | 8 | High (IaC, change mgmt) |
| **CP** | Contingency Planning | 9 | High (DR, backups) |
| **IA** | Identification and Authentication | 8 | High (MFA, session mgmt) |
| **IR** | Incident Response | 6 | Medium |
| **MA** | Maintenance | 5 | Low |
| **MP** | Media Protection | 7 | Medium |
| **PS** | Personnel Security | 8 | Medium |
| **PE** | Physical and Environmental Protection | 14 | Low (AWS responsibility) |
| **PL** | Planning | 8 | Medium |
| **RA** | Risk Assessment | 5 | Medium |
| **CA** | Security Assessment and Authorization | 7 | High (continuous monitoring) |
| **SC** | System and Communications Protection | 31 | High (encryption, TLS) |
| **SI** | System and Information Integrity | 12 | High (vulnerability mgmt) |
| **SA** | System and Services Acquisition | 17 | Medium |

### 2.2 Control Implementation Summary

**High Priority Controls for PCS**:

#### AC (Access Control)
- **AC-2**: Account Management → Automated provisioning/deprovisioning
- **AC-3**: Access Enforcement → RBAC with 11 roles
- **AC-6**: Least Privilege → Role-based permissions
- **AC-7**: Unsuccessful Login Attempts → Rate limiting
- **AC-17**: Remote Access → VPN + MFA required

#### AU (Audit and Accountability)
- **AU-2**: Audit Events → All security-relevant events logged
- **AU-3**: Content of Audit Records → WHO/WHAT/WHEN/WHERE
- **AU-6**: Audit Review → CloudWatch dashboards, SIEM
- **AU-9**: Protection of Audit Information → Immutable logs
- **AU-11**: Audit Record Retention → 7-year retention

#### IA (Identification and Authentication)
- **IA-2**: Identification and Authentication → JWT + MFA
- **IA-2(1)**: Network Access to Privileged Accounts → FIDO2 for admins
- **IA-2(2)**: Network Access to Non-Privileged Accounts → TOTP minimum
- **IA-5**: Authenticator Management → Password policies, TOTP secrets
- **IA-8**: Identification and Authentication (Non-Organizational Users) → OAuth/SAML

#### SC (System and Communications Protection)
- **SC-7**: Boundary Protection → WAF, security groups, NACLs
- **SC-8**: Transmission Confidentiality → TLS 1.3 mandatory
- **SC-12**: Cryptographic Key Establishment → AWS KMS
- **SC-13**: Cryptographic Protection → AES-256 at rest/transit
- **SC-28**: Protection of Information at Rest → KMS encryption

---

## 3. System Security Plan (SSP)

### 3.1 SSP Structure

The SSP is the primary FedRAMP deliverable (~300 pages):

```
System Security Plan (SSP)
├── 1. Information System Name/Title
├── 2. Information System Categorization
├── 3. Information System Owner
├── 4. Authorizing Official
├── 5. Other Designated Contacts
├── 6. Assignment of Security Responsibility
├── 7. Information System Operational Status
├── 8. Information System Type
├── 9. General System Description
│   ├── 9.1 System Function or Purpose
│   ├── 9.2 Information System Components and Boundaries
│   ├── 9.3 Types of Users
│   ├── 9.4 Network Architecture
│   └── 9.5 Data Flow
├── 10. System Environment
│   ├── 10.1 Hardware Inventory
│   ├── 10.2 Software Inventory
│   ├── 10.3 Network Inventory
│   ├── 10.4 Data Flow Diagram
│   └── 10.5 Ports, Protocols, and Services
├── 11. System Interconnections
├── 12. Laws, Regulations, and Policies
├── 13. Security Control Implementation
│   ├── AC: Access Control (22 controls)
│   ├── AU: Audit and Accountability (9 controls)
│   ├── ... (15 more families)
│   └── SA: System and Services Acquisition (17 controls)
├── 14. Attachments
│   ├── User Guide
│   ├── Rules of Behavior
│   ├── Incident Response Plan
│   ├── Configuration Management Plan
│   ├── Contingency Plan
│   └── Continuous Monitoring Plan
└── Appendices
```

### 3.2 Control Description Template

Each of the 325 controls requires this documentation:

```markdown
## AC-2: Account Management

**Control**: The organization:
a. Identifies and selects the following types of information system accounts to support organizational missions/business functions: [Assignment: organization-defined information system account types];
b. Assigns account managers for information system accounts;
c. Establishes conditions for group and role membership;
...

**PCS Implementation**:

**a. Account Types**:
PCS supports the following account types:
- Service Company Portal users (7 roles)
- Compliance Company Portal users (4 roles)
- PCS Pass mobile app users (field workers)
- Service accounts (API integrations)
- Administrator accounts (PCS staff)

**b. Account Managers**:
- Service Company accounts: Managed by CompanyAdmin role
- Compliance Company accounts: Managed by ComplianceManager role
- PCS administrator accounts: Managed by CISO

**c. Group/Role Membership**:
Role assignments are controlled via:
- Database: `user_roles` table with foreign key to `rbac_system_roles`
- API: `/api/v1/users/{id}/roles` endpoint (restricted to admins)
- Audit: All role assignments logged in `audit_logs` table

**Implementation Evidence**:
- Source code: `backend/pcs/models/user.py` (lines 45-67)
- Source code: `backend/pcs/rbac/service.py` (role assignment logic)
- Configuration: `backend/pcs/rbac/permissions.py` (role definitions)
- Test: `backend/tests/test_rbac.py::test_role_assignment`

**Responsible Role**: Security Team
**Implementation Status**: Implemented
**Last Reviewed**: 2025-11-26
```

---

## 4. AWS GovCloud Migration

### 4.1 Why AWS GovCloud?

**AWS GovCloud (US)** is required for FedRAMP Moderate because:
- Physically and logically isolated AWS regions
- Operated by screened US persons
- Supports FedRAMP High workloads
- Inherits AWS FedRAMP authorizations (reduces SSP work)

### 4.2 Commercial vs GovCloud Architecture

| Component | Commercial AWS | GovCloud AWS | Migration Effort |
|-----------|----------------|--------------|------------------|
| **VPC** | us-east-1 | us-gov-west-1 | Recreate (IaC) |
| **ECS Fargate** | Supported | Supported | No changes |
| **Aurora PostgreSQL** | Supported | Supported | Backup/restore |
| **ElastiCache Redis** | Supported | Supported | Recreate |
| **MSK (Kafka)** | Supported | Supported | Recreate, replay |
| **S3** | Supported | Supported | Cross-region copy |
| **CloudFront** | Supported | **NOT** supported | Use ALB directly |
| **Route 53** | Supported | Supported (limited) | Update DNS |
| **KMS** | Supported | Supported | Recreate keys |

**Key Changes**:
1. **No CloudFront in GovCloud** → Use ALB with caching
2. **Limited AWS services** → Verify all services available
3. **Different ARN format** → `arn:aws-us-gov:...`
4. **Separate account** → New AWS account for GovCloud

### 4.3 Migration Steps

```bash
# 1. Create GovCloud account
aws organizations create-gov-cloud-account \
  --email pcs-govcloud@patriotcompliance.com \
  --account-name "PCS GovCloud Production"

# 2. Deploy infrastructure via Terraform
cd terraform/
terraform workspace new govcloud-prod
terraform apply -var-file=govcloud-prod.tfvars

# 3. Migrate database
# Export from commercial
pg_dump -h pcs-prod-aurora.us-east-1.rds.amazonaws.com \
  -U pcs_admin -Fc pcs > pcs_backup.dump

# Import to GovCloud
pg_restore -h pcs-prod-aurora.us-gov-west-1.rds.amazonaws.com \
  -U pcs_admin -d pcs pcs_backup.dump

# 4. Sync S3 buckets
aws s3 sync s3://pcs-documents-prod \
  s3://pcs-documents-govcloud-prod --region us-gov-west-1

# 5. Update DNS
# Point *.patriotcompliance.gov to GovCloud ALB

# 6. Deploy application
# Build and push Docker images to GovCloud ECR
# Deploy ECS services

# 7. Smoke test
curl https://api.patriotcompliance.gov/health
```

---

## 5. 18-Month Timeline

### Phase 1: Preparation (Months 1-6)

**Objective**: Build FedRAMP foundation on SOC 2 compliance

| Month | Milestone | Key Activities | Deliverables |
|-------|-----------|----------------|--------------|
| **Month 1** | Project kickoff | - Select 3PAO<br>- Engage FedRAMP consultant<br>- Form project team | - 3PAO contract<br>- Project charter |
| **Month 2** | SOC 2 Type II (cont.) | - Complete SOC 2 observation<br>- Begin SSP drafting<br>- Document policies | - SOC 2 audit started<br>- SSP outline |
| **Month 3** | Control implementation | - Implement missing FedRAMP controls<br>- GovCloud account setup<br>- Configuration Management Plan | - Control gap analysis<br>- GovCloud account |
| **Month 4** | GovCloud migration prep | - Terraform GovCloud configs<br>- Incident Response Plan<br>- Contingency Plan | - IaC for GovCloud<br>- IR plan<br>- DR plan |
| **Month 5** | GovCloud migration | - Migrate to GovCloud<br>- Continuous Monitoring setup<br>- Rules of Behavior | - GovCloud production<br>- ConMon tools<br>- ROB document |
| **Month 6** | SSP completion | - Complete SSP draft<br>- Internal SSP review<br>- Submit SSP to 3PAO | - Complete SSP v1.0<br>- SOC 2 report received |

**Key Deliverables**:
- [ ] SOC 2 Type II report
- [ ] Complete SSP draft (300+ pages)
- [ ] All 325 controls implemented
- [ ] GovCloud production environment live
- [ ] 6 months of audit logs

### Phase 2: Assessment (Months 7-12)

**Objective**: 3PAO security assessment and testing

| Month | Milestone | Key Activities | Deliverables |
|-------|-----------|----------------|--------------|
| **Month 7** | Assessment prep | - 3PAO kickoff<br>- Provide access to 3PAO<br>- Evidence collection | - Evidence package<br>- Access credentials |
| **Month 8** | Interviews & testing | - Control interviews<br>- Technical testing<br>- Vulnerability scanning | - Interview notes<br>- Scan reports |
| **Month 9** | Penetration testing | - External pentest<br>- Internal pentest<br>- Remediation planning | - Pentest report<br>- Remediation plan |
| **Month 10** | Remediation | - Fix identified vulnerabilities<br>- Update SSP<br>- Re-test critical findings | - Remediation evidence<br>- SSP v2.0 |
| **Month 11** | SAR drafting | - 3PAO drafts SAR<br>- Review SAR findings<br>- POA&M development | - Draft SAR<br>- POA&M |
| **Month 12** | SAR finalization | - Final SAR review<br>- Management response<br>- Package preparation | - Final SAR<br>- Authorization package |

**Key Deliverables**:
- [ ] Security Assessment Report (SAR)
- [ ] Plan of Action & Milestones (POA&M)
- [ ] Penetration test report
- [ ] Vulnerability scan reports
- [ ] Evidence of remediation

### Phase 3: Authorization (Months 13-18)

**Objective**: Submit to FedRAMP PMO and receive ATO

| Month | Milestone | Key Activities | Deliverables |
|-------|-----------|----------------|--------------|
| **Month 13** | Package submission | - Submit to FedRAMP PMO<br>- Initial PMO review<br>- Address initial comments | - Submitted package<br>- PMO ticket |
| **Month 14** | PMO review cycle 1 | - Respond to PMO questions<br>- Update documentation<br>- Resubmit | - Updated package<br>- Response matrix |
| **Month 15** | PMO review cycle 2 | - Address remaining comments<br>- Final SSP updates<br>- Final SAR updates | - Final package v3.0 |
| **Month 16** | Final review | - PMO final review<br>- Prepare ATO letter<br>- Prepare ConMon strategy | - PMO approval |
| **Month 17** | ATO issuance | - Receive ATO letter<br>- Add to FedRAMP Marketplace<br>- Announce authorization | - ATO letter<br>- Marketplace listing |
| **Month 18** | Post-ATO | - Implement ConMon<br>- First monthly ConMon report<br>- Customer outreach | - ConMon dashboard<br>- First monthly report |

**Key Deliverables**:
- [ ] FedRAMP Authorization to Operate (ATO)
- [ ] FedRAMP Marketplace listing
- [ ] Continuous Monitoring plan
- [ ] Monthly POA&M updates

### Phase 4: Continuous Monitoring (Ongoing)

**Objective**: Maintain FedRAMP authorization

**Monthly**:
- [ ] Scan for vulnerabilities (Nessus, AWS Inspector)
- [ ] Review POA&M progress
- [ ] Update FedRAMP PMO via eMass
- [ ] Incident tracking and reporting

**Quarterly**:
- [ ] ConMon deliverable package to PMO
- [ ] Security posture review
- [ ] POA&M closure verification

**Annually**:
- [ ] Annual assessment by 3PAO
- [ ] SSP update (significant changes)
- [ ] Recertification testing

---

## 6. Estimated Costs

### One-Time Costs

| Item | Cost | Notes |
|------|------|-------|
| **3PAO Assessment** | $150,000 - $250,000 | Depends on system complexity |
| **FedRAMP Consultant** | $50,000 - $100,000 | Optional but recommended |
| **GovCloud Setup** | $10,000 | Migration, testing |
| **Staff Training** | $15,000 | FedRAMP training for team |
| **Documentation Tools** | $5,000 | SSP templates, tools |
| **Total One-Time** | **$230,000 - $380,000** | |

### Ongoing Costs

| Item | Annual Cost | Notes |
|------|-------------|-------|
| **Annual 3PAO Assessment** | $75,000 - $125,000 | Required for reauthorization |
| **GovCloud Premium** | ~10% more than commercial | AWS GovCloud pricing |
| **ConMon Tooling** | $20,000 | SIEM, vulnerability scanning |
| **Dedicated FedRAMP Staff** | $150,000 | 1 FTE for compliance |
| **Total Annual** | **$245,000 - $295,000** | |

---

## 7. Action Plan

### Phase 1: Foundation (Months 1-2)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Engage 3PAO and consultant | High | 2 weeks | Budget approval |
| Complete SOC 2 Type II | High | 2 months | In progress |
| Form FedRAMP project team | High | 1 week | None |
| Create project timeline | High | 1 week | Team formed |

**Deliverables:**
- [ ] 3PAO and consultant contracts signed
- [ ] SOC 2 Type II report received
- [ ] Project charter approved

### Phase 2: SSP Development (Months 3-6)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Draft SSP (all 325 controls) | High | 3 months | SOC 2, policies |
| Implement missing controls | High | 2 months | Gap analysis |
| Set up GovCloud environment | High | 1 month | AWS account |
| Migrate to GovCloud | High | 2 weeks | GovCloud setup |
| Collect 6 months of logs | High | 6 months | Audit logging |

**Deliverables:**
- [ ] Complete SSP draft
- [ ] GovCloud production live
- [ ] All controls implemented
- [ ] 6 months of audit evidence

### Phase 3: Assessment (Months 7-12)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| 3PAO security assessment | High | 4 months | SSP complete |
| Penetration testing | High | 2 weeks | Assessment phase |
| Vulnerability remediation | High | 1 month | Testing complete |
| SAR review and finalization | High | 1 month | Assessment done |

**Deliverables:**
- [ ] Security Assessment Report (SAR)
- [ ] POA&M
- [ ] Remediation evidence

### Phase 4: Authorization (Months 13-18)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Submit package to PMO | High | 1 week | SAR complete |
| Respond to PMO comments | High | 3 months | PMO review |
| Receive ATO | High | 1 month | PMO approval |
| Set up continuous monitoring | High | 1 month | ATO received |

**Deliverables:**
- [ ] FedRAMP ATO letter
- [ ] FedRAMP Marketplace listing
- [ ] Continuous monitoring operational

---

## 8. Success Factors

### Critical Success Factors

1. **Executive Support**: CEO/CFO commitment to 18-month timeline and budget
2. **Dedicated Resources**: 2-3 FTEs dedicated to FedRAMP for 18 months
3. **Leverage SOC 2**: Use SOC 2 as foundation (saves 3-6 months)
4. **Experienced 3PAO**: Select 3PAO with SaaS experience
5. **Early GovCloud Migration**: Migrate by Month 5 to allow evidence collection

### Common Pitfalls to Avoid

1. **Underestimating SSP effort**: 300-page SSP takes 3-4 months
2. **Late GovCloud migration**: Must migrate early for log collection
3. **Weak incident response**: IR plan must be tested and documented
4. **Poor POA&M management**: POA&M items must have clear owners/dates
5. **Incomplete evidence**: Collect evidence continuously, not at end

---

**Document Status**: Planning phase
**Author**: Compliance Team
**Last Review**: 2025-11-26
**Next Review**: Quarterly during FedRAMP journey

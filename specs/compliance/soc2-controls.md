# SOC 2 Type II Controls Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready
**Target**: SOC 2 Type II certification (6-month timeline)

---

## Executive Summary

This specification defines SOC 2 Type II controls implementation for Patriot Compliance Systems, covering:
- **5 Trust Service Criteria**: Security, Availability, Confidentiality, Processing Integrity, Privacy
- **Evidence automation** for continuous control monitoring
- **6-month certification timeline** with 3-month observation period
- **Integration with existing security architecture** (RBAC, audit logging, encryption)

---

## 1. Trust Service Criteria Overview

### 1.1 TSC Mapping

| Criteria | Focus Area | PCS Implementation | Status |
|----------|------------|-------------------|--------|
| **CC (Common Criteria)** | Organization & management, communications, risk management | Policies, procedures, org chart | Required |
| **Security (A1)** | Access controls, encryption, monitoring | RBAC, MFA, KMS, audit logs | In Progress |
| **Availability (A2)** | System uptime, DR, monitoring | Multi-AZ, backups, 99.9% SLA | In Progress |
| **Confidentiality (C1)** | Data classification, encryption | PII/PHI encryption, RLS | In Progress |
| **Processing Integrity (PI1)** | Data accuracy, validation | Input validation, idempotency | In Progress |
| **Privacy (P1)** | Notice, consent, disclosure | Privacy policy, consent flows | Planned |

---

## 2. Common Criteria (CC) Controls

### CC1: Control Environment

**Objective**: Establish organizational structure and oversight.

| Control | Description | Evidence | Frequency |
|---------|-------------|----------|-----------|
| CC1.1 | Board oversight of compliance | Board meeting minutes | Quarterly |
| CC1.2 | Management responsibility for controls | Org chart, role descriptions | Annually |
| CC1.3 | Ethical values (Code of Conduct) | Signed acknowledgments | Annually |
| CC1.4 | Accountability for performance | Performance reviews | Annually |

**Implementation**:
```markdown
# docs/policies/code-of-conduct.md

## Code of Conduct

All employees must:
1. Maintain confidentiality of client data
2. Report security incidents immediately
3. Follow password and MFA policies
4. Complete security training annually

Signed by: [Employee]
Date: [Date]
```

### CC2: Communication & Information

**Objective**: Communicate control objectives and responsibilities.

| Control | Description | Evidence | Frequency |
|---------|-------------|----------|-----------|
| CC2.1 | Internal communication of policies | Email distribution, intranet | Quarterly |
| CC2.2 | External communication (privacy policy) | Website publication | As needed |
| CC2.3 | Communication with board | Board reports | Quarterly |

### CC3: Risk Assessment

**Objective**: Identify and assess risks.

| Control | Description | Evidence | Frequency |
|---------|-------------|----------|-----------|
| CC3.1 | Risk identification | Risk register | Quarterly |
| CC3.2 | Risk assessment (likelihood, impact) | Risk matrix | Quarterly |
| CC3.3 | Mitigation strategies | Mitigation plans | Quarterly |
| CC3.4 | Fraud risk assessment | Fraud risk assessment doc | Annually |

**Implementation**:
```python
# backend/pcs/compliance/risk_register.py

RISK_REGISTER = [
    {
        'id': 'R-001',
        'title': 'Unauthorized data access',
        'likelihood': 'medium',
        'impact': 'high',
        'risk_score': 12,
        'mitigation': 'RBAC, RLS, audit logging',
        'owner': 'CISO',
        'review_date': '2025-04-01',
    },
    {
        'id': 'R-002',
        'title': 'Data breach via SQL injection',
        'likelihood': 'low',
        'impact': 'high',
        'risk_score': 8,
        'mitigation': 'Parameterized queries, input validation, WAF',
        'owner': 'Security Team',
        'review_date': '2025-04-01',
    },
    # ... more risks
]
```

### CC4: Monitoring Activities

**Objective**: Monitor controls for effectiveness.

| Control | Description | Evidence | Frequency |
|---------|-------------|----------|-----------|
| CC4.1 | Ongoing monitoring | CloudWatch dashboards | Continuous |
| CC4.2 | Separate evaluations | Internal audits | Semi-annually |
| CC4.3 | Corrective actions | Remediation tickets | As needed |

### CC5: Control Activities

**Objective**: Implement control activities.

| Control | Description | Evidence | Frequency |
|---------|-------------|----------|-----------|
| CC5.1 | Logical access controls | RBAC policies, access logs | Continuous |
| CC5.2 | Change management | GitHub pull requests | Continuous |
| CC5.3 | Vendor management | Vendor assessments | Annually |

---

## 3. Security (A1) Controls

### A1.1: Logical and Physical Access Controls

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| A1.1.1 | Multi-factor authentication | TOTP/FIDO2 for all users | MFA enrollment report | ✅ Automated |
| A1.1.2 | Role-based access control | 11 system roles, RBAC matrix | Permission audit report | ✅ Automated |
| A1.1.3 | Session timeout | 15-60 min by role | Session logs | ✅ Automated |
| A1.1.4 | Password complexity | 12+ chars, special chars | Auth config | ✅ Automated |
| A1.1.5 | Physical access controls | Badge access, visitor logs | Security logs | Manual |
| A1.1.6 | Account provisioning | Automated on hire | User creation logs | ✅ Automated |
| A1.1.7 | Account deprovisioning | Automated on termination | User disable logs | ✅ Automated |

**Evidence Automation**:
```python
# backend/pcs/compliance/evidence/access_controls.py

class AccessControlEvidenceCollector:
    """Automated evidence collection for access controls"""

    def generate_mfa_enrollment_report(self, quarter: str) -> Dict:
        """A1.1.1: MFA enrollment report"""
        from pcs.models import User

        total_users = User.objects.filter(is_active=True).count()
        mfa_users = User.objects.filter(is_active=True, mfa_enabled=True).count()

        return {
            'report_type': 'MFA Enrollment',
            'period': quarter,
            'total_users': total_users,
            'mfa_enabled': mfa_users,
            'enrollment_rate': f"{(mfa_users / total_users * 100):.1f}%",
            'target': '100%',
            'compliant': mfa_users == total_users,
            'generated_at': datetime.utcnow().isoformat(),
        }

    def generate_access_review_report(self, quarter: str) -> Dict:
        """A1.1.2: Quarterly access review"""
        from pcs.models import User, UserRole

        # Get all active users with roles
        users_with_roles = User.objects.filter(
            is_active=True
        ).prefetch_related('user_roles')

        review_data = []
        for user in users_with_roles:
            roles = [ur.system_role.name for ur in user.user_roles.all()]
            review_data.append({
                'user_email': user.email,
                'roles': roles,
                'last_login': user.last_login.isoformat() if user.last_login else None,
                'mfa_enabled': user.mfa_enabled,
                'needs_review': not user.last_login or
                               (datetime.utcnow() - user.last_login).days > 90,
            })

        return {
            'report_type': 'Quarterly Access Review',
            'period': quarter,
            'total_users': len(review_data),
            'users_needing_review': sum(1 for u in review_data if u['needs_review']),
            'details': review_data,
            'generated_at': datetime.utcnow().isoformat(),
        }

    def generate_privileged_access_report(self, quarter: str) -> Dict:
        """A1.1.2: Privileged access report"""
        from pcs.models import User

        privileged_roles = ['CompanyAdmin', 'ComplianceManager', 'SUPER_ADMIN']

        privileged_users = User.objects.filter(
            is_active=True,
            user_roles__system_role__name__in=privileged_roles
        ).distinct()

        return {
            'report_type': 'Privileged Access',
            'period': quarter,
            'privileged_users': [
                {
                    'email': u.email,
                    'roles': [ur.system_role.name for ur in u.user_roles.all()],
                    'mfa_type': u.mfa_type,
                    'last_login': u.last_login.isoformat() if u.last_login else None,
                }
                for u in privileged_users
            ],
            'total_privileged': privileged_users.count(),
            'all_have_mfa': all(u.mfa_enabled for u in privileged_users),
            'generated_at': datetime.utcnow().isoformat(),
        }
```

### A1.2: System Operations

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| A1.2.1 | Change management process | GitHub PR reviews | PR logs | ✅ Automated |
| A1.2.2 | Production deployment approval | Manager approval required | Approval logs | ✅ Automated |
| A1.2.3 | Vulnerability scanning | Snyk, AWS Inspector | Scan reports | ✅ Automated |
| A1.2.4 | Patch management | AWS managed updates | Patch logs | ✅ Automated |
| A1.2.5 | Backup procedures | Daily automated backups | Backup logs | ✅ Automated |
| A1.2.6 | Backup restoration testing | Quarterly DR drills | DR test reports | Manual |

### A1.3: Detection & Monitoring

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| A1.3.1 | Security event logging | Audit logs (7-year retention) | Audit log samples | ✅ Automated |
| A1.3.2 | Log review | CloudWatch alarms | Alert logs | ✅ Automated |
| A1.3.3 | Intrusion detection | AWS GuardDuty | GuardDuty findings | ✅ Automated |
| A1.3.4 | Security incident response | Incident response plan | Incident tickets | Manual |

---

## 4. Availability (A2) Controls

### A2.1: System Availability

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| A2.1.1 | Multi-AZ architecture | 3 AZs for all services | Infrastructure config | ✅ Automated |
| A2.1.2 | Auto-scaling | ECS auto-scaling policies | Scaling events | ✅ Automated |
| A2.1.3 | Health checks | ALB + ECS health checks | Health check logs | ✅ Automated |
| A2.1.4 | Uptime monitoring | CloudWatch synthetics | Uptime reports | ✅ Automated |
| A2.1.5 | Disaster recovery plan | DR runbook | DR test results | Manual |

**Evidence Automation**:
```python
# backend/pcs/compliance/evidence/availability.py

class AvailabilityEvidenceCollector:
    """Automated evidence collection for availability controls"""

    def generate_uptime_report(self, month: str) -> Dict:
        """A2.1.4: Monthly uptime report"""
        import boto3

        cloudwatch = boto3.client('cloudwatch')

        # Query ALB metrics
        response = cloudwatch.get_metric_statistics(
            Namespace='AWS/ApplicationELB',
            MetricName='TargetResponseTime',
            Dimensions=[{'Name': 'LoadBalancer', 'Value': 'pcs-prod-alb'}],
            StartTime=datetime.fromisoformat(f"{month}-01"),
            EndTime=datetime.fromisoformat(f"{month}-30"),
            Period=3600,
            Statistics=['Average', 'Maximum', 'SampleCount']
        )

        # Calculate uptime
        total_checks = len(response['Datapoints'])
        failed_checks = sum(1 for dp in response['Datapoints'] if dp['Average'] > 5.0)
        uptime_pct = (total_checks - failed_checks) / total_checks * 100

        return {
            'report_type': 'Monthly Uptime',
            'period': month,
            'uptime_percentage': f"{uptime_pct:.3f}%",
            'target': '99.9%',
            'compliant': uptime_pct >= 99.9,
            'total_checks': total_checks,
            'failed_checks': failed_checks,
            'average_response_time_ms': sum(dp['Average'] for dp in response['Datapoints']) / total_checks,
            'generated_at': datetime.utcnow().isoformat(),
        }
```

---

## 5. Confidentiality (C1) Controls

### C1.1: Data Classification & Protection

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| C1.1.1 | Data classification policy | PII, PHI, Confidential | Policy document | Manual |
| C1.1.2 | Encryption at rest | AWS KMS (AES-256) | Encryption config | ✅ Automated |
| C1.1.3 | Encryption in transit | TLS 1.3 | TLS config | ✅ Automated |
| C1.1.4 | PII field-level encryption | Envelope encryption | Encryption logs | ✅ Automated |
| C1.1.5 | Data retention policy | 7-year for audit logs | Retention config | ✅ Automated |
| C1.1.6 | Secure data disposal | S3 lifecycle policies | Deletion logs | ✅ Automated |

---

## 6. Processing Integrity (PI1) Controls

### PI1.1: Data Accuracy & Completeness

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| PI1.1.1 | Input validation | Zod schemas | Validation errors | ✅ Automated |
| PI1.1.2 | Idempotency controls | Redis-based idempotency | Duplicate rejection logs | ✅ Automated |
| PI1.1.3 | Data integrity checks | Database constraints | Constraint violations | ✅ Automated |
| PI1.1.4 | Error handling | Try-catch, error logging | Error logs | ✅ Automated |
| PI1.1.5 | Transaction management | DB transactions | Transaction logs | ✅ Automated |

---

## 7. Privacy (P1) Controls

### P1.1: Notice & Consent

| Control ID | Control | Implementation | Evidence | Automation |
|------------|---------|----------------|----------|------------|
| P1.1.1 | Privacy notice | Privacy policy on website | Published policy | Manual |
| P1.1.2 | Consent collection | Consent checkboxes | Consent logs | ✅ Automated |
| P1.1.3 | Data subject rights (DSAR) | DSAR request form | DSAR logs | Manual |
| P1.1.4 | Third-party disclosure | Vendor list in privacy policy | Privacy policy | Manual |

---

## 8. Evidence Collection Automation

### 8.1 Automated Evidence Script

```python
# backend/pcs/management/commands/generate_soc2_evidence.py

from django.core.management.base import BaseCommand
from pcs.compliance.evidence.access_controls import AccessControlEvidenceCollector
from pcs.compliance.evidence.availability import AvailabilityEvidenceCollector
from pcs.compliance.evidence.security import SecurityEvidenceCollector

class Command(BaseCommand):
    help = 'Generate SOC 2 evidence package for audit'

    def add_arguments(self, parser):
        parser.add_argument('--quarter', type=str, required=True, help='Quarter (e.g., 2025-Q1)')

    def handle(self, *args, **options):
        quarter = options['quarter']

        self.stdout.write(f"Generating SOC 2 evidence for {quarter}...")

        collectors = {
            'access_controls': AccessControlEvidenceCollector(),
            'availability': AvailabilityEvidenceCollector(),
            'security': SecurityEvidenceCollector(),
        }

        evidence_package = {
            'quarter': quarter,
            'generated_at': datetime.utcnow().isoformat(),
            'reports': {},
        }

        # Access control evidence
        ac_collector = collectors['access_controls']
        evidence_package['reports']['mfa_enrollment'] = ac_collector.generate_mfa_enrollment_report(quarter)
        evidence_package['reports']['access_review'] = ac_collector.generate_access_review_report(quarter)
        evidence_package['reports']['privileged_access'] = ac_collector.generate_privileged_access_report(quarter)

        # Availability evidence
        avail_collector = collectors['availability']
        for month in self._get_quarter_months(quarter):
            evidence_package['reports'][f'uptime_{month}'] = avail_collector.generate_uptime_report(month)

        # Security evidence
        sec_collector = collectors['security']
        evidence_package['reports']['vulnerability_scan'] = sec_collector.generate_vulnerability_report(quarter)
        evidence_package['reports']['security_incidents'] = sec_collector.generate_incident_report(quarter)

        # Write to S3
        import json
        import boto3

        s3 = boto3.client('s3')
        s3.put_object(
            Bucket='pcs-soc2-evidence',
            Key=f'{quarter}/evidence-package.json',
            Body=json.dumps(evidence_package, indent=2),
            ServerSideEncryption='AES256',
        )

        self.stdout.write(self.style.SUCCESS(f"Evidence package generated: s3://pcs-soc2-evidence/{quarter}/"))
```

---

## 9. SOC 2 Certification Timeline

### 6-Month Timeline

| Month | Milestone | Activities | Deliverables |
|-------|-----------|------------|--------------|
| **Month 1** | Readiness assessment | Gap analysis, control mapping | Gap analysis report |
| **Month 2** | Control implementation | Implement missing controls, document policies | Policy documents, control descriptions |
| **Month 3** | Observation period start | Begin evidence collection, monitor controls | Monthly evidence packages |
| **Month 4** | Observation continues | Continue evidence collection, internal audits | Monthly evidence packages |
| **Month 5** | Observation continues | Continue evidence collection, remediate issues | Monthly evidence packages, remediation docs |
| **Month 6** | Audit preparation | Final evidence review, auditor walkthrough | Complete evidence package |
| **Month 7** | SOC 2 Audit | Auditor testing, interviews, evidence review | SOC 2 Type II report |

### Key Activities by Phase

**Phase 1: Readiness (Month 1-2)**
- [ ] Conduct gap analysis against TSC
- [ ] Document policies and procedures
- [ ] Implement missing controls
- [ ] Set up evidence automation
- [ ] Train employees on controls

**Phase 2: Observation (Month 3-5)**
- [ ] Collect monthly evidence
- [ ] Monitor control effectiveness
- [ ] Conduct internal audits
- [ ] Remediate control failures
- [ ] Update documentation

**Phase 3: Audit (Month 6-7)**
- [ ] Prepare evidence package
- [ ] Conduct management review
- [ ] Auditor walkthroughs
- [ ] Respond to auditor requests
- [ ] Receive SOC 2 Type II report

---

## 10. Action Plan

### Phase 1: Foundation (Weeks 1-4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Document all policies | High | 2 weeks | None |
| Create control matrix | High | 1 week | Policies |
| Set up evidence automation | High | 2 weeks | Infrastructure |
| Conduct gap analysis | High | 1 week | Control matrix |

**Deliverables:**
- [ ] Complete policy library
- [ ] TSC control matrix
- [ ] Evidence automation scripts
- [ ] Gap analysis report

### Phase 2: Control Implementation (Weeks 5-8)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement missing controls | High | 3 weeks | Gap analysis |
| Set up monitoring dashboards | High | 1 week | CloudWatch |
| Train employees | Medium | 1 week | Policies |
| Conduct internal audit | Medium | 1 week | Controls |

**Deliverables:**
- [ ] All controls implemented
- [ ] Monitoring dashboards live
- [ ] Employee training records
- [ ] Internal audit report

### Phase 3: Observation Period (Weeks 9-20)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Collect monthly evidence | High | Ongoing | Automation |
| Monitor control effectiveness | High | Ongoing | Dashboards |
| Remediate control failures | High | As needed | Monitoring |
| Conduct quarterly reviews | Medium | Monthly | Evidence |

**Deliverables:**
- [ ] 3 months of evidence
- [ ] Control effectiveness reports
- [ ] Remediation documentation
- [ ] Quarterly review reports

### Phase 4: Audit Preparation (Weeks 21-24)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Compile evidence package | High | 1 week | Observation |
| Management review | High | 1 week | Evidence |
| Auditor selection | High | 1 week | None |
| Audit kickoff | High | 1 week | Auditor |

**Deliverables:**
- [ ] Complete evidence package
- [ ] Management attestation
- [ ] Auditor engagement letter
- [ ] Audit schedule

---

**Document Status**: Implementation ready
**Author**: Compliance Team
**Last Review**: 2025-11-26
**Next Review**: Monthly during observation period

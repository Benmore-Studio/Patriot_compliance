# Employee Lifecycle Module Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready

---

## Executive Summary

This specification defines the employee lifecycle management module for Patriot Compliance Systems, implementing:
- **Hybrid state machine** combining status enum + event array for performance and auditability
- **8 lifecycle states** from candidate to terminated
- **Universal compliance pattern** for all 6 compliance modules
- **Automated compliance flagging** (green/yellow/red) based on module status
- **Event-driven architecture** with Kafka for real-time updates

---

## 1. Employee Lifecycle States

### 1.1 State Machine Diagram

```
+==============================================================================+
|                        EMPLOYEE LIFECYCLE STATE MACHINE                       |
+==============================================================================+

                              ┌─────────────┐
                              │   START     │
                              └──────┬──────┘
                                     │
                                     v
                    ┌────────────────────────────────┐
                    │          CANDIDATE             │
                    │                                │
                    │  Required Actions:             │
                    │  - Background check ordered    │
                    │  - Drug test ordered           │
                    │  - DOT clearinghouse query     │
                    │  - References checked          │
                    │                                │
                    │  Triggers:                     │
                    │  - All checks clear → ONBOARDING│
                    │  - Any check fails → REJECTED  │
                    │  - FCRA violation → ADVERSE_ACTION│
                    └───────────────┬────────────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     v              │              v
        ┌─────────────────┐        │     ┌─────────────────┐
        │    REJECTED     │        │     │ ADVERSE_ACTION  │
        │                 │        │     │                 │
        │ - Failed checks │        │     │ Pre-adverse:    │
        │ - Auto-archive  │        │     │ - Notify candidate│
        │   after 90 days │        │     │ - Send findings │
        │                 │        │     │ - Wait 7 days   │
        │ Terminal state  │        │     │                 │
        └─────────────────┘        │     │ Final adverse:  │
                                   │     │ - Reject or hire│
                                   │     └────────┬────────┘
                                   │              │
                                   v              v
                    ┌────────────────────────────────┐
                    │         ONBOARDING             │
                    │                                │
                    │  Required Actions:             │
                    │  - Upload certificates         │
                    │  - Complete training           │
                    │  - Medical exam                │
                    │  - Policy acknowledgment       │
                    │  - I-9 verification            │
                    │  - Geo-fence assignment        │
                    │                                │
                    │  Triggers:                     │
                    │  - All complete → ACTIVE       │
                    │  - Timeout 30d → REJECTED      │
                    └───────────────┬────────────────┘
                                    │
                                    v
                    ┌────────────────────────────────┐
                    │           ACTIVE               │
                    │                                │
                    │  Ongoing Compliance:           │
                    │  - Random drug tests           │
                    │  - Cert expiration tracking    │
                    │  - Annual DOT query            │
                    │  - Medical recertification     │
                    │  - Geo-fence check-ins         │
                    │                                │
                    │  Compliance Flags:             │
                    │  🟢 Green = All compliant      │
                    │  🟡 Yellow = Expiring soon     │
                    │  🔴 Red = Non-compliant        │
                    │                                │
                    │  Triggers:                     │
                    │  - Violation → SUSPENDED       │
                    │  - Leave request → ON_LEAVE    │
                    │  - Resignation → TERMINATED    │
                    └───────────────┬────────────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     v              v              v
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │    SUSPENDED    │ │  ON_LEAVE       │ │  TERMINATED     │
        │                 │ │                 │ │                 │
        │ Reasons:        │ │ Types:          │ │ Types:          │
        │ - Failed test   │ │ - Medical       │ │ - Voluntary     │
        │ - Expired cert  │ │ - FMLA          │ │ - Involuntary   │
        │ - Safety violation│ │ - Personal LOA│ │ - Retired       │
        │ - DOT disqual   │ │                 │ │ - End of contract│
        │                 │ │ Return process: │ │                 │
        │ Reinstatement:  │ │ - Return date   │ │ Final actions:  │
        │ - Complete RTD  │ │ - Fitness cert  │ │ - Exit interview│
        │ - Pass drug test│ │ - Resume active │ │ - Final pay     │
        │ - Recertify     │ │   compliance    │ │ - Archive data  │
        │                 │ │                 │ │   (7-year retain)│
        │ Can → ACTIVE    │ │ Can → ACTIVE    │ │                 │
        └─────────────────┘ └─────────────────┘ │ Terminal state  │
                                                └─────────────────┘
```

### 1.2 State Definitions

```python
# backend/pcs/models/employee.py

from enum import Enum
from typing import Dict, Optional, List
from django.db import models
from django.contrib.postgres.fields import ArrayField
import uuid

class EmployeeStatus(str, Enum):
    """Employee lifecycle status"""
    CANDIDATE = "candidate"
    ONBOARDING = "onboarding"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"
    REJECTED = "rejected"
    ADVERSE_ACTION = "adverse_action"

class ComplianceFlag(str, Enum):
    """Compliance status flags"""
    GREEN = "green"     # All compliant
    YELLOW = "yellow"   # Expiring within 30 days
    RED = "red"         # Non-compliant or expired
    UNKNOWN = "unknown" # No data

class Employee(models.Model):
    """
    Employee model with hybrid status + events.

    Design pattern: Fast status lookups + complete audit trail.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    tenant_id = models.UUIDField(db_index=True)

    # Basic info
    employee_number = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    # PII (encrypted)
    ssn_encrypted = models.BinaryField(null=True)
    ssn_last_four = models.CharField(max_length=4, null=True)
    dob_encrypted = models.BinaryField(null=True)

    # Current state (O(1) lookup)
    status = models.CharField(
        max_length=20,
        choices=[(s.value, s.name) for s in EmployeeStatus],
        default=EmployeeStatus.CANDIDATE.value,
        db_index=True
    )

    # Employment dates
    hire_date = models.DateField(null=True)
    termination_date = models.DateField(null=True)
    last_working_day = models.DateField(null=True)

    # Organization structure
    division_id = models.UUIDField(null=True, db_index=True)
    location_id = models.UUIDField(null=True, db_index=True)
    employee_group_id = models.UUIDField(null=True)
    supervisor_id = models.UUIDField(null=True)
    department = models.CharField(max_length=100, null=True)
    job_title = models.CharField(max_length=100, null=True)

    # Compliance status (denormalized for performance)
    compliance_status = models.CharField(
        max_length=10,
        choices=[(f.value, f.name) for f in ComplianceFlag],
        default=ComplianceFlag.UNKNOWN.value,
        db_index=True
    )

    # Compliance data by module (JSONB for flexibility)
    compliance_data = models.JSONField(default=dict)
    """
    Structure:
    {
        "drug_alcohol": {
            "status": "green",
            "last_test": "2025-10-15",
            "next_test": "2026-01-15",
            "issues": []
        },
        "background": {
            "status": "green",
            "last_check": "2025-01-15",
            "valid_until": "2028-01-15",
            "issues": []
        },
        "dot": {
            "status": "yellow",
            "medical_cert_expires": "2025-12-20",
            "clearinghouse_query": "2025-01-15",
            "issues": ["Medical cert expiring soon"]
        },
        ...
    }
    """

    # Lifecycle events (append-only audit trail)
    lifecycle_events = ArrayField(
        models.JSONField(),
        default=list
    )
    """
    Structure:
    [
        {
            "event": "CREATED",
            "at": "2025-01-15T10:30:00Z",
            "by": "user_123",
            "data": {"source": "manual_entry"}
        },
        {
            "event": "BACKGROUND_CHECK_STARTED",
            "at": "2025-01-15T10:35:00Z",
            "by": "system",
            "data": {"vendor": "checkr", "order_id": "ord_456"}
        },
        ...
    ]
    """

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.UUIDField()
    updated_by = models.UUIDField(null=True)

    class Meta:
        db_table = 'employees'
        indexes = [
            models.Index(fields=['tenant_id', 'status']),
            models.Index(fields=['tenant_id', 'compliance_status']),
            models.Index(fields=['location_id']),
            models.Index(fields=['ssn_last_four']),
        ]

    def add_lifecycle_event(self, event: str, user_id: str, data: Optional[Dict] = None):
        """Add event to lifecycle history"""
        from datetime import datetime

        event_record = {
            "event": event,
            "at": datetime.utcnow().isoformat(),
            "by": str(user_id),
            "data": data or {}
        }

        self.lifecycle_events.append(event_record)
        self.save(update_fields=['lifecycle_events', 'updated_at'])

    def calculate_compliance_status(self) -> ComplianceFlag:
        """
        Calculate overall compliance status from module statuses.

        Priority: red > yellow > green > unknown
        """
        module_statuses = []

        for module, data in self.compliance_data.items():
            if isinstance(data, dict) and 'status' in data:
                module_statuses.append(data['status'])

        if not module_statuses:
            return ComplianceFlag.UNKNOWN

        if 'red' in module_statuses:
            return ComplianceFlag.RED
        if 'yellow' in module_statuses:
            return ComplianceFlag.YELLOW
        if all(s == 'green' for s in module_statuses):
            return ComplianceFlag.GREEN

        return ComplianceFlag.UNKNOWN

    def can_transition_to(self, new_status: EmployeeStatus) -> bool:
        """Check if transition to new status is allowed"""
        current = EmployeeStatus(self.status)

        valid_transitions = {
            EmployeeStatus.CANDIDATE: [
                EmployeeStatus.ONBOARDING,
                EmployeeStatus.REJECTED,
                EmployeeStatus.ADVERSE_ACTION,
            ],
            EmployeeStatus.ADVERSE_ACTION: [
                EmployeeStatus.ONBOARDING,
                EmployeeStatus.REJECTED,
            ],
            EmployeeStatus.ONBOARDING: [
                EmployeeStatus.ACTIVE,
                EmployeeStatus.REJECTED,
            ],
            EmployeeStatus.ACTIVE: [
                EmployeeStatus.SUSPENDED,
                EmployeeStatus.ON_LEAVE,
                EmployeeStatus.TERMINATED,
            ],
            EmployeeStatus.SUSPENDED: [
                EmployeeStatus.ACTIVE,
                EmployeeStatus.TERMINATED,
            ],
            EmployeeStatus.ON_LEAVE: [
                EmployeeStatus.ACTIVE,
                EmployeeStatus.TERMINATED,
            ],
            EmployeeStatus.TERMINATED: [],  # Terminal state
            EmployeeStatus.REJECTED: [],    # Terminal state
        }

        return new_status in valid_transitions.get(current, [])
```

---

## 2. Universal Compliance Pattern

### 2.1 Pattern Overview

All 6 compliance modules follow the same event processing pattern:

```
INGEST → PARSE → VALIDATE → STORE → FLAG → ALERT → DASHBOARD UPDATE
```

### 2.2 Compliance Event Processor

```python
# backend/pcs/compliance/processor.py

from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
from pcs.models import Employee
from pcs.compliance.policy_driver import PolicyDriver
from pcs.notifications.service import NotificationService

@dataclass
class ComplianceEvent:
    """Standardized compliance event"""
    module: str
    event_type: str
    employee_id: str
    tenant_id: str
    data: Dict[str, Any]
    timestamp: datetime
    source: str
    vendor: Optional[str] = None

class ComplianceEventProcessor:
    """
    Universal compliance event processor.

    Processes events for all 6 modules:
    - drug_alcohol
    - background
    - dot
    - health
    - training
    - geo_fencing
    """

    def __init__(self):
        self.policy_driver = PolicyDriver()
        self.notification_service = NotificationService()

    def process_event(self, event: ComplianceEvent):
        """
        Process a compliance event through the universal pattern.

        Steps:
        1. Load employee
        2. Update module-specific compliance data
        3. Run policy evaluation
        4. Calculate flag (green/yellow/red)
        5. Update employee record
        6. Generate alerts if needed
        7. Publish dashboard update
        """
        # 1. Load employee
        try:
            employee = Employee.objects.get(
                id=event.employee_id,
                tenant_id=event.tenant_id
            )
        except Employee.DoesNotExist:
            raise ValueError(f"Employee {event.employee_id} not found")

        # 2. Update module compliance data
        module_data = self._update_module_data(
            employee, event.module, event.event_type, event.data
        )

        # 3. Run policy evaluation
        policy_result = self.policy_driver.evaluate(
            tenant_id=event.tenant_id,
            module=event.module,
            employee=employee,
            event=event,
            module_data=module_data
        )

        # 4. Calculate flag
        flag = self._calculate_flag(policy_result, module_data)

        # 5. Update employee record
        employee.compliance_data[event.module] = {
            **module_data,
            'status': flag.value,
            'last_updated': datetime.utcnow().isoformat(),
        }

        # Recalculate overall compliance status
        employee.compliance_status = employee.calculate_compliance_status().value

        # Add lifecycle event
        employee.add_lifecycle_event(
            event=f"{event.module.upper()}_{event.event_type.upper()}",
            user_id="system",
            data={
                'flag': flag.value,
                'issues': policy_result.get('issues', []),
            }
        )

        employee.save()

        # 6. Generate alerts
        if flag == ComplianceFlag.RED or flag == ComplianceFlag.YELLOW:
            self._generate_alerts(employee, event.module, flag, policy_result)

        # 7. Publish dashboard update
        self._publish_dashboard_update(employee, event.module)

    def _update_module_data(
        self,
        employee: Employee,
        module: str,
        event_type: str,
        data: Dict
    ) -> Dict:
        """Update module-specific compliance data"""

        module_handlers = {
            'drug_alcohol': self._handle_drug_alcohol,
            'background': self._handle_background,
            'dot': self._handle_dot,
            'health': self._handle_health,
            'training': self._handle_training,
            'geo_fencing': self._handle_geo_fencing,
        }

        handler = module_handlers.get(module)
        if not handler:
            raise ValueError(f"Unknown module: {module}")

        return handler(employee, event_type, data)

    def _handle_drug_alcohol(
        self, employee: Employee, event_type: str, data: Dict
    ) -> Dict:
        """Handle drug/alcohol events"""
        current = employee.compliance_data.get('drug_alcohol', {})

        if event_type == 'test_completed':
            current['last_test'] = data.get('tested_at')
            current['last_result'] = data.get('result')

            if data.get('result') == 'NEGATIVE':
                # Schedule next random test (e.g., 90 days)
                next_test = datetime.fromisoformat(data['tested_at']) + timedelta(days=90)
                current['next_test'] = next_test.isoformat()
            elif data.get('result') == 'POSITIVE':
                current['issues'] = current.get('issues', []) + [
                    {
                        'type': 'positive_test',
                        'date': data.get('tested_at'),
                        'requires_action': 'RTD_PROCESS',
                    }
                ]

        elif event_type == 'mro_review_completed':
            current['mro_reviewed'] = True
            current['mro_result'] = data.get('mro_result')

        return current

    def _handle_background(
        self, employee: Employee, event_type: str, data: Dict
    ) -> Dict:
        """Handle background check events"""
        current = employee.compliance_data.get('background', {})

        if event_type == 'screening_completed':
            current['last_check'] = data.get('completed_at')
            current['result'] = data.get('result')

            if data.get('result') == 'CONSIDER':
                current['requires_adjudication'] = True
                current['findings'] = data.get('findings', [])
            elif data.get('result') == 'CLEAR':
                # Valid for 3 years
                valid_until = datetime.fromisoformat(data['completed_at']) + timedelta(days=365*3)
                current['valid_until'] = valid_until.isoformat()

        elif event_type == 'adjudication_completed':
            current['adjudication_decision'] = data.get('decision')
            current['requires_adjudication'] = False

        return current

    def _handle_dot(
        self, employee: Employee, event_type: str, data: Dict
    ) -> Dict:
        """Handle DOT compliance events"""
        current = employee.compliance_data.get('dot', {})

        if event_type == 'medical_cert_uploaded':
            current['medical_cert_expires'] = data.get('expires_at')

        elif event_type == 'clearinghouse_query_completed':
            current['last_clearinghouse_query'] = data.get('queried_at')
            current['clearinghouse_result'] = data.get('result')

            if data.get('result') == 'HIT':
                current['issues'] = current.get('issues', []) + [
                    {
                        'type': 'clearinghouse_violation',
                        'date': data.get('queried_at'),
                        'requires_action': 'REVIEW_VIOLATION',
                    }
                ]

        return current

    def _handle_health(
        self, employee: Employee, event_type: str, data: Dict
    ) -> Dict:
        """Handle occupational health events"""
        current = employee.compliance_data.get('health', {})

        if event_type == 'exam_completed':
            current['last_exam'] = data.get('exam_date')
            current['next_exam'] = data.get('next_due')
            current['cleared_for_work'] = data.get('cleared', True)

        return current

    def _handle_training(
        self, employee: Employee, event_type: str, data: Dict
    ) -> Dict:
        """Handle training/certification events"""
        current = employee.compliance_data.get('training', {})

        if 'certificates' not in current:
            current['certificates'] = []

        if event_type == 'cert_uploaded':
            current['certificates'].append({
                'name': data.get('cert_name'),
                'issued': data.get('issued_at'),
                'expires': data.get('expires_at'),
                'status': 'VALID',
            })

        return current

    def _handle_geo_fencing(
        self, employee: Employee, event_type: str, data: Dict
    ) -> Dict:
        """Handle geo-fencing events"""
        current = employee.compliance_data.get('geo_fencing', {})

        if event_type == 'checkin_recorded':
            current['last_checkin'] = data.get('checked_in_at')
            current['current_zone'] = data.get('zone_id')

        return current

    def _calculate_flag(
        self, policy_result: Dict, module_data: Dict
    ) -> ComplianceFlag:
        """
        Calculate compliance flag based on policy result.

        Rules:
        - Red: Non-compliant, expired, or failed
        - Yellow: Expiring within 30 days
        - Green: Compliant
        """
        if policy_result.get('non_compliant'):
            return ComplianceFlag.RED

        if policy_result.get('expiring_soon'):
            return ComplianceFlag.YELLOW

        if policy_result.get('compliant'):
            return ComplianceFlag.GREEN

        return ComplianceFlag.UNKNOWN

    def _generate_alerts(
        self,
        employee: Employee,
        module: str,
        flag: ComplianceFlag,
        policy_result: Dict
    ):
        """Generate alerts for compliance issues"""
        issues = policy_result.get('issues', [])

        for issue in issues:
            self.notification_service.send_alert(
                tenant_id=employee.tenant_id,
                employee_id=employee.id,
                module=module,
                severity=flag.value,
                issue_type=issue.get('type'),
                message=issue.get('message'),
                recipients=issue.get('recipients', []),
            )

    def _publish_dashboard_update(self, employee: Employee, module: str):
        """Publish real-time dashboard update via SSE"""
        from pcs.realtime.publisher import DashboardPublisher

        publisher = DashboardPublisher()
        publisher.publish_compliance_update(
            tenant_id=employee.tenant_id,
            employee_id=employee.id,
            module=module,
            status=employee.compliance_status,
            data=employee.compliance_data.get(module, {}),
        )
```

---

## 3. Policy Driver

### 3.1 Policy Evaluation Engine

```python
# backend/pcs/compliance/policy_driver.py

from typing import Dict, Any, List
from datetime import datetime, timedelta
from pcs.models import Employee, TenantPolicy

class PolicyDriver:
    """
    Policy evaluation engine for compliance rules.

    Evaluates tenant-specific policies against compliance events.
    """

    def evaluate(
        self,
        tenant_id: str,
        module: str,
        employee: Employee,
        event: Any,
        module_data: Dict
    ) -> Dict[str, Any]:
        """
        Evaluate policies for a compliance event.

        Returns:
        {
            'compliant': bool,
            'non_compliant': bool,
            'expiring_soon': bool,
            'issues': [
                {
                    'type': 'expired_cert',
                    'message': 'Medical certificate expired',
                    'severity': 'high',
                    'requires_action': 'UPLOAD_NEW_CERT',
                    'recipients': ['SafetyManager', 'DER'],
                }
            ]
        }
        """
        # Load tenant policies for module
        policies = self._load_policies(tenant_id, module)

        # Run policy checks
        issues = []
        for policy in policies:
            policy_issues = self._check_policy(
                policy, employee, event, module_data
            )
            issues.extend(policy_issues)

        # Determine compliance status
        result = {
            'compliant': len(issues) == 0,
            'non_compliant': any(i['severity'] == 'high' for i in issues),
            'expiring_soon': any(i['severity'] == 'medium' for i in issues),
            'issues': issues,
        }

        return result

    def _load_policies(self, tenant_id: str, module: str) -> List[Dict]:
        """Load active policies for tenant and module"""
        policies = TenantPolicy.objects.filter(
            tenant_id=tenant_id,
            module=module,
            is_active=True
        )

        return [p.policy_definition for p in policies]

    def _check_policy(
        self,
        policy: Dict,
        employee: Employee,
        event: Any,
        module_data: Dict
    ) -> List[Dict]:
        """Check a specific policy"""
        policy_type = policy.get('type')

        handlers = {
            'expiration_check': self._check_expiration,
            'frequency_check': self._check_frequency,
            'result_check': self._check_result,
            'requirement_check': self._check_requirement,
        }

        handler = handlers.get(policy_type)
        if not handler:
            return []

        return handler(policy, employee, event, module_data)

    def _check_expiration(
        self, policy: Dict, employee: Employee, event: Any, module_data: Dict
    ) -> List[Dict]:
        """Check for expiring items"""
        issues = []
        field = policy.get('field')
        warning_days = policy.get('warning_days', 30)

        expires_at_str = module_data.get(field)
        if not expires_at_str:
            return issues

        expires_at = datetime.fromisoformat(expires_at_str)
        now = datetime.utcnow()
        days_until_expiry = (expires_at - now).days

        if days_until_expiry < 0:
            issues.append({
                'type': 'expired',
                'field': field,
                'message': f"{field.replace('_', ' ').title()} has expired",
                'severity': 'high',
                'expired_at': expires_at_str,
                'requires_action': policy.get('action_on_expired'),
                'recipients': policy.get('notify_roles', []),
            })
        elif days_until_expiry <= warning_days:
            issues.append({
                'type': 'expiring_soon',
                'field': field,
                'message': f"{field.replace('_', ' ').title()} expires in {days_until_expiry} days",
                'severity': 'medium',
                'expires_at': expires_at_str,
                'requires_action': policy.get('action_on_expiring'),
                'recipients': policy.get('notify_roles', []),
            })

        return issues

    def _check_frequency(
        self, policy: Dict, employee: Employee, event: Any, module_data: Dict
    ) -> List[Dict]:
        """Check frequency requirements (e.g., annual DOT query)"""
        issues = []
        field = policy.get('field')
        required_interval_days = policy.get('interval_days')

        last_date_str = module_data.get(field)
        if not last_date_str:
            issues.append({
                'type': 'missing_required',
                'field': field,
                'message': f"{field.replace('_', ' ').title()} has never been completed",
                'severity': 'high',
                'requires_action': policy.get('action_on_missing'),
                'recipients': policy.get('notify_roles', []),
            })
            return issues

        last_date = datetime.fromisoformat(last_date_str)
        now = datetime.utcnow()
        days_since = (now - last_date).days

        if days_since > required_interval_days:
            issues.append({
                'type': 'overdue',
                'field': field,
                'message': f"{field.replace('_', ' ').title()} is overdue (last: {days_since} days ago)",
                'severity': 'high',
                'last_completed': last_date_str,
                'requires_action': policy.get('action_on_overdue'),
                'recipients': policy.get('notify_roles', []),
            })

        return issues

    def _check_result(
        self, policy: Dict, employee: Employee, event: Any, module_data: Dict
    ) -> List[Dict]:
        """Check test/screening results"""
        issues = []
        field = policy.get('field')
        unacceptable_values = policy.get('unacceptable_values', [])

        result = module_data.get(field)
        if result in unacceptable_values:
            issues.append({
                'type': 'unacceptable_result',
                'field': field,
                'message': policy.get('message', f"{field} result is unacceptable: {result}"),
                'severity': 'high',
                'result': result,
                'requires_action': policy.get('action_on_unacceptable'),
                'recipients': policy.get('notify_roles', []),
            })

        return issues

    def _check_requirement(
        self, policy: Dict, employee: Employee, event: Any, module_data: Dict
    ) -> List[Dict]:
        """Check if required items are present"""
        issues = []
        required_fields = policy.get('required_fields', [])

        for field in required_fields:
            if not module_data.get(field):
                issues.append({
                    'type': 'missing_required',
                    'field': field,
                    'message': f"Required: {field.replace('_', ' ').title()}",
                    'severity': 'high',
                    'requires_action': policy.get('action_on_missing'),
                    'recipients': policy.get('notify_roles', []),
                })

        return issues
```

---

## 4. Action Plan

### Phase 1: Data Models (Week 1)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create Employee model | High | 1 day | PostgreSQL |
| Implement lifecycle events | High | 1 day | Employee model |
| Create compliance_data JSONB | High | 0.5 days | Employee model |
| Add state transition validation | Medium | 1 day | Employee model |

**Deliverables:**
- [ ] Employee model with hybrid status + events
- [ ] JSONB compliance data structure
- [ ] State machine validation

### Phase 2: Event Processing (Week 2)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement ComplianceEventProcessor | High | 2 days | Employee model |
| Create module-specific handlers | High | 2 days | Processor |
| Implement flag calculation | High | 1 day | Handlers |
| Add lifecycle event tracking | Medium | 0.5 days | Processor |

**Deliverables:**
- [ ] Universal compliance pattern working
- [ ] All 6 module handlers implemented
- [ ] Flag calculation tested

### Phase 3: Policy Driver (Week 3)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create PolicyDriver | High | 2 days | Event processor |
| Implement policy types | High | 2 days | PolicyDriver |
| Add tenant policy management | Medium | 1 day | PolicyDriver |
| Test policy evaluation | High | 1 day | All components |

**Deliverables:**
- [ ] Policy driver evaluating rules
- [ ] 4 policy types implemented
- [ ] Tenant-specific policies working

### Phase 4: Integration (Week 4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Integrate with Kafka | High | 1 day | Kafka setup |
| Add real-time dashboard updates | High | 1 day | SSE/WebSocket |
| Implement alert generation | Medium | 1 day | Notification service |
| End-to-end testing | High | 2 days | All components |

**Deliverables:**
- [ ] Event-driven architecture working
- [ ] Real-time updates to frontend
- [ ] Alert notifications sending
- [ ] Full compliance flow tested

---

**Document Status**: Implementation ready
**Author**: Architecture Team
**Last Review**: 2025-11-26
**Next Review**: Post Phase 1 implementation

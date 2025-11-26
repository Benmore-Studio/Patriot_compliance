# Security Architecture Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready
**Compliance**: FedRAMP Moderate, SOC 2 Type II, HIPAA, PCI DSS SAQ-A

---

## Executive Summary

This specification defines the security architecture for Patriot Compliance Systems, implementing:
- **Hybrid RBAC** with 11 system roles across dual-portal model
- **Row-Level Security (RLS)** policies for multi-tier tenant isolation
- **Dual-control workflows** for sensitive operations (PII exports, adjudication)
- **MFA enforcement** with FIDO2 for admins, TOTP for others
- **Immutable audit logging** with 7-year retention (FedRAMP AU-2, AU-11)

---

## Architecture Overview

```
+==============================================================================+
|                        SECURITY ARCHITECTURE LAYERS                           |
+==============================================================================+

┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: PERIMETER SECURITY                                                  │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ CloudFront     │ │ AWS WAF        │ │ Shield Adv.    │ │ GuardDuty      │ │
│ │ (TLS 1.3 only) │ │ (OWASP rules)  │ │ (DDoS protect) │ │ (Threat detect)│ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    v
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: APPLICATION SECURITY                                                │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ Rate Limiting  │ │ JWT Validation │ │ RBAC Check     │ │ Input Validate │ │
│ │ (100 req/min)  │ │ (RS256 + exp)  │ │ (11 roles)     │ │ (Zod schemas)  │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
│                                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ MFA Verify     │ │ Dual-Control   │ │ Idempotency    │ │ CSRF Protect   │ │
│ │ (FIDO2/TOTP)   │ │ (2nd approver) │ │ (24h dedup)    │ │ (SameSite)     │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    v
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: DATA SECURITY                                                       │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ Tenant RLS     │ │ Division RLS   │ │ Location RLS   │ │ Own-Record RLS │ │
│ │ (tenant_id)    │ │ (division_id)  │ │ (location_id)  │ │ (employee_id)  │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
│                                                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ Field Masking  │ │ Envelope Enc.  │ │ TLS 1.3        │ │ KMS Encryption │ │
│ │ (SSN/DOB/PHI)  │ │ (PII fields)   │ │ (in transit)   │ │ (at rest)      │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    v
┌──────────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: AUDIT & MONITORING                                                  │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ Audit Logs     │ │ Access Logs    │ │ Security Alerts│ │ SIEM Integrate │ │
│ │ (7-year retain)│ │ (CloudWatch)   │ │ (SNS/PagerDuty)│ │ (Splunk/Sumo)  │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Hybrid RBAC Implementation

### 1.1 Dual-Portal Role Model

```
+==============================================================================+
|                         DUAL-PORTAL RBAC MODEL                               |
+==============================================================================+

┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│     SERVICE COMPANY PORTAL          │  │    COMPLIANCE COMPANY PORTAL        │
│     (Tenant Operations)             │  │    (Audit & Oversight)              │
│                                     │  │                                     │
│  ┌───────────────────────────────┐  │  │  ┌───────────────────────────────┐  │
│  │ TIER 1: Full Admin            │  │  │  │ TIER 1: Full Admin            │  │
│  │ ┌───────────────────────────┐ │  │  │  │ ┌───────────────────────────┐ │  │
│  │ │ CompanyAdmin              │ │  │  │  │ │ ComplianceManager         │ │  │
│  │ │ - Full tenant control     │ │  │  │  │ │ - All service companies   │ │  │
│  │ │ - RBAC configuration      │ │  │  │  │ │ - Policy activation       │ │  │
│  │ │ - User management         │ │  │  │  │ │ - PII export authority    │ │  │
│  │ └───────────────────────────┘ │  │  │  │ └───────────────────────────┘ │  │
│  └───────────────────────────────┘  │  │  └───────────────────────────────┘  │
│                                     │  │                                     │
│  ┌───────────────────────────────┐  │  │  ┌───────────────────────────────┐  │
│  │ TIER 2: Module Managers       │  │  │  │ TIER 2: Audit Management      │  │
│  │ ┌─────────────────────────┐   │  │  │  │ ┌─────────────────────────┐   │  │
│  │ │ SafetyManager           │   │  │  │  │ │ AuditManager            │   │  │
│  │ │ - Compliance oversight  │   │  │  │  │ │ - Close audits          │   │  │
│  │ │ - Approve certifications│   │  │  │  │ │ - Approve exports       │   │  │
│  │ └─────────────────────────┘   │  │  │  │ └─────────────────────────┘   │  │
│  │ ┌─────────────────────────┐   │  │  │  │ ┌─────────────────────────┐   │  │
│  │ │ DER (DOT Representative)│   │  │  │  │ │ SeniorAuditor           │   │  │
│  │ │ - DOT module admin      │   │  │  │  │ │ - Initiate audits       │   │  │
│  │ │ - Clearinghouse actions │   │  │  │  │ │ - Request corrections   │   │  │
│  │ └─────────────────────────┘   │  │  │  │ └─────────────────────────┘   │  │
│  └───────────────────────────────┘  │  │  └───────────────────────────────┘  │
│                                     │  │                                     │
│  ┌───────────────────────────────┐  │  │  ┌───────────────────────────────┐  │
│  │ TIER 3: Operational           │  │  │  │ TIER 3: Read-Only             │  │
│  │ ┌─────────────────────────┐   │  │  │  │ ┌─────────────────────────┐   │  │
│  │ │ SiteSupervisor          │   │  │  │  │ │ Auditor                 │   │  │
│  │ │ - Location-scoped       │   │  │  │  │ │ - View + export         │   │  │
│  │ │ - Team management       │   │  │  │  │ │ - Need-to-know logging  │   │  │
│  │ └─────────────────────────┘   │  │  │  │ └─────────────────────────┘   │  │
│  │ ┌─────────────────────────┐   │  │  │  └───────────────────────────────┘  │
│  │ │ HROnboarding            │   │  │  │                                     │
│  │ │ - Roster management     │   │  │  └─────────────────────────────────────┘
│  │ │ - New hire processing   │   │  │
│  │ └─────────────────────────┘   │  │
│  │ ┌─────────────────────────┐   │  │
│  │ │ BillingAdmin            │   │  │
│  │ │ - Subscription only     │   │  │
│  │ └─────────────────────────┘   │  │
│  │ ┌─────────────────────────┐   │  │
│  │ │ ReadOnlyAuditor         │   │  │
│  │ │ - View + export only    │   │  │
│  │ └─────────────────────────┘   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 1.2 Database Schema

```sql
-- RBAC System Tables (public schema)

-- System roles (fixed, code-referenced)
CREATE TABLE public.rbac_system_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    portal VARCHAR(30) NOT NULL CHECK (portal IN ('service_company', 'compliance_company')),
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 3),
    description TEXT,
    default_session_timeout_minutes INTEGER DEFAULT 60,
    requires_mfa BOOLEAN DEFAULT TRUE,
    mfa_type VARCHAR(20) DEFAULT 'totp' CHECK (mfa_type IN ('totp', 'fido2', 'any')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert system roles
INSERT INTO public.rbac_system_roles (name, portal, tier, description, default_session_timeout_minutes, mfa_type) VALUES
-- Service Company Portal
('CompanyAdmin', 'service_company', 1, 'Full tenant administrator', 15, 'fido2'),
('SafetyManager', 'service_company', 2, 'Safety and compliance oversight', 30, 'any'),
('DER', 'service_company', 2, 'Designated Employer Representative for DOT', 30, 'any'),
('SiteSupervisor', 'service_company', 3, 'Location-scoped supervisor', 60, 'totp'),
('HROnboarding', 'service_company', 3, 'HR and onboarding specialist', 60, 'totp'),
('BillingAdmin', 'service_company', 3, 'Billing and subscription management', 60, 'totp'),
('ReadOnlyAuditor', 'service_company', 3, 'Read-only audit access', 60, 'totp'),
-- Compliance Company Portal
('ComplianceManager', 'compliance_company', 1, 'Full compliance oversight', 15, 'fido2'),
('AuditManager', 'compliance_company', 2, 'Audit management and approval', 30, 'any'),
('SeniorAuditor', 'compliance_company', 2, 'Senior auditor with initiation rights', 60, 'totp'),
('Auditor', 'compliance_company', 3, 'Standard auditor view access', 60, 'totp');

-- Tenant display labels (customizable per tenant)
CREATE TABLE public.rbac_display_labels (
    id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    system_role_id INTEGER NOT NULL REFERENCES rbac_system_roles(id),
    display_label VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, system_role_id)
);

-- Permission definitions
CREATE TABLE public.rbac_permissions (
    id SERIAL PRIMARY KEY,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN (
        'view', 'create', 'edit', 'delete', 'approve', 'export', 'configure', 'assign'
    )),
    description TEXT,
    requires_mfa BOOLEAN DEFAULT FALSE,
    requires_dual_control BOOLEAN DEFAULT FALSE,
    audit_level VARCHAR(20) DEFAULT 'standard' CHECK (audit_level IN ('minimal', 'standard', 'detailed')),
    UNIQUE(resource, action)
);

-- Role-permission assignments
CREATE TABLE public.rbac_role_permissions (
    id SERIAL PRIMARY KEY,
    system_role_id INTEGER NOT NULL REFERENCES rbac_system_roles(id),
    permission_id INTEGER NOT NULL REFERENCES rbac_permissions(id),
    scope_type VARCHAR(30) DEFAULT 'tenant' CHECK (scope_type IN (
        'tenant', 'division', 'location', 'own_record'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(system_role_id, permission_id)
);

-- User role assignments
CREATE TABLE tenant_template.user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    system_role_id INTEGER NOT NULL REFERENCES public.rbac_system_roles(id),

    -- Scope restrictions (null = full access within scope_type)
    division_id UUID,
    location_ids UUID[],
    employee_group_id UUID,

    -- Assignment metadata
    assigned_by UUID NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,

    UNIQUE(user_id, system_role_id)
);
```

### 1.3 Permission Matrix Implementation

```python
# backend/pcs/rbac/permissions.py

from enum import Enum
from typing import Dict, List, Optional, Set
from dataclasses import dataclass
from django.core.cache import cache

class Resource(Enum):
    DASHBOARD = "dashboard"
    ROSTER = "roster"
    DRUG_ALCOHOL = "drug_alcohol"
    BACKGROUND = "background"
    DOT = "dot"
    HEALTH = "health"
    TRAINING = "training"
    GEO_FENCING = "geo_fencing"
    REPORTS = "reports"
    SETTINGS = "settings"
    BILLING = "billing"
    AUDIT = "audit"

class Action(Enum):
    VIEW = "view"
    CREATE = "create"
    EDIT = "edit"
    DELETE = "delete"
    APPROVE = "approve"
    EXPORT = "export"
    CONFIGURE = "configure"
    ASSIGN = "assign"

class ScopeType(Enum):
    TENANT = "tenant"           # Full tenant access
    DIVISION = "division"       # Division-scoped
    LOCATION = "location"       # Location-scoped
    OWN_RECORD = "own_record"   # Own employee record only

@dataclass
class Permission:
    resource: Resource
    action: Action
    scope_type: ScopeType
    requires_mfa: bool = False
    requires_dual_control: bool = False

# Complete permission matrix
PERMISSION_MATRIX: Dict[str, Dict[str, List[Permission]]] = {
    # SERVICE COMPANY PORTAL
    "CompanyAdmin": {
        "dashboard": [
            Permission(Resource.DASHBOARD, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.DASHBOARD, Action.EXPORT, ScopeType.TENANT),
            Permission(Resource.DASHBOARD, Action.CONFIGURE, ScopeType.TENANT),
        ],
        "roster": [
            Permission(Resource.ROSTER, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.ROSTER, Action.CREATE, ScopeType.TENANT),
            Permission(Resource.ROSTER, Action.EDIT, ScopeType.TENANT),
            Permission(Resource.ROSTER, Action.DELETE, ScopeType.TENANT, requires_mfa=True),
            Permission(Resource.ROSTER, Action.APPROVE, ScopeType.TENANT),
            Permission(Resource.ROSTER, Action.EXPORT, ScopeType.TENANT, requires_dual_control=True),
        ],
        "drug_alcohol": [
            Permission(Resource.DRUG_ALCOHOL, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.DRUG_ALCOHOL, Action.CREATE, ScopeType.TENANT),
            Permission(Resource.DRUG_ALCOHOL, Action.APPROVE, ScopeType.TENANT),
            Permission(Resource.DRUG_ALCOHOL, Action.EXPORT, ScopeType.TENANT),
        ],
        "background": [
            Permission(Resource.BACKGROUND, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.BACKGROUND, Action.CREATE, ScopeType.TENANT),
            Permission(Resource.BACKGROUND, Action.EDIT, ScopeType.TENANT),
            Permission(Resource.BACKGROUND, Action.APPROVE, ScopeType.TENANT, requires_dual_control=True),
            Permission(Resource.BACKGROUND, Action.EXPORT, ScopeType.TENANT),
        ],
        "dot": [
            Permission(Resource.DOT, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.DOT, Action.CREATE, ScopeType.TENANT),
            Permission(Resource.DOT, Action.APPROVE, ScopeType.TENANT),
            Permission(Resource.DOT, Action.EXPORT, ScopeType.TENANT, requires_dual_control=True),
            Permission(Resource.DOT, Action.CONFIGURE, ScopeType.TENANT),
        ],
        "settings": [
            Permission(Resource.SETTINGS, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.SETTINGS, Action.CONFIGURE, ScopeType.TENANT, requires_mfa=True),
        ],
    },

    "SafetyManager": {
        "dashboard": [
            Permission(Resource.DASHBOARD, Action.VIEW, ScopeType.DIVISION),
            Permission(Resource.DASHBOARD, Action.EXPORT, ScopeType.DIVISION),
            Permission(Resource.DASHBOARD, Action.CONFIGURE, ScopeType.DIVISION),
        ],
        "roster": [
            Permission(Resource.ROSTER, Action.VIEW, ScopeType.DIVISION),
            Permission(Resource.ROSTER, Action.CREATE, ScopeType.DIVISION),
            Permission(Resource.ROSTER, Action.EDIT, ScopeType.DIVISION),
            Permission(Resource.ROSTER, Action.APPROVE, ScopeType.DIVISION),
            Permission(Resource.ROSTER, Action.EXPORT, ScopeType.DIVISION),
        ],
        "drug_alcohol": [
            Permission(Resource.DRUG_ALCOHOL, Action.VIEW, ScopeType.DIVISION),
            Permission(Resource.DRUG_ALCOHOL, Action.APPROVE, ScopeType.DIVISION),
            Permission(Resource.DRUG_ALCOHOL, Action.EXPORT, ScopeType.DIVISION),
        ],
        "training": [
            Permission(Resource.TRAINING, Action.VIEW, ScopeType.DIVISION),
            Permission(Resource.TRAINING, Action.CREATE, ScopeType.DIVISION),
            Permission(Resource.TRAINING, Action.EDIT, ScopeType.DIVISION),
            Permission(Resource.TRAINING, Action.APPROVE, ScopeType.DIVISION),
            Permission(Resource.TRAINING, Action.EXPORT, ScopeType.DIVISION),
        ],
    },

    "DER": {
        "dashboard": [
            Permission(Resource.DASHBOARD, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.DASHBOARD, Action.EXPORT, ScopeType.TENANT),
        ],
        "roster": [
            Permission(Resource.ROSTER, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.ROSTER, Action.EXPORT, ScopeType.TENANT),
        ],
        "drug_alcohol": [
            Permission(Resource.DRUG_ALCOHOL, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.DRUG_ALCOHOL, Action.APPROVE, ScopeType.TENANT),
            Permission(Resource.DRUG_ALCOHOL, Action.EXPORT, ScopeType.TENANT),
        ],
        "dot": [
            Permission(Resource.DOT, Action.VIEW, ScopeType.TENANT),
            Permission(Resource.DOT, Action.CREATE, ScopeType.TENANT),
            Permission(Resource.DOT, Action.APPROVE, ScopeType.TENANT),
            Permission(Resource.DOT, Action.EXPORT, ScopeType.TENANT),
            Permission(Resource.DOT, Action.CONFIGURE, ScopeType.TENANT),
        ],
    },

    "SiteSupervisor": {
        "dashboard": [
            Permission(Resource.DASHBOARD, Action.VIEW, ScopeType.LOCATION),
            Permission(Resource.DASHBOARD, Action.EXPORT, ScopeType.LOCATION),
        ],
        "roster": [
            Permission(Resource.ROSTER, Action.VIEW, ScopeType.LOCATION),
            Permission(Resource.ROSTER, Action.CREATE, ScopeType.LOCATION),
            Permission(Resource.ROSTER, Action.EDIT, ScopeType.LOCATION),
            Permission(Resource.ROSTER, Action.EXPORT, ScopeType.LOCATION),
        ],
        "training": [
            Permission(Resource.TRAINING, Action.VIEW, ScopeType.LOCATION),
            Permission(Resource.TRAINING, Action.CREATE, ScopeType.LOCATION),
            Permission(Resource.TRAINING, Action.EDIT, ScopeType.LOCATION),
            Permission(Resource.TRAINING, Action.EXPORT, ScopeType.LOCATION),
        ],
        "geo_fencing": [
            Permission(Resource.GEO_FENCING, Action.VIEW, ScopeType.LOCATION),
            Permission(Resource.GEO_FENCING, Action.CREATE, ScopeType.LOCATION),
            Permission(Resource.GEO_FENCING, Action.EDIT, ScopeType.LOCATION),
            Permission(Resource.GEO_FENCING, Action.ASSIGN, ScopeType.LOCATION),
            Permission(Resource.GEO_FENCING, Action.EXPORT, ScopeType.LOCATION),
        ],
    },

    # ... (similar definitions for other roles)
}


class RBACService:
    """
    RBAC service for permission checking.

    Features:
    - Role-based permission lookup
    - Scope-aware access control
    - Caching for performance
    - Audit logging integration
    """

    CACHE_TTL = 300  # 5 minutes

    def __init__(self, user_context: dict):
        self.user_context = user_context
        self.user_id = user_context.get('user_id')
        self.tenant_id = user_context.get('tenant_id')
        self.role = user_context.get('system_role')
        self.division_id = user_context.get('division_id')
        self.location_ids = user_context.get('location_ids', [])

    def has_permission(
        self,
        resource: Resource,
        action: Action,
        target_scope: Optional[dict] = None
    ) -> bool:
        """
        Check if user has permission for resource.action.

        Args:
            resource: The resource being accessed
            action: The action being performed
            target_scope: Optional scope of target (e.g., {'location_id': 'loc_123'})
        """
        # Get permissions for role
        role_permissions = self._get_role_permissions()

        # Find matching permission
        resource_perms = role_permissions.get(resource.value, [])
        matching_perm = None

        for perm in resource_perms:
            if perm.action == action:
                matching_perm = perm
                break

        if not matching_perm:
            return False

        # Check scope
        if not self._check_scope(matching_perm.scope_type, target_scope):
            return False

        return True

    def check_permission(
        self,
        resource: Resource,
        action: Action,
        target_scope: Optional[dict] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Check permission and return (allowed, reason).

        Also returns whether MFA or dual-control is required.
        """
        if not self.has_permission(resource, action, target_scope):
            return False, "Permission denied"

        # Get permission details
        role_permissions = self._get_role_permissions()
        resource_perms = role_permissions.get(resource.value, [])

        for perm in resource_perms:
            if perm.action == action:
                if perm.requires_mfa:
                    if not self.user_context.get('mfa_verified'):
                        return False, "MFA verification required"

                if perm.requires_dual_control:
                    return True, "dual_control_required"

        return True, None

    def _get_role_permissions(self) -> Dict[str, List[Permission]]:
        """Get permissions for user's role with caching"""
        cache_key = f"rbac:permissions:{self.role}"
        cached = cache.get(cache_key)

        if cached:
            return cached

        permissions = PERMISSION_MATRIX.get(self.role, {})
        cache.set(cache_key, permissions, self.CACHE_TTL)

        return permissions

    def _check_scope(self, scope_type: ScopeType, target_scope: Optional[dict]) -> bool:
        """Check if user's scope allows access to target"""
        if scope_type == ScopeType.TENANT:
            return True  # Tenant-wide access

        if scope_type == ScopeType.DIVISION:
            if not target_scope:
                return True  # No target scope means listing
            target_division = target_scope.get('division_id')
            return target_division == self.division_id or target_division is None

        if scope_type == ScopeType.LOCATION:
            if not target_scope:
                return True
            target_location = target_scope.get('location_id')
            return target_location in self.location_ids or target_location is None

        if scope_type == ScopeType.OWN_RECORD:
            if not target_scope:
                return False  # Must specify target
            target_employee = target_scope.get('employee_id')
            return target_employee == self.user_context.get('employee_id')

        return False
```

---

## 2. Row-Level Security (RLS) Policies

### 2.1 Multi-Tier RLS Implementation

```sql
-- Enable RLS on all data tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE drug_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dot_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Session context functions
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.tenant_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.user_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_role() RETURNS VARCHAR AS $$
    SELECT current_setting('app.user_role', true);
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_division_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.division_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_location_ids() RETURNS UUID[] AS $$
    SELECT CASE
        WHEN current_setting('app.location_ids', true) = '' THEN NULL
        ELSE string_to_array(current_setting('app.location_ids', true), ',')::UUID[]
    END;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_employee_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.employee_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- TIER 1: Tenant Isolation (always applies)
CREATE POLICY tenant_isolation ON employees
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation ON drug_tests
    USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation ON background_checks
    USING (tenant_id = current_tenant_id());

-- TIER 2: Division Scoping (for SafetyManager)
CREATE POLICY division_scope ON employees
    FOR SELECT
    USING (
        current_user_role() NOT IN ('SafetyManager')
        OR current_division_id() IS NULL
        OR division_id = current_division_id()
    );

CREATE POLICY division_scope ON drug_tests
    FOR SELECT
    USING (
        current_user_role() NOT IN ('SafetyManager')
        OR current_division_id() IS NULL
        OR employee_id IN (
            SELECT id FROM employees WHERE division_id = current_division_id()
        )
    );

-- TIER 3: Location Scoping (for SiteSupervisor)
CREATE POLICY location_scope ON employees
    FOR SELECT
    USING (
        current_user_role() NOT IN ('SiteSupervisor')
        OR current_location_ids() IS NULL
        OR location_id = ANY(current_location_ids())
    );

CREATE POLICY location_scope ON training_records
    FOR SELECT
    USING (
        current_user_role() NOT IN ('SiteSupervisor')
        OR current_location_ids() IS NULL
        OR employee_id IN (
            SELECT id FROM employees WHERE location_id = ANY(current_location_ids())
        )
    );

CREATE POLICY location_scope ON geo_checkins
    FOR SELECT
    USING (
        current_user_role() NOT IN ('SiteSupervisor')
        OR current_location_ids() IS NULL
        OR zone_id IN (
            SELECT id FROM geo_zones WHERE location_id = ANY(current_location_ids())
        )
    );

-- TIER 4: Own Record (for FieldWorker via PCS Pass)
CREATE POLICY own_record ON employees
    FOR SELECT
    USING (
        current_user_role() != 'FieldWorker'
        OR id = current_employee_id()
    );

CREATE POLICY own_record ON training_records
    FOR SELECT
    USING (
        current_user_role() != 'FieldWorker'
        OR employee_id = current_employee_id()
    );

CREATE POLICY own_record ON geo_checkins
    FOR SELECT
    USING (
        current_user_role() != 'FieldWorker'
        OR employee_id = current_employee_id()
    );

-- Write policies (more restrictive)
CREATE POLICY employees_insert ON employees
    FOR INSERT
    WITH CHECK (
        tenant_id = current_tenant_id()
        AND (
            current_user_role() IN ('CompanyAdmin', 'SafetyManager', 'HROnboarding')
            OR (
                current_user_role() = 'SiteSupervisor'
                AND location_id = ANY(current_location_ids())
            )
        )
    );

CREATE POLICY employees_update ON employees
    FOR UPDATE
    USING (tenant_id = current_tenant_id())
    WITH CHECK (
        tenant_id = current_tenant_id()
        AND (
            current_user_role() IN ('CompanyAdmin', 'SafetyManager', 'HROnboarding')
            OR (
                current_user_role() = 'SiteSupervisor'
                AND location_id = ANY(current_location_ids())
            )
        )
    );

-- Audit logs: Append-only, read by authorized roles only
CREATE POLICY audit_logs_insert ON audit_logs
    FOR INSERT
    WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY audit_logs_select ON audit_logs
    FOR SELECT
    USING (
        tenant_id = current_tenant_id()
        AND current_user_role() IN (
            'CompanyAdmin', 'ComplianceManager', 'AuditManager',
            'SeniorAuditor', 'Auditor', 'ReadOnlyAuditor'
        )
    );

-- Block UPDATE and DELETE on audit_logs
CREATE POLICY audit_logs_no_update ON audit_logs
    FOR UPDATE
    USING (false);

CREATE POLICY audit_logs_no_delete ON audit_logs
    FOR DELETE
    USING (false);
```

### 2.2 Django RLS Middleware

```python
# backend/pcs/middleware/rls.py

from django.db import connection

class RLSContextMiddleware:
    """
    Set PostgreSQL session variables for RLS policies.

    Called after JWT authentication to set:
    - app.tenant_id
    - app.user_id
    - app.user_role
    - app.division_id
    - app.location_ids
    - app.employee_id
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Set RLS context if authenticated
        if hasattr(request, 'jwt_user_id'):
            self._set_rls_context(request)

        response = self.get_response(request)

        # Clear RLS context after request
        if hasattr(request, 'jwt_user_id'):
            self._clear_rls_context()

        return response

    def _set_rls_context(self, request):
        """Set PostgreSQL session variables"""
        with connection.cursor() as cursor:
            cursor.execute(f"SET app.tenant_id = '{request.jwt_tenant_id}'")
            cursor.execute(f"SET app.user_id = '{request.jwt_user_id}'")
            cursor.execute(f"SET app.user_role = '{request.jwt_role}'")

            if hasattr(request, 'jwt_division_id') and request.jwt_division_id:
                cursor.execute(f"SET app.division_id = '{request.jwt_division_id}'")
            else:
                cursor.execute("SET app.division_id = ''")

            if hasattr(request, 'jwt_location_ids') and request.jwt_location_ids:
                location_ids_str = ','.join(request.jwt_location_ids)
                cursor.execute(f"SET app.location_ids = '{location_ids_str}'")
            else:
                cursor.execute("SET app.location_ids = ''")

            if hasattr(request, 'jwt_employee_id') and request.jwt_employee_id:
                cursor.execute(f"SET app.employee_id = '{request.jwt_employee_id}'")
            else:
                cursor.execute("SET app.employee_id = ''")

    def _clear_rls_context(self):
        """Reset PostgreSQL session variables"""
        with connection.cursor() as cursor:
            cursor.execute("RESET app.tenant_id")
            cursor.execute("RESET app.user_id")
            cursor.execute("RESET app.user_role")
            cursor.execute("RESET app.division_id")
            cursor.execute("RESET app.location_ids")
            cursor.execute("RESET app.employee_id")
```

---

## 3. Dual-Control Workflows

### 3.1 Dual-Control Service

```python
# backend/pcs/security/dual_control.py

import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict
from django.core.cache import cache
from django.conf import settings
from pcs.models import DualControlRequest
from pcs.tasks import send_dual_control_notification

class DualControlService:
    """
    Dual-control workflow for sensitive operations.

    Required for:
    - PII exports (roster with SSN/DOB)
    - DQ packet exports
    - Privileged role assignments
    - Background adjudication approval
    - Bulk employee deletion

    Flow:
    1. User initiates sensitive action
    2. System creates approval request
    3. Notification sent to eligible approvers
    4. Approver reviews and approves/denies
    5. Original user can complete action with approval token
    """

    # Operations requiring dual-control
    DUAL_CONTROL_OPERATIONS = {
        'pii_export': {
            'approver_roles': ['CompanyAdmin', 'ComplianceManager'],
            'timeout_hours': 24,
            'max_uses': 1,
        },
        'dq_packet_export': {
            'approver_roles': ['CompanyAdmin', 'ComplianceManager', 'AuditManager'],
            'timeout_hours': 24,
            'max_uses': 1,
        },
        'privileged_role_assignment': {
            'approver_roles': ['CompanyAdmin'],
            'timeout_hours': 48,
            'max_uses': 1,
        },
        'adjudication_approve': {
            'approver_roles': ['CompanyAdmin', 'SafetyManager', 'HROnboarding'],
            'timeout_hours': 72,
            'max_uses': 1,
        },
        'bulk_delete': {
            'approver_roles': ['CompanyAdmin'],
            'timeout_hours': 24,
            'max_uses': 1,
        },
    }

    def __init__(self, user_context: dict):
        self.user_context = user_context
        self.tenant_id = user_context.get('tenant_id')
        self.user_id = user_context.get('user_id')
        self.user_role = user_context.get('system_role')

    def request_approval(
        self,
        operation: str,
        resource_type: str,
        resource_id: str,
        details: Dict,
    ) -> str:
        """
        Create dual-control approval request.

        Returns:
            Request ID for tracking
        """
        if operation not in self.DUAL_CONTROL_OPERATIONS:
            raise ValueError(f"Unknown operation: {operation}")

        config = self.DUAL_CONTROL_OPERATIONS[operation]

        # Create request
        request = DualControlRequest.objects.create(
            tenant_id=self.tenant_id,
            requester_id=self.user_id,
            requester_role=self.user_role,
            operation=operation,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            status='pending',
            expires_at=datetime.utcnow() + timedelta(hours=config['timeout_hours']),
        )

        # Notify eligible approvers
        self._notify_approvers(request, config['approver_roles'])

        return str(request.id)

    def approve(
        self,
        request_id: str,
        approver_id: str,
        approver_role: str,
        comments: Optional[str] = None,
    ) -> str:
        """
        Approve a dual-control request.

        Returns:
            Approval token for completing the operation
        """
        request = DualControlRequest.objects.get(id=request_id, tenant_id=self.tenant_id)

        # Validate
        if request.status != 'pending':
            raise ValueError("Request is not pending")

        if request.expires_at < datetime.utcnow():
            request.status = 'expired'
            request.save()
            raise ValueError("Request has expired")

        if request.requester_id == approver_id:
            raise ValueError("Cannot approve your own request")

        config = self.DUAL_CONTROL_OPERATIONS[request.operation]
        if approver_role not in config['approver_roles']:
            raise ValueError("Not authorized to approve this operation")

        # Generate approval token
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        # Update request
        request.status = 'approved'
        request.approver_id = approver_id
        request.approver_role = approver_role
        request.approved_at = datetime.utcnow()
        request.approval_token_hash = token_hash
        request.approval_comments = comments
        request.remaining_uses = config['max_uses']
        request.save()

        # Cache token for fast validation
        cache_key = f"dual_control:{token_hash}"
        cache.set(cache_key, {
            'request_id': str(request.id),
            'operation': request.operation,
            'requester_id': str(request.requester_id),
            'remaining_uses': request.remaining_uses,
        }, config['timeout_hours'] * 3600)

        # Notify requester
        send_dual_control_notification.delay(
            request_id=str(request.id),
            notification_type='approved',
            recipient_id=str(request.requester_id),
        )

        return token

    def deny(
        self,
        request_id: str,
        approver_id: str,
        reason: str,
    ):
        """Deny a dual-control request"""
        request = DualControlRequest.objects.get(id=request_id, tenant_id=self.tenant_id)

        if request.status != 'pending':
            raise ValueError("Request is not pending")

        request.status = 'denied'
        request.approver_id = approver_id
        request.denied_at = datetime.utcnow()
        request.denial_reason = reason
        request.save()

        # Notify requester
        send_dual_control_notification.delay(
            request_id=str(request.id),
            notification_type='denied',
            recipient_id=str(request.requester_id),
        )

    def validate_approval(
        self,
        token: str,
        requester_id: str,
        operation: str,
    ) -> bool:
        """
        Validate an approval token.

        Decrements remaining uses if valid.
        """
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        cache_key = f"dual_control:{token_hash}"

        cached = cache.get(cache_key)
        if not cached:
            return False

        if cached['requester_id'] != requester_id:
            return False

        if cached['operation'] != operation:
            return False

        if cached['remaining_uses'] <= 0:
            return False

        # Decrement uses
        cached['remaining_uses'] -= 1
        if cached['remaining_uses'] > 0:
            cache.set(cache_key, cached)
        else:
            cache.delete(cache_key)

        # Update database
        DualControlRequest.objects.filter(
            approval_token_hash=token_hash
        ).update(
            remaining_uses=cached['remaining_uses'],
            last_used_at=datetime.utcnow()
        )

        return True

    def _notify_approvers(self, request, approver_roles: list):
        """Send notifications to eligible approvers"""
        from pcs.models import User

        approvers = User.objects.filter(
            tenant_id=self.tenant_id,
            is_active=True,
            user_roles__system_role__name__in=approver_roles,
        ).exclude(id=self.user_id).distinct()

        for approver in approvers:
            send_dual_control_notification.delay(
                request_id=str(request.id),
                notification_type='approval_needed',
                recipient_id=str(approver.id),
            )
```

---

## 4. MFA Implementation

### 4.1 MFA Service

```python
# backend/pcs/auth/mfa.py

import pyotp
import secrets
from typing import Optional, Tuple
from django.core.cache import cache
from fido2.server import Fido2Server
from fido2.webauthn import PublicKeyCredentialRpEntity

class MFAService:
    """
    Multi-Factor Authentication service.

    Supports:
    - TOTP (Time-based One-Time Password) - for all users
    - FIDO2/WebAuthn (hardware keys) - required for admin roles
    """

    TOTP_ISSUER = "Patriot Compliance Systems"
    TOTP_DIGITS = 6
    TOTP_INTERVAL = 30

    # Roles requiring hardware MFA
    HARDWARE_MFA_ROLES = ['CompanyAdmin', 'ComplianceManager']

    def __init__(self, user):
        self.user = user
        self.fido2_server = Fido2Server(
            PublicKeyCredentialRpEntity(
                id="patriotcompliance.com",
                name="Patriot Compliance Systems"
            )
        )

    # -------------------- TOTP Methods --------------------

    def setup_totp(self) -> Tuple[str, str]:
        """
        Generate TOTP secret and provisioning URI.

        Returns:
            (secret, provisioning_uri)
        """
        secret = pyotp.random_base32()

        # Store temporarily until verified
        cache_key = f"mfa:totp_setup:{self.user.id}"
        cache.set(cache_key, secret, 600)  # 10 minutes

        totp = pyotp.TOTP(secret)
        uri = totp.provisioning_uri(
            name=self.user.email,
            issuer_name=self.TOTP_ISSUER
        )

        return secret, uri

    def verify_totp_setup(self, code: str) -> bool:
        """
        Verify TOTP code during setup and save secret.
        """
        cache_key = f"mfa:totp_setup:{self.user.id}"
        secret = cache.get(cache_key)

        if not secret:
            return False

        totp = pyotp.TOTP(secret)
        if not totp.verify(code, valid_window=1):
            return False

        # Save secret to user
        self.user.totp_secret = secret
        self.user.mfa_enabled = True
        self.user.mfa_type = 'totp'
        self.user.save()

        cache.delete(cache_key)
        return True

    def verify_totp(self, code: str) -> bool:
        """Verify TOTP code during login"""
        if not self.user.totp_secret:
            return False

        totp = pyotp.TOTP(self.user.totp_secret)
        return totp.verify(code, valid_window=1)

    # -------------------- FIDO2/WebAuthn Methods --------------------

    def begin_fido2_registration(self) -> dict:
        """
        Begin FIDO2 credential registration.

        Returns challenge for browser WebAuthn API.
        """
        # Get existing credentials
        existing_credentials = self._get_user_credentials()

        options, state = self.fido2_server.register_begin(
            {
                "id": str(self.user.id).encode(),
                "name": self.user.email,
                "displayName": self.user.full_name,
            },
            existing_credentials,
        )

        # Store state for verification
        cache_key = f"mfa:fido2_reg:{self.user.id}"
        cache.set(cache_key, state, 300)  # 5 minutes

        return dict(options)

    def complete_fido2_registration(
        self,
        credential_response: dict,
        credential_name: str = "Security Key"
    ) -> bool:
        """
        Complete FIDO2 credential registration.
        """
        cache_key = f"mfa:fido2_reg:{self.user.id}"
        state = cache.get(cache_key)

        if not state:
            return False

        try:
            auth_data = self.fido2_server.register_complete(
                state, credential_response
            )

            # Save credential
            from pcs.models import UserFIDO2Credential
            UserFIDO2Credential.objects.create(
                user=self.user,
                credential_id=auth_data.credential_data.credential_id,
                public_key=auth_data.credential_data.public_key,
                sign_count=auth_data.credential_data.sign_count,
                name=credential_name,
            )

            self.user.mfa_enabled = True
            self.user.mfa_type = 'fido2'
            self.user.save()

            cache.delete(cache_key)
            return True

        except Exception as e:
            return False

    def begin_fido2_authentication(self) -> dict:
        """
        Begin FIDO2 authentication.

        Returns challenge for browser WebAuthn API.
        """
        credentials = self._get_user_credentials()

        if not credentials:
            raise ValueError("No registered security keys")

        options, state = self.fido2_server.authenticate_begin(credentials)

        cache_key = f"mfa:fido2_auth:{self.user.id}"
        cache.set(cache_key, state, 300)

        return dict(options)

    def verify_fido2_authentication(self, credential_response: dict) -> bool:
        """
        Verify FIDO2 authentication response.
        """
        cache_key = f"mfa:fido2_auth:{self.user.id}"
        state = cache.get(cache_key)

        if not state:
            return False

        credentials = self._get_user_credentials()

        try:
            self.fido2_server.authenticate_complete(
                state, credentials, credential_response
            )

            cache.delete(cache_key)
            return True

        except Exception:
            return False

    def _get_user_credentials(self) -> list:
        """Get user's registered FIDO2 credentials"""
        from pcs.models import UserFIDO2Credential

        creds = UserFIDO2Credential.objects.filter(
            user=self.user, is_active=True
        )

        return [
            {
                "id": cred.credential_id,
                "type": "public-key",
            }
            for cred in creds
        ]

    # -------------------- MFA Enforcement --------------------

    def requires_hardware_mfa(self) -> bool:
        """Check if user's role requires hardware MFA"""
        user_role = self.user.get_primary_role()
        return user_role in self.HARDWARE_MFA_ROLES

    def is_mfa_compliant(self) -> bool:
        """Check if user meets MFA requirements"""
        if not self.user.mfa_enabled:
            return False

        if self.requires_hardware_mfa():
            return self.user.mfa_type == 'fido2'

        return True
```

---

## 5. Audit Logging

### 5.1 Audit Schema

```sql
-- Audit log table (partitioned by month)
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,

    -- WHO
    user_id UUID,
    user_email VARCHAR(255),
    system_role VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),

    -- WHAT
    action VARCHAR(30) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    changes JSONB,
    request_method VARCHAR(10),
    request_path VARCHAR(500),
    response_status INTEGER,

    -- WHEN
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    duration_ms INTEGER,

    -- WHERE
    geo_location JSONB,
    device_fingerprint VARCHAR(100),

    -- CLASSIFICATION
    audit_level VARCHAR(20) DEFAULT 'standard',
    sensitivity VARCHAR(20) DEFAULT 'normal',

    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Indexes for common queries
CREATE INDEX idx_audit_tenant_time ON audit_logs (tenant_id, created_at DESC);
CREATE INDEX idx_audit_user_time ON audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_action ON audit_logs (action);

-- Create monthly partitions
SELECT create_monthly_partitions('audit_logs', '2025-01-01', '2032-12-31');
```

### 5.2 Audit Service

```python
# backend/pcs/audit/service.py

from typing import Dict, Optional, Any
from django.conf import settings
from pcs.models import AuditLog
from pcs.tasks import write_audit_log_async

class AuditService:
    """
    Immutable audit logging service.

    FedRAMP Requirements:
    - AU-2: Audit Events (all security-relevant events)
    - AU-3: Content of Audit Records (WHO/WHAT/WHEN/WHERE)
    - AU-11: Audit Record Retention (7 years)
    - AU-12: Audit Generation (system-wide)
    """

    # Events that must be audited (FedRAMP AU-2)
    AUDIT_EVENTS = {
        'authentication': ['login', 'logout', 'login_failed', 'mfa_verify', 'password_change'],
        'authorization': ['permission_denied', 'role_assigned', 'role_revoked'],
        'data_access': ['view', 'export', 'bulk_export'],
        'data_modification': ['create', 'update', 'delete', 'bulk_update'],
        'administrative': ['user_create', 'user_disable', 'settings_change', 'rbac_change'],
        'security': ['suspicious_activity', 'rate_limit_hit', 'injection_attempt'],
    }

    # Sensitivity classification
    SENSITIVITY_LEVELS = {
        'pii_access': 'high',
        'phi_access': 'high',
        'export': 'high',
        'admin_action': 'high',
        'authentication': 'medium',
        'data_modification': 'medium',
        'data_access': 'low',
    }

    def __init__(self, request=None):
        self.request = request

    def log(
        self,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        changes: Optional[Dict] = None,
        user_id: Optional[str] = None,
        tenant_id: Optional[str] = None,
        sensitivity: str = 'normal',
        additional_context: Optional[Dict] = None,
    ):
        """
        Log an audit event.

        Args:
            action: Action performed (e.g., 'create', 'update', 'login')
            resource_type: Type of resource (e.g., 'employee', 'drug_test')
            resource_id: ID of the resource
            changes: Dict with 'before' and 'after' states
            user_id: Override user ID (defaults to request user)
            tenant_id: Override tenant ID (defaults to request tenant)
            sensitivity: 'low', 'normal', 'high', 'critical'
            additional_context: Any additional context to log
        """
        # Build audit record
        record = {
            'tenant_id': tenant_id or self._get_tenant_id(),
            'user_id': user_id or self._get_user_id(),
            'user_email': self._get_user_email(),
            'system_role': self._get_user_role(),
            'ip_address': self._get_ip_address(),
            'user_agent': self._get_user_agent(),
            'session_id': self._get_session_id(),
            'action': action,
            'resource_type': resource_type,
            'resource_id': resource_id,
            'changes': self._sanitize_changes(changes),
            'request_method': self._get_request_method(),
            'request_path': self._get_request_path(),
            'sensitivity': sensitivity,
            'geo_location': self._get_geo_location(),
            'additional_context': additional_context,
        }

        # Write asynchronously to avoid blocking
        write_audit_log_async.delay(record)

    def log_authentication(
        self,
        action: str,
        success: bool,
        user_id: Optional[str] = None,
        failure_reason: Optional[str] = None,
    ):
        """Log authentication event"""
        self.log(
            action=action,
            resource_type='authentication',
            user_id=user_id,
            sensitivity='medium',
            additional_context={
                'success': success,
                'failure_reason': failure_reason,
            },
        )

    def log_pii_access(
        self,
        resource_type: str,
        resource_id: str,
        fields_accessed: list,
        purpose: str,
    ):
        """Log PII/PHI access (high sensitivity)"""
        self.log(
            action='pii_access',
            resource_type=resource_type,
            resource_id=resource_id,
            sensitivity='high',
            additional_context={
                'fields_accessed': fields_accessed,
                'purpose': purpose,
            },
        )

    def log_export(
        self,
        resource_type: str,
        record_count: int,
        export_format: str,
        includes_pii: bool,
        dual_control_token: Optional[str] = None,
    ):
        """Log data export"""
        self.log(
            action='export',
            resource_type=resource_type,
            sensitivity='high' if includes_pii else 'medium',
            additional_context={
                'record_count': record_count,
                'export_format': export_format,
                'includes_pii': includes_pii,
                'dual_control_approved': dual_control_token is not None,
            },
        )

    def _sanitize_changes(self, changes: Optional[Dict]) -> Optional[Dict]:
        """Remove sensitive data from changes before logging"""
        if not changes:
            return None

        sensitive_fields = ['password', 'ssn', 'ssn_encrypted', 'totp_secret', 'api_key']

        def sanitize(obj):
            if isinstance(obj, dict):
                return {
                    k: '[REDACTED]' if k.lower() in sensitive_fields else sanitize(v)
                    for k, v in obj.items()
                }
            return obj

        return sanitize(changes)

    def _get_tenant_id(self) -> Optional[str]:
        if self.request and hasattr(self.request, 'jwt_tenant_id'):
            return str(self.request.jwt_tenant_id)
        return None

    def _get_user_id(self) -> Optional[str]:
        if self.request and hasattr(self.request, 'jwt_user_id'):
            return str(self.request.jwt_user_id)
        return None

    def _get_user_email(self) -> Optional[str]:
        if self.request and hasattr(self.request, 'jwt_email'):
            return self.request.jwt_email
        return None

    def _get_user_role(self) -> Optional[str]:
        if self.request and hasattr(self.request, 'jwt_role'):
            return self.request.jwt_role
        return None

    def _get_ip_address(self) -> Optional[str]:
        if not self.request:
            return None
        xff = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if xff:
            return xff.split(',')[0].strip()
        return self.request.META.get('REMOTE_ADDR')

    def _get_user_agent(self) -> Optional[str]:
        if self.request:
            return self.request.META.get('HTTP_USER_AGENT', '')[:500]
        return None

    def _get_session_id(self) -> Optional[str]:
        if self.request and hasattr(self.request, 'session'):
            return self.request.session.session_key
        return None

    def _get_request_method(self) -> Optional[str]:
        if self.request:
            return self.request.method
        return None

    def _get_request_path(self) -> Optional[str]:
        if self.request:
            return self.request.path[:500]
        return None

    def _get_geo_location(self) -> Optional[Dict]:
        # Would integrate with GeoIP service
        return None
```

---

## 6. Action Plan

### Phase 1: RBAC Foundation (Week 1)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create RBAC database schema | High | 1 day | PostgreSQL |
| Seed system roles and permissions | High | 0.5 days | Schema |
| Implement RBACService | High | 2 days | Schema |
| Create RBAC middleware | High | 1 day | Service |
| Add permission checks to views | High | 2 days | Middleware |

**Deliverables:**
- [ ] RBAC tables created and seeded
- [ ] Permission checking service working
- [ ] Middleware integrated with all views

### Phase 2: RLS Implementation (Week 2)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create RLS session functions | High | 0.5 days | PostgreSQL |
| Implement tenant isolation policies | High | 1 day | Functions |
| Implement scope-based policies | High | 1.5 days | Tenant isolation |
| Create RLS context middleware | High | 1 day | Policies |
| Test RLS with all roles | High | 1 day | Middleware |

**Deliverables:**
- [ ] All RLS policies created
- [ ] Django middleware setting context
- [ ] Test coverage for all scope types

### Phase 3: MFA & Dual-Control (Week 3)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement TOTP service | High | 1 day | None |
| Implement FIDO2 service | High | 2 days | None |
| Create MFA enrollment flows | High | 1 day | Services |
| Implement dual-control service | High | 2 days | None |
| Create approval UI flows | Medium | 1 day | Service |

**Deliverables:**
- [ ] TOTP enrollment and verification working
- [ ] FIDO2 registration and authentication working
- [ ] Dual-control request/approval workflow

### Phase 4: Audit & Monitoring (Week 4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create audit log schema | High | 0.5 days | PostgreSQL |
| Implement audit service | High | 1.5 days | Schema |
| Add audit logging to all actions | High | 2 days | Service |
| Set up log retention policies | Medium | 0.5 days | Schema |
| Configure SIEM integration | Medium | 1 day | Service |

**Deliverables:**
- [ ] Audit logging for all actions
- [ ] 7-year retention configured
- [ ] SIEM integration (optional)

---

## 7. Security Testing Checklist

### Pre-Production Security Review

- [ ] All OWASP Top 10 vulnerabilities addressed
- [ ] Penetration testing completed
- [ ] RBAC matrix verified for all roles
- [ ] RLS policies tested for tenant isolation
- [ ] MFA enforcement verified for admin roles
- [ ] Dual-control workflows tested
- [ ] Audit logging verified for all actions
- [ ] Session management tested
- [ ] Rate limiting verified
- [ ] Input validation tested

---

**Document Status**: Implementation ready
**Author**: Architecture Team
**Last Review**: 2025-11-26
**Next Review**: Post Phase 1 implementation

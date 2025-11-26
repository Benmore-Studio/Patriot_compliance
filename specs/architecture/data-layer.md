# Data Layer Architecture Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready
**Compliance**: FedRAMP Moderate, SOC 2 Type II, HIPAA

---

## Executive Summary

This specification defines the data layer architecture for Patriot Compliance Systems, supporting 10K → 1M users with:
- **PostgreSQL 15+** with monthly partitioning for compliance events
- **Redis Cluster** for read-through caching and session management
- **Kafka (MSK)** for event streaming with per-module topic design
- **AWS KMS** envelope encryption for PII/PHI fields
- **Row-Level Security (RLS)** for multi-tenant isolation

---

## Architecture Overview

```
+==============================================================================+
|                              DATA LAYER ARCHITECTURE                          |
+==============================================================================+

      WRITE PATH                                READ PATH
      (Eventual Consistency)                    (Real-Time)
            │                                        │
            v                                        v
┌─────────────────────────┐          ┌─────────────────────────┐
│    API/WEBHOOK          │          │    DASHBOARD QUERY      │
│    (Django DRF)         │          │    (TanStack Query)     │
└───────────┬─────────────┘          └───────────┬─────────────┘
            │                                    │
            v                                    v
┌─────────────────────────┐          ┌─────────────────────────┐
│    KAFKA PRODUCER       │          │    REDIS CACHE          │
│    (Async Event)        │          │    (Read-Through)       │
└───────────┬─────────────┘          └───────────┬─────────────┘
            │                                    │
            v                                    │ Cache Miss
┌─────────────────────────┐                      │
│    KAFKA (MSK)          │                      │
│    Topic: compliance.*  │                      │
└───────────┬─────────────┘                      │
            │                                    │
            v                                    v
┌─────────────────────────┐          ┌─────────────────────────┐
│    CELERY WORKER        │          │    READ REPLICA         │
│    (Kafka Consumer)     │          │    (PostgreSQL)         │
└───────────┬─────────────┘          └───────────┬─────────────┘
            │                                    │
            v                                    │
┌─────────────────────────────────────────────────────────────┐
│                 POSTGRESQL PRIMARY (Aurora)                  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ PUBLIC      │  │ TENANT_001  │  │ TENANT_002  │  ...    │
│  │ SCHEMA      │  │ SCHEMA      │  │ SCHEMA      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  Features:                                                  │
│  - Monthly partitioning (compliance_events, audit_logs)    │
│  - RLS policies for tenant isolation                       │
│  - pgvector for AI embeddings                              │
│  - Field-level encryption (PII/PHI)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. PostgreSQL Architecture

### 1.1 Schema Design (Multi-Tenant)

**Public Schema** (shared across all tenants):
```sql
-- Public schema: shared reference data
CREATE SCHEMA public;

-- Tenant registry
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    schema_name VARCHAR(63) UNIQUE NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'professional',
    max_employees INTEGER DEFAULT 1000,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- RBAC system roles (fixed)
CREATE TABLE public.rbac_system_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    portal VARCHAR(20) NOT NULL CHECK (portal IN ('service_company', 'compliance_company')),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Permission definitions
CREATE TABLE public.rbac_permissions (
    id SERIAL PRIMARY KEY,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    description TEXT,
    requires_mfa BOOLEAN DEFAULT FALSE,
    requires_dual_control BOOLEAN DEFAULT FALSE,
    UNIQUE(resource, action)
);

-- Role-permission mappings
CREATE TABLE public.rbac_role_permissions (
    id SERIAL PRIMARY KEY,
    system_role_id INTEGER REFERENCES public.rbac_system_roles(id),
    permission_id INTEGER REFERENCES public.rbac_permissions(id),
    UNIQUE(system_role_id, permission_id)
);
```

**Tenant Schema Template** (replicated per tenant):
```sql
-- Template for tenant schemas
CREATE SCHEMA tenant_template;

-- Core employee table
CREATE TABLE tenant_template.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_number VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),

    -- Encrypted PII fields (envelope encryption)
    ssn_encrypted BYTEA,
    ssn_last_four VARCHAR(4),
    dob_encrypted BYTEA,

    -- Employment info
    status VARCHAR(20) DEFAULT 'candidate' CHECK (status IN (
        'candidate', 'onboarding', 'active', 'suspended', 'on_leave', 'terminated'
    )),
    hire_date DATE,
    termination_date DATE,
    department VARCHAR(100),

    -- Location scoping
    division_id UUID,
    location_id UUID,
    employee_group_id UUID,

    -- Compliance data (denormalized for fast queries)
    compliance_status VARCHAR(10) DEFAULT 'unknown' CHECK (
        compliance_status IN ('green', 'yellow', 'red', 'unknown')
    ),
    compliance_data JSONB DEFAULT '{}',

    -- Lifecycle events (hybrid status + events model)
    lifecycle_events JSONB DEFAULT '[]',

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Create indexes
CREATE INDEX idx_employees_tenant ON tenant_template.employees(tenant_id);
CREATE INDEX idx_employees_status ON tenant_template.employees(status);
CREATE INDEX idx_employees_compliance ON tenant_template.employees(compliance_status);
CREATE INDEX idx_employees_location ON tenant_template.employees(location_id);
CREATE INDEX idx_employees_division ON tenant_template.employees(division_id);
CREATE INDEX idx_employees_ssn_last_four ON tenant_template.employees(ssn_last_four);
CREATE INDEX idx_employees_compliance_data ON tenant_template.employees USING GIN(compliance_data);
```

### 1.2 Monthly Partitioning Strategy

**Compliance Events Table** (partitioned by month):
```sql
-- Partitioned compliance events table
CREATE TABLE tenant_template.compliance_events (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID NOT NULL REFERENCES tenant_template.employees(id),

    -- Event classification
    module VARCHAR(30) NOT NULL CHECK (module IN (
        'drug_alcohol', 'background', 'dot', 'health', 'training', 'geo_fencing'
    )),
    event_type VARCHAR(50) NOT NULL,

    -- Event data
    source VARCHAR(30) NOT NULL, -- 'webhook', 'manual', 'system'
    vendor VARCHAR(50), -- 'quest', 'checkr', 'tazworks', 'fmcsa'
    external_id VARCHAR(255),
    payload JSONB NOT NULL,

    -- Processing status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 'skipped'
    )),
    processed_at TIMESTAMPTZ,
    error_message TEXT,

    -- Compliance impact
    flag_before VARCHAR(10),
    flag_after VARCHAR(10),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    idempotency_key VARCHAR(255),

    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions (automated via pg_partman or cron)
CREATE TABLE compliance_events_2025_01 PARTITION OF compliance_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE compliance_events_2025_02 PARTITION OF compliance_events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- ... etc.

-- Partition management function
CREATE OR REPLACE FUNCTION create_monthly_partitions()
RETURNS void AS $$
DECLARE
    start_date DATE := DATE_TRUNC('month', CURRENT_DATE);
    end_date DATE := start_date + INTERVAL '3 months';
    partition_date DATE := start_date;
    partition_name TEXT;
BEGIN
    WHILE partition_date < end_date LOOP
        partition_name := 'compliance_events_' || TO_CHAR(partition_date, 'YYYY_MM');

        IF NOT EXISTS (
            SELECT 1 FROM pg_tables
            WHERE tablename = partition_name
        ) THEN
            EXECUTE format(
                'CREATE TABLE %I PARTITION OF compliance_events
                 FOR VALUES FROM (%L) TO (%L)',
                partition_name,
                partition_date,
                partition_date + INTERVAL '1 month'
            );
        END IF;

        partition_date := partition_date + INTERVAL '1 month';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule via pg_cron
SELECT cron.schedule('create-partitions', '0 0 1 * *', 'SELECT create_monthly_partitions()');
```

**Audit Logs Table** (partitioned, immutable):
```sql
CREATE TABLE tenant_template.audit_logs (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,

    -- WHO
    user_id UUID NOT NULL,
    user_email VARCHAR(255),
    system_role VARCHAR(50),
    ip_address INET,
    user_agent TEXT,

    -- WHAT
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(30) NOT NULL,
    resource_id UUID,
    changes JSONB, -- { "before": {...}, "after": {...} }

    -- WHEN
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- WHERE
    request_path VARCHAR(500),
    geo_location JSONB, -- { "country": "US", "region": "TX", "city": "Houston" }

    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Make table append-only (no updates/deletes)
CREATE RULE audit_logs_no_update AS ON UPDATE TO tenant_template.audit_logs
    DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO tenant_template.audit_logs
    DO INSTEAD NOTHING;

-- 7-year retention policy
CREATE OR REPLACE FUNCTION drop_old_audit_partitions()
RETURNS void AS $$
DECLARE
    cutoff_date DATE := CURRENT_DATE - INTERVAL '7 years';
    partition_record RECORD;
BEGIN
    FOR partition_record IN
        SELECT tablename FROM pg_tables
        WHERE tablename LIKE 'audit_logs_%'
        AND tablename < 'audit_logs_' || TO_CHAR(cutoff_date, 'YYYY_MM')
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I', partition_record.tablename);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 1.3 Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all tenant tables
ALTER TABLE tenant_template.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_template.compliance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_template.audit_logs ENABLE ROW LEVEL SECURITY;

-- Session context functions
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.tenant_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION current_user_role() RETURNS VARCHAR AS $$
    SELECT current_setting('app.user_role', true);
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION current_location_ids() RETURNS UUID[] AS $$
    SELECT string_to_array(
        current_setting('app.location_ids', true), ','
    )::UUID[];
$$ LANGUAGE SQL STABLE;

-- Tenant isolation policy (all roles)
CREATE POLICY tenant_isolation ON tenant_template.employees
    USING (tenant_id = current_tenant_id());

-- Location-scoped access for SiteSupervisor
CREATE POLICY location_scope ON tenant_template.employees
    FOR SELECT
    USING (
        current_user_role() NOT IN ('SiteSupervisor')
        OR location_id = ANY(current_location_ids())
    );

-- Field worker can only see own record
CREATE POLICY own_record_only ON tenant_template.employees
    FOR SELECT
    USING (
        current_user_role() != 'FieldWorker'
        OR id = NULLIF(current_setting('app.employee_id', true), '')::UUID
    );

-- Compliance events follow employee access
CREATE POLICY compliance_events_tenant ON tenant_template.compliance_events
    USING (tenant_id = current_tenant_id());

CREATE POLICY compliance_events_employee ON tenant_template.compliance_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tenant_template.employees e
            WHERE e.id = compliance_events.employee_id
            -- RLS on employees table already applied
        )
    );

-- Audit logs: read-only for authorized roles
CREATE POLICY audit_logs_read ON tenant_template.audit_logs
    FOR SELECT
    USING (
        tenant_id = current_tenant_id()
        AND current_user_role() IN (
            'CompanyAdmin', 'ComplianceManager', 'AuditManager', 'ReadOnlyAuditor'
        )
    );
```

### 1.4 pgvector for AI Embeddings

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Regulatory embeddings table (for DER IQ RAG)
CREATE TABLE public.regulatory_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Source document
    source VARCHAR(50) NOT NULL, -- '49_cfr_40', 'fcra', 'osha_1910'
    section VARCHAR(100),
    title VARCHAR(500),
    content TEXT NOT NULL,

    -- Embedding (1536 dimensions for OpenAI ada-002, 1024 for Claude)
    embedding vector(1536) NOT NULL,

    -- Metadata
    effective_date DATE,
    expires_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for fast similarity search
CREATE INDEX idx_regulatory_embeddings ON public.regulatory_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Tenant-specific policy embeddings
CREATE TABLE tenant_template.policy_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    policy_id UUID NOT NULL,
    policy_name VARCHAR(255),
    policy_content TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_policy_embeddings ON tenant_template.policy_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Similarity search function
CREATE OR REPLACE FUNCTION search_regulations(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    source VARCHAR,
    section VARCHAR,
    title VARCHAR,
    content TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.source,
        r.section,
        r.title,
        r.content,
        1 - (r.embedding <=> query_embedding) AS similarity
    FROM public.regulatory_embeddings r
    WHERE 1 - (r.embedding <=> query_embedding) > match_threshold
    ORDER BY r.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 2. Redis Architecture

### 2.1 Cluster Configuration

```yaml
# Redis Cluster (ElastiCache) Configuration
# Production: 3 node cluster with replicas

cluster:
  name: pcs-redis-prod
  node_type: cache.r6g.large
  num_node_groups: 3          # 3 shards
  replicas_per_node_group: 2  # 2 replicas per shard (Multi-AZ)

  # Memory configuration
  maxmemory_policy: volatile-lru  # Evict keys with TTL first
  maxmemory_reserved: 25%         # Reserve for overhead

  # Persistence (for sessions)
  snapshot_retention_limit: 7
  snapshot_window: 03:00-05:00    # UTC

  # Security
  transit_encryption_enabled: true
  at_rest_encryption_enabled: true
  auth_token: ${REDIS_AUTH_TOKEN}
```

### 2.2 Cache Key Design

```python
# backend/lib/cache/keys.py

class CacheKeys:
    """Redis key patterns for PCS"""

    # Prefix format: {tenant_id}:{resource}:{identifier}

    # Session cache (24h TTL)
    SESSION = "session:{session_id}"

    # User cache (1h TTL)
    USER = "{tenant_id}:user:{user_id}"
    USER_PERMISSIONS = "{tenant_id}:user:{user_id}:permissions"

    # Employee cache (15m TTL)
    EMPLOYEE = "{tenant_id}:employee:{employee_id}"
    EMPLOYEE_COMPLIANCE = "{tenant_id}:employee:{employee_id}:compliance"
    EMPLOYEE_LIST = "{tenant_id}:employees:list:{hash_params}"

    # Dashboard cache (5m TTL)
    DASHBOARD_STATS = "{tenant_id}:dashboard:{user_id}:stats"
    COMPLIANCE_SUMMARY = "{tenant_id}:compliance:summary"
    ALERTS_COUNT = "{tenant_id}:alerts:count:{user_id}"

    # Rate limiting (sliding window)
    RATE_LIMIT = "rate:{tenant_id}:{endpoint}:{window}"

    # Idempotency (24h TTL)
    IDEMPOTENCY = "idempotency:{idempotency_key}"

    # Distributed locks
    LOCK = "lock:{resource}:{identifier}"

    @classmethod
    def employee_key(cls, tenant_id: str, employee_id: str) -> str:
        return cls.EMPLOYEE.format(tenant_id=tenant_id, employee_id=employee_id)

    @classmethod
    def rate_limit_key(cls, tenant_id: str, endpoint: str) -> str:
        window = int(time.time() // 60)  # 1-minute window
        return cls.RATE_LIMIT.format(
            tenant_id=tenant_id, endpoint=endpoint, window=window
        )
```

### 2.3 Read-Through Cache Pattern

```python
# backend/lib/cache/read_through.py

import json
import hashlib
from typing import TypeVar, Callable, Optional
from functools import wraps
from django.core.cache import cache
from django.conf import settings

T = TypeVar('T')

class ReadThroughCache:
    """
    Read-through caching with automatic invalidation.

    Pattern:
    1. Check cache first
    2. On miss, query database
    3. Store result in cache
    4. Return data
    """

    def __init__(self, redis_client=None):
        self.redis = redis_client or cache

    def get_or_set(
        self,
        key: str,
        fetch_fn: Callable[[], T],
        ttl: int = 300,  # 5 minutes default
        version: int = 1
    ) -> T:
        """
        Get from cache or fetch and cache.

        Args:
            key: Cache key
            fetch_fn: Function to call on cache miss
            ttl: Time-to-live in seconds
            version: Cache version for invalidation
        """
        versioned_key = f"{key}:v{version}"

        # Try cache first
        cached = self.redis.get(versioned_key)
        if cached is not None:
            return json.loads(cached)

        # Cache miss - fetch from source
        result = fetch_fn()

        # Store in cache
        self.redis.set(versioned_key, json.dumps(result, default=str), ttl)

        return result

    def invalidate(self, pattern: str) -> int:
        """
        Invalidate all keys matching pattern.
        Uses SCAN to avoid blocking.
        """
        count = 0
        cursor = 0

        while True:
            cursor, keys = self.redis.scan(cursor, match=pattern, count=100)
            if keys:
                self.redis.delete(*keys)
                count += len(keys)
            if cursor == 0:
                break

        return count


def cached(key_pattern: str, ttl: int = 300):
    """
    Decorator for read-through caching.

    Usage:
        @cached("{tenant_id}:employee:{employee_id}", ttl=900)
        def get_employee(tenant_id: str, employee_id: str):
            return Employee.objects.get(id=employee_id)
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            # Build cache key from function arguments
            key = key_pattern.format(**kwargs)

            cache_instance = ReadThroughCache()
            return cache_instance.get_or_set(
                key=key,
                fetch_fn=lambda: func(*args, **kwargs),
                ttl=ttl
            )
        return wrapper
    return decorator


# Cache invalidation on write
class CacheInvalidator:
    """Invalidate cache on model changes"""

    @staticmethod
    def invalidate_employee(tenant_id: str, employee_id: str):
        """Invalidate all employee-related cache entries"""
        patterns = [
            f"{tenant_id}:employee:{employee_id}*",
            f"{tenant_id}:employees:list:*",
            f"{tenant_id}:dashboard:*",
            f"{tenant_id}:compliance:summary",
        ]

        cache_instance = ReadThroughCache()
        for pattern in patterns:
            cache_instance.invalidate(pattern)

    @staticmethod
    def invalidate_compliance_event(tenant_id: str, employee_id: str, module: str):
        """Invalidate cache after compliance event"""
        patterns = [
            f"{tenant_id}:employee:{employee_id}:compliance",
            f"{tenant_id}:compliance:summary",
            f"{tenant_id}:dashboard:*:stats",
            f"{tenant_id}:alerts:count:*",
        ]

        cache_instance = ReadThroughCache()
        for pattern in patterns:
            cache_instance.invalidate(pattern)
```

### 2.4 Session Management

```python
# backend/lib/cache/sessions.py

import secrets
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from django.conf import settings

class SessionManager:
    """
    Redis-based session management with role-based timeouts.

    Timeout rules:
    - CompanyAdmin, ComplianceManager: 15 minutes
    - SafetyManager, DER, AuditManager: 30 minutes
    - SiteSupervisor, HROnboarding, Auditor: 60 minutes
    - FieldWorker (PCS Pass): 24 hours (mobile app)
    """

    ROLE_TIMEOUTS = {
        'CompanyAdmin': 15 * 60,
        'ComplianceManager': 15 * 60,
        'SafetyManager': 30 * 60,
        'DER': 30 * 60,
        'AuditManager': 30 * 60,
        'SiteSupervisor': 60 * 60,
        'HROnboarding': 60 * 60,
        'SeniorAuditor': 60 * 60,
        'Auditor': 60 * 60,
        'BillingAdmin': 60 * 60,
        'ReadOnlyAuditor': 60 * 60,
        'FieldWorker': 24 * 60 * 60,
    }

    def __init__(self, redis_client):
        self.redis = redis_client

    def create_session(
        self,
        user_id: str,
        tenant_id: str,
        role: str,
        metadata: Dict[str, Any]
    ) -> str:
        """Create new session with role-based TTL"""
        session_id = secrets.token_urlsafe(32)
        ttl = self.ROLE_TIMEOUTS.get(role, 60 * 60)

        session_data = {
            'user_id': user_id,
            'tenant_id': tenant_id,
            'role': role,
            'created_at': datetime.utcnow().isoformat(),
            'last_activity': datetime.utcnow().isoformat(),
            'mfa_verified': metadata.get('mfa_verified', False),
            'ip_address': metadata.get('ip_address'),
            'user_agent': metadata.get('user_agent'),
        }

        key = f"session:{session_id}"
        self.redis.setex(key, ttl, json.dumps(session_data))

        # Track active sessions per user (for concurrent session limits)
        user_sessions_key = f"{tenant_id}:user:{user_id}:sessions"
        self.redis.sadd(user_sessions_key, session_id)
        self.redis.expire(user_sessions_key, ttl)

        return session_id

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data if valid"""
        key = f"session:{session_id}"
        data = self.redis.get(key)

        if not data:
            return None

        return json.loads(data)

    def refresh_session(self, session_id: str) -> bool:
        """Refresh session TTL on activity"""
        key = f"session:{session_id}"
        data = self.redis.get(key)

        if not data:
            return False

        session = json.loads(data)
        role = session.get('role', 'FieldWorker')
        ttl = self.ROLE_TIMEOUTS.get(role, 60 * 60)

        session['last_activity'] = datetime.utcnow().isoformat()
        self.redis.setex(key, ttl, json.dumps(session))

        return True

    def revoke_session(self, session_id: str):
        """Revoke a specific session"""
        key = f"session:{session_id}"
        session = self.get_session(session_id)

        if session:
            user_sessions_key = f"{session['tenant_id']}:user:{session['user_id']}:sessions"
            self.redis.srem(user_sessions_key, session_id)

        self.redis.delete(key)

    def revoke_all_user_sessions(self, tenant_id: str, user_id: str):
        """Revoke all sessions for a user (on password change, etc.)"""
        user_sessions_key = f"{tenant_id}:user:{user_id}:sessions"
        session_ids = self.redis.smembers(user_sessions_key)

        for session_id in session_ids:
            self.redis.delete(f"session:{session_id}")

        self.redis.delete(user_sessions_key)
```

---

## 3. Kafka Architecture

### 3.1 Topic Design (Per-Module)

```
+==============================================================================+
|                           KAFKA TOPIC TAXONOMY                               |
+==============================================================================+

COMPLIANCE TOPICS (per module):
├── compliance.drug_alcohol
│   ├── .test_ordered
│   ├── .test_completed
│   ├── .mro_review_requested
│   ├── .mro_review_completed
│   └── .clearinghouse_reported
├── compliance.background
│   ├── .screening_ordered
│   ├── .screening_completed
│   ├── .adjudication_required
│   ├── .adjudication_completed
│   └── .adverse_action_sent
├── compliance.dot
│   ├── .dq_updated
│   ├── .medical_cert_uploaded
│   ├── .clearinghouse_query_requested
│   └── .clearinghouse_query_completed
├── compliance.health
│   ├── .exam_scheduled
│   ├── .exam_completed
│   └── .osha_300_updated
├── compliance.training
│   ├── .cert_uploaded
│   ├── .cert_verified
│   └── .cert_expiring
└── compliance.geo_fencing
    ├── .checkin_recorded
    ├── .checkout_recorded
    └── .zone_violation

SYSTEM TOPICS:
├── audit.events          # Immutable audit trail
├── notifications.alerts  # Alert dispatch
└── dlq.compliance        # Dead Letter Queue for failed events
```

### 3.2 Producer Configuration

```python
# backend/lib/kafka/producer.py

import json
import uuid
from typing import Dict, Any, Optional
from confluent_kafka import Producer
from django.conf import settings

class ComplianceEventProducer:
    """
    Kafka producer for compliance events.

    Features:
    - Idempotent delivery (exactly-once semantics)
    - Partition by employee_id (ensures ordering per employee)
    - Automatic retry with exponential backoff
    """

    def __init__(self):
        self.producer = Producer({
            'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanism': 'SCRAM-SHA-512',
            'sasl.username': settings.KAFKA_USERNAME,
            'sasl.password': settings.KAFKA_PASSWORD,

            # Idempotent producer settings
            'enable.idempotence': True,
            'acks': 'all',
            'retries': 5,
            'retry.backoff.ms': 100,
            'max.in.flight.requests.per.connection': 5,

            # Batching for throughput
            'batch.size': 16384,
            'linger.ms': 10,
            'compression.type': 'snappy',
        })

    def produce_compliance_event(
        self,
        module: str,
        event_type: str,
        tenant_id: str,
        employee_id: str,
        payload: Dict[str, Any],
        idempotency_key: Optional[str] = None
    ):
        """
        Produce a compliance event to Kafka.

        Args:
            module: Compliance module (drug_alcohol, background, etc.)
            event_type: Event type (test_completed, screening_ordered, etc.)
            tenant_id: Tenant UUID
            employee_id: Employee UUID (used as partition key)
            payload: Event payload
            idempotency_key: Optional idempotency key for deduplication
        """
        topic = f"compliance.{module}"

        event = {
            'event_id': str(uuid.uuid4()),
            'event_type': event_type,
            'tenant_id': tenant_id,
            'employee_id': employee_id,
            'payload': payload,
            'timestamp': datetime.utcnow().isoformat(),
            'idempotency_key': idempotency_key or str(uuid.uuid4()),
            'version': '1.0',
        }

        self.producer.produce(
            topic=topic,
            key=employee_id.encode('utf-8'),  # Partition by employee
            value=json.dumps(event).encode('utf-8'),
            headers={
                'tenant_id': tenant_id.encode('utf-8'),
                'event_type': event_type.encode('utf-8'),
            },
            callback=self._delivery_callback
        )

        # Flush to ensure delivery (use poll in production for async)
        self.producer.flush(timeout=10)

    def _delivery_callback(self, err, msg):
        if err:
            logger.error(f"Kafka delivery failed: {err}")
            # Send to DLQ or retry queue
        else:
            logger.debug(f"Delivered to {msg.topic()} [{msg.partition()}] @ {msg.offset()}")


# Usage example:
# producer = ComplianceEventProducer()
# producer.produce_compliance_event(
#     module='drug_alcohol',
#     event_type='test_completed',
#     tenant_id='tenant_123',
#     employee_id='emp_456',
#     payload={'test_id': 'test_789', 'result': 'negative'}
# )
```

### 3.3 Consumer Configuration (Celery Workers)

```python
# backend/lib/kafka/consumer.py

import json
from typing import Callable, Dict, Any
from confluent_kafka import Consumer, KafkaException
from django.conf import settings

class ComplianceEventConsumer:
    """
    Kafka consumer for processing compliance events.

    Integrated with Celery for async task processing.
    """

    def __init__(self, group_id: str, topics: list[str]):
        self.consumer = Consumer({
            'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanism': 'SCRAM-SHA-512',
            'sasl.username': settings.KAFKA_USERNAME,
            'sasl.password': settings.KAFKA_PASSWORD,

            'group.id': group_id,
            'auto.offset.reset': 'earliest',
            'enable.auto.commit': False,  # Manual commit after processing

            # Consumer settings
            'max.poll.interval.ms': 300000,  # 5 minutes max processing time
            'session.timeout.ms': 45000,
            'heartbeat.interval.ms': 15000,
        })

        self.consumer.subscribe(topics)
        self.handlers: Dict[str, Callable] = {}

    def register_handler(self, event_type: str, handler: Callable):
        """Register handler for specific event type"""
        self.handlers[event_type] = handler

    def process_messages(self, batch_size: int = 100, timeout: float = 1.0):
        """Process messages in batches"""
        messages = self.consumer.consume(num_messages=batch_size, timeout=timeout)

        for msg in messages:
            if msg.error():
                logger.error(f"Kafka error: {msg.error()}")
                continue

            try:
                event = json.loads(msg.value().decode('utf-8'))
                event_type = event.get('event_type')

                # Dispatch to appropriate handler
                if event_type in self.handlers:
                    self.handlers[event_type](event)
                else:
                    logger.warning(f"No handler for event type: {event_type}")

                # Commit offset after successful processing
                self.consumer.commit(msg)

            except Exception as e:
                logger.error(f"Failed to process message: {e}")
                # Send to DLQ
                self._send_to_dlq(msg, str(e))

    def _send_to_dlq(self, msg, error: str):
        """Send failed message to Dead Letter Queue"""
        dlq_producer = ComplianceEventProducer()
        dlq_producer.producer.produce(
            topic='dlq.compliance',
            key=msg.key(),
            value=msg.value(),
            headers={
                'original_topic': msg.topic().encode('utf-8'),
                'error': error.encode('utf-8'),
                'failed_at': datetime.utcnow().isoformat().encode('utf-8'),
            }
        )
```

---

## 4. Field-Level Encryption (AWS KMS)

### 4.1 Envelope Encryption Architecture

```
+==============================================================================+
|                        ENVELOPE ENCRYPTION PATTERN                            |
+==============================================================================+

ENCRYPTION FLOW:

  PII Data (SSN)  ───────────────────────────────────────────────────►
        │
        v
  ┌─────────────────┐
  │ Generate DEK    │  DEK = Data Encryption Key (AES-256)
  │ (per record)    │  One DEK per employee record
  └────────┬────────┘
           │
           v
  ┌─────────────────┐     ┌─────────────────┐
  │ Encrypt Data    │     │ Encrypt DEK     │
  │ with DEK        │     │ with KEK        │  KEK = AWS KMS CMK
  │ (AES-256-GCM)   │     │ (KMS Envelope)  │
  └────────┬────────┘     └────────┬────────┘
           │                       │
           v                       v
  ┌─────────────────────────────────────────────────────────┐
  │              STORE IN DATABASE                          │
  │                                                         │
  │  ┌─────────────────────┐  ┌─────────────────────────┐  │
  │  │ ssn_encrypted       │  │ ssn_dek_encrypted       │  │
  │  │ (encrypted SSN)     │  │ (encrypted DEK)         │  │
  │  │ BYTEA               │  │ BYTEA                   │  │
  │  └─────────────────────┘  └─────────────────────────┘  │
  └─────────────────────────────────────────────────────────┘

DECRYPTION FLOW (requires KMS access):

  1. Read encrypted DEK from database
  2. Call KMS Decrypt(encrypted_dek) → DEK
  3. Use DEK to decrypt field data
  4. Return plaintext (SSN, DOB, etc.)
```

### 4.2 Implementation

```python
# backend/lib/encryption/kms.py

import base64
import boto3
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings

class FieldEncryption:
    """
    AWS KMS envelope encryption for PII/PHI fields.

    Usage:
        encryptor = FieldEncryption()
        encrypted = encryptor.encrypt("123-45-6789")
        decrypted = encryptor.decrypt(encrypted)
    """

    def __init__(self):
        self.kms_client = boto3.client(
            'kms',
            region_name=settings.AWS_REGION
        )
        self.kms_key_id = settings.KMS_PII_KEY_ID

    def encrypt(self, plaintext: str) -> dict:
        """
        Encrypt sensitive data using envelope encryption.

        Returns:
            {
                'ciphertext': base64-encoded encrypted data,
                'encrypted_dek': base64-encoded encrypted DEK,
                'nonce': base64-encoded nonce
            }
        """
        # Generate Data Encryption Key via KMS
        response = self.kms_client.generate_data_key(
            KeyId=self.kms_key_id,
            KeySpec='AES_256'
        )

        dek_plaintext = response['Plaintext']
        dek_encrypted = response['CiphertextBlob']

        # Encrypt data with DEK (AES-256-GCM)
        aesgcm = AESGCM(dek_plaintext)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)

        return {
            'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
            'encrypted_dek': base64.b64encode(dek_encrypted).decode('utf-8'),
            'nonce': base64.b64encode(nonce).decode('utf-8'),
        }

    def decrypt(self, encrypted_data: dict) -> str:
        """
        Decrypt sensitive data.

        Args:
            encrypted_data: Output from encrypt()
        """
        # Decrypt DEK via KMS
        dek_encrypted = base64.b64decode(encrypted_data['encrypted_dek'])
        response = self.kms_client.decrypt(
            CiphertextBlob=dek_encrypted,
            KeyId=self.kms_key_id
        )
        dek_plaintext = response['Plaintext']

        # Decrypt data with DEK
        aesgcm = AESGCM(dek_plaintext)
        nonce = base64.b64decode(encrypted_data['nonce'])
        ciphertext = base64.b64decode(encrypted_data['ciphertext'])

        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        return plaintext.decode('utf-8')


# Django model mixin for encrypted fields
class EncryptedFieldMixin:
    """Mixin for models with encrypted PII fields"""

    def set_ssn(self, ssn: str):
        """Encrypt and store SSN"""
        encryptor = FieldEncryption()
        encrypted = encryptor.encrypt(ssn)

        self.ssn_encrypted = json.dumps(encrypted).encode('utf-8')
        self.ssn_last_four = ssn[-4:] if len(ssn) >= 4 else ssn

    def get_ssn(self) -> str:
        """Decrypt and return SSN (requires pii.read scope)"""
        if not self.ssn_encrypted:
            return None

        encryptor = FieldEncryption()
        encrypted_data = json.loads(self.ssn_encrypted.decode('utf-8'))
        return encryptor.decrypt(encrypted_data)

    def get_ssn_masked(self) -> str:
        """Return masked SSN (always available)"""
        return f"***-**-{self.ssn_last_four}" if self.ssn_last_four else None
```

---

## 5. Action Plan

### Phase 1: Database Foundation (Week 1-2)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Set up Aurora PostgreSQL Multi-AZ | High | 2 days | AWS account |
| Create public schema (tenants, RBAC tables) | High | 1 day | Aurora setup |
| Create tenant schema template | High | 2 days | Public schema |
| Implement RLS policies | High | 2 days | Tenant schema |
| Set up monthly partitioning | Medium | 1 day | Tenant schema |
| Install pgvector extension | Medium | 0.5 days | Aurora setup |
| Create regulatory embeddings table | Medium | 1 day | pgvector |

**Deliverables:**
- [ ] Aurora PostgreSQL cluster running
- [ ] Public schema with RBAC tables
- [ ] Tenant schema template with all compliance tables
- [ ] RLS policies enabled and tested
- [ ] Partition management function deployed

### Phase 2: Redis Layer (Week 2-3)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Set up ElastiCache Redis cluster | High | 1 day | VPC |
| Implement cache key module | High | 1 day | Redis cluster |
| Build read-through cache library | High | 2 days | Cache keys |
| Implement session management | High | 2 days | Redis cluster |
| Add cache invalidation hooks | Medium | 1 day | Read-through cache |
| Configure rate limiting | Medium | 1 day | Redis cluster |

**Deliverables:**
- [ ] Redis cluster running with TLS
- [ ] Cache library with read-through pattern
- [ ] Session management with role-based timeouts
- [ ] Rate limiting middleware

### Phase 3: Kafka Layer (Week 3-4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Set up MSK cluster | High | 1 day | VPC |
| Create topic taxonomy | High | 0.5 days | MSK cluster |
| Implement idempotent producer | High | 2 days | Topics created |
| Implement consumer with handlers | High | 2 days | Producer |
| Set up DLQ handling | Medium | 1 day | Consumer |
| Add monitoring/alerting | Medium | 1 day | All Kafka components |

**Deliverables:**
- [ ] MSK cluster with compliance topics
- [ ] Idempotent producer library
- [ ] Consumer with Celery integration
- [ ] DLQ for failed messages
- [ ] CloudWatch dashboards

### Phase 4: Encryption Layer (Week 4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create KMS CMK for PII | High | 0.5 days | AWS account |
| Implement envelope encryption | High | 2 days | KMS CMK |
| Add model mixins for encrypted fields | High | 1 day | Envelope encryption |
| Migrate existing PII data | High | 2 days | Model mixins |
| Test decryption audit logging | Medium | 0.5 days | Encryption working |

**Deliverables:**
- [ ] KMS CMK with key rotation enabled
- [ ] FieldEncryption library
- [ ] Encrypted fields on Employee model
- [ ] Audit logging for all decryption operations

---

## 6. Monitoring & Alerting

### CloudWatch Metrics

```yaml
# Key metrics to monitor

PostgreSQL:
  - DatabaseConnections: Alert if > 80% of max
  - CPUUtilization: Alert if > 70% sustained
  - ReadLatency: Alert if P99 > 50ms
  - WriteLatency: Alert if P99 > 100ms
  - FreeStorageSpace: Alert if < 20%

Redis:
  - CurrConnections: Alert if > 80% of max
  - CacheHitRate: Alert if < 80%
  - Evictions: Alert if > 0 (indicates memory pressure)
  - ReplicationLag: Alert if > 1 second

Kafka:
  - MessagesInPerSec: Track throughput
  - ConsumerLag: Alert if > 10000 messages
  - UnderReplicatedPartitions: Alert if > 0
  - OfflinePartitionsCount: Alert if > 0
```

### Key Performance Indicators

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| DB Query P95 | <50ms | >100ms |
| Cache Hit Rate | >85% | <80% |
| Event Processing Latency | <500ms | >2000ms |
| Consumer Lag | <1000 | >10000 |
| Encryption Latency | <20ms | >50ms |

---

## 7. Disaster Recovery

### RTO/RPO Targets

| Component | RTO | RPO | Strategy |
|-----------|-----|-----|----------|
| PostgreSQL | 15 min | 5 min | Aurora Multi-AZ failover + PITR |
| Redis | 5 min | 0 (in-memory) | ElastiCache Multi-AZ |
| Kafka | 15 min | 0 | MSK Multi-AZ |
| Documents (S3) | 0 | 0 | Cross-region replication |

### Backup Strategy

```
Daily:
- Aurora automated snapshots (35-day retention)
- Redis snapshots (7-day retention)

Weekly:
- Full PostgreSQL pg_dump to S3 Glacier
- Kafka topic snapshots

Monthly:
- Test restore procedures
- DR drill documentation
```

---

**Document Status**: Implementation ready
**Author**: Architecture Team
**Last Review**: 2025-11-26
**Next Review**: Post Phase 1 implementation

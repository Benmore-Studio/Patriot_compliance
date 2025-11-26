# API Layer Architecture Specification

**Version**: 1.0
**Last Updated**: 2025-11-26
**Status**: Implementation Ready
**Compliance**: FedRAMP Moderate, SOC 2 Type II

---

## Executive Summary

This specification defines the Django + DRF API layer for Patriot Compliance Systems, covering:
- **Django middleware stack** for tenant resolution, auth, RBAC, and audit logging
- **Webhook handlers** for vendor integrations (Checkr, TazWorks, Quest, FMCSA)
- **Idempotency** implementation with Redis for all write operations
- **API versioning** using URL path strategy
- **Field masking** in DRF serializers for PII/PHI based on user permissions

---

## Architecture Overview

```
+==============================================================================+
|                              API LAYER ARCHITECTURE                           |
+==============================================================================+

                              INCOMING REQUEST
                                     │
                                     v
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DJANGO MIDDLEWARE STACK                          │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 1. Security │->│ 2. Tenant   │->│ 3. Auth/JWT │->│ 4. RBAC     │        │
│  │    Headers  │  │    Resolve  │  │    Decode   │  │    Check    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │ 5. Rate     │->│ 6. Idemp-   │->│ 7. Audit    │                          │
│  │    Limit    │  │    otency   │  │    Log      │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     v
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DRF VIEW LAYER                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         API VIEWSETS                                     │ │
│  │  /api/v1/employees     - Employee CRUD + bulk operations                │ │
│  │  /api/v1/drug-testing  - Drug test management                           │ │
│  │  /api/v1/background    - Background check workflows                     │ │
│  │  /api/v1/dot           - DOT compliance endpoints                       │ │
│  │  /api/v1/health        - Occupational health records                    │ │
│  │  /api/v1/training      - Training/certification management              │ │
│  │  /api/v1/geo-fencing   - Geo-fence and check-in APIs                   │ │
│  │  /api/v1/der-iq        - AI gateway for natural language queries       │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         WEBHOOK ENDPOINTS                                │ │
│  │  /webhooks/checkr      - Background check results                       │ │
│  │  /webhooks/tazworks    - Drug test results                              │ │
│  │  /webhooks/quest       - Lab results                                    │ │
│  │  /webhooks/fmcsa       - Clearinghouse notifications                   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     v
┌──────────────────────────────────────────────────────────────────────────────┐
│                              SERIALIZER LAYER                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    FIELD-LEVEL SECURITY                                 │ │
│  │  - SSN masking: ***-**-6789 (unless pii.read scope)                    │ │
│  │  - DOB masking: ****-**-15 (unless pii.read scope)                     │ │
│  │  - Medical data hidden (unless phi.read scope)                         │ │
│  │  - Salary/compensation hidden (unless payroll.read scope)              │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Django Middleware Stack

### 1.1 Middleware Order

```python
# backend/settings/base.py

MIDDLEWARE = [
    # Django built-in (security first)
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',

    # PCS Custom Middleware (order matters!)
    'pcs.middleware.security.SecurityHeadersMiddleware',      # 1. Security headers
    'pcs.middleware.tenant.TenantResolutionMiddleware',       # 2. Tenant resolution
    'pcs.middleware.auth.JWTAuthenticationMiddleware',        # 3. JWT auth
    'pcs.middleware.rbac.RBACPermissionMiddleware',           # 4. RBAC check
    'pcs.middleware.ratelimit.RateLimitMiddleware',           # 5. Rate limiting
    'pcs.middleware.idempotency.IdempotencyMiddleware',       # 6. Idempotency
    'pcs.middleware.audit.AuditLogMiddleware',                # 7. Audit logging

    # Django auth (after our auth)
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]
```

### 1.2 Security Headers Middleware

```python
# backend/pcs/middleware/security.py

class SecurityHeadersMiddleware:
    """
    Add security headers to all responses.

    FedRAMP Requirements:
    - SC-8: Transmission Confidentiality
    - SC-28: Protection of Information at Rest
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Strict Transport Security (HSTS)
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'

        # Content Security Policy
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' https://fonts.gstatic.com; "
            "connect-src 'self' https://api.mapbox.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )

        # XSS Protection
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'

        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        # Permissions Policy
        response['Permissions-Policy'] = (
            'geolocation=(self), camera=(), microphone=()'
        )

        return response
```

### 1.3 Tenant Resolution Middleware

```python
# backend/pcs/middleware/tenant.py

import re
from django.http import JsonResponse
from django.db import connection
from pcs.models import Tenant

class TenantResolutionMiddleware:
    """
    Resolve tenant from request and set PostgreSQL search_path.

    Resolution order:
    1. JWT claim 'tenant_id'
    2. X-Tenant-ID header
    3. Subdomain (tenant.pcs.com)

    Sets:
    - request.tenant: Tenant model instance
    - PostgreSQL search_path: tenant schema + public
    - RLS session variables
    """

    EXEMPT_PATHS = [
        r'^/api/v1/auth/login',
        r'^/api/v1/auth/register',
        r'^/api/v1/auth/password-reset',
        r'^/webhooks/',
        r'^/health',
        r'^/metrics',
    ]

    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_patterns = [re.compile(p) for p in self.EXEMPT_PATHS]

    def __call__(self, request):
        # Skip tenant resolution for exempt paths
        if self._is_exempt(request.path):
            return self.get_response(request)

        # Resolve tenant
        tenant = self._resolve_tenant(request)

        if not tenant:
            return JsonResponse(
                {'error': 'Tenant not found or not specified'},
                status=400
            )

        if not tenant.is_active:
            return JsonResponse(
                {'error': 'Tenant account is suspended'},
                status=403
            )

        # Attach tenant to request
        request.tenant = tenant

        # Set PostgreSQL schema search_path
        self._set_schema(tenant)

        response = self.get_response(request)

        # Reset search_path after request
        self._reset_schema()

        return response

    def _is_exempt(self, path: str) -> bool:
        return any(pattern.match(path) for pattern in self.exempt_patterns)

    def _resolve_tenant(self, request):
        """Resolve tenant from JWT, header, or subdomain"""

        # 1. From JWT claim (set by auth middleware)
        tenant_id = getattr(request, 'jwt_tenant_id', None)
        if tenant_id:
            return Tenant.objects.filter(id=tenant_id).first()

        # 2. From header
        tenant_id = request.headers.get('X-Tenant-ID')
        if tenant_id:
            return Tenant.objects.filter(id=tenant_id).first()

        # 3. From subdomain
        host = request.get_host().split(':')[0]
        if '.' in host:
            subdomain = host.split('.')[0]
            if subdomain not in ['www', 'api', 'app']:
                return Tenant.objects.filter(slug=subdomain).first()

        return None

    def _set_schema(self, tenant: Tenant):
        """Set PostgreSQL search_path for tenant isolation"""
        with connection.cursor() as cursor:
            # Set search_path to tenant schema first, then public
            cursor.execute(
                f"SET search_path TO {tenant.schema_name}, public"
            )

            # Set RLS session variables
            cursor.execute(f"SET app.tenant_id = '{tenant.id}'")

    def _reset_schema(self):
        """Reset search_path to public only"""
        with connection.cursor() as cursor:
            cursor.execute("SET search_path TO public")
            cursor.execute("RESET app.tenant_id")
```

### 1.4 JWT Authentication Middleware

```python
# backend/pcs/middleware/auth.py

import jwt
from django.http import JsonResponse
from django.conf import settings
from datetime import datetime

class JWTAuthenticationMiddleware:
    """
    JWT authentication middleware.

    Validates JWT token and extracts:
    - User ID
    - Tenant ID
    - System role
    - Scopes
    - MFA verification status
    """

    EXEMPT_PATHS = [
        '/api/v1/auth/login',
        '/api/v1/auth/register',
        '/api/v1/auth/mfa/setup',
        '/webhooks/',
        '/health',
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip auth for exempt paths
        if any(request.path.startswith(p) for p in self.EXEMPT_PATHS):
            return self.get_response(request)

        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return JsonResponse(
                {'error': 'Missing or invalid Authorization header'},
                status=401
            )

        token = auth_header[7:]  # Remove 'Bearer ' prefix

        try:
            # Decode and validate JWT
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=['HS256'],
                options={'require': ['exp', 'sub', 'tenant']}
            )

            # Check expiration
            if datetime.utcnow().timestamp() > payload['exp']:
                return JsonResponse(
                    {'error': 'Token expired'},
                    status=401
                )

            # Attach JWT data to request
            request.jwt_user_id = payload['sub']
            request.jwt_tenant_id = payload['tenant']
            request.jwt_role = payload.get('system_role')
            request.jwt_scopes = payload.get('scopes', [])
            request.jwt_mfa_verified = payload.get('mfa_verified', False)
            request.jwt_location_ids = payload.get('sc', {}).get('location_ids', [])

            # Set RLS variables for row-level security
            self._set_rls_variables(request, payload)

        except jwt.InvalidTokenError as e:
            return JsonResponse(
                {'error': f'Invalid token: {str(e)}'},
                status=401
            )

        return self.get_response(request)

    def _set_rls_variables(self, request, payload):
        """Set PostgreSQL session variables for RLS"""
        from django.db import connection

        with connection.cursor() as cursor:
            cursor.execute(f"SET app.user_id = '{payload['sub']}'")
            cursor.execute(f"SET app.user_role = '{payload.get('system_role', '')}'")

            location_ids = payload.get('sc', {}).get('location_ids', [])
            if location_ids:
                cursor.execute(f"SET app.location_ids = '{','.join(location_ids)}'")
```

### 1.5 RBAC Permission Middleware

```python
# backend/pcs/middleware/rbac.py

import re
from django.http import JsonResponse
from django.core.cache import cache
from pcs.models import RBACRolePermission, RBACPermission

class RBACPermissionMiddleware:
    """
    Role-Based Access Control middleware.

    Checks if user's role has permission for the requested resource/action.

    Permission format: {resource}.{action}
    Examples: roster.read, drug_alcohol.approve, pii.export
    """

    # Map HTTP methods to permission actions
    METHOD_ACTION_MAP = {
        'GET': 'read',
        'HEAD': 'read',
        'OPTIONS': 'read',
        'POST': 'create',
        'PUT': 'update',
        'PATCH': 'update',
        'DELETE': 'delete',
    }

    # Map URL patterns to resources
    RESOURCE_PATTERNS = [
        (r'^/api/v1/employees', 'roster'),
        (r'^/api/v1/drug-testing', 'drug_alcohol'),
        (r'^/api/v1/background', 'background'),
        (r'^/api/v1/dot', 'dot'),
        (r'^/api/v1/health', 'health'),
        (r'^/api/v1/training', 'training'),
        (r'^/api/v1/geo-fencing', 'geo_fencing'),
        (r'^/api/v1/der-iq', 'der_iq'),
        (r'^/api/v1/reports', 'reports'),
        (r'^/api/v1/settings', 'settings'),
    ]

    # Endpoints requiring MFA verification
    MFA_REQUIRED_PATTERNS = [
        r'/export',
        r'/bulk-delete',
        r'/adjudication',
        r'/settings/rbac',
    ]

    # Endpoints requiring dual-control
    DUAL_CONTROL_PATTERNS = [
        r'/pii-export',
        r'/dq-packet',
        r'/role-assignment',
        r'/adjudication/approve',
    ]

    def __init__(self, get_response):
        self.get_response = get_response
        self.resource_patterns = [(re.compile(p), r) for p, r in self.RESOURCE_PATTERNS]
        self.mfa_patterns = [re.compile(p) for p in self.MFA_REQUIRED_PATTERNS]
        self.dual_control_patterns = [re.compile(p) for p in self.DUAL_CONTROL_PATTERNS]

    def __call__(self, request):
        # Skip for exempt paths (auth, webhooks, health)
        if not hasattr(request, 'jwt_role'):
            return self.get_response(request)

        # Determine resource and action
        resource = self._get_resource(request.path)
        action = self._get_action(request.method, request.path)

        if not resource:
            return self.get_response(request)

        # Check permission
        if not self._has_permission(request.jwt_role, resource, action):
            return JsonResponse(
                {'error': f'Permission denied: {resource}.{action}'},
                status=403
            )

        # Check MFA requirement
        if self._requires_mfa(request.path) and not request.jwt_mfa_verified:
            return JsonResponse(
                {'error': 'MFA verification required for this action'},
                status=403
            )

        # Check dual-control requirement
        if self._requires_dual_control(request.path):
            if not self._has_dual_control_approval(request):
                return JsonResponse(
                    {'error': 'Dual-control approval required'},
                    status=403,
                    headers={'X-Requires-Dual-Control': 'true'}
                )

        return self.get_response(request)

    def _get_resource(self, path: str) -> str:
        """Extract resource from URL path"""
        for pattern, resource in self.resource_patterns:
            if pattern.match(path):
                return resource
        return None

    def _get_action(self, method: str, path: str) -> str:
        """Determine action from HTTP method and path"""
        base_action = self.METHOD_ACTION_MAP.get(method, 'read')

        # Check for special actions in path
        if '/approve' in path:
            return 'approve'
        if '/export' in path:
            return 'export'
        if '/configure' in path:
            return 'configure'
        if '/assign' in path:
            return 'assign'

        return base_action

    def _has_permission(self, role: str, resource: str, action: str) -> bool:
        """Check if role has permission for resource.action"""

        # Check cache first
        cache_key = f"rbac:{role}:{resource}:{action}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        # Query database
        has_perm = RBACRolePermission.objects.filter(
            system_role__name=role,
            permission__resource=resource,
            permission__action=action
        ).exists()

        # Cache for 5 minutes
        cache.set(cache_key, has_perm, 300)

        return has_perm

    def _requires_mfa(self, path: str) -> bool:
        """Check if path requires MFA verification"""
        return any(pattern.search(path) for pattern in self.mfa_patterns)

    def _requires_dual_control(self, path: str) -> bool:
        """Check if path requires dual-control approval"""
        return any(pattern.search(path) for pattern in self.dual_control_patterns)

    def _has_dual_control_approval(self, request) -> bool:
        """Check if request has valid dual-control approval"""
        approval_token = request.headers.get('X-Dual-Control-Token')
        if not approval_token:
            return False

        # Validate approval token (stored in Redis)
        from pcs.services.dual_control import DualControlService
        return DualControlService().validate_approval(
            approval_token,
            request.jwt_user_id,
            request.path
        )
```

### 1.6 Rate Limiting Middleware

```python
# backend/pcs/middleware/ratelimit.py

import time
from django.http import JsonResponse
from django.core.cache import cache

class RateLimitMiddleware:
    """
    Sliding window rate limiting using Redis.

    Limits:
    - Standard API: 100 requests/minute per tenant
    - Webhooks: 1000 requests/minute per vendor
    - Auth endpoints: 10 requests/minute per IP
    - Export endpoints: 10 requests/hour per user
    """

    RATE_LIMITS = {
        'default': (100, 60),        # 100 req/min
        'webhooks': (1000, 60),      # 1000 req/min
        'auth': (10, 60),            # 10 req/min
        'export': (10, 3600),        # 10 req/hour
    }

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Determine rate limit category
        category = self._get_category(request.path)
        limit, window = self.RATE_LIMITS.get(category, self.RATE_LIMITS['default'])

        # Build rate limit key
        key = self._build_key(request, category)

        # Check rate limit
        current_count = self._increment_counter(key, window)

        if current_count > limit:
            retry_after = self._get_retry_after(key, window)
            return JsonResponse(
                {'error': 'Rate limit exceeded'},
                status=429,
                headers={
                    'X-RateLimit-Limit': str(limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': str(retry_after),
                    'Retry-After': str(retry_after),
                }
            )

        response = self.get_response(request)

        # Add rate limit headers
        response['X-RateLimit-Limit'] = str(limit)
        response['X-RateLimit-Remaining'] = str(max(0, limit - current_count))

        return response

    def _get_category(self, path: str) -> str:
        """Determine rate limit category from path"""
        if path.startswith('/webhooks/'):
            return 'webhooks'
        if path.startswith('/api/v1/auth/'):
            return 'auth'
        if '/export' in path:
            return 'export'
        return 'default'

    def _build_key(self, request, category: str) -> str:
        """Build rate limit key"""
        if category == 'webhooks':
            # Limit by vendor
            vendor = request.path.split('/')[2]
            return f"ratelimit:webhook:{vendor}"
        elif category == 'auth':
            # Limit by IP
            ip = self._get_client_ip(request)
            return f"ratelimit:auth:{ip}"
        elif category == 'export':
            # Limit by user
            user_id = getattr(request, 'jwt_user_id', 'anonymous')
            return f"ratelimit:export:{user_id}"
        else:
            # Limit by tenant
            tenant_id = getattr(request, 'jwt_tenant_id', 'anonymous')
            return f"ratelimit:api:{tenant_id}"

    def _increment_counter(self, key: str, window: int) -> int:
        """Increment sliding window counter"""
        now = int(time.time())
        window_key = f"{key}:{now // window}"

        # Use Redis INCR with expiry
        count = cache.get(window_key, 0)
        cache.set(window_key, count + 1, window)

        return count + 1

    def _get_retry_after(self, key: str, window: int) -> int:
        """Calculate seconds until rate limit resets"""
        now = int(time.time())
        window_start = (now // window) * window
        return window_start + window - now

    def _get_client_ip(self, request) -> str:
        """Get client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', 'unknown')
```

### 1.7 Idempotency Middleware

```python
# backend/pcs/middleware/idempotency.py

import hashlib
import json
from django.http import JsonResponse
from django.core.cache import cache

class IdempotencyMiddleware:
    """
    Idempotency middleware for write operations.

    Features:
    - Requires Idempotency-Key header for POST/PUT/PATCH/DELETE
    - 24-hour deduplication window
    - Returns cached response for duplicate requests
    """

    IDEMPOTENT_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
    CACHE_TTL = 24 * 60 * 60  # 24 hours

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only apply to write operations
        if request.method not in self.IDEMPOTENT_METHODS:
            return self.get_response(request)

        # Skip for webhooks (they have their own idempotency)
        if request.path.startswith('/webhooks/'):
            return self.get_response(request)

        # Get idempotency key
        idempotency_key = request.headers.get('Idempotency-Key')

        if not idempotency_key:
            return JsonResponse(
                {'error': 'Idempotency-Key header required for write operations'},
                status=400
            )

        # Build cache key
        cache_key = self._build_cache_key(request, idempotency_key)

        # Check for existing response
        cached_response = cache.get(cache_key)
        if cached_response:
            # Return cached response
            response = JsonResponse(
                cached_response['body'],
                status=cached_response['status']
            )
            response['X-Idempotency-Replayed'] = 'true'
            return response

        # Process request
        response = self.get_response(request)

        # Cache successful responses
        if 200 <= response.status_code < 500:
            self._cache_response(cache_key, response)

        return response

    def _build_cache_key(self, request, idempotency_key: str) -> str:
        """Build unique cache key"""
        tenant_id = getattr(request, 'jwt_tenant_id', 'anonymous')
        user_id = getattr(request, 'jwt_user_id', 'anonymous')

        # Include request details in key to prevent cross-endpoint collisions
        key_parts = [
            tenant_id,
            user_id,
            request.method,
            request.path,
            idempotency_key,
        ]

        key_hash = hashlib.sha256(':'.join(key_parts).encode()).hexdigest()[:32]
        return f"idempotency:{key_hash}"

    def _cache_response(self, cache_key: str, response):
        """Cache response for replay"""
        try:
            body = json.loads(response.content.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            body = {'raw': response.content.decode('utf-8', errors='ignore')}

        cache.set(cache_key, {
            'status': response.status_code,
            'body': body,
        }, self.CACHE_TTL)
```

### 1.8 Audit Log Middleware

```python
# backend/pcs/middleware/audit.py

import json
import time
from django.db import connection
from pcs.tasks import write_audit_log

class AuditLogMiddleware:
    """
    Audit logging middleware.

    Records:
    - WHO: user_id, role, IP, user_agent
    - WHAT: resource, action, changes
    - WHEN: timestamp
    - WHERE: request path, geo (if available)

    FedRAMP Requirements:
    - AU-2: Audit Events
    - AU-3: Content of Audit Records
    - AU-11: Audit Record Retention (7 years)
    """

    # Paths to skip audit logging
    SKIP_PATHS = [
        '/health',
        '/metrics',
        '/api/v1/der-iq/suggestions',  # High-frequency, low-risk
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip non-auditable paths
        if any(request.path.startswith(p) for p in self.SKIP_PATHS):
            return self.get_response(request)

        # Capture request details
        start_time = time.time()
        request_body = self._get_request_body(request)

        # Process request
        response = self.get_response(request)

        # Calculate duration
        duration_ms = int((time.time() - start_time) * 1000)

        # Build audit record
        audit_record = {
            # WHO
            'user_id': getattr(request, 'jwt_user_id', None),
            'user_email': getattr(request, 'jwt_email', None),
            'system_role': getattr(request, 'jwt_role', None),
            'ip_address': self._get_client_ip(request),
            'user_agent': request.headers.get('User-Agent', '')[:500],

            # WHAT
            'resource': self._extract_resource(request.path),
            'action': self._extract_action(request.method, request.path),
            'resource_id': self._extract_resource_id(request.path),
            'request_method': request.method,
            'request_path': request.path,
            'request_body': request_body,
            'response_status': response.status_code,

            # WHEN
            'duration_ms': duration_ms,

            # WHERE
            'tenant_id': getattr(request, 'jwt_tenant_id', None),
        }

        # Log changes for write operations
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            audit_record['changes'] = self._extract_changes(
                request_body, response
            )

        # Write audit log asynchronously
        write_audit_log.delay(audit_record)

        return response

    def _get_request_body(self, request) -> dict:
        """Safely extract request body"""
        try:
            if request.content_type == 'application/json':
                body = json.loads(request.body.decode('utf-8'))
                # Mask sensitive fields
                return self._mask_sensitive_fields(body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass
        return {}

    def _mask_sensitive_fields(self, data: dict) -> dict:
        """Mask PII/secrets in audit logs"""
        sensitive_fields = ['password', 'ssn', 'dob', 'token', 'secret', 'api_key']

        if not isinstance(data, dict):
            return data

        masked = {}
        for key, value in data.items():
            key_lower = key.lower()
            if any(sf in key_lower for sf in sensitive_fields):
                masked[key] = '[REDACTED]'
            elif isinstance(value, dict):
                masked[key] = self._mask_sensitive_fields(value)
            else:
                masked[key] = value

        return masked

    def _extract_resource(self, path: str) -> str:
        """Extract resource from path"""
        parts = path.strip('/').split('/')
        if len(parts) >= 3 and parts[0] == 'api' and parts[1].startswith('v'):
            return parts[2]
        return path.split('/')[1] if '/' in path else path

    def _extract_action(self, method: str, path: str) -> str:
        """Extract action from method and path"""
        method_map = {
            'GET': 'read', 'POST': 'create', 'PUT': 'update',
            'PATCH': 'update', 'DELETE': 'delete'
        }

        # Check for special actions
        if '/approve' in path:
            return 'approve'
        if '/export' in path:
            return 'export'

        return method_map.get(method, 'unknown')

    def _extract_resource_id(self, path: str) -> str:
        """Extract resource ID from path"""
        import re
        uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
        match = re.search(uuid_pattern, path, re.IGNORECASE)
        return match.group() if match else None

    def _extract_changes(self, request_body: dict, response) -> dict:
        """Extract before/after changes"""
        # Response may contain the updated resource
        try:
            response_body = json.loads(response.content.decode('utf-8'))
            return {
                'requested_changes': request_body,
                'result': response_body if response.status_code < 400 else None
            }
        except:
            return {'requested_changes': request_body}

    def _get_client_ip(self, request) -> str:
        """Get client IP"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', 'unknown')
```

---

## 2. Webhook Handlers

### 2.1 Base Webhook Handler

```python
# backend/pcs/webhooks/base.py

import hmac
import hashlib
import json
from abc import ABC, abstractmethod
from django.http import JsonResponse, HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from pcs.kafka import ComplianceEventProducer

@method_decorator(csrf_exempt, name='dispatch')
class BaseWebhookHandler(View, ABC):
    """
    Base class for vendor webhook handlers.

    Implements:
    - Signature verification
    - Idempotency checking
    - Event normalization
    - Kafka publishing
    """

    vendor_name: str = None
    signature_header: str = None

    def post(self, request):
        # Verify signature
        if not self.verify_signature(request):
            return JsonResponse(
                {'error': 'Invalid signature'},
                status=401
            )

        # Parse payload
        try:
            payload = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse(
                {'error': 'Invalid JSON payload'},
                status=400
            )

        # Check idempotency
        event_id = self.get_event_id(payload)
        if self.is_duplicate(event_id):
            return HttpResponse(status=200)  # Acknowledge duplicate

        # Normalize to standard format
        normalized = self.normalize_event(payload)

        # Resolve tenant and employee
        tenant_id, employee_id = self.resolve_identifiers(payload)

        if not tenant_id or not employee_id:
            return JsonResponse(
                {'error': 'Could not resolve tenant or employee'},
                status=400
            )

        # Publish to Kafka
        producer = ComplianceEventProducer()
        producer.produce_compliance_event(
            module=self.get_module(),
            event_type=normalized['event_type'],
            tenant_id=tenant_id,
            employee_id=employee_id,
            payload=normalized,
            idempotency_key=event_id
        )

        # Mark as processed
        self.mark_processed(event_id)

        return HttpResponse(status=200)

    @abstractmethod
    def verify_signature(self, request) -> bool:
        """Verify webhook signature"""
        pass

    @abstractmethod
    def get_event_id(self, payload: dict) -> str:
        """Extract unique event ID"""
        pass

    @abstractmethod
    def normalize_event(self, payload: dict) -> dict:
        """Normalize vendor payload to standard format"""
        pass

    @abstractmethod
    def get_module(self) -> str:
        """Return compliance module name"""
        pass

    @abstractmethod
    def resolve_identifiers(self, payload: dict) -> tuple:
        """Resolve tenant_id and employee_id from payload"""
        pass

    def is_duplicate(self, event_id: str) -> bool:
        """Check if event already processed"""
        from django.core.cache import cache
        key = f"webhook:{self.vendor_name}:{event_id}"
        return cache.get(key) is not None

    def mark_processed(self, event_id: str):
        """Mark event as processed"""
        from django.core.cache import cache
        key = f"webhook:{self.vendor_name}:{event_id}"
        cache.set(key, True, 24 * 60 * 60)  # 24-hour TTL
```

### 2.2 Checkr Webhook Handler (Background Checks)

```python
# backend/pcs/webhooks/checkr.py

import hmac
import hashlib
from pcs.webhooks.base import BaseWebhookHandler
from pcs.models import BackgroundCheck
from django.conf import settings

class CheckrWebhookHandler(BaseWebhookHandler):
    """
    Checkr webhook handler for background check results.

    Events:
    - report.completed: Background check completed
    - report.upgraded: Additional check added
    - candidate.pre_adverse_action: Pre-adverse action initiated
    """

    vendor_name = 'checkr'
    signature_header = 'X-Checkr-Signature'

    def verify_signature(self, request) -> bool:
        """Verify Checkr HMAC signature"""
        signature = request.headers.get(self.signature_header)
        if not signature:
            return False

        expected = hmac.new(
            settings.CHECKR_WEBHOOK_SECRET.encode('utf-8'),
            request.body,
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(signature, expected)

    def get_event_id(self, payload: dict) -> str:
        """Extract Checkr event ID"""
        return payload.get('id')

    def get_module(self) -> str:
        return 'background'

    def normalize_event(self, payload: dict) -> dict:
        """Normalize Checkr payload"""
        event_type = payload.get('type', '')

        # Map Checkr event types to PCS event types
        type_map = {
            'report.completed': 'screening_completed',
            'report.upgraded': 'screening_updated',
            'candidate.pre_adverse_action': 'adverse_action_initiated',
            'candidate.post_adverse_action': 'adverse_action_completed',
        }

        report = payload.get('data', {}).get('object', {})

        return {
            'event_type': type_map.get(event_type, 'unknown'),
            'vendor': 'checkr',
            'vendor_event_id': payload.get('id'),
            'vendor_event_type': event_type,
            'report_id': report.get('id'),
            'candidate_id': report.get('candidate_id'),
            'status': report.get('status'),
            'result': report.get('result'),
            'adjudication': report.get('adjudication'),
            'completed_at': report.get('completed_at'),
            'turnaround_time': report.get('turnaround_time'),
            'raw_payload': payload,
        }

    def resolve_identifiers(self, payload: dict) -> tuple:
        """Resolve tenant and employee from Checkr candidate"""
        report = payload.get('data', {}).get('object', {})
        candidate_id = report.get('candidate_id')

        if not candidate_id:
            return None, None

        # Lookup in our database
        try:
            check = BackgroundCheck.objects.select_related('employee').get(
                vendor_candidate_id=candidate_id
            )
            return str(check.tenant_id), str(check.employee_id)
        except BackgroundCheck.DoesNotExist:
            return None, None
```

### 2.3 Quest Webhook Handler (Drug Tests)

```python
# backend/pcs/webhooks/quest.py

import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.x509 import load_pem_x509_certificate
from pcs.webhooks.base import BaseWebhookHandler
from pcs.models import DrugTest
from django.conf import settings

class QuestWebhookHandler(BaseWebhookHandler):
    """
    Quest Diagnostics webhook handler for drug test results.

    Events:
    - LAB_RESULT: Lab result received
    - MRO_REVIEW: MRO review completed
    - COLLECTION_COMPLETED: Specimen collected
    """

    vendor_name = 'quest'
    signature_header = 'X-Quest-Signature'

    def verify_signature(self, request) -> bool:
        """Verify Quest RSA signature"""
        signature = request.headers.get(self.signature_header)
        if not signature:
            return False

        try:
            # Load Quest's public certificate
            cert_pem = settings.QUEST_PUBLIC_CERT
            cert = load_pem_x509_certificate(cert_pem.encode('utf-8'))
            public_key = cert.public_key()

            # Verify signature
            signature_bytes = base64.b64decode(signature)
            public_key.verify(
                signature_bytes,
                request.body,
                padding.PKCS1v15(),
                hashes.SHA256()
            )
            return True
        except Exception:
            return False

    def get_event_id(self, payload: dict) -> str:
        """Extract Quest message ID"""
        return payload.get('messageId') or payload.get('specimenId')

    def get_module(self) -> str:
        return 'drug_alcohol'

    def normalize_event(self, payload: dict) -> dict:
        """Normalize Quest payload to standard format"""
        event_type = payload.get('eventType', '')

        type_map = {
            'LAB_RESULT': 'test_completed',
            'MRO_REVIEW': 'mro_review_completed',
            'COLLECTION_COMPLETED': 'collection_completed',
            'CLEARINGHOUSE_REPORTED': 'clearinghouse_reported',
        }

        return {
            'event_type': type_map.get(event_type, 'unknown'),
            'vendor': 'quest',
            'vendor_event_id': payload.get('messageId'),
            'vendor_event_type': event_type,
            'specimen_id': payload.get('specimenId'),
            'order_id': payload.get('orderId'),
            'result': payload.get('result'),  # NEGATIVE, NON_NEGATIVE, etc.
            'mro_result': payload.get('mroResult'),
            'collected_at': payload.get('collectionDate'),
            'resulted_at': payload.get('resultDate'),
            'panels': payload.get('panels', []),
            'raw_payload': payload,
        }

    def resolve_identifiers(self, payload: dict) -> tuple:
        """Resolve tenant and employee from Quest order"""
        order_id = payload.get('orderId')

        if not order_id:
            return None, None

        try:
            test = DrugTest.objects.select_related('employee').get(
                vendor_order_id=order_id
            )
            return str(test.tenant_id), str(test.employee_id)
        except DrugTest.DoesNotExist:
            return None, None
```

### 2.4 FMCSA Clearinghouse Webhook Handler

```python
# backend/pcs/webhooks/fmcsa.py

from pcs.webhooks.base import BaseWebhookHandler
from pcs.models import Employee, DOTRecord
from django.conf import settings

class FMCSAWebhookHandler(BaseWebhookHandler):
    """
    FMCSA Clearinghouse webhook handler.

    Events:
    - QUERY_RESPONSE: Pre-employment query response
    - VIOLATION_NOTIFICATION: New violation reported
    - RETURN_TO_DUTY: RTD process update
    """

    vendor_name = 'fmcsa'
    signature_header = 'X-FMCSA-Signature'

    def verify_signature(self, request) -> bool:
        """Verify FMCSA signature (API key + timestamp)"""
        # FMCSA uses a different auth mechanism
        api_key = request.headers.get('X-FMCSA-API-Key')
        timestamp = request.headers.get('X-FMCSA-Timestamp')
        signature = request.headers.get(self.signature_header)

        if not all([api_key, timestamp, signature]):
            return False

        # Verify API key matches
        if api_key != settings.FMCSA_API_KEY:
            return False

        # Verify timestamp is recent (within 5 minutes)
        import time
        try:
            ts = int(timestamp)
            if abs(time.time() - ts) > 300:
                return False
        except ValueError:
            return False

        # Verify HMAC signature
        import hmac
        import hashlib

        message = f"{timestamp}{request.body.decode('utf-8')}"
        expected = hmac.new(
            settings.FMCSA_WEBHOOK_SECRET.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(signature, expected)

    def get_event_id(self, payload: dict) -> str:
        """Extract FMCSA transaction ID"""
        return payload.get('transactionId')

    def get_module(self) -> str:
        return 'dot'

    def normalize_event(self, payload: dict) -> dict:
        """Normalize FMCSA payload"""
        event_type = payload.get('notificationType', '')

        type_map = {
            'QUERY_RESPONSE': 'clearinghouse_query_completed',
            'VIOLATION_NOTIFICATION': 'clearinghouse_violation_received',
            'RETURN_TO_DUTY': 'clearinghouse_rtd_update',
        }

        return {
            'event_type': type_map.get(event_type, 'unknown'),
            'vendor': 'fmcsa',
            'vendor_event_id': payload.get('transactionId'),
            'vendor_event_type': event_type,
            'driver_license': payload.get('cdlNumber'),
            'query_result': payload.get('queryResult'),  # 'clear' or 'hit'
            'violations': payload.get('violations', []),
            'query_date': payload.get('queryDate'),
            'raw_payload': payload,
        }

    def resolve_identifiers(self, payload: dict) -> tuple:
        """Resolve tenant and employee from CDL number"""
        cdl_number = payload.get('cdlNumber')
        cdl_state = payload.get('cdlState')

        if not cdl_number:
            return None, None

        try:
            # Find employee by CDL
            record = DOTRecord.objects.select_related('employee').get(
                cdl_number=cdl_number,
                cdl_state=cdl_state
            )
            return str(record.tenant_id), str(record.employee_id)
        except DOTRecord.DoesNotExist:
            return None, None
```

---

## 3. DRF Serializers with Field Masking

### 3.1 Base Serializer with PII Masking

```python
# backend/pcs/serializers/base.py

from rest_framework import serializers

class PIIMaskingMixin:
    """
    Mixin for serializers that need PII masking.

    Masks sensitive fields based on user scopes:
    - pii.read: Can see full SSN, DOB
    - phi.read: Can see medical data
    - payroll.read: Can see salary data
    """

    PII_FIELDS = {
        'ssn': {'mask': '***-**-{last4}', 'scope': 'pii.read'},
        'dob': {'mask': '****-**-{day}', 'scope': 'pii.read'},
        'salary': {'mask': None, 'scope': 'payroll.read'},
        'medical_notes': {'mask': '[REDACTED]', 'scope': 'phi.read'},
    }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        if not request:
            return data

        user_scopes = getattr(request, 'jwt_scopes', [])

        for field_name, config in self.PII_FIELDS.items():
            if field_name not in data:
                continue

            if config['scope'] not in user_scopes:
                data[field_name] = self._mask_field(
                    field_name, data[field_name], config['mask'], instance
                )

        return data

    def _mask_field(self, field_name, value, mask_pattern, instance):
        """Apply mask pattern to field value"""
        if value is None:
            return None

        if mask_pattern is None:
            return None  # Hide completely

        if field_name == 'ssn':
            last4 = getattr(instance, 'ssn_last_four', value[-4:] if value else '')
            return mask_pattern.format(last4=last4)

        if field_name == 'dob':
            day = value.split('-')[2] if isinstance(value, str) else str(value.day)
            return mask_pattern.format(day=day)

        return mask_pattern


class BaseModelSerializer(PIIMaskingMixin, serializers.ModelSerializer):
    """Base serializer with PII masking for all model serializers"""
    pass
```

### 3.2 Employee Serializer

```python
# backend/pcs/serializers/employee.py

from rest_framework import serializers
from pcs.serializers.base import BaseModelSerializer
from pcs.models import Employee

class EmployeeListSerializer(BaseModelSerializer):
    """
    Serializer for employee list views.

    Minimal data for performance, with PII masking.
    """

    full_name = serializers.SerializerMethodField()
    compliance_badge = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_number', 'full_name', 'email',
            'department', 'status', 'compliance_status',
            'compliance_badge', 'location_id',
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_compliance_badge(self, obj):
        """Return compliance badge with color and issues count"""
        return {
            'status': obj.compliance_status,
            'color': self._get_badge_color(obj.compliance_status),
            'issues_count': self._count_issues(obj),
        }

    def _get_badge_color(self, status):
        colors = {'green': '#22c55e', 'yellow': '#eab308', 'red': '#ef4444'}
        return colors.get(status, '#9ca3af')

    def _count_issues(self, obj):
        data = obj.compliance_data or {}
        return sum(
            1 for module_data in data.values()
            if isinstance(module_data, dict) and module_data.get('status') != 'green'
        )


class EmployeeDetailSerializer(BaseModelSerializer):
    """
    Serializer for employee detail views.

    Full data with PII masking based on permissions.
    """

    # Masked PII fields
    ssn = serializers.CharField(source='get_ssn_masked')
    ssn_full = serializers.SerializerMethodField()  # Only if pii.read scope
    dob = serializers.DateField()

    # Related data
    compliance_summary = serializers.SerializerMethodField()
    recent_events = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'employee_number', 'first_name', 'last_name', 'email', 'phone',
            'ssn', 'ssn_full', 'dob',
            'status', 'hire_date', 'termination_date', 'department',
            'division_id', 'location_id', 'employee_group_id',
            'compliance_status', 'compliance_data', 'compliance_summary',
            'lifecycle_events', 'recent_events',
            'created_at', 'updated_at',
        ]

    def get_ssn_full(self, obj):
        """Return full SSN only if user has pii.read scope"""
        request = self.context.get('request')
        if request and 'pii.read' in getattr(request, 'jwt_scopes', []):
            return obj.get_ssn()  # Decrypt and return full SSN
        return None

    def get_compliance_summary(self, obj):
        """Return compliance summary by module"""
        data = obj.compliance_data or {}
        return {
            module: {
                'status': module_data.get('status', 'unknown'),
                'last_check': module_data.get('last_check'),
                'next_due': module_data.get('next_due'),
                'issues': module_data.get('issues', []),
            }
            for module, module_data in data.items()
            if isinstance(module_data, dict)
        }

    def get_recent_events(self, obj):
        """Return last 10 lifecycle events"""
        events = obj.lifecycle_events or []
        return events[-10:] if events else []


class EmployeeBulkCreateSerializer(serializers.Serializer):
    """Serializer for bulk employee creation"""

    employees = EmployeeCreateSerializer(many=True)

    def validate_employees(self, value):
        if len(value) > 500:
            raise serializers.ValidationError(
                "Maximum 500 employees per bulk operation"
            )
        return value

    def create(self, validated_data):
        employees = validated_data['employees']

        # Use bulk_create for performance
        employee_objects = [
            Employee(**emp_data) for emp_data in employees
        ]

        return Employee.objects.bulk_create(employee_objects, batch_size=100)
```

### 3.3 Drug Test Serializer

```python
# backend/pcs/serializers/drug_testing.py

from rest_framework import serializers
from pcs.serializers.base import BaseModelSerializer
from pcs.models import DrugTest

class DrugTestSerializer(BaseModelSerializer):
    """
    Drug test serializer with role-based field visibility.

    - All roles: See test status, result type
    - DER/SafetyManager: See MRO notes
    - CompanyAdmin: See all details
    """

    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    result_display = serializers.SerializerMethodField()
    mro_notes = serializers.SerializerMethodField()

    class Meta:
        model = DrugTest
        fields = [
            'id', 'employee_id', 'employee_name',
            'test_type', 'test_reason', 'status',
            'ordered_at', 'collected_at', 'resulted_at',
            'result', 'result_display', 'mro_result', 'mro_notes',
            'vendor', 'vendor_order_id',
            'clearinghouse_reported', 'clearinghouse_reported_at',
        ]

    def get_result_display(self, obj):
        """Return user-friendly result display"""
        result_map = {
            'NEGATIVE': 'Negative',
            'NON_NEGATIVE': 'Non-Negative (Pending MRO)',
            'POSITIVE': 'Positive',
            'REFUSED': 'Refused',
            'CANCELLED': 'Cancelled',
        }
        return result_map.get(obj.result, obj.result)

    def get_mro_notes(self, obj):
        """Return MRO notes only for authorized roles"""
        request = self.context.get('request')
        if not request:
            return None

        role = getattr(request, 'jwt_role', '')
        if role in ['DER', 'SafetyManager', 'CompanyAdmin', 'ComplianceManager']:
            return obj.mro_notes
        return None


class RandomSelectionSerializer(serializers.Serializer):
    """Serializer for random drug test selection"""

    pool_size = serializers.IntegerField(min_value=1)
    selection_percentage = serializers.FloatField(min_value=1, max_value=100)
    test_type = serializers.ChoiceField(choices=['DOT', 'NON_DOT'])
    reason = serializers.ChoiceField(choices=['RANDOM', 'QUARTERLY'])
    location_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False
    )

    def validate(self, data):
        # Ensure selection produces at least 1 employee
        expected_selections = int(data['pool_size'] * data['selection_percentage'] / 100)
        if expected_selections < 1:
            raise serializers.ValidationError(
                "Selection parameters would result in 0 employees selected"
            )
        return data
```

---

## 4. API Versioning

### 4.1 URL Configuration

```python
# backend/pcs/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# V1 Router
router_v1 = DefaultRouter()
router_v1.register(r'employees', EmployeeViewSet, basename='employees')
router_v1.register(r'drug-testing', DrugTestViewSet, basename='drug-testing')
router_v1.register(r'background', BackgroundCheckViewSet, basename='background')
router_v1.register(r'dot', DOTRecordViewSet, basename='dot')
router_v1.register(r'health', HealthRecordViewSet, basename='health')
router_v1.register(r'training', TrainingRecordViewSet, basename='training')
router_v1.register(r'geo-fencing', GeoFenceViewSet, basename='geo-fencing')

urlpatterns = [
    # API v1
    path('api/v1/', include([
        path('', include(router_v1.urls)),
        path('auth/', include('pcs.auth.urls')),
        path('der-iq/', include('pcs.der_iq.urls')),
        path('reports/', include('pcs.reports.urls')),
    ])),

    # Webhooks (unversioned)
    path('webhooks/', include('pcs.webhooks.urls')),

    # Health check
    path('health', health_check, name='health'),
]

# Version deprecation headers middleware
class APIVersionMiddleware:
    """Add deprecation warnings for old API versions"""

    DEPRECATED_VERSIONS = {
        # 'v1': {'deprecated': '2026-01-01', 'sunset': '2027-01-01'}
    }

    def __call__(self, request):
        response = self.get_response(request)

        # Check for deprecated version
        for version, dates in self.DEPRECATED_VERSIONS.items():
            if f'/api/{version}/' in request.path:
                response['Deprecation'] = dates['deprecated']
                response['Sunset'] = dates['sunset']
                response['Link'] = '</api/v2/>; rel="successor-version"'

        return response
```

---

## 5. Action Plan

### Phase 1: Middleware Stack (Week 1)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement SecurityHeadersMiddleware | High | 0.5 days | None |
| Implement TenantResolutionMiddleware | High | 1 day | Tenant model |
| Implement JWTAuthenticationMiddleware | High | 1 day | JWT library |
| Implement RBACPermissionMiddleware | High | 2 days | RBAC tables |
| Implement RateLimitMiddleware | Medium | 1 day | Redis |
| Implement IdempotencyMiddleware | Medium | 1 day | Redis |
| Implement AuditLogMiddleware | High | 1 day | Audit table |

**Deliverables:**
- [ ] All 7 middleware components implemented
- [ ] Middleware stack configured in settings
- [ ] Unit tests for each middleware
- [ ] Integration tests for full stack

### Phase 2: Webhook Handlers (Week 2)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement BaseWebhookHandler | High | 1 day | Kafka producer |
| Implement CheckrWebhookHandler | High | 1 day | Base handler |
| Implement QuestWebhookHandler | High | 1 day | Base handler |
| Implement FMCSAWebhookHandler | High | 1 day | Base handler |
| Implement TazWorksWebhookHandler | Medium | 1 day | Base handler |
| Set up webhook monitoring | Medium | 0.5 days | CloudWatch |

**Deliverables:**
- [ ] All webhook handlers implemented
- [ ] Signature verification for each vendor
- [ ] Idempotency handling
- [ ] Kafka event publishing
- [ ] Webhook monitoring dashboard

### Phase 3: Serializers & Views (Week 3)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Implement PIIMaskingMixin | High | 1 day | None |
| Create Employee serializers | High | 1 day | Models |
| Create DrugTest serializers | High | 1 day | Models |
| Create Background serializers | High | 1 day | Models |
| Create DOT serializers | High | 0.5 days | Models |
| Create Training serializers | Medium | 0.5 days | Models |
| Create GeoFence serializers | Medium | 0.5 days | Models |
| Implement ViewSets | High | 2 days | Serializers |

**Deliverables:**
- [ ] All serializers with PII masking
- [ ] Role-based field visibility
- [ ] CRUD ViewSets for all modules
- [ ] Bulk operation endpoints
- [ ] OpenAPI schema generated

### Phase 4: Testing & Documentation (Week 4)

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Write middleware unit tests | High | 2 days | All middleware |
| Write webhook integration tests | High | 1 day | Webhook handlers |
| Write serializer tests | Medium | 1 day | Serializers |
| Generate OpenAPI documentation | Medium | 0.5 days | All endpoints |
| Performance testing | Medium | 1 day | All components |

**Deliverables:**
- [ ] >90% test coverage for middleware
- [ ] Webhook test harness
- [ ] OpenAPI 3.0 spec
- [ ] Performance baseline established

---

## 6. Security Considerations

### OWASP Top 10 Mitigations

| Vulnerability | Mitigation |
|---------------|------------|
| A01 Broken Access Control | RBAC middleware, RLS policies |
| A02 Cryptographic Failures | TLS 1.3, KMS encryption, secure JWT |
| A03 Injection | Parameterized queries, Zod validation |
| A04 Insecure Design | Defense in depth, dual-control |
| A05 Security Misconfiguration | Security headers, secure defaults |
| A06 Vulnerable Components | Dependency scanning (Snyk) |
| A07 Auth Failures | JWT + MFA, session management |
| A08 Data Integrity | Idempotency, HMAC signatures |
| A09 Logging Failures | Comprehensive audit logging |
| A10 SSRF | URL validation, allowlists |

---

**Document Status**: Implementation ready
**Author**: Architecture Team
**Last Review**: 2025-11-26
**Next Review**: Post Phase 1 implementation

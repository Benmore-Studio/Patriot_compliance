# CLAUDE.md - Backend (Django)

This file provides guidance to Claude Code when working with the Django backend for the Patriot Compliance Systems (PCS).

# Project Overview

The backend is a Django REST API that powers the Patriot Compliance Systems platform. It handles:

- **Multi-tenant data isolation** - Each service company operates in isolated database schemas
- **User authentication & authorization** - Email OTP, SSO, MFA support
- **Compliance module APIs** - Drug testing, background checks, DOT, occupational health, training
- **Business logic** - MRO workflows, adjudication, adverse actions, geofencing
- **External integrations** - Payment processing, third-party screening vendors, clearinghouse APIs
- **Real-time features** - WebSocket support for notifications and live updates

The API serves multiple client applications (web portals, mobile apps) with role-based access control across all endpoints.

# Skills Protocol (Superpowers)

## Mandatory First Response Protocol

Before responding to ANY user message, you MUST complete this checklist:

1. ☐ List available skills in your mind
2. ☐ Ask yourself: "Does ANY skill match this request?"
3. ☐ If yes → Use the Skill tool to read and run the skill file
4. ☐ Announce which skill you're using
5. ☐ Follow the skill exactly

**Responding WITHOUT completing this checklist = automatic failure.**

If a skill for your task exists, you must use it or you will fail at your task.

## Key Principles

1. **Finding a relevant skill = mandatory to read and use it.** Not optional.
2. **Skills document proven techniques** that save time and prevent mistakes.
3. **Always announce** which skill you're using and why.
4. **Follow skills exactly** - don't rationalize away the discipline.
5. **Create TodoWrite todos** for any skill checklists.

# Architecture

This Django backend follows a layered architecture pattern with clear separation of concerns:

```
backend/
├── manage.py                          # Django management script
├── requirements.txt                   # Python dependencies
├── pytest.ini                         # Pytest configuration
├── .env.example                       # Environment variables template
│
├── config/                            # Django project settings
│   ├── __init__.py
│   ├── settings.py                   # Main settings (split by environment)
│   ├── asgi.py                       # ASGI config for WebSockets
│   ├── wsgi.py                       # WSGI config for production
│   ├── urls.py                       # Root URL configuration
│   └── logging.py                    # Logging configuration
│
├── apps/                              # Django applications (modular)
│   ├── users/                         # User management & authentication
│   │   ├── models.py                 # User, Role, Permission models
│   │   ├── serializers.py            # DRF serializers
│   │   ├── views.py                  # API views
│   │   ├── urls.py                   # App URL patterns
│   │   ├── permissions.py            # Custom permission classes
│   │   ├── tokens.py                 # JWT/OTP token management
│   │   └── tests.py
│   │
│   ├── tenants/                       # Multi-tenant management
│   │   ├── models.py                 # Tenant model
│   │   ├── middleware.py             # Tenant routing middleware
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── tests.py
│   │
│   ├── employees/                     # Employee data management
│   │   ├── models.py                 # Employee model
│   │   ├── serializers.py
│   │   ├── views.py                  # List, create, retrieve, update
│   │   ├── bulk.py                   # Bulk upload/import handlers
│   │   └── tests.py
│   │
│   ├── compliance/                    # Core compliance logic
│   │   ├── models.py                 # Compliance-related models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── business_logic.py         # Core compliance workflows
│   │   └── tests.py
│   │
│   ├── drug_testing/                  # Drug & alcohol testing module
│   │   ├── models.py                 # DrugTest, MROReview models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── mro_service.py            # MRO workflow logic
│   │   ├── clearinghouse.py          # Clearinghouse integration
│   │   └── tests.py
│   │
│   ├── background_checks/             # Background screening module
│   │   ├── models.py                 # BackgroundCheck model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── adjudication.py           # Adjudication workflows
│   │   ├── vendor_integration.py     # TazWorks, etc.
│   │   └── tests.py
│   │
│   ├── dot_compliance/                # DOT compliance module
│   │   ├── models.py                 # DOTRecord, DOTDocument models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── clearinghouse.py          # FMCSA clearinghouse API
│   │   ├── dq_file.py                # Driver qualification file logic
│   │   └── tests.py
│   │
│   ├── health/                        # Occupational health module
│   │   ├── models.py                 # HealthRecord model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── osha_300.py               # OSHA 300 logging
│   │   └── tests.py
│   │
│   ├── training/                      # Training & certifications module
│   │   ├── models.py                 # TrainingRecord model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── expiration_alerts.py      # Certificate expiration tracking
│   │   └── tests.py
│   │
│   ├── geofencing/                    # Geofencing module
│   │   ├── models.py                 # GeoZone, CheckIn models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── location_service.py       # Location tracking logic
│   │   └── tests.py
│   │
│   ├── communications/                # Messaging & notifications
│   │   ├── models.py                 # Communication, Message models
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── email_service.py          # Email sending
│   │   ├── sms_service.py            # SMS/Twilio integration
│   │   └── tests.py
│   │
│   ├── reports/                       # Reporting & analytics
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── generators.py             # Report generation logic
│   │   └── tests.py
│   │
│   ├── audit/                         # Audit logging
│   │   ├── models.py                 # AuditLog model
│   │   ├── signals.py                # Auto-logging via Django signals
│   │   └── tests.py
│   │
│   └── api/                           # API aggregation & versioning
│       ├── v1/
│       │   ├── urls.py
│       │   └── views.py              # API gateway/aggregation
│       └── v2/ (future)
│
├── lib/                               # Shared utilities
│   ├── permissions.py                # Permission mixins/decorators
│   ├── serializers.py                # Base serializer classes
│   ├── views.py                      # Base view classes
│   ├── decorators.py                 # Custom decorators
│   ├── exceptions.py                 # Custom exception classes
│   ├── validators.py                 # Reusable validators
│   └── utils.py                      # General utilities
│
├── integrations/                      # External service integrations
│   ├── stripe.py                     # Stripe payment processing
│   ├── twilio.py                     # SMS/MFA via Twilio
│   ├── sendgrid.py                   # Email via SendGrid
│   ├── slack.py                      # Slack notifications
│   ├── oauth_providers.py            # OAuth (Google, Okta, Azure)
│   └── vendor_apis/
│       ├── tazworks.py               # Background check vendor
│       ├── fmcsa_clearinghouse.py   # DOT clearinghouse
│       └── quest_health.py           # Health screening vendor
│
├── migrations/                        # Django database migrations
│   └── 0001_initial.py
│
└── tests/                             # Test suite
    ├── conftest.py                   # Pytest fixtures
    ├── factories.py                  # Factory Boy factories
    ├── test_users.py
    ├── test_compliance.py
    └── integration/
        └── test_workflows.py
```

## Key Architectural Patterns

- **Multi-tenancy with PostgreSQL schemas**: Each tenant gets isolated database schema
- **Middleware-based tenant routing**: TenantMiddleware determines active tenant from request
- **Service layer pattern**: Business logic in dedicated service classes (e.g., `MROService`, `AdjudicationService`)
- **Celery for async tasks**: Background jobs for email, webhooks, external API calls
- **Django Signals for audit logging**: Automatic tracking of data changes
- **DRF ViewSets with custom permissions**: RESTful API with RBAC

# Development Guidelines

## General

- Before implementing a large refactor or new feature, explain your plan and get approval.
- Use existing libraries and patterns from the codebase - consistency matters.
- Write tests for all business logic and API endpoints.
- Follow Django and DRF conventions - they exist for good reasons.

## Python/Django

`pip` or `poetry` manages dependencies. Common commands:

- `pip install -r requirements.txt` - Install dependencies
- `pip install -r requirements-dev.txt` - Install dev dependencies
- `python manage.py runserver` - Start development server (port 8000)
- `python manage.py migrate` - Run database migrations
- `python manage.py makemigrations` - Create new migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py test` - Run tests (or `pytest` for modern testing)
- `celery -A config worker -l info` - Start Celery worker

### Technology Stack

- **Django 4.2+**: Web framework with ORM, admin, auth system
- **Django REST Framework**: RESTful API development
- **PostgreSQL 13+**: Multi-tenant database with schema isolation
- **Celery**: Distributed task queue for async processing
- **Redis**: Message broker for Celery, caching
- **Pytest**: Modern testing framework with fixtures
- **Factory Boy**: Test data generation
- **python-jose**: JWT token handling
- **pyotp**: OTP/MFA implementation
- **Stripe**: Payment processing
- **Twilio**: SMS & phone OTP
- **SendGrid**: Email sending
- **drf-spectacular**: OpenAPI/Swagger documentation

### Code Organization and Modularity

Each Django app (users, compliance, drug_testing, etc.) should:

- Have a single, clear responsibility
- Include models, serializers, views, URLs, permissions, and tests
- Not import from unrelated apps (except through public APIs)
- Provide a clean public API through its serializers and views
- Include service classes for complex business logic

**Import organization:**
1. Django imports
2. Third-party imports (DRF, Celery, etc.)
3. Local app imports (this app's modules)
4. Other local apps (imported as needed)

# Code Style

## Documentation

**Python docstrings follow Google style:**

```python
def process_mro_review(test_id: str, reviewer_id: str, result: str) -> Dict[str, Any]:
    """Process MRO review of a drug test result.

    Args:
        test_id: The drug test ID to review.
        reviewer_id: The MRO staff member performing review.
        result: The adjudication result (VERIFIED_NEGATIVE, VERIFIED_POSITIVE, etc.).

    Returns:
        Updated test object with review details.

    Raises:
        ValueError: If test_id doesn't exist or review is invalid.
    """
```

- Avoid documenting obvious functions
- Document why and how, not what (code shows what)
- Focus on edge cases and non-obvious behavior
- Document public APIs thoroughly

## Python Code Style

### Naming Conventions

- **Functions/Variables**: `snake_case`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Django Models**: `PascalCase` (singular, e.g., `DrugTest`, not `DrugTests`)
- **Database fields**: `snake_case`

### Django-Specific Patterns

```python
# Models: Always define Meta with app_label, ordering, verbose_name
class DrugTest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    test_date = models.DateTimeField()
    result = models.CharField(max_length=20, choices=TestResult.choices)

    class Meta:
        app_label = 'drug_testing'
        ordering = ['-test_date']
        verbose_name = 'Drug Test'
        verbose_name_plural = 'Drug Tests'

# Serializers: Use nested serializers for relationships
class DrugTestSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)

    class Meta:
        model = DrugTest
        fields = ['id', 'employee', 'test_date', 'result', 'created_at']

# Views: Use ViewSets with custom permissions
class DrugTestViewSet(viewsets.ModelViewSet):
    queryset = DrugTest.objects.all()
    serializer_class = DrugTestSerializer
    permission_classes = [IsAuthenticated, IsTenantUser, HasDrugTestingAccess]
```

# Test-Driven Development (TDD)

- Write tests for all business logic and API endpoints
- Test database queries and multi-tenant isolation
- Use Pytest with fixtures and factory_boy

## Testing Guidelines

- Test framework: **Pytest** (configured in `pytest.ini`)
- Test data: **Factory Boy** for creating test objects
- Test location: `tests/` directory or `tests.py` in each app
- Fixtures: Centralized in `tests/conftest.py`

**Test coverage targets:**
- API endpoints: 90%+ coverage
- Business logic services: 95%+ coverage
- Models: 80%+ coverage
- Edge cases for RBAC and multi-tenant isolation: 100%

**Example test structure:**
```python
# tests/test_drug_testing.py
import pytest
from drug_testing.models import DrugTest
from drug_testing.serializers import DrugTestSerializer
from .factories import DrugTestFactory, EmployeeFactory

@pytest.mark.django_db
class TestDrugTestAPI:
    def test_list_drug_tests(self, authenticated_client, tenant):
        """Test listing drug tests for current tenant."""
        employee = EmployeeFactory(tenant=tenant)
        test = DrugTestFactory(employee=employee)

        response = authenticated_client.get('/api/drug-tests/')
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_mro_review_workflow(self, authenticated_user):
        """Test complete MRO review workflow."""
        # Test setup, workflow execution, assertions
        pass
```

# Tools

You have access to these tools for development:

- `sequential-thinking-tools` - For complex problem analysis
- `deepwiki` - For Django/DRF documentation and patterns
- `context7` - For quick library documentation lookups
- `pytest` - Testing framework (run with `pytest` or `python -m pytest`)

# Domain-Specific Guidance

## Multi-Tenant Architecture

- All models include a `tenant_id` or `ForeignKey` to Tenant
- Middleware automatically filters querysets by current tenant
- Never trust user input for tenant_id - always use request.tenant
- Test data isolation with multiple tenants

## Compliance Workflows

- **MRO Review**: DrugTest → MROReview → Clearinghouse
- **Adjudication**: BackgroundCheck → Adjudication → AversAction (if needed)
- **Certification Tracking**: TrainingRecord → ExpirationAlert → Renewal
- **Geofencing**: GeoZone → CheckIn → ComplianceReport

## Critical Business Rules

- Drug test results must go through MRO review before finalization
- DOT-regulated drivers require clearinghouse queries before hire
- Background check adverse actions require individualized assessment
- All data modifications trigger audit logs (via Django signals)
- Tenant isolation is enforced at every query level

# API Security Patterns

## Authentication Middleware

All API endpoints must use the authentication middleware. Production patterns:

```python
# lib/decorators.py
from functools import wraps
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from apps.users.models import User
from apps.audit.models import AuditLog

def with_auth(required_permissions=None, any_permission=False):
    """
    Decorator for API views requiring authentication and optional permissions.

    Args:
        required_permissions: List of permission strings required
        any_permission: If True, user needs ANY of the permissions (OR logic)
                       If False, user needs ALL permissions (AND logic)

    Usage:
        @with_auth()  # Just authentication
        @with_auth(['employees:read'])  # Requires specific permission
        @with_auth(['employees:read', 'employees:write'], any_permission=True)  # OR logic
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # 1. Extract token from Authorization header
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Missing or invalid Authorization header'}, status=401)

            token = auth_header[7:]  # Remove 'Bearer ' prefix

            # 2. Verify JWT token
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                tenant_id = access_token['tenant_id']
            except TokenError as e:
                return JsonResponse({'error': 'Invalid or expired token'}, status=401)

            # 3. Load user and verify active status
            try:
                user = User.objects.select_related('tenant').get(id=user_id, is_active=True)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found or inactive'}, status=401)

            # 4. Verify tenant matches
            if str(user.tenant_id) != str(tenant_id):
                return JsonResponse({'error': 'Tenant mismatch'}, status=403)

            # 5. Check permissions if required
            if required_permissions:
                user_permissions = get_user_permissions(user.role)

                if any_permission:
                    has_permission = any(p in user_permissions for p in required_permissions)
                else:
                    has_permission = all(p in user_permissions for p in required_permissions)

                if not has_permission:
                    # Log unauthorized access attempt
                    AuditLog.objects.create(
                        tenant_id=tenant_id,
                        user_id=user_id,
                        action='PERMISSION_DENIED',
                        resource=request.path,
                        details={'required': required_permissions, 'user_role': user.role},
                        ip_address=get_client_ip(request),
                        result='FAILURE'
                    )
                    return JsonResponse({'error': 'Insufficient permissions'}, status=403)

            # 6. Attach user and tenant to request
            request.user = user
            request.tenant_id = tenant_id

            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def get_user_permissions(role: str) -> set:
    """
    Get all permissions for a role.
    Maps to the RBAC matrix in specs/SECURITY.md
    """
    ROLE_PERMISSIONS = {
        'super_admin': {'*'},  # All permissions
        'system_admin': {
            'employees:read', 'employees:write', 'employees:delete',
            'drug_tests:read', 'drug_tests:write', 'drug_tests:order',
            'background_checks:read', 'background_checks:write', 'background_checks:order',
            'dot:read', 'dot:write', 'dot:query_clearinghouse',
            'health:read', 'health:write',
            'training:read', 'training:write',
            'geofencing:read', 'geofencing:write', 'geofencing:manage_zones',
            'reports:read', 'reports:export',
            'audit:read',
            'settings:read', 'settings:write',
            'users:read', 'users:write', 'users:invite',
        },
        'der': {
            'employees:read',
            'drug_tests:read', 'drug_tests:write', 'drug_tests:order',
            'reports:read', 'reports:export',
        },
        'safety_manager': {
            'employees:read',
            'drug_tests:read',
            'dot:read', 'dot:write',
            'health:read', 'health:write',
            'training:read', 'training:write',
            'geofencing:read',
            'reports:read', 'reports:export',
        },
        'compliance_officer': {
            'employees:read',
            'drug_tests:read', 'drug_tests:write',
            'background_checks:read', 'background_checks:write',
            'dot:read', 'dot:write',
            'health:read',
            'training:read',
            'geofencing:read',
            'reports:read', 'reports:export',
            'audit:read',
        },
        'field_worker': {
            'geofencing:check_in',
            'training:read_own',
        },
        'auditor': {
            'employees:read',
            'drug_tests:read',
            'background_checks:read',
            'dot:read',
            'health:read',
            'training:read',
            'geofencing:read',
            'reports:read', 'reports:export',
            'audit:read',
        },
    }
    return ROLE_PERMISSIONS.get(role, set())
```

## Tenant Isolation Middleware

All database queries must be scoped to the current tenant:

```python
# apps/tenants/middleware.py
from django.db import connection
from django.utils.deprecation import MiddlewareMixin

class TenantMiddleware(MiddlewareMixin):
    """
    Middleware that sets the tenant context for every request.
    Must run AFTER authentication middleware.
    """

    def process_request(self, request):
        # Tenant ID is set by authentication middleware
        tenant_id = getattr(request, 'tenant_id', None)

        if tenant_id:
            # Store in thread-local for model managers
            connection.tenant_id = tenant_id

    def process_response(self, request, response):
        # Clean up tenant context
        if hasattr(connection, 'tenant_id'):
            del connection.tenant_id
        return response


# lib/models.py - Base model with tenant isolation
from django.db import models

class TenantManager(models.Manager):
    """
    Custom manager that automatically filters by tenant_id.
    """
    def get_queryset(self):
        from django.db import connection
        qs = super().get_queryset()
        tenant_id = getattr(connection, 'tenant_id', None)
        if tenant_id:
            return qs.filter(tenant_id=tenant_id)
        return qs


class TenantScopedModel(models.Model):
    """
    Base model for all tenant-scoped data.
    """
    tenant_id = models.CharField(max_length=50, db_index=True)

    objects = TenantManager()
    all_objects = models.Manager()  # Escape hatch for admin/migrations

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # Ensure tenant_id is set
        from django.db import connection
        if not self.tenant_id and hasattr(connection, 'tenant_id'):
            self.tenant_id = connection.tenant_id
        super().save(*args, **kwargs)
```

## Tenant Query Patterns

```python
# CORRECT: Using tenant-scoped manager (automatic filtering)
employees = Employee.objects.all()  # Automatically filtered by request.tenant_id

# CORRECT: Explicit tenant filtering in complex queries
employees = Employee.objects.filter(
    tenant_id=request.tenant_id,
    status='ACTIVE'
).select_related('department')

# CORRECT: Validating ownership before updates
def update_employee(request, employee_id):
    employee = Employee.objects.filter(
        id=employee_id,
        tenant_id=request.tenant_id  # ALWAYS verify tenant
    ).first()

    if not employee:
        return JsonResponse({'error': 'Employee not found'}, status=404)

    # Proceed with update...

# WRONG: Never trust user input for tenant_id
def bad_update_employee(request, employee_id):
    tenant_id = request.data.get('tenant_id')  # NEVER DO THIS
    employee = Employee.objects.filter(id=employee_id, tenant_id=tenant_id).first()

# WRONG: Unscoped queries
def bad_list_employees(request):
    return Employee.all_objects.all()  # Leaks data across tenants!
```

## Audit Logging Decorator

```python
# lib/decorators.py
from functools import wraps
from apps.audit.models import AuditLog
import json

def audit_log(action: str, resource: str):
    """
    Decorator that automatically logs API actions.

    Usage:
        @audit_log('CREATE', 'drug_test')
        def create_drug_test(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Execute the view
            response = view_func(request, *args, **kwargs)

            # Determine success/failure
            result = 'SUCCESS' if 200 <= response.status_code < 400 else 'FAILURE'

            # Extract resource ID from response or kwargs
            resource_id = kwargs.get('pk') or kwargs.get('id')
            if hasattr(response, 'data') and isinstance(response.data, dict):
                resource_id = resource_id or response.data.get('id')

            # Create audit log entry
            AuditLog.objects.create(
                tenant_id=getattr(request, 'tenant_id', None),
                user_id=str(request.user.id) if hasattr(request, 'user') else None,
                action=action,
                resource=resource,
                resource_id=str(resource_id) if resource_id else None,
                details={
                    'method': request.method,
                    'path': request.path,
                    'query_params': dict(request.GET),
                },
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                result=result
            )

            return response
        return wrapper
    return decorator


def get_client_ip(request) -> str:
    """Extract client IP from request, handling proxies."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')
```

## JWT Token Structure

```python
# apps/users/tokens.py
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta

class PCSAccessToken(RefreshToken):
    """
    Custom JWT token with tenant and role claims.
    """

    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)

        # Add custom claims
        token['tenant_id'] = str(user.tenant_id)
        token['role'] = user.role
        token['email'] = user.email

        return token

# Token configuration (settings.py)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),  # Short-lived access tokens
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),     # Longer refresh tokens
    'ROTATE_REFRESH_TOKENS': True,                   # Issue new refresh on use
    'BLACKLIST_AFTER_ROTATION': True,                # Prevent reuse
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': env('JWT_SECRET_KEY'),            # From environment
    'AUTH_HEADER_TYPES': ('Bearer',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}
```

## API Endpoint Example with All Patterns

```python
# apps/drug_testing/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from lib.decorators import with_auth, audit_log
from .models import DrugTest
from .serializers import DrugTestSerializer

@api_view(['GET'])
@with_auth(required_permissions=['drug_tests:read'])
@audit_log('LIST', 'drug_test')
def list_drug_tests(request):
    """
    List all drug tests for the current tenant.
    Requires: drug_tests:read permission
    """
    tests = DrugTest.objects.filter(
        tenant_id=request.tenant_id
    ).select_related('employee').order_by('-test_date')

    serializer = DrugTestSerializer(tests, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@with_auth(required_permissions=['drug_tests:write', 'drug_tests:order'])
@audit_log('CREATE', 'drug_test')
def create_drug_test(request):
    """
    Order a new drug test.
    Requires: drug_tests:write AND drug_tests:order permissions
    """
    serializer = DrugTestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Verify employee belongs to same tenant
    employee_id = serializer.validated_data['employee_id']
    from apps.employees.models import Employee

    employee = Employee.objects.filter(
        id=employee_id,
        tenant_id=request.tenant_id
    ).first()

    if not employee:
        return Response({'error': 'Employee not found'}, status=404)

    # Create the test
    test = serializer.save(
        tenant_id=request.tenant_id,
        created_by=request.user.id
    )

    return Response(DrugTestSerializer(test).data, status=201)


@api_view(['GET'])
@with_auth(required_permissions=['drug_tests:read'])
@audit_log('READ', 'drug_test')
def get_drug_test(request, pk):
    """
    Get a specific drug test.
    Requires: drug_tests:read permission
    """
    test = DrugTest.objects.filter(
        id=pk,
        tenant_id=request.tenant_id  # Always verify tenant
    ).select_related('employee', 'mro_review').first()

    if not test:
        return Response({'error': 'Drug test not found'}, status=404)

    return Response(DrugTestSerializer(test).data)
```

## Password Security

```python
# apps/users/security.py
import bcrypt
from django.conf import settings

BCRYPT_COST = 12  # Production: 12 rounds (adjust based on server capacity)

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    Cost factor of 12 provides ~250ms hashing time.
    """
    salt = bcrypt.gensalt(rounds=BCRYPT_COST)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a password against its bcrypt hash.
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

## Rate Limiting

```python
# lib/rate_limit.py
from django.core.cache import cache
from django.http import JsonResponse
from functools import wraps

def rate_limit(max_requests: int, window_seconds: int, key_prefix: str = 'rl'):
    """
    Rate limiting decorator using Redis cache.

    Usage:
        @rate_limit(max_requests=100, window_seconds=60)  # 100 req/minute
        def my_view(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Generate key based on user or IP
            if hasattr(request, 'user') and request.user.is_authenticated:
                identifier = f"user:{request.user.id}"
            else:
                identifier = f"ip:{get_client_ip(request)}"

            cache_key = f"{key_prefix}:{identifier}"

            # Get current count
            current = cache.get(cache_key, 0)

            if current >= max_requests:
                return JsonResponse(
                    {'error': 'Rate limit exceeded', 'retry_after': window_seconds},
                    status=429
                )

            # Increment counter
            cache.set(cache_key, current + 1, window_seconds)

            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

# Updates to This Document

- Keep architecture synchronized with actual codebase structure
- Document new apps and services as they're added
- Update technology stack when dependencies change
- Keep compliance terminology aligned with business requirements

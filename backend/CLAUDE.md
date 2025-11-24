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

# Updates to This Document

- Keep architecture synchronized with actual codebase structure
- Document new apps and services as they're added
- Update technology stack when dependencies change
- Keep compliance terminology aligned with business requirements

# Patriot Compliance Systems - Full-Stack Documentation

This directory contains comprehensive documentation for the Patriot Compliance Systems project, organizing specifications, architecture, and implementation guides for both frontend and backend development.

**Target Compliance**: FedRAMP Moderate (long-term), SOC 2 Type II, PCI SAQ-A
**Scale Target**: 10K → 1M users
**Architecture**: Django + DRF (backend), Next.js 14 (frontend), PostgreSQL + Redis + Kafka

---

## 🚀 Quick Start

**New to the project?** Start here:

1. **Understand the System**: Read [System Overview](./architecture/overview.md) for high-level architecture
2. **Learn the Data Model**: Review [Data Layer](./architecture/data-layer.md) for database schema and caching
3. **Explore Security**: Check [Security Architecture](./architecture/security.md) for RBAC and RLS
4. **Review Compliance**: See [SOC 2 Controls](./compliance/soc2-controls.md) and [FedRAMP Roadmap](./compliance/fedramp-roadmap.md)

**Building a feature?**
- Review the relevant module spec in `modules/` (e.g., [Drug & Alcohol Testing](./modules/drug-alcohol.md))
- Follow the [Universal Compliance Pattern](./modules/employee-lifecycle.md#2-universal-compliance-pattern) for consistency
- Implement with [Action Plans](#action-plans) in each spec

---

## 📋 Documentation Index

### By Role

**Engineering Team**:
- [Data Layer Spec](./architecture/data-layer.md) - Database schema, caching, Kafka
- [API Layer Spec](./architecture/api-layer.md) - Middleware, webhooks, serializers
- [AI Gateway Spec](./architecture/ai-gateway.md) - Text-to-SQL, RAG pipeline

**DevOps Team**:
- [Infrastructure Spec](./architecture/infrastructure.md) - AWS resources, ECS, CI/CD
- [Disaster Recovery](./architecture/infrastructure.md#6-disaster-recovery) - Backup and DR procedures

**Security Team**:
- [Security Architecture](./architecture/security.md) - RBAC, RLS, MFA, audit logging
- [SOC 2 Controls](./compliance/soc2-controls.md) - Control implementation and evidence

**Compliance Team**:
- [FedRAMP Roadmap](./compliance/fedramp-roadmap.md) - 18-month timeline to ATO
- [PCI SAQ-A](./compliance/pci-saq-a.md) - Annual PCI validation
- [RBAC Matrix](./compliance/rbac-permissions-matrix.md) - Complete permission mapping

**Product Team**:
- [Employee Lifecycle](./modules/employee-lifecycle.md) - State machine and workflows
- Module specifications in `modules/` - Business logic for each domain

---

## Architecture Specifications (Primary Reference)

### Core Architecture (`architecture/`)

Complete technical specifications for system architecture and implementation.

- **[System Overview](./architecture/overview.md)** - C4 Context/Container diagrams, system boundaries, technology stack, performance targets
- **[Data Layer](./architecture/data-layer.md)** - PostgreSQL with monthly partitioning, Redis read-through caching, Kafka event streaming, pgvector embeddings, field-level encryption
- **[API Layer](./architecture/api-layer.md)** - Django middleware stack (7 layers), webhook handlers (Checkr/Quest/FMCSA), idempotency, DRF serializers with PII masking
- **[AI Gateway](./architecture/ai-gateway.md)** - DER IQ natural language queries, text-to-SQL generation, RAG pipeline with pgvector, RBAC-aware query injection, prompt security
- **[Security Architecture](./architecture/security.md)** - Hybrid RBAC (11 roles, dual-portal), PostgreSQL RLS policies, dual-control workflows, MFA (TOTP/FIDO2), immutable audit logging
- **[Infrastructure](./architecture/infrastructure.md)** - AWS ECS Fargate cluster, Aurora PostgreSQL Multi-AZ, ElastiCache Redis, MSK Kafka, native Blue-Green deployment, disaster recovery

### Compliance Modules (`modules/`)

Business logic and workflows for each compliance domain.

- **[Employee Lifecycle](./modules/employee-lifecycle.md)** - State machine (8 states), hybrid status + events model, universal compliance pattern, policy driver, automated flagging (green/yellow/red)
- **[Drug & Alcohol Testing](./modules/drug-alcohol.md)** - MRO review workflow, FMCSA clearinghouse reporting, random selection algorithms
- **[Background Checks](./modules/background-checks.md)** - FCRA adjudication process, adverse action workflows, individualized assessment
- **[DOT Compliance](./modules/dot-compliance.md)** - Driver qualification files, medical certificate tracking, annual clearinghouse queries
- **[Occupational Health](./modules/occupational-health.md)** - Medical surveillance programs, OSHA 300 logging, fitness-for-duty exams
- **[Training & Certifications](./modules/training-certifications.md)** - Certificate lifecycle management, OCR extraction, 30/60/90-day expiration alerts
- **[Geo-Fencing](./modules/geo-fencing.md)** - PostGIS geo-zones, GPS/QR check-ins, location-based compliance requirements

### Compliance & Security (`compliance/`)

Certification roadmaps and security control documentation.

- **[RBAC Permissions Matrix](./compliance/rbac-permissions-matrix.md)** - 11 system roles × 8 modules, dual-portal model (Service Company + Compliance Company), permission verbs (VIEW/CREATE/EDIT/DELETE/APPROVE/EXPORT/CONFIGURE/ASSIGN)
- **[SOC 2 Controls](./compliance/soc2-controls.md)** - 5 Trust Service Criteria (CC/Security/Availability/Confidentiality/Processing Integrity/Privacy), evidence automation, 6-month timeline
- **[FedRAMP Roadmap](./compliance/fedramp-roadmap.md)** - 18-month path to FedRAMP Moderate ATO, 325 security controls, System Security Plan (SSP), AWS GovCloud migration, continuous monitoring
- **[PCI SAQ-A](./compliance/pci-saq-a.md)** - Minimal PCI compliance (22 requirements), Stripe tokens only, annual attestation process, eligibility maintenance

---

## Legacy Documentation Files

- **COMPLIANCE_PORTAL_INSTRUCTIONS.md** - Development instructions for the compliance portal
- **ARCHITECTURE_ASSESSMENT.md** - Current architecture assessment
- **ARCHITECTURE_REVIEW_REPORT.md** - Architecture review with recommendations
- **users.md** - Portal architecture breakdown with user roles
- **docs.md** - Technical documentation and API specifications
- **PLANS.md** - Implementation plans and project timelines

## Project Setup

### Root Level Configuration

- **CLAUDE.md** - Global AI assistant instructions for the full-stack project
- **.gitignore** - Comprehensive ignore rules for Django + Next.js full-stack development

### Backend (Django)

- **backend/CLAUDE.md** - Django backend development guidelines, including:
  - Multi-tenant architecture patterns
  - Django app organization and structure
  - API design with Django REST Framework
  - Authentication, authorization, and role-based access control
  - Database schema and Prisma ORM setup
  - Celery task queue configuration
  - Testing with Pytest and Factory Boy
  - External integrations (Stripe, Twilio, SendGrid, vendor APIs)
  - Compliance workflow implementation

### Frontend (Next.js)

- **frontend/CLAUDE.md** - Next.js frontend development guidelines, including:
  - Next.js 14 App Router architecture
  - Component organization and patterns
  - State management (Context, hooks, Zustand)
  - Form handling with React Hook Form + Zod
  - API integration and data fetching
  - Authentication flow implementation
  - Multi-role portal structures
  - Testing with Vitest and React Testing Library
  - Compliance UI patterns and workflows
  - Mobile-first responsive design

## Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component library with Radix UI
- **React Hook Form + Zod** - Form management and validation
- **Mapbox GL** - Interactive mapping
- **Recharts** - Data visualization

### Backend

- **Django 4.2+** - Web framework with ORM
- **Django REST Framework** - RESTful API development
- **PostgreSQL 13+** - Multi-tenant database with schema isolation
- **Celery** - Distributed task queue
- **Redis** - Message broker and caching
- **Stripe** - Payment processing
- **Twilio** - SMS and OTP
- **SendGrid** - Email service

## Key Features

### Multi-Tenant Architecture

- Each service company operates in isolated PostgreSQL schemas
- Tenant middleware automatically routes requests to correct schema
- Complete data isolation between tenants

### Role-Based Access Control

- Service Company Admin
- Compliance Officer
- DER (Designated Employer Representative)
- Field Workers
- Auditors
- Executives
- Super Admin (PCS internal)

### Compliance Workflows

- **Drug Testing**: Pre-employment, random, post-accident, MRO review, clearinghouse reporting
- **Background Checks**: Screening, adjudication, adverse action processing
- **DOT Compliance**: Driver qualification files, clearinghouse queries, medical certifications
- **Occupational Health**: Medical surveillance, OSHA 300 logging, health records
- **Training & Certifications**: Expiration tracking with alerts, compliance matrix
- **Geofencing**: Location-based compliance zones, check-ins, compliance tracking
- **Communications**: Multi-channel messaging (email, SMS, notifications)

## Getting Started

### Frontend Development

```bash
cd /Users/arkashjain/Desktop/pcs-mod
pnpm install
pnpm dev
# Starts Next.js dev server on http://localhost:3000
```

Refer to `frontend/CLAUDE.md` for detailed frontend development guidelines.

### Backend Development

```bash
cd backend/
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Starts Django dev server on http://localhost:8000
```

Refer to `backend/CLAUDE.md` for detailed backend development guidelines.

## Documentation Principles

All documentation follows these principles:

1. **Actionable** - Instructions are specific and executable
2. **Type-Safe** - All code examples are TypeScript/Python compliant
3. **Architecture-Aligned** - Reflects actual project structure
4. **Domain-Aware** - Includes compliance terminology and business rules
5. **DRY** - No duplication between frontend and backend docs
6. **Living** - Updated as project evolves

## Updates & Maintenance

Documentation is maintained in version control alongside code. When making changes:

1. Update relevant CLAUDE.md files (global, frontend, or backend)
2. Update architecture documentation when structure changes
3. Keep compliance terminology synchronized across all docs
4. Document new features in PLANS.md and appropriate spec files

## Project Links

- **Frontend Code**: `/app`, `/components`, `/hooks`, `/lib`
- **Backend Code**: `/backend/` (to be created)
- **Database Schema**: `/backend/` (Django/Prisma models)
- **API Routes**: `/app/api/` (Next.js API routes as proxy layer)

## Compliance Terminology Reference

- **DER**: Designated Employer Representative
- **MRO**: Medical Review Officer (drug test review)
- **DOT**: Department of Transportation
- **DQ File**: Driver Qualification File
- **FMCSA**: Federal Motor Carrier Safety Administration
- **Clearinghouse**: FMCSA Drug and Alcohol Clearinghouse
- **Adjudication**: Review process for background check findings
- **Adverse Action**: Process when background check results affect employment
- **OSHA 300**: Occupational Safety and Health Administration injury log

---

## 🎯 Action Plans

Each specification document includes a detailed **Action Plan** section with:
- **Phased implementation** (typically 4 phases over 1 month)
- **Task priorities** (High/Medium/Low)
- **Effort estimates** (days)
- **Dependencies** between tasks
- **Deliverable checklists**

**To implement a feature**:
1. Find the relevant spec (e.g., `architecture/security.md` for RBAC)
2. Navigate to the "Action Plan" section
3. Follow the phases sequentially
4. Check off deliverables as you complete them

**Example Action Plan Structure**:
```
Phase 1: Foundation (Week 1)
├── Task 1: Setup infrastructure (2 days, High priority)
├── Task 2: Create schemas (1 day, High priority)
└── Deliverables: [ ] Infrastructure ready, [ ] Schemas created

Phase 2: Implementation (Week 2)
├── Task 3: Build service layer (3 days, High priority)
└── Deliverables: [ ] Service working, [ ] Tests passing
```

---

## 📊 Implementation Status

### Completed Specifications

✅ **Architecture Layer** (5/5 complete):
- System Overview - C4 diagrams, system boundaries
- Data Layer - PostgreSQL, Redis, Kafka, pgvector
- API Layer - Django middleware, webhooks, serializers
- AI Gateway - DER IQ, text-to-SQL, RAG
- Security - RBAC, RLS, MFA, audit logging
- Infrastructure - ECS Fargate, Aurora, Blue-Green deployment

✅ **Compliance Documentation** (4/4 complete):
- RBAC Permissions Matrix - 11 roles, dual-portal model
- SOC 2 Controls - Trust Service Criteria, evidence automation
- FedRAMP Roadmap - 18-month timeline, 325 controls
- PCI SAQ-A - 22 requirements, Stripe integration

✅ **Module Specifications** (1/7 complete):
- Employee Lifecycle - State machine, universal compliance pattern

🟡 **Module Specifications** (6/7 remaining):
- Drug & Alcohol Testing - Existing spec (needs enhancement)
- Background Checks - Existing spec (needs enhancement)
- DOT Compliance - Existing spec (needs enhancement)
- Occupational Health - Existing spec (needs enhancement)
- Training & Certifications - Existing spec (needs enhancement)
- Geo-Fencing - Existing spec (needs enhancement)

---

## 🔄 Documentation Maintenance

### Update Frequency

- **Architecture specs**: Update when system design changes
- **Module specs**: Update when business logic changes
- **Compliance docs**:
  - SOC 2: Quarterly during observation, annually thereafter
  - FedRAMP: Annually for SSP, monthly for ConMon
  - PCI: Annually for SAQ-A validation
- **Action plans**: Update as implementation progresses

### Who Updates What

| Document Type | Primary Owner | Review Frequency |
|---------------|---------------|------------------|
| Architecture specs | Engineering | Quarterly |
| Module specs | Product + Engineering | Per feature release |
| Security specs | Security Team | Monthly |
| Compliance docs | Compliance Team | Per certification cycle |
| Infrastructure | DevOps | Per infrastructure change |

---

## Contact & Questions

Refer to the specific CLAUDE.md files for development guidelines:

- **Global development**: See [CLAUDE.md](../CLAUDE.md)
- **Frontend questions**: See frontend/CLAUDE.md *(to be created)*
- **Backend questions**: See backend/CLAUDE.md *(to be created)*
- **Architecture/design**: See `architecture/` directory
- **Feature specs**: See `modules/` directory

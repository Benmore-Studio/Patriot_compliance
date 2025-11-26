# Patriot Compliance Systems - Full-Stack Documentation

This directory contains comprehensive documentation for the Patriot Compliance Systems project, organizing specifications, architecture, and implementation guides for both frontend and backend development.

## Directory Structure

### Documentation Files

- **ARCHITECTURE_TECHNICAL.md** - System Overview with high-level architecture diagrams showing client layer, frontend layer (Vercel/Next.js), backend layer (Django/AWS), and data layer with vendor integrations
- **ARCHITECTURE_TECHNICAL_V2.md** - Detailed v2.0 technical architecture with hybrid microservices pattern (4 services), technology stack, service definitions, data layer, and deployment architecture
- **COMPLIANCE_PORTAL_INSTRUCTIONS.md** - Comprehensive development instructions for the full compliance portal, including design guidelines, authentication, RBAC, and feature specifications
- **ARCHITECTURE_ASSESSMENT.md** - Current architecture assessment and technical evaluation
- **ARCHITECTURE_REVIEW_REPORT.md** - Detailed architecture review with recommendations
- **users.md** - Portal architecture breakdown with user roles and access matrices
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

## Contact & Questions

Refer to the specific CLAUDE.md files for development guidelines:

- **Global development**: See CLAUDE.md
- **Frontend questions**: See frontend/CLAUDE.md
- **Backend questions**: See backend/CLAUDE.md
- **Architecture/design**: See ARCHITECTURE\_\* files
- **Feature specs**: See COMPLIANCE_PORTAL_INSTRUCTIONS.md

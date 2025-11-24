# Patriot Compliance Systems — Architecture & Module Requirements

This document complements the nano-banana atlas with functional and non-functional expectations for every route under `app/`, the backing API handlers, and the external systems (Stripe, Plaid, QuickBooks, TazWorks, Workforce, FMCSA, OSHA, ID.me, etc.) that must be wired together to deliver a production-ready compliance stack.

## Directory Snapshot (for orientation)

```bash
app/                 # Next.js app router tree (portals, modules, API handlers)
components/          # Shared UI, dashboards, policy widgets, RBAC helpers
hooks/               # use-rbac, use-der-iq, etc.
lib/                 # Auth/session context, RBAC matrices, mock data
specs/               # Architecture docs (this file, nano-banana atlas, plans)
```

## Detailed File & Folder Reference

### `app/` — Route Tree & Entry Points
- `app/layout.tsx` – Root layout wiring Inter font, `AuthProvider`, and `AppShell`; every page renders inside this to ensure RBAC context.
- `app/page.tsx` – Service company dashboard (PolicyLink) composing compliance meter, policy tiles, alerts, and roster widgets; should eventually query TanStack Query.
- `app/loading.tsx` – Default skeleton used while dashboard-level data streams; lacking nested route awareness.
- `app/globals.css` + `styles/globals.css` – Tailwind v4 theme tokens, Chevron overrides, dark mode, and base typography.
- `app/(auth)/layout.tsx` – Minimal wrapper for auth routes so login/MFA use standalone container.
- `app/(auth)/login/page.tsx` – Multi-portal login with theme toggle, remember me, and onboarding portal selector hooks.
- `app/(auth)/mfa-challenge/page.tsx` – MFA challenge UI (mocked inputs); needs integration with Twilio/Authenticator.
- `app/(auth)/onboarding/page.tsx` – Portal selection wizard for new tenants.
- `app/403/page.tsx`, `app/account-locked/page.tsx` – Static guard pages for unauthorized or locked accounts.
- `app/api/**/route.ts` – Next.js Route Handlers acting as mock APIs for every module (background, DOT, drug testing, employees, training, share links, webhooks). Each returns hard-coded arrays and must be replaced by Prisma-backed services plus vendor adapters.
- `app/compliance/**/page.tsx` – Ten module pages (background, drug testing, DOT, training, health, HIPAA, etc.) each with Lucide icons, Shadcn UI, and mock data arrays; rely on `useState` and `useMemo`.
- `app/compliance/**/loading.tsx` – Skeletons (some blank) for each module; fill in accessible placeholders.
- `app/compliance-portal/**` & `[companySlug]` – Managed service provider portal with sidebar of `mockCompanies`; layout wires `CommunicationsDialog`.
- `app/dashboard/page.tsx` – DER Admin console with compliance tiles, alerts, audit queue, map.
- `app/employees/page.tsx`, `[id]/page.tsx` – Employee roster and 360 profile (mock data, modals, export dialog).
- `app/geo-fencing/page.tsx` – Map view + zones/triggers/check-ins tabs; uses `GeoFenceMapNoAPI` placeholder.
- `app/integrations/workforce/page.tsx` – Connector UI for Workforce.com; includes API key inputs, status cards, webhook table.
- `app/onboarding/requirements/page.tsx` – Large requirements matrix (tabs for each module, PDF/print actions).
- `app/policy-driver/page.tsx` – Policy rule editor + simulation mode; uses dialogs for templates and matrices table.
- `app/portals/*` – Sub-portals (auditor/compliance-officer/executive/PCS Pass). PCS Pass folder includes check-in, documents, notifications, profile views for field workers.
- `app/reports/page.tsx` + `/mis-express/page.tsx` – Report builder and MIS Express wrapper around `components/mis-express`.
- `app/settings/page.tsx` – Config tabs (company info, user management, policy configs, notifications, integrations, demo); relies on `RoleSwitcher`.
- `app/settings/shareable-links/page.tsx` – Manage secure share links (mock data + revoke/copy actions).
- `app/share/[token]/page.tsx` – Secure share UI with password gate, dynamic rendering after auth.
- `app/portals/.../loading.tsx`, `app/reports/loading.tsx`, etc. – Loading states for each portal/page.

### `components/` — UI & Domain Widgets
- `components/layout/*` – `app-shell`, `app-header`, `app-sidebar`, breadcrumbs, quick actions; wrap entire UI.
- `components/alerts-*`, `alerts-panel`, `urgent-notifications` – Alert displays for dashboards and compliance modules.
- `components/audit-queue`, `compliance-meter`, `policy-progress-tiles`, `portfolio-view`, `geo-fence-compliance`, `occupational-health-oversight`, etc. – Domain-specific widgets used throughout portal pages.
- `components/auth/protected-route.tsx` & `role-switcher.tsx` – Client-side RBAC check and portal toggle (currently purely front-end).
- `components/communications*.tsx` – Compose/send announcements and embed dialogs.
- `components/der-iq-chat-widget.tsx` – UI stub for DER IQ AI assistant (ties into `/lib/ai/der-iq.ts`).
- `components/export-dialog.tsx`, `invoice-generator.tsx`, `billing-*` – Billing/finance UI components with Shadcn primitives.
- `components/policies-ai.tsx`, `policy-management.tsx` – AI suggestions and policy tiles on compliance screens.
- `components/service-companies-sidebar.tsx` – Left navigation for compliance portal showing `mockCompanies`.
- `components/training-certifications.tsx`, `queue-management.tsx`, `roster-*`, `employee-roster-summary.tsx`, etc. – Support training, queue, roster experiences.
- `components/ui/*` – Forked Shadcn UI primitives (accordion, card, table, tabs, toast, etc.) plus utility hooks (use-mobile, use-toast). These provide consistent theming and interactive behavior.

### `hooks/`
- `use-rbac.ts` – Client hook to check role permissions against `lib/rbac/permissions.ts`.
- `use-der-iq.ts` – Hook for DER IQ AI chat (connects to `/lib/ai/der-iq.ts`).
- `use-mobile.ts`, `use-toast.ts` – Responsive detection and toast bridge (mirrors components/ui hooks).

### `lib/`
- `lib/auth/*` – `auth-context.tsx` (React context storing `user`, login/logout functions), `session.ts` (mock session), `security.ts` (helpers for password strength, encryption), `rbac.ts` (role utilities).
- `lib/rbac/permissions.ts` – Permission matrix enumerating which actions each role can perform; referenced by `use-rbac`.
- `lib/data/*` – Mock data sources (companies, worker data, invoices, HOS drivers) powering UI prototypes.
- `lib/export-utils.ts`, `lib/pdf-generator.ts` – Utilities for generating CSV/PDF (PCS Pass PDF generator uses this).
- `lib/share/utils.ts` – Helpers to format share link expiration and statuses.
- `lib/utils.ts` – Common helpers (`cn`, number formatting, date utilities).
- `lib/ai/der-iq.ts` – Mock AI responder returning canned responses for DER chat.

### `specs/`
- `app-nano-banana.md` – Visual map of every route/module with nano-banana diagrams.
- `docs.md` – This requirements document.
- `ARCHITECTURE_*`, `COMPLIANCE_PORTAL_INSTRUCTIONS.md`, `PLANS.md`, `README.md` – Additional product/architecture plans and walkthroughs.

### Supporting Files
- `middleware.ts` – Placeholder for Next middleware (currently just stub, should enforce RBAC + tenant resolution).
- `next.config.mjs`, `postcss.config.mjs`, `tsconfig.json` – Tooling configuration.
- `prisma/schema.prisma` – Data model placeholder (extend for Employee, DrugTest, etc.).
- `public/*` – Logos and placeholders used on login/comms pages.
- `types/auth.ts`, `types/share.ts` – Type definitions for auth context and share link payloads.

Use this reference while implementing real services so every UI surface maps cleanly to backend responsibilities.

## Personas & RBAC Guardrails

| Role | Primary Portals | Capabilities | Sensitive Notes |
| --- | --- | --- | --- |
| `SUPER_ADMIN` (internal PCS) | All | Tenant provisioning, policy templates, billing overrides | Must be limited to PCS employees; requires hardware MFA + audit logging |
| `EXECUTIVE` (client HQ) | `/portals/executive`, `/compliance` | Portfolio KPIs, read-only financials, exports | No PHI; anonymize employee PII |
| `COMPLIANCE_OFFICER` | `/dashboard`, `/compliance/*`, `/policy-driver`, `/reports` | CRUD on policies, employee records, random pools, health entries | Requires signed BAA, full audit log of edits |
| `SERVICE_COMPANY_ADMIN` | `/dashboard`, `/employees`, `/settings` | Manage roster, share links, pay invoices | Needs billing permissions + workforce integrations |
| `FIELD_WORKER` / `PCS Pass` | `/portals/pcs-pass/*` | View own records, upload documents, geo check-in | Access limited to employeeId; ID.me verification recommended |
| `AUDITOR` | `/portals/auditor` | Read-only evidence, audit trail exports | Mask SSN/DOB and enforce share link passwording |

RBAC must be enforced in middleware (edge or API) in addition to the client-side `ProtectedRoute`.

## Module Deep Dives

### 1. Authentication, MFA & SSO (`app/(auth)/*`, middleware.ts, `lib/auth/*`)

- **Functional**: 
  - Email OTP + passwordless login, with optional ID.me or Okta SAML SSO for enterprise clients.
  - MFA challenge screen should support Time-based OTP, WebAuthn, SMS backup (Twilio), and AWS Cognito or Auth0 as IdP.
  - Account lockouts must call `/account-locked` and notify PCS security.
- **Non-Functional**:
  - All auth events logged to audit trail + CloudWatch.
  - Rate limiting on login, OTP, and share link endpoints (API Gateway + AWS WAF).
- **Integrations**:
  - ID.me (field worker identity proofing), Okta/Azure AD (enterprise SSO), AWS Cognito or custom Django auth, Twilio Verify for SMS MFA, SendGrid/AWS SES for OTP emails.

### 2. Employee Roster & Identity Graph (`app/employees/*`, `/api/employees/*`)

- **Functional**:
  - CRUD on employees, bulk upload (CSV/XLSX), export, location/rig tagging.
  - Link to compliance modules (drug testing, DOT, training) and show `Employee.complianceData` rollups.
- **Non-Functional**:
  - All PII must be encrypted at rest (Postgres column-level + AWS KMS) and masked in portals outside service-company context.
  - Bulk upload must support 10k rows with streaming parsing (S3 + Lambda pre-processor).
- **Integrations**:
  - Workforce.com or UKG API connectors for real-time roster sync (OAuth credential per tenant).
  - Plaid/HRIS connectors if payroll/accounting data drives compliance roles.

### 3. Compliance Modules (`app/compliance/**/*` and `/app/api/*` counterparts)

Each module shares the universal workflow: `Ingest → Parse → Validate (Policy Driver) → Store → Flag → Alert`.

#### Background Screening (`/compliance/background`, `/api/background/*`)
- **Functional**: Order background packages, adjudicate findings, manage adverse action workflow, configure disqualifying offenses.
- **Integrations**: TazWorks API (webhooks + polling), ID.me for identity proof when necessary, Equifax or other verification vendors.
- **Non-Functional**: All adverse action letters generated via PDF service (S3 + watermark) and E-Sign distribution; require job queue (Kafka topic `background.events` feeding workers).

#### Drug & Alcohol Testing (`/compliance/drug-testing`, `/api/drug-testing/*`, `/api/webhooks/drug-testing`)
- **Functional**: Random pool management, scheduling, MRO review, clearinghouse reporting, vendor communication (CRL, Quest).
- **Integrations**: CRL/FormFox, SAPAA APIs, FMCSA Clearinghouse (DOT), MRO portals, Twilio for test notifications, Stripe or ACH for lab billing.
- **Non-Functional**: Random selection must be auditable (seed + RNG recorded), Kafka topic `drug-testing.pool-selection`, encryption for lab PDFs, SLA < 5 minutes for new test ingestion.

#### DOT / Driver Qualification (`/compliance/dot/*`, `/api/dot/*`)
- **Functional**: Driver roster, CDL/medical card tracking, clearinghouse queries, accident register, Hours-of-Service analytics.
- **Integrations**: FMCSA Clearinghouse, CDLIS, SaferWatch, GPS/ELD telematics (Samsara, Geotab), AWS Textract for DQ file OCR, DOT DMV APIs per state.
- **Non-Functional**: 7-year retention for DOT records; versioned storage (S3 + Glacier). Provide offline download (ZIP) for DOT audits within 30 minutes.

#### Health & Occupational Surveillance (`/compliance/health`, `/api/health/*`)
- **Functional**: OSHA 300 logs, clinic visits, fit-for-duty status, vaccination tracking.
- **Integrations**: EMR connectors (Athena, eClinicalWorks), clinic SFTP drops, HIPAA-compliant messaging.
- **Non-Functional**: HIPAA safeguards (BAA with all vendors, field-level encryption, access logging). Automatic deletion after regulatory retention.

#### Training & Certifications (`/compliance/training`, `/api/training/*`)
- **Functional**: Role-based training matrices, course completion, certificate uploads, auto-expiry notifications, SCORM/LMS sync.
- **Integrations**: ClickSafety, KPA, SAP SuccessFactors, upload to S3 with virus scanning (ClamAV Lambda).
- **Non-Functional**: Real-time status for 100k employees; caching with Redis; certificate verification via shareable links.

#### HIPAA Privacy & Access Controls (`/compliance/hipaa-privacy`)
- **Functional**: Role access reviews, PHI access logs, auto-removal of inactive users, periodic attestations.
- **Integrations**: Okta/Azure AD SCIM to keep user list in sync, AWS CloudTrail for infrastructure access.
- **Non-Functional**: Tamper-evident logs (AWS QLDB or immutability buckets), RBAC enforcement before rendering components.

#### Geo-Fencing & PCS Pass
- **Functional**: Check-ins, zone management, triggers linked to compliance tasks, PCS Pass portal for field workers.
- **Integrations**: Mobile SDK (React Native or Expo), Mapbox/ESRI for GIS, AWS Location Services, QuickSight for geospatial analytics.
- **Non-Functional**: Must handle offline mode with queued check-ins; geolocation accuracy thresholds recorded for OSHA evidence.

### 4. Policy Driver (`/policy-driver`, `lib/rbac`, `/app/api/background/adjudication`)

- Stores universal compliance rules per company, per role, and feeds evaluations through Kafka consumers.
- Requires versioning, simulation mode (already in UI) connected to sandbox DB, and approval workflow for publishing.

### 5. Billing & Finance (`/billing`, `/compliance-portal/billing`, `/settings/shareable-links`, `/api/share/*`)

- **Functional**: Subscription management, meter-based billing (per test, per employee), invoice generation, payment tracking, secure shareable financial statements.
- **Integrations**: Stripe (cards + ACH), Plaid for bank account verification, QuickBooks or NetSuite for ledger sync, Avalara for tax.
- **Non-Functional**: PCI scope minimal (tokenize via Stripe Elements). Provide SOC2 audit logs for every invoice change. Support multi-currency for global clients.

### 6. Communications & Alerts (`/communications`, `/components/alerts-*`, `/api/communications/*`)

- **Functional**: Compose announcements, multi-channel (Email/SMS/Push), templates, scheduling, history, real-time alerts in dashboards.
- **Integrations**: SendGrid/SES (email), Twilio (SMS), AWS SNS/Pinpoint (push), Slack/Teams webhooks for corporate channels.
- **Non-Functional**: Delivery receipts stored for compliance; rate limiting per tenant; bilingual template support.

### 7. Reports & Audit (`/reports/*`, `/audit-logs`, `/share/[token]`)

- **Functional**: MIS Express, scheduled report generation, audit log filtering/export, secure share links.
- **Integrations**: AWS Glue/Athena for large report queries, PDF rendering service, KMS for share link password hashing.
- **Non-Functional**: Reports should generate within <5 minutes, share links require password + optional OTP, logs immutable for 7+ years.

### 8. Portals

- **Service Company Dashboard** (`/dashboard`): day-to-day operations; requires live TanStack Query data.
- **Compliance Portal** (`/compliance-portal/*`): MSP overview; read-only snapshots, cross-tenant filtering.
- **Auditor Portal**: curated evidence repository with download queue (S3 pre-signed links) and control matrices (SOC2, HIPAA, CMMC mappings).
- **Executive Portal**: aggregated KPIs, NRR metrics, policy adoption; integrate with BI (QuickSight or Looker).
- **PCS Pass**: field worker self-service; integrate ID.me for initial verification, store minimal PHI, provide PDF generator (already stubbed in `lib/pdf-generator.ts` but needs backend service).

## API & Data Layer Expectations

- Next.js route handlers under `app/api/**` currently mock data; production system must:
  - Authenticate every request (JWT or session cookie) + tenant resolution (header or subdomain).
  - Write to Postgres via Prisma/Drizzle and publish events to Kafka/Upstash managed cluster.
  - Use background workers (AWS Lambda, ECS Fargate, or Temporal) to handle vendor callbacks, PDF rendering, and heavy exports.
- **Data Model**:
  - `Employee` table with JSONB `complianceData`, plus normalized modules (DrugTest, BackgroundCheck, AuditLog, Invoice, etc.).
  - Policy versions stored with effective dates; share links stored with hashed tokens + expiration.

### Sample Flow (Drug Test Event)

```nano-banana
Vendor Webhook → API Gateway → /api/webhooks/drug-testing → Signature verification → Kafka topic `drug-testing.events`
  --> Worker (Lambda/ECS) → Normalize payload → Update Postgres (DrugTest + Employee JSONB) → Policy Driver eval
  --> Alerts service → Twilio/SendGrid → UI updates via TanStack Query + Live queries
```

## External Integrations & Client Setup

| Domain | Vendors / APIs | Client Prerequisites | PCS Integration Notes |
| --- | --- | --- | --- |
| Identity & MFA | ID.me, Okta, Azure AD, AWS Cognito, Twilio Verify | Client supplies SAML/OIDC metadata, ID.me onboarding, phone numbers for MFA | Map groups → PCS roles; store IdP metadata in Secrets Manager; enforce MFA for privileged roles |
| Background Screening | TazWorks, Accurate, Checkr | API keys per tenant, webhook URL allowlisting | Build adapters (~200 LOC each) to convert vendor payload → compliance event |
| Drug Testing | CRL, Quest, FormFox, SAPAA | Lab credentials, clearinghouse login | Use vendor REST/SFTP, track sample chain-of-custody |
| DOT / Government | FMCSA Clearinghouse, CDLIS, SAFER, state DMV APIs | Power of Attorney, DOT PIN, per-state agreements | House credentials in Secrets Manager; implement automated query scheduling |
| Financial | Stripe, Plaid, QuickBooks Online, NetSuite | Stripe connected account, Plaid client id/secret, QuickBooks OAuth app | Use Stripe for payments, feed QuickBooks via daily sync, optional Plaid for ACH verification |
| Workforce / HRIS | Workforce.com, UKG, ADP, Workday | API users or SFTP feeds | implement connectors in `/integrations/workforce` page with OAuth + webhook ingestion |
| Communications | SendGrid/SES, Twilio SMS, Slack/Teams | API keys, verified domains, Slack workspace approvals | Multi-channel delivery with fallback; log message IDs |
| Storage / Documents | AWS S3, Textract (for OCR), ClamAV scanning | BAA, bucket policies | Use signed URLs, watermark downloads, enforce virus scan before persistence |

## AWS & Cloud Architecture Requirements

- **Networking**: VPC with private subnets for RDS/Postgres, NAT for outbound vendor calls, AWS PrivateLink for Kafka (MSK) or Upstash connectors.
- **Compute**: 
  - Next.js frontend on Vercel or AWS Amplify (for SSR + CDN).
  - Backend API on AWS ECS Fargate or Lambda + API Gateway for `/api` routes that require long-running jobs.
  - Background workers using AWS Lambda, Step Functions, or Temporal Cloud for orchestrating vendor workflows.
- **Data & Messaging**:
  - Postgres (AWS RDS Aurora) with schema-per-tenant or row-level security.
  - Redis/Upstash for caching (TanStack Query hydration, policy caches).
  - Kafka (Upstash MSK/Confluent) for compliance events.
- **Security & IAM**:
  - AWS Cognito or custom IdP, Secrets Manager for vendor credentials, KMS for encryption, GuardDuty + Security Hub for monitoring.
- **Observability**:
  - CloudWatch + OpenSearch for logs, AWS X-Ray or Datadog for tracing, SLO dashboards per module.
- **Serverless Utilities**:
  - API Gateway throttling for webhooks, Lambda@Edge for header-based tenant routing, AWS Step Functions for multi-step workflows (e.g., adverse action timeline).

## Client Onboarding Checklist

1. **Identity**: Provide SSO metadata or configure PCS-managed MFA (ID.me + Twilio).
2. **Compliance Policies**: Upload existing matrices into Policy Driver; configure random selection rates, background lookbacks, training frequencies.
3. **Roster Sync**: Connect Workforce/HRIS or upload initial CSV; verify location mappings.
4. **Vendor Credentials**: Enter TazWorks, lab, clearinghouse, clinic, and financial API keys in `/settings`.
5. **Branding & Themes**: Provide logos/colors; configure `chevron-theme` equivalent if white-labeled.
6. **Billing**: Link Stripe customer + Plaid-verified bank account; map to QuickBooks ledger.
7. **Alerts & Communications**: Verify email domains (SPF/DKIM), SMS numbers, Slack/Teams channels.
8. **Document Storage**: Sign BAA, configure S3 bucket policies, agree on retention schedules.

## Non-Functional Requirements Summary

- **Security**: HIPAA, SOC2 Type II, GDPR/CCPA readiness, PCI (for Stripe). Enforce TLS 1.3, AES-256 at rest, per-tenant KMS keys, immutable audit logs.
- **Availability & Performance**: 
  - 99.9% uptime SLA for portals.
  - API p95 < 200ms for reads, < 500ms for writes.
  - Batch processing (e.g., random selection, HOS imports) < 5 minutes per job.
- **Scalability**: Support 100k+ employees per tenant, 10k concurrent portal users, Kafka throughput sized for 50 events/sec baseline.
- **Observability**: Trace IDs on every API response, dashboards for ingestion lag, error budgets for each module.
- **Compliance Evidence**: All actions (policy publish, random selection, adverse action) must have tamper-proof audit entries accessible via `/portal/auditor` and share links.
- **Data Retention**: DOT 3–5 year rules, HIPAA 7+ years, ability to purge (Right to be Forgotten) per GDPR.

## Next Steps

- Replace mock data in `/app/api/**` with real services described above.
- Wire RBAC middleware to guard every page/route.
- Stand up AWS infrastructure (RDS, Kafka, Redis, S3, Cognito, API Gateway, Lambda/Step Functions) according to this blueprint.
- Coordinate with clients to collect required vendor credentials and finalize BAAs before production cutover.

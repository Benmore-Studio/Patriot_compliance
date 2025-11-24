# Patriot Compliance Systems - Full Development Instructions

## Executive Summary

Based on the 10/16/2025 meeting with Jaime Bouston and Jim, this document provides comprehensive instructions for building the Patriot Compliance Systems (PCS) full compliance portal.

**Project Timeline:**
- Frontend Prototyping: 6-8 weeks (accelerated to 4 weeks with 2x weekly meetings)
- Total Development: 14-15 months (12 months expedited with +$40k premium)
- Next Demo: Friday (design updates, RBAC, drill-downs)
- Workflows Review: Next week

**Budget:**
- Backend: $224,000
- Frontend: $20,000
- **Total: $244,000**

---

## 1. Design Guidelines

### Color Palette & Aesthetics

**Primary Inspiration:** QuickBooks Online

**Color Scheme:**
- **Background:** Clean white (#FFFFFF)
- **Primary Text:** Blue (QuickBooks blue tone) - similar to their icon/lettering blue
- **Secondary Text:** Black (#000000)
- **Accent:** Navy blue and orange (from current PCS logo)
- **Avoid:** Green (QuickBooks uses green for money; we avoid it)

**Typography:**
- Font: TBD (currently using QuickBooks-style fonts)
- Clean, professional, B2B-focused

**Iconography:**
- Start with default React/shadcn icons
- Consider custom icons in future phases (requires designer involvement)
- Style: Simple, clean, similar to QuickBooks icons

**Logo:**
- **Current Status:** Use existing Patriot logo provisionally
- **Action Required:** Jaime will finalize logo decision within 2 weeks (legal/entity considerations)

**Navigation:**
- **Primary:** Left side navigation bar
- **Layout:** Follows left-to-right reading pattern
- **Structure:** Module-based folders with sub-items

**Overall Philosophy:**
- B2B software: **Functionality > Aesthetics** (but keep it professional)
- Clean, uncluttered interface
- QuickBooks-level polish without overdesign

---

## 2. Authentication & Authorization

### Authentication Methods

#### Email-Based One-Time Passcode (Phase 1 - MVP)
- Send OTP via email (no Twilio/SMS initially to avoid 2-3 week approval delay)
- 6-digit code, 5-minute expiration
- Resend functionality

#### SSO Integrations (Phase 2)
- **Google Sign-In** (priority 1)
- **Okta** (enterprise requirement - Jim's concern)
- **Azure AD** (for Microsoft-heavy orgs)
- **LinkedIn** (optional, low priority)

#### Multi-Factor Authentication (MFA)
- **Two-step authentication:** Required for admin roles
- **Methods:**
  - Authenticator app (Google Authenticator, Authy)
  - Email OTP (fallback)
  - SMS OTP (future - requires Twilio setup)
- **Enforcement:** Configurable by company policy
- **Visual/Biometric:** Face ID on mobile (future)

### Role-Based Access Control (RBAC)

#### User Roles Hierarchy

1. **Super Administrator (God Mode)**
   - PCS internal only
   - Full system access across all tenants
   - Configuration and override capabilities

2. **System Administrator**
   - Client-side top-level admin
   - Assign roles, configure policies
   - Typically: C-Suite (President, VPs)

3. **DER (Designated Employer Representative)**
   - Highest operational role in service company
   - Configure compliance workflows
   - Primary user of Policy Driver
   - Typically: Safety Director, Compliance Manager

4. **Safety Manager / HSC (Health & Safety Coordinator)**
   - Create post-accident reports
   - Monitor random testing pools
   - Manage safety team activities
   - Same access level as DER Assistant

5. **Compliance Officer**
   - Work queue management
   - Adjudication and review tasks
   - Bulk actions on compliance items
   - May have restricted access to backgrounds (configurable by admin)

6. **Field Worker**
   - View own compliance status only
   - Upload documents for self
   - Site check-in (geo-fencing)
   - Mobile-optimized interface

7. **Auditor**
   - Evidence repository access
   - Control matrix viewing
   - Q&A workflow participation
   - Read-only across most modules

#### RBAC Implementation Requirements

- **Permission Granularity:** Module-level + action-level (read, write, delete, export)
- **Bulk User Upload:** JSON/CSV template for mass role assignment
- **User Switching (Prototype):** Ability to quickly switch between roles for demo
- **Audit Trail:** Log all permission changes and role assignments
- **Inheritance:** Lower roles inherit subset of higher role permissions

**Example Permission Matrix:**

| Role | Dashboard | Employees | Drug Testing | Background | Billing | Policy Driver | Audit Logs |
|------|-----------|-----------|--------------|------------|---------|---------------|------------|
| Super Admin | Full | Full | Full | Full | Full | Full | Full |
| DER | Read/Write | Full | Full | Full | Read | Full | Read |
| Safety Mgr | Read | Read/Write | Full | Read | No Access | Read | Read |
| Compliance Officer | Read | Read | Full | Full | No Access | Read | Read |
| Field Worker | Own Only | Own Only | Own Only | Own Only | No Access | No Access | No Access |

---

## 3. Core Portal Structure

### Portal Views (Multi-Portal Architecture)

#### 3.1 Executive Command Center
**Users:** C-Suite, Presidents, VPs

**Dashboard Components:**
- Compliance scorecard (company-wide)
- Workforce overview (headcount, turnover, risk scores)
- Geographic heat map (compliance by location)
- Service company portfolio (if managing multiple companies)
- Risk register (top 10 compliance risks)
- KPI cards (time-to-compliance, cost per employee, audit readiness)
- **AI Summary Widget:** One-click AI-generated executive summary

**Key Features:**
- High-level view, minimal detail
- Exportable executive reports
- Trend analysis charts
- Drill-down to specific issues

#### 3.2 Service Company Portal
**Users:** DER, Safety Managers, HSC, Compliance Officers

**Dashboard Components:**
- **Compliance Meter:** Overall compliance percentage (visual gauge)
- **Policy Progress Tiles:** Each compliance area (Drug Testing: 92%, Background: 87%)
  - **Clickable:** Clicking tile drills down to that module
- **Alerts Center:** Real-time non-compliance alerts (red/amber/green flags)
- **Audit Queue:** Items requiring review/approval
- **Key Statistics:** Employees tracked, tests pending, expirations in 30 days
- **Location Readiness:** Site-by-site compliance status
- **Upcoming Expirations:** Certificates, medical cards expiring soon

**Left Sidebar Modules:**
- Employees (Roster)
- Drug & Alcohol Testing
- Background Checks
- DOT Compliance Forms
- Occupational Health
- Training & Certifications
- Billing
- Reports
- Settings
  - Users & Roles
  - Policy Driver Configuration
  - Company Profile
  - Integrations

**Drill-Down Behavior:**
- Click on any tile/alert → Navigate to relevant module
- Click on employee alert → Open Employee 360° view
- Click on expiration warning → Open specific compliance item

#### 3.3 Compliance Officer Workstation
**Users:** Compliance Officers, DER Assistants

**Focus:** Task-oriented workflow management

**Dashboard Components:**
- Work queue table (sortable, filterable)
- Real-time alerts feed
- Bulk actions toolbar
- Employee 360° view (detailed)
- Workflow automations panel

**Key Workflows:**
- Adjudicate background checks
- Review MRO results
- Process adverse actions
- Approve/reject documents
- Bulk status updates

#### 3.4 Field Worker Mobile Portal
**Users:** Drivers, laborers, field employees

**Optimized For:** Mobile devices, simplicity

**Features:**
- My compliance status (dashboard card view)
- Document viewer (licenses, certificates)
- Training completion status
- Site check-in (QR code + geo-fence)
- Upload documents (camera integration)
- Notifications (tests scheduled, expirations)

**UI Considerations:**
- Large touch targets
- Minimal text input
- Camera/photo upload prominent
- Offline mode (future)

#### 3.5 Auditor Portal
**Users:** Internal auditors, external compliance auditors

**Features:**
- Evidence repository (searchable, filterable)
- Control matrix (SOC2, CMMC, HIPAA controls)
- Q&A workflow (submit questions, get responses)
- Sampling tools (random selection algorithms)
- Evidence viewer (documents, screenshots, logs)

---

## 4. Core Features & Modules

### 4.1 Employee Roster (Single Source of Truth)

**Purpose:** Central repository for all employee data

**Features:**
- **Bulk Upload:** CSV/Excel import with field mapping
- **Manual Entry:** Add single employee form
- **Employee 360° View:** All compliance data in one screen
  - Personal info
  - Compliance status by module (traffic light indicators)
  - Document library
  - Test history
  - Training records
  - Alerts and flags
- **Search & Filter:** By name, ID, location, status, compliance level
- **Export:** Secure shareable links (password-protected)
- **Integrations:**
  - Oracle HR (NextEra requirement - HIGH PRIORITY)
  - Manual sync/override

**Data Structure:** PostgreSQL JSONB for flexible schema

**API Endpoints:**
- `GET /api/employees` - List with pagination
- `POST /api/employees` - Create single
- `POST /api/employees/bulk-upload` - CSV/Excel import
- `GET /api/employees/:id` - Employee 360°
- `PATCH /api/employees/:id` - Update
- `DELETE /api/employees/:id` - Soft delete
- `POST /api/employees/export` - Generate shareable link

---

### 4.2 Drug & Alcohol Testing Module

**Compliance Standards:** DOT, Non-DOT, FMCSA

**Features:**

#### Test Types
- Pre-employment
- Random (DOT-compliant random selection algorithm)
- Post-accident
- Reasonable suspicion
- Return-to-duty
- Follow-up

#### Random Pool Management
- Create/manage pools (DOT, Non-DOT)
- Set testing frequency (quarterly, annually)
- Random selection algorithm (audit-proof)
- Pool composition tracking

#### Vendor Integrations
- **CRL (200 LOC adapter):** Primary drug testing vendor
- **Quest Diagnostics (200 LOC adapter):** Chain-of-custody documents
- Webhook ingestion of test results
- Status tracking (ordered, collected, in-lab, resulted)

#### MRO Review Workflow
- Medical Review Officer interface
- Review positive results
- Document medical explanations
- Mark as safety-sensitive or non-reportable

#### Violation Tracking
- DOT violation recording
- SAP (Substance Abuse Professional) referral
- Return-to-duty test scheduling
- Follow-up test scheduling (6 tests in 12 months)

#### Clearinghouse Integration
- Query DOT Drug & Alcohol Clearinghouse
- Report violations
- Limited query (pre-employment)
- Full query (annual)

**Dashboard View:**
- Tests pending collection
- Tests in lab
- Results awaiting review
- Upcoming randoms
- Violations and SAP referrals

---

### 4.3 Background Checks Module

**Compliance Standards:** FCRA, state-specific requirements

**Features:**

#### Screening Types
- Criminal history (county, state, federal)
- Motor Vehicle Records (MVR)
- Employment verification
- Education verification
- Credit check (where allowed)
- Professional licenses
- Sex offender registry
- Global watchlists

#### TazWorks Integration
- **API Integration (200 LOC):** Automated order submission
- Real-time status updates via webhook
- Continuous monitoring (post-hire checks)
- Document retrieval

#### Adjudication Matrix
- Client-configurable rules
- Traffic light system (green/amber/red)
- Severity scoring
- Lookback periods by state
- Disqualifying offenses list

#### FCRA Compliance Workflows
- Adverse action process
  - Pre-adverse action notice
  - 5-day waiting period (configurable)
  - Final adverse action notice
- Disclosure and authorization forms
- Dispute handling

#### Continuous Monitoring
- Ongoing criminal record checks
- MVR updates (quarterly, annually)
- License expiration tracking

**Dashboard View:**
- Screens ordered
- In progress (by stage: county search, state search, etc.)
- Awaiting adjudication
- Adverse actions in progress
- Cleared employees

---

### 4.4 DOT Compliance Forms Module

**Purpose:** Manage 8 core DOT driver qualification documents

**Document Types:**
1. Application for Employment
2. Motor Vehicle Record (MVR)
3. Road Test Certificate OR Commercial Learner's Permit
4. Medical Examiner's Certificate (Medical Card)
5. Clearinghouse Query (pre-employment + annual)
6. Previous Employer Drug & Alcohol Testing Records (3 years)
7. Annual Inquiry and Certification of Violations
8. Annual Motor Vehicle Record Review

**Features:**

#### Document Management
- **Upload:** Drag-and-drop, camera capture
- **OCR Parsing:** Extract key data (Tesseract integration)
  - Medical card: Expiration date, restrictions
  - MVR: Violations, license status
  - Road test: Date, examiner signature
- **Validation:** Check completeness, flag missing items
- **Expiration Tracking:** Auto-alerts 30/60/90 days before expiry

#### Clearinghouse Integration
- Annual queries (automated)
- Pre-employment queries
- Limited vs. full query logic
- Store query results in DQ file

#### DQ File Viewer
- Consolidated view of all 8 documents per driver
- Traffic light status (complete/incomplete/expiring)
- One-click download of entire file (PDF)
- Audit-ready format

**Dashboard View:**
- Incomplete DQ files
- Expiring medical cards (30/60/90 days)
- Pending MVR reviews
- Clearinghouse queries due

---

### 4.5 Occupational Health Module

**Compliance Standards:** OSHA, HIPAA, industry-specific (silica, asbestos, etc.)

**Features:**

#### Physical Examinations
- DOT physicals (separate from Medical Examiner's Certificate)
- Pre-employment physicals
- Periodic exams (annual, biennial)
- Fit-for-duty assessments
- Return-to-work clearances

#### Quest Diagnostics Integration
- Lab result ingestion
- Physical exam results parsing
- HIPAA-compliant document storage

#### Health Surveillance Programs
- Respiratory protection (annual fit tests)
- Audiometric testing (hearing conservation)
- Vision testing
- Pulmonary function tests
- Silica/asbestos exposure monitoring

#### Immunization Tracking
- Hepatitis B, Tetanus, Flu, COVID-19
- Expiration and booster reminders

#### OSHA 300 Log Integration
- Injury and illness recordkeeping
- Days away/restricted/transferred (DART)
- First aid vs. recordable determination

#### HIPAA Privacy Controls
- Encrypted storage (AES-256)
- Access logs (audit trail)
- PHI masking for non-authorized users
- Secure shareable links only (no CSV export of health data)

**Dashboard View:**
- Upcoming physicals
- Expired immunizations
- Fit test due dates
- Injury log (OSHA 300)

---

### 4.6 Training & Certifications Module

**Purpose:** Track required training and professional certifications

**Features:**

#### Certificate Management
- **Upload:** PDF, image (JPEG, PNG)
- **OCR Extraction:** Tesseract-based parsing
  - Certificate name/type
  - Issue date
  - Expiration date
  - Issuing authority
- **Manual Entry:** For OCR failures
- **Verification:** Link to issuing body (where possible)

#### Training Matrix
- Client-defined training requirements by role
- Initial training vs. refresher
- Frequency tracking (annual, triennial)
- Competency assessment results

#### Expiration Management
- Auto-alerts 30/60/90 days before expiry
- Renewal workflow
- Grace periods (configurable)

#### Common Certifications
- CDL (Commercial Driver's License)
- Forklift operator
- CPR/First Aid
- HAZMAT
- Confined space entry
- Fall protection
- Defensive driving

#### Training Records
- Completion certificates
- Attendance logs
- Trainer credentials
- Skills gap analysis

**Dashboard View:**
- Expiring certifications (30/60/90 days)
- Employees missing required training
- Upcoming training sessions
- Compliance rate by training type

---

### 4.7 Policy Driver Engine

**Purpose:** Client-specific compliance rule configuration (replaces hardcoded logic)

**Features:**

#### Compliance Requirement Matrices
- Define required documents/tests by:
  - Role (driver, laborer, supervisor)
  - Location (state, site)
  - Industry (construction, transportation, healthcare)
  - Client-specific policies

#### Warning Period Customization
- Expiration warnings: 30/60/90 days (configurable)
- Grace periods post-expiration
- Escalation rules (email, SMS, dashboard alert)

#### Regulatory Update Propagation
- Update rules across all affected employees
- Version control for policy changes
- Audit trail of policy modifications

#### Multi-Jurisdiction Handling
- State-specific requirements (e.g., California background check rules)
- Federal vs. state regulation conflicts
- Geo-fence-based rule application

#### Traffic Light Logic
- **Green:** Fully compliant
- **Amber:** Warning period (expiring soon)
- **Red:** Non-compliant (expired or missing)

#### Simulation Mode
- Test policy changes before applying
- Impact analysis (how many employees affected)

**UI:**
- Drag-and-drop policy builder
- Template library (DOT driver, construction laborer, healthcare worker)
- Approval workflow for policy changes

---

### 4.8 DER IQ - AI Compliance Assistant

**Purpose:** Contextual AI help system + regulatory guidance

**Technology Stack:**
- **LLM:** Claude via Anthropic MCP
- **Vector DB:** Pinecone (RAG pipeline)
- **Knowledge Base:** Regulatory documents, FAQs, help articles

**Features:**

#### Hovering Chatbot Widget
- **Location:** Bottom-right corner, all pages
- **Appearance:** Small floating button with "?" or "DER IQ" icon
- **Click to Open:** Chat interface slides up (modal or drawer)

#### Context Awareness
- **Current Page Data:** Feed current session context into AI
  - "What does this alert mean?" (knows which alert user is viewing)
  - "How do I fix this employee's compliance issue?" (knows employee ID)
- **User Role:** Tailors responses to user's permission level
- **Company Policies:** References client-specific Policy Driver rules

#### Knowledge Domains
1. **Regulatory Q&A:**
   - "What is DOT random testing frequency?"
   - "Do I need to run an MVR for non-driving employees?"
2. **System Help:**
   - "How do I upload bulk employees?"
   - "Where do I configure user roles?"
3. **Compliance Guidance:**
   - "What is FCRA adverse action process?"
   - "How long do I keep medical records?"
4. **Audit Preparation:**
   - "What documents do I need for DOT audit?"
   - "Show me employees missing DQ files"

#### AI Summary Widget
- **Location:** Dashboard (executive view)
- **Trigger:** One-click button "Generate AI Summary"
- **Output:** 2-3 paragraph summary of compliance status, risks, action items

#### Onboarding Integration
- **Welcome Video:** 10-second intro when user first logs in
  - "Hi, I'm DER IQ. If you have any questions, click this button."
  - Shows where chatbot is located
  - Skippable, shown only once

**Technical Implementation:**
- MCP protocol for Claude integration
- RAG pipeline: Embed regulatory docs, retrieve relevant chunks
- Context injection: Current page state + user role + company policies
- Response streaming for real-time feel

---

### 4.9 Audit Logging System

**Purpose:** Comprehensive activity tracking for security and compliance

**Logged Events:**
- User logins/logouts
- Page views (with timestamps)
- Data modifications (create, update, delete)
  - Employee records
  - Compliance items
  - Policy changes
- Document uploads/downloads
- Export actions (shareable link generation)
- Permission changes
- Failed authentication attempts
- API calls (especially integrations)

**Audit Log Fields:**
- Timestamp (UTC)
- User ID + role
- Action type
- Resource affected (e.g., "Employee ID 12345")
- IP address
- User agent
- Result (success/failure)
- Data diff (before/after values)

**Audit Log Viewer:**
- **Access:** Super Admin, System Admin only
- **Search/Filter:** By user, date range, action type, resource
- **Export:** CSV (for external audit)
- **Retention:** Configurable (default 7 years for compliance)

**Use Cases:**
- Security breach investigation
- Compliance audit (SOC2, HIPAA)
- Dispute resolution (who changed what, when)
- User activity monitoring

---

### 4.10 Billing Module

**Purpose:** Usage-based billing and invoice management

**Integration:** Stripe Connect (multi-party payments)

**Features:**

#### Subscription Management
- Tiered plans (Basic, Professional, Enterprise)
- Per-employee pricing (e.g., $5/employee/month)
- Module-based add-ons (e.g., Geo-fencing +$500/month)

#### Usage Tracking
- Active employees (billable)
- Tests ordered (drug, background)
- Documents stored (GB)
- API calls (for integrations)

#### Invoice Generation
- Automated monthly invoicing
- PDF generation
- Itemized line items
- Tax calculation (Stripe Tax)

#### Payment Splitting
- **Service Company:** Pays for subscription
- **Compliance Company (PCS):** Receives percentage
- Stripe Connect handles splits

#### Payment Portal
- View invoices
- Download PDF
- Update payment method
- View payment history

**Dashboard View:**
- Current month usage
- Outstanding invoices
- Payment history
- Upcoming charges

---

### 4.11 Geo-Fencing System

**Purpose:** Location-based compliance triggers and site check-in

**Technology:** PostGIS (PostgreSQL extension for spatial queries)

**Features:**

#### Jurisdiction Boundary Management
- Define zones (states, counties, cities, specific sites)
- Assign compliance requirements to zones
- Map view of boundaries

#### Location-Based Compliance Triggers
- **Example:** Employee enters California → trigger CA-specific background check
- **Example:** Driver assigned to DOT route → trigger DOT medical exam requirement

#### Site Check-In
- Mobile app: Employee clicks "Check In"
- GPS coordinates captured
- Verify within geo-fence boundary
- Log check-in time
- **Security:** Cannot check in from wrong location

#### Route Compliance Monitoring
- Track driver routes (integration with fleet management systems)
- Verify driver compliance along route (state-specific)
- Alert if driver enters state without required compliance

#### Mobile Integration
- QR code at site entrance (alternative to GPS for indoor sites)
- Bluetooth beacon check-in (future)

**Dashboard View:**
- Employees on-site (live map)
- Check-in history
- Geo-fence violations

---

### 4.12 Secure Shareable Links (Replaces CSV Exports)

**Purpose:** HIPAA/PII-compliant data sharing

**Security Features:**
- **Password Protection:** Required for all links
- **Expiration:** Time-based (1 hour, 1 day, 1 week, custom)
- **Audit Logging:** Track who accessed link, when, from which IP
- **One-Time Use:** Option for link to expire after first view
- **Watermarking:** Optional watermark on exported PDFs

**Use Cases:**
- Share employee compliance status with client
- Provide audit evidence to external auditor
- Send invoice to accounting department
- Share pool selection results with FMCSA inspector

**Implementation:**
- Generate unique token (UUID)
- Store in database with:
  - Resource ID (what data is shared)
  - Password hash (bcrypt)
  - Expiration timestamp
  - Access log
- `/share/:token` route prompts for password
- After validation, display data (read-only)

**Why Not CSV Export?**
- CSV leaves system → no control over data
- HIPAA violations if emailed unsecured
- No audit trail of who viewed data
- Shareable links: Auditable, expirable, secure

---

## 5. Technical Architecture

### 5.1 Frontend Stack

**Framework:** Next.js 14 (App Router)
**Language:** TypeScript
**Styling:** Tailwind CSS
**Component Library:** shadcn/ui (Radix UI primitives)
**State Management:** React Context + Zustand (for complex state)
**Forms:** React Hook Form + Zod validation
**Charts:** Recharts or Chart.js
**Tables:** TanStack Table (React Table v8)
**Date Handling:** date-fns
**Authentication:** NextAuth.js

### 5.2 Backend Stack

**Framework:** Next.js API Routes (initially), migrate to separate NestJS backend (later)
**Language:** TypeScript/Node.js
**Database:** PostgreSQL 15+ with JSONB
**ORM:** Prisma
**Cache:** Redis (ElastiCache)
**Storage:** AWS S3 (encrypted)
**Event Bus:** Kafka (AWS MSK)
**Search:** PostgreSQL Full-Text Search (initially), Elasticsearch (future)

### 5.3 Database Schema Highlights

**Multi-Tenancy:** Schema-per-tenant approach
- `company_12345.employees`
- `company_12345.compliance_events`
- `company_67890.employees`

**Employee Roster (JSONB flexibility):**
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  company_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  compliance_data JSONB, -- Flexible schema for all compliance modules
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Example compliance_data JSONB:
{
  "drug_testing": {
    "status": "green",
    "last_test_date": "2025-09-15",
    "next_random_date": "2026-01-10",
    "violations": []
  },
  "background": {
    "status": "amber",
    "last_check_date": "2024-06-01",
    "expiration_date": "2026-06-01",
    "adjudication": "approved_with_conditions"
  },
  "dot_file": {
    "status": "red",
    "missing_items": ["medical_certificate", "annual_mvr"]
  }
}
```

### 5.4 Event-Driven Architecture

**Not 16 Microservices → Single Service + Event Bus**

**Event Flow:**
1. **Vendor Webhook** (TazWorks, CRL, Quest) → API endpoint
2. **Parse & Validate** → Adapter (200 LOC per vendor)
3. **Publish Event** to Kafka topic → `compliance.background.completed`
4. **Universal Compliance Processor** consumes event
5. **Update Employee Roster** (JSONB)
6. **Evaluate Policy Driver Rules** → Calculate green/amber/red
7. **Publish Alert Event** if red → `alerts.employee.noncompliant`
8. **Alert Consumer** sends notifications (email, SMS, dashboard)

**Benefits:**
- Add new vendor: Write 200 LOC adapter (1 day)
- Add new compliance type: Define new schema (1 day)
- No cascading service failures
- Easy to scale (partition by employee_id)

### 5.5 AWS Infrastructure

**Compute:**
- EKS (Kubernetes) for container orchestration
- Auto-scaling node groups

**Database:**
- RDS PostgreSQL Multi-AZ
- Automated backups, point-in-time recovery

**Cache:**
- ElastiCache Redis cluster

**Storage:**
- S3 with encryption at rest (AES-256)
- CloudFront CDN for static assets

**Networking:**
- VPC with public/private subnets
- WAF (Web Application Firewall)
- Shield Standard (DDoS protection)

**Security:**
- Secrets Manager (API keys, DB credentials)
- KMS (Key Management Service) for encryption
- CloudWatch for monitoring
- GuardDuty for threat detection

**Messaging:**
- MSK (Managed Kafka) for event bus

**Compliance:**
- SOC2 Type II (in progress, start audit prep day 1)
- HIPAA-compliant infrastructure
- CMMC (future, for government contracts)
- FedRAMP (future, GovCloud)

### 5.6 Siloed Hosting for Large Clients

**Problem:** Chevron may require data isolation, custom hosting

**Solution:** Multi-tenant at software level, single-tenant at infrastructure level

**Implementation:**
- **Standard Clients:** Shared RDS, shared EKS cluster, schema-per-tenant
- **Enterprise Clients (Chevron):** Dedicated RDS, dedicated EKS, dedicated S3 bucket
- **Same Codebase:** Deploy identical Docker image to both environments
- **Configuration:** Environment variables differentiate tenants

**Cost Model:**
- Standard: $5/employee/month (shared infra)
- Enterprise: $50k/year base + $10/employee/month (dedicated infra)

---

## 6. Integration Requirements

### 6.1 Oracle HR Integration (HIGH PRIORITY)

**Client:** NextEra (mentioned by Susan)
**Purpose:** Live employee roster syncing

**Current State:**
- TASis system (predecessor) has Oracle integration
- Oracle owns 95% of ERP market
- Integration is standard ask

**Technical Approach:**
- Oracle ERP Cloud REST API
- OAuth 2.0 authentication
- Webhook notifications for employee changes (hire, term, transfer)
- Scheduled sync (daily) as fallback

**API Endpoints:**
- `GET /hcmRestApi/resources/11.13.18.05/workers` - Fetch employees
- `GET /hcmRestApi/resources/11.13.18.05/workers/{WorkerId}` - Fetch single employee
- Webhook: `POST /api/integrations/oracle` (PCS receives notifications)

**Data Mapping:**
- Oracle `WorkerId` → PCS `employee_id`
- Oracle `PersonName` → PCS `first_name`, `last_name`
- Oracle `WorkEmail` → PCS `email`
- Oracle `AssignmentStatus` → PCS `employment_status`

**Gotchas (Jim's Warning):**
- Oracle licensing (CPU-based, expensive, buckets of 16 CPUs)
- Not all clients will use Oracle ERP (some use Oracle HCM only)
- Oracle has multiple products (ERP, HCM, NetSuite)

**Alternative Path:**
- Offer PCS as Oracle replacement (migrate away)
- PCS handles employee roster natively
- "Just as hard to integrate as to migrate"

**Action Items:**
- Jaime to clarify Oracle details with NextEra within 2 weeks
- Richard to research Oracle ERP Cloud API
- Estimate integration effort (2-4 weeks dev time)

---

### 6.2 TazWorks (Background Checks)

**Vendor:** TazWorks
**Purpose:** Automated background check ordering and result retrieval

**Integration Type:** REST API + Webhooks

**Key Endpoints:**
- `POST /api/orders` - Submit background check order
- `GET /api/orders/{orderId}` - Check status
- Webhook: `POST /api/integrations/tazworks` (PCS receives status updates)

**Order Payload:**
```json
{
  "applicant": {
    "firstName": "John",
    "lastName": "Doe",
    "ssn": "***-**-1234",
    "dob": "1985-03-15"
  },
  "screeningPackage": "comprehensive",
  "components": ["criminal_county", "criminal_state", "mvr"]
}
```

**Webhook Events:**
- `order.created`
- `order.in_progress`
- `order.completed`
- `order.disputed`

**Continuous Monitoring:**
- Subscribe to ongoing alerts
- Receive webhook when new criminal record found

**Adapter Code:** ~200 lines

---

### 6.3 CRL (Drug Testing)

**Vendor:** CRL
**Purpose:** Drug test ordering and result ingestion

**Integration Type:** Proprietary API (vendor-specific format)

**Key Functions:**
- Order test (pre-employment, random, post-accident)
- Receive MRO-reviewed results
- Chain-of-custody documents

**Data Flow:**
1. PCS → CRL: Order test for employee
2. Employee → CRL Collection Site: Provides sample
3. CRL Lab → CRL: Test results
4. MRO → CRL: Reviews positive results
5. CRL → PCS (Webhook): Final result (negative, positive, positive-MRO-explained)

**Adapter Code:** ~200 lines

---

### 6.4 Quest Diagnostics

**Vendor:** Quest
**Purpose:** Occupational health testing (physicals, labs)

**Integration Type:** HL7 interface (healthcare standard)

**Key Functions:**
- Order physical exam
- Retrieve lab results (blood work, urinalysis)
- Chain-of-custody for DOT drug tests (alternative to CRL)

**HIPAA Considerations:**
- Encrypted transmission (TLS 1.2+)
- BAA (Business Associate Agreement) required
- PHI handling protocols

**Adapter Code:** ~200 lines

---

### 6.5 Stripe (Billing)

**Purpose:** Payment processing and subscription management

**Integration Type:** Stripe API + Stripe Connect

**Key Features:**
- Subscription billing
- Invoice generation
- Payment splitting (service company vs. PCS)
- Usage-based pricing

**Webhook Events:**
- `invoice.created`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`

**Implementation:**
- Stripe Customer per service company
- Stripe Connect Account per compliance company (PCS)
- Platform fee (PCS takes 10-20% of transaction)

---

## 7. Security & Compliance

### 7.1 Data Protection

**Encryption:**
- **At Rest:** AES-256 (S3, RDS)
- **In Transit:** TLS 1.3 (all API calls)
- **Database:** PostgreSQL encrypted columns for SSN, DOB

**PHI/PII Masking:**
- SSN displayed as `***-**-1234` (last 4 only)
- DOB shown as `MM/DD/****` for non-authorized users
- Full data only visible to roles with `view_phi` permission

**Secrets Management:**
- AWS Secrets Manager for API keys
- No hardcoded credentials in code
- Rotate secrets every 90 days

### 7.2 HIPAA Compliance

**Administrative Safeguards:**
- Security officer designated (Jim)
- Workforce training (annual)
- Access management (RBAC)
- Incident response plan

**Technical Safeguards:**
- Unique user IDs (no shared accounts)
- Automatic logoff (15 min inactivity)
- Encryption (at rest and in transit)
- Audit controls (logging all PHI access)

**Physical Safeguards:**
- AWS data centers (HIPAA-compliant)
- No on-premise servers

**Business Associate Agreements (BAAs):**
- Quest Diagnostics
- Any vendor handling PHI

### 7.3 SOC2 Type II

**Timeline:** Start audit prep day 1, complete audit in 12 months

**Key Controls:**
- Access control (RBAC)
- Change management (Git, code review)
- Backup and recovery (RDS automated backups)
- Incident response
- Vendor management
- Security monitoring

**Evidence Repository:**
- Store screenshots, logs, policies in Auditor Portal
- Make audit-ready from day 1

### 7.4 FCRA Compliance (Background Checks)

**Requirements:**
- Written disclosure to applicant
- Standalone authorization form
- Pre-adverse action notice (with copy of report)
- 5-day waiting period
- Final adverse action notice (with dispute instructions)

**PCS Implementation:**
- Automated adverse action workflow
- Email templates (FCRA-compliant)
- Waiting period enforcement
- Dispute tracking

### 7.5 CMMC & FedRAMP (Future)

**CMMC (Cybersecurity Maturity Model Certification):**
- Required for government contractors
- Level 1-3 (PCS targets Level 2)
- 110 security requirements

**FedRAMP (Federal Risk and Authorization Management Program):**
- Required for government cloud services
- AWS GovCloud deployment
- Continuous monitoring

**Status:** Not immediate, but architecture designed to support

---

## 8. Development Phases

### Phase 1: Frontend Prototype (Weeks 1-8, Accelerated to 4 weeks)

**Goal:** Clickable prototype with realistic demo data

**Deliverables:**
- Login screen (email OTP, SSO buttons)
- Onboarding wizard (10-sec video, DER IQ intro)
- All 5 portal views (Executive, Service Company, Compliance Officer, Field Worker, Auditor)
- Core dashboards with drill-down (clickable tiles)
- RBAC user switching for demo
- DER IQ chatbot widget (UI only, no AI backend)
- Settings module (user management, Policy Driver config screen)
- Audit log viewer (mock data)

**Design:**
- QuickBooks-inspired (white background, blue text)
- Responsive (desktop-first, mobile-optimized for Field Worker portal)
- Accessibility (WCAG 2.1 AA compliant)

**Tools:**
- v0.dev for rapid prototyping
- Figma for design handoff (if needed)

**Demo Schedule:**
- Friday: Design updates, RBAC, drill-downs
- Next Week: Workflow demonstrations (alerts, billing, audit)

---

### Phase 2: Backend Core (Months 2-5)

**Goal:** Production-ready backend with API

**Deliverables:**
- PostgreSQL schema (multi-tenant)
- Prisma ORM setup
- NextAuth.js authentication (email OTP, SSO)
- RBAC middleware
- Employee Roster API (CRUD + bulk upload)
- Kafka event bus setup
- Universal compliance processor (event consumer)
- Audit logging service
- S3 document storage

**No Integrations Yet:** Use manual upload for compliance data

---

### Phase 3: Compliance Modules (Months 6-10)

**Goal:** All 5 compliance modules functional

**Deliverables:**
- Drug & Alcohol Testing module
- Background Checks module
- DOT Compliance Forms module
- Occupational Health module
- Training & Certifications module
- Policy Driver engine (rule configuration)
- Alert system (email notifications)

**Still Manual Entry:** No vendor integrations yet

---

### Phase 4: Vendor Integrations (Months 11-13)

**Goal:** Automated data ingestion

**Deliverables:**
- TazWorks integration (background checks)
- CRL integration (drug testing)
- Quest Diagnostics integration (health testing)
- Oracle HR integration (employee roster sync)
- Stripe integration (billing)
- Webhook endpoints for all vendors

---

### Phase 5: DER IQ AI System (Months 13-14)

**Goal:** Production AI assistant

**Deliverables:**
- Claude MCP integration
- Pinecone vector DB (RAG)
- Knowledge base embeddings (regulations, FAQs)
- Context-aware responses
- AI summary widget

---

### Phase 6: Advanced Features (Month 14-15)

**Goal:** Geo-fencing, mobile app, polish

**Deliverables:**
- PostGIS geo-fencing
- Mobile app (React Native or PWA)
- Site check-in (GPS + QR code)
- Advanced reporting
- Performance optimization
- Security hardening
- SOC2 audit completion

---

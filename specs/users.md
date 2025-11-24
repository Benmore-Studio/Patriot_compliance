PORTAL ARCHITECTURE BREAKDOWN

  1. SERVICE COMPANY PORTAL (Primary B2B Customer)

  A. DER / Safety Manager / HSC (Admin Level)

  Access:
  - Full dashboard with compliance meter
  - Employee roster (view, add, edit, bulk upload, export)
  - All compliance modules (configure & manage)
  - Policy Driver (configure requirements)
  - Communications (send to teams)
  - Reports & analytics
  - Settings & user management
  - Geo-fencing setup

  Features:
  - Compliance meter + policy progress tiles
  - Alerts center (actionable)
  - Audit queue
  - Key statistics
  - Location readiness
  - Roster exceptions
  - DER IQ AI assistant (floating widget)
  - Oracle HR integration management

  ---
  B. Compliance Officer / DER Assistant (Operational Level)

  Access:
  - Work queue dashboard (task-focused)
  - Employee 360° view (detailed)
  - Drug testing (review MRO results)
  - Background checks (adjudication matrix)
  - Document approval workflow
  - Bulk actions toolbar
  - Real-time alerts feed
  - Workflow automations

  Features:
  - Task queue (sortable, filterable)
  - Bulk approve/reject
  - Adjudication workflows
  - MRO review interface
  - Adverse action processing
  - Search & filters
  - DER IQ contextual help

  ---
  C. Field Worker (PCS Pass - Mobile First)

  Access:
  - My compliance status (dashboard)
  - My documents (view only)
  - Upload documents (camera + file)
  - Site check-in (GPS + QR code)
  - Notifications (personalized)
  - Profile settings

  Features:
  - Overall status badge (green/yellow/red)
  - Module cards (Drug Testing, Background, Training, Medical)
  - Quick actions (upload, check-in)
  - Shareable link generator (for job applications)
  - Subscription management
  - Mobile bottom nav

  ---
  D. Executive / C-Suite

  Access:
  - High-level KPI dashboard
  - Geographic heat map
  - Top 10 risks register
  - Compliance by module (bar charts)
  - Service company portfolio (multi-company view)
  - Recent reports
  - AI-generated executive summary

  Features:
  - 4 KPI cards (compliance %, employees, revenue, risks)
  - Trend indicators (up/down arrows)
  - Drill-down to detailed views
  - Export executive reports
  - Minimal detail, maximum insight

  ---
  2. COMPLIANCE COMPANY PORTAL (PCS Internal / Multi-Tenant)

  A. Portfolio Manager / Account Manager

  Access:
  - Portfolio view (all service companies)
  - Company selector sidebar
  - Cross-company analytics
  - Alerts & actions center
  - Billing & payments (invoice generation)
  - MIS reporting
  - Communications hub

  Features:
  - Service company cards (filterable, searchable)
  - Compliance scores per company
  - Revenue dashboard
  - Overdue invoices
  - Company-level health metrics
  - Bulk communications

  ---
  B. Occupational Health Coordinator

  Access:
  - OH oversight dashboard
  - Physical exam tracking (all companies)
  - Quest Diagnostics integration
  - OSHA 300 log aggregator
  - Health surveillance programs
  - Immunization tracking

  Features:
  - Upcoming physicals (cross-company)
  - Expired immunizations
  - Fit test schedules
  - Injury/illness recordkeeping
  - HIPAA-compliant document viewer

  ---
  C. Training Program Manager

  Access:
  - Training certifications dashboard
  - Certificate library (all companies)
  - Training matrix management
  - Expiration alerts
  - OCR document processing

  Features:
  - Expiring certifications (30/60/90 days)
  - Training completion rates
  - Competency assessments
  - Bulk certificate uploads

  ---
  D. Auditor (Internal or External)

  Access:
  - Evidence repository (searchable)
  - Control matrix (SOC2, CMMC, HIPAA)
  - Q&A workflow
  - Sampling tools (random selection)
  - Audit trail viewer
  - Read-only access to all modules

  Features:
  - Advanced search & filters
  - Document export (secure links only)
  - Compliance statistics
  - Control verification status
  - Audit sampling algorithms
  - Evidence viewer


 Now let me generate the v0 commands for restructuring:

  V0 COMMANDS FOR PORTAL RESTRUCTURING

  PHASE 1: SERVICE COMPANY PORTAL

  Command 1.1: DER/Admin Main Dashboard

  Create a Next.js 14 compliance dashboard for a service company DER/Safety Manager with:
  - Top section: circular compliance meter showing 94% with color gradient (green), large and centered
  - Grid of 6 policy progress tiles below meter: "Drug Testing 92%", "Background Checks 87%", "DOT
  Compliance 91%", "Health & Safety 96%", "Training 89%", "Geo-Fencing 98%" - each tile clickable with
   icon, percentage, and mini progress bar
  - Alerts center card with tabs: "Critical (3)", "Warnings (12)", "Info (5)" - each alert has icon,
  title, employee name, timestamp, and "Review" button
  - Audit queue table with columns: Employee, Type, Action Required, Priority (badge), Due Date,
  Status - includes bulk action checkboxes and toolbar
  - 4 key statistics cards at bottom: "Employees Tracked: 156", "Tests Pending: 8", "Expiring in 30
  Days: 12", "Sites Active: 5"
  - Use shadcn/ui components, Tailwind, lucide-react icons
  - Dark mode support
  - Responsive grid layout (mobile: 1 col, tablet: 2 col, desktop: 3 col)
  - Traffic light color system: green (#16a34a), yellow (#eab308), red (#dc2626)

  Command 1.2: Compliance Officer Work Queue

  Create a task-focused compliance officer workstation in Next.js 14 with:
  - Header with 4 stat cards: "Pending Tasks: 47", "High Priority: 12", "Completed Today: 28", "Avg
  Time: 4.2h"
  - Work queue table with: checkbox column for bulk selection, Employee, Type (Drug
  Test/Background/Document), Action Required, Priority badge (High=red, Medium=yellow, Low=gray), Due
  Date, Status badge, Actions (Review/Approve buttons)
  - Bulk actions toolbar appears when items selected: "Approve (X)", "Reject (X)", "Assign" buttons
  - Filter bar with: search input, priority dropdown, type dropdown, "More Filters" button
  - Tabs: "Work Queue", "Real-Time Alerts", "Workflow Automations"
  - Real-Time Alerts tab: feed of alerts with timestamp, priority icon, title, employee, "Review"
  action
  - Workflow Automations tab: list of automation rules with toggle switches and "Configure" buttons
  - Use shadcn/ui table, badge, button, tabs, checkbox, select components
  - Sortable table columns

  Command 1.3: Field Worker Mobile Portal (PCS Pass)

  Create a mobile-first field worker compliance portal in Next.js 14 with:
  - Header: gradient blue background, shield icon, "PCS Pass" title, "Active" badge
  - Overall status card: large centered display with compliance percentage (94%), progress bar,
  traffic light indicator (green circle), "Compliant" text, "All requirements up to date" subtitle
  - Notifications panel with tabs: "All", "Urgent", "Info" - each notification card has icon, title,
  message, optional action link, "New" badge if unread
  - 4 module cards in 2x2 grid: "Drug Testing", "Background Check", "Training & Certifications",
  "Medical/Physical" - each card shows status badge (green checkmark), last test/completion date, next
   due date, "View Details" link
  - Quick actions: 2 large cards - "Upload Documents" (camera icon, blue) and "Site Check-In" (map pin
   icon, green)
  - Upload modal: drag-drop zone, "Choose File" button, "Take Photo" button, document type dropdown
  - Check-in modal: current location display, "Check In Now" button (large), "Scan QR Code" button,
  recent check-ins list
  - Shareable link generator: checkboxes for modules to share, expiration dropdown, password input,
  "Generate Link" button, link preview with copy button
  - Bottom navigation bar (fixed): Home, Documents, Notifications (with badge count), Profile icons
  - Use shadcn/ui, large touch targets (48px min), card-based layout, minimal text

  Command 1.4: Executive Command Center

  Create an executive-level compliance dashboard in Next.js 14 with:
  - Top right: "Generate AI Summary" button with sparkle icon
  - 4 large KPI cards: "Overall Compliance 94.2%" (green, +2.4% trend), "Active Employees 1,247" (+18,
   low risk score), "Revenue (MRR) $124,500" (+8.2% green), "Critical Risks 7" (-3 trend, 92% audit
  readiness)
  - Geographic heat map card: list of locations with traffic light dots, compliance percentages,
  employee counts - Houston 96% green, Dallas 91% yellow, etc.
  - Top 10 risks card: numbered list with risk title, affected count, severity badge (High=red,
  Medium=yellow), trend arrows
  - Compliance by module card: horizontal progress bars for each module (Drug Testing 96%, Background
  94%, DOT 91%, Health 97%, Training 89%)
  - Service company portfolio card: company cards with logo placeholder, compliance score, employee
  count, status indicator
  - Recent reports list with file icon, report name, date, "View" button
  - Executive actions panel: 3 action buttons with icons
  - Use large text, minimal tables, maximum data visualization, trend indicators everywhere

  ---
  PHASE 2: COMPLIANCE COMPANY PORTAL

  Command 2.1: Portfolio Manager Dashboard

  Create a multi-tenant portfolio management dashboard in Next.js 14 with:
  - Left sidebar: service company selector with search, company list with logos, compliance scores,
  pin/favorite functionality
  - Main area: navigation cards in grid (5 columns on desktop): "Portfolio View", "Alerts & Actions",
  "Billing & Payments", "OH Oversight", "Training Programs", "Employee Roster", "Geo-Fence", "Policies
   & AI", "MIS Reporting", "Communications" - each card has icon, title, description, active state
  highlight
  - Portfolio view: company cards showing company name, logo, compliance score (circular), employee
  count, status badge (green/yellow/red), revenue, last activity, "View Details" button
  - Filters: compliance range slider, employee count range, status dropdown, location filter
  - Summary stats at top: "Total Companies: 24", "Avg Compliance: 92%", "Total Employees: 3,456",
  "MRR: $245K"
  - Quick actions floating button for bulk operations
  - Use shadcn/ui, responsive grid, card hover effects, smooth transitions

  Command 2.2: Auditor Evidence Repository

  Create an auditor evidence repository portal in Next.js 14 with:
  - Search bar with advanced filters: employee name, document type, date range, compliance module
  - 4 stat cards: "Total Records: 12,458", "Compliant: 11,742 (94.3%)", "Non-Compliant: 716", "Pending
   Review: 142"
  - Tabs: "Evidence Repository", "Control Matrix", "Q&A Workflow", "Sampling Tools"
  - Evidence table: Employee, Module, Document Type, Date, Status badge (green checkmark/red X/yellow
  clock), Actions (View/Download icons)
  - Control Matrix: nested tabs for SOC2/CMMC/HIPAA, each showing list of controls with shield icon,
  control number & description, evidence count, verification status badge
  - Q&A Workflow: question cards with module badge, status badge (Answered/Pending), question text,
  date, "View Details" link, "New Question" button in header
  - Sampling Tools: form with inputs for population size, sample size, sampling method dropdown
  (Simple Random/Systematic/Stratified), module filter, "Generate Sample" button
  - Read-only styling: no edit/delete buttons, view-only badges, download/export emphasis
  - Use shadcn/ui table, tabs, badge, dialog components

  ---
  PHASE 3: SHARED COMPONENTS & MODULES

  Command 3.1: Employee Roster with 360° View

  Create a comprehensive employee roster page in Next.js 14 with:
  - Header with "Employee Roster" title, "Single source of truth" subtitle
  - Action buttons: "Bulk Upload" (opens modal), "Export", "Add Employee"
  - 4 stat cards: "Total: 156", "Active: 152 (97%)", "Compliant: 143 (92%)", "At Risk: 9"
  - Search bar with filter button
  - Employee table: ID, Name, Role, Department, Location, Status badge (green Active), Compliance
  badge (green Compliant/yellow At Risk/red Non-Compliant), Actions (View/Edit/Delete icons)
  - Clicking row opens Employee 360° modal/page with:
    - Employee header: photo, name, ID, role, status badges
    - Tabs: "Overview", "Drug Testing", "Background", "DOT Compliance", "Health", "Training",
  "Documents"
    - Overview tab: compliance cards for each module with traffic lights, key dates, alerts
    - Each module tab: detailed history, documents, timeline, status changes
    - Action buttons: "Edit Employee", "Upload Document", "Send Notification", "Generate Report"
  - Bulk upload modal: drag-drop zone, file format info (CSV/Excel), required fields list, "Upload &
  Process" button
  - Use shadcn/ui table, dialog, tabs, badge, avatar components
  - Responsive: table scrolls on mobile, cards stack

  Command 3.2: Drug Testing Module Dashboard

  Create a drug testing compliance module in Next.js 14 with:
  - Module header: "Drug & Alcohol Testing" title, test tube icon, compliance score badge
  - 6 stat cards: "Tests Pending: 8", "In Lab: 12", "Results Awaiting Review: 5", "Violations: 2",
  "Random Pool: 87 employees", "Clearinghouse Queries: 3 pending"
  - Tabs: "Test Schedule", "Random Pools", "MRO Review", "Violations", "Clearinghouse"
  - Test Schedule: calendar view + table with Employee, Test Type
  (Pre-employment/Random/Post-accident/Reasonable Suspicion/Return-to-duty/Follow-up), Collection
  Date, Status, Vendor, Actions
  - Random Pools: pool cards showing pool name (DOT/Non-DOT), employee count, frequency
  (Quarterly/Annual), last selection date, next selection date, "Select Now" button, "View Pool" link
  - MRO Review: table of positive results with Employee, Test Date, Result, Substances, MRO Notes,
  "Review" button opening review modal with medical explanation field, "Safety-Sensitive" checkbox,
  "Approve/Reject" buttons
  - Violations: employee cards with violation date, type, SAP referral status, return-to-duty test
  status, follow-up test schedule (6 in 12 months), timeline visualization
  - Clearinghouse: query log with Query Type (Limited/Full), Employee, Date, Result, "Report
  Violation" button
  - Use shadcn/ui, calendar component, tables, badges, timeline

  Command 3.3: Background Check Adjudication

  Create a background check adjudication interface in Next.js 14 with:
  - Header: "Background Checks" title, shield icon, compliance score
  - 4 stat cards: "Ordered: 24", "In Progress: 15", "Awaiting Adjudication: 8", "Cleared: 142"
  - Tabs: "Screening Orders", "Adjudication Queue", "Adverse Actions", "Continuous Monitoring"
  - Screening Orders: table with Employee, Order Date, Screening Type
  (Criminal/MVR/Employment/Education/Credit), Vendor (TazWorks), Status stages, Actions (View Report)
  - Adjudication Queue: employee cards with report summary, adjudication matrix traffic light
  (green/amber/red based on rules), severity score, disqualifying offenses highlighted, lookback
  period info, "Approve/Reject/Flag" buttons
  - Adjudication modal: full report viewer, configurable rules panel (county lookback, state lookback,
   federal lookback, disqualifying offenses checklist), severity calculator, notes field, decision
  buttons
  - Adverse Actions: workflow cards showing Pre-Adverse Notice (date sent, 5-day timer countdown),
  Final Adverse Notice (date sent), Dispute (if filed), employee name, reason, status
  - Continuous Monitoring: active monitoring list with last check date, frequency, "Run Check Now"
  button
  - Use shadcn/ui, multi-step workflow, countdown timer, severity indicators

  Command 3.4: DER IQ AI Chat Widget

  Create a floating AI chat widget in Next.js 14 with:
  - Floating button: fixed bottom-right, "?" or "DER IQ" icon, blue gradient, pulse animation
  - Click opens drawer/modal sliding from right
  - Chat interface: message list (user messages right-aligned blue, AI messages left-aligned gray),
  input field at bottom with send button
  - Welcome message on first open: "Hi! I'm DER IQ. How can I help you today?" with quick action
  chips: "What is DOT random testing frequency?", "How do I upload employees?", "Explain adverse
  action process"
  - Context awareness: widget knows current page and can reference data on screen
  - Message formatting: supports markdown, code blocks, lists, links
  - Typing indicator when AI is responding
  - "Clear Chat", "Copy Response", "Helpful/Not Helpful" buttons
  - Collapsible history panel on side
  - Keyboard shortcut to open: Cmd+K or Ctrl+K
  - Use shadcn/ui drawer, scroll-area, markdown renderer
  - Smooth animations, auto-scroll to latest message

  ---
  PHASE 4: NAVIGATION & LAYOUT

  Command 4.1: Unified App Shell with Portal Switcher

  Create a Next.js 14 app shell layout with:
  - Top header bar: logo (left), global search (center), notifications bell with badge, portal
  switcher dropdown, user avatar with dropdown (right)
  - Portal switcher: dropdown showing available portals based on user role - "Service Company",
  "Compliance Company", "Executive View", "Auditor View", "Field Worker" with icons and current
  selection highlighted
  - Collapsible left sidebar: toggle button, navigation items with icons, nested submenus with chevron
   expansion, active state highlighting, dark mode toggle at bottom, user profile section
  - Breadcrumbs below header: Home > Compliance > Drug Testing with chevron separators
  - Main content area: children prop, max-width container, responsive padding
  - DER IQ floating widget always visible (except in field worker portal)
  - Quick actions floating action button: fixed bottom-right (above DER IQ), opens menu with common
  actions
  - Use shadcn/ui sidebar, dropdown-menu, command palette, breadcrumb
  - Smooth transitions, persistent state in localStorage

  Command 4.2: Policy Driver Configuration Interface

  Create a Policy Driver configuration page in Next.js 14 with:
  - Header: "Policy Driver" title, "Compliance rule engine" subtitle, "Save Changes" and "Test Policy"
   buttons
  - Left panel: policy templates library - "DOT Driver", "Construction Laborer", "Healthcare Worker",
  "Custom" with "Use Template" buttons
  - Main area: drag-and-drop policy builder
    - Role selector: dropdown to select role (Driver/Laborer/Supervisor)
    - Required documents section: add/remove document types with drag handles, set as
  mandatory/optional
    - Expiration warnings: sliders for 30/60/90 day warnings, grace periods
    - Location-based rules: state/site selector, add exceptions
    - Test type requirements: checkboxes for Pre-employment/Random/Post-accident
    - Training requirements: checklist with frequencies (Annual/Triennial)
  - Right panel: impact analysis - "X employees affected", "Y items will expire", simulation preview
  - Traffic light logic configuration: green threshold, amber threshold, red threshold sliders
  - Version control: save as new version, compare versions, rollback
  - Approval workflow: if enabled, shows approval chain
  - Use shadcn/ui, react-beautiful-dnd, slider, switch, tabs

  ---
  PHASE 5: OPTIMIZATION & POLISH

  Command 5.1: Shareable Links Management

  Create a shareable links management page in Next.js 14 with:
  - Header: "Shareable Links" title, "Secure data sharing" subtitle, "Create New Link" button
  - Active links table: Link Name, Resource Type (Employee/Report/Roster), Created Date, Expires,
  Access Count, Password Protected (lock icon), Status (Active/Expired), Actions (Copy/Revoke/View
  Log)
  - Create link modal:
    - Resource selector: search for employee/report/document
    - Modules to include: checkboxes for Drug Testing, Background, Training, Medical
    - Expiration: dropdown (1 hour, 1 day, 1 week, 30 days, custom date picker)
    - Password: required input, strength indicator
    - One-time use: toggle switch
    - Watermark: toggle switch
    - Generate button
    - Link preview with copy button, QR code
  - Access log modal: table showing Who Accessed, IP Address, Date/Time, Browser/Device
  - Expired links section: collapsed by default, "View Expired" button
  - Use shadcn/ui table, dialog, calendar, switch, password input

  Command 5.2: Communications Hub

  Create a unified communications hub in Next.js 14 with:
  - Header: "Communications" title, "Announcements & notifications" subtitle
  - Tabs: "Compose", "History", "Templates", "Settings"
  - Compose tab:
    - Recipient selector: "All Employees", "By Role", "By Location", "By Compliance Status", "Custom
  Selection" with multi-select dropdown
    - Channel selection: checkboxes for Email, SMS, In-App Notification, Push Notification
    - Message composer: rich text editor with formatting, variable insertion ({{employee_name}},
  {{company_name}}), attachment upload
    - Preview panel: shows how message looks in each channel
    - Schedule: send now or schedule date/time picker
    - "Send" and "Save as Draft" buttons
  - History tab: table of sent messages with Date, Recipients Count, Subject, Channels (icons),
  Delivery Status (X/Y delivered), Open Rate (for email), "View Details" button
  - Templates tab: saved message templates with name, description, last used, "Use Template" button,
  "Edit/Delete" actions
  - Settings tab: signature configuration, default sender name, SMS credits remaining, integration
  status (Twilio, SendGrid)
  - Use shadcn/ui, tiptap or similar rich text editor, multi-select, calendar

  ---
  IMPLEMENTATION STRATEGY

  Priority Order:

  1. Phase 1 (Service Company Portal) - Core customer-facing features
  2. Phase 3 (Shared Components) - Employee Roster, Drug Testing, Background Checks
  3. Phase 4 (Navigation & Layout) - App Shell, Breadcrumbs, Portal Switcher
  4. Phase 2 (Compliance Company Portal) - Internal PCS tools
  5. Phase 5 (Optimization) - Shareable Links, Communications, Policy Driver

  For Each Command:

  1. Run v0 command to generate initial component
  2. Review generated code
  3. Integrate with existing data structures (mock data files, API routes)
  4. Add RBAC checks using existing lib/auth/rbac.ts
  5. Connect to existing API routes in app/api/*
  6. Test on mobile/tablet/desktop
  7. Verify dark mode support
  8. Add to appropriate navigation in components/layout/app-sidebar.tsx

  Key Integration Points:

  - Auth Context: Use existing useAuth() hook for user role
  - RBAC: Wrap components with permission checks using hasPermission()
  - Mock Data: Leverage existing files in lib/data/mock-*
  - API Routes: Connect to existing /api/* endpoints
  - Components: Reuse existing UI components from components/ui/*

  ---

⏺ SUMMARY

  I've completed a comprehensive analysis of your PCS compliance system and provided a complete
  restructuring plan. Here's what I've delivered:

  Analysis Complete:

  Current State Identified:
  - 6 portal types (Service Company, Compliance Company, Executive, Compliance Officer, Field Worker,
  Auditor)
  - 13+ core feature modules
  - RBAC system with 7 role types
  - Significant redundancies in navigation and feature access

  Portal Requirements Mapped:
  - Service Company Portal: 4 user types (DER/Admin, Compliance Officer, Field Worker, Executive) with
   distinct feature needs
  - Compliance Company Portal: 4 user types (Portfolio Manager, OH Coordinator, Training Manager,
  Auditor)
  - Each user type has specific feature access, UI requirements, and workflow needs

  Deliverables:

  15 V0 Commands organized in 5 phases:
  1. Phase 1: Service Company Portal (4 commands) - DER dashboard, Compliance Officer workstation,
  Field Worker mobile, Executive command center
  2. Phase 2: Compliance Company Portal (2 commands) - Portfolio manager, Auditor evidence repository
  3. Phase 3: Shared Components (4 commands) - Employee roster, Drug testing, Background checks, DER
  IQ AI widget
  4. Phase 4: Navigation & Layout (2 commands) - Unified app shell, Policy Driver configuration
  5. Phase 5: Optimization (2 commands) - Shareable links, Communications hub

  Each command includes:
  - Complete feature specifications
  - Component requirements
  - UI/UX guidelines
  - Integration points
  - Responsive design requirements
  - Accessibility considerations

  Next Steps:

  1. Run v0 commands in priority order (Phase 1 → 3 → 4 → 2 → 5)
  2. For each generated component:
    - Integrate with existing auth/RBAC system
    - Connect to existing API routes
    - Test across devices
    - Verify dark mode
  3. Remove redundancies as you implement new structure
  4. Maintain feature parity - all existing functionality preserved, just reorganized

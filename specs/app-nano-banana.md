# Patriot Compliance Systems — App Directory Nano Banana Atlas

Multi-million-dollar compliance clients expect obsessive clarity. Below is a nano-banana diagram book that decodes the entire `app/` tree, highlights RBAC risks, and calls out every UI/API surface that still relies on mock data instead of real policy enforcement.

## Visual Timelines (Nano Banana Deck)

### Platform Value Stream
```nano-banana
Lead Capture --> /onboarding/requirements --> Policy Driver matrices --> Employee.complianceData JSON --> Dashboards & Portals --> Alerts/Exports
```

### RBAC & Portal Escalation
```nano-banana
Login (/ (auth)/login ) --> AuthContext session --> Role switcher --> AppShell sidebar --> Portal picker --> Portal-specific page (Auditor / Executive / PCS Pass) --> Compliance module widgets
```

### Requirements vs. Modules
```nano-banana
Policy Driver matrices --> Derive module checklists (Drug, Background, DOT, Health, Training, HIPAA, Geo) --> Feed module pages in /compliance/**/* --> Publish statuses back to Employee JSON + Share links
```

### API Surface Snapshot
```nano-banana
Clients --> Next.js route handlers under /app/api/* --> (Mock) vendor adapters --> TODO: Prisma/Postgres + Kafka --> Alerts/Communications webhooks --> Client refresh
```

### Shareable Evidence Lifecycle
```nano-banana
/settings/shareable-links --> POST /api/share/create --> Token/password stored (mock) --> Recipient hits /share/[token] --> Password gate --> Download/export compliance evidence + audit log
```

## File-by-File Nano Banana Critiques

### Root Shell & Global Styling
```nano-banana
app/layout.tsx --> Wraps everything with AuthProvider + AppShell; no tenant-aware context or RBAC guard at layout layer, so every page must self-police.
app/globals.css --> Giant OKLCH design tokens + Chevron theme toggles; no scoping means any CSS regression affects portals, and there is no token validation for client palettes.
app/loading.tsx --> Generic skeleton grid; does not cover nested routes so loads flash white on deeper navigation.
app/page.tsx --> Service company dashboard composed of metrics widgets; fully client-side with static mock data, so compliance KPIs can’t be trusted or filtered per tenant.
```

### Access Control Edge Cases
```nano-banana
app/403/page.tsx --> Static unauthorized screen; lacks auto-redirect, audit logging, or masking of PHI when RBAC denies access.
app/account-locked/page.tsx --> Account suspension notice; no integration with auth provider to actually unlock or escalate.
app/share/[token]/page.tsx --> Password-gated secure view; relies on client-side fetch to POST /api/share/{token} but lacks rate limiting, download watermarking, or masking for revoked tokens.
```

### Auth Capsule
```nano-banana
app/(auth)/layout.tsx --> Minimal wrapper with no brand guardrails; duplicate of root layout without analytics opt-out.
app/(auth)/login/page.tsx --> Massive client component for multi-portal login; still uses email/password mock auth, no OTP delivery, no SSO hooks, and no RBAC boundary beyond routing.
app/(auth)/mfa-challenge/page.tsx --> MFA UI with static steps; no actual MFA provider calls, no resend throttling, and no device trust ledger.
app/(auth)/onboarding/page.tsx --> Portal selection “wizard”; mock data only, no persistence of tenant branding or compliance scope.
```

### Employees, Geo-Fencing, and Onboarding
```nano-banana
app/employees/page.tsx --> Employee roster with bulk upload/export flows; entirely mock arrays, no pagination, and action buttons navigate to modules without RBAC gating.
app/employees/loading.tsx --> Skeleton for roster; good coverage but no ARIA attributes to keep screen readers sane.
app/employees/[id]/page.tsx --> Employee 360 view using async params; still hardcodes mock compliance data and performs no server fetch, so SSR promises false truth.
app/geo-fencing/page.tsx --> Live map + zones/check-ins/triggers UI; uses GeoFenceMapNoAPI placeholder, so compliance alerts are never real-time.
app/geo-fencing/loading.tsx --> Skeleton grid; acceptable but doesn’t match the tabbed UI layout.
app/onboarding/requirements/page.tsx --> Giant requirements matrix; printed/exported via window.print, not PDF, and mixes federal/state/Tenant rules with no source of truth.
app/onboarding/requirements/loading.tsx --> Skeleton for matrix; still uses arbitrary widths causing layout shift on hydrate.
```

### Dashboards, Communications, Billing, Auditing & Reports
```nano-banana
app/dashboard/page.tsx --> DER admin dashboard; 100% mock alerts/audit queue data with no TanStack Query usage, so investigators can’t drill down.
app/dashboard/loading.tsx --> Skeleton; no reduction for mobile.
app/communications/page.tsx --> Announcement composer + tabs; no persistence, queueing, or permission checks per channel; uploads are stubbed.
app/communications/loading.tsx --> Skeleton cards/tables; at least hints structure but still global.
app/billing/page.tsx --> Composes billing overview/generator/tracking; all components expect mock data and do not respect currency or tenant billing rules.
app/billing/loading.tsx --> Skeleton cards + table.
app/audit-logs/page.tsx --> Audit log filters/table; data is hardcoded, no pagination or export hooking, so auditor portal can’t rely on it.
app/audit-logs/loading.tsx --> Returns null; streaming gaps cause blank flashes.
app/reports/page.tsx --> Report builder + tabs; toggles only change client state, MIS exports are stubbed buttons.
app/reports/loading.tsx --> Simple skeleton grid.
app/reports/mis-express/page.tsx --> Thin wrapper around MISExpress component; no props or RBAC filtering.
app/reports/mis-express/loading.tsx --> Skeleton replicating MIS layout.
```

### Policy, Settings, Integrations, and Shareable Links
```nano-banana
app/policy-driver/page.tsx --> Rules engine UI with simulation mode; every rule is mock data, no persistence API, and toggling simulation does nothing server-side.
app/policy-driver/loading.tsx --> Skeleton for tabs + matrices.
app/settings/page.tsx --> Multi-tab settings mixing company info, RBAC, notifications, demo toggles; none of it syncs to backend, so RBAC is purely decorative.
app/settings/loading.tsx --> Skeleton tabs/cards.
app/settings/shareable-links/page.tsx --> Lists secure links using mock array; revoke/copy functions hit placeholder fetch/clipboard, no tenant-specific scoping.
app/settings/shareable-links/loading.tsx --> Skeleton for cards/list.
app/integrations/workforce/page.tsx --> Workforce API connector UI with manual API key entry; connection/test/sync/migrate flows all use setTimeout mocks and no secret storage.
```

### Portals & Field Experiences
```nano-banana
app/portals/page.tsx --> Portal selector; uses AuthContext portalType but no enforcement if user tries unauthorized portal.
app/portals/loading.tsx --> Skeleton deck.
app/portals/auditor/page.tsx --> Evidence repository and control matrix; all metrics and tables mock; download/export buttons stubbed.
app/portals/auditor/loading.tsx --> Returns null, so auditors see blank gap during suspense.
app/portals/compliance-officer/page.tsx --> Workstation queue; selects tasks in memory only; no queue API or automation triggers.
app/portals/compliance-officer/loading.tsx --> Skeleton.
app/portals/executive/page.tsx --> Executive analytics board; static metrics and action cards, no multi-company filtering or RBAC scoping.
app/portals/executive/loading.tsx --> Skeleton.
app/portals/field-worker/loading.tsx --> Placeholder skeleton; actual field worker view replaced by PCS Pass, so this route is dead weight.
app/portals/pcs-pass/page.tsx --> Field worker compliance status (PCS Pass) with PDF generator; uses mock worker data and client-side pdfkit; no offline caching or secure storage.
app/portals/pcs-pass/loading.tsx --> Brand-aware skeleton.
app/portals/pcs-pass/check-in/page.tsx --> Check-in workflow (QR/GPS) UI; lacks geolocation API calls, no server timestamps, so attendance is unenforceable.
app/portals/pcs-pass/documents/page.tsx --> Document upload/list; uses useState with mock docs, no upload service, no virus scanning, no RBAC on delete.
app/portals/pcs-pass/documents/loading.tsx --> Returns null; user stares at blank screen if network slow.
app/portals/pcs-pass/drug-testing/page.tsx --> Field worker view for test results; mock timeline only, no vendor data or attestation step.
app/portals/pcs-pass/notifications/page.tsx --> Notification center fed by mockWorkerData; mark-as-read lives only in React state.
app/portals/pcs-pass/profile/page.tsx --> Profile & contact data; still static and lacks PI/PHI masking for auditors.
```

### Employees, Sharing, and Storytelling
```nano-banana
app/share/[token]/page.tsx --> (See Access block) still no rate limiting nor hashed tokens — high risk if leaked.
```

### Compliance Modules (Service Company Views)
```nano-banana
app/compliance/page.tsx --> High-level portfolio view switching between cards; uses ServiceCompaniesSidebar + many components but everything is client state; RBAC bypass.
app/compliance/loading.tsx --> Returns null; poor skeleton support.
app/compliance/background/page.tsx --> Comprehensive background screening workflow (orders, rules, adverse actions); uses dozens of mock arrays and toasts, no API wiring.
app/compliance/background/loading.tsx --> Returns null.
app/compliance/drug-testing/page.tsx --> Random selection and scheduling suite; huge state machine entirely local, no integration with /api/drug-testing endpoints.
app/compliance/drug-testing/loading.tsx --> Returns null.
app/compliance/dot/page.tsx --> DOT driver roster and accident log; ingestion is manual useState; clearinghouse query dialog is fake.
app/compliance/dot/loading.tsx --> Returns null, so large layout flashes blank while suspense resolves.
app/compliance/dot/hours-of-service/page.tsx --> Hours-of-service analytics with auto-refresh sliders/filtering; powered by `mockHOSDrivers`, so no ELD/telematics feed or enforcement.
app/compliance/dot/hours-of-service/loading.tsx --> Skeleton list/cards; still missing ARIA labelling and does not mimic tab strip interactions.
app/compliance/dot/drivers/[id]/page.tsx --> Individual driver dossier; still built from mock data and lacks download/export for DQ files.
app/compliance/health/page.tsx --> Occupational health oversight UI; charts & surveillance logs are mocked and there is no PHI encryption nor clinic integration.
app/compliance/health/loading.tsx --> Returns null, so there is zero perceived loading state while heavy widgets hydrate.
app/compliance/hipaa-privacy/page.tsx --> HIPAA access control matrix + audit log; toggles mutate client state only and never touch the RBAC modules.
app/compliance/hipaa-privacy/loading.tsx --> Skeleton grid; again no semantic announcements for assistive tech.
app/compliance/training/page.tsx --> Training & certificate matrix; uses local arrays and does not hook to LMS/SCORM nor policy-driver requirements.
app/compliance/training/loading.tsx --> Skeleton for tabs/cards; helpful visually but still lacks per-role shimmer cues.
```

### Compliance Portal (Multi-company Oversight)
```nano-banana
app/compliance-portal/page.tsx --> Compliance-provider dashboard with sidebar of companies; mockCompanies only, so no pagination or tenant scoping.
app/compliance-portal/loading.tsx --> Full-height skeleton; heavy but at least mirrors master/detail layout.
app/compliance-portal/alerts/page.tsx --> Alerts aggregation; reads from static arrays, no cross-tenant filtering or RBAC.
app/compliance-portal/alerts/loading.tsx --> Returns null, so first paint can flash blank.
app/compliance-portal/billing/page.tsx --> Billing snapshot for MSP; again mock metrics and no actual invoicing integration.
app/compliance-portal/billing/loading.tsx --> Returns null.
app/compliance-portal/communications/page.tsx --> Read-only communications board; no API binding or export.
app/compliance-portal/geo-fence/page.tsx --> Portfolio geo view; depends on placeholder map and has no location privacy guardrails.
app/compliance-portal/mis/page.tsx --> MIS analytics; mock charts, no CSV download.
app/compliance-portal/mis/loading.tsx --> Skeleton grid.
app/compliance-portal/oh-oversight/page.tsx --> Occupational health oversight; client-side only.
app/compliance-portal/oh-oversight/loading.tsx --> Skeleton cards.
app/compliance-portal/policies/page.tsx --> Policy overview; values hard-coded and no diff from policy-driver config.
app/compliance-portal/policies/loading.tsx --> Skeleton.
app/compliance-portal/portfolio/page.tsx --> Portfolio summary; same data as root page, so redundant and static.
app/compliance-portal/portfolio/loading.tsx --> Returns null, again blank gap.
app/compliance-portal/roster/page.tsx --> Combined roster; mock only and no masked PII even though portal should be read-only.
app/compliance-portal/roster/loading.tsx --> Skeleton list.
app/compliance-portal/training/page.tsx --> Training oversight by company; relies on placeholders.
app/compliance-portal/training/loading.tsx --> Skeleton.
```

### Per-Company Read-only Views (`/compliance-portal/[companySlug]/*`)
```nano-banana
app/compliance-portal/[companySlug]/layout.tsx --> Async layout pulling mock company; no real fetch and renders CommunicationsDialog despite read-only badge.
app/compliance-portal/[companySlug]/background/page.tsx --> Read-only background tab; duplicates service company UI with mock data.
app/compliance-portal/[companySlug]/background/loading.tsx --> Skeleton (still missing descriptive text).
app/compliance-portal/[companySlug]/billing/page.tsx --> Billing card for single company; static.
app/compliance-portal/[companySlug]/dot/page.tsx --> DOT module view; mirror of main module without live data.
app/compliance-portal/[companySlug]/drug-testing/page.tsx --> Drug testing summary; static.
app/compliance-portal/[companySlug]/employees/page.tsx --> Employee list; still uses mockCompanies and exposes PII with no masking.
app/compliance-portal/[companySlug]/reports/page.tsx --> Report cards; zero export functionality.
app/compliance-portal/[companySlug]/training/page.tsx --> Training status; static.
app/compliance-portal/[companySlug]/training/loading.tsx --> Skeleton.
```

### API Routes (Service Layer Stubs)

#### Background & Adjudication
```nano-banana
app/api/background/adjudication/route.ts --> In-memory rules array with bare GET/POST; no persistence or tenant scoping.
app/api/background/adverse-action/route.ts --> Mock adverse action queue; POST just pushes into array, no PDF generation or waiting-period timers.
app/api/background/screenings/route.ts --> GET/POST around static screenings list; missing validation, vendor auth, and audit logging.
```

#### Communications & AI
```nano-banana
app/api/communications/history/route.ts --> Returns mock communications; ignores query params beyond limit/offset.
app/api/communications/send/route.ts --> Fake send endpoint; no provider integration, queues, or throttling.
app/api/der-iq/chat/route.ts --> Placeholder DER IQ chat handler; simply echoes mock response without auth checks.
```

#### DOT, Drug Testing, and Employees
```nano-banana
app/api/dot/clearinghouse/route.ts --> Stub that should call FMCSA but currently just returns success placeholder.
app/api/dot/documents/route.ts --> Fake DQ file listing; no S3 link signing.
app/api/dot/documents/download-dq-file/route.ts --> Returns mock blob metadata; no security checks.
app/api/dot/drivers/route.ts --> In-memory driver roster; lacks pagination, filtering, or RBAC.
app/api/drug-testing/clearinghouse/route.ts --> Placeholder for clearinghouse queries; no vendor auth.
app/api/drug-testing/mro-review/route.ts --> Accepts JSON and echoes success; no MRO workflow states.
app/api/drug-testing/random-selection/route.ts --> Simulates pool selection; not auditable and no cryptographic randomness.
app/api/drug-testing/tests/route.ts --> GET/POST for tests; validations minimal and data lives only in function scope.
app/api/employees/route.ts --> Employee list stub; no filter/sort/per-tenant constraints.
app/api/employees/[id]/route.ts --> Hard-coded employee detail; no masking or 404 handling beyond static response.
app/api/employees/bulk-upload/route.ts --> Accepts JSON but never processes file streams; zero validation.
app/api/employees/export/route.ts --> Placeholder export response; no storage or share link creation.
```

#### Geo-Fencing, Health, Share, Training & Webhooks
```nano-banana
app/api/geo-fencing/check-in/route.ts --> Accepts lat/long but stores nothing; no geo-hash validation.
app/api/geo-fencing/triggers/route.ts --> Mock triggers list; POST missing schema validation.
app/api/geo-fencing/zones/route.ts --> Returns static zones; no CRUD.
app/api/health/osha-300/route.ts --> GET/POST stub for OSHA logs; no injury classification or export.
app/api/health/surveillance/route.ts --> Surveillance endpoints; rely on fake list.
app/api/share/create/route.ts --> Generates mock tokens in memory; no hashing, expiration, or RBAC binding.
app/api/share/[token]/route.ts --> Validates token by scanning mock array; lacks password hashing and rate limiting.
app/api/training/certificates/route.ts --> Certificates stub; no secure document links.
app/api/training/matrix/route.ts --> Matrix stub; returns static config.
app/api/webhooks/drug-testing/route.ts --> Placeholder for vendor webhook; does nothing besides console.log.
app/api/webhooks/tazworks/route.ts --> Processes TazWorks payload but only logs and returns {received:true}; no signature validation.
```

### RBAC & Compliance Gaps
```nano-banana
AppShell --> Sidebar links exposed to all roles --> No per-route guard in layout --> Sensitive portals reachable via URL even if role lacks permission.
useAuth context --> Stores portalType in memory --> No token binding --> Role switching is client-side only and never audited.
API routes --> Receive unauthenticated fetches --> Missing middleware to enforce tenant or user identity --> Potential PHI leakage.
Loading states --> Many return null --> Users see blank panes -> Looks like crash, hinders SOC2 evidence for usability/resilience.
Mock data --> Every dashboard & module uses static arrays --> Real compliance status cannot be proven, undermining client trust and MIS deliverables.
```

## Immediate Remediation Ideas
- Wire every `/app/api/*` handler into Prisma/Drizzle + real vendor adapters, then backfill pages with TanStack Query to remove mock arrays.
- Add route-level RBAC guard (e.g., `ProtectedRoute` or middleware) so portals, compliance modules, and share pages can’t be hit by unauthorized roles.
- Replace `return null` loading components with accessible skeletons and ARIA live regions; ensures enterprise-grade UX and SOC2 compliance.
- Centralize tenant-aware theme + `chevron-theme` toggles in a config service to avoid global CSS mutations that leak between clients.
- Prioritize `Employee.complianceData` ingestion by implementing Kafka/event-driven pattern described in specs, then update UI components to call those endpoints.

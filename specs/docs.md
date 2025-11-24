## Global
```bash
.
├── app
│   ├── (auth)
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── mfa-challenge
│   │   │   └── page.tsx
│   │   └── onboarding
│   │       └── page.tsx
│   ├── 403
│   │   └── page.tsx
│   ├── account-locked
│   │   └── page.tsx
│   ├── api
│   │   ├── background
│   │   │   ├── adjudication
│   │   │   │   └── route.ts
│   │   │   ├── adverse-action
│   │   │   │   └── route.ts
│   │   │   └── screenings
│   │   │       └── route.ts
│   │   ├── communications
│   │   │   ├── history
│   │   │   │   └── route.ts
│   │   │   └── send
│   │   │       └── route.ts
│   │   ├── der-iq
│   │   │   └── chat
│   │   │       └── route.ts
│   │   ├── dot
│   │   │   ├── clearinghouse
│   │   │   │   └── route.ts
│   │   │   ├── documents
│   │   │   │   ├── download-dq-file
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── drivers
│   │   │       └── route.ts
│   │   ├── drug-testing
│   │   │   ├── clearinghouse
│   │   │   │   └── route.ts
│   │   │   ├── mro-review
│   │   │   │   └── route.ts
│   │   │   ├── random-selection
│   │   │   │   └── route.ts
│   │   │   └── tests
│   │   │       └── route.ts
│   │   ├── employees
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   ├── bulk-upload
│   │   │   │   └── route.ts
│   │   │   ├── export
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── geo-fencing
│   │   │   ├── check-in
│   │   │   │   └── route.ts
│   │   │   ├── triggers
│   │   │   │   └── route.ts
│   │   │   └── zones
│   │   │       └── route.ts
│   │   ├── health
│   │   │   ├── osha-300
│   │   │   │   └── route.ts
│   │   │   └── surveillance
│   │   │       └── route.ts
│   │   ├── share
│   │   │   ├── [token]
│   │   │   │   └── route.ts
│   │   │   └── create
│   │   │       └── route.ts
│   │   ├── training
│   │   │   ├── certificates
│   │   │   │   └── route.ts
│   │   │   └── matrix
│   │   │       └── route.ts
│   │   └── webhooks
│   │       ├── drug-testing
│   │       │   └── route.ts
│   │       └── tazworks
│   │           └── route.ts
│   ├── audit-logs
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── billing
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── communications
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── compliance
│   │   ├── background
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── dot
│   │   │   ├── drivers
│   │   │   │   └── [id]
│   │   │   │       └── page.tsx
│   │   │   ├── hours-of-service
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── drug-testing
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── health
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── hipaa-privacy
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── training
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── compliance-portal
│   │   ├── [companySlug]
│   │   │   ├── background
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── billing
│   │   │   │   └── page.tsx
│   │   │   ├── dot
│   │   │   │   └── page.tsx
│   │   │   ├── drug-testing
│   │   │   │   └── page.tsx
│   │   │   ├── employees
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── reports
│   │   │   │   └── page.tsx
│   │   │   └── training
│   │   │       ├── loading.tsx
│   │   │       └── page.tsx
│   │   ├── alerts
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── billing
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── communications
│   │   │   └── page.tsx
│   │   ├── geo-fence
│   │   │   └── page.tsx
│   │   ├── loading.tsx
│   │   ├── mis
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── oh-oversight
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── policies
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── portfolio
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── roster
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── training
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── dashboard
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── employees
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── geo-fencing
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── integrations
│   │   └── workforce
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── onboarding
│   │   └── requirements
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── page.tsx
│   ├── policy-driver
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── portals
│   │   ├── auditor
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── compliance-officer
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── executive
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── field-worker
│   │   │   └── loading.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── pcs-pass
│   │       ├── check-in
│   │       │   └── page.tsx
│   │       ├── documents
│   │       │   ├── loading.tsx
│   │       │   └── page.tsx
│   │       ├── drug-testing
│   │       │   └── page.tsx
│   │       ├── loading.tsx
│   │       ├── notifications
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       └── profile
│   │           └── page.tsx
│   ├── reports
│   │   ├── loading.tsx
│   │   ├── mis-express
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── settings
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── shareable-links
│   │       ├── loading.tsx
│   │       └── page.tsx
│   └── share
│       └── [token]
│           └── page.tsx
├── CLAUDE.md
├── components
│   ├── alerts-actions-center.tsx
│   ├── alerts-center.tsx
│   ├── alerts-feed.tsx
│   ├── alerts-panel.tsx
│   ├── audit-queue.tsx
│   ├── auth
│   │   ├── protected-route.tsx
│   │   └── role-switcher.tsx
│   ├── billing-overview.tsx
│   ├── billing-payments.tsx
│   ├── billing-records.tsx
│   ├── communications-dialog.tsx
│   ├── communications.tsx
│   ├── compliance-map.tsx
│   ├── compliance-meter.tsx
│   ├── compliance-overview.tsx
│   ├── der-iq-chat-widget.tsx
│   ├── employee-roster-summary.tsx
│   ├── empty-states
│   │   ├── no-audit-logs.tsx
│   │   ├── no-certificates.tsx
│   │   ├── no-employees.tsx
│   │   ├── no-invoices.tsx
│   │   ├── no-screenings.tsx
│   │   ├── no-tests.tsx
│   │   └── no-zones.tsx
│   ├── export-dialog.tsx
│   ├── geo-fence-compliance.tsx
│   ├── geo-fence-interactive-map.tsx
│   ├── geo-fence-map-no-api.tsx
│   ├── geo-fence-map.tsx
│   ├── invoice-generator.tsx
│   ├── key-statistics.tsx
│   ├── layout
│   │   ├── app-header.tsx
│   │   ├── app-shell.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── quick-actions-fab.tsx
│   ├── location-readiness.tsx
│   ├── mis-express.tsx
│   ├── mis-reporting.tsx
│   ├── occupational-health-oversight.tsx
│   ├── payment-tracking.tsx
│   ├── policies-ai.tsx
│   ├── policy-management.tsx
│   ├── policy-progress-tiles.tsx
│   ├── portfolio-view.tsx
│   ├── queue-management.tsx
│   ├── roster-employee-360.tsx
│   ├── roster-exceptions.tsx
│   ├── service-companies-sidebar.tsx
│   ├── shared
│   │   └── der-iq-chat-widget.tsx
│   ├── sidebar.tsx
│   ├── theme-provider.tsx
│   ├── training-certifications.tsx
│   ├── ui
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── data-table.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── empty-state.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── urgent-notifications.tsx
├── components.json
├── hooks
│   ├── use-der-iq.ts
│   ├── use-mobile.ts
│   ├── use-rbac.ts
│   └── use-toast.ts
├── lib
│   ├── ai
│   │   └── der-iq.ts
│   ├── api-error-handler.ts
│   ├── auth
│   │   ├── auth-context.tsx
│   │   ├── rbac.ts
│   │   ├── security.ts
│   │   └── session.ts
│   ├── data
│   │   ├── mock-companies.ts
│   │   ├── mock-hos-drivers.ts
│   │   ├── mock-invoices.ts
│   │   └── mock-worker-data.ts
│   ├── export-utils.ts
│   ├── pdf-generator.ts
│   ├── rbac
│   │   └── permissions.ts
│   ├── share
│   │   └── utils.ts
│   └── utils.ts
├── middleware.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── public
│   ├── icon.svg
│   ├── images
│   │   ├── chevron-logo.png
│   │   └── chevron-logo.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── specs
│   ├── PLANS.md
│   └── README.md
├── styles
│   └── globals.css
├── tsconfig.json
└── types
    ├── auth.ts
    └── share.ts
```

## app

```bash
.
├── (auth)
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── mfa-challenge
│   │   └── page.tsx
│   └── onboarding
│       └── page.tsx
├── 403
│   └── page.tsx
├── account-locked
│   └── page.tsx
├── api
│   ├── background
│   │   ├── adjudication
│   │   │   └── route.ts
│   │   ├── adverse-action
│   │   │   └── route.ts
│   │   └── screenings
│   │       └── route.ts
│   ├── communications
│   │   ├── history
│   │   │   └── route.ts
│   │   └── send
│   │       └── route.ts
│   ├── der-iq
│   │   └── chat
│   │       └── route.ts
│   ├── dot
│   │   ├── clearinghouse
│   │   │   └── route.ts
│   │   ├── documents
│   │   │   ├── download-dq-file
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── drivers
│   │       └── route.ts
│   ├── drug-testing
│   │   ├── clearinghouse
│   │   │   └── route.ts
│   │   ├── mro-review
│   │   │   └── route.ts
│   │   ├── random-selection
│   │   │   └── route.ts
│   │   └── tests
│   │       └── route.ts
│   ├── employees
│   │   ├── [id]
│   │   │   └── route.ts
│   │   ├── bulk-upload
│   │   │   └── route.ts
│   │   ├── export
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── geo-fencing
│   │   ├── check-in
│   │   │   └── route.ts
│   │   ├── triggers
│   │   │   └── route.ts
│   │   └── zones
│   │       └── route.ts
│   ├── health
│   │   ├── osha-300
│   │   │   └── route.ts
│   │   └── surveillance
│   │       └── route.ts
│   ├── share
│   │   ├── [token]
│   │   │   └── route.ts
│   │   └── create
│   │       └── route.ts
│   ├── training
│   │   ├── certificates
│   │   │   └── route.ts
│   │   └── matrix
│   │       └── route.ts
│   └── webhooks
│       ├── drug-testing
│       │   └── route.ts
│       └── tazworks
│           └── route.ts
├── audit-logs
│   ├── loading.tsx
│   └── page.tsx
├── billing
│   ├── loading.tsx
│   └── page.tsx
├── communications
│   ├── loading.tsx
│   └── page.tsx
├── compliance
│   ├── background
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── dot
│   │   ├── drivers
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── hours-of-service
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── drug-testing
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── health
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── hipaa-privacy
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   └── training
│       ├── loading.tsx
│       └── page.tsx
├── compliance-portal
│   ├── [companySlug]
│   │   ├── background
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── billing
│   │   │   └── page.tsx
│   │   ├── dot
│   │   │   └── page.tsx
│   │   ├── drug-testing
│   │   │   └── page.tsx
│   │   ├── employees
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── reports
│   │   │   └── page.tsx
│   │   └── training
│   │       ├── loading.tsx
│   │       └── page.tsx
│   ├── alerts
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── billing
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── communications
│   │   └── page.tsx
│   ├── geo-fence
│   │   └── page.tsx
│   ├── loading.tsx
│   ├── mis
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── oh-oversight
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── page.tsx
│   ├── policies
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── portfolio
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── roster
│   │   ├── loading.tsx
│   │   └── page.tsx
│   └── training
│       ├── loading.tsx
│       └── page.tsx
├── dashboard
│   ├── loading.tsx
│   └── page.tsx
├── employees
│   ├── [id]
│   │   └── page.tsx
│   ├── loading.tsx
│   └── page.tsx
├── geo-fencing
│   ├── loading.tsx
│   └── page.tsx
├── globals.css
├── integrations
│   └── workforce
│       └── page.tsx
├── layout.tsx
├── loading.tsx
├── onboarding
│   └── requirements
│       ├── loading.tsx
│       └── page.tsx
├── page.tsx
├── policy-driver
│   ├── loading.tsx
│   └── page.tsx
├── portals
│   ├── auditor
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── compliance-officer
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── executive
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── field-worker
│   │   └── loading.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   └── pcs-pass
│       ├── check-in
│       │   └── page.tsx
│       ├── documents
│       │   ├── loading.tsx
│       │   └── page.tsx
│       ├── drug-testing
│       │   └── page.tsx
│       ├── loading.tsx
│       ├── notifications
│       │   └── page.tsx
│       ├── page.tsx
│       └── profile
│           └── page.tsx
├── reports
│   ├── loading.tsx
│   ├── mis-express
│   │   ├── loading.tsx
│   │   └── page.tsx
│   └── page.tsx
├── settings
│   ├── loading.tsx
│   ├── page.tsx
│   └── shareable-links
│       ├── loading.tsx
│       └── page.tsx
└── share
    └── [token]
        └── page.tsx
```
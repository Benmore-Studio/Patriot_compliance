# CLAUDE.md - Frontend (Next.js)

This file provides guidance to Claude Code when working with the Next.js frontend for the Patriot Compliance Systems (PCS).

# Project Overview

The frontend is a Next.js 14 application that provides the user interface for the Patriot Compliance Systems platform. It includes:

- **Multiple role-based portals** - Service company admins, compliance officers, field workers, executives, auditors
- **Compliance dashboards** - Real-time compliance meters, alerts, task queues
- **Workflow interfaces** - MRO review, adjudication, adverse action processing
- **Employee management** - Roster, bulk upload, 360° employee views
- **Reporting & analytics** - Data exports, compliance reports, trend analysis
- **Mobile support** - Responsive design, mobile-first PCS Pass portal
- **Real-time features** - WebSocket-based notifications, live updates
- **AI assistant** - DER IQ chatbot for compliance questions

The application serves multiple user personas with different access levels and workflows.

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

This is a Next.js 14 application using the App Router with TypeScript, following a feature-based architecture pattern.

```
frontend/ (or app directory at root)
├── app/                          # Next.js App Router pages & layouts
│   ├── (auth)/                   # Authentication routes (login, MFA, onboarding)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── mfa-challenge/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── onboarding/page.tsx
│   │
│   ├── api/                      # API routes (next-to-backend proxies)
│   │   ├── auth/
│   │   ├── compliance/
│   │   └── [dynamic routes]
│   │
│   ├── (portals)/                # Main portal experiences
│   │   ├── layout.tsx
│   │   ├── dashboard/            # Main dashboard
│   │   │   └── page.tsx
│   │   ├── compliance-portal/    # Service company portal
│   │   │   ├── [companySlug]/layout.tsx
│   │   │   └── [companySlug]/
│   │   │       ├── employees/page.tsx
│   │   │       ├── drug-testing/page.tsx
│   │   │       ├── background-checks/page.tsx
│   │   │       ├── dot-compliance/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── pcs-pass/            # Employee self-service portal
│   │   │   ├── profile/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   └── check-in/page.tsx
│   │   ├── auditor/              # Auditor dashboard
│   │   └── executive/            # Executive dashboard
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── [other UI components]
│   │
│   ├── layout/                   # Layout components
│   │   ├── app-shell.tsx         # Main app container
│   │   ├── sidebar.tsx           # Left navigation
│   │   ├── header.tsx            # Top header
│   │   └── footer.tsx            # Footer
│   │
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx
│   │   ├── mfa-prompt.tsx
│   │   └── otp-input.tsx
│   │
│   ├── compliance/               # Compliance module components
│   │   ├── drug-testing/
│   │   │   ├── test-list.tsx
│   │   │   ├── mro-review-panel.tsx
│   │   │   └── result-display.tsx
│   │   ├── background-checks/
│   │   │   ├── adjudication-matrix.tsx
│   │   │   └── adverse-action-form.tsx
│   │   ├── dot-compliance/
│   │   │   ├── clearinghouse-status.tsx
│   │   │   └── dq-file-uploader.tsx
│   │   └── [other modules]
│   │
│   ├── dashboard/                # Dashboard components
│   │   ├── compliance-meter.tsx
│   │   ├── alerts-panel.tsx
│   │   ├── task-queue.tsx
│   │   ├── key-metrics.tsx
│   │   └── roster-exceptions.tsx
│   │
│   ├── employee/                 # Employee management components
│   │   ├── roster-table.tsx
│   │   ├── employee-360-view.tsx
│   │   ├── bulk-upload-dialog.tsx
│   │   └── employee-form.tsx
│   │
│   ├── reports/                  # Reporting components
│   │   ├── report-generator.tsx
│   │   ├── export-dialog.tsx
│   │   ├── chart-container.tsx
│   │   └── compliance-report.tsx
│   │
│   ├── geo-fence/                # Geofencing components
│   │   ├── map-view.tsx
│   │   ├── zone-editor.tsx
│   │   └── check-in-status.tsx
│   │
│   ├── communications/           # Messaging components
│   │   ├── message-composer.tsx
│   │   ├── notification-center.tsx
│   │   └── broadcast-form.tsx
│   │
│   └── shared/                   # Shared utilities
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── confirmation-dialog.tsx
│       └── empty-state.tsx
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts               # Authentication hook
│   ├── use-tenant.ts             # Tenant context hook
│   ├── use-rbac.ts               # Role-based access control
│   ├── use-compliance-data.ts    # Data fetching hook
│   ├── use-mobile.ts             # Mobile detection
│   ├── use-form-state.ts         # Form state management
│   └── use-api.ts                # API client hook
│
├── lib/                          # Shared utilities & services
│   ├── api.ts                    # API client setup
│   ├── auth/
│   │   ├── auth-context.tsx      # Auth context provider
│   │   ├── use-auth-hook.ts      # useAuth hook
│   │   └── auth-service.ts       # Auth service methods
│   ├── api-client.ts             # Axios/fetch API wrapper
│   ├── validators.ts             # Form validation (Zod)
│   ├── constants.ts              # App-wide constants
│   ├── types.ts                  # Shared TypeScript types
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   └── rbac.ts                   # Permission checking utilities
│
├── types/                        # TypeScript type definitions
│   ├── api.ts                    # API response types
│   ├── auth.ts                   # Auth types
│   ├── compliance.ts             # Compliance domain types
│   ├── models.ts                 # Shared data models
│   └── index.ts                  # Type exports
│
├── contexts/                     # React contexts
│   ├── auth-context.tsx          # Authentication provider
│   ├── tenant-context.tsx        # Tenant/company context
│   ├── rbac-context.tsx          # RBAC provider
│   └── theme-context.tsx         # Theme provider
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── styles/                       # Global & shared styles
│   ├── globals.css               # Tailwind + global styles
│   ├── themes.css                # Theme variables
│   └── animations.css            # Animation utilities
│
├── config/                       # Configuration files
│   ├── navigation.ts             # Navigation structure
│   ├── roles.ts                  # Role definitions & permissions
│   └── env.ts                    # Environment validation
│
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── .env.example                  # Environment variables template
```

## Key Architectural Patterns

- **App Router with Route Groups**: Organize routes logically with `(group)/` syntax
- **Server Components by default**: Use Client Components only when needed
- **Context providers for global state**: Auth, tenant, theme
- **Component composition with shadcn/ui**: Build UI from primitives
- **API routes for backend proxy**: Middleware for authentication, rate limiting
- **Custom hooks for shared logic**: Reusable state and API logic
- **Type-safe with TypeScript**: Strict mode enabled

# Development Guidelines

## General

- Before implementing a large refactor or new feature, explain your plan and get approval.
- Use existing libraries and patterns from the codebase - consistency matters.
- Write tests for complex components and hooks.
- Follow Next.js best practices and conventions.

## TypeScript/Next.js

`pnpm` is the package manager. Common commands:

- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add a dependency
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm start` - Start production server

### Technology Stack

- **Next.js 14**: App Router, React Server Components, image optimization
- **React 19**: Latest React with concurrent features and automatic batching
- **TypeScript 5**: Strict type checking enabled
- **Tailwind CSS 4**: Utility-first styling with @tailwindcss/postcss
- **shadcn/ui**: Component library built on Radix UI
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Schema validation for forms and API responses
- **TanStack React Query**: Server state management (optional, if data fetching is complex)
- **Zustand**: Client state management (optional, for complex UI state)
- **Recharts**: Data visualization and charting
- **Mapbox GL**: Interactive mapping for geofencing
- **Axios or Fetch API**: HTTP requests to backend

### Code Organization and Modularity

**Each page/feature should:**

- Have its own directory with a `page.tsx` file
- Use layout files for shared structure
- Include component subdirectories for feature-specific components
- Keep complex logic in custom hooks

**Import organization:**
1. React/Next.js imports
2. Third-party library imports (shadcn, React Hook Form, etc.)
3. Components from `@/components/`
4. Hooks from `@/hooks/`
5. Utils/types from `@/lib/` and `@/types/`

**Avoid:**
- Circular imports
- Deep nesting of components (max 3 levels)
- Logic in components - move to hooks or utils

# Code Style

## Documentation

**JSDoc for complex functions and hooks:**

```typescript
/**
 * Fetch compliance data for current user's tenant.
 *
 * @param filters - Optional filters (department, status, etc.)
 * @returns Compliance data or error
 *
 * @example
 * const { data, loading } = useComplianceData({ department: 'Operations' })
 */
export function useComplianceData(filters?: ComplianceFilters) {
  // Implementation
}
```

- Avoid documenting obvious component props - let TypeScript speak
- Document complex hooks and utility functions
- Document non-obvious behavior or side effects
- Keep comments focused on why, not what

## TypeScript Code Style

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **React Components**: `PascalCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS Classes**: Tailwind utilities (preferred) or `kebab-case`
- **File Names**: `kebab-case.tsx` for components, `camelCase.ts` for utils
- **Event Handlers**: `handleAction` pattern (e.g., `handleSubmit`, `handleCancel`)

### Component Patterns

```typescript
// Server Component (default)
export default async function EmployeeRoster({ companySlug }: Props) {
  const employees = await fetchEmployees(companySlug)
  return <RosterTable data={employees} />
}

// Client Component (with interactivity)
'use client'

export function MROReviewPanel({ testId }: Props) {
  const [result, setResult] = useState<string>('')
  const { mutate: submitReview } = useMutation(...)
  return (...)
}

// Custom Hook
export function useRBACGuard(requiredRole: string) {
  const { user } = useAuth()
  const hasAccess = user?.roles.includes(requiredRole)
  return hasAccess
}
```

### Form Patterns (React Hook Form + Zod)

```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['ADMIN', 'USER']),
})

type FormData = z.infer<typeof schema>

export function UserForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'USER' },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <Input {...field} placeholder="Email" />
        )}
      />
    </form>
  )
}
```

# Test-Driven Development (TDD)

- Write tests for complex components, hooks, and utils
- Use React Testing Library for component testing
- Test from user perspective, not implementation details

## Testing Guidelines

- Test framework: **Vitest** with **React Testing Library**
- Test location: `__tests__/` directory or `*.test.tsx` colocated with source
- Mock API calls with MSW (Mock Service Worker) or Jest mocks
- Test critical user workflows and RBAC permissions

**Example test:**
```typescript
// components/__tests__/mro-review-panel.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MROReviewPanel } from '../mro-review-panel'

describe('MROReviewPanel', () => {
  it('should submit MRO review with selected result', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<MROReviewPanel testId="123" onSubmit={onSubmit} />)

    await user.click(screen.getByText('Verified Negative'))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).toHaveBeenCalledWith('VERIFIED_NEGATIVE')
  })
})
```

# Tools

You have access to these tools for development:

- `sequential-thinking-tools` - For complex component design
- `deepwiki` - For Next.js/React documentation and patterns
- `context7` - For quick library documentation lookups
- `playwright` - For E2E testing and browser automation

# Domain-Specific Guidance

## User Roles & Portals

- **Service Company Admin**: Full compliance portal access, policy configuration
- **Compliance Officer**: Work queue, MRO reviews, adjudication workflows
- **Field Worker**: PCS Pass mobile portal, check-ins, profile
- **Auditor**: Read-only access to compliance data and audit logs
- **Executive**: Dashboard, analytics, high-level reporting

## Key UI Patterns

- **Compliance Meter**: Visual representation of overall compliance status
- **Alerts Center**: Real-time actionable alerts with filtering
- **Task Queue**: Work items sorted by priority and type
- **Employee 360°**: Comprehensive employee view with all compliance data
- **Report Generator**: Export compliance data in multiple formats (PDF, Excel, CSV)

## Critical Business Rules

- Drug test results must go through MRO review before display
- Background check adverse actions require documented justification
- DOT driver qualification data requires regular clearinghouse queries
- Certifications show expiration status with 30/60/90-day warnings
- Geofence check-ins must be within location coordinates

# Updates to This Document

- Keep architecture synchronized with actual project structure
- Document new page groups and components as they're added
- Update technology stack when major dependencies change
- Keep compliance terminology aligned with business requirements

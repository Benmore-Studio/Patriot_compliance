# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Overview

Patriot Compliance Systems (PCS) is an enterprise compliance management platform built with Next.js 14 and TypeScript. The platform provides comprehensive compliance tracking and management for organizations, including:

- **Drug & Alcohol Testing**: Random selection, MRO review, clearinghouse reporting
- **Background Checks**: Screening, adjudication, adverse action workflows
- **DOT Compliance**: Driver qualification files, hours of service, clearinghouse queries
- **Occupational Health**: Medical surveillance, OSHA 300 logging, health records
- **Training & Certifications**: Certificate tracking, expiration alerts, compliance matrix
- **Geo-Fencing**: Location-based compliance requirements, check-ins, zone management
- **Multi-tenant Architecture**: Service company portals with role-based access control

The platform serves multiple user personas including executives, compliance officers, auditors, field workers, and service company administrators.

# Skills Protocol (Superpowers)

## Mandatory First Response Protocol

Before responding to ANY user message, you MUST complete this checklist:

1. ☐ List available skills in your mind
2. ☐ Ask yourself: "Does ANY skill match this request?"
3. ☐ If yes → Use the Skill tool to read and run the skill file
4. ☐ Announce which skill you're using
5. ☐ Follow the skill exactly

**Responding WITHOUT completing this checklist = automatic failure.**

## Common Rationalizations That Mean You're About To Fail

If you catch yourself thinking ANY of these thoughts, STOP. You are rationalizing. Check for and use the skill.

- "This is just a simple question" → WRONG. Questions are tasks. Check for skills.
- "I can check git/files quickly" → WRONG. Files don't have conversation context. Check for skills.
- "Let me gather information first" → WRONG. Skills tell you HOW to gather information. Check for skills.
- "This doesn't need a formal skill" → WRONG. If a skill exists for it, use it.
- "I remember this skill" → WRONG. Skills evolve. Run the current version.
- "This doesn't count as a task" → WRONG. If you're taking action, it's a task. Check for skills.
- "The skill is overkill for this" → WRONG. Skills exist because simple things become complex. Use it.
- "I'll just do this one thing first" → WRONG. Check for skills BEFORE doing anything.

**Why:** Skills document proven techniques that save time and prevent mistakes. Not using available skills means repeating solved problems and making known errors.

If a skill for your task exists, you must use it or you will fail at your task.

## How to Use Skills

You have skills available.

### Skills with Checklists

If a skill has a checklist, you MUST create TodoWrite todos for EACH item.

**Don't:**
- Work through checklist mentally
- Skip creating todos "to save time"
- Batch multiple items into one todo
- Mark complete without doing them

**Why:** Checklists without TodoWrite tracking = steps get skipped. Every time. The overhead of TodoWrite is tiny compared to the cost of missing steps.

## Key Principles

1. **Finding a relevant skill = mandatory to read and use it.** Not optional.
2. **Skills document proven techniques** that save time and prevent mistakes.
3. **Always announce** which skill you're using and why.
4. **Follow skills exactly** - don't rationalize away the discipline.
5. **Create TodoWrite todos** for any skill checklists.

## Custom Agents

The system supports custom specialized agents stored in agent-specific directories. These agents can be invoked for specific tasks that match their expertise.

### Agent Selection and Usage

- IMPORTANT: ALWAYS start by invoking the agent-organizer sub-agent, an expert agent organizer specializing in multi-agent orchestration.
- Custom agents are automatically selected based on the context and task requirements
- The system analyzes the user's request and matches it with the most appropriate specialized agent
- Multiple sub-agents can work in parallel on different aspects of a complex task
- **Maximum parallel agents**: 50 sub-agents can operate simultaneously
- Each agent has its own expertise domain defined in its configuration
- Agents can coordinate and share context through the main agent orchestrator

### When Custom Agents Are Used

The system automatically invokes custom agents when:
- The task matches a specialized agent's expertise domain
- Complex tasks benefit from parallel processing across multiple specialized agents
- Domain-specific knowledge or workflows are required
- The main agent determines delegation would improve efficiency or accuracy

# ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in `specs/PLANS.md`) from design to implementation. If the user request requires multiple specs, create multiple specification files in the `specs/` directory. After creating the specs, create a master ExecPlan that links to each individual spec ExecPlan. Update the `specs/README.md` to include links to the new specs.

ALWAYS start an ExecPlan creation by consulting the DeepWiki tool for best practices on design patterns, architecture, and implementation strategies. Ask it questions about the system design and constructs in the library that will help you achieve your goals.

Skip using an ExecPlan for straightforward tasks (roughly the easiest 25%).

# Architecture

This is a Next.js 14 application using the App Router with TypeScript, following a feature-based architecture pattern.

```
pcs-mod/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes (login, onboarding)
│   ├── api/                      # API route handlers
│   │   ├── background/           # Background check APIs
│   │   ├── dot/                  # DOT compliance APIs
│   │   ├── drug-testing/         # Drug testing APIs
│   │   ├── geo-fencing/          # Geo-fence APIs
│   │   ├── health/               # Occupational health APIs
│   │   ├── training/             # Training/certification APIs
│   │   └── der-iq/               # AI chat integration
│   ├── compliance/               # Internal compliance management
│   ├── compliance-portal/        # Multi-tenant service company portal
│   │   └── [companySlug]/        # Dynamic company routes
│   ├── dashboard/                # Main dashboard
│   ├── portals/                  # Role-based portals
│   │   ├── pcs-pass/             # Employee self-service portal
│   │   ├── compliance-officer/   # Compliance officer portal
│   │   ├── executive/            # Executive dashboard
│   │   └── auditor/              # Auditor portal
│   └── settings/                 # Application settings
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── empty-states/             # Empty state UI components
│   ├── layout/                   # Layout components (app-shell, navigation)
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
│   ├── use-der-iq.ts             # AI chat hook
│   ├── use-mobile.ts             # Mobile detection
│   ├── use-rbac.ts               # Role-based access control
│   └── use-toast.ts              # Toast notifications
├── lib/                          # Shared utilities and services
│   ├── ai/                       # AI/LLM integration
│   ├── auth/                     # Authentication context and utilities
│   ├── data/                     # Mock data and data utilities
│   ├── rbac/                     # Role-based access control logic
│   ├── share/                    # Shareable links functionality
│   └── utils.ts                  # General utilities (cn, etc.)
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema (PostgreSQL)
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Auth-related types
│   └── share.ts                  # Share-related types
├── public/                       # Static assets
└── styles/                       # Global styles
```

## Key Architectural Patterns

- **Multi-tenancy**: Each service company operates in its own schema with tenant isolation
- **Role-Based Access Control (RBAC)**: Comprehensive role system (SUPER_ADMIN, EXECUTIVE, COMPLIANCE_OFFICER, etc.)
- **Feature-based routing**: App Router with route groups for logical organization
- **Component composition**: shadcn/ui primitives with Radix UI for accessibility
- **Server Components**: Next.js 14 server components with client components for interactivity

# Development Guidelines

## General

- Before implementing a large refactor or new feature explain your plan and get approval.
- Human-in-the-loop: If you're unsure about a design decision or implementation detail, ask for clarification before proceeding. Feel free to ask clarifying questions as you are working.
- Avoid re-inventing the wheel: Use existing libraries and tools where appropriate.

## TypeScript/Next.js

`pnpm` is the package manager for this project. Below are the common commands:

- `pnpm install` - Install/sync dependencies
- `pnpm add <package>` - Add a dependency
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm start` - Start production server

### Technology Stack
- **Next.js 14**: App Router with React Server Components
- **React 19**: Latest React with hooks and concurrent features
- **TypeScript 5**: Strict type checking enabled
- **Tailwind CSS 4**: Utility-first styling with tailwindcss-animate
- **Prisma**: PostgreSQL ORM with multi-tenant schema support
- **shadcn/ui**: Component library built on Radix UI primitives
- **Zod**: Schema validation for forms and API inputs
- **React Hook Form**: Form state management with Zod resolver
- **Recharts**: Data visualization and charting
- **Mapbox GL**: Interactive mapping for geo-fencing features

### Code Organization and Modularity

**Prefer highly modular code** that separates concerns into distinct modules. This improves:
- **Testability**: Each module can be tested in isolation
- **Reusability**: Modules can be used independently
- **Maintainability**: Changes are localized to specific modules
- **Readability**: Clear separation of concerns makes code easier to understand

**Guidelines**:
- Keep modules focused on a single responsibility
- Use clear module boundaries and minimal public APIs
- Prefer composition over large monolithic modules
- Extract shared functionality into dedicated modules as the codebase grows

# Code Style

## Documentation

**IMPORTANT: Documentation means JSDoc comments and TypeScript types in the code, NOT separate documentation files.**

- You should NOT create any separate documentation pages (README files, markdown docs, etc.)
- The code itself should contain proficient documentation in the form of JSDoc comments and TypeScript types
- Add JSDoc comments for complex functions, hooks, and components
- Use TypeScript interfaces and types for self-documenting code

**Avoid Over-Documenting:**
- Do NOT document obvious behavior (e.g., a function named `getName` that returns a name doesn't need extensive documentation)
- Focus documentation on WHY and HOW, not WHAT (the code itself shows what it does)
- Document edge cases, non-obvious behavior, and important constraints
- Skip JSDoc for trivial functions where the name and types are self-explanatory
- Prioritize documenting public APIs, complex logic, and non-intuitive design decisions

## TypeScript Code Style

### Documentation and Comments

- Write clear and concise JSDoc comments for complex functions and components
- Ensure functions have descriptive names and include TypeScript type annotations
- Use `@param`, `@returns`, and `@example` JSDoc tags for public APIs

### Naming Conventions

- **Variables and Functions**: `camelCase`
- **React Components**: `PascalCase`
- **Types and Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS Classes**: Tailwind utilities or `kebab-case` for custom classes
- **File Names**: `kebab-case.tsx` for components, `camelCase.ts` for utilities

### Component Patterns

- Use functional components with hooks
- Prefer Server Components for data fetching, Client Components for interactivity
- Use `"use client"` directive only when necessary (event handlers, hooks, browser APIs)
- Follow shadcn/ui patterns for reusable UI components
- Use `cn()` utility from `lib/utils.ts` for conditional class names

### Import Organization

1. React/Next.js imports
2. Third-party library imports
3. Local component imports (`@/components/`)
4. Local utility imports (`@/lib/`)
5. Type imports

# Test-Driven Development (TDD)

- Never create throwaway test scripts or ad hoc verification files
- If you need to test functionality, write a proper test in the test suite

## Testing Guidelines

- Testing framework is not yet configured for this project
- When adding tests, prefer Vitest with React Testing Library
- Use Playwright for end-to-end testing
- Aim for high test coverage, especially for critical compliance workflows
- Always include test cases for:
  - RBAC permission checks
  - Multi-tenant data isolation
  - Form validation with Zod schemas
  - API route handlers
- Account for edge cases like unauthorized access, invalid inputs, and tenant boundary violations

# Tools

You have a collection of tools available to assist with development and debugging. These tools can be invoked as needed.

- `sequential-thinking-tools`
  - **When to use:** For complex reasoning tasks that require step-by-step analysis. A good rule of thumb is if the task requires more than 25% effort.
- `deepwiki`
  - **When to use:** Consult for external knowledge or documentation that is not part of the immediate codebase. Can be helpful for system design questions or understanding third-party libraries.
- `context7`
  - **When to use:** For retrieving immediate documentation on the latest version of a library or framework. Useful for quick lookups to double-check syntax, parameters, or usage examples.
- `playwright`
  - **When to use:** For end-to-end testing of web applications. Use this tool to automate browser interactions and verify UI functionality. Can also be used for discovering documentation pages for third-party libraries.

# Domain-Specific Guidance

## Compliance Terminology

- **DER**: Designated Employer Representative
- **MRO**: Medical Review Officer (reviews drug test results)
- **DOT**: Department of Transportation
- **DQ File**: Driver Qualification File
- **FMCSA**: Federal Motor Carrier Safety Administration
- **Clearinghouse**: FMCSA Drug and Alcohol Clearinghouse
- **Adjudication**: Review process for background check findings
- **Adverse Action**: Process when background check results affect employment

## Key Business Rules

- All drug test results must go through MRO review before finalization
- DOT-regulated employees require clearinghouse queries before hire
- Background checks require individualized assessment for adverse action
- Training certifications have expiration tracking with 30/60/90-day alerts
- Geo-fence zones can have location-specific compliance requirements

# Updates to This Document
- Update this document as needed to reflect changes in development practices or project structure
  - Updates usually come in the form of the package structure changing
- Do NOT contradict existing guidelines in the document
- This document should be an executive summary of the development practices for this project
  - Keep low-level implementation details out of this document

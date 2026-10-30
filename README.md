# LaunchPad Plane A (MVP), AI Control Plane & PaperCraft Studio

> Enterprise Cloud Orchestration Platform, Multi-Tenant Database, Resilient Multi-Provider AI Fallback Engine (Google Gemini & OpenRouter), and Zero-Dependency PDF & DOC Export Engine.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-44_Passing-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-24_Passing_WCAG_AA-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

---

## 🚀 Architectural Overview

LaunchPad Plane A is a full-stack, enterprise-grade cloud telemetry platform and autonomous AI studio constructed strictly according to `DESIGN.md` design tokens and `AGENTS.md` engineering standards.

```
                    ┌──────────────────────────────────────────────┐
                    │               Client Viewports               │
                    │   Desktop (1440px) | Tablet | Mobile (390px) │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │       Next.js 15 App Router Edge Middleware  │
                    │   /          /dashboard         /admin       │
                    │  (Public)   (Tenant Auth)    (Super Admin)   │
                    └──────┬───────────────┬──────────────┬────────┘
                           │               │              │
       ┌───────────────────┴──────┐        │        ┌─────┴──────────────────┐
       │ Multi-Provider AI Engine │        │        │ Admin Control Plane    │
       │  Gemini 2.5 Flash        │        │        │ - User & Org Directory │
       │     ↓ (Hot Failover)     │        │        │ - Order Status Control │
       │  OpenRouter Standby      │        │        │ - Environment Auditing │
       └──────────────────────────┘        │        └────────────────────────┘
                                           │
                    ┌──────────────────────▼───────────────────────┐
                    │         Supabase Multi-Tenant PostgreSQL     │
                    │   - Row Level Security (RLS) on all tables   │
                    │   - Zero Security Linter / Performance Alerts│
                    └──────────────────────────────────────────────┘
```

---

## ✨ Key Capabilities

### 1. Multi-Provider AI Engine with Automatic Failover
- **Primary Inference**: **Google Gemini API** (`gemini-2.5-flash`) for low-latency, high-accuracy generation.
- **Hot Standby Backup**: **OpenRouter API** (`google/gemini-2.5-flash` / `gpt-4o-mini`) automatically triggers when Gemini encounters rate limits (HTTP 429), quota limits, network timeouts, or upstream 5xx errors.
- **Provider Transparency**: Returns standardized metadata including active provider, model ID, latency, and whether failover occurred.
- **Interactive Studio**: Accessible directly inside the Admin Control Plane with options to test automatic failover or force specific providers.

### 2. Enterprise Admin Control Plane (`/admin`)
- **System Diagnostics**: Live connectivity checks across Supabase PostgreSQL, AI providers, and environment variables without exposing raw secrets.
- **User & Membership Management**: Real-time directory of all registered profiles, organizations, and role permissions, with 1-click Super Admin privilege toggles.
- **Transactions & Orders**: Search and manage all checkout orders with status updates (`pending`, `completed`, `refunded`, `failed`).
- **Protected Access**: Enforced via Route Protection Middleware requiring authenticated Super Admin credentials or `ADMIN_SECRET_KEY` tokens.

### 3. Customer Telemetry Hub & PaperCraft AI Studio (`/dashboard`)
- **PaperCraft AI Studio**: Autonomous exam and academic paper creator supporting CAIE IGCSE, A-Levels, Edexcel, and custom academic curricula with automated mark schemes.
- **Instant Dual-Format Export**:
  - **"Download as PDF"**: Client-side `%PDF-1.4` compliant multi-page A4 document generation with automatic line-wrapping, headers, footers, page numbering (`Page X of Y`), and xref tables with zero external dependencies.
  - **"Download as DOC"**: Microsoft Word document export with native `xmlns:w='urn:schemas-microsoft-com:office:word'` XML namespaces, preserving styled headings, section demarcations, margins, and print layout.
  - **Prominent Controls**: Available immediately both above and below generated papers, plus 1-click Markdown copying.
- **KPI Metrics**: 4 real-time stat cards tracking cluster nodes, telemetry pings, error rates, and cloud storage.
- **Paginated Data Table**: Filterable, sortable table for deployment logs with accessible controls.
- **Order Tracker**: Interactive order and mission status tracking with visual milestone progress bars.
- **Collapsible Sidebar**: 260px desktop collapsible sidebar with quick navigation to telemetry, billing, and settings.

### 4. Marketing Landing Page (`/`)
- **Hero LaunchPad**: High-impact, dark glassmorphic hero with animated status pill and CTA triggers.
- **Capabilities Matrix**: 3-column feature grid with hover glows and responsive typography.
- **Glass Pricing Table**: Starter, Pro, and Enterprise tiers with an interactive Monthly / Annual toggle (20% discount).
- **Social Proof**: Testimonials carousel featuring industry CTOs and lead architects.
- **Responsive Footer**: Status indicators and system operational badges.

### 5. Multi-Tenant Supabase Database & Multi-Tier RLS
- **Public Schema**: `organizations`, `memberships`, `profiles`, `projects`, `orders`, `deployment_logs`.
- **Strict RLS**: Every table enforces Row Level Security. Policies verify membership through `public.memberships` using cached subqueries `(select auth.uid())` to eliminate `auth_rls_initplan` performance warnings.
- **Security Definer Isolation**: Helper RPCs (`is_org_member`, `is_org_admin`, `is_platform_admin`, `bootstrap_first_admin`) have public execution revoked to prevent API exploitation.
- **Zero Advisors Warnings**: Passed both Supabase Security and Performance Advisors with 0 public schema warnings.

---

## 🛠️ Tech Stack & Pinned Dependencies

| Layer | Technology | Exact Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Server Actions) | `15.1.4` |
| **Runtime** | React / React DOM | `19.0.0` |
| **Language** | TypeScript (Strict mode) | `5.7.3` |
| **Styling** | Tailwind CSS & PostCSS | `3.4.17` / `8.4.49` |
| **Primitives** | Radix UI (Slot, Select, Dropdown, Avatar) | Exact pinned |
| **Icons** | Lucide React | `1.16.0` |
| **Database & Auth** | Supabase JS & Supabase SSR Client | `2.48.2` / `0.5.2` |
| **Schema Validation** | Zod | `3.24.1` |
| **Unit Testing** | Vitest & Testing Library | `3.0.0` / `16.2.0` |
| **E2E Testing** | Playwright & Axe-Core Accessibility | `1.49.1` / `4.10.1` |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory (this file is gitignored and must never be committed):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_PROJECT_REF=<your-project-ref>

# AI Engine Credentials (Multi-Provider Fallback)
GEMINI_API_KEY=<your-primary-gemini-api-key>
OPENROUTER_API_KEY=<your-backup-openrouter-api-key>

# Admin Control Plane Secret
ADMIN_SECRET_KEY=<your-secure-admin-secret-key>
```

---

## 🧪 Testing & Verification

The project is protected by a continuous verification triad:

```bash
# 1. Static code analysis and linting (0 warnings enforced)
npm run lint

# 2. TypeScript strict compilation check
npm run typecheck

# 3. Unit test suite (44 tests across scaffold, database, auth, AI fallback, admin, export)
npm run test

# 4. End-to-end and WCAG AA accessibility tests across 3 viewports
npm run test:e2e

# 5. Production Next.js build
npm run build
```

### Test Coverage Highlights
- **Unit Suite (44/44 Passing)**:
  - Phase 1: Directory contract and specification enforcement
  - Phase 2: Supabase schema and RLS policies verification
  - Phase 3: Component rendering for landing page and dashboard (including PaperCraft Studio)
  - Phase 4: Supabase OAuth redirects and checkout webhook verification
  - Phase 5: Viewport contracts and token validation
  - AI Engine: Primary success, failover on 429/timeout, forced provider routing, and combined failure handling
  - Admin Suite: Session authentication, unauthorized rejection, and environment auditing
  - Document Export Suite: PDF-1.4 binary structure verification, multi-page pagination, and Word XML formatting
- **Playwright Suite (24/24 Passing)**:
  - Tested across **Desktop (1440px)**, **Tablet (768px)**, and **Mobile (390px)**
  - Automated **Axe-core WCAG AA** audit on Landing page, Auth gateway, and Customer Dashboard with **0 violations**
  - E2E Admin flow testing login redirection, credential authentication, and tab switching

---

## 📦 Project Structure

```
launchpad-plane-a/
├── scripts/
│   └── hooks/
│       ├── verify-env.mjs               # Node >=20 and specification guard
│       └── sql-rls-circuit-breaker.mjs  # Destructive SQL and RLS enforcer
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx           # Admin authentication gateway
│   │   │   └── page.tsx                 # Full Admin Control Plane
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── ai/health/route.ts   # Live AI probe endpoint
│   │   │   │   ├── auth/route.ts        # Admin session login & logout
│   │   │   │   ├── orders/route.ts      # Admin order management
│   │   │   │   ├── system/route.ts      # Safe system diagnostics
│   │   │   │   └── users/route.ts       # User & super admin management
│   │   │   ├── ai/
│   │   │   │   └── generate/route.ts    # Multi-provider generation endpoint
│   │   │   ├── checkout/session/        # Checkout session handler
│   │   │   └── webhooks/checkout/       # Payment webhook processor
│   │   ├── auth/                        # Supabase auth gateway
│   │   ├── dashboard/                   # Customer telemetry dashboard & PaperCraft Studio
│   │   ├── layout.tsx                   # Root layout with globals & tokens
│   │   └── page.tsx                     # Marketing landing page
│   ├── components/
│   │   ├── dashboard/                   # PaperStudio, TopStats, DataTable, OrderTracker
│   │   ├── marketing/                   # Hero, Features, Pricing, Testimonials
│   │   └── ui/                          # Button primitives and design tokens
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts                # Fallback engine (Gemini -> OpenRouter)
│   │   │   └── types.ts                 # AI request/response types
│   │   ├── export/
│   │   │   └── documents.ts             # PDF-1.4 & MS Word export engine
│   │   ├── supabase/                    # SSR client & server helpers
│   │   └── utils.ts                     # Tailwind class merge helper
│   ├── middleware.ts                    # Edge route protection & auth gating
│   ├── styles/globals.css               # DESIGN.md compiled tokens
│   └── types/database.types.ts          # Synchronized live Supabase types
├── supabase/
│   └── migrations/                      # Applied DDL migrations
├── tests/
│   ├── e2e/                             # Playwright & axe-core tests
│   └── unit/                            # Vitest unit test suite
├── DESIGN.md                            # Design token specification
├── AGENTS.md                            # Engineering protocol rules
└── package.json                         # Pinned exact dependencies
```

---

## 🚢 Deployment

Deployed to **Vercel** with automatic preview deployments and production promotions. Environment variables are managed via Vercel Project Settings with encryption enabled for production, preview, and development targets.

---

## 📄 License

Proprietary and Confidential. Built with Google Antigravity.

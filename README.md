# Prompt2Paper & LaunchPad Plane A: Harmonized Enterprise AI Studio

> **Autonomous Examination Paper Synthesis, Relational Question Banking, 1-Click Atomic Question Swapping with Mark Scheme Sync, KaTeX Mathematical Vector Rendering, Multi-Provider AI Fallback Engine (Google Gemini 2.5 Flash & OpenRouter), Supabase Multi-Tenant PostgreSQL with Strict RLS, and Zero-Dependency PDF/DOC Export.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-0.16.11-329894?style=for-the-badge&logo=latex)](https://katex.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-68_Passing-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-24_Passing_WCAG_AA-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)

---

## 🎯 Unified System Architecture

Prompt2Paper unites two world-class system architectures into a single, cohesive, enterprise-grade SaaS platform:

1. **LaunchPad Plane A (MVP Core)**:
   - Modern Next.js 15 App Router architecture with React 19, TypeScript strict mode, and Radix UI.
   - Supabase multi-tenant PostgreSQL with Row Level Security (RLS) across all tables (`organizations`, `memberships`, `profiles`, `projects`, `orders`, `deployment_logs`).
   - Enterprise **Admin Control Plane** (`/admin`) for telemetry, diagnostic connectivity checks, order status control, and user role management.
   - **Multi-Provider AI Fallback Engine** (`/api/ai/generate`) utilizing Google Gemini 2.5 Flash as primary inference and OpenRouter as hot-standby fallback.
   - Zero-dependency client-side PDF (`%PDF-1.4`) and Word (`.doc`) binary generators.

2. **PaperCraft AI Studio Blueprint**:
   - **Relational Question Bank** (`questions_bank`) populated with official Cambridge CAIE (O-Level 4024 / A-Level 9702) structured questions.
   - **KaTeX Mathematical Equation Engine** rendering vector-sharp fractions, radicals, quadratic formulas, matrices, and geometry coordinates without pixelation or PDF print breakage.
   - **Cognitive Difficulty Distribution Curves**:
     - *Standard CAIE Curve* (30% Easy / 50% Medium / 20% Hard)
     - *Foundation Drill* (80% Easy / 20% Medium / 0% Hard)
     - *A\* Challenger* (15% Easy / 45% Medium / 40% Hard)
   - **1-Click Atomic Question Swapping**: Instant question replacement with circular candidate rotation that prevents 2-element starvation ping-pong and synchronizes question prompts, allocated marks, and Section B official mark schemes atomically.
   - **Institutional Branding & Layout Engine**: Coaching institution title (e.g., `THE COACH`), faculty subtitle (e.g., `Tanas Sir`), emblem logo, diagonal watermark, candidate details header, and official Cambridge cover page instructions with mark-proportional student answer spaces.
   - **Cloud Persistence Tables** (`mock_papers`, `institutes`, `generated_pdfs`) protected with user-scoped Supabase RLS.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT VIEWPORTS                                     │
│                  Desktop (1440px)  │  Tablet (768px)  │  Mobile (390px)                │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             NEXT.JS 15 APP ROUTER EDGE                                │
│          / (Marketing)      │    /dashboard (Studio & Telemetry)    │    /admin        │
└─────────────────────┬─────────────────────┬────────────────────────────────────┬───────┘
                      │                     │                                    │
┌─────────────────────▼───────┐ ┌───────────▼──────────────────────┐ ┌───────────▼───────┐
│ Multi-Provider AI Fallback  │ │ PaperCraft AI Studio Engine      │ │ Admin Control     │
│ - Google Gemini 2.5 Flash   │ │ - Relational Question Bank       │ │ - System Health   │
│       ↓ (Hot Failover)      │ │ - 1-Click Atomic Question Swap   │ │ - User Directory  │
│ - OpenRouter Secondary      │ │ - KaTeX Mathematical Renderer    │ │ - Order Auditing  │
│ - Zero-dependency PDF & DOC │ │ - Institutional Branding Engine  │ │ - Secret Checks   │
└─────────────────────────────┘ └──────────────────┬───────────────┘ └───────────────────┘
                                                   │
┌──────────────────────────────────────────────────▼─────────────────────────────────────┐
│                           SUPABASE MULTI-TENANT POSTGRESQL                             │
│  organizations  │  memberships  │  profiles       │  projects    │  orders             │
│  questions_bank │  institutes   │  mock_papers    │  generated_pdfs                    │
│                 * 100% TABLES PROTECTED BY ROW LEVEL SECURITY (RLS) *                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 Core Feature Highlights

### 1. Auto Mock Paper Generator & Cognitive Difficulty Profiles
The engine intelligently synthesizes balanced examination papers matching exact target marks (25m, 30m, 50m, 100m) while adhering to pedagogical distribution curves:
- **CAIE Standard Curve**: $30\%$ Easy, $50\%$ Medium, $20\%$ Hard.
- **Foundation Drill**: $80\%$ Easy, $20\%$ Medium, $0\%$ Hard (focused on confidence and core numeracy).
- **A\* Challenger**: $15\%$ Easy, $45\%$ Medium, $40\%$ Hard (multi-step proofs, non-routine problems).
- **Topic Checklist**: Select from Number & Arithmetic, Algebra & Graphs, Geometry & Mensuration, Statistics & Probability, and Trigonometry & Vectors.

### 2. 1-Click Atomic Question Swap Engine (Candidate Rotation)
- Solves the critical **Mark Scheme Desync Defect** by maintaining an immutable unified paper state node.
- Swapping a question replaces both the question prompt and its corresponding official marking guidelines simultaneously without altering overall allocated marks.
- Implements candidate circular rotation to ensure all available matching questions can be browsed without starvation or getting trapped in 2-element loops.

### 3. KaTeX Mathematical Typography
- LaTeX formulas rendered via KaTeX (`0.16.11`) both client-side and server-side.
- Clean formatting for fractions ($\frac{a}{b}$), radicals ($\sqrt{x^2+y^2}$), quadratic formula ($x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$), simultaneous equation systems, and vector matrices ($\vec{v} = \begin{pmatrix} 6 \\ -8 \end{pmatrix}$).
- Embedded KaTeX CSS ensures zero missing font glyphs or layout shifts.
- Delimited text parsing cleanly distinguishes regular English prose from mathematical expressions.

### 4. Institutional Branding, Watermark & Cambridge Cover Page
- Custom coaching watermark & header (e.g. *THE COACH*, *Tanas Sir*).
- Dynamic mark-proportional student answer writing spaces preventing cramped calculations.
- Candidate details block (Candidate Name, Date, Centre Number, Candidate Number, Score box).
- Official Cambridge Instructions to Candidates: Calculator rules, accuracy guidelines, answer space demarcations.
- Saved directly into Supabase `public.institutes` table with user-scoped RLS.

### 5. Multi-Page Vector PDF Print & Word (.doc) Export
- **Print Sheet View**: Uses print media rules (`@media print`, `page-break-inside: avoid`, `print-avoid-break`, `@page { margin: 12mm 15mm; size: A4; }`) ensuring questions do not awkwardly slice across page boundaries and dashboard chrome is fully isolated.
- **Direct PDF Vector Generation**: Instant client-side download as PDF or via browser print dialog.
- **Microsoft Word (.doc) Generation**: Complete `.doc` export with native Word XML tags and styled headers.

### 6. Multi-Provider AI Fallback Engine
- Dual-provider strategy combining Google Gemini 2.5 Flash and OpenRouter.
- Automatic failover upon rate limits (HTTP 429), timeouts, or downstream provider degradation.
- Real-time latency tracking and fallback indication in generation metadata.

### 7. Supabase Multi-Tenant Database & Strict RLS
Every table is locked down with PostgreSQL Row Level Security:
- `questions_bank`: Public/authenticated read, admin/owner-only `INSERT/UPDATE/DELETE` verified via `public.memberships`.
- `institutes`: `owner_id = auth.uid()`
- `mock_papers`: `user_id = auth.uid()`
- `generated_pdfs`: `user_id = auth.uid()`
- `organizations`, `memberships`, `profiles`, `projects`, `orders`, `deployment_logs`: Tenant organization membership verified via `public.memberships`.

---

## 🗄️ Database Schema & RLS Policies

| Table Name | Description | Row Level Security (RLS) Policy |
| :--- | :--- | :--- |
| `public.questions_bank` | Relational bank of exam questions with LaTeX & mark schemes | Public/authenticated `SELECT`, org admin/owner `INSERT/UPDATE/DELETE` |
| `public.institutes` | Coaching and institutional branding profiles | `owner_id = auth.uid()` for all CRUD operations |
| `public.mock_papers` | Generated exam papers with questions snapshots & branding | `user_id = auth.uid()` for all CRUD operations |
| `public.generated_pdfs` | PDF export records and file telemetry | `user_id = auth.uid()` for all CRUD operations |
| `public.organizations` | Multi-tenant organization accounts | Membership verified via `public.memberships` |
| `public.memberships` | User-to-organization RBAC mappings | Scoped to organization members or own record |
| `public.profiles` | User profiles with super-admin flags | `id = auth.uid()` |
| `public.projects` | Cloud project definitions and metadata | Scoped to organization members |
| `public.orders` | Billing checkout orders and payment states | Scoped to organization members & platform admins |
| `public.deployment_logs`| CI/CD deployment telemetry logs | Scoped to project organization members |

---

## 🧪 Verification Record & Testing Suite

### 1. Vitest Unit & Integration Tests (13 Suites, 68 Tests Passing)
```bash
npm run test
```
- `tests/unit/papercraft-generator.test.ts`: Validates difficulty distribution curves, topic checklists, target marks matching, candidate rotation, and 1-click atomic swap state integrity.
- `tests/unit/katex-math.test.ts`: Validates KaTeX equation formatting, fractions, display formulas, un-delimited environments, mixed text parsing, and error-tolerant fallbacks.
- `tests/unit/papercraft-api.test.ts`: Validates `/api/questions`, `/api/questions/swap`, and `/api/mock-papers/generate` API routes.
- `tests/unit/dashboard-components.test.tsx`: Validates `PaperStudio`, `SidebarNav`, and document export triggers.
- `tests/unit/ai-client.test.ts`: Validates Gemini primary inference and OpenRouter fallback mechanism.
- `tests/unit/document-export.test.ts`: Validates binary PDF and Word (.doc) generation without external dependencies.
- `tests/unit/friendly-errors.test.ts`: Validates human-readable exception mapping across database, AI, and network failures.

### 2. TypeScript Strict Mode & ESLint
```bash
npm run typecheck # tsc --noEmit (0 errors)
npm run lint      # next lint (0 warnings, 0 errors)
```

### 3. Production Build
```bash
npm run build     # 22/22 static pages & server routes compiled successfully
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_PROJECT_REF=<your-project-ref>

# AI Engine Credentials
GEMINI_API_KEY=<your-google-gemini-api-key>
OPENROUTER_API_KEY=<your-openrouter-api-key>

# Admin Control Plane
ADMIN_SECRET_KEY=<your-secure-admin-secret>
```

### 3. Database Migrations
Migrations are managed in `supabase/migrations/`:
- `20261030000001_plane_a_schema.sql`: Core multi-tenant organizations, profiles, projects, orders.
- `20261030000002_papercraft_studio_schema.sql`: Question bank, institutes, mock papers, generated PDFs, with 15 seed Cambridge questions.

All migrations are verified against `scripts/hooks/sql-rls-circuit-breaker.mjs` before application.

### 4. Running Locally
```bash
# Install exact pinned dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the marketing launchpad and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the PaperCraft AI Studio.

---

## 📄 License
MIT License. Built for educators, examiners, and high-performance engineering teams.

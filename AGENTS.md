# AGENTS.md: LaunchPad Plane A (MVP)

## Scope
Build Plane A only: marketing site, auth, pricing and checkout, customer dashboard.
Plane B (AI studio, DB explorer, DevOps console, MCP servers) is OUT OF SCOPE. Do not create it.

## Phase order (do not skip or merge)
1. Scaffold: Next.js App Router, React 19, TypeScript strict, Tailwind, Radix UI, Lucide, Zod.
   Set up Vitest and Playwright. Create scripts `lint`, `typecheck`, `test`.
   Create `scripts/hooks/verify-env.mjs` and `scripts/hooks/sql-rls-circuit-breaker.mjs`.
   Compile DESIGN.md tokens into tailwind.config.ts CSS variables.
2. Database: apply migrations via `apply_migration`. Tables: organizations, memberships, profiles, projects, orders, deployment_logs.
   Every table: `ENABLE ROW LEVEL SECURITY`. Policies check membership in `memberships`, not just `auth.uid()`.
   Run `generate_typescript_types` into `src/types/database.types.ts`, then `get_advisors`.
3. Plane A UI: landing page, pricing table, dashboard. Write component tests for each.
4. Auth and payments: Supabase Auth (Google, GitHub). Payments: <PAYMENT_PROVIDER>. Write tests for auth redirects and checkout webhooks.
5. QA: Playwright at 1440px, 768px, 390px. Run axe accessibility checks (WCAG AA per DESIGN.md).
6. Ship: GitHub PR, then Vercel production deploy. Verify env vars and build logs.

## Rules
- Every feature ships with tests. Do not start the next phase until `npm run lint && npm run typecheck && npm run test` pass.
- Never ask for, print, or commit secret values. Refer to env var names only.
- Never call `execute_sql` for schema changes. Use `apply_migration`.
- Never create a table without RLS enabled and policies written.
- Use DESIGN.md tokens. Do not hardcode hex values in components.
- Stitch: use `generate_screen_from_text` only for new screens. Fix spacing and styling in local Tailwind classes.
- Use `/compress` between phases.
- Do not install a package unless it is pinned to an exact version.

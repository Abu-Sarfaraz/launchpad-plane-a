# DESIGN.md: PaperGen Design System (v1.0, Plane A)

## 1. Brand
Product: PaperGen. Style: deep orbital glassmorphism. Midnight backgrounds, neon purple accents, translucent surfaces, telemetry-style typography.

## 2. Colors (W3C tokens)
- --bg-midnight-950: #060814
- --bg-midnight-900: #0D1226
- --surface-glass: rgba(19, 27, 56, 0.65), backdrop-filter blur(16px)
- --accent-neon-purple: #8B5CF6
- --accent-cyber-cyan: #06B6D4
- --text-primary: #F8FAFC
- --text-secondary: #94A3B8
- Success #10B981, Warning #F59E0B, Danger #EF4444

## 3. Typography
- Display/headings: Space Grotesk, 600 and 700, tracking -0.02em
- Body/UI: Inter, 400, 500, 600
- Code/logs: JetBrains Mono, 400
- Scale: H1 56px, H2 36px, H3 20px, Body 16px, Micro 12px

## 4. Layout
- Desktop 1440px: 12-column grid, max-width 1280px, gap 24px, padding 32px
- Tablet 768px: 8-column grid, collapsible sidebar drawer, gap 16px, padding 24px
- Mobile 390px: single column, bottom nav, gap 16px, padding 16px

## 5. Elevation and borders
- Card border: 1px solid rgba(139, 92, 246, 0.25), 0.65 on hover
- Radius: containers 16px, controls 8px, pills 9999px
- Glow: 0 8px 32px -4px rgba(139, 92, 246, 0.18)

## 6. Plane A components
- Hero: full-width, dual CTA (primary neon, glass secondary)
- Features grid: 3 columns, icon, title, metric
- Pricing table: Starter, Pro, Enterprise. Monthly/annual toggle. Pro highlighted with border-purple-500
- Dashboard: 260px collapsible sidebar, 4 KPI cards, paginated sortable table, status drawer

## 8. Interaction
- Buttons: px-6 py-3, transition 200ms, active scale 0.98, focus ring 2px #8B5CF6
- Loading: skeleton placeholders with matching dimensions, CLS under 0.05

## 9. Accessibility
- WCAG AA: 4.5:1 body text, 3:1 large text and UI boundaries
- Full keyboard navigation, focus traps in modals, respect prefers-reduced-motion

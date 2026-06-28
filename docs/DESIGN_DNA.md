# ZSMART OSS — Design DNA (extracted from reference materials)

## Source materials analyzed
- `N- OSS SNAPS.one` — Microsoft OneNote binary. **17 PNG screenshots carved** to `extracted_imgs/` (verified valid, ~1918px full-page + ~1470px module-detail).
- `zsmart-portal-react` (Codex output) — genuine reference code. Login + Home + Order Desk.
- `portal-app-src.zip` — **DISREGARDED** (older/broken variant, per user).

## Confirmed stack (Phase 1)
React 18 + JSX (JavaScript) · Vite · React Router v6 · CSS Modules + design tokens · Context (Auth/Portal) · Recharts · Mock-data layer (→ REST API in Phase 2).

## Decisions (user-approved 2026-06-28)
1. Routing: **React Router v6 + feature folders**
2. Styling: **CSS Modules + design tokens**
3. Extra portals: **YES** — add Fault Management + Analytics
4. Depth: **Full & interactive** (working search/filter/sort, clickable rows, badges, pagination)

## Visual language (from screenshots)
- **Login**: split-screen, left = gradient ∞ logo + "ZSMART / NEW GENERATION OSS / Digital Transformation Platform", right = Username/Password/Remember me/Forgot password → round blue login button → IP display.
- **Palette**:
  - Primary blue: `#4d96ff` · Action blue: `#2f6df6` · Deep blue: `#357abd`
  - Table header blue: `#dceeff`, table header text `#2f3f55`
  - Neutrals: bg `#f5f5f5`, panel `#f9f9f9`/white, borders `#e0e0e0`/`#d8e0eb`/`#ccd5e2`
  - Status: success green `#6bcb77`, error red `#ff6b6b`
- **Header**: brand(∞ ZSMART) · search · 🔔 · ⚙️ · blue avatar(initial) · red Logout · **4-dot portal button (top-right)**
- **Portal drawer**: opens on hover/click of the 4-dot button; lists 7 portals; selecting one loads that portal's home card-grid.
- **Module page pattern (repeats on EVERY detail page)**:
  1. `PageHeader`: breadcrumb ("Portal / IOM-OrderManager / Order Desk") + title + Back button
  2. `SearchPanel`: 3-col label/input grid + checkboxes (Warning/Timeout/Archive) + Query/Reset/Export
  3. `DataTable`: blue header row, nowrap cells, hover highlight, status pills
  4. Footer action buttons (Check-in / Re-dispatch / Redo …)
- **IM Portal** uses a left **tree/catalog** nav (inventory hierarchy) instead of card grid.

## Order Desk reference columns
Customer Order Number · Phone Number · CFS specifications · CFS event · Product event · Area · Order Status · Order Status Date · Complete Date · Priority · Warning Date · Timeout Date

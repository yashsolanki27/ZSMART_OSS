# ZSMART OSS — Project Instructions

## Goal
Build a web-based telecom OSS (Operations Support System) portal covering order management, inventory, fault/alarm management, workforce management, field operations, analytics, and administration. Full-stack: React frontend → Node.js backend → PostgreSQL database.

## Stack
| Layer | Technology | Version |
|---|---|---|
| Frontend | React + JSX (JavaScript) | 18.3 |
| Build | Vite | 5.4 |
| Routing | React Router DOM | 6.x |
| Styling | CSS Modules + design tokens | — |
| Charts | Recharts | 2.x |
| Backend | Node.js + Express | — |
| ORM | Prisma | — |
| Database | PostgreSQL | — |
| Auth | JWT | — |

## Architecture Decisions
- `client/src/config/portals.js` is the **single source of truth** — 9 portals, 33 modules. The drawer, homes, sidebar, router, and mock data all read from this file.
- Generic `ModuleListPage` renders 26 list-type modules from config (columns + searchFields + rows). 7 special pages are hand-built dashboard views.
- Mock data lives in `client/src/data/mock/` — structured to drop-replace with REST API calls in Phase 2.
- Each portal is a feature folder (`features/<portal>/pages/`). Shared UI primitives in `components/ui/`.
- **One tool call at a time** to avoid rate-limiting in this environment.

## Current Status

| Phase | Status | Details |
|---|---|---|
| Phase 1: Frontend | ✅ COMPLETE | 44 files, 9 portals, 33 modules, compiles, runs at localhost:5173 |
| Phase 2: Backend | 🔄 IN PROGRESS | 2.1 ✅ scaffold · 2.2 ✅ Prisma schema (22 models, validated). Steps 2.3+ remaining |
| Phase 3: Database | ⏳ NOT STARTED | — |
| Phase 4: Integration | ⏳ NOT STARTED | Replace mock → API calls |
| Phase 5: Production | ⏳ NOT STARTED | Docker, CI/CD, HTTPS |

## How to Run
```bash
cd client && npm install && npm run dev
# Open http://localhost:5173
# Login: admin / password
```

## Phase 2 Plan (Backend — 12 steps)
| Step | Task |
|---|---|
| 2.1 | Scaffold `server/` — Express + TypeScript |
| 2.2 | Install Prisma, init schema |
| 2.3 | Design DB schema (Users, Orders, Alarms, Inventory, Tasks…) |
| 2.4 | Run migration + seed data |
| 2.5 | Auth middleware + POST /api/auth/login |
| 2.6 | User management CRUD APIs |
| 2.7 | Order/IOM CRUD + search/filter/paginate APIs |
| 2.8 | Inventory CRUD + tree endpoint APIs |
| 2.9 | Fault/Alarm CRUD + severity stats APIs |
| 2.10 | Remaining module APIs (tasks, migrations, reports…) |
| 2.11 | Error handling + validation middleware |
| 2.12 | Frontend integration (mock → fetch /api/…) |

## Key Files
| File | Role |
|---|---|
| `client/src/config/portals.js` | Portal/module definitions, routes, mock data bindings |
| `client/src/App.jsx` | Router — all 33 module routes resolve here |
| `client/src/portals/ModuleListPage.jsx` | Generic list page (26 modules use this) |
| `client/src/components/ui/DataTable.jsx` | Sortable, paginated, selectable table |
| `client/src/components/ui/SearchPanel.jsx` | 3-col search grid + Query/Reset/Export |
| `client/src/data/mock/index.js` | All mock data + column/search definitions |
| `client/src/data/mock/_gen.js` | Deterministic mock data generator |

## Reference Materials
- `N- OSS SNAPS.one` — 17 PNG screenshots extracted to `extracted_imgs/`
- `docs/DESIGN_DNA.md` — Visual design palette extracted from screenshots
- `SKILLS/` — Reusable workflows and solutions (see SKILLS/README.md)

## Next Step
**Execute Phase 2, Step 2.3** — Run the Prisma migration against PostgreSQL and
write `prisma/seed.js` to populate the DB with sample data. Requires a running
PostgreSQL instance (see `SKILLS/prisma-postgres-setup.md`).

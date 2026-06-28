# ZSMART OSS — Project Tree

Legend: ✅ Complete · ⏳ Planned · 🔴 Blocker

```
ZSMART_OSS/
│
├── PROJECT_INSTRUCTIONS.md          ✅ Master project doc (read this first)
├── PROJECT_TREE.md                  ✅ This file
├── N- OSS SNAPS.one                 ✅ Reference screenshots (17 PNGs inside)
│
├── docs/
│   └── DESIGN_DNA.md                ✅ Visual design palette from screenshots
│
├── extracted_imgs/                   ✅ 17 PNG screenshots carved from .one file
│   └── carve_png_1..17.png
│
├── SKILLS/                           ✅ Reusable workflows (see SKILLS/README.md)
│   └── README.md
│
├── portal-app-extracted/             🗑️ Old reference code (IGNORE)
│
├── client/                           ✅ PHASE 1 COMPLETE — Frontend
│   ├── package.json                  ✅ React 18 + Vite 5 + React Router 6 + Recharts
│   ├── vite.config.js                ✅
│   ├── index.html                    ✅
│   ├── src/
│   │   ├── main.jsx                  ✅ React mount + BrowserRouter
│   │   ├── App.jsx                   ✅ Router: Login → AppShell → 9 portals → 33 modules
│   │   │
│   │   ├── config/
│   │   │   └── portals.js            ✅ ⭐ Single source of truth: 9 portals, 33 modules
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       ✅ Login/logout, localStorage persistence
│   │   │   └── PortalContext.jsx    ✅ Active portal tracking
│   │   │
│   │   ├── data/mock/
│   │   │   ├── _gen.js              ✅ Deterministic mock data generator
│   │   │   └── index.js             ✅ All mock data + column/search defs for 33 modules
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   ✅ 8 reusable primitives
│   │   │   │   ├── PageHeader       ✅ Breadcrumb + Back + Title
│   │   │   │   ├── SearchPanel      ✅ 3-col grid + Query/Reset/Export
│   │   │   │   ├── DataTable        ✅ Sortable, paginated, selectable table
│   │   │   │   ├── StatusBadge      ✅ Colored pills (status/priority/severity/progress/bool)
│   │   │   │   ├── KpiCard          ✅ Metric cards (used on dashboards)
│   │   │   │   ├── ChartCard        ✅ Container for Recharts visualizations
│   │   │   │   └── *.module.css     ✅ CSS for each (18 files)
│   │   │   │
│   │   │   └── layout/              ✅ App shell navigation
│   │   │       ├── AppHeader        ✅ Brand + search + 🔔⚙️ + avatar + logout
│   │   │       ├── PortalDrawer     ✅ 4-dot button + hover/click drawer (9 portals)
│   │   │       └── AppShell         ✅ Header + sidebar + <Outlet>
│   │   │
│   │   ├── portals/                 ✅ Generic pages
│   │   │   ├── PortalHome.jsx       ✅ Card grid per portal (reads config)
│   │   │   └── ModuleListPage.jsx  ✅ Universal list page (26 modules use this)
│   │   │
│   │   ├── features/                ✅ Portal-specific pages
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx    ✅ Split-screen login (admin/password)
│   │   │   ├── fault/
│   │   │   │   ├── AlarmDashboard   ✅ Charts (Area, Pie, Bar)
│   │   │   │   └── AlarmTopology    ✅ SVG network map
│   │   │   ├── im/
│   │   │   │   ├── InventoryMgmt    ✅ Tree catalog + detail panel
│   │   │   │   └── MigrationMonitor ✅ Progress bars + chart
│   │   │   ├── ofm/
│   │   │   │   └── BbnwReport       ✅ Utilization + uptime charts
│   │   │   ├── analytics/
│   │   │   │   └── KpiDashboard     ✅ SLA radial + order trend
│   │   │   └── isap/
│   │   │       └── PerformanceMon   ✅ Throughput + latency charts
│   │   │
│   │   └── styles/
│   │       ├── tokens.css           ✅ Design tokens (blue enterprise palette)
│   │       └── global.css           ✅ Reset + scrollbar + utilities
│   │
│   └── dist/                         ✅ Production build (870 modules, 0 errors)
│
├── server/                           ⏳ PHASE 2 — Backend (NOT STARTED)
│   ├── package.json                  ⏳
│   ├── src/
│   │   ├── index.ts                  ⏳ Express server entry
│   │   ├── middleware/
│   │   │   ├── auth.ts               ⏳ JWT verification
│   │   │   ├── validate.ts          ⏳ Input validation
│   │   │   └── errorHandler.ts      ⏳ Centralized error handling
│   │   ├── routes/
│   │   │   ├── auth.ts               ⏳ POST /api/auth/login
│   │   │   ├── users.ts              ⏳ CRUD /api/users
│   │   │   ├── orders.ts             ⏳ CRUD /api/orders
│   │   │   ├── inventory.ts          ⏳ CRUD /api/inventory
│   │   │   ├── alarms.ts             ⏳ CRUD /api/alarms
│   │   │   ├── tasks.ts              ⏳ CRUD /api/tasks
│   │   │   └── ...                   ⏳ Remaining modules
│   │   ├── controllers/              ⏳ Business logic per module
│   │   └── services/                 ⏳ Data access layer
│   └── prisma/
│       ├── schema.prisma             ⏳ DB schema (PostgreSQL)
│       └── seed.ts                   ⏳ Sample data
│
└── database/                         ⏳ PHASE 3 — Migrations & scripts
```

## Module Count by Portal
| Portal | List Pages | Special Pages | Total |
|---|---|---|---|
| IT Center Admin | 3 | 0 | 3 |
| IOM | 5 | 0 | 5 |
| ISAP | 3 | 1 | 4 |
| IM | 2 | 2 | 4 |
| Resource Assign | 2 | 0 | 2 |
| WFM | 3 | 0 | 3 |
| OFM | 4 | 2 | 6 |
| Fault Management | 2 | 2 | 4 |
| Analytics | 1 | 1 | 2 |
| **Total** | **26** | **7** | **33** |

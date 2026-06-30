# Skill: Data-Driven Module Pages (the portals.js pattern)

## Problem
You have many near-identical list pages (e.g. 26 OSS module screens) and don't
want to hand-write each one. Build them once, drive them from config.

## Solution
**One config object** describes every portal, module, table columns, search
fields, and mock data. A single generic component renders them all.

```js
// config/portals.js  (single source of truth)
export const portals = [
  {
    id: "iom", name: "IOM Management Portal", icon: "📋",
    modules: [
      {
        id: "order-desk", title: "Order Desk", icon: "📦",
        view: "list",                          // ← generic
        columns: [["orderNo","Order No"], ["status","Status","status"]],
        searchFields: [{ key: "orderNo", label: "Order No", type: "text" }],
        rows: [ /* ...data */ ],
        actions: ["Check-in", "Export"],
      },
      {
        id: "alarm-dashboard", title: "Alarm Dashboard",
        view: "special", component: "AlarmDashboard",  // ← hand-built
      },
    ],
  },
];
```

```jsx
// portals/ModuleListPage.jsx — renders ALL list-type modules
import { getModule } from "../config/portals";
import PageHeader, SearchPanel, DataTable from "../components/ui/*";

export default function ModuleListPage() {
  const { portalId, moduleId } = useParams();
  const mod = getModule(portalId, moduleId);
  return (
    <>
      <PageHeader breadcrumb={...} title={mod.title} />
      <SearchPanel fields={mod.searchFields} onFilter={setFilters} />
      <DataTable columns={mod.columns} rows={filtered} actions={mod.actions} />
    </>
  );
}
```

The router resolves list vs special:
```jsx
if (mod.view === "special") return <SPECIAL_PAGES[mod.component] />;
return <ModuleListPage />;
```

## Why this works
- **Add a module = one config entry.** No new component, no new route.
- The drawer, sidebar, home card-grid, and router ALL read the same config.
- Mock data is co-located; swap `rows` → `await fetch()` in Phase 2.

## Gotchas
- Column render hints (`"status"`, `"priority"`, `"severity"`, `"progress"`,
  `"bool"`, `"num"`) must be handled in the StatusBadge component — add new
  render types there, not in the config.
- `view: "special"` pages must be registered in the `SPECIAL_PAGES` map in `App.jsx`.
- Filtering happens client-side in Phase 1; move to server-side query params in
  Phase 2 (the SearchPanel already emits a filter object).

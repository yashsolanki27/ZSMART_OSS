# Skill: Frontend API Layer — Swap Mock Data for Real API Calls

## Problem
Frontend uses mock data from `client/src/data/mock/index.js`. Need to replace with real API calls without breaking 26 list pages.

## Solution
Create an API service module + update portals.js to try API first, fallback to mock.

## Step 1: Create `client/src/api/index.js`

```js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Generic CRUD factory
function createCrud(module) {
  return {
    list: (params = {}) => request(`/${module}?${new URLSearchParams(params)}`),
    get: (id) => request(`/${module}/${id}`),
    create: (data) => request(`/${module}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/${module}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/${module}/${id}`, { method: "DELETE" }),
  };
}

// All modules
export const api = {
  auth: { login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }) },
  users: createCrud("users"),
  roles: createCrud("roles"),
  workgroups: createCrud("workgroups"),
  orders: createCrud("orders"),
  exceptions: createCrud("exceptions"),
  tasks: createCrud("tasks"),
  services: createCrud("service-instances"),
  assurance: createCrud("assurances"),
  sla: createCrud("slas"),
  tickets: createCrud("tickets"),
  macRecords: createCrud("mac-records"),
  migrations: createCrud("migrations"),
  resourceOrders: createCrud("resource-orders"),
  resourceTasks: createCrud("resource-tasks"),
  wfmTasks: createCrud("wfm-tasks"),
  teams: createCrud("teams"),
  bsnlRequests: createCrud("bsnl-requests"),
  mplsBatches: createCrud("mpls-batches"),
  dockets: createCrud("dockets"),
  alarms: createCrud("alarms"),
  incidents: createCrud("incidents"),
  auditLogs: createCrud("audit-logs"),
};
```

## Step 2: Update portals.js

Change each module config from:
```js
rows: mocks.orders,
```
To:
```js
rows: mocks.orders,          // fallback
apiModule: "orders",         // API module name (key in api object)
apiList: api.orders.list,    // API function reference
```

## Step 3: Update ModuleListPage.jsx

Add a `useEffect` that calls `apiList` if defined:
```js
useEffect(() => {
  if (module.apiList) {
    module.apiList({ page: 1, limit: 50 })
      .then(data => setRows(data.items))
      .catch(() => setRows(module.rows)); // fallback to mock
  }
}, [module.id]);
```

## Gotchas
- Environment variable `VITE_API_URL` must be set for production (Vite prefixes with `VITE_`).
- Auth token must be stored after login: `localStorage.setItem("token", data.token)`.
- The API response format must match: `{ items, total, page, limit }`.
- Cold start on Render free tier = first request takes 15-30s. Account for this.

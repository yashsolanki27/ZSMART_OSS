const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("zsmart_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getProfile() {
  return request("/auth/profile");
}

function crud(resource) {
  return {
    list: (params = {}) => {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") q.set(k, v); });
      return request(`/${resource}?${q}`);
    },
    get: (id) => request(`/${resource}/${id}`),
    create: (data) => request(`/${resource}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const api = {
  auth: { login, getProfile },
  users: crud("users"),
  roles: crud("roles"),
  workgroups: crud("workgroups"),
  orders: crud("orders"),
  exceptions: crud("exceptions"),
  tasks: crud("tasks"),
  services: crud("services"),
  assurances: crud("assurances"),
  slas: crud("slas"),
  tickets: crud("tickets"),
  macRecords: crud("mac-records"),
  migrations: crud("migrations"),
  resourceOrders: crud("resource-orders"),
  resourceTasks: crud("resource-tasks"),
  wfmTasks: crud("wfm-tasks"),
  teams: crud("teams"),
  bsnlRequests: crud("bsnl-requests"),
  mplsBatches: crud("mpls-batches"),
  dockets: crud("dockets"),
  alarms: crud("alarms"),
  incidents: crud("incidents"),
  auditLogs: crud("audit-logs"),
};

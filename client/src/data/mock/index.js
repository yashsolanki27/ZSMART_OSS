/* ============================================================
   ZSMART OSS — Mock data + column/search definitions
   Every list-type module gets: { columns, searchFields, rows }
   columns: [key, label, render?]   searchFields: [{key,label,type,options?}]
   ============================================================ */

import {
  resetSeed, rand, id, phone, orderNumber, dateStr,
  AREAS, CFS_SPECS, CFS_EVENTS, PRIORITIES, STATES, STAFF, pick, pad,
} from "./_gen.js";

// helper to build N rows via a factory (resets seed each call for stability)
function build(n, factory) {
  resetSeed();
  return Array.from({ length: n }, (_, i) => factory(i));
}

/* ---------- IOM: Order Desk ---------- */
export const orderColumns = [
  ["customerOrderNumber", "Customer Order Number"],
  ["phoneNumber", "Phone Number"],
  ["cfsSpecifications", "CFS Specifications"],
  ["cfsEvent", "CFS Event"],
  ["productEvent", "Product Event"],
  ["area", "Area"],
  ["orderStatus", "Order Status", "status"],
  ["orderStatusDate", "Order Status Date"],
  ["completeDate", "Complete Date"],
  ["priority", "Priority", "priority"],
  ["warningDate", "Warning Date"],
  ["timeoutDate", "Timeout Date"],
];
export const orderSearchFields = [
  { key: "phoneNumber", label: "Phone Number", type: "text" },
  { key: "customerOrderNumber", label: "Customer Order Number", type: "text" },
  { key: "createDateBegin", label: "Create Date Begin", type: "text" },
  { key: "createDateEnd", label: "Creation Date End", type: "text" },
  { key: "orderStatus", label: "Order State", type: "select", options: STATES },
];
export const orders = build(18, () => ({
  customerOrderNumber: orderNumber(),
  phoneNumber: phone(),
  cfsSpecifications: pick(CFS_SPECS),
  cfsEvent: pick(CFS_EVENTS),
  productEvent: pick(CFS_EVENTS),
  area: pick(AREAS),
  orderStatus: pick(STATES),
  orderStatusDate: dateStr(0),
  completeDate: rand() > 0.6 ? dateStr(2) : "",
  priority: pick(PRIORITIES),
  warningDate: rand() > 0.7 ? dateStr(1) : "",
  timeoutDate: rand() > 0.8 ? dateStr(3) : "",
}));

/* ---------- IOM: Exception Monitoring ---------- */
export const exceptionColumns = [
  ["orderNumber", "Order Number"],
  ["phoneNumber", "Phone Number"],
  ["exceptionType", "Exception Type"],
  ["severity", "Severity", "severity"],
  ["area", "Area"],
  ["raisedDate", "Raised Date"],
  ["slaBreach", "SLA Breach", "bool"],
  ["assignedTo", "Assigned To"],
  ["status", "Status", "status"],
  ["resolution", "Resolution"],
];
export const exceptionSearchFields = [
  { key: "orderNumber", label: "Order Number", type: "text" },
  { key: "phoneNumber", label: "Phone Number", type: "text" },
  { key: "exceptionType", label: "Exception Type", type: "select", options: ["Resource", "Validation", "Timeout", "System"] },
  { key: "severity", label: "Severity", type: "select", options: ["Critical", "Major", "Minor"] },
  { key: "status", label: "Status", type: "select", options: ["Open", "Escalated", "Resolved"] },
];
export const exceptions = build(14, () => ({
  orderNumber: orderNumber(),
  phoneNumber: phone(),
  exceptionType: pick(["Resource", "Validation", "Timeout", "System"]),
  severity: pick(["Critical", "Major", "Minor"]),
  area: pick(AREAS),
  raisedDate: dateStr(0),
  slaBreach: pick([true, false, false]),
  assignedTo: pick(STAFF),
  status: pick(["Open", "Escalated", "Resolved"]),
  resolution: rand() > 0.6 ? "Awaiting vendor" : "",
}));

/* ---------- IOM: Task Desk ---------- */
export const taskColumns = [
  ["taskId", "Task ID"],
  ["orderNumber", "Order Number"],
  ["taskType", "Task Type"],
  ["workgroup", "Workgroup"],
  ["assignedTo", "Assigned To"],
  ["status", "Status", "status"],
  ["priority", "Priority", "priority"],
  ["dueDate", "Due Date"],
  ["area", "Area"],
];
export const taskSearchFields = [
  { key: "taskId", label: "Task ID", type: "text" },
  { key: "orderNumber", label: "Order Number", type: "text" },
  { key: "taskType", label: "Task Type", type: "select", options: ["Provisioning", "Installation", "Activation", "Survey"] },
  { key: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed"] },
  { key: "workgroup", label: "Workgroup", type: "text" },
];
export const tasks = build(16, () => ({
  taskId: id("TSK"),
  orderNumber: orderNumber(),
  taskType: pick(["Provisioning", "Installation", "Activation", "Survey"]),
  workgroup: pick(["Access Team", "Core Team", "Field Ops", "NOC"]),
  assignedTo: pick(STAFF),
  status: pick(["Pending", "In Progress", "Completed"]),
  priority: pick(PRIORITIES),
  dueDate: dateStr(1),
  area: pick(AREAS),
}));

/* ---------- IOM: Service Instance ---------- */
export const serviceColumns = [
  ["serviceId", "Service ID"],
  ["customerName", "Customer Name"],
  ["serviceType", "Service Type"],
  ["phoneNumber", "Phone Number"],
  ["status", "Status", "status"],
  ["activatedDate", "Activated Date"],
  ["area", "Area"],
];
export const serviceSearchFields = [
  { key: "serviceId", label: "Service ID", type: "text" },
  { key: "customerName", label: "Customer Name", type: "text" },
  { key: "serviceType", label: "Service Type", type: "select", options: ["Broadband", "Voice", "IPTV", "Leased Line"] },
  { key: "status", label: "Status", type: "select", options: ["Active", "Suspended", "Disconnected"] },
];
export const services = build(15, () => ({
  serviceId: id("SVC"),
  customerName: pick(["Acme Corp", "Skyline Ltd", "J. Fernandes", "M. Enterprises", "BlueWave Co"]),
  serviceType: pick(["Broadband", "Voice", "IPTV", "Leased Line"]),
  phoneNumber: phone(),
  status: pick(["Active", "Active", "Active", "Suspended", "Disconnected"]),
  activatedDate: dateStr(-30),
  area: pick(AREAS),
}));

/* ---------- ITC Admin: Users / Roles / Workgroups ---------- */
export const userColumns = [
  ["username", "Username"],
  ["fullName", "Full Name"],
  ["email", "Email"],
  ["role", "Role"],
  ["workgroup", "Workgroup"],
  ["status", "Status", "status"],
  ["lastLogin", "Last Login"],
];
export const userSearchFields = [
  { key: "username", label: "Username", type: "text" },
  { key: "fullName", label: "Full Name", type: "text" },
  { key: "role", label: "Role", type: "select", options: ["Administrator", "Operator", "Engineer", "Viewer"] },
  { key: "status", label: "Status", type: "select", options: ["Active", "Locked", "Disabled"] },
];
export const users = build(20, () => ({
  username: pick(["admin", "raghu", "anita", "suresh", "megha", "kiran", "divya"]) + pad(Math.floor(rand() * 99), 2),
  fullName: pick(STAFF).split(" ").reverse().join(" "),
  email: `user${pad(Math.floor(rand() * 999), 3)}@zsmart.tel`,
  role: pick(["Administrator", "Operator", "Engineer", "Viewer"]),
  workgroup: pick(["Access Team", "Core Team", "NOC", "Field Ops"]),
  status: pick(["Active", "Active", "Active", "Locked", "Disabled"]),
  lastLogin: dateStr(0),
}));

export const roleColumns = [
  ["roleName", "Role Name"],
  ["description", "Description"],
  ["permissions", "Permissions"],
  ["userCount", "Users", "num"],
  ["createdDate", "Created Date"],
];
export const roleSearchFields = [
  { key: "roleName", label: "Role Name", type: "text" },
];
export const roles = build(8, () => ({
  roleName: pick(["Administrator", "Order Manager", "Inventory Manager", "Field Engineer", "Read Only", "NOC Operator"]),
  description: pick(["Full system access", "Order lifecycle management", "Inventory management", "Field task execution", "View only access"]),
  permissions: `${pad(Math.floor(rand() * 80) + 10, 2)} modules`,
  userCount: Math.floor(rand() * 30) + 1,
  createdDate: dateStr(-90),
}));

export const workgroupColumns = [
  ["name", "Workgroup Name"],
  ["type", "Type"],
  ["members", "Members", "num"],
  ["lead", "Team Lead"],
  ["region", "Region"],
  ["status", "Status", "status"],
];
export const workgroupSearchFields = [
  { key: "name", label: "Workgroup Name", type: "text" },
  { key: "type", label: "Type", type: "select", options: ["Access", "Core", "Field", "NOC"] },
  { key: "region", label: "Region", type: "text" },
];
export const workgroups = build(10, () => ({
  name: pick(["Access Team A", "Core Team B", "NOC North", "Field Ops South", "Provisioning Pool", "Repair Crew 3"]),
  type: pick(["Access", "Core", "Field", "NOC"]),
  members: Math.floor(rand() * 15) + 3,
  lead: pick(STAFF),
  region: pick(["North", "South", "East", "West"]),
  status: pick(["Active", "Active", "Inactive"]),
}));

/* ---------- ISAP ---------- */
export const assuranceColumns = [
  ["serviceId", "Service ID"],
  ["customer", "Customer"],
  ["kpi", "KPI"],
  ["score", "Score", "num"],
  ["status", "Status", "status"],
  ["lastChecked", "Last Checked"],
];
export const assuranceSearchFields = [
  { key: "serviceId", label: "Service ID", type: "text" },
  { key: "kpi", label: "KPI", type: "select", options: ["Availability", "Latency", "Throughput", "Jitter"] },
  { key: "status", label: "Status", type: "select", options: ["Healthy", "Degraded", "Critical"] },
];
export const assurance = build(14, () => ({
  serviceId: id("SVC"),
  customer: pick(["Acme Corp", "Skyline Ltd", "BlueWave Co", "M. Enterprises"]),
  kpi: pick(["Availability", "Latency", "Throughput", "Jitter"]),
  score: `${(rand() * 5).toFixed(2)} / 5`,
  status: pick(["Healthy", "Healthy", "Degraded", "Critical"]),
  lastChecked: dateStr(0),
}));

export const slaColumns = [
  ["slaName", "SLA Name"],
  ["target", "Target"],
  ["achieved", "Achieved"],
  ["compliance", "Compliance", "num"],
  ["status", "Status", "status"],
  ["period", "Period"],
];
export const slaSearchFields = [
  { key: "slaName", label: "SLA Name", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["Compliant", "Breached", "At Risk"] },
];
export const sla = build(10, () => ({
  slaName: pick(["Order Fulfillment", "Fault Resolution", "Activation", "Repair TAT"]),
  target: pick(["< 24h", "< 4h", "< 8h", "< 48h"]),
  achieved: `${(rand() * 48).toFixed(1)}h`,
  compliance: `${Math.floor(rand() * 30) + 70}%`,
  status: pick(["Compliant", "Compliant", "At Risk", "Breached"]),
  period: pick(["Monthly", "Quarterly"]),
}));

export const ticketColumns = [
  ["ticketId", "Ticket ID"],
  ["customer", "Customer"],
  ["category", "Category"],
  ["severity", "Severity", "severity"],
  ["status", "Status", "status"],
  ["openedDate", "Opened Date"],
  ["assignedTo", "Assigned To"],
];
export const ticketSearchFields = [
  { key: "ticketId", label: "Ticket ID", type: "text" },
  { key: "category", label: "Category", type: "select", options: ["Fault", "Billing", "Provisioning", "Quality"] },
  { key: "severity", label: "Severity", type: "select", options: ["Critical", "Major", "Minor"] },
  { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Resolved"] },
];
export const tickets = build(16, () => ({
  ticketId: id("TT"),
  customer: pick(["Acme Corp", "Skyline Ltd", "J. Fernandes", "BlueWave Co"]),
  category: pick(["Fault", "Billing", "Provisioning", "Quality"]),
  severity: pick(["Critical", "Major", "Minor"]),
  status: pick(["Open", "In Progress", "Resolved"]),
  openedDate: dateStr(0),
  assignedTo: pick(STAFF),
}));

/* ---------- IM: MAC / Migration ---------- */
export const macColumns = [
  ["deviceId", "Device ID"],
  ["deviceName", "Device Name"],
  ["currentMac", "Current MAC"],
  ["newMac", "New MAC"],
  ["area", "Area"],
  ["status", "Status", "status"],
  ["modifiedBy", "Modified By"],
];
export const macSearchFields = [
  { key: "deviceId", label: "Device ID", type: "text" },
  { key: "area", label: "Area", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["Pending", "Modified", "Failed"] },
];
const macAddr = () =>
  Array.from({ length: 6 }, () => pad(Math.floor(rand() * 256).toString(16), 2)).join(":").toUpperCase();
export const macRecords = build(12, () => ({
  deviceId: id("DEV"),
  deviceName: pick(["OLT-01", "ONT-22", "Switch-7", "Router-3", "DSLAM-9"]),
  currentMac: macAddr(),
  newMac: macAddr(),
  area: pick(AREAS),
  status: pick(["Pending", "Modified", "Failed"]),
  modifiedBy: pick(STAFF),
}));

export const migrationColumns = [
  ["migrationId", "Migration ID"],
  ["source", "Source"],
  ["target", "Target"],
  ["records", "Records", "num"],
  ["progress", "Progress", "progress"],
  ["status", "Status", "status"],
  ["scheduled", "Scheduled"],
];
export const migrationSearchFields = [
  { key: "migrationId", label: "Migration ID", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["Scheduled", "Running", "Completed", "Failed"] },
];
export const migrations = build(10, () => {
  const p = Math.floor(rand() * 101);
  return {
    migrationId: id("MIG"),
    source: pick(["Legacy OSS", "Old CRM", "Legacy DB", "v1 Portal"]),
    target: pick(["ZSMART OSS", "New CRM", "Cloud DB", "v2 Portal"]),
    records: Math.floor(rand() * 5000) + 100,
    progress: p,
    status: p === 100 ? "Completed" : p > 0 ? "Running" : pick(["Scheduled", "Failed"]),
    scheduled: dateStr(2),
  };
});

/* ---------- Resource Assign ---------- */
export const resourceOrderColumns = [
  ["orderId", "Resource Order ID"],
  ["resourceType", "Resource Type"],
  ["quantity", "Quantity", "num"],
  ["requestedBy", "Requested By"],
  ["status", "Status", "status"],
  ["createdDate", "Created Date"],
  ["area", "Area"],
];
export const resourceOrderSearchFields = [
  { key: "orderId", label: "Resource Order ID", type: "text" },
  { key: "resourceType", label: "Resource Type", type: "select", options: ["Port", "IP Address", "Number", "VLAN"] },
  { key: "status", label: "Status", type: "select", options: ["Pending", "Assigned", "Rejected"] },
];
export const resourceOrders = build(12, () => ({
  orderId: id("RO"),
  resourceType: pick(["Port", "IP Address", "Number", "VLAN"]),
  quantity: Math.floor(rand() * 20) + 1,
  requestedBy: pick(STAFF),
  status: pick(["Pending", "Assigned", "Rejected"]),
  createdDate: dateStr(0),
  area: pick(AREAS),
}));

export const resourceTaskColumns = [
  ["taskId", "Task ID"],
  ["orderId", "Order ID"],
  ["resourceType", "Resource Type"],
  ["assignedTo", "Assigned To"],
  ["status", "Status", "status"],
  ["dueDate", "Due Date"],
];
export const resourceTaskSearchFields = [
  { key: "taskId", label: "Task ID", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["Pending", "In Progress", "Completed"] },
];
export const resourceTasks = build(12, () => ({
  taskId: id("RT"),
  orderId: id("RO"),
  resourceType: pick(["Port", "IP Address", "Number", "VLAN"]),
  assignedTo: pick(STAFF),
  status: pick(["Pending", "In Progress", "Completed"]),
  dueDate: dateStr(1),
}));

/* ---------- WFM ---------- */
export const wfmTaskColumns = [
  ["taskId", "Task ID"],
  ["title", "Title"],
  ["type", "Type"],
  ["assignedTo", "Assigned To"],
  ["priority", "Priority", "priority"],
  ["status", "Status", "status"],
  ["dueDate", "Due Date"],
  ["location", "Location"],
];
export const wfmTaskSearchFields = [
  { key: "taskId", label: "Task ID", type: "text" },
  { key: "type", label: "Type", type: "select", options: ["Installation", "Repair", "Survey", "Maintenance"] },
  { key: "status", label: "Status", type: "select", options: ["Assigned", "In Progress", "Completed"] },
];
export const wfmTasks = build(18, () => ({
  taskId: id("WFM"),
  title: pick(["Fibre install", "ONT replace", "Line test", "Cable repair", "Site survey"]),
  type: pick(["Installation", "Repair", "Survey", "Maintenance"]),
  assignedTo: pick(STAFF),
  priority: pick(PRIORITIES),
  status: pick(["Assigned", "In Progress", "Completed"]),
  dueDate: dateStr(1),
  location: pick(AREAS),
}));

export const teamColumns = [
  ["teamName", "Team Name"],
  ["type", "Type"],
  ["members", "Members", "num"],
  ["lead", "Lead"],
  ["region", "Region"],
  ["activeTasks", "Active Tasks", "num"],
  ["status", "Status", "status"],
];
export const teamSearchFields = [
  { key: "teamName", label: "Team Name", type: "text" },
  { key: "region", label: "Region", type: "text" },
];
export const teams = build(10, () => ({
  teamName: pick(["Alpha Crew", "Bravo Crew", "Delta Squad", "Echo Team", "Foxtrot Crew"]),
  type: pick(["Fibre", "Copper", "Wireless", "Hybrid"]),
  members: Math.floor(rand() * 12) + 3,
  lead: pick(STAFF),
  region: pick(["North", "South", "East", "West"]),
  activeTasks: Math.floor(rand() * 25),
  status: pick(["Active", "Active", "Standby"]),
}));

/* ---------- OFM ---------- */
export const bsnlColumns = [
  ["requestId", "Request ID"],
  ["phoneNumber", "Phone Number"],
  ["requestType", "Request Type"],
  ["circle", "Circle"],
  ["status", "Status", "status"],
  ["requestedDate", "Requested Date"],
  ["sla", "SLA", "status"],
];
export const bsnlSearchFields = [
  { key: "requestId", label: "Request ID", type: "text" },
  { key: "phoneNumber", label: "Phone Number", type: "text" },
  { key: "requestType", label: "Request Type", type: "select", options: ["New", "Modify", "Cease", "Shift"] },
  { key: "status", label: "Status", type: "select", options: ["Pending", "Processing", "Completed", "Rejected"] },
];
const makeBsnl = (n, hist = false) =>
  build(n, () => ({
    requestId: id("BSNL"),
    phoneNumber: phone(),
    requestType: pick(["New", "Modify", "Cease", "Shift"]),
    circle: pick(["TN", "KA", "MH", "DL", "AP", "WB"]),
    status: hist ? pick(["Completed", "Completed", "Rejected"]) : pick(["Pending", "Processing", "Completed", "Rejected"]),
    requestedDate: dateStr(hist ? -30 : 0),
    sla: pick(["On Track", "At Risk", "Breached"]),
  }));
export const bsnlRequests = makeBsnl(16, false);
export const bsnlHistory = makeBsnl(16, true);

export const mplsColumns = [
  ["batchId", "Batch ID"],
  ["siteCount", "Sites", "num"],
  ["completed", "Completed", "num"],
  ["failed", "Failed", "num"],
  ["progress", "Progress", "progress"],
  ["status", "Status", "status"],
  ["startDate", "Start Date"],
];
export const mplsSearchFields = [
  { key: "batchId", label: "Batch ID", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["Running", "Completed", "Failed", "Queued"] },
];
export const mplsBatches = build(10, () => {
  const sites = Math.floor(rand() * 100) + 10;
  const completed = Math.floor(rand() * sites);
  const failed = Math.floor(rand() * (sites - completed));
  return {
    batchId: id("MPLS"),
    siteCount: sites,
    completed,
    failed,
    progress: Math.floor((completed / sites) * 100),
    status: completed === sites ? "Completed" : pick(["Running", "Queued", "Failed"]),
    startDate: dateStr(0),
  };
});

export const docketColumns = [
  ["docketId", "Docket ID"],
  ["entity", "Entity"],
  ["type", "Type"],
  ["pendingDays", "Pending Days", "num"],
  ["priority", "Priority", "priority"],
  ["status", "Status", "status"],
  ["lastAction", "Last Action"],
];
export const docketSearchFields = [
  { key: "docketId", label: "Docket ID", type: "text" },
  { key: "entity", label: "Entity", type: "select", options: ["BSNL", "Franchisee"] },
  { key: "status", label: "Status", type: "select", options: ["Open", "Follow-up", "Escalated"] },
];
export const dockets = build(12, () => ({
  docketId: id("DKT"),
  entity: pick(["BSNL", "Franchisee"]),
  type: pick(["Pending Request", "Document", "Payment", "Activation"]),
  pendingDays: Math.floor(rand() * 30) + 1,
  priority: pick(PRIORITIES),
  status: pick(["Open", "Follow-up", "Escalated"]),
  lastAction: dateStr(0),
}));

/* ---------- Fault Management ---------- */
export const alarmColumns = [
  ["alarmId", "Alarm ID"],
  ["device", "Device"],
  ["severity", "Severity", "severity"],
  ["description", "Description"],
  ["area", "Area"],
  ["raisedDate", "Raised Date"],
  ["acknowledged", "Acknowledged", "bool"],
  ["status", "Status", "status"],
];
export const alarmSearchFields = [
  { key: "alarmId", label: "Alarm ID", type: "text" },
  { key: "device", label: "Device", type: "text" },
  { key: "severity", label: "Severity", type: "select", options: ["Critical", "Major", "Minor", "Warning"] },
  { key: "status", label: "Status", type: "select", options: ["Active", "Cleared", "Suppressed"] },
];
export const alarms = build(20, () => ({
  alarmId: id("AL"),
  device: pick(["OLT-Chennai-1", "Router-DEL-3", "Switch-MUM-2", "DSLAM-KOL-5", "ONT-BLR-9"]),
  severity: pick(["Critical", "Major", "Minor", "Warning"]),
  description: pick(["Link down", "High CPU", "Power fault", "Signal loss", "Configuration error"]),
  area: pick(AREAS),
  raisedDate: dateStr(0),
  acknowledged: pick([true, false]),
  status: pick(["Active", "Active", "Cleared", "Suppressed"]),
}));

export const incidentColumns = [
  ["incidentId", "Incident ID"],
  ["title", "Title"],
  ["severity", "Severity", "severity"],
  ["affectedService", "Affected Service"],
  ["status", "Status", "status"],
  ["openedDate", "Opened Date"],
  ["assignedTo", "Assigned To"],
  ["sla", "SLA", "status"],
];
export const incidentSearchFields = [
  { key: "incidentId", label: "Incident ID", type: "text" },
  { key: "severity", label: "Severity", type: "select", options: ["Critical", "Major", "Minor"] },
  { key: "status", label: "Status", type: "select", options: ["Open", "Investigating", "Resolved"] },
];
export const incidents = build(12, () => ({
  incidentId: id("INC"),
  title: pick(["Massive fibre cut", "BGP flap", "Power outage", "Core congestion", "DNS failure"]),
  severity: pick(["Critical", "Major", "Minor"]),
  affectedService: pick(["Broadband", "Voice", "MPLS", "Leased Line"]),
  status: pick(["Open", "Investigating", "Resolved"]),
  openedDate: dateStr(0),
  assignedTo: pick(STAFF),
  sla: pick(["On Track", "At Risk", "Breached"]),
}));

/* ---------- Analytics ---------- */
export const auditColumns = [
  ["auditId", "Audit ID"],
  ["user", "User"],
  ["action", "Action"],
  ["module", "Module"],
  ["entity", "Entity"],
  ["timestamp", "Timestamp"],
  ["ip", "IP Address"],
];
export const auditSearchFields = [
  { key: "user", label: "User", type: "text" },
  { key: "action", label: "Action", type: "select", options: ["Create", "Update", "Delete", "Login", "Export"] },
  { key: "module", label: "Module", type: "text" },
];
export const audit = build(20, () => ({
  auditId: id("AUD"),
  user: pick(STAFF),
  action: pick(["Create", "Update", "Delete", "Login", "Export"]),
  module: pick(["Order Desk", "Inventory", "Users", "Alarms", "Reports"]),
  entity: orderNumber(),
  timestamp: dateStr(0),
  ip: `10.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
}));

/* ---------- Time-series for dashboards ---------- */
export const alarmTrend = Array.from({ length: 24 }, (_, h) => ({
  hour: `${pad(h, 2)}:00`,
  critical: Math.floor(rand() * 6),
  major: Math.floor(rand() * 12),
  minor: Math.floor(rand() * 20),
}));

export const orderTrend = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  orders: Math.floor(rand() * 200) + 80,
  exceptions: Math.floor(rand() * 30) + 5,
}));

export const slaTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  compliance: Math.floor(rand() * 15) + 84,
}));

export const inventoryTree = {
  name: "Network",
  children: [
    {
      name: "Access Network",
      children: [
        { name: "OLT", count: 42, severity: "ok" },
        { name: "ONT", count: 1850, severity: "ok" },
        { name: "DSLAM", count: 18, severity: "warning" },
      ],
    },
    {
      name: "Core Network",
      children: [
        { name: "Core Router", count: 6, severity: "ok" },
        { name: "Edge Router", count: 24, severity: "ok" },
        { name: "Core Switch", count: 12, severity: "critical" },
      ],
    },
    {
      name: "Transmission",
      children: [
        { name: "DWDM", count: 8, severity: "ok" },
        { name: "SDH", count: 14, severity: "warning" },
      ],
    },
  ],
};

/* ---------- Sidebar quick stats ---------- */
export const kpis = {
  openOrders: 1284,
  exceptions: 47,
  activeAlarms: 23,
  slaCompliance: 96.4,
  pendingTasks: 312,
  openIncidents: 9,
};

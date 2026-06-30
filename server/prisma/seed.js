import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED = {
  users: [
    { username: "admin", fullName: "Admin User", email: "admin@zsmart.tel", password: "password", role: "ADMINISTRATOR", workgroup: "NOC", status: "ACTIVE" },
    { username: "raghu", fullName: "Raghu Varma", email: "raghu@zsmart.tel", password: "password", role: "OPERATOR", workgroup: "Access Team", status: "ACTIVE" },
    { username: "anita", fullName: "Anita Sharma", email: "anita@zsmart.tel", password: "password", role: "ENGINEER", workgroup: "Core Team", status: "ACTIVE" },
    { username: "suresh", fullName: "Suresh Kumar", email: "suresh@zsmart.tel", password: "password", role: "OPERATOR", workgroup: "Field Ops", status: "ACTIVE" },
    { username: "megha", fullName: "Megha Patel", email: "megha@zsmart.tel", password: "password", role: "ENGINEER", workgroup: "NOC", status: "ACTIVE" },
    { username: "kiran", fullName: "Kiran Raj", email: "kiran@zsmart.tel", password: "password", role: "VIEWER", workgroup: "Access Team", status: "LOCKED" },
  ],
  roleModels: [
    { roleName: "Administrator", description: "Full system access", permissions: "99 modules", userCount: 2 },
    { roleName: "Order Manager", description: "Order lifecycle management", permissions: "12 modules", userCount: 5 },
    { roleName: "Inventory Manager", description: "Inventory management", permissions: "8 modules", userCount: 3 },
    { roleName: "Field Engineer", description: "Field task execution", permissions: "6 modules", userCount: 8 },
    { roleName: "NOC Operator", description: "Network operations", permissions: "10 modules", userCount: 4 },
    { roleName: "Viewer", description: "View only access", permissions: "2 modules", userCount: 6 },
  ],
  workgroups: [
    { name: "Access Team A", type: "ACCESS", members: 8, lead: "Raghu Varma", region: "NORTH", status: "ACTIVE" },
    { name: "Core Team B", type: "CORE", members: 6, lead: "Suresh Kumar", region: "SOUTH", status: "ACTIVE" },
    { name: "NOC North", type: "NOC", members: 12, lead: "Anita Sharma", region: "NORTH", status: "ACTIVE" },
    { name: "Field Ops South", type: "FIELD", members: 15, lead: "Kiran Raj", region: "SOUTH", status: "ACTIVE" },
    { name: "Provisioning Pool", type: "ACCESS", members: 5, lead: "Megha Patel", region: "EAST", status: "ACTIVE" },
    { name: "Repair Crew 3", type: "FIELD", members: 4, lead: "John D", region: "WEST", status: "INACTIVE" },
  ],
  orders: [
    { customerOrderNumber: "ON-2025-001", phoneNumber: "9876543210", cfsSpecifications: "FTTH Basic", cfsEvent: "New Connection", productEvent: "Broadband", area: "Chennai", orderStatus: "IN_PROGRESS", orderStatusDate: "2025-06-01", completeDate: "", priority: "HIGH", warningDate: "2025-06-05", timeoutDate: "2025-06-10" },
    { customerOrderNumber: "ON-2025-002", phoneNumber: "9876543211", cfsSpecifications: "Leased Line 10M", cfsEvent: "Upgrade", productEvent: "Leased Line", area: "Mumbai", orderStatus: "NORMAL", orderStatusDate: "2025-06-02", completeDate: "2025-06-04", priority: "STANDARD", warningDate: "", timeoutDate: "" },
    { customerOrderNumber: "ON-2025-003", phoneNumber: "9876543212", cfsSpecifications: "Voice POTS", cfsEvent: "New Connection", productEvent: "Voice", area: "Delhi", orderStatus: "PENDING", orderStatusDate: "2025-06-03", completeDate: "", priority: "CRITICAL", warningDate: "2025-06-04", timeoutDate: "2025-06-07" },
    { customerOrderNumber: "ON-2025-004", phoneNumber: "9876543213", cfsSpecifications: "FTTH Premium", cfsEvent: "Migration", productEvent: "Broadband", area: "Bangalore", orderStatus: "EXCEPTION", orderStatusDate: "2025-06-01", completeDate: "", priority: "HIGH", warningDate: "2025-06-03", timeoutDate: "2025-06-08" },
    { customerOrderNumber: "ON-2025-005", phoneNumber: "9876543214", cfsSpecifications: "VPN MPLS", cfsEvent: "New Connection", productEvent: "MPLS", area: "Kolkata", orderStatus: "FINISHED", orderStatusDate: "2025-05-28", completeDate: "2025-06-01", priority: "STANDARD", warningDate: "", timeoutDate: "" },
  ],
  exceptions: [
    { orderNumber: "ON-2025-004", phoneNumber: "9876543213", exceptionType: "Resource", severity: "CRITICAL", area: "Bangalore", raisedDate: "2025-06-01", slaBreach: true, assignedTo: "Anita Sharma", status: "PENDING", resolution: "" },
    { orderNumber: "ON-2025-001", phoneNumber: "9876543210", exceptionType: "Validation", severity: "MAJOR", area: "Chennai", raisedDate: "2025-06-02", slaBreach: false, assignedTo: "Raghu Varma", status: "PENDING", resolution: "Awaiting vendor confirmation" },
    { orderNumber: "ON-2025-006", phoneNumber: "9876543215", exceptionType: "Timeout", severity: "MINOR", area: "Mumbai", raisedDate: "2025-06-03", slaBreach: false, assignedTo: "Suresh Kumar", status: "NORMAL", resolution: "Resolved after retry" },
    { orderNumber: "ON-2025-007", phoneNumber: "9876543216", exceptionType: "System", severity: "MAJOR", area: "Delhi", raisedDate: "2025-06-03", slaBreach: true, assignedTo: "Megha Patel", status: "PENDING", resolution: "" },
  ],
  tasks: [
    { taskId: "TSK-001", orderNumber: "ON-2025-001", taskType: "Provisioning", workgroup: "Access Team", assignedTo: "Raghu Varma", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2025-06-05", area: "Chennai" },
    { taskId: "TSK-002", orderNumber: "ON-2025-002", taskType: "Installation", workgroup: "Core Team", assignedTo: "Suresh Kumar", status: "COMPLETED", priority: "STANDARD", dueDate: "2025-06-03", area: "Mumbai" },
    { taskId: "TSK-003", orderNumber: "ON-2025-003", taskType: "Activation", workgroup: "NOC", assignedTo: "Anita Sharma", status: "PENDING", priority: "CRITICAL", dueDate: "2025-06-06", area: "Delhi" },
    { taskId: "TSK-004", orderNumber: "ON-2025-004", taskType: "Survey", workgroup: "Field Ops", assignedTo: "Kiran Raj", status: "PENDING", priority: "HIGH", dueDate: "2025-06-04", area: "Bangalore" },
  ],
  serviceInstances: [
    { serviceId: "SVC-001", customerName: "Acme Corp", serviceType: "Broadband", phoneNumber: "9876543210", status: "ACTIVE", activatedDate: "2025-01-15", area: "Chennai" },
    { serviceId: "SVC-002", customerName: "Skyline Ltd", serviceType: "Leased Line", phoneNumber: "9876543211", status: "ACTIVE", activatedDate: "2025-02-20", area: "Mumbai" },
    { serviceId: "SVC-003", customerName: "J. Fernandes", serviceType: "Voice", phoneNumber: "9876543212", status: "ACTIVE", activatedDate: "2025-03-10", area: "Delhi" },
    { serviceId: "SVC-004", customerName: "BlueWave Co", serviceType: "IPTV", phoneNumber: "9876543213", status: "INACTIVE", activatedDate: "2025-04-01", area: "Bangalore" },
    { serviceId: "SVC-005", customerName: "M. Enterprises", serviceType: "Broadband", phoneNumber: "9876543214", status: "INACTIVE", activatedDate: "2025-01-05", area: "Kolkata" },
  ],
  assurances: [
    { serviceId: "SVC-001", customer: "Acme Corp", kpi: "Availability", score: "4.8 / 5", status: "NORMAL", lastChecked: "2025-06-01" },
    { serviceId: "SVC-002", customer: "Skyline Ltd", kpi: "Latency", score: "3.2 / 5", status: "EXCEPTION", lastChecked: "2025-06-01" },
    { serviceId: "SVC-003", customer: "J. Fernandes", kpi: "Throughput", score: "4.5 / 5", status: "NORMAL", lastChecked: "2025-06-02" },
    { serviceId: "SVC-004", customer: "BlueWave Co", kpi: "Jitter", score: "2.1 / 5", status: "PENDING", lastChecked: "2025-06-02" },
    { serviceId: "SVC-005", customer: "M. Enterprises", kpi: "Availability", score: "5.0 / 5", status: "NORMAL", lastChecked: "2025-06-03" },
  ],
  slas: [
    { slaName: "Order Fulfillment", target: "< 24h", achieved: "18.5h", compliance: "94.2%", status: "COMPLIANT", period: "Monthly" },
    { slaName: "Fault Resolution", target: "< 4h", achieved: "3.2h", compliance: "97.8%", status: "COMPLIANT", period: "Monthly" },
    { slaName: "Activation", target: "< 8h", achieved: "12.1h", compliance: "82.5%", status: "AT_RISK", period: "Monthly" },
    { slaName: "Repair TAT", target: "< 48h", achieved: "52.3h", compliance: "76.1%", status: "BREACHED", period: "Quarterly" },
  ],
  tickets: [
    { ticketId: "TT-001", customer: "Acme Corp", category: "Fault", severity: "CRITICAL", status: "OPEN", openedDate: "2025-06-01", assignedTo: "Anita Sharma" },
    { ticketId: "TT-002", customer: "Skyline Ltd", category: "Billing", severity: "MINOR", status: "IN_PROGRESS", openedDate: "2025-05-30", assignedTo: "Raghu Varma" },
    { ticketId: "TT-003", customer: "J. Fernandes", category: "Provisioning", severity: "MAJOR", status: "OPEN", openedDate: "2025-06-02", assignedTo: "Suresh Kumar" },
    { ticketId: "TT-004", customer: "BlueWave Co", category: "Quality", severity: "MINOR", status: "RESOLVED", openedDate: "2025-05-28", assignedTo: "Megha Patel" },
    { ticketId: "TT-005", customer: "M. Enterprises", category: "Fault", severity: "MAJOR", status: "IN_PROGRESS", openedDate: "2025-06-01", assignedTo: "Kiran Raj" },
  ],
  macRecords: [
    { deviceId: "DEV-001", deviceName: "OLT-01", currentMac: "00:1A:2B:3C:4D:5E", newMac: "00:1A:2B:3C:4D:5F", area: "Chennai", status: "PENDING", modifiedBy: "Raghu Varma" },
    { deviceId: "DEV-002", deviceName: "ONT-22", currentMac: "AA:BB:CC:DD:EE:01", newMac: "AA:BB:CC:DD:EE:02", area: "Mumbai", status: "NORMAL", modifiedBy: "Suresh Kumar" },
    { deviceId: "DEV-003", deviceName: "Switch-7", currentMac: "11:22:33:44:55:66", newMac: "11:22:33:44:55:67", area: "Delhi", status: "PENDING", modifiedBy: "Anita Sharma" },
    { deviceId: "DEV-004", deviceName: "Router-3", currentMac: "AB:CD:EF:01:23:45", newMac: "AB:CD:EF:01:23:46", area: "Bangalore", status: "NORMAL", modifiedBy: "Megha Patel" },
  ],
  migrations: [
    { migrationId: "MIG-001", source: "Legacy OSS", target: "ZSMART OSS", records: 4500, progress: 100, status: "FINISHED", scheduled: "2025-05-01" },
    { migrationId: "MIG-002", source: "Old CRM", target: "New CRM", records: 12000, progress: 65, status: "IN_PROGRESS", scheduled: "2025-06-01" },
    { migrationId: "MIG-003", source: "Legacy DB", target: "Cloud DB", records: 3000, progress: 0, status: "PENDING", scheduled: "2025-07-01" },
  ],
  resourceOrders: [
    { orderId: "RO-001", resourceType: "Port", quantity: 10, requestedBy: "Raghu Varma", status: "PENDING", createdDate: "2025-06-01", area: "Chennai" },
    { orderId: "RO-002", resourceType: "IP Address", quantity: 50, requestedBy: "Anita Sharma", status: "NORMAL", createdDate: "2025-05-30", area: "Mumbai" },
    { orderId: "RO-003", resourceType: "Number", quantity: 25, requestedBy: "Suresh Kumar", status: "PENDING", createdDate: "2025-06-02", area: "Delhi" },
    { orderId: "RO-004", resourceType: "VLAN", quantity: 5, requestedBy: "Megha Patel", status: "NORMAL", createdDate: "2025-06-01", area: "Bangalore" },
  ],
  resourceTasks: [
    { taskId: "RT-001", orderId: "RO-001", resourceType: "Port", assignedTo: "Raghu Varma", status: "IN_PROGRESS", dueDate: "2025-06-05" },
    { taskId: "RT-002", orderId: "RO-002", resourceType: "IP Address", assignedTo: "Anita Sharma", status: "COMPLETED", dueDate: "2025-06-02" },
    { taskId: "RT-003", orderId: "RO-003", resourceType: "Number", assignedTo: "Suresh Kumar", status: "PENDING", dueDate: "2025-06-06" },
  ],
  wfmTasks: [
    { taskId: "WFM-001", title: "Fibre install", type: "Installation", assignedTo: "Raghu Varma", priority: "HIGH", status: "IN_PROGRESS", dueDate: "2025-06-05", location: "Chennai" },
    { taskId: "WFM-002", title: "ONT replace", type: "Repair", assignedTo: "Suresh Kumar", priority: "CRITICAL", status: "PENDING", dueDate: "2025-06-03", location: "Mumbai" },
    { taskId: "WFM-003", title: "Line test", type: "Survey", assignedTo: "Kiran Raj", priority: "STANDARD", status: "COMPLETED", dueDate: "2025-06-01", location: "Delhi" },
    { taskId: "WFM-004", title: "Cable repair", type: "Maintenance", assignedTo: "Megha Patel", priority: "LOW", status: "PENDING", dueDate: "2025-06-10", location: "Bangalore" },
    { taskId: "WFM-005", title: "Site survey", type: "Survey", assignedTo: "Raghu Varma", priority: "STANDARD", status: "PENDING", dueDate: "2025-06-07", location: "Kolkata" },
  ],
  teams: [
    { teamName: "Alpha Crew", type: "Fibre", members: 6, lead: "Raghu Varma", region: "NORTH", activeTasks: 8, status: "ACTIVE" },
    { teamName: "Bravo Crew", type: "Copper", members: 8, lead: "Suresh Kumar", region: "SOUTH", activeTasks: 12, status: "ACTIVE" },
    { teamName: "Delta Squad", type: "Wireless", members: 5, lead: "Anita Sharma", region: "EAST", activeTasks: 3, status: "ACTIVE" },
    { teamName: "Echo Team", type: "Hybrid", members: 10, lead: "Megha Patel", region: "WEST", activeTasks: 15, status: "ACTIVE" },
    { teamName: "Foxtrot Crew", type: "Fibre", members: 4, lead: "Kiran Raj", region: "NORTH", activeTasks: 0, status: "ACTIVE" },
  ],
  bsnlRequests: [
    { requestId: "BSNL-001", phoneNumber: "9876543210", requestType: "New", circle: "TN", status: "PENDING", requestedDate: "2025-06-01", sla: "ON_TRACK", isHistory: false },
    { requestId: "BSNL-002", phoneNumber: "9876543211", requestType: "Modify", circle: "KA", status: "IN_PROGRESS", requestedDate: "2025-06-02", sla: "ON_TRACK", isHistory: false },
    { requestId: "BSNL-003", phoneNumber: "9876543212", requestType: "Cease", circle: "MH", status: "COMPLETED", requestedDate: "2025-05-30", sla: "COMPLIANT", isHistory: false },
    { requestId: "BSNL-004", phoneNumber: "9876543213", requestType: "Shift", circle: "DL", status: "PENDING", requestedDate: "2025-06-03", sla: "AT_RISK", isHistory: false },
    { requestId: "BSNL-005", phoneNumber: "9876543214", requestType: "New", circle: "AP", status: "EXCEPTION", requestedDate: "2025-06-04", sla: "BREACHED", isHistory: false },
  ],
  mplsBatches: [
    { batchId: "MPLS-001", siteCount: 50, completed: 50, failed: 0, progress: 100, status: "FINISHED", startDate: "2025-05-01" },
    { batchId: "MPLS-002", siteCount: 120, completed: 78, failed: 5, progress: 65, status: "IN_PROGRESS", startDate: "2025-06-01" },
    { batchId: "MPLS-003", siteCount: 30, completed: 0, failed: 0, progress: 0, status: "PENDING", startDate: "2025-07-01" },
    { batchId: "MPLS-004", siteCount: 75, completed: 30, failed: 12, progress: 40, status: "EXCEPTION", startDate: "2025-06-05" },
  ],
  dockets: [
    { docketId: "DKT-001", entity: "BSNL", type: "Pending Request", pendingDays: 15, priority: "CRITICAL", status: "PENDING", lastAction: "2025-06-01" },
    { docketId: "DKT-002", entity: "Franchisee", type: "Document", pendingDays: 5, priority: "HIGH", status: "NORMAL", lastAction: "2025-06-02" },
    { docketId: "DKT-003", entity: "BSNL", type: "Payment", pendingDays: 28, priority: "STANDARD", status: "PENDING", lastAction: "2025-06-01" },
    { docketId: "DKT-004", entity: "Franchisee", type: "Activation", pendingDays: 3, priority: "LOW", status: "NORMAL", lastAction: "2025-06-03" },
  ],
  alarms: [
    { alarmId: "AL-001", device: "OLT-Chennai-1", severity: "CRITICAL", description: "Link down", area: "Chennai", raisedDate: "2025-06-01", acknowledged: false, status: "ACTIVE" },
    { alarmId: "AL-002", device: "Router-DEL-3", severity: "MAJOR", description: "High CPU", area: "Delhi", raisedDate: "2025-06-02", acknowledged: true, status: "ACTIVE" },
    { alarmId: "AL-003", device: "Switch-MUM-2", severity: "MINOR", description: "Power fault", area: "Mumbai", raisedDate: "2025-06-01", acknowledged: true, status: "CLEARED" },
    { alarmId: "AL-004", device: "DSLAM-KOL-5", severity: "WARNING", description: "Signal loss", area: "Kolkata", raisedDate: "2025-06-03", acknowledged: false, status: "ACTIVE" },
    { alarmId: "AL-005", device: "ONT-BLR-9", severity: "CRITICAL", description: "Configuration error", area: "Bangalore", raisedDate: "2025-06-03", acknowledged: false, status: "ACTIVE" },
    { alarmId: "AL-006", device: "OLT-Chennai-2", severity: "MINOR", description: "Link down", area: "Chennai", raisedDate: "2025-06-02", acknowledged: true, status: "SUPPRESSED" },
  ],
  incidents: [
    { incidentId: "INC-001", title: "Massive fibre cut", severity: "CRITICAL", affectedService: "Broadband", status: "PENDING", openedDate: "2025-06-01", assignedTo: "Anita Sharma", sla: "AT_RISK" },
    { incidentId: "INC-002", title: "BGP flap", severity: "MAJOR", affectedService: "MPLS", status: "NORMAL", openedDate: "2025-06-01", assignedTo: "Raghu Varma", sla: "ON_TRACK" },
    { incidentId: "INC-003", title: "Power outage", severity: "CRITICAL", affectedService: "Voice", status: "PENDING", openedDate: "2025-06-02", assignedTo: "Suresh Kumar", sla: "BREACHED" },
    { incidentId: "INC-004", title: "Core congestion", severity: "MINOR", affectedService: "Leased Line", status: "FINISHED", openedDate: "2025-05-30", assignedTo: "Megha Patel", sla: "COMPLIANT" },
  ],
  auditLogs: [
    { auditId: "AUD-001", user: "admin", action: "Login", module: "Auth", entity: "Session", timestamp: "2025-06-01T08:00:00Z", ip: "10.0.0.1" },
    { auditId: "AUD-002", user: "raghu", action: "Create", module: "Order Desk", entity: "ON-2025-001", timestamp: "2025-06-01T09:15:00Z", ip: "10.0.0.2" },
    { auditId: "AUD-003", user: "anita", action: "Update", module: "Inventory", entity: "DEV-001", timestamp: "2025-06-01T10:30:00Z", ip: "10.0.0.3" },
    { auditId: "AUD-004", user: "admin", action: "Delete", module: "Users", entity: "olduser01", timestamp: "2025-06-02T08:00:00Z", ip: "10.0.0.1" },
    { auditId: "AUD-005", user: "suresh", action: "Export", module: "Reports", entity: "SLA_Report_June", timestamp: "2025-06-02T14:00:00Z", ip: "10.0.0.4" },
  ],
};

async function main() {
  console.log("Seeding ZSMART OSS database...");

  const hash = await bcrypt.hash("password", 10);

  for (const u of SEED.users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { ...u, password: hash },
    });
  }
  console.log(`  ✓ ${SEED.users.length} users`);

  for (const r of SEED.roleModels) {
    await prisma.roleModel.upsert({
      where: { roleName: r.roleName },
      update: {},
      create: r,
    });
  }
  console.log(`  ✓ ${SEED.roleModels.length} roles`);

  for (const w of SEED.workgroups) {
    await prisma.workgroup.upsert({
      where: { name: w.name },
      update: {},
      create: w,
    });
  }
  console.log(`  ✓ ${SEED.workgroups.length} workgroups`);

  for (const o of SEED.orders) {
    await prisma.order.upsert({
      where: { customerOrderNumber: o.customerOrderNumber },
      update: {},
      create: o,
    });
  }
  console.log(`  ✓ ${SEED.orders.length} orders`);

  for (const e of SEED.exceptions) {
    await prisma.exceptionRecord.create({ data: e });
  }
  console.log(`  ✓ ${SEED.exceptions.length} exceptions`);

  for (const t of SEED.tasks) {
    await prisma.task.upsert({
      where: { taskId: t.taskId },
      update: {},
      create: t,
    });
  }
  console.log(`  ✓ ${SEED.tasks.length} tasks`);

  for (const s of SEED.serviceInstances) {
    await prisma.serviceInstance.upsert({
      where: { serviceId: s.serviceId },
      update: {},
      create: s,
    });
  }
  console.log(`  ✓ ${SEED.serviceInstances.length} services`);

  for (const a of SEED.assurances) {
    await prisma.assurance.create({ data: a });
  }
  console.log(`  ✓ ${SEED.assurances.length} assurances`);

  for (const s of SEED.slas) {
    await prisma.sla.create({ data: s });
  }
  console.log(`  ✓ ${SEED.slas.length} SLAs`);

  for (const t of SEED.tickets) {
    await prisma.ticket.upsert({
      where: { ticketId: t.ticketId },
      update: {},
      create: t,
    });
  }
  console.log(`  ✓ ${SEED.tickets.length} tickets`);

  for (const m of SEED.macRecords) {
    await prisma.macRecord.create({ data: m });
  }
  console.log(`  ✓ ${SEED.macRecords.length} MAC records`);

  for (const m of SEED.migrations) {
    await prisma.migration.upsert({
      where: { migrationId: m.migrationId },
      update: {},
      create: m,
    });
  }
  console.log(`  ✓ ${SEED.migrations.length} migrations`);

  for (const r of SEED.resourceOrders) {
    await prisma.resourceOrder.upsert({
      where: { orderId: r.orderId },
      update: {},
      create: r,
    });
  }
  console.log(`  ✓ ${SEED.resourceOrders.length} resource orders`);

  for (const t of SEED.resourceTasks) {
    await prisma.resourceTask.upsert({
      where: { taskId: t.taskId },
      update: {},
      create: t,
    });
  }
  console.log(`  ✓ ${SEED.resourceTasks.length} resource tasks`);

  for (const w of SEED.wfmTasks) {
    await prisma.wfmTask.upsert({
      where: { taskId: w.taskId },
      update: {},
      create: w,
    });
  }
  console.log(`  ✓ ${SEED.wfmTasks.length} WFM tasks`);

  for (const t of SEED.teams) {
    await prisma.team.upsert({
      where: { teamName: t.teamName },
      update: {},
      create: t,
    });
  }
  console.log(`  ✓ ${SEED.teams.length} teams`);

  for (const b of SEED.bsnlRequests) {
    await prisma.bsnlRequest.create({ data: b });
  }
  console.log(`  ✓ ${SEED.bsnlRequests.length} BSNL requests`);

  for (const m of SEED.mplsBatches) {
    await prisma.mplsBatch.upsert({
      where: { batchId: m.batchId },
      update: {},
      create: m,
    });
  }
  console.log(`  ✓ ${SEED.mplsBatches.length} MPLS batches`);

  for (const d of SEED.dockets) {
    await prisma.docket.upsert({
      where: { docketId: d.docketId },
      update: {},
      create: d,
    });
  }
  console.log(`  ✓ ${SEED.dockets.length} dockets`);

  for (const a of SEED.alarms) {
    await prisma.alarm.upsert({
      where: { alarmId: a.alarmId },
      update: {},
      create: a,
    });
  }
  console.log(`  ✓ ${SEED.alarms.length} alarms`);

  for (const i of SEED.incidents) {
    await prisma.incident.upsert({
      where: { incidentId: i.incidentId },
      update: {},
      create: i,
    });
  }
  console.log(`  ✓ ${SEED.incidents.length} incidents`);

  for (const a of SEED.auditLogs) {
    await prisma.auditLog.upsert({
      where: { auditId: a.auditId },
      update: {},
      create: a,
    });
  }
  console.log(`  ✓ ${SEED.auditLogs.length} audit logs`);

  console.log("\n✅ Seed complete! All 22 tables populated.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

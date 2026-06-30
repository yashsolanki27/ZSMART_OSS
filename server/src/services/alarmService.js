import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.alarm.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.alarm.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function listBySeverity() {
  const alarms = await prisma.alarm.groupBy({
    by: ["severity"],
    _count: { severity: true },
  });
  return alarms.map((a) => ({ severity: a.severity, count: a._count.severity }));
}

export async function create(data) {
  return prisma.alarm.create({ data });
}

export async function getById(id) {
  return prisma.alarm.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.alarm.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.alarm.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.alarmId) where.alarmId = { contains: filter.alarmId, mode: "insensitive" };
  if (filter.device) where.device = { contains: filter.device, mode: "insensitive" };
  if (filter.severity) where.severity = filter.severity;
  if (filter.status) where.status = filter.status;
  return where;
}

import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.incident.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.incident.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.incident.create({ data });
}

export async function getById(id) {
  return prisma.incident.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.incident.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.incident.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.incidentId) where.incidentId = { contains: filter.incidentId, mode: "insensitive" };
  if (filter.title) where.title = { contains: filter.title, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  if (filter.severity) where.severity = filter.severity;
  return where;
}

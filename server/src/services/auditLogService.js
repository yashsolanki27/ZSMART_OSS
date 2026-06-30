import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "desc" } }),
    prisma.auditLog.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.auditLog.create({ data });
}

export async function getById(id) {
  return prisma.auditLog.findUnique({ where: { id } });
}

export async function remove(id) {
  return prisma.auditLog.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.user) where.user = { contains: filter.user, mode: "insensitive" };
  if (filter.action) where.action = { contains: filter.action, mode: "insensitive" };
  if (filter.module) where.module = { contains: filter.module, mode: "insensitive" };
  return where;
}

import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.sla.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.sla.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.sla.create({ data });
}

export async function getById(id) {
  return prisma.sla.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.sla.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.sla.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.slaName) where.slaName = { contains: filter.slaName, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

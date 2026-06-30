import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.resourceOrder.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.resourceOrder.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.resourceOrder.create({ data });
}

export async function getById(id) {
  return prisma.resourceOrder.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.resourceOrder.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.resourceOrder.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.orderId) where.orderId = { contains: filter.orderId, mode: "insensitive" };
  if (filter.resourceType) where.resourceType = { contains: filter.resourceType, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

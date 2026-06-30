import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.serviceInstance.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.serviceInstance.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.serviceInstance.create({ data });
}

export async function getById(id) {
  return prisma.serviceInstance.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.serviceInstance.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.serviceInstance.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.serviceId) where.serviceId = { contains: filter.serviceId, mode: "insensitive" };
  if (filter.customerName) where.customerName = { contains: filter.customerName, mode: "insensitive" };
  if (filter.serviceType) where.serviceType = { contains: filter.serviceType, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

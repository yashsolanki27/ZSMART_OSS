import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.assurance.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.assurance.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.assurance.create({ data });
}

export async function getById(id) {
  return prisma.assurance.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.assurance.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.assurance.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.serviceId) where.serviceId = { contains: filter.serviceId, mode: "insensitive" };
  if (filter.customer) where.customer = { contains: filter.customer, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

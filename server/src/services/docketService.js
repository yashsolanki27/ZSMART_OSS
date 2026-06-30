import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.docket.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.docket.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.docket.create({ data });
}

export async function getById(id) {
  return prisma.docket.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.docket.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.docket.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.docketId) where.docketId = { contains: filter.docketId, mode: "insensitive" };
  if (filter.entity) where.entity = { contains: filter.entity, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

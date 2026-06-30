import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.mplsBatch.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.mplsBatch.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.mplsBatch.create({ data });
}

export async function getById(id) {
  return prisma.mplsBatch.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.mplsBatch.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.mplsBatch.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.batchId) where.batchId = { contains: filter.batchId, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

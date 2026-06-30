import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.migration.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.migration.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.migration.create({ data });
}

export async function getById(id) {
  return prisma.migration.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.migration.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.migration.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.migrationId) where.migrationId = { contains: filter.migrationId, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

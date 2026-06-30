import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.resourceTask.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.resourceTask.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.resourceTask.create({ data });
}

export async function getById(id) {
  return prisma.resourceTask.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.resourceTask.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.resourceTask.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.taskId) where.taskId = { contains: filter.taskId, mode: "insensitive" };
  if (filter.resourceType) where.resourceType = { contains: filter.resourceType, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

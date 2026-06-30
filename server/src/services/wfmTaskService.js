import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.wfmTask.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.wfmTask.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.wfmTask.create({ data });
}

export async function getById(id) {
  return prisma.wfmTask.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.wfmTask.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.wfmTask.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.taskId) where.taskId = { contains: filter.taskId, mode: "insensitive" };
  if (filter.title) where.title = { contains: filter.title, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  if (filter.priority) where.priority = filter.priority;
  return where;
}

import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.task.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.task.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.task.create({ data });
}

export async function getById(id) {
  return prisma.task.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.task.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.task.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.taskId) where.taskId = { contains: filter.taskId, mode: "insensitive" };
  if (filter.taskType) where.taskType = { contains: filter.taskType, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  if (filter.workgroup) where.workgroup = { contains: filter.workgroup, mode: "insensitive" };
  return where;
}

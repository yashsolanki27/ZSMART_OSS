import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.roleModel.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.roleModel.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.roleModel.create({ data });
}

export async function getById(id) {
  return prisma.roleModel.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.roleModel.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.roleModel.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.roleName) where.roleName = { contains: filter.roleName, mode: "insensitive" };
  return where;
}

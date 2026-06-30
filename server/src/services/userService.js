import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.user.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.user.create({ data });
}

export async function getById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.user.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.username) where.username = { contains: filter.username, mode: "insensitive" };
  if (filter.fullName) where.fullName = { contains: filter.fullName, mode: "insensitive" };
  if (filter.email) where.email = { contains: filter.email, mode: "insensitive" };
  if (filter.role) where.role = filter.role;
  if (filter.status) where.status = filter.status;
  return where;
}

import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.workgroup.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.workgroup.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.workgroup.create({ data });
}

export async function getById(id) {
  return prisma.workgroup.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.workgroup.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.workgroup.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.name) where.name = { contains: filter.name, mode: "insensitive" };
  if (filter.type) where.type = filter.type;
  if (filter.region) where.region = { contains: filter.region, mode: "insensitive" };
  return where;
}

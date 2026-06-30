import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.team.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.team.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.team.create({ data });
}

export async function getById(id) {
  return prisma.team.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.team.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.team.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.teamName) where.teamName = { contains: filter.teamName, mode: "insensitive" };
  if (filter.type) where.type = { contains: filter.type, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  if (filter.region) where.region = filter.region;
  return where;
}

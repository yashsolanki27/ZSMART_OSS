import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.bsnlRequest.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.bsnlRequest.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.bsnlRequest.create({ data });
}

export async function getById(id) {
  return prisma.bsnlRequest.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.bsnlRequest.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.bsnlRequest.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.requestId) where.requestId = { contains: filter.requestId, mode: "insensitive" };
  if (filter.requestType) where.requestType = { contains: filter.requestType, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

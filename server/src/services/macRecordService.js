import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.macRecord.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.macRecord.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.macRecord.create({ data });
}

export async function getById(id) {
  return prisma.macRecord.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.macRecord.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.macRecord.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.deviceId) where.deviceId = { contains: filter.deviceId, mode: "insensitive" };
  if (filter.deviceName) where.deviceName = { contains: filter.deviceName, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  return where;
}

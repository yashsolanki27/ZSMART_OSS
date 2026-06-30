import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.exceptionRecord.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.exceptionRecord.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.exceptionRecord.create({ data });
}

export async function getById(id) {
  return prisma.exceptionRecord.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.exceptionRecord.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.exceptionRecord.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.orderNumber) where.orderNumber = { contains: filter.orderNumber, mode: "insensitive" };
  if (filter.phoneNumber) where.phoneNumber = { contains: filter.phoneNumber, mode: "insensitive" };
  if (filter.exceptionType) where.exceptionType = { contains: filter.exceptionType, mode: "insensitive" };
  if (filter.severity) where.severity = filter.severity;
  if (filter.status) where.status = filter.status;
  return where;
}

import { prisma } from "../prismaClient.js";

export async function list({ filter = {}, page = 1, limit = 20 }) {
  const where = buildWhere(filter);
  const [items, total] = await prisma.$transaction([
    prisma.ticket.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.ticket.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function create(data) {
  return prisma.ticket.create({ data });
}

export async function getById(id) {
  return prisma.ticket.findUnique({ where: { id } });
}

export async function update(id, data) {
  return prisma.ticket.update({ where: { id }, data });
}

export async function remove(id) {
  return prisma.ticket.delete({ where: { id } });
}

function buildWhere(filter) {
  const where = {};
  if (filter.ticketId) where.ticketId = { contains: filter.ticketId, mode: "insensitive" };
  if (filter.customer) where.customer = { contains: filter.customer, mode: "insensitive" };
  if (filter.status) where.status = filter.status;
  if (filter.severity) where.severity = filter.severity;
  return where;
}

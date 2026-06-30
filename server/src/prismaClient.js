/**
 * Prisma client singleton.
 * Prevents nodemon hot-reload from spawning multiple PrismaClient instances
 * (which exhausts the PostgreSQL connection pool in dev). See
 * SKILLS/prisma-postgres-setup.md for rationale.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

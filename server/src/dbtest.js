import { prisma } from "./prismaClient.js";

// Quick DB connectivity probe for Step 2.3.
const r = await prisma.$queryRaw`SELECT current_database() AS db`;
console.log("CONNECTED to:", r[0].db);
await prisma.$disconnect();

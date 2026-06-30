# Skill: Prisma + PostgreSQL Setup (ZSMART OSS Backend)

## Problem
Wire a Node.js/Express backend to PostgreSQL with a typed schema, migrations,
and seed data.

## Solution
```bash
cd server
npm install @prisma/client && npm install -D prisma
npx prisma init   # creates prisma/schema.prisma + .env
```

`prisma/schema.prisma`:
```prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  email     String   @unique
  role      Role     @default(VIEWER)
  createdAt DateTime @default(now())
}
enum Role { ADMINISTRATOR OPERATOR ENGINEER VIEWER }
```

`server/src/prismaClient.js` (singleton — prevents hot-reload connection storms):
```js
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Workflow:
```bash
npx prisma migrate dev --name init   # create + apply migration
npx prisma generate                  # regenerate client after schema change
node prisma/seed.js                  # load sample data
npx prisma studio                    # visual DB browser (optional)
```

## Gotchas
- **DATABASE_URL must use `postgresql://`** (not `postgres://`) for Prisma 5+.
- **Singleton the client** in dev or nodemon spawns a new PrismaClient every
  reload → "too many connections".
- **`.env` is gitignored** — ship `.env.example` with placeholder values.
- Run `prisma generate` after EVERY schema change, or the client won't know new fields.
- On Windows, `npx prisma migrate` needs a running Postgres; if DB doesn't exist,
  create it first: `CREATE DATABASE zsmart_oss;`
- Keep enums in sync between Prisma schema and frontend StatusBadge expectations.

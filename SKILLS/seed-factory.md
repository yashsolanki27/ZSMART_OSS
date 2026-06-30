# Skill: Seed Factory — Generate Realistic Telecom Seed Data

## Problem
Need to populate 22 Prisma models with realistic telecom data. Mock data exists in frontend but needs to be moved to seed.js.

## Solution
Use Gemini 2.5 Flash (250K TPM free) to generate the entire seed.js in one shot.

## Template

```text
Generate a Prisma seed file at server/prisma/seed.js that populates all 22 models with realistic telecom OSS data.

Context:
- ES module: import { PrismaClient } from "@prisma/client"
- Read schema from server/prisma/schema.prisma (attached below)
- Read mock data patterns from client/src/data/mock/index.js (attached below)

Requirements:
1. Create 10-20 realistic records per model
2. Use Indian telecom names, areas (Chennai, Delhi, Mumbai, Kolkata, Bangalore)
3. Staff names: Raghu, Anita, Suresh, Megha, Kiran, Divya, Priya, Arun
4. Passwords must be bcrypt hashed: await bcrypt.hash("password123", 10)
5. Dates as ISO strings (use new Date() relative to now)
6. AuditLog must reference valid User IDs
7. Create admin user: admin / password123 with ADMINISTRATOR role
8. Wrap in async main() → prisma.$disconnect()
9. Use upsert or deleteMany before insert for idempotency

Output the COMPLETE prisma/seed.js file.

Schema:
```prisma
[paste schema.prisma]
```

Mock Data Reference:
```js
[paste mock/index.js columns and searchFields — not the row generators]
```

Tips:
- For enum fields, use SAME values as frontend StatusBadge expects (e.g. "ACTIVE" not "Active")
- Create related data in order: User → Workgroup → Role → Order → Alarm → etc.
- Default admin: username=admin, password=password123, role=ADMINISTRATOR
```

## Gotchas
- Seed file MUST match Prisma enum values EXACTLY. If schema says `ACTIVE`, use `"ACTIVE"` not `"Active"`.
- Date fields — Prisma accepts ISO strings for DateTime fields.
- bcrypt import: `import bcrypt from "bcryptjs"` (already in package.json).
- Test with `node prisma/seed.js` — if it fails, fix enumerations first.

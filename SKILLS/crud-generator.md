# Skill: CRUD Generator — One-Shot Route + Controller + Service

## Problem
Need to generate a complete 3-file CRUD (route + controller + service) from a Prisma model in ONE prompt.

## Template Prompt

```text
Generate a complete 3-file CRUD for Prisma model [MODEL_NAME].

Context:
- ES modules (import/export)
- Express 4.x
- Prisma ORM with @prisma/client
- Pattern: routes → controllers → services (see SKILLS/express-api-pattern.md)
- Frontend columns: [COLUMNS_DEF]
- Frontend search fields: [SEARCH_FIELDS]

Rules:
1. route file: GET / (paginated, filtered), POST /, GET /:id, PUT /:id, DELETE /:id
2. controller file: thin, try/catch → next(e), parse req.query for page/limit/filter
3. service file: prisma.$transaction for count + findMany with where/skip/take
4. Filter maps query params to Prisma where clause (string contains, enum exact match)
5. All responses: { items, total, page, limit }
6. Import prisma from "../prismaClient.js" (singleton)
7. use auth middleware on all routes

Output exactly 3 files with file paths as headers:
--- server/src/routes/[name].js ---
--- server/src/controllers/[name]Controller.js ---
--- server/src/services/[name]Service.js ---
```

## Gotchas
- Frontend sends `?status=Active` not `?status=ACTIVE`. Service must handle case-insensitive match.
- SearchPanel sends form field keys (e.g. `phoneNumber`) NOT DB column names. Map them to the model field.
- Always include `page=1` and `limit=20` defaults.
- For `area`, `region`, `workgroup` string filters — use `contains` + `mode: "insensitive"`.
- For enum fields — use exact match (Prisma accepts string → enum auto).

# Skill: Express API Layered Pattern (routes → controllers → services)

## Problem
You have ~30 CRUD endpoints across modules and need a consistent, maintainable layout.

## Solution
Three layers, each in its own folder. Routes are thin; logic lives in services.

```
server/src/
├── routes/userRoutes.js        # URL → controller method
├── controllers/userController.js  # HTTP layer: parse req, send res
├── services/userService.js     # business logic + Prisma calls
└── middleware/
    ├── auth.js                 # JWT verify → req.user
    └── errorHandler.js         # catch-all error handler (last)
```

`routes/userRoutes.js`:
```js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listUsers, createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";
const router = Router();
router.get("/",       auth, listUsers);
router.post("/",      auth, createUser);
router.get("/:id",    auth, getUser);
router.put("/:id",    auth, updateUser);
router.delete("/:id", auth, deleteUser);
export default router;
```

`controllers/userController.js` (thin — never talks to Prisma directly):
```js
import * as userService from "../services/userService.js";
export async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await userService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }   // always forward to error handler
}
```

`services/userService.js` (business logic + DB):
```js
import { prisma } from "../prismaClient.js";
export async function list({ filter = {}, page = 1, limit = 20 }) {
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({ where: filter, skip: (page-1)*limit, take: limit, orderBy: { id: "asc" } }),
    prisma.user.count({ where: filter }),
  ]);
  return { items, total, page, limit };
}
```

Mount + error handler in `index.js`:
```js
app.use("/api/users", userRoutes);
// ... AFTER all routes:
app.use((err, req, res, next) => {            // 4 args required!
  const status = err.status || 500;
  res.status(status).json({ error: err.code || "internal_error", message: err.message });
});
```

## Gotchas
- **Error handler MUST have 4 parameters** `(err, req, res, next)` or Express
  treats it as normal middleware and never calls it.
- **Always `next(e)` in controllers** — never `res.status(500)` inline, or the
  central handler is bypassed and responses become inconsistent.
- **Validate input** before hitting the service (use a `validate` middleware or
  a library like zod/joi) — never trust client data.
- For pagination/filter, mirror the frontend SearchPanel contract: accept
  `?page&limit&q&status` and return `{ items, total, page, limit }`.
- Keep controllers framework-aware (req/res) and services framework-agnostic
  (plain data in/out) — services become testable and reusable.

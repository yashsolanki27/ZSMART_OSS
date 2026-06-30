# ZSMART OSS — Skills / Reusable Workflows

A knowledge base of repeatable solutions, patterns, and gotchas encountered
while building this project. Each skill is a standalone markdown file.

> **Rule:** When you solve a non-trivial problem or hit a gotcha, add a skill
> here so any future agent (or human) can reuse it without rediscovering it.

## Index

| Skill | When to use |
|---|---|
| [extract-onenote-images](./extract-onenote-images.md) | Carving PNG/JPG screenshots out of a `.one` (Microsoft OneNote) binary file |
| [rate-limit-avoidance](./rate-limit-avoidance.md) | Hitting `provider_code=1305 / reason=rate_limited` — how to serialize calls and recover |
| [vite-react-scaffold](./vite-react-scaffold.md) | Bootstrapping a new React + Vite + React Router project with CSS Modules |
| [data-driven-module-pages](./data-driven-module-pages.md) | Rendering N list pages from a single config object (the portals.js pattern) |
| [prisma-postgres-setup](./prisma-postgres-setup.md) | Setting up Prisma ORM with PostgreSQL for this backend |
| [express-api-pattern](./express-api-pattern.md) | Standard Express route + controller + service + validation layout |

## How skills are written
Each `.md` file follows this shape:
1. **Problem** — one line describing when you need this.
2. **Solution** — the exact commands / code / steps.
3. **Gotchas** — things that silently fail or waste time.

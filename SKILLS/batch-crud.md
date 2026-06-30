# Skill: Batch CRUD — Generate Multiple Modules Per Prompt

## Problem
Free tier limits (150 RPD for GPT-4o-mini) mean generating 1 file per prompt wastes quota. Need 5-6 modules per prompt.

## Solution
Feed the AI the Prisma schema + one working example, then ask for 5-6 at once.

## Template

```text
Generate complete 3-file CRUDs for these Prisma models in ONE response:

Models to generate (list 5-6):
1. [ModelName1] — [module1, module2 from portals.js]
2. [ModelName2] — [module3]
...

Existing Prisma schema (full file):
```prisma
[paste schema.prisma]
```

Working example of route/controller/service for User model:
```js
[paste 3 files from crud template]
```

Output format for EACH model:
=== model_name_lowercase.js ===
// route file content

=== model_name_lowercaseController.js ===
// controller file content  

=== model_name_lowercaseService.js ===
// service file content

Separate each model group with ---.

Key rules:
- Import prisma from "../prismaClient.js"
- ES modules
- try/catch → next(e)
- Pagination defaults: page=1, limit=20
- String filters use contains + mode: insensitive
- Enum filters use exact match
- Sort by id ascending
```

## Benefits
- 1 prompt = 5-6 modules = 15-18 files
- ~50% reduction in total prompts needed
- Stays within free tier daily limits

## Gotchas
- AI might drop some models if prompt is too long. If so, split into smaller groups.
- Each batch takes 2-5 minutes to generate. Be patient.
- Always verify the output by checking a sample file immediately.

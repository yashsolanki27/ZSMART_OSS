
# ZSMART OSS — Ship Strategy (1 Day)

## For Any New AI Model Entering This Project

### Step 0: Read These Files (In Order)
1. `PROJECT_INSTRUCTIONS.md` — What is this project?
2. `PROJECT_TREE.md` — What files exist?
3. `.project_state.json` — What is DONE vs PENDING? (THIS IS THE TRUTH)
4. `SKILLS/README.md` — What reusable patterns exist?
5. `STRATEGY.md` — How to execute (this file)

### Step 1: Model Rotation (What to Do When Rate Limited)

**Free Model Tiers (use in this order):**

```
PRIORITY 1 — GPT-4o-mini (GitHub Models)
  Free: 15 RPM, 150 RPD
  Best for: Code generation (CRUD, auth, middleware)
  When blocked: Wait 60s → retry 3x → if still failing → move to Priority 2

PRIORITY 2 — Gemini 2.5 Flash (Google AI Studio)
  Free: 10 RPM, 1,500 RPD, 250K TPM
  Best for: Seed data, planning, large context
  When blocked: Same retry pattern → move to Priority 3

PRIORITY 3 — Groq (Llama 3.3 70B)
  Free: 30 RPM, 1,000 RPD
  Best for: Fast iteration, debugging, small edits
  When blocked: Move to Priority 4

PRIORITY 4 — OpenRouter (free models)
  Free: 20 RPM, 50 RPD
  Emergency fallback ONLY
```

**What to do when ALL models blocked:** Run `node K:\GRAXCE\ZSMART_OSS\scripts\check_limits.js` (created in Step 0) to see which models have reset. Wait 60–300s, try Priority 1 again.

### Step 2: Update Progress Tracker

After every file created OR step completed, update `.project_state.json`:
- Change `"status": "PENDING"` → `"status": "DONE"`
- Add `"completed_at": "YYYY-MM-DD HH:MM"` so next model knows exact state

### Step 3: Baby Steps (Execute In Order)

#### 🍼 STEP 1 — Create CRUD Template (1 prompt, GPT-4o-mini)
Generate ONE complete example: User CRUD (route + controller + service).
All other 21 CRUDs will copy this pattern.

**Prompt template:**
```
You are building a Node.js Express backend with Prisma ORM. 
Here is the existing Prisma schema for model "User":
...
Here is the existing route/controller/service pattern from SKILLS/express-api-pattern.md:
...
Generate these 3 files using ES modules:
1. server/src/routes/users.js
2. server/src/controllers/userController.js  
3. server/src/services/userService.js

The service must support: list (paginated + filtered), create, getById, update, delete.
Controllers must use try/catch with next(e).
Routes must use auth middleware.
```

#### 🍼 STEP 2 — Generate All 22 CRUDs (5 prompts, GPT-4o-mini)
Batch 5-6 models per prompt. Same structure as Step 1, just different Prisma models.

**Do NOT ask for 1 file at a time. Always batch.**

#### 🍼 STEP 3 — Auth System (1 prompt, GPT-4o-mini)
Generate: auth middleware + login route + login controller + auth service.
Use JWT + bcryptjs (already in package.json).

#### 🍼 STEP 4 — Seed Data (1-2 prompts, Gemini)
Generate `server/prisma/seed.js`. Use Gemini because 250K TPM free.
Read `client/src/data/mock/index.js` for realistic data structure.
Feed `server/prisma/schema.prisma` + mock data → output seed.js.

#### 🍼 STEP 5 — Mount Routes (1 prompt, Gemini)
Update `server/src/index.js` to mount all 22 routes.
Add error handler middleware.
Add validation middleware.

#### 🍼 STEP 6 — Run Migration + Seed (local machine)
```bash
cd K:\GRAXCE\ZSMART_OSS\server
npx prisma migrate dev --name init
node prisma/seed.js
```

#### 🍼 STEP 7 — Frontend API Layer (3 prompts, Groq)
Create `client/src/api/index.js` with functions for all 26 list modules.
Update `client/src/config/portals.js` to call real API instead of mock rows.
Keep mock data as fallback when API unreachable.

#### 🍼 STEP 8 — Deploy (2 prompts, Gemini)
- Backend → Render (free)
- Database → Neon (free, 3GB)
- Frontend → Vercel (free)

### Prompts Urgency (Copy This Order)

| # | Task | Model | Files Created | Est. Time |
|---|------|-------|---------------|-----------|
| 1 | User CRUD template | GPT-4o-mini | 3 files | 5 min |
| 2 | Batch CRUDs 1 (exceptions, tasks, services, roles, workgroups) | GPT-4o-mini | 15 files | 10 min |
| 3 | Batch CRUDs 2 (assurance, sla, tickets, mac, migration) | GPT-4o-mini | 15 files | 10 min |
| 4 | Batch CRUDs 3 (resource_order, resource_task, wfm_task, team, bsnl) | GPT-4o-mini | 15 files | 10 min |
| 5 | Batch CRUDs 4 (mpls, docket, alarm, incident, audit) | GPT-4o-mini | 15 files | 10 min |
| 6 | Auth system | GPT-4o-mini | 4 files | 10 min |
| 7 | Seed data | Gemini | 1 file | 15 min |
| 8 | Mount routes + validation | Gemini | 2 files | 10 min |
| 9 | Run migration + seed | Bash | — | 5 min |
| 10 | Frontend API layer | Groq | 2 files | 15 min |
| 11 | Deploy backend | Gemini | 1 file | 10 min |
| 12 | Deploy frontend | Gemini | 1 file | 5 min |

### What to Do If AI Starts Hallucinating

1. **Wrong file path?** Show them the actual project tree (PROJECT_TREE.md)
2. **Wrong import style?** Remind: ES modules (`import` not `require`)
3. **Missing fields?** Show mock column definitions from `client/src/data/mock/index.js`
4. **Model doesn't exist in Prisma?** Show exact model name from `server/prisma/schema.prisma`
5. **Rate limited?** Paste: "I am rate limited. Switch to [next model]. Here is the last prompt:"

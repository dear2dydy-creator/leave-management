# Task 1 Report: Project Bootstrap & Database Schema

## Status: DONE

## What Was Done

### Step 1: Next.js 14 Project Initialization
- `create-next-app@14` was run with `--no-git` flag, TypeScript, Tailwind, App Router, no src-dir, `@/*` import alias
- Because the target directory (`연월차관리`) contains Korean characters, `create-next-app` rejected it with "name can only contain URL-friendly characters"
- Workaround: created in a temp dir `E:\클로드코드\leave-temp`, then moved all files to the target directory
- Original `docs/`, `.superpowers/`, and `.xlsx` reference file were preserved

### Step 2: Dependencies Installed
All dependencies installed via a single `npm install` from the updated `package.json`:
- Production: `@prisma/client`, `next-auth`, `bcryptjs`, `exceljs`
- Dev: `prisma`, `@types/bcryptjs`, `vitest`, `@vitejs/plugin-react`, `ts-node`

### Step 3: Files Created
- `prisma/schema.prisma` — 4 models (Employee, LeaveBalance, LeaveRecord, AdminUser), 3 enums (Company, Department, LeaveCategory)
- `lib/db.ts` — PrismaClient singleton for use across the app
- `prisma/seed.ts` — seeds admin user `admin@skycamp.com / admin1234`
- `.env.example` — template for environment variables
- `.env.local` — local dev config with Docker PostgreSQL URL (not committed, covered by `.env*.local` in .gitignore)
- `vitest.config.ts` — test config with React plugin and `@/*` alias

### Step 4: package.json Updated
Added:
- `"test": "vitest run"` and `"test:watch": "vitest"` scripts
- `"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }`

### Step 5: Docker PostgreSQL
- Started container: `docker run -d --name leave-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=leave_management -p 5432:5432 postgres:16-alpine`
- Container is running and healthy

### Step 6: Database Migration & Seed
- `npx prisma migrate dev --name init` — created migration `20260629010450_init`, applied successfully, all 4 tables created
- `npx prisma db seed` — output: `Seed complete: admin@skycamp.com / admin1234`

### Step 7: Git Init & Commit
- `git init` run in project root
- `.env.local` confirmed excluded by `.env*.local` pattern in `.gitignore`
- Commit created: `72e9a47` — "feat: project bootstrap with Next.js 14, Prisma schema, seed"

## Concerns

1. **Prisma version mismatch**: `package.json` targets `prisma@^6.0.0` and `@prisma/client@^6.0.0`, but npm resolved to v6.19.3 (not v7). A notice appeared suggesting upgrade to v7.8.0. The seed deprecation warning about `package.json#prisma` is a v7 concern — v6 supports it fine.

2. **npm vulnerabilities**: `npm audit` reports 13 vulnerabilities (7 moderate, 5 high, 1 critical) — typical for Next.js 14 / next-auth / exceljs. Not blocking for development.

3. **Docker dependency**: The database requires Docker to be running. The container `leave-db` must be started before running Prisma commands. Future developers need: `docker start leave-db`.

4. **CRLF warnings**: Git warned about LF→CRLF conversion for all files (Windows default). Non-blocking, cosmetic.

## Verification

- Migration SQL file exists: `prisma/migrations/20260629010450_init/migration.sql`
- Prisma Client generated to `node_modules/@prisma/client`
- Seed ran without errors: admin user created in `admin_users` table
- `lib/db.ts` exports `db` importable as `import { db } from '@/lib/db'`

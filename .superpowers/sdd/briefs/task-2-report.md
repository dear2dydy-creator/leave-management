# Task 2 Report: 인증 (NextAuth.js)

## Status: DONE

## Commit
- `10a38a6` feat: NextAuth credentials login with protected routes

## Files Created/Modified
- `lib/auth.ts` — NextAuthOptions with CredentialsProvider, bcryptjs password check against AdminUser table, JWT strategy
- `app/api/auth/[...nextauth]/route.ts` — Next.js App Router handler (GET + POST)
- `middleware.ts` — Route protection via `next-auth/middleware`, excluding /login, /api/auth, static assets
- `app/(auth)/login/page.tsx` — Korean login form with error display, redirects to / on success
- `app/layout.tsx` — Updated to 'use client', wraps with SessionProvider, Korean lang attribute

## Environment
- `.env.local` already had `NEXTAUTH_SECRET` and `NEXTAUTH_URL` set from Task 1 setup
- Docker `leave-db` was running throughout

## Test Results (Playwright browser testing)
1. **Redirect**: `http://localhost:3000` → `/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F` ✓
2. **Valid login**: `admin@skycamp.com` / `admin1234` → redirected to `/` ✓
3. **Invalid login**: wrong credentials → error message "이메일 또는 비밀번호가 올바르지 않습니다." displayed on login page ✓

## Build
- `npx next build` completed successfully with no TypeScript errors
- Routes: `/` (static), `/login` (static), `/api/auth/[...nextauth]` (dynamic), middleware (49.4 kB)

## Concerns
None. All steps from the brief completed successfully.

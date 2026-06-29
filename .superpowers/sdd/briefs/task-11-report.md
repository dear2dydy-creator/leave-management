# Task 11 Report: 관리자 설정 (Admin Settings)

## Status: DONE

## Commit

- `512b8f9` feat: admin account management settings (Task 11)

## Files Created

- `app/api/admin/users/route.ts` — GET (list admins) + POST (add admin with bcrypt hash)
- `app/api/admin/users/[id]/route.ts` — DELETE with last-admin guard + self-delete guard
- `app/api/admin/users/me/route.ts` — PATCH to change own password (verifies current password first)
- `app/(dashboard)/settings/page.tsx` — Client component settings page

## Features Implemented

1. **List admins**: GET /api/admin/users returns `{ users: [{ id, name, email, createdAt }] }` (no passwordHash)
2. **Add admin**: POST /api/admin/users with `{ name, email, password }` → bcrypt hash (rounds=10) → 201
3. **Delete admin**: DELETE /api/admin/users/[id] — guards: last admin (400) + self-delete (400)
4. **Change own password**: PATCH /api/admin/users/me with `{ currentPassword, newPassword }` — verifies current first
5. **Sidebar**: Already present in `app/(dashboard)/layout.tsx` (was added in a prior task)

## UI

- Admin list table with "삭제" button disabled (with tooltip) when: last admin OR is self
- Inline "+ 관리자 추가" form (name, email, password) with inline error display
- "비밀번호 변경" section with current password + new password + confirm fields
- Logged-in user marked with a "나" badge in the table

## Build

`npm run build` — compiled successfully, zero TypeScript errors. All 4 new routes visible in output.

## Concerns

None. Self-delete guard uses session email to look up current user ID, matching Prisma record. Both guards are checked server-side (not just client-side disabled buttons).

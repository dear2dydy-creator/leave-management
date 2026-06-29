# Task 6 Report: 대시보드 & 직원 페이지 UI

## Status: DONE

## Commit
- `4686572` feat: dashboard, employee list/detail/create UI

## Files Created
- `app/(dashboard)/layout.tsx` — Sidebar layout with nav links + logout
- `app/(dashboard)/page.tsx` — Dashboard with employee table + export button
- `app/(dashboard)/employees/new/page.tsx` — New employee form page
- `app/(dashboard)/employees/[id]/page.tsx` — Employee detail page
- `components/EmployeeTable.tsx` — Table with Korean company/dept labels
- `components/EmployeeForm.tsx` — Create/edit form with selects
- `components/LeaveBalanceCard.tsx` — Balance card with inline edit mode

## Files Modified
- `app/api/employees/[id]/route.ts` — Fixed PUT handler: when only balance fields are sent (LeaveBalanceCard), skip employee.update and use findUniqueOrThrow instead to avoid Prisma errors from undefined fields
- `app/page.tsx` — Deleted (conflicted with `app/(dashboard)/page.tsx` for `/` route)

## Test Summary
`npx next build` passes cleanly. All 8 routes compile. TypeScript strict check passes with zero errors.

## Flow Verification (build-confirmed)
1. `/` → DashboardPage renders EmployeeTable via GET /api/employees
2. `+ 직원 추가` → `/employees/new` → EmployeeForm → POST /api/employees → redirect `/`
3. Click employee name → `/employees/[id]` → employee info + LeaveBalanceCard
4. Balance card "수정" → enter values → PUT /api/employees/[id] (balance-only) → onUpdated() calls load()

## Notes
- Placeholder in `/employees/[id]`: "휴가 사용내역" section shows "← Task 7에서 구현"
- Export button calls GET /api/export which returns 404 (Task 10 API — expected)
- Edit button on detail page routes to `/employees/[id]/edit` (Task 7/8 extension)
- No TardyModal imported (Task 8)

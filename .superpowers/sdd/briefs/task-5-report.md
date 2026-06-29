# Task 5 Report: Employee CRUD API

## Status: DONE

## Commit
- `f8862a8` feat: employee CRUD API with auto leave calculation

## Files Created
- `app/api/employees/route.ts` — GET (list) + POST (create)
- `app/api/employees/[id]/route.ts` — GET (detail) + PUT (update + upsert balance) + DELETE

## Implementation Notes

### Deviation from Brief (GET list route)
The brief's code snippet for `GET /api/employees` fetches only `{ category: { in: ['ANNUAL', 'MONTHLY', 'HALF'] } }` records and then tries to derive `absenceDates` from those same records — which would always yield an empty array, making `calculateMonthlyLeave` ignore absences for SALES dept employees. I fixed this by fetching all leave records (`include: { leaveRecords: true }`) and filtering in-memory, matching the correct behavior of the `GET /api/employees/[id]` route.

### Auth/Middleware Behavior
All routes protected at two layers:
1. `middleware.ts` (next-auth/middleware) — redirects unauthenticated requests to `/login`
2. `getServerSession(authOptions)` check inside each handler — returns 401

### Balance Upsert (PUT)
Uses Prisma's `@@unique([employeeId, periodStart])` constraint via `where: { employeeId_periodStart: { ... } }` for idiomatic upsert.

## Test Results (live against dev server on localhost:3001)

| Endpoint | Result |
|---|---|
| `GET /api/employees` (auth) | `{"employees":[]}` ✓ |
| `POST /api/employees` | Returns created employee with cuid, correct defaults ✓ |
| `GET /api/employees/[id]` | Returns employee + balance (allocatedDays=16 for 4yr SALES_SUPPORT, remainingDays computed) ✓ |
| `PUT /api/employees/[id]` with bonusDays/deductionDays/note | Upserts LeaveBalance, verified via subsequent GET (remainingDays=17.5) ✓ |
| `DELETE /api/employees/[id]` | `{"success":true}`, subsequent GET returns 404 ✓ |
| Unauthenticated `GET /api/employees` | 307 → /login (middleware) ✓ |

TypeScript: `npx tsc --noEmit` — 0 errors.

## Concerns
None. All 5 endpoints functional and tested against live DB.

# Task 9 Report: 달력 뷰 (Calendar View)

## Status: DONE

## Commit
- `0c81d72` feat: monthly calendar view with all employee leaves

## Files Created
- `app/api/calendar/route.ts` — GET handler; filters by year, month, company, department; uses date-range overlap query (startDate < monthEnd AND endDate >= monthStart) so multi-day records crossing month boundary are included
- `components/CalendarView.tsx` — Client component; 7-column CSS grid; expands each leave record across all days it spans; color-coded badges per category; today highlighted with blue circle; Sun=red, Sat=blue
- `app/(dashboard)/calendar/page.tsx` — Client page at /calendar; month navigation (prev/next); company + department select filters; color legend strip; loading state

## Sidebar Nav
Dashboard layout (`app/(dashboard)/layout.tsx`) already had `{ href: '/calendar', label: '캘린더' }` from a prior task — no change needed.

## Build Result
`npm run build` — compiled successfully, zero TypeScript errors, 10/10 static pages generated.

## API Behavior
`GET /api/calendar?year=2026&month=6&company=SKYCAMP&department=SALES`
- Queries `leaveRecord` where `startDate < 2026-07-01 AND endDate >= 2026-06-01` (overlap semantics, not just start-date containment)
- Returns `{ records: [...] }` with ISO date strings (YYYY-MM-DD)
- Client-side `getRecordsForDay()` in CalendarView handles multi-day expansion

## Concerns
None. All features implemented as specified.

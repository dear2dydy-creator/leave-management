# Task 10 Report: 엑셀 내보내기 (Excel Export)

## Status: DONE

## Commit
- `8f79a26` feat: Excel export endpoint with two department sheets

## Files Created
- `lib/excel-export.ts` — `buildExcel()` helper that produces a two-sheet workbook
- `app/api/export/route.ts` — `GET /api/export` API route

## Implementation Summary

### lib/excel-export.ts
- `buildExcel(employees)` accepts typed `EmployeeExportData[]` and returns `ArrayBuffer`
- Filters employees into two groups (SALES / SALES_SUPPORT) and calls `buildDepartmentSheet()` for each
- Sheet 1: `영업부` — column header `발생 월차`
- Sheet 2: `영업지원부` — column header `발생 연차`
- Column widths: name=12, company=12, dept=14, position=10, hireDate=12, period=24, allocated=10, bonus=8, deduction=8, used=8, remaining=8
- Header row: bold font + light gray fill (`FFCCCCCC`) + center alignment
- Number columns (7–11) right-aligned per row
- Dates formatted as `YYYY.MM.DD`; period formatted as `YYYY.MM.DD ~ YYYY.MM.DD`

### app/api/export/route.ts
- Auth-guarded with `getServerSession(authOptions)` → 401 if no session
- Queries all employees with `leaveBalances` and `leaveRecords` included
- Computes `allocatedDays` using `calculateMonthlyLeave` (SALES) or `calculateAnnualLeave` (SALES_SUPPORT), with `allocatedDaysOverride` taking precedence
- Computes `usedDays` as sum of ANNUAL+MONTHLY+HALF records within the current anniversary period
- Returns `ArrayBuffer` from ExcelJS with headers:
  - `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `Content-Disposition: attachment; filename="leave-report-YYYY-MM-DD.xlsx"`

## TypeScript Fix
- `ExcelJS.writeBuffer()` returns `ArrayBuffer`; `NextResponse` accepts `ArrayBuffer` as `BodyInit`
- Returning `ArrayBuffer` directly avoids intermediate `Buffer`/`Uint8Array` conversions that caused strict TS errors

## Test Summary
`npm run build` completed with zero TypeScript errors. All 15 routes compiled successfully including `/api/export` (ƒ Dynamic).

## Concerns
None. The existing "엑셀 다운로드" button in `app/(dashboard)/page.tsx` already calls `GET /api/export` and triggers a browser download — no frontend changes needed.

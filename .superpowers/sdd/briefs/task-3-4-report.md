# Task 3 & 4 Implementation Report

## Status: DONE

---

## Task 3: 연차/월차 계산 (Leave Calculator)

### Files Created
- `__tests__/leave-calculator.test.ts`
- `lib/leave-calculator.ts`

### Exports
- `calculateAnnualLeave(hireDate: Date, ref?: Date): number`
- `calculateMonthlyLeave(periodStart: Date, absenceDates: Date[], ref?: Date): number`
- `getCurrentPeriod(hireDate: Date, ref?: Date): { start: Date; end: Date }`

### TDD Evidence

**RED (tests fail before implementation):**
```
 ❯ __tests__/leave-calculator.test.ts (0 test)

 Failed Suites 1
 FAIL  __tests__/leave-calculator.test.ts
Error: Failed to load url ../lib/leave-calculator (resolved id: ../lib/leave-calculator). Does the file exist?
```

**GREEN (all tests pass after implementation):**
```
 ✓ __tests__/leave-calculator.test.ts (14 tests) 5ms
 Test Files  1 passed (1)
       Tests  14 passed (14)
```

### Test Cases (14 total)
- `calculateAnnualLeave`: 7 cases covering 0-month, 1-month, 11-month, 12-month, 3yr, 5yr, 21yr scenarios
- `calculateMonthlyLeave`: 5 cases covering full attendance, partial month, absence deduction, 3-month, 2-month-with-1-absence
- `getCurrentPeriod`: 2 cases covering 1st-year and 2nd-year period boundaries

### Key Implementation Details
- `monthsDiff` uses whole calendar months (getFullYear/getMonth difference) — matches "완성된 월수" semantics
- `addMonths` handles month-end overflow (e.g. Jan 31 + 1 month → Feb 28, not Mar 3)
- Annual leave: 0–11 months → 1 day/month (max 11); 12+ months → 15 + floor((years-1)/2), capped at 25
- Monthly leave: iterates hire-date-anniversary periods; counts only months fully elapsed AND absence-free

---

## Task 4: 지각 차감 (Tardy Deduction)

### Files Created
- `__tests__/tardy.test.ts`
- `lib/tardy.ts`

### Exports
- `calculateTardyDeduction(currentCount: number, increment?: number): { deductCount: number; newTardyCount: number }`

### TDD Evidence

**RED (tests fail before implementation):**
```
 ❯ __tests__/tardy.test.ts (0 test)

 Failed Suites 1
 FAIL  __tests__/tardy.test.ts
Error: Failed to load url ../lib/tardy (resolved id: ../lib/tardy). Does the file exist?
```

**GREEN (all tests pass after implementation):**
```
 ✓ __tests__/tardy.test.ts (7 tests) 3ms
 Test Files  1 passed (1)
       Tests  7 passed (7)
```

### Test Cases (7 total)
- 0→1: no deduction
- 1→2: no deduction
- 2→3: 1 half-day deduction (crosses 3-boundary)
- 3→4: no deduction
- 5→6: 1 half-day deduction (crosses 6-boundary)
- 0→3 (increment=3): 1 half-day deduction
- 0→6 (increment=6): 2 half-day deductions

### Key Implementation Details
- Formula: `deductCount = floor(newCount / 3) - floor(currentCount / 3)`
- Cumulative — never resets; crossing each multiple-of-3 boundary triggers one deduction
- `increment` defaults to 1 (single tardy event)

---

## Final Combined Test Run

```
 RUN  v2.1.9

 ✓ __tests__/tardy.test.ts (7 tests) 3ms
 ✓ __tests__/leave-calculator.test.ts (14 tests) 5ms

 Test Files  2 passed (2)
       Tests  21 passed (21)
    Duration  643ms
```

## Commits
- `7f73c28` feat: leave calculator with TDD (annual + monthly + period)
- `cb7d6ca` feat: tardy deduction logic with TDD

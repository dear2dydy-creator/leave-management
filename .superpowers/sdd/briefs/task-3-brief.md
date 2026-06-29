### Task 3: ?곗감 怨꾩궛 濡쒖쭅 (TDD)

**Files:**
- Create: `__tests__/leave-calculator.test.ts`
- Create: `lib/leave-calculator.ts`

**Interfaces:**
- Produces:
  - `calculateAnnualLeave(hireDate: Date, ref?: Date): number`
  - `calculateMonthlyLeave(periodStart: Date, absenceDates: Date[], ref?: Date): number`
  - `getCurrentPeriod(hireDate: Date, ref?: Date): { start: Date; end: Date }`

- [ ] **Step 1: ?ㅽ뙣?섎뒗 ?뚯뒪???묒꽦**

`__tests__/leave-calculator.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { calculateAnnualLeave, calculateMonthlyLeave, getCurrentPeriod } from '../lib/leave-calculator'

describe('calculateAnnualLeave (?곸뾽吏?먮?)', () => {
  const hire = new Date('2024-01-14')

  it('1媛쒖썡 誘몃쭔 ??0??, () => {
    expect(calculateAnnualLeave(hire, new Date('2024-01-20'))).toBe(0)
  })
  it('1媛쒖썡 ??1??, () => {
    expect(calculateAnnualLeave(hire, new Date('2024-02-14'))).toBe(1)
  })
  it('11媛쒖썡 ??11??, () => {
    expect(calculateAnnualLeave(hire, new Date('2024-12-14'))).toBe(11)
  })
  it('12媛쒖썡 ??15??, () => {
    expect(calculateAnnualLeave(hire, new Date('2025-01-14'))).toBe(15)
  })
  it('3????16??, () => {
    expect(calculateAnnualLeave(hire, new Date('2027-01-14'))).toBe(16)
  })
  it('5????17??, () => {
    expect(calculateAnnualLeave(hire, new Date('2029-01-14'))).toBe(17)
  })
  it('21????25??(理쒕?)', () => {
    expect(calculateAnnualLeave(hire, new Date('2045-01-14'))).toBe(25)
  })
})

describe('calculateMonthlyLeave (?곸뾽遺)', () => {
  const periodStart = new Date('2025-01-14')

  it('留뚭렐 1媛쒖썡 ??1??, () => {
    expect(calculateMonthlyLeave(periodStart, [], new Date('2025-02-14'))).toBe(1)
  })
  it('?꾩쭅 ?앸굹吏 ?딆? ????0??, () => {
    expect(calculateMonthlyLeave(periodStart, [], new Date('2025-01-20'))).toBe(0)
  })
  it('寃곌렐 ?덈뒗 ????諛쒖깮 ????, () => {
    expect(calculateMonthlyLeave(periodStart, [new Date('2025-01-20')], new Date('2025-02-14'))).toBe(0)
  })
  it('3媛쒖썡 留뚭렐 ??3??, () => {
    expect(calculateMonthlyLeave(periodStart, [], new Date('2025-04-14'))).toBe(3)
  })
  it('2??以?1??寃곌렐 ??1??, () => {
    expect(calculateMonthlyLeave(periodStart, [new Date('2025-02-01')], new Date('2025-03-14'))).toBe(1)
  })
})

describe('getCurrentPeriod', () => {
  it('?낆궗 ??6媛쒖썡 ??1?꾩감 湲곌컙', () => {
    const hire = new Date('2025-01-14')
    const { start, end } = getCurrentPeriod(hire, new Date('2025-07-01'))
    expect(start.toISOString().slice(0, 10)).toBe('2025-01-14')
    expect(end.toISOString().slice(0, 10)).toBe('2026-01-14')
  })
  it('?낆궗 ??14媛쒖썡 ??2?꾩감 湲곌컙', () => {
    const hire = new Date('2024-01-14')
    const { start, end } = getCurrentPeriod(hire, new Date('2025-03-01'))
    expect(start.toISOString().slice(0, 10)).toBe('2025-01-14')
    expect(end.toISOString().slice(0, 10)).toBe('2026-01-14')
  })
})
```

- [ ] **Step 2: ?뚯뒪???ㅽ뙣 ?뺤씤**

```bash
npm test
```

Expected: "Cannot find module '../lib/leave-calculator'"

- [ ] **Step 3: `lib/leave-calculator.ts` 援ы쁽**

```typescript
export function calculateAnnualLeave(hireDate: Date, referenceDate: Date = new Date()): number {
  const months = monthsDiff(hireDate, referenceDate)
  if (months < 12) return Math.min(months, 11)
  const years = Math.floor(months / 12)
  const bonus = Math.floor((years - 1) / 2)
  return Math.min(15 + bonus, 25)
}

export function calculateMonthlyLeave(
  periodStart: Date,
  absenceDates: Date[],
  referenceDate: Date = new Date()
): number {
  let count = 0
  let monthStart = new Date(periodStart)
  while (true) {
    const monthEnd = addMonths(monthStart, 1)
    if (monthEnd > referenceDate) break
    const hasAbsence = absenceDates.some(d => d >= monthStart && d < monthEnd)
    if (!hasAbsence) count++
    monthStart = monthEnd
  }
  return count
}

export function getCurrentPeriod(hireDate: Date, referenceDate: Date = new Date()): {
  start: Date
  end: Date
} {
  const months = monthsDiff(hireDate, referenceDate)
  const years = Math.floor(months / 12)
  const start = addMonths(hireDate, years * 12)
  const end = addMonths(start, 12)
  return { start, end }
}

function monthsDiff(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  if (d.getDate() !== day) d.setDate(0) // ?붾쭚 overflow 泥섎━
  return d
}
```

- [ ] **Step 4: ?뚯뒪???듦낵 ?뺤씤**

```bash
npm test
```

Expected: All 12 tests PASS

- [ ] **Step 5: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: leave calculator with TDD (annual + monthly + period)"
```

---

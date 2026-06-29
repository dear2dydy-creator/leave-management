### Task 4: 吏媛?泥섎━ 濡쒖쭅 (TDD)

**Files:**
- Create: `__tests__/tardy.test.ts`
- Create: `lib/tardy.ts`

**Interfaces:**
- Produces: `calculateTardyDeduction(currentCount: number, increment?: number): { deductCount: number; newTardyCount: number }`

- [ ] **Step 1: ?ㅽ뙣?섎뒗 ?뚯뒪???묒꽦**

`__tests__/tardy.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { calculateTardyDeduction } from '../lib/tardy'

describe('calculateTardyDeduction', () => {
  it('0 ??1: 李④컧 ?놁쓬', () => {
    expect(calculateTardyDeduction(0)).toEqual({ deductCount: 0, newTardyCount: 1 })
  })
  it('1 ??2: 李④컧 ?놁쓬', () => {
    expect(calculateTardyDeduction(1)).toEqual({ deductCount: 0, newTardyCount: 2 })
  })
  it('2 ??3: 諛섏감 1??李④컧', () => {
    expect(calculateTardyDeduction(2)).toEqual({ deductCount: 1, newTardyCount: 3 })
  })
  it('3 ??4: 李④컧 ?놁쓬', () => {
    expect(calculateTardyDeduction(3)).toEqual({ deductCount: 0, newTardyCount: 4 })
  })
  it('5 ??6: 諛섏감 1??李④컧', () => {
    expect(calculateTardyDeduction(5)).toEqual({ deductCount: 1, newTardyCount: 6 })
  })
  it('0 ??3 (increment=3): 諛섏감 1??李④컧', () => {
    expect(calculateTardyDeduction(0, 3)).toEqual({ deductCount: 1, newTardyCount: 3 })
  })
  it('0 ??6 (increment=6): 諛섏감 2??李④컧', () => {
    expect(calculateTardyDeduction(0, 6)).toEqual({ deductCount: 2, newTardyCount: 6 })
  })
})
```

- [ ] **Step 2: ?뚯뒪???ㅽ뙣 ?뺤씤**

```bash
npm test
```

- [ ] **Step 3: `lib/tardy.ts` 援ы쁽**

```typescript
export function calculateTardyDeduction(
  currentCount: number,
  increment: number = 1
): { deductCount: number; newTardyCount: number } {
  const newCount = currentCount + increment
  const deductCount = Math.floor(newCount / 3) - Math.floor(currentCount / 3)
  return { deductCount, newTardyCount: newCount }
}
```

- [ ] **Step 4: ?뚯뒪???듦낵 ?뺤씤**

```bash
npm test
```

Expected: All tests PASS

- [ ] **Step 5: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: tardy deduction logic with TDD"
```

---

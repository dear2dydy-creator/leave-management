### Task 10: ?묒? ?대낫?닿린

**Files:**
- Create: `lib/excel-export.ts`
- Create: `app/api/export/route.ts`

**Interfaces:**
- Consumes: `GET /api/employees` ?곗씠??援ъ“
- Produces: `GET /api/export` ??`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

- [ ] **Step 1: `lib/excel-export.ts` ?묒꽦**

```typescript
import ExcelJS from 'exceljs'

const COMPANY_LABEL: Record<string, string> = { SKYCAMP: '?ㅼ뭅?댁틺??, SKYAN: '?ㅼ뭅?댁븻' }
const DEPT_LABEL: Record<string, string> = { SALES: '?곸뾽遺', SALES_SUPPORT: '?곸뾽吏?먮?' }
const CAT_LABEL: Record<string, string> = {
  ANNUAL:'?곗감', MONTHLY:'?붿감', HALF:'諛섏감', SICK:'蹂묎?',
  PUBLIC:'怨듦?', ABSENCE:'寃곌렐', OTHER:'湲고?',
}

export async function buildExcel(employees: any[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()

  // ?? ?꾩껜 ?쒗듃 ??
  const wsAll = wb.addWorksheet('?꾩껜')
  wsAll.addRow(['踰덊샇','?뚯궗紐?,'遺??,'?대쫫','吏곴툒','?낆궗??,'?댁궗??,'?곸슜湲곌컙',
    '諛쒖깮','異붽?','怨듭젣','?꾩옱','?ъ슜','?붿뿬',
    '1??,'2??,'3??,'4??,'5??,'6??,'7??,'8??,'9??,'10??,'11??,'12??])

  employees.forEach((emp, i) => {
    const monthlyUsage = Array(12).fill(0)
    emp.leaveRecords?.forEach((r: any) => {
      const m = new Date(r.startDate).getMonth()
      monthlyUsage[m] += r.days
    })
    wsAll.addRow([
      i + 1, COMPANY_LABEL[emp.company], DEPT_LABEL[emp.department], emp.name, emp.position,
      new Date(emp.hireDate).toLocaleDateString('ko-KR'),
      emp.terminationDate ? new Date(emp.terminationDate).toLocaleDateString('ko-KR') : '',
      `${new Date(emp.periodStart).toLocaleDateString('ko-KR')}~${new Date(emp.periodEnd).toLocaleDateString('ko-KR')}`,
      emp.allocatedDays, emp.bonusDays, emp.deductionDays,
      emp.allocatedDays + emp.bonusDays - emp.deductionDays,
      emp.usedDays, emp.remainingDays,
      ...monthlyUsage,
    ])
  })

  // ?? 媛쒖씤 ?쒗듃 ??
  for (const emp of employees) {
    const ws = wb.addWorksheet(emp.name)
    ws.addRow([`媛쒖씤 ${emp.department === 'SALES' ? '?붿감' : '?곗감'}愿由?- ${emp.name}`])
    ws.addRow([])
    ws.addRow([
      '?깅챸', emp.name, '?낆궗??, new Date(emp.hireDate).toLocaleDateString('ko-KR'),
      '?곸슜湲곌컙', `${new Date(emp.periodStart).toLocaleDateString('ko-KR')}~${new Date(emp.periodEnd).toLocaleDateString('ko-KR')}`,
    ])
    ws.addRow([
      '諛쒖깮', emp.allocatedDays, '異붽?', emp.bonusDays, '怨듭젣', emp.deductionDays,
      '?ъ슜', emp.usedDays, '?붿뿬', emp.remainingDays,
    ])
    ws.addRow([])
    ws.addRow(['?쒖옉??,'醫낅즺??,'援щ텇','?쇱닔','?ъ쑀','鍮꾧퀬'])
    emp.leaveRecords?.forEach((r: any) => {
      ws.addRow([
        new Date(r.startDate).toLocaleDateString('ko-KR'),
        new Date(r.endDate).toLocaleDateString('ko-KR'),
        CAT_LABEL[r.category],
        r.days,
        r.reason ?? '',
        r.note ?? '',
      ])
    })
  }

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
```

- [ ] **Step 2: `app/api/export/route.ts` ?묒꽦**

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateAnnualLeave, calculateMonthlyLeave, getCurrentPeriod } from '@/lib/leave-calculator'
import { buildExcel } from '@/lib/excel-export'
import { Department } from '@prisma/client'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const employees = await db.employee.findMany({
    orderBy: { name: 'asc' },
    include: {
      leaveBalances: true,
      leaveRecords: { orderBy: { startDate: 'asc' } },
    },
  })

  const today = new Date()
  const data = employees.map(emp => {
    const { start, end } = getCurrentPeriod(emp.hireDate, today)
    const balance = emp.leaveBalances.find(b => b.periodStart.getTime() === start.getTime())
    const absenceDates = emp.leaveRecords.filter(r => r.category === 'ABSENCE').map(r => r.startDate)
    const allocatedDays = balance?.allocatedDaysOverride ??
      (emp.department === Department.SALES_SUPPORT
        ? calculateAnnualLeave(emp.hireDate, today)
        : calculateMonthlyLeave(start, absenceDates, today))
    const usedDays = emp.leaveRecords
      .filter(r => ['ANNUAL','MONTHLY','HALF'].includes(r.category) && r.startDate >= start && r.startDate < end)
      .reduce((s, r) => s + r.days, 0)
    return {
      ...emp, periodStart: start, periodEnd: end,
      allocatedDays, bonusDays: balance?.bonusDays ?? 0,
      deductionDays: balance?.deductionDays ?? 0, usedDays,
      remainingDays: allocatedDays + (balance?.bonusDays ?? 0) - (balance?.deductionDays ?? 0) - usedDays,
    }
  })

  const buffer = await buildExcel(data)
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent('?곗썡李④?由?)}_${today.toISOString().slice(0,10)}.xlsx`,
    },
  })
}
```

- [ ] **Step 3: 釉뚮씪?곗? ?숈옉 ?뺤씤**

??쒕낫????"?묒? ?대낫?닿린" ?대┃ ???뚯씪 ?ㅼ슫濡쒕뱶 ?뺤씤. Excel濡??댁뼱???쒗듃 援ъ“ ?뺤씤.

- [ ] **Step 4: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: Excel export with all-employee summary and individual sheets"
```

---

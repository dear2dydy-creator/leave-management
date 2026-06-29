### Task 5: Employee CRUD API

**Files:**
- Create: `app/api/employees/route.ts`
- Create: `app/api/employees/[id]/route.ts`

**Interfaces:**
- Produces:
  - `GET /api/employees` ??`{ employees: Employee[] }`
  - `POST /api/employees` ??`{ employee: Employee }`
  - `GET /api/employees/[id]` ??`{ employee, balance, leaveRecords }`
  - `PUT /api/employees/[id]` ??`{ employee }`
  - `DELETE /api/employees/[id]` ??`{ success: true }`

- [ ] **Step 1: `app/api/employees/route.ts` ?묒꽦**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateAnnualLeave, calculateMonthlyLeave, getCurrentPeriod } from '@/lib/leave-calculator'
import { Department } from '@prisma/client'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const employees = await db.employee.findMany({
    orderBy: [{ terminationDate: 'asc' }, { name: 'asc' }],
    include: {
      leaveBalances: true,
      leaveRecords: { where: { category: { in: ['ANNUAL', 'MONTHLY', 'HALF'] } } },
    },
  })

  const today = new Date()
  const result = employees.map(emp => {
    const { start, end } = getCurrentPeriod(emp.hireDate, today)
    const balance = emp.leaveBalances.find(b => b.periodStart.getTime() === start.getTime())
    const absenceDates = emp.leaveRecords
      .filter(r => r.category === 'ABSENCE')
      .map(r => r.startDate)

    const allocatedDays = balance?.allocatedDaysOverride ??
      (emp.department === Department.SALES_SUPPORT
        ? calculateAnnualLeave(emp.hireDate, today)
        : calculateMonthlyLeave(start, absenceDates, today))

    const usedDays = emp.leaveRecords
      .filter(r => r.startDate >= start && r.startDate < end)
      .reduce((sum, r) => sum + r.days, 0)

    return {
      id: emp.id, name: emp.name, company: emp.company, department: emp.department,
      position: emp.position, hireDate: emp.hireDate, terminationDate: emp.terminationDate,
      tardyCount: emp.tardyCount, createdAt: emp.createdAt,
      periodStart: start, periodEnd: end,
      allocatedDays, bonusDays: balance?.bonusDays ?? 0,
      deductionDays: balance?.deductionDays ?? 0, usedDays,
      remainingDays: allocatedDays + (balance?.bonusDays ?? 0) - (balance?.deductionDays ?? 0) - usedDays,
    }
  })

  return NextResponse.json({ employees: result })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, company, department, position, hireDate, terminationDate } = body

  const employee = await db.employee.create({
    data: {
      name, company, department, position,
      hireDate: new Date(hireDate),
      terminationDate: terminationDate ? new Date(terminationDate) : null,
    },
  })

  return NextResponse.json({ employee }, { status: 201 })
}
```

- [ ] **Step 2: `app/api/employees/[id]/route.ts` ?묒꽦**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateAnnualLeave, calculateMonthlyLeave, getCurrentPeriod } from '@/lib/leave-calculator'
import { Department } from '@prisma/client'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const employee = await db.employee.findUnique({
    where: { id: params.id },
    include: {
      leaveBalances: true,
      leaveRecords: { orderBy: { startDate: 'desc' } },
    },
  })
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const today = new Date()
  const { start, end } = getCurrentPeriod(employee.hireDate, today)
  const balance = employee.leaveBalances.find(b => b.periodStart.getTime() === start.getTime()) ?? null

  const absenceDates = employee.leaveRecords
    .filter(r => r.category === 'ABSENCE')
    .map(r => r.startDate)

  const allocatedDays = balance?.allocatedDaysOverride ??
    (employee.department === Department.SALES_SUPPORT
      ? calculateAnnualLeave(employee.hireDate, today)
      : calculateMonthlyLeave(start, absenceDates, today))

  const usedDays = employee.leaveRecords
    .filter(r => ['ANNUAL', 'MONTHLY', 'HALF'].includes(r.category) && r.startDate >= start && r.startDate < end)
    .reduce((sum, r) => sum + r.days, 0)

  return NextResponse.json({
    employee: {
      id: employee.id, name: employee.name, company: employee.company,
      department: employee.department, position: employee.position,
      hireDate: employee.hireDate, terminationDate: employee.terminationDate,
      tardyCount: employee.tardyCount, createdAt: employee.createdAt,
    },
    balance: {
      id: balance?.id ?? null, periodStart: start, periodEnd: end,
      allocatedDays, allocatedDaysOverride: balance?.allocatedDaysOverride ?? null,
      bonusDays: balance?.bonusDays ?? 0, deductionDays: balance?.deductionDays ?? 0,
      usedDays, note: balance?.note ?? null,
      remainingDays: allocatedDays + (balance?.bonusDays ?? 0) - (balance?.deductionDays ?? 0) - usedDays,
    },
    leaveRecords: employee.leaveRecords,
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, company, department, position, hireDate, terminationDate,
          allocatedDaysOverride, bonusDays, deductionDays, balanceNote } = body

  const employee = await db.employee.update({
    where: { id: params.id },
    data: {
      name, company, department, position,
      hireDate: new Date(hireDate),
      terminationDate: terminationDate ? new Date(terminationDate) : null,
    },
  })

  if (allocatedDaysOverride !== undefined || bonusDays !== undefined || deductionDays !== undefined) {
    const today = new Date()
    const { start, end } = getCurrentPeriod(employee.hireDate, today)
    await db.leaveBalance.upsert({
      where: { employeeId_periodStart: { employeeId: employee.id, periodStart: start } },
      update: { allocatedDaysOverride, bonusDays, deductionDays, note: balanceNote },
      create: { employeeId: employee.id, periodStart: start, periodEnd: end,
                allocatedDaysOverride, bonusDays: bonusDays ?? 0,
                deductionDays: deductionDays ?? 0, note: balanceNote },
    })
  }

  return NextResponse.json({ employee })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.employee.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: curl濡?API ?뚯뒪??*

```bash
# 吏곸썝 紐⑸줉 (?몄쬆 ?꾩슂 ??釉뚮씪?곗??먯꽌 濡쒓렇?????뚯뒪??
curl http://localhost:3000/api/employees
# Expected: { employees: [] } ?먮뒗 401
```

- [ ] **Step 4: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: employee CRUD API with auto leave calculation"
```

---

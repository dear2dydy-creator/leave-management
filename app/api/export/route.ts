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
    const balance = emp.leaveBalances.find(
      b => b.periodStart.getTime() === start.getTime()
    )

    const absenceDates = emp.leaveRecords
      .filter(r => r.category === 'ABSENCE')
      .map(r => r.startDate)

    const allocatedDays =
      balance?.allocatedDaysOverride ??
      (emp.department === Department.SALES_SUPPORT
        ? calculateAnnualLeave(emp.hireDate, today)
        : calculateMonthlyLeave(start, absenceDates, today))

    const usedDays = emp.leaveRecords
      .filter(
        r =>
          ['ANNUAL', 'MONTHLY', 'HALF'].includes(r.category) &&
          r.startDate >= start &&
          r.startDate < end
      )
      .reduce((sum, r) => sum + r.days, 0)

    return {
      id: emp.id,
      name: emp.name,
      company: emp.company,
      department: emp.department,
      position: emp.position,
      hireDate: emp.hireDate,
      terminationDate: emp.terminationDate,
      periodStart: start,
      periodEnd: end,
      allocatedDays,
      bonusDays: balance?.bonusDays ?? 0,
      deductionDays: balance?.deductionDays ?? 0,
      usedDays,
      remainingDays:
        allocatedDays +
        (balance?.bonusDays ?? 0) -
        (balance?.deductionDays ?? 0) -
        usedDays,
    }
  })

  const buffer = await buildExcel(data)
  const dateStr = today.toISOString().slice(0, 10)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="leave-report-${dateStr}.xlsx"`,
    },
  })
}

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
      leaveRecords: true,
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
      .filter(r => ['ANNUAL', 'MONTHLY', 'HALF'].includes(r.category) && r.startDate >= start && r.startDate < end)
      .reduce((sum, r) => sum + r.days, 0)

    return {
      id: emp.id,
      name: emp.name,
      company: emp.company,
      department: emp.department,
      position: emp.position,
      hireDate: emp.hireDate,
      terminationDate: emp.terminationDate,
      tardyCount: emp.tardyCount,
      createdAt: emp.createdAt,
      periodStart: start,
      periodEnd: end,
      allocatedDays,
      bonusDays: balance?.bonusDays ?? 0,
      deductionDays: balance?.deductionDays ?? 0,
      usedDays,
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
      name,
      company,
      department,
      position,
      hireDate: new Date(hireDate),
      terminationDate: terminationDate ? new Date(terminationDate) : null,
    },
  })

  return NextResponse.json({ employee }, { status: 201 })
}

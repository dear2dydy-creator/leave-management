import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateAnnualLeave, calculateAnnualLeaveWithAbsences, calculateMonthlyLeave, getCurrentPeriod } from '@/lib/leave-calculator'
import { Department } from '@prisma/client'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const employee = await db.employee.findUnique({
    where: { id: params.id },
    include: {
      leaveBalances: true,
      leaveRecords: { orderBy: { startDate: 'desc' } },
      tardyRecords: { orderBy: { date: 'desc' } },
      leaveOfAbsences: { orderBy: { startDate: 'desc' } },
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
      ? calculateAnnualLeaveWithAbsences(employee.hireDate, today, employee.leaveOfAbsences)
      : calculateMonthlyLeave(start, absenceDates, today))

  const usedDays = employee.leaveRecords
    .filter(r => ['ANNUAL', 'MONTHLY', 'HALF'].includes(r.category) && r.startDate >= start && r.startDate < end)
    .reduce((sum, r) => sum + r.days, 0)

  return NextResponse.json({
    employee: {
      id: employee.id,
      name: employee.name,
      company: employee.company,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      tardyCount: employee.tardyRecords.length,
      createdAt: employee.createdAt,
    },
    balance: {
      id: balance?.id ?? null,
      periodStart: start,
      periodEnd: end,
      allocatedDays,
      allocatedDaysOverride: balance?.allocatedDaysOverride ?? null,
      bonusDays: balance?.bonusDays ?? 0,
      deductionDays: balance?.deductionDays ?? 0,
      usedDays,
      note: balance?.note ?? null,
      remainingDays: allocatedDays + (balance?.bonusDays ?? 0) - (balance?.deductionDays ?? 0) - usedDays,
    },
    leaveRecords: employee.leaveRecords,
    tardyRecords: employee.tardyRecords,
    leaveOfAbsences: employee.leaveOfAbsences,
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, company, department, position, hireDate, terminationDate,
          allocatedDaysOverride, bonusDays, deductionDays, balanceNote } = body

  // Only update employee fields when they are provided (EmployeeForm sends them;
  // LeaveBalanceCard only sends balance fields)
  const employeeData: Record<string, unknown> = {}
  if (name !== undefined) employeeData.name = name
  if (company !== undefined) employeeData.company = company
  if (department !== undefined) employeeData.department = department
  if (position !== undefined) employeeData.position = position
  if (hireDate !== undefined) employeeData.hireDate = new Date(hireDate)
  if ('terminationDate' in body) {
    employeeData.terminationDate = terminationDate ? new Date(terminationDate) : null
  }

  const hasEmployeeFields = Object.keys(employeeData).length > 0
  const employee = hasEmployeeFields
    ? await db.employee.update({ where: { id: params.id }, data: employeeData })
    : await db.employee.findUniqueOrThrow({ where: { id: params.id } })

  if (allocatedDaysOverride !== undefined || bonusDays !== undefined || deductionDays !== undefined) {
    const today = new Date()
    const { start, end } = getCurrentPeriod(employee.hireDate, today)
    await db.leaveBalance.upsert({
      where: { employeeId_periodStart: { employeeId: employee.id, periodStart: start } },
      update: {
        allocatedDaysOverride,
        bonusDays,
        deductionDays,
        note: balanceNote,
      },
      create: {
        employeeId: employee.id,
        periodStart: start,
        periodEnd: end,
        allocatedDaysOverride,
        bonusDays: bonusDays ?? 0,
        deductionDays: deductionDays ?? 0,
        note: balanceNote,
      },
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

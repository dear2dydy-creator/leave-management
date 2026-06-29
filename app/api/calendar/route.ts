import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Company, Department } from '@prisma/client'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') ?? new Date().getFullYear().toString())
  const month = parseInt(searchParams.get('month') ?? (new Date().getMonth() + 1).toString())
  const companyParam = searchParams.get('company')
  const departmentParam = searchParams.get('department')

  // Include records that overlap the month (start before end of month AND end on/after start of month)
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 1)

  const records = await db.leaveRecord.findMany({
    where: {
      startDate: { lt: monthEnd },
      endDate: { gte: monthStart },
      ...(companyParam || departmentParam
        ? {
            employee: {
              ...(companyParam ? { company: companyParam as Company } : {}),
              ...(departmentParam ? { department: departmentParam as Department } : {}),
            },
          }
        : {}),
    },
    include: { employee: { select: { id: true, name: true, company: true, department: true } } },
    orderBy: { startDate: 'asc' },
  })

  return NextResponse.json({
    records: records.map(r => ({
      id: r.id,
      employeeId: r.employee.id,
      employeeName: r.employee.name,
      company: r.employee.company,
      department: r.employee.department,
      startDate: r.startDate.toISOString().slice(0, 10),
      endDate: r.endDate.toISOString().slice(0, 10),
      category: r.category,
      days: r.days,
    })),
  })
}

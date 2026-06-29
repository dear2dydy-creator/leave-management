import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { startDate, endDate, category, days, reason, note } = body

  const record = await db.leaveRecord.create({
    data: {
      employeeId: params.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category,
      days: parseFloat(days),
      reason: reason || null,
      note: note || null,
    },
  })
  return NextResponse.json({ record }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string; recordId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { startDate, endDate, category, days, reason, note } = body

  const record = await db.leaveRecord.update({
    where: { id: params.recordId },
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category,
      days: parseFloat(days),
      reason: reason || null,
      note: note || null,
    },
  })
  return NextResponse.json({ record })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; recordId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.leaveRecord.delete({ where: { id: params.recordId } })
  return NextResponse.json({ success: true })
}

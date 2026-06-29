import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; recordId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const record = await db.tardyRecord.findUnique({ where: { id: params.recordId } })
  if (!record || record.employeeId !== params.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.tardyRecord.delete({ where: { id: params.recordId } })
  // sync tardyCount from actual records
  const remaining = await db.tardyRecord.count({ where: { employeeId: params.id } })
  await db.employee.update({ where: { id: params.id }, data: { tardyCount: remaining } })

  return NextResponse.json({ success: true })
}

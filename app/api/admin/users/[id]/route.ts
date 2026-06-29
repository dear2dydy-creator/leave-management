import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userEmail = session.user?.email
  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Self-delete guard
  const currentUser = await db.adminUser.findUnique({ where: { email: userEmail } })
  if (currentUser?.id === params.id) {
    return NextResponse.json({ error: '자신의 계정은 삭제할 수 없습니다.' }, { status: 400 })
  }

  // Last admin guard
  const count = await db.adminUser.count()
  if (count <= 1) {
    return NextResponse.json({ error: '마지막 관리자 계정은 삭제할 수 없습니다.' }, { status: 400 })
  }

  await db.adminUser.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

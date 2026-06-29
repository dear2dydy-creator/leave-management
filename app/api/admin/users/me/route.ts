import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: '현재 비밀번호와 새 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  const admin = await db.adminUser.findUnique({ where: { email: session.user?.email ?? '' } })
  if (!admin) return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
  if (!valid) return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 })

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  })

  return NextResponse.json({ success: true })
}

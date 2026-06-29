import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await db.adminUser.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: '이름, 이메일, 비밀번호는 필수입니다.' }, { status: 400 })
  }

  const exists = await db.adminUser.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 400 })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.adminUser.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  return NextResponse.json({ user }, { status: 201 })
}

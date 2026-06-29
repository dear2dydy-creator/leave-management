import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin1234', 10)
  await db.adminUser.upsert({
    where: { email: 'admin@skycamp.com' },
    update: {},
    create: { name: '관리자', email: 'admin@skycamp.com', passwordHash: hash },
  })
  console.log('Seed complete: admin@skycamp.com / admin1234')
}

main().catch(console.error).finally(() => db.$disconnect())

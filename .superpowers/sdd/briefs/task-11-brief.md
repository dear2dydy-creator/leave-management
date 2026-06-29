### Task 11: 愿由ъ옄 ?ㅼ젙

**Files:**
- Create: `app/api/admin/route.ts`
- Create: `app/api/admin/[id]/route.ts`
- Create: `app/(dashboard)/settings/page.tsx`

- [ ] **Step 1: `app/api/admin/route.ts` ?묒꽦**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admins = await db.adminUser.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ admins })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, password } = await req.json()
  const exists = await db.adminUser.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: '?대? 議댁옱?섎뒗 ?대찓?? }, { status: 400 })

  const passwordHash = await bcrypt.hash(password, 10)
  const admin = await db.adminUser.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  return NextResponse.json({ admin }, { status: 201 })
}
```

- [ ] **Step 2: `app/api/admin/[id]/route.ts` ?묒꽦**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, password } = await req.json()
  const data: any = { name }
  if (password) data.passwordHash = await bcrypt.hash(password, 10)

  const admin = await db.adminUser.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, createdAt: true },
  })
  return NextResponse.json({ admin })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const count = await db.adminUser.count()
  if (count <= 1) return NextResponse.json({ error: '留덉?留?愿由ъ옄????젣?????놁뒿?덈떎' }, { status: 400 })

  await db.adminUser.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: `app/(dashboard)/settings/page.tsx` ?묒꽦**

```typescript
'use client'
import { useEffect, useState } from 'react'

type Admin = { id: string; name: string; email: string; createdAt: string }

export default function SettingsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)

  function load() {
    fetch('/api/admin').then(r => r.json()).then(d => setAdmins(d.admins ?? []))
  }
  useEffect(() => { load() }, [])

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) { setShowForm(false); setForm({ name: '', email: '', password: '' }); load() }
    else { const d = await res.json(); alert(d.error) }
  }

  async function deleteAdmin(id: string) {
    if (!confirm('??젣?섏떆寃좎뒿?덇퉴?')) return
    const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' })
    if (res.ok) load()
    else { const d = await res.json(); alert(d.error) }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">愿由ъ옄 ?ㅼ젙</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          {showForm ? '痍⑥냼' : '+ 愿由ъ옄 異붽?'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addAdmin} className="bg-white rounded-lg shadow p-6 mb-6 space-y-3">
          <h3 className="font-medium">??愿由ъ옄 異붽?</h3>
          {[['?대쫫','name','text'],['?대찓??,'email','email'],['鍮꾨?踰덊샇','password','password']].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input type={type} value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border rounded px-3 py-2 mt-1" required />
            </div>
          ))}
          <button type="submit" disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? '異붽? 以?..' : '異붽?'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {['?대쫫','?대찓??,'?깅줉??,''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{admin.name}</td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(admin.createdAt).toLocaleDateString('ko-KR')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteAdmin(admin.id)}
                    className="text-red-600 hover:underline text-xs">??젣</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 釉뚮씪?곗? ?숈옉 ?뺤씤**

?ㅼ젙 ?섏씠吏 ??愿由ъ옄 紐⑸줉 ?쒖떆 ?뺤씤. ??愿由ъ옄 異붽? ??濡쒓렇?꾩썐 ????怨꾩젙?쇰줈 濡쒓렇???뺤씤.

- [ ] **Step 5: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: admin account management (add/delete)"
```

---

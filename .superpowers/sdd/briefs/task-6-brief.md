### Task 6: ??쒕낫??& 吏곸썝 ?섏씠吏 UI

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/page.tsx`
- Create: `app/(dashboard)/employees/new/page.tsx`
- Create: `app/(dashboard)/employees/[id]/page.tsx`
- Create: `components/EmployeeTable.tsx`
- Create: `components/EmployeeForm.tsx`
- Create: `components/LeaveBalanceCard.tsx`

**Interfaces:**
- Consumes: `GET /api/employees`, `GET /api/employees/[id]`, `POST /api/employees`, `PUT /api/employees/[id]`

- [ ] **Step 1: `app/(dashboard)/layout.tsx` ?묒꽦**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const links = [
    { href: '/', label: '??쒕낫?? },
    { href: '/calendar', label: '?щ젰' },
    { href: '/settings', label: '愿由ъ옄 ?ㅼ젙' },
  ]
  return (
    <div className="min-h-screen flex">
      <aside className="w-48 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-lg font-bold mb-6">?곗썡李?愿由?/h1>
        <nav className="flex-1 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`block px-3 py-2 rounded text-sm ${pathname === l.href ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-400 hover:text-white mt-4">濡쒓렇?꾩썐</button>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: `components/EmployeeTable.tsx` ?묒꽦**

```typescript
'use client'
import Link from 'next/link'

type EmployeeRow = {
  id: string; name: string; company: string; department: string; position: string
  hireDate: string; terminationDate: string | null
  periodStart: string; periodEnd: string
  allocatedDays: number; bonusDays: number; deductionDays: number
  usedDays: number; remainingDays: number
}

const COMPANY_LABEL: Record<string, string> = { SKYCAMP: '?ㅼ뭅?댁틺??, SKYAN: '?ㅼ뭅?댁븻' }
const DEPT_LABEL: Record<string, string> = { SALES: '?곸뾽遺', SALES_SUPPORT: '?곸뾽吏?먮?' }

export default function EmployeeTable({ employees }: { employees: EmployeeRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['?대쫫','?뚯궗','遺??,'吏곴툒','?곸슜湲곌컙','諛쒖깮','異붽?','怨듭젣','?ъ슜','?붿뿬'].map(h => (
              <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}
              className={`border-t hover:bg-gray-50 ${emp.terminationDate ? 'opacity-50' : ''}`}>
              <td className="px-3 py-2">
                <Link href={`/employees/${emp.id}`} className="text-blue-600 hover:underline font-medium">
                  {emp.name}{emp.terminationDate ? ' (?댁궗)' : ''}
                </Link>
              </td>
              <td className="px-3 py-2">{COMPANY_LABEL[emp.company]}</td>
              <td className="px-3 py-2">{DEPT_LABEL[emp.department]}</td>
              <td className="px-3 py-2">{emp.position}</td>
              <td className="px-3 py-2 text-xs text-gray-500">
                {new Date(emp.periodStart).toLocaleDateString('ko-KR')} ~{' '}
                {new Date(emp.periodEnd).toLocaleDateString('ko-KR')}
              </td>
              <td className="px-3 py-2 text-center">{emp.allocatedDays}</td>
              <td className="px-3 py-2 text-center">{emp.bonusDays}</td>
              <td className="px-3 py-2 text-center">{emp.deductionDays}</td>
              <td className="px-3 py-2 text-center">{emp.usedDays}</td>
              <td className={`px-3 py-2 text-center font-semibold ${emp.remainingDays < 0 ? 'text-red-600' : ''}`}>
                {emp.remainingDays}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: `app/(dashboard)/page.tsx` ?묒꽦**

```typescript
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EmployeeTable from '@/components/EmployeeTable'

export default function DashboardPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/employees').then(r => r.json()).then(d => {
      setEmployees(d.employees)
      setLoading(false)
    })
  }, [])

  async function handleExport() {
    const res = await fetch('/api/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `?곗썡李④?由?${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">吏곸썝 ?곗썡李??꾪솴</h2>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm">?묒? ?대낫?닿린</button>
          <Link href="/employees/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            + 吏곸썝 異붽?
          </Link>
        </div>
      </div>
      {loading ? <p>遺덈윭?ㅻ뒗 以?..</p> : <EmployeeTable employees={employees} />}
    </div>
  )
}
```

- [ ] **Step 4: `components/EmployeeForm.tsx` ?묒꽦**

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormData = {
  name: string; company: string; department: string; position: string
  hireDate: string; terminationDate: string
}

export default function EmployeeForm({ initial, id }: { initial?: Partial<FormData>; id?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name: '', company: 'SKYCAMP', department: 'SALES', position: '?ъ썝',
    hireDate: '', terminationDate: '', ...initial,
  })
  const [saving, setSaving] = useState(false)

  function update(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = { ...form, terminationDate: form.terminationDate || null }
    if (id) {
      await fetch(`/api/employees/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch('/api/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setSaving(false)
    router.push('/')
    router.refresh()
  }

  const field = (label: string, key: keyof FormData, type = 'text', opts?: { options?: {v:string,l:string}[] }) => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {opts?.options ? (
        <select value={form[key]} onChange={e => update(key, e.target.value)}
          className="w-full border rounded px-3 py-2">
          {opts.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e => update(key, e.target.value)}
          className="w-full border rounded px-3 py-2" required={key === 'name' || key === 'hireDate'} />
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow space-y-4">
      {field('?대쫫', 'name')}
      {field('?뚯궗', 'company', 'text', { options: [{v:'SKYCAMP',l:'?ㅼ뭅?댁틺??},{v:'SKYAN',l:'?ㅼ뭅?댁븻'}] })}
      {field('遺??, 'department', 'text', { options: [{v:'SALES',l:'?곸뾽遺'},{v:'SALES_SUPPORT',l:'?곸뾽吏?먮?'}] })}
      {field('吏곴툒', 'position')}
      {field('?낆궗??, 'hireDate', 'date')}
      {field('?댁궗??(?좏깮)', 'terminationDate', 'date')}
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? '???以?..' : (id ? '?섏젙' : '異붽?')}
        </button>
        <button type="button" onClick={() => router.back()}
          className="flex-1 border py-2 rounded hover:bg-gray-50">痍⑥냼</button>
      </div>
    </form>
  )
}
```

- [ ] **Step 5: `app/(dashboard)/employees/new/page.tsx` ?묒꽦**

```typescript
import EmployeeForm from '@/components/EmployeeForm'

export default function NewEmployeePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">吏곸썝 異붽?</h2>
      <EmployeeForm />
    </div>
  )
}
```

- [ ] **Step 6: `components/LeaveBalanceCard.tsx` ?묒꽦**

```typescript
'use client'
import { useState } from 'react'

type Balance = {
  id: string | null; periodStart: string; periodEnd: string
  allocatedDays: number; allocatedDaysOverride: number | null
  bonusDays: number; deductionDays: number; usedDays: number; remainingDays: number; note: string | null
}

export default function LeaveBalanceCard({ balance, employeeId, onUpdated }: {
  balance: Balance; employeeId: string; onUpdated: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [override, setOverride] = useState(balance.allocatedDaysOverride?.toString() ?? '')
  const [bonus, setBonus] = useState(balance.bonusDays.toString())
  const [deduction, setDeduction] = useState(balance.deductionDays.toString())
  const [note, setNote] = useState(balance.note ?? '')

  async function save() {
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allocatedDaysOverride: override !== '' ? parseFloat(override) : null,
        bonusDays: parseFloat(bonus) || 0,
        deductionDays: parseFloat(deduction) || 0,
        balanceNote: note || null,
      }),
    })
    setEditing(false)
    onUpdated()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">???붿감 ?꾪솴</h3>
        <button onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 hover:underline">{editing ? '痍⑥냼' : '?섏젙'}</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(balance.periodStart).toLocaleDateString('ko-KR')} ~{' '}
        {new Date(balance.periodEnd).toLocaleDateString('ko-KR')}
      </p>
      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">諛쒖깮?쇱닔 (鍮꾩썙?먮㈃ ?먮룞怨꾩궛)</label>
            <input type="number" step="0.5" value={override} onChange={e => setOverride(e.target.value)}
              placeholder={`?먮룞: ${balance.allocatedDays}`}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">異붽??쇱닔</label>
            <input type="number" step="0.5" value={bonus} onChange={e => setBonus(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">怨듭젣?쇱닔</label>
            <input type="number" step="0.5" value={deduction} onChange={e => setDeduction(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">鍮꾧퀬</label>
            <input value={note} onChange={e => setNote(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <button onClick={save} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">???/button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            ['諛쒖깮', balance.allocatedDays],
            ['異붽?', balance.bonusDays],
            ['怨듭젣', balance.deductionDays],
            ['?ъ슜', balance.usedDays],
            ['?붿뿬', balance.remainingDays],
          ].map(([label, val]) => (
            <div key={label as string} className={`p-3 rounded ${label === '?붿뿬' && (val as number) < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="text-xs text-gray-500">{label}</div>
              <div className={`text-xl font-bold ${label === '?붿뿬' && (val as number) < 0 ? 'text-red-600' : ''}`}>{val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: `app/(dashboard)/employees/[id]/page.tsx` ?묒꽦**

```typescript
'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LeaveBalanceCard from '@/components/LeaveBalanceCard'

const COMPANY_LABEL: Record<string, string> = { SKYCAMP: '?ㅼ뭅?댁틺??, SKYAN: '?ㅼ뭅?댁븻' }
const DEPT_LABEL: Record<string, string> = { SALES: '?곸뾽遺', SALES_SUPPORT: '?곸뾽吏?먮?' }

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  const load = useCallback(() => {
    fetch(`/api/employees/${id}`).then(r => r.json()).then(setData)
  }, [id])

  useEffect(() => { load() }, [load])

  if (!data) return <p className="p-8">遺덈윭?ㅻ뒗 以?..</p>

  const { employee, balance, leaveRecords } = data

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{employee.name}</h2>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/employees/${id}/edit`)}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">?섏젙</button>
          <button onClick={() => router.back()}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">?ㅻ줈</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-500">?뚯궗</span> {COMPANY_LABEL[employee.company]}</div>
        <div><span className="text-gray-500">遺??/span> {DEPT_LABEL[employee.department]}</div>
        <div><span className="text-gray-500">吏곴툒</span> {employee.position}</div>
        <div><span className="text-gray-500">?꾩쟻 吏媛?/span> {employee.tardyCount}??/div>
        <div><span className="text-gray-500">?낆궗??/span> {new Date(employee.hireDate).toLocaleDateString('ko-KR')}</div>
        <div><span className="text-gray-500">?댁궗??/span> {employee.terminationDate ? new Date(employee.terminationDate).toLocaleDateString('ko-KR') : '-'}</div>
      </div>

      <LeaveBalanceCard balance={balance} employeeId={id} onUpdated={load} />

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">?닿? ?ъ슜?댁뿭</h3>
        <p className="text-sm text-gray-400">??Task 7?먯꽌 援ы쁽</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: 釉뚮씪?곗??먯꽌 ?숈옉 ?뺤씤**

```bash
npm run dev
```

- ??쒕낫??`/`) ??吏곸썝 ?놁쑝硫?鍮??뚯씠釉??뺤씤
- `/employees/new` ??吏곸썝 異붽? ???묒꽦 ???쒖텧 ????쒕낫??由щ떎?대젆???뺤씤
- 吏곸썝 ?대쫫 ?대┃ ???곸꽭 ?섏씠吏 ?????붿감 ?꾪솴 移대뱶 ?뺤씤

- [ ] **Step 9: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: dashboard, employee list/detail/create UI"
```

---

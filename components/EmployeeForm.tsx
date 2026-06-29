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
    name: '', company: 'SKYCAMP', department: 'SALES', position: '사원',
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
      {field('이름', 'name')}
      {field('회사', 'company', 'text', { options: [{v:'SKYCAMP',l:'스카이캠프'},{v:'SKYAN',l:'스카이앤'}] })}
      {field('부서', 'department', 'text', { options: [{v:'SALES',l:'영업부'},{v:'SALES_SUPPORT',l:'영업지원부'}] })}
      {field('직책', 'position')}
      {field('입사일', 'hireDate', 'date')}
      {field('퇴사일 (선택)', 'terminationDate', 'date')}
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? '저장 중...' : (id ? '수정' : '추가')}
        </button>
        <button type="button" onClick={() => router.back()}
          className="flex-1 border py-2 rounded hover:bg-gray-50">취소</button>
      </div>
    </form>
  )
}

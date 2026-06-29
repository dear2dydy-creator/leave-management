'use client'
import { useState } from 'react'

const CATEGORIES = [
  { v: 'ANNUAL', l: '연차' },
  { v: 'MONTHLY', l: '월차' },
  { v: 'HALF', l: '반차' },
  { v: 'SICK', l: '병가' },
  { v: 'PUBLIC', l: '공가' },
  { v: 'ABSENCE', l: '결근' },
  { v: 'OTHER', l: '기타' },
]

type FormData = {
  startDate: string
  endDate: string
  category: string
  days: string
  reason: string
  note: string
}

export default function LeaveRecordModal({
  employeeId,
  initial,
  onClose,
  onSaved,
}: {
  employeeId: string
  initial?: { id: string } & Partial<FormData>
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormData>({
    startDate: '',
    endDate: '',
    category: 'ANNUAL',
    days: '1',
    reason: '',
    note: '',
    ...initial,
  })
  const [saving, setSaving] = useState(false)

  function update(k: keyof FormData, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = initial?.id
        ? `/api/employees/${employeeId}/leave-records/${initial.id}`
        : `/api/employees/${employeeId}/leave-records`
      const res = await fetch(url, {
        method: initial?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: '오류가 발생했습니다' }))
        alert(msg.error ?? '저장 실패')
        return
      }
      onSaved()
      onClose()
    } catch {
      alert('저장 중 오류가 발생했습니다')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="font-semibold text-lg mb-4">{initial?.id ? '휴가 수정' : '휴가 추가'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">시작일</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => update('startDate', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">종료일</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => update('endDate', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">유형</label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                {CATEGORIES.map(c => (
                  <option key={c.v} value={c.v}>
                    {c.l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">일수</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={form.days}
                onChange={e => update('days', e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">사유</label>
            <input
              value={form.reason}
              onChange={e => update('reason', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">비고</label>
            <input
              value={form.note}
              onChange={e => update('note', e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

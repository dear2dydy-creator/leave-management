'use client'
import { useState } from 'react'
import DateInput from '@/components/DateInput'

type LoaRecord = {
  id: string
  startDate: string
  endDate: string
  type: 'DEEMED' | 'PERSONAL'
  note: string | null
}

const TYPE_LABEL: Record<string, string> = {
  DEEMED: '출근간주 (육아/산재/출산)',
  PERSONAL: '개인/병가',
}

const TYPE_COLOR: Record<string, string> = {
  DEEMED: 'bg-blue-100 text-blue-700',
  PERSONAL: 'bg-orange-100 text-orange-700',
}

function daysBetween(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.round(ms / 86400000) + 1
}

export default function LeaveOfAbsenceSection({
  employeeId,
  records,
  onChanged,
}: {
  employeeId: string
  records: LoaRecord[]
  onChanged: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ startDate: '', endDate: '', type: 'PERSONAL', note: '' })
  const [saving, setSaving] = useState(false)

  const personalDays = records
    .filter(r => r.type === 'PERSONAL')
    .reduce((sum, r) => sum + daysBetween(r.startDate, r.endDate), 0)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/employees/${employeeId}/leave-of-absence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { alert('저장 실패'); return }
      setForm({ startDate: '', endDate: '', type: 'PERSONAL', note: '' })
      setShowForm(false)
      onChanged()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/employees/${employeeId}/leave-of-absence/${id}`, { method: 'DELETE' })
    onChanged()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-lg">휴직 기간</h3>
          {personalDays > 0 && (
            <p className="text-xs text-orange-600 mt-0.5">
              개인/병가 휴직 {personalDays}일 → 연차 계산 시 유효 근무기간에서 차감
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          + 추가
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="border rounded p-4 mb-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">시작일</label>
              <div className="mt-1">
                <DateInput value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">종료일</label>
              <div className="mt-1">
                <DateInput value={form.endDate} onChange={v => setForm(f => ({ ...f, endDate: v }))} required />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">유형</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
            >
              <option value="PERSONAL">개인/병가 (근속기간 차감)</option>
              <option value="DEEMED">출근간주 — 육아·산재·출산 (연차 영향 없음)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">비고</label>
            <input
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="예: 육아휴직, 산재 요양 등"
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? '저장 중...' : '저장'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100">
              취소
            </button>
          </div>
        </form>
      )}

      {records.length === 0 ? (
        <p className="text-sm text-gray-400">등록된 휴직 기간이 없습니다.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2 font-medium">시작일</th>
              <th className="pb-2 font-medium">종료일</th>
              <th className="pb-2 font-medium">일수</th>
              <th className="pb-2 font-medium">유형</th>
              <th className="pb-2 font-medium">비고</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2">{new Date(r.startDate).toLocaleDateString('ko-KR')}</td>
                <td className="py-2">{new Date(r.endDate).toLocaleDateString('ko-KR')}</td>
                <td className="py-2">{daysBetween(r.startDate, r.endDate)}일</td>
                <td className="py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLOR[r.type]}`}>
                    {TYPE_LABEL[r.type]}
                  </span>
                </td>
                <td className="py-2 text-gray-500">{r.note ?? '-'}</td>
                <td className="py-2 text-right">
                  <button onClick={() => handleDelete(r.id)}
                    className="text-red-500 hover:text-red-700 text-xs">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'

export default function TardyModal({
  employeeId,
  tardyCount,
  onClose,
  onSaved,
}: {
  employeeId: string
  tardyCount: number
  onClose: () => void
  onSaved: () => void
}) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [dates, setDates] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ deducted: boolean; newCount: number } | null>(null)

  const nextCount = tardyCount + 1
  const willDeduct = nextCount % 3 === 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/employees/${employeeId}/tardy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, note: dates || null }),
    })
    const data = await res.json()
    setSaving(false)
    setResult({ deducted: data.deducted, newCount: data.employee.tardyCount })
    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="font-semibold text-lg mb-4">지각 기록</h3>
        {result ? (
          <div className="text-center space-y-3">
            <p className="text-green-600 font-medium">현재 지각 횟수: {result.newCount}회</p>
            {result.deducted && (
              <p className="text-red-600 font-medium">반차(0.5일)가 자동 차감되었습니다.</p>
            )}
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-gray-600">
              현재 지각 횟수: <strong>{tardyCount}회</strong>
            </p>
            {willDeduct && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                이번 기록으로 3회가 채워져 반차(0.5일)가 자동 차감됩니다.
              </p>
            )}
            <div>
              <label className="text-sm font-medium">지각 날짜</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">지각 날짜 목록 (비고)</label>
              <input
                value={dates}
                onChange={e => setDates(e.target.value)}
                placeholder="예: 6/1, 6/5, 6/10"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '기록'}
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
        )}
      </div>
    </div>
  )
}

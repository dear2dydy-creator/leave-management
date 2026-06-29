'use client'
import { useState } from 'react'
import DateInput from '@/components/DateInput'

export default function TardyModal({
  employeeId,
  tardyCount,
  tardyRecords = [],
  onClose,
  onSaved,
}: {
  employeeId: string
  tardyCount: number
  tardyRecords?: { id: string; date: string }[]
  onClose: () => void
  onSaved: () => void
}) {
  const today = new Date().toISOString().slice(0, 10)
  const nextCount = tardyCount + 1
  const willDeduct = nextCount % 3 === 0

  // tardyRecords is ordered desc (newest first)
  // When deducting, last 2 records are the other 2 in this cycle
  const toDate = (d: string) => new Date(d).toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [prevDate1, setPrevDate1] = useState(
    willDeduct && tardyRecords[1] ? toDate(tardyRecords[1].date) : ''
  )
  const [prevDate2, setPrevDate2] = useState(
    willDeduct && tardyRecords[0] ? toDate(tardyRecords[0].date) : ''
  )
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ deducted: boolean; newCount: number } | null>(null)

  function formatDate(d: string) {
    return d.replace(/-/g, '.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const note = willDeduct
      ? `${formatDate(prevDate1)} / ${formatDate(prevDate2)} / ${formatDate(date)}`
      : null
    try {
      const res = await fetch(`/api/employees/${employeeId}/tardy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, note }),
      })
      if (!res.ok) {
        const msg = await res.json().catch(() => ({ error: '오류가 발생했습니다' }))
        alert(msg.error ?? '저장 실패')
        return
      }
      const data = await res.json()
      setResult({ deducted: data.deducted, newCount: data.employee.tardyCount })
      onSaved()
    } catch {
      alert('저장 중 오류가 발생했습니다')
    } finally {
      setSaving(false)
    }
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
            {willDeduct ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">차감되는 지각 3회 날짜를 입력하세요.</p>
                <div>
                  <label className="text-sm font-medium">1번째 지각일</label>
                  <div className="mt-1"><DateInput value={prevDate1} onChange={setPrevDate1} required /></div>
                </div>
                <div>
                  <label className="text-sm font-medium">2번째 지각일</label>
                  <div className="mt-1"><DateInput value={prevDate2} onChange={setPrevDate2} required /></div>
                </div>
                <div>
                  <label className="text-sm font-medium">3번째 지각일</label>
                  <div className="mt-1"><DateInput value={date} onChange={setDate} required /></div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium">지각 날짜</label>
                <div className="mt-1"><DateInput value={date} onChange={setDate} required /></div>
              </div>
            )}
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

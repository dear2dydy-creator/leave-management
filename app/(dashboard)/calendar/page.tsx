'use client'
import { useEffect, useState } from 'react'
import CalendarView, { CalRecord } from '@/components/CalendarView'

const COMPANY_OPTIONS = [
  { value: '', label: '전체 회사' },
  { value: 'SKYCAMP', label: '스카이캠프' },
  { value: 'SKYAN', label: '스카이앤' },
]

const DEPT_OPTIONS = [
  { value: '', label: '전체 부서' },
  { value: 'SALES', label: '영업부' },
  { value: 'SALES_SUPPORT', label: '영업지원부' },
]

export default function CalendarPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [company, setCompany] = useState('')
  const [department, setDepartment] = useState('')
  const [records, setRecords] = useState<CalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
      ...(company ? { company } : {}),
      ...(department ? { department } : {}),
    })
    fetch(`/api/calendar?${params}`)
      .then(r => r.json())
      .then(d => {
        setRecords(d.records ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [year, month, company, department])

  function prev() {
    if (month === 1) {
      setYear(y => y - 1)
      setMonth(12)
    } else {
      setMonth(m => m - 1)
    }
  }

  function next() {
    if (month === 12) {
      setYear(y => y + 1)
      setMonth(1)
    } else {
      setMonth(m => m + 1)
    }
  }

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={prev}
          className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm"
        >
          ← 이전 달
        </button>

        <h2 className="text-2xl font-bold">
          {year}년 {month}월
        </h2>

        <button
          onClick={next}
          className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm"
        >
          다음 달 →
        </button>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={company}
            onChange={e => setCompany(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-white"
          >
            {COMPANY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm bg-white"
          >
            {DEPT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { cat: 'ANNUAL', label: '연차', color: 'bg-blue-200 text-blue-800' },
          { cat: 'MONTHLY', label: '월차', color: 'bg-green-200 text-green-800' },
          { cat: 'HALF', label: '반차', color: 'bg-yellow-200 text-yellow-800' },
          { cat: 'SICK', label: '병가', color: 'bg-purple-200 text-purple-800' },
          { cat: 'PUBLIC', label: '공가', color: 'bg-teal-200 text-teal-800' },
          { cat: 'ABSENCE', label: '결근', color: 'bg-red-200 text-red-800' },
          { cat: 'OTHER', label: '기타', color: 'bg-gray-200 text-gray-700' },
        ].map(({ label, color }) => (
          <span key={label} className={`text-xs px-2 py-0.5 rounded ${color}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <p className="text-gray-500 text-center py-8">불러오는 중...</p>
        ) : (
          <CalendarView year={year} month={month} records={records} />
        )}
      </div>
    </div>
  )
}

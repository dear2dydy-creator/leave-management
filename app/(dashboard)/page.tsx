'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EmployeeTable from '@/components/EmployeeTable'

type SortKey = 'name' | 'hireDate' | 'remainingDays' | 'usedDays'

const SORT_LABELS: Record<SortKey, string> = {
  name: '이름',
  hireDate: '입사일',
  usedDays: '사용일수',
  remainingDays: '잔여일수',
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dept, setDept] = useState('ALL')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [asc, setAsc] = useState(true)

  useEffect(() => {
    fetch('/api/employees')
      .then(r => r.json())
      .then(d => { setEmployees(d.employees ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleExport() {
    const res = await fetch('/api/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `연월차현황_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = employees
    .filter(e => dept === 'ALL' || e.department === dept)
    .sort((a, b) => {
      let v = 0
      if (sortKey === 'name') v = a.name.localeCompare(b.name, 'ko')
      else if (sortKey === 'hireDate') v = new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime()
      else if (sortKey === 'remainingDays') v = a.remainingDays - b.remainingDays
      else if (sortKey === 'usedDays') v = a.usedDays - b.usedDays
      return asc ? v : -v
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">직원 연월차 현황</h2>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm">엑셀 다운로드</button>
          <Link href="/employees/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            + 직원 추가
          </Link>
        </div>
      </div>

      <div className="flex gap-3 mb-4 items-center">
        <select
          value={dept}
          onChange={e => setDept(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="ALL">전체 부서</option>
          <option value="SALES_SUPPORT">영업지원부</option>
          <option value="SALES">영업부</option>
        </select>

        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="border rounded px-3 py-1.5 text-sm"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map(k => (
            <option key={k} value={k}>{SORT_LABELS[k]} 순</option>
          ))}
        </select>

        <button
          onClick={() => setAsc(v => !v)}
          className="border rounded px-3 py-1.5 text-sm hover:bg-gray-100 flex items-center gap-1"
        >
          {asc ? '▲ 오름차순' : '▼ 내림차순'}
        </button>
      </div>

      {loading ? <p>불러오는 중...</p> : <EmployeeTable employees={filtered} />}
    </div>
  )
}

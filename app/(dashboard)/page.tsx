'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EmployeeTable from '@/components/EmployeeTable'

export default function DashboardPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
      {loading ? <p>불러오는 중...</p> : <EmployeeTable employees={employees} />}
    </div>
  )
}

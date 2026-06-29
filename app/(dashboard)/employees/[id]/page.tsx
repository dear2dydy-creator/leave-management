'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LeaveBalanceCard from '@/components/LeaveBalanceCard'

const COMPANY_LABEL: Record<string, string> = { SKYCAMP: '스카이캠프', SKYAN: '스카이앤' }
const DEPT_LABEL: Record<string, string> = { SALES: '영업부', SALES_SUPPORT: '영업지원부' }

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null)

  const load = useCallback(() => {
    fetch(`/api/employees/${id}`).then(r => r.json()).then(setData)
  }, [id])

  useEffect(() => { load() }, [load])

  if (!data) return <p className="p-8">불러오는 중...</p>

  const { employee, balance } = data

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{employee.name}</h2>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/employees/${id}/edit`)}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">수정</button>
          <button onClick={() => router.back()}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">뒤로</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-500">회사</span> {COMPANY_LABEL[employee.company]}</div>
        <div><span className="text-gray-500">부서</span> {DEPT_LABEL[employee.department]}</div>
        <div><span className="text-gray-500">직책</span> {employee.position}</div>
        <div><span className="text-gray-500">지각 횟수</span> {employee.tardyCount}회</div>
        <div><span className="text-gray-500">입사일</span> {new Date(employee.hireDate).toLocaleDateString('ko-KR')}</div>
        <div><span className="text-gray-500">퇴사일</span> {employee.terminationDate ? new Date(employee.terminationDate).toLocaleDateString('ko-KR') : '-'}</div>
      </div>

      <LeaveBalanceCard balance={balance} employeeId={id} onUpdated={load} />

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">휴가 사용내역</h3>
        <p className="text-sm text-gray-400">← Task 7에서 구현</p>
      </div>
    </div>
  )
}

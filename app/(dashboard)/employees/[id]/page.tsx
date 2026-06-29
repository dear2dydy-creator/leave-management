'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LeaveBalanceCard from '@/components/LeaveBalanceCard'
import LeaveRecordTable from '@/components/LeaveRecordTable'
import LeaveRecordModal from '@/components/LeaveRecordModal'
import TardyModal from '@/components/TardyModal'
import TardyRecordTable from '@/components/TardyRecordTable'

const COMPANY_LABEL: Record<string, string> = { SKYCAMP: '스카이캠프', SKYAN: '스카이앤' }
const DEPT_LABEL: Record<string, string> = { SALES: '영업부', SALES_SUPPORT: '영업지원부' }

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editRecord, setEditRecord] = useState<any>(null)
  const [showTardy, setShowTardy] = useState(false)

  const load = useCallback(() => {
    fetch(`/api/employees/${id}`).then(r => r.json()).then(setData)
  }, [id])

  useEffect(() => { load() }, [load])

  if (!data) return <p className="p-8">불러오는 중...</p>

  const { employee, balance, leaveRecords, tardyRecords } = data

  async function handleDelete(recordId: string) {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/employees/${id}/leave-records/${recordId}`, { method: 'DELETE' })
    load()
  }

  async function handleTardyDelete(recordId: string) {
    if (!confirm('지각 기록을 삭제하면 지각 횟수가 1 감소합니다. 삭제하시겠습니까?')) return
    await fetch(`/api/employees/${id}/tardy/${recordId}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{employee.name}</h2>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/employees/${id}/edit`)}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">수정</button>
          <button onClick={async () => {
            if (!confirm(`${employee.name} 직원을 삭제하시겠습니까?\n모든 휴가 기록도 함께 삭제됩니다.`)) return
            await fetch(`/api/employees/${id}`, { method: 'DELETE' })
            router.push('/')
          }} className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm">삭제</button>
          <button onClick={() => router.back()}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">뒤로</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4 text-sm text-gray-900">
        <div><span className="text-gray-500 mr-1">회사</span>{COMPANY_LABEL[employee.company]}</div>
        <div><span className="text-gray-500 mr-1">부서</span>{DEPT_LABEL[employee.department]}</div>
        <div><span className="text-gray-500 mr-1">직책</span>{employee.position}</div>
        <div><span className="text-gray-500 mr-1">지각 횟수</span>{employee.tardyCount}회</div>
        <div><span className="text-gray-500 mr-1">입사일</span>{new Date(employee.hireDate).toLocaleDateString('ko-KR')}</div>
        <div><span className="text-gray-500 mr-1">퇴사일</span>{employee.terminationDate ? new Date(employee.terminationDate).toLocaleDateString('ko-KR') : '-'}</div>
      </div>

      <LeaveBalanceCard balance={balance} employeeId={id} onUpdated={load} />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">휴가 사용내역</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTardy(true)}
              className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
            >
              지각 기록
            </button>
            <button
              onClick={() => { setEditRecord(null); setShowModal(true) }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              + 추가
            </button>
          </div>
        </div>
        <LeaveRecordTable
          records={leaveRecords ?? []}
          onEdit={r => { setEditRecord(r); setShowModal(true) }}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <LeaveRecordModal
          employeeId={id}
          initial={editRecord}
          onClose={() => setShowModal(false)}
          onSaved={load}
        />
      )}

      <TardyRecordTable
        records={tardyRecords ?? []}
        onDelete={handleTardyDelete}
      />

      {showTardy && (
        <TardyModal
          employeeId={id}
          tardyCount={employee.tardyCount}
          onClose={() => setShowTardy(false)}
          onSaved={load}
        />
      )}
    </div>
  )
}

'use client'
import Link from 'next/link'

type EmployeeRow = {
  id: string; name: string; company: string; department: string; position: string
  hireDate: string; terminationDate: string | null
  periodStart: string; periodEnd: string
  allocatedDays: number; bonusDays: number; deductionDays: number
  usedDays: number; remainingDays: number
}

const COMPANY_LABEL: Record<string, string> = { SKYCAMP: '스카이캠프', SKYAN: '스카이앤' }
const DEPT_LABEL: Record<string, string> = { SALES: '영업부', SALES_SUPPORT: '영업지원부' }

export default function EmployeeTable({ employees }: { employees: EmployeeRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['이름', '회사', '부서', '직책', '적용기간', '발생', '추가', '제외', '사용', '잔여'].map(h => (
              <th key={h} className="px-3 py-2 text-left font-medium text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}
              className={`border-t hover:bg-gray-50 ${emp.terminationDate ? 'opacity-50' : ''}`}>
              <td className="px-3 py-2">
                <Link href={`/employees/${emp.id}`} className="text-blue-600 hover:underline font-medium">
                  {emp.name}{emp.terminationDate ? ' (퇴사)' : ''}
                </Link>
              </td>
              <td className="px-3 py-2">{COMPANY_LABEL[emp.company]}</td>
              <td className="px-3 py-2">{DEPT_LABEL[emp.department]}</td>
              <td className="px-3 py-2">{emp.position}</td>
              <td className="px-3 py-2 text-xs text-gray-600">
                {new Date(emp.periodStart).toLocaleDateString('ko-KR')} ~{' '}
                {new Date(emp.periodEnd).toLocaleDateString('ko-KR')}
              </td>
              <td className="px-3 py-2 text-center">{emp.allocatedDays}</td>
              <td className="px-3 py-2 text-center">{emp.bonusDays}</td>
              <td className="px-3 py-2 text-center">{emp.deductionDays}</td>
              <td className="px-3 py-2 text-center">{emp.usedDays}</td>
              <td className={`px-3 py-2 text-center font-semibold ${emp.remainingDays < 0 ? 'text-red-600' : ''}`}>
                {emp.remainingDays}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EmployeeForm from '@/components/EmployeeForm'

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initial, setInitial] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then(r => r.json())
      .then(d => {
        const e = d.employee
        setInitial({
          name: e.name,
          company: e.company,
          department: e.department,
          position: e.position,
          hireDate: new Date(e.hireDate).toISOString().slice(0, 10),
          terminationDate: e.terminationDate
            ? new Date(e.terminationDate).toISOString().slice(0, 10)
            : '',
        })
      })
  }, [id])

  if (!initial) return <p className="p-8">불러오는 중...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">직원 수정</h2>
      <EmployeeForm initial={initial} id={id} />
    </div>
  )
}

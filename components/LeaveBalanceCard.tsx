'use client'
import { useState } from 'react'

type Balance = {
  id: string | null; periodStart: string; periodEnd: string
  allocatedDays: number; allocatedDaysOverride: number | null
  bonusDays: number; deductionDays: number; usedDays: number; remainingDays: number; note: string | null
}

export default function LeaveBalanceCard({ balance, employeeId, onUpdated }: {
  balance: Balance; employeeId: string; onUpdated: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [override, setOverride] = useState(balance.allocatedDaysOverride?.toString() ?? '')
  const [bonus, setBonus] = useState(balance.bonusDays.toString())
  const [deduction, setDeduction] = useState(balance.deductionDays.toString())
  const [note, setNote] = useState(balance.note ?? '')

  async function save() {
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allocatedDaysOverride: override !== '' ? parseFloat(override) : null,
        bonusDays: parseFloat(bonus) || 0,
        deductionDays: parseFloat(deduction) || 0,
        balanceNote: note || null,
      }),
    })
    setEditing(false)
    onUpdated()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">연차 현황</h3>
        <button onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 hover:underline">{editing ? '취소' : '수정'}</button>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        {new Date(balance.periodStart).toLocaleDateString('ko-KR')} ~{' '}
        {new Date(balance.periodEnd).toLocaleDateString('ko-KR')}
      </p>
      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">발생일수 (비우면 자동계산)</label>
            <input type="number" step="0.5" value={override} onChange={e => setOverride(e.target.value)}
              placeholder={`자동: ${balance.allocatedDays}`}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">추가일수</label>
            <input type="number" step="0.5" value={bonus} onChange={e => setBonus(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">제외일수</label>
            <input type="number" step="0.5" value={deduction} onChange={e => setDeduction(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">비고</label>
            <input value={note} onChange={e => setNote(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <button onClick={save} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">저장</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            ['발생', balance.allocatedDays],
            ['추가', balance.bonusDays],
            ['제외', balance.deductionDays],
            ['사용', balance.usedDays],
            ['잔여', balance.remainingDays],
          ].map(([label, val]) => (
            <div key={label as string} className={`p-3 rounded ${label === '잔여' && (val as number) < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="text-xs text-gray-600 mb-1">{label}</div>
              <div className={`text-xl font-bold ${label === '잔여' && (val as number) < 0 ? 'text-red-600' : 'text-gray-900'}`}>{val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

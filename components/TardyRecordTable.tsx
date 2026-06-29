'use client'

type TardyRecord = {
  id: string
  date: string
  note: string | null
  createdAt: string
}

export default function TardyRecordTable({
  records,
  onDelete,
}: {
  records: TardyRecord[]
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">지각 내역 (누적 {records.length}회)</h3>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {['회차', '날짜', '비고', ''].map(h => (
              <th key={h} className="px-3 py-2 text-left font-medium text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-500">{records.length - i}회</td>
              <td className="px-3 py-2">{new Date(r.date).toLocaleDateString('ko-KR')}</td>
              <td className="px-3 py-2 text-gray-600">{r.note ?? '-'}</td>
              <td className="px-3 py-2">
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-red-600 hover:underline text-xs"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-gray-400">기록 없음</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

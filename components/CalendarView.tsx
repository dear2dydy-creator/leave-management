'use client'

export type CalRecord = {
  id: string
  employeeId: string
  employeeName: string
  company: string
  department: string
  startDate: string
  endDate: string
  category: string
  days: number
}

const CAT_COLOR: Record<string, string> = {
  ANNUAL: 'bg-blue-200 text-blue-800',
  MONTHLY: 'bg-green-200 text-green-800',
  HALF: 'bg-yellow-200 text-yellow-800',
  SICK: 'bg-purple-200 text-purple-800',
  PUBLIC: 'bg-teal-200 text-teal-800',
  ABSENCE: 'bg-red-200 text-red-800',
  OTHER: 'bg-gray-200 text-gray-700',
}

const CAT_LABEL: Record<string, string> = {
  ANNUAL: '연차',
  MONTHLY: '월차',
  HALF: '반차',
  SICK: '병가',
  PUBLIC: '공가',
  ABSENCE: '결근',
  OTHER: '기타',
}

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarView({
  year,
  month,
  records,
}: {
  year: number
  month: number
  records: CalRecord[]
}) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  // Build cells array: nulls for leading empty days, then day numbers
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function getRecordsForDay(day: number): CalRecord[] {
    const d = new Date(year, month - 1, day)
    return records.filter(r => {
      const s = new Date(r.startDate)
      const e = new Date(r.endDate)
      // Compare date-only (strip time)
      const sd = new Date(s.getFullYear(), s.getMonth(), s.getDate())
      const ed = new Date(e.getFullYear(), e.getMonth(), e.getDate())
      return d >= sd && d <= ed
    })
  }

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_KO.map((d, idx) => (
          <div
            key={d}
            className={`text-center text-sm font-semibold py-2 ${
              idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-t">
        {cells.map((day, i) => {
          const dow = i % 7
          const dayRecords = day ? getRecordsForDay(day) : []
          const isToday =
            day !== null &&
            new Date().getFullYear() === year &&
            new Date().getMonth() + 1 === month &&
            new Date().getDate() === day

          return (
            <div
              key={i}
              className={`border-r border-b min-h-[100px] p-1 ${
                day === null ? 'bg-gray-50' : ''
              }`}
            >
              {day !== null && (
                <>
                  <div
                    className={`text-sm font-medium mb-1 leading-none ${
                      isToday
                        ? 'w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white'
                        : dow === 0
                        ? 'text-red-500'
                        : dow === 6
                        ? 'text-blue-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayRecords.map(r => (
                      <div
                        key={r.id + '-' + day}
                        className={`text-xs px-1 py-0.5 rounded truncate ${CAT_COLOR[r.category] ?? 'bg-gray-200 text-gray-700'}`}
                        title={`${r.employeeName} — ${CAT_LABEL[r.category] ?? r.category}`}
                      >
                        {r.employeeName}{' '}
                        <span className="opacity-75">{CAT_LABEL[r.category] ?? r.category}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

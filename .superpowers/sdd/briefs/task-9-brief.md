### Task 9: ?щ젰 酉?
**Files:**
- Create: `app/api/calendar/route.ts`
- Create: `components/CalendarView.tsx`
- Create: `app/(dashboard)/calendar/page.tsx`

**Interfaces:**
- Produces: `GET /api/calendar?year=YYYY&month=M` ??`{ records: Array<{ employeeId, employeeName, startDate, endDate, category, days }> }`

- [ ] **Step 1: `app/api/calendar/route.ts` ?묒꽦**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') ?? new Date().getFullYear().toString())
  const month = parseInt(searchParams.get('month') ?? (new Date().getMonth() + 1).toString())

  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const records = await db.leaveRecord.findMany({
    where: { startDate: { gte: start, lt: end } },
    include: { employee: { select: { id: true, name: true } } },
    orderBy: { startDate: 'asc' },
  })

  return NextResponse.json({
    records: records.map(r => ({
      id: r.id, employeeId: r.employee.id, employeeName: r.employee.name,
      startDate: r.startDate, endDate: r.endDate, category: r.category, days: r.days,
    })),
  })
}
```

- [ ] **Step 2: `components/CalendarView.tsx` ?묒꽦**

```typescript
'use client'

type CalRecord = {
  id: string; employeeId: string; employeeName: string
  startDate: string; endDate: string; category: string; days: number
}

const CAT_COLOR: Record<string, string> = {
  ANNUAL:'bg-blue-200', MONTHLY:'bg-green-200', HALF:'bg-yellow-200',
  SICK:'bg-purple-200', PUBLIC:'bg-indigo-200', ABSENCE:'bg-red-200', OTHER:'bg-gray-200',
}
const CAT_LABEL: Record<string, string> = {
  ANNUAL:'?곗감', MONTHLY:'?붿감', HALF:'諛섏감', SICK:'蹂묎?', PUBLIC:'怨듦?', ABSENCE:'寃곌렐', OTHER:'湲고?',
}

const DAYS_KO = ['??,'??,'??,'??,'紐?,'湲?,'??]

export default function CalendarView({ year, month, records }: {
  year: number; month: number; records: CalRecord[]
}) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  function getRecordsForDay(day: number) {
    const d = new Date(year, month - 1, day)
    return records.filter(r => {
      const s = new Date(r.startDate)
      const e = new Date(r.endDate)
      return d >= new Date(s.getFullYear(), s.getMonth(), s.getDate()) &&
             d <= new Date(e.getFullYear(), e.getMonth(), e.getDate())
    })
  }

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_KO.map(d => (
          <div key={d} className={`text-center text-sm font-medium py-2 ${d === '?? ? 'text-red-500' : d === '?? ? 'text-blue-500' : 'text-gray-600'}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-t">
        {cells.map((day, i) => {
          const dayRecords = day ? getRecordsForDay(day) : []
          const dow = i % 7
          return (
            <div key={i} className="border-r border-b min-h-[100px] p-1">
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : ''}`}>{day}</div>
                  <div className="space-y-0.5">
                    {dayRecords.map(r => (
                      <div key={r.id} className={`text-xs px-1 py-0.5 rounded truncate ${CAT_COLOR[r.category]}`}
                        title={`${r.employeeName} - ${CAT_LABEL[r.category]}`}>
                        {r.employeeName} {CAT_LABEL[r.category]}
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
```

- [ ] **Step 3: `app/(dashboard)/calendar/page.tsx` ?묒꽦**

```typescript
'use client'
import { useEffect, useState } from 'react'
import CalendarView from '@/components/CalendarView'

export default function CalendarPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [records, setRecords] = useState([])

  useEffect(() => {
    fetch(`/api/calendar?year=${year}&month=${month}`)
      .then(r => r.json()).then(d => setRecords(d.records ?? []))
  }, [year, month])

  function prev() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={prev} className="px-3 py-1.5 border rounded hover:bg-gray-50">???댁쟾</button>
        <h2 className="text-2xl font-bold">{year}??{month}??/h2>
        <button onClick={next} className="px-3 py-1.5 border rounded hover:bg-gray-50">?ㅼ쓬 ??/button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <CalendarView year={year} month={month} records={records} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 釉뚮씪?곗? ?숈옉 ?뺤씤**

?щ젰 ?섏씠吏?먯꽌 ?닿? 湲곕줉???좎쭨???쒖떆?섎뒗吏 ?뺤씤. ?댁쟾/?ㅼ쓬 ???대룞 ?뺤씤.

- [ ] **Step 5: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: monthly calendar view with all employee leaves"
```

---

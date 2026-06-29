export function calculateAnnualLeave(hireDate: Date, referenceDate: Date = new Date()): number {
  const months = monthsDiff(hireDate, referenceDate)
  if (months < 12) return Math.min(months, 11)
  const years = Math.floor(months / 12)
  const bonus = Math.floor((years - 1) / 2)
  return Math.min(15 + bonus, 25)
}

export function calculateMonthlyLeave(
  periodStart: Date,
  absenceDates: Date[],
  referenceDate: Date = new Date()
): number {
  let count = 0
  let monthStart = new Date(periodStart)
  while (true) {
    const monthEnd = addMonths(monthStart, 1)
    if (monthEnd > referenceDate) break
    const hasAbsence = absenceDates.some(d => d >= monthStart && d < monthEnd)
    if (!hasAbsence) count++
    monthStart = monthEnd
  }
  return count
}

export function getCurrentPeriod(hireDate: Date, referenceDate: Date = new Date()): {
  start: Date
  end: Date
} {
  const months = monthsDiff(hireDate, referenceDate)
  const years = Math.floor(months / 12)
  const start = addMonths(hireDate, years * 12)
  const end = addMonths(start, 12)
  return { start, end }
}

function monthsDiff(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  const day = d.getDate()
  d.setMonth(d.getMonth() + months)
  // Handle month-end overflow (e.g. Jan 31 + 1 month → Feb 28, not Mar 3)
  if (d.getDate() !== day) d.setDate(0)
  return d
}

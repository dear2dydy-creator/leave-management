import { describe, it, expect } from 'vitest'
import { calculateAnnualLeave, calculateMonthlyLeave, getCurrentPeriod } from '../lib/leave-calculator'

describe('calculateAnnualLeave (영업지원부 연차)', () => {
  const hire = new Date('2024-01-14')

  it('1개월 미만 → 0일', () => {
    expect(calculateAnnualLeave(hire, new Date('2024-01-20'))).toBe(0)
  })
  it('1개월 → 1일', () => {
    expect(calculateAnnualLeave(hire, new Date('2024-02-14'))).toBe(1)
  })
  it('11개월 → 11일', () => {
    expect(calculateAnnualLeave(hire, new Date('2024-12-14'))).toBe(11)
  })
  it('12개월 → 15일', () => {
    expect(calculateAnnualLeave(hire, new Date('2025-01-14'))).toBe(15)
  })
  it('3년 → 16일', () => {
    expect(calculateAnnualLeave(hire, new Date('2027-01-14'))).toBe(16)
  })
  it('5년 → 17일', () => {
    expect(calculateAnnualLeave(hire, new Date('2029-01-14'))).toBe(17)
  })
  it('21년 → 25일(상한)', () => {
    expect(calculateAnnualLeave(hire, new Date('2045-01-14'))).toBe(25)
  })
})

describe('calculateMonthlyLeave (영업부 월차)', () => {
  const periodStart = new Date('2025-01-14')

  it('만근 1개월 → 1일', () => {
    expect(calculateMonthlyLeave(periodStart, [], new Date('2025-02-14'))).toBe(1)
  })
  it('기간 지나지 않은 달은 0일', () => {
    expect(calculateMonthlyLeave(periodStart, [], new Date('2025-01-20'))).toBe(0)
  })
  it('결근 있는 달은 발생 안함', () => {
    expect(calculateMonthlyLeave(periodStart, [new Date('2025-01-20')], new Date('2025-02-14'))).toBe(0)
  })
  it('3개월 만근 → 3일', () => {
    expect(calculateMonthlyLeave(periodStart, [], new Date('2025-04-14'))).toBe(3)
  })
  it('2달 중 1달 결근 → 1일', () => {
    expect(calculateMonthlyLeave(periodStart, [new Date('2025-02-01')], new Date('2025-03-14'))).toBe(1)
  })
})

describe('getCurrentPeriod', () => {
  it('입사 후 6개월 → 1년차 기간', () => {
    const hire = new Date('2025-01-14')
    const { start, end } = getCurrentPeriod(hire, new Date('2025-07-01'))
    expect(start.toISOString().slice(0, 10)).toBe('2025-01-14')
    expect(end.toISOString().slice(0, 10)).toBe('2026-01-14')
  })
  it('입사 후 14개월 → 2년차 기간', () => {
    const hire = new Date('2024-01-14')
    const { start, end } = getCurrentPeriod(hire, new Date('2025-03-01'))
    expect(start.toISOString().slice(0, 10)).toBe('2025-01-14')
    expect(end.toISOString().slice(0, 10)).toBe('2026-01-14')
  })
})

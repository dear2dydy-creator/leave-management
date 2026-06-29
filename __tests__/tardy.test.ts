import { describe, it, expect } from 'vitest'
import { calculateTardyDeduction } from '../lib/tardy'

describe('calculateTardyDeduction', () => {
  it('0 → 1: 차감 없음', () => {
    expect(calculateTardyDeduction(0)).toEqual({ deductCount: 0, newTardyCount: 1 })
  })
  it('1 → 2: 차감 없음', () => {
    expect(calculateTardyDeduction(1)).toEqual({ deductCount: 0, newTardyCount: 2 })
  })
  it('2 → 3: 반일 1회 차감', () => {
    expect(calculateTardyDeduction(2)).toEqual({ deductCount: 1, newTardyCount: 3 })
  })
  it('3 → 4: 차감 없음', () => {
    expect(calculateTardyDeduction(3)).toEqual({ deductCount: 0, newTardyCount: 4 })
  })
  it('5 → 6: 반일 1회 차감', () => {
    expect(calculateTardyDeduction(5)).toEqual({ deductCount: 1, newTardyCount: 6 })
  })
  it('0 → 3 (increment=3): 반일 1회 차감', () => {
    expect(calculateTardyDeduction(0, 3)).toEqual({ deductCount: 1, newTardyCount: 3 })
  })
  it('0 → 6 (increment=6): 반일 2회 차감', () => {
    expect(calculateTardyDeduction(0, 6)).toEqual({ deductCount: 2, newTardyCount: 6 })
  })
})

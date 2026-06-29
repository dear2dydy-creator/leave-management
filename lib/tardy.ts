export function calculateTardyDeduction(
  currentCount: number,
  increment: number = 1
): { deductCount: number; newTardyCount: number } {
  const newCount = currentCount + increment
  const deductCount = Math.floor(newCount / 3) - Math.floor(currentCount / 3)
  return { deductCount, newTardyCount: newCount }
}

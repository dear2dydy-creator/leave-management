import ExcelJS from 'exceljs'

const COMPANY_LABEL: Record<string, string> = {
  SKYCAMP: '스카이캠프',
  SKYAN: '스카이앤',
}

const DEPT_LABEL: Record<string, string> = {
  SALES: '영업부',
  SALES_SUPPORT: '영업지원부',
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

function formatPeriod(start: Date, end: Date): string {
  return `${formatDate(start)} ~ ${formatDate(end)}`
}

interface EmployeeExportData {
  id: string
  name: string
  company: string
  department: string
  position: string
  hireDate: Date
  terminationDate: Date | null
  periodStart: Date
  periodEnd: Date
  allocatedDays: number
  bonusDays: number
  deductionDays: number
  usedDays: number
  remainingDays: number
}

function applyHeaderStyle(row: ExcelJS.Row) {
  row.font = { bold: true }
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' },
  }
  row.alignment = { vertical: 'middle', horizontal: 'center' }
}

function buildDepartmentSheet(
  wb: ExcelJS.Workbook,
  sheetName: string,
  employees: EmployeeExportData[],
  allocatedLabel: string
) {
  const ws = wb.addWorksheet(sheetName)

  // Column definitions
  ws.columns = [
    { key: 'name', width: 12 },
    { key: 'company', width: 12 },
    { key: 'department', width: 14 },
    { key: 'position', width: 10 },
    { key: 'hireDate', width: 12 },
    { key: 'period', width: 24 },
    { key: 'allocated', width: 10 },
    { key: 'bonus', width: 8 },
    { key: 'deduction', width: 8 },
    { key: 'used', width: 8 },
    { key: 'remaining', width: 8 },
  ]

  // Header row
  const headerRow = ws.addRow([
    '이름',
    '회사',
    '부서',
    '직급',
    '입사일',
    '이번 기간',
    allocatedLabel,
    '추가',
    '공제',
    '사용',
    '잔여',
  ])
  applyHeaderStyle(headerRow)

  // Data rows
  employees.forEach(emp => {
    const row = ws.addRow([
      emp.name,
      COMPANY_LABEL[emp.company] ?? emp.company,
      DEPT_LABEL[emp.department] ?? emp.department,
      emp.position,
      formatDate(new Date(emp.hireDate)),
      formatPeriod(new Date(emp.periodStart), new Date(emp.periodEnd)),
      emp.allocatedDays,
      emp.bonusDays,
      emp.deductionDays,
      emp.usedDays,
      emp.remainingDays,
    ])

    // Right-align numeric columns (7-11, 1-indexed)
    ;[7, 8, 9, 10, 11].forEach(col => {
      const cell = row.getCell(col)
      cell.alignment = { horizontal: 'right' }
    })
  })
}

export async function buildExcel(employees: EmployeeExportData[]): Promise<ArrayBuffer> {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Leave Management System'
  wb.created = new Date()

  const salesEmployees = employees.filter(e => e.department === 'SALES')
  const salesSupportEmployees = employees.filter(e => e.department === 'SALES_SUPPORT')

  buildDepartmentSheet(wb, '영업부', salesEmployees, '발생 월차')
  buildDepartmentSheet(wb, '영업지원부', salesSupportEmployees, '발생 연차')

  return wb.xlsx.writeBuffer()
}

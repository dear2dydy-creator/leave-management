'use client'
import { useEffect, useRef, useState } from 'react'

export default function DateInput({
  value,
  onChange,
  required,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  required?: boolean
  disabled?: boolean
}) {
  const parse = (v: string) => {
    const p = v ? v.split('-') : []
    return { y: p[0] ?? '', m: p[1] ?? '', d: p[2] ?? '' }
  }

  const init = parse(value)
  const [year, setYear] = useState(init.y)
  const [month, setMonth] = useState(init.m)
  const [day, setDay] = useState(init.d)

  const monthRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)

  // Sync when parent resets or changes value externally
  useEffect(() => {
    const { y, m, d } = parse(value)
    setYear(y)
    setMonth(m)
    setDay(d)
  }, [value])

  function tryEmit(y: string, m: string, d: string) {
    if (y.length === 4 && m.length >= 1 && d.length >= 1) {
      onChange(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)
    }
  }

  function onYear(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setYear(v)
    if (v.length === 4) {
      tryEmit(v, month, day)
      monthRef.current?.focus()
    }
  }

  function onMonth(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 2)
    setMonth(v)
    tryEmit(year, v, day)
    if (v.length === 2) dayRef.current?.focus()
  }

  function onDay(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 2)
    setDay(v)
    tryEmit(year, month, v)
  }

  const base = 'outline-none text-center bg-transparent'

  return (
    <div className={`flex items-center border rounded px-3 py-2 gap-0.5 bg-white ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <input type="text" inputMode="numeric" placeholder="년"
        value={year} maxLength={4} disabled={disabled} required={required}
        onChange={onYear} className={`w-14 ${base}`} />
      <span className="text-gray-400 select-none">-</span>
      <input ref={monthRef} type="text" inputMode="numeric" placeholder="월"
        value={month} maxLength={2} disabled={disabled}
        onChange={onMonth} className={`w-8 ${base}`} />
      <span className="text-gray-400 select-none">-</span>
      <input ref={dayRef} type="text" inputMode="numeric" placeholder="일"
        value={day} maxLength={2} disabled={disabled}
        onChange={onDay} className={`w-8 ${base}`} />
    </div>
  )
}

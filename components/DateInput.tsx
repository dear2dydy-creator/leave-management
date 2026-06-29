'use client'
import { useRef } from 'react'

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
  const parts = value ? value.split('-') : ['', '', '']
  const y = parts[0] ?? ''
  const m = parts[1] ?? ''
  const d = parts[2] ?? ''

  const monthRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)

  function emit(year: string, month: string, day: string) {
    const yy = year.padStart(4, '0')
    const mm = month.padStart(2, '0')
    const dd = day.padStart(2, '0')
    if (year && month && day) onChange(`${yy}-${mm}-${dd}`)
  }

  return (
    <div className={`flex items-center border rounded px-3 py-2 gap-1 bg-white ${disabled ? 'opacity-50' : ''}`}>
      <input
        type="text"
        inputMode="numeric"
        placeholder="년"
        value={y}
        maxLength={4}
        disabled={disabled}
        required={required}
        onChange={e => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 4)
          emit(v, m, d)
          if (v.length === 4) monthRef.current?.focus()
        }}
        className="w-14 outline-none text-center"
      />
      <span className="text-gray-400">-</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        placeholder="월"
        value={m}
        maxLength={2}
        disabled={disabled}
        onChange={e => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 2)
          emit(y, v, d)
          if (v.length === 2) dayRef.current?.focus()
        }}
        className="w-8 outline-none text-center"
      />
      <span className="text-gray-400">-</span>
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        placeholder="일"
        value={d}
        maxLength={2}
        disabled={disabled}
        onChange={e => {
          const v = e.target.value.replace(/\D/g, '').slice(0, 2)
          emit(y, m, v)
        }}
        className="w-8 outline-none text-center"
      />
    </div>
  )
}

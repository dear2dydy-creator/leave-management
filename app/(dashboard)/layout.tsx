'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const links = [
    { href: '/', label: '대시보드' },
    { href: '/calendar', label: '캘린더' },
    { href: '/settings', label: '관리자 설정' },
  ]
  return (
    <div className="min-h-screen flex">
      <aside className="w-48 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-lg font-bold mb-6">연월차 관리</h1>
        <nav className="flex-1 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`block px-3 py-2 rounded text-sm ${pathname === l.href ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-400 hover:text-white mt-4">로그아웃</button>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}

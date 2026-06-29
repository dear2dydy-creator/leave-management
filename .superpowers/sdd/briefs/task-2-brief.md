### Task 2: ?몄쬆 (NextAuth.js)

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/layout.tsx` (SessionProvider ?섑븨)

**Interfaces:**
- Produces: `authOptions` ??`import { authOptions } from '@/lib/auth'`
- Produces: `/login` ?섏씠吏, ?몄쬆 誘몃뱾?⑥뼱

- [ ] **Step 1: `lib/auth.ts` ?묒꽦**

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const admin = await db.adminUser.findUnique({
          where: { email: credentials.email },
        })
        if (!admin) return null
        const valid = await bcrypt.compare(credentials.password, admin.passwordHash)
        if (!valid) return null
        return { id: admin.id, email: admin.email, name: admin.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
}
```

- [ ] **Step 2: `app/api/auth/[...nextauth]/route.ts` ?묒꽦**

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

- [ ] **Step 3: `middleware.ts` ?묒꽦**

```typescript
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 4: `app/layout.tsx` ?섏젙 ??SessionProvider ?섑븨**

```typescript
'use client'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: `app/(auth)/login/page.tsx` ?묒꽦**

```typescript
'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError('?대찓???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딆뒿?덈떎.')
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">?곗썡李?愿由??쒖뒪??/h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">?대찓??/label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">鍮꾨?踰덊샇</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50">
            {loading ? '濡쒓렇??以?..' : '濡쒓렇??}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 釉뚮씪?곗??먯꽌 濡쒓렇???뚯뒪??*

```bash
npm run dev
```

`http://localhost:3000` ?묒냽 ??`/login`?쇰줈 由щ떎?대젆???뺤씤.
`admin@skycamp.com` / `admin1234` 濡쒓렇????`/` 由щ떎?대젆???뺤씤.
?섎せ??鍮꾨?踰덊샇 ???ㅻ쪟 硫붿떆吏 ?뺤씤.

- [ ] **Step 7: 而ㅻ컠**

```bash
git add -A
git commit -m "feat: NextAuth credentials login with protected routes"
```

---

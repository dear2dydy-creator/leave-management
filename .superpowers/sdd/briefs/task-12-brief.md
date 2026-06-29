### Task 12: Vercel 諛고룷

**Files:**
- Modify: `.gitignore` (`.env.local` ?뺤씤)

- [ ] **Step 1: `.gitignore` ?뺤씤**

`.env.local`??`.gitignore`???ы븿?섏뼱 ?덈뒗吏 ?뺤씤. Next.js 湲곕낯 `.gitignore`?먮뒗 ?대? ?ы븿??

- [ ] **Step 2: GitHub ??μ냼 ?앹꽦 諛?push**

GitHub?먯꽌 ????μ냼 ?앹꽦 ??
```bash
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

- [ ] **Step 3: Vercel ?꾨줈?앺듃 ?앹꽦**

1. [vercel.com](https://vercel.com) ??"Add New Project" ??GitHub ??μ냼 ?곌껐
2. Framework Preset: Next.js (?먮룞 媛먯?)
3. Environment Variables ?ㅼ젙:
   - `DATABASE_URL` = Neon 肄섏넄?먯꽌 蹂듭궗??Connection String (pooling URL ?ъ슜)
   - `NEXTAUTH_SECRET` = `openssl rand -base64 32` 異쒕젰媛?   - `NEXTAUTH_URL` = `https://<your-vercel-domain>.vercel.app`
4. Deploy ?대┃

- [ ] **Step 4: 諛고룷 ??DB 留덉씠洹몃젅?댁뀡**

濡쒖뺄?먯꽌 Neon DB???ㅽ궎留??곸슜 (?대? 濡쒖뺄?먯꽌 ?꾨즺?먯쑝硫??ㅽ궢):
```bash
npx prisma migrate deploy
npx prisma db seed
```

- [ ] **Step 5: 諛고룷???ъ씠???숈옉 ?뺤씤**

- 濡쒓렇???숈옉 ?뺤씤 (`admin@skycamp.com` / `admin1234`)
- 吏곸썝 異붽?, ?닿? 湲곕줉, ?щ젰, ?묒? ?대낫?닿린 ?숈옉 ?뺤씤

- [ ] **Step 6: 理쒖쥌 而ㅻ컠**

```bash
git add -A
git commit -m "chore: final deployment configuration"
git push
```

---

## ?먯껜 寃??(Spec Coverage)

| ?ㅽ럺 ?붽뎄?ы빆 | 而ㅻ쾭 Task |
|---|---|
| ?곸뾽吏?먮? 洹쇰줈湲곗?踰??곗감 | Task 3, 5 |
| ?곸뾽遺 ?붿감 ?낆궗??湲곗? | Task 3, 5 |
| ?먮룞 怨꾩궛 + ?섎룞 override | Task 5, 6 |
| 吏媛?3??諛섏감 ?먮룞 李④컧 (?꾩쟻) | Task 4, 8 |
| 愿由ъ옄 濡쒓렇??(蹂듭닔 怨꾩젙) | Task 2, 11 |
| ??쒕낫??吏곸썝 ?꾪솴 | Task 6 |
| 吏곸썝 ?곸꽭 (湲곕낯?뺣낫 + ?붿븸 + 湲곕줉) | Task 6, 7 |
| ?닿? 異붽?/?섏젙/??젣 | Task 7 |
| ?щ젰 酉?| Task 9 |
| ?묒? ?대낫?닿린 | Task 10 |
| ?댁궗???뚰봽??泥섎━ | Task 5, 6 |
| Vercel 諛고룷 | Task 12 |

# SDD Progress Ledger
# Plan: docs/superpowers/plans/2026-06-25-leave-management.md

## Tasks

- [x] Task 1: 프로젝트 초기 설정 & 데이터베이스 스키마 (commit: 72e9a47, review clean — FK false positive confirmed)
- [x] Task 2: 인증 (NextAuth.js) (commits: 10a38a6..a0e024b, fix: providers split)
- [x] Task 3: 연차 계산 로직 (TDD) (commits: 7f73c28, review clean — 21/21 pass)
- [x] Task 4: 지각 처리 로직 (TDD) (commits: cb7d6ca, review clean — 21/21 pass)
  Minor: absence on period boundary semantics — clarify with business later
- [x] Task 5: Employee CRUD API (commit: f8862a8, review clean)
- [x] Task 6: 대시보드 & 직원 페이지 UI (commits: 4686572..b310603, fix: edit page added)
- [x] Task 7: 휴가 기록 CRUD (commit: 0045e35, fix: 5c5866b error handling)
- [x] Task 8: 지각 기록 (commit: 0045e35, fix: 5c5866b error handling)
- [x] Task 9: 달력 뷰 (commit: 0c81d72, review clean)
- [x] Task 10: 엑셀 내보내기 (commit: 8f79a26, review clean)
- [x] Task 11: 관리자 설정 (commits: 512b8f9..61a759c, fix: session.user.email null guard)
- [x] Task 12: Vercel 배포 (URL: https://leave-management-tau-eight.vercel.app, Neon DB 마이그레이션+시드 완료)

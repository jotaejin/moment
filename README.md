# 📸 Moment — 그 순간을 기록하는 SNS

React + TypeScript + Supabase 를 사용해 만든 **소셜 네트워크 서비스(SNS)**입니다.  
사용자가 사진과 글을 올리고, 댓글과 대댓글로 소통하며 좋아요로 반응할 수 있는  
실사용 수준의 SNS 기능을 구현했습니다.

---

## 🚀 배포 주소
🔗 https://moment-lyart.vercel.app

(자동 다크모드, OpenGraph 적용 완료)

---

## ✨ 주요 기능

### 📝 게시글
- 사진 업로드(이미지 확장자만 허용)
- 글 + 이미지 업로드
- 게시글 수정 / 삭제
- 실시간처럼 보이는 피드(5초마다 자동 갱신)
- 무한 스크롤(Intersection Observer)

### 🖼 이미지
- Supabase Storage 업로드
- 미리보기(Preview URL)
- 캐싱된 이미지 URL 즉시 반영

### 💬 댓글 & 대댓글
- 댓글 CRUD
- 무한 대댓글 구현 (root_comment_id 구조)
- 대댓글 작성 시 `@사용자` 자동 언급
- 댓글/대댓글 캐시 즉시 반영(React Query)

### ❤️ 좋아요
- 게시글 좋아요 / 취소
- 각 게시글 단위 캐시 적용 → 즉각 반응

### 👤 프로필
- 닉네임 변경
- 자기소개(bio) 수정
- 프로필 이미지 업로드
- 프로필 페이지 게시글만 필터링

### 🌗 테마
- 🌞 라이트 / 🌙 다크 / 🖥 시스템 모드
- Zustand + localStorage로 **새로고침 후에도 유지**
- index.html 에서 초기 테마 로딩 스크립트 실행

### 🔐 인증
- Supabase Auth  
(이메일/비밀번호 회원가입 & 로그인)

---

## 🧱 기술 스택

### Frontend
- React (Vite)
- TypeScript
- Zustand (전역 상태 관리)
- React Query (fetch caching)
- TailwindCSS
- Radix UI + Shadcn/ui
- React Router Dom

### Backend & Infra
- Supabase  
  - Auth  
  - Database(PostgreSQL)  
  - Storage  
  - RLS 정책 사용

- Vercel (프론트 배포)
  
- ## 📂 폴더 구조

src
├── api # Supabase API 로직
├── assets # 이미지, 아이콘
├── components # UI 컴포넌트
│ ├── post
│ ├── comment
│ ├── ui
├── hooks # React Query + custom hooks
├── lib # 유틸, 상수, supabase 클라이언트
├── pages # 라우트 페이지
├── store # Zustand 저장소
└── types # TypeScript 타입

## 🛠️ 주요 기술 포인트

### 1️⃣ React Query 캐싱 전략  
게시글·댓글·좋아요 등은 **낙관적 업데이트 + 캐시 수정(setQueryData)** 활용해  
실시간처럼 빠르게 반응하게 구현.

### 2️⃣ 무한 스크롤  
Intersection Observer를 사용해  
스크롤이 바닥에 도달하면 다음 페이지 자동 fetch.

### 3️⃣ 이미지 업로드와 미리보기  
`URL.createObjectURL`로 preview를 구현하고  
메모리 누수 방지를 위해 `revokeObjectURL`도 처리함.

### 4️⃣ SNS 수준의 댓글 구조  
`root_comment_id` + `parent_comment_id`  
두 개를 조합해 **무한 중첩 가능한 대댓글** 구조 구축.

### 5️⃣ 테마 유지  
Zustand + localStorage + index.html 초기 스크립트로  
사용자 브라우저 테마 설정을 새로고침 후에도 유지.

---

## 🧑‍💻 개발자
**조태진 (Taejin Cho)**  
백엔드 & 프론트엔드 풀스택 성장 중  
> “그 순간(Moment)을 기록하고, 기술로 연결되는 경험을 만들고 싶습니다.”

---

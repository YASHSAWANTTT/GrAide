# 🧠 Cursor AI Context: GrAide LMS Project

You are working on a full-stack AI-powered LMS-style quiz application called **GrAide**.

---

## 🎯 Purpose
To offer GPT-graded quizzes for educational use:
- Students sign up and access quizzes
- Professors assign quizzes through LMS platforms (e.g. Canvas)
- Quizzes are automatically graded using GPT
- Admins manage platform usage, users, and quizzes

---

## 🧱 Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** Neon Postgres
- **ORM:** Drizzle ORM
- **Auth:** Clerk (sign-in/sign-up only)
- **Source of Truth:** NeonDB via Drizzle (`users` table stores roles + payment)
- **AI:** OpenAI GPT-4 for grading short-answer questions
- **Styling:** TailwindCSS + ShadCN UI
- **Hosting:** Vercel

---

## 🔐 Authentication & User Sync
- Clerk is used *only* for sign-in and sign-up
- Upon login, a `getOrCreateUser()` function runs:
  - Retrieves Clerk user ID and email
  - Checks if user exists in `users` table (NeonDB)
  - If not, creates a record with `role = STUDENT`
- All access control is based on `users` table, **not Clerk claims**

---

## 🧠 GPT Grading Flow
- Quizzes include MCQ, T/F, and short-answer
- On submission:
  - Short answers sent to GPT API
  - GPT returns `score` + `feedback`
  - Data stored in `attempts` table
  - Student and professor can view AI feedback

---

## 💳 Access Control
- All students have access to quizzes (payment no longer required)
- Middleware guards routes based on role only

---

## 🧑‍🏫 Roles (NeonDB via Drizzle)
- Stored in `users.role`
- Values: `STUDENT`, `PROFESSOR`, `ADMIN`
- Middleware uses role to allow/restrict access

---

## 📂 File Structure (Key Pages)

```
/app
  /page.tsx                → Landing page (HeroGeometric)
  /login/page.tsx          → Clerk SignIn (gradient bg, no shapes)
  /signup/page.tsx         → Clerk SignUp (same layout)
  /payment/page.tsx        → Redirects to dashboard (payment no longer required)
  /quiz/[quizId]/page.tsx  → Quiz interface
  /dashboard/student/      → Quiz dashboard + results
  /dashboard/professor/    → Quiz management
  /dashboard/admin/        → Admin tools
/api
  /quiz/[quizId]/grade     → GPT grading endpoint

/db/schema/
  users.ts, quizzes.ts, courses.ts, questions.ts, assignments.ts, attempts.ts

/lib/
  getOrCreateUser.ts, grading.ts, auth.ts
```

---

## 🚀 Example User Flow
1. Professor shares a quiz link via LMS
2. Student clicks → redirected to Clerk `/login`
3. On login, `getOrCreateUser()` syncs data to NeonDB
4. Student accesses quiz → GPT grades → feedback shown

---

## 🧠 AI Guidance
Act like a senior full-stack developer building this LMS. When asked:
- Use Drizzle + NeonDB for all role/payment logic
- Use Clerk **only** for auth (sign-in/sign-up/session)
- Avoid using Clerk claims or metadata for access control
- Apply GPT and route protections according to this model

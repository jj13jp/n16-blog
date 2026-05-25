# Blog Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add About, Works, and Contact pages with a shared NavBar and Resend-powered contact form.

**Architecture:** Three new App Router pages under `src/app/`, one shared `NavBar` Server Component added to the root layout, and a Server Action in `src/app/contact/actions.ts` that validates input with Zod and sends email via Resend. The Contact page renders a `'use client'` `ContactForm` component that calls the action and shows feedback.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, Zod 4, react-hook-form 7, Resend 6

---

## File Map

| File | Action |
|------|--------|
| `src/shared/NavBar.tsx` | Create — shared nav header (Server Component) |
| `src/app/layout.tsx` | Modify — add `<NavBar />` before `<main>` |
| `src/app/about/page.tsx` | Create — About page (Server Component) |
| `src/app/works/page.tsx` | Create — Works page (Server Component) |
| `src/app/contact/page.tsx` | Create — Contact page wrapper (Server Component) |
| `src/app/contact/ContactForm.tsx` | Create — form UI + client logic (`'use client'`) |
| `src/app/contact/actions.ts` | Create — Server Action using Resend |
| `.env.local` | Modify — add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` |

---

### Task 1: NavBar component

**Files:**
- Create: `src/shared/NavBar.tsx`

- [ ] **Step 1: Create NavBar**

```tsx
import Link from "next/link"

export function NavBar() {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900 dark:text-zinc-100">
          Home
        </Link>
        <Link href="/about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          About
        </Link>
        <Link href="/works" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Works
        </Link>
        <Link href="/contact" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Contact
        </Link>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/NavBar.tsx
git commit -m "feat: add NavBar component"
```

---

### Task 2: Add NavBar to layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import and place NavBar in layout**

Replace the body content in `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next"
import { M_PLUS_2 } from "next/font/google"
import { ParticleBackground } from "@/shared/ParticleBackground"
import { NavBar } from "@/shared/NavBar"
import "@/app/globals.css"

const mPlus2 = M_PLUS_2({
  weight: "400",
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "n16-blog",
  description: "Personal blog",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${mPlus2.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        <ParticleBackground />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify type check passes**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add NavBar to root layout"
```

---

### Task 3: About page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create About page**

```tsx
export default function AboutPage() {
  const skills = ["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js"]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">About</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          こんにちは。フロントエンドエンジニアとして日々開発に取り組んでいます。
          このブログでは技術的な知見や日常のことを書いていきます。
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Links</h2>
        <ul className="flex gap-4">
          <li>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add About page"
```

---

### Task 4: Works page

**Files:**
- Create: `src/app/works/page.tsx`

- [ ] **Step 1: Create Works page**

```tsx
interface Work {
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
}

const works: Work[] = [
  {
    title: "n16-blog",
    description: "Next.js 16 と Tailwind CSS 4 で構築した個人ブログ。MicroCMS と連携予定。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MicroCMS"],
    githubUrl: "https://github.com",
  },
  {
    title: "Sample Project",
    description: "サンプルプロジェクトの説明をここに書きます。",
    techStack: ["React", "Node.js"],
    githubUrl: "https://github.com",
  },
]

export default function WorksPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Works</h1>

      <ul className="flex flex-col gap-6">
        {works.map((work) => (
          <li
            key={work.title}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{work.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400">{work.description}</p>
            <ul className="flex flex-wrap gap-2">
              {work.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  GitHub
                </a>
              )}
              {work.demoUrl && (
                <a
                  href={work.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Demo
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/works/page.tsx
git commit -m "feat: add Works page"
```

---

### Task 5: Contact — Server Action

**Files:**
- Create: `src/app/contact/actions.ts`
- Modify: `.env.local` — add env vars

- [ ] **Step 1: Add env vars to `.env.local`**

Add the following lines to `.env.local` (create if it doesn't exist):

```
RESEND_API_KEY=re_YOUR_KEY_HERE
CONTACT_TO_EMAIL=your@email.com
```

- [ ] **Step 2: Create Server Action**

```ts
"use server"

import { Resend } from "resend"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.email("有効なメールアドレスを入力してください"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
})

export type ContactActionResult = { success: true } | { success: false; message: string }

export async function sendContact(formData: FormData): Promise<ContactActionResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message }
  }

  const { name, email, message } = parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!toEmail) {
    return { success: false, message: "送信先が設定されていません" }
  }

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: toEmail,
    subject: `お問い合わせ: ${name}`,
    text: `名前: ${name}\nメール: ${email}\n\n${message}`,
  })

  if (error) {
    return { success: false, message: "送信に失敗しました。しばらく後でお試しください。" }
  }

  return { success: true }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/actions.ts
git commit -m "feat: add contact Server Action with Resend"
```

---

### Task 6: Contact — Form component

**Files:**
- Create: `src/app/contact/ContactForm.tsx`

- [ ] **Step 1: Create ContactForm client component**

```tsx
"use client"

import { useActionState } from "react"
import { sendContact, type ContactActionResult } from "@/app/contact/actions"

type State = ContactActionResult | null

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<State, FormData>(
    sendContact,
    null,
  )

  if (state?.success) {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-200">
        お問い合わせを受け付けました。ありがとうございます。
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state && !state.success && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          お名前
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          メッセージ
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "送信中..." : "送信する"}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/contact/ContactForm.tsx
git commit -m "feat: add ContactForm client component"
```

---

### Task 7: Contact page wrapper

**Files:**
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: Create Contact page**

```tsx
import { ContactForm } from "@/app/contact/ContactForm"

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Contact</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          お気軽にお問い合わせください。
        </p>
      </div>

      <ContactForm />
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: add Contact page"
```

---

### Task 8: Final verification

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: no errors

- [ ] **Step 2: Start dev server and verify all pages**

```bash
pnpm dev
```

Visit:
- `http://localhost:3000` — NavBar visible
- `http://localhost:3000/about` — About page loads
- `http://localhost:3000/works` — Works cards visible
- `http://localhost:3000/contact` — Contact form renders

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify blog pages complete"
```

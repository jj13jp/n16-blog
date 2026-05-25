# Blog Pages Design Spec

**Date:** 2026-05-26  
**Status:** Approved

## Overview

Add three pages to the n16-blog Next.js project: About, Works, and Contact. The blog targets personal/daily content combined with portfolio use. Pages are statically implemented now, structured for easy MicroCMS migration later.

## Approach

Approach A: Simple structure with shared navigation. Three new routes under `src/app/`, a shared `NavBar` component in `src/shared/`, and a Server Action for contact form email delivery via Resend.

## File Structure

```
src/
├── app/
│   ├── layout.tsx          ← Add NavBar
│   ├── about/page.tsx      ← New
│   ├── works/page.tsx      ← New
│   └── contact/
│       ├── page.tsx        ← New
│       └── actions.ts      ← New (Server Action + Resend)
└── shared/
    └── NavBar.tsx          ← New
```

## Pages

### NavBar (`src/shared/NavBar.tsx`)
- Server Component (no interactivity needed)
- Links: Home (`/`), About (`/about`), Works (`/works`), Contact (`/contact`)
- Added to `layout.tsx` before `<main>`

### About (`/about`)
- Server Component
- Static content: name, one-line bio, skill tags, SNS links (GitHub etc.)
- Hardcoded; structured for CMS migration

### Works (`/works`)
- Server Component
- Card grid layout: title, description, tech stack tags, GitHub link per project
- Data as a typed array in the file (easy to replace with CMS fetch)

### Contact (`/contact`)
- Page is a Server Component
- `ContactForm` extracted as a `'use client'` component
- Fields: name, email, message
- Validation: Zod schema
- Submission: Server Action in `actions.ts` using Resend
- UI feedback: success/error message after submit

## Data Flow (Contact)

```
User fills form
  → react-hook-form validates client-side (Zod)
  → calls Server Action (actions.ts)
  → Server Action validates server-side (Zod)
  → Resend sends email
  → returns { success: boolean; message: string }
  → ContactForm displays result
```

## Environment Variables Required

- `RESEND_API_KEY` — Resend API key
- `CONTACT_TO_EMAIL` — recipient address for contact form emails

## Constraints

- No MicroCMS integration yet; content is hardcoded
- TypeScript strict mode throughout
- Tailwind CSS utility classes only
- Named exports for all components

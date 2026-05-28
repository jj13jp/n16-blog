# Unit Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ビジネスロジック関数（ページネーション計算・バリデーション・サーバーアクション・URL生成）のユニットテストを追加し、既存テストのカバレッジを補完する。

**Architecture:** 純粋関数をコンポーネントから切り出しテスト可能にする。新規テストはすべて TDD（red → green）で実装。テストは日本語 describe/it + Vitest + @testing-library/jest-dom パターンに従う。

**Tech Stack:** Vitest 4、@testing-library/react、@testing-library/user-event、Zod 4、TypeScript 5

---

## File Map

| 操作 | ファイル | 内容 |
|------|---------|------|
| 新規作成 | `src/features/blogs/utils/buildHref.ts` | URL生成ユーティリティ関数 |
| 新規作成 | `src/features/blogs/utils/buildHref.test.ts` | buildHref のユニットテスト |
| 変更 | `src/app/blogs/page.tsx` | buildHref を utils からインポート |
| 変更 | `src/features/blogs/components/Pagination.tsx` | pageNumbers を export |
| 新規作成 | `src/features/blogs/components/Pagination.test.tsx` | pageNumbers + Pagination のテスト |
| 新規作成 | `src/features/contact/types/schema.test.ts` | contactSchema バリデーションのテスト |
| 新規作成 | `src/features/contact/actions/serverActions.test.ts` | sendContact のユニットテスト |
| 変更 | `src/shared/Card.test.tsx` | tags 空配列ケースを追加 |
| 変更 | `src/features/blogs/components/BlogCard.test.tsx` | eyecatch 指定ケースを追加 |
| 変更 | `src/features/contact/components/ContactForm.test.tsx` | mockResolvedValueOnce の型修正 |

---

## Task 1: buildHref ユーティリティの切り出しとテスト

**Files:**
- Create: `src/features/blogs/utils/buildHref.ts`
- Create: `src/features/blogs/utils/buildHref.test.ts`
- Modify: `src/app/blogs/page.tsx`

- [ ] **Step 1: 失敗テストを書く**

`src/features/blogs/utils/buildHref.test.ts` を作成:

```ts
import { describe, expect, it } from "vitest"
import { buildHref } from "@/features/blogs/utils/buildHref"

describe("buildHref", () => {
  it("page=1・昇順なしのとき /blogs を返す", () => {
    expect(buildHref(1, false)).toBe("/blogs")
  })

  it("page=2・昇順なしのとき /blogs?page=2 を返す", () => {
    expect(buildHref(2, false)).toBe("/blogs?page=2")
  })

  it("page=1・昇順のとき /blogs?order=asc を返す", () => {
    expect(buildHref(1, true)).toBe("/blogs?order=asc")
  })

  it("page=3・昇順のとき /blogs?order=asc&page=3 を返す", () => {
    expect(buildHref(3, true)).toBe("/blogs?order=asc&page=3")
  })
})
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
pnpm test src/features/blogs/utils/buildHref.test.ts
```

期待出力: `FAIL` (モジュールが存在しないため)

- [ ] **Step 3: buildHref ユーティリティを実装する**

`src/features/blogs/utils/buildHref.ts` を作成:

```ts
export function buildHref(page: number, isAsc: boolean): string {
  const params = new URLSearchParams()
  if (isAsc) params.set("order", "asc")
  if (page > 1) params.set("page", String(page))
  const qs = params.toString()
  return qs ? `/blogs?${qs}` : "/blogs"
}
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
pnpm test src/features/blogs/utils/buildHref.test.ts
```

期待出力: `PASS` (4件すべて)

- [ ] **Step 5: blogs/page.tsx を更新する**

`src/app/blogs/page.tsx` の `buildHref` 関数定義を削除し、インポートに切り替える。

変更前:
```tsx
  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    if (isAsc) params.set("order", "asc")
    if (page > 1) params.set("page", String(page))
    const qs = params.toString()
    return qs ? `/blogs?${qs}` : "/blogs"
  }
```

変更後（ファイル冒頭のインポートに追加）:
```tsx
import { buildHref } from "@/features/blogs/utils/buildHref"
```

ページ内の利用箇所はそのまま `buildHref(page)` → `buildHref(page, isAsc)` に変更:
```tsx
  <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={(page) => buildHref(page, isAsc)} />
```

および:
```tsx
          href={isAsc ? "/blogs" : "/blogs?order=asc"}
```
この部分は変更不要（buildHref を使っていないため）。

- [ ] **Step 6: 型チェックとビルド確認**

```bash
pnpm exec tsc --noEmit
```

期待出力: エラーなし

- [ ] **Step 7: コミット**

```bash
git add src/features/blogs/utils/buildHref.ts src/features/blogs/utils/buildHref.test.ts src/app/blogs/page.tsx
git commit -m "feat: buildHref をユーティリティとして切り出しテストを追加する"
```

---

## Task 2: pageNumbers のエクスポートと Pagination テスト

**Files:**
- Modify: `src/features/blogs/components/Pagination.tsx`
- Create: `src/features/blogs/components/Pagination.test.tsx`

- [ ] **Step 1: 失敗テストを書く**

`src/features/blogs/components/Pagination.test.tsx` を作成:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { pageNumbers, Pagination } from "@/features/blogs/components/Pagination"

describe("pageNumbers", () => {
  it("total が 7 以下のとき全ページを返す", () => {
    expect(pageNumbers(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(pageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5])
    expect(pageNumbers(1, 1)).toEqual([1])
  })

  it("total=10・current=1 のとき先頭側に ellipsis を出さない", () => {
    expect(pageNumbers(1, 10)).toEqual([1, 2, "...", 10])
  })

  it("total=10・current=5 のとき両側に ellipsis を出す", () => {
    expect(pageNumbers(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10])
  })

  it("total=10・current=10 のとき末尾側に ellipsis を出さない", () => {
    expect(pageNumbers(10, 10)).toEqual([1, "...", 9, 10])
  })

  it("total=10・current=3 のとき先頭側 ellipsis を出さない", () => {
    expect(pageNumbers(3, 10)).toEqual([1, 2, 3, 4, "...", 10])
  })

  it("total=10・current=8 のとき末尾側 ellipsis を出さない", () => {
    expect(pageNumbers(8, 10)).toEqual([1, "...", 7, 8, 9, 10])
  })
})

describe("Pagination", () => {
  const buildHref = (page: number) => `/blogs?page=${page}`

  it("totalPages が 1 以下のとき何も表示しない", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} buildHref={buildHref} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("現在ページに aria-current='page' を付与する", () => {
    render(<Pagination currentPage={3} totalPages={5} buildHref={buildHref} />)
    const current = screen.getByRole("link", { name: "3" })
    expect(current).toHaveAttribute("aria-current", "page")
  })

  it("前へリンクが最初のページでは aria-disabled になる", () => {
    render(<Pagination currentPage={1} totalPages={5} buildHref={buildHref} />)
    const prev = screen.getByRole("link", { name: /前へ/ })
    expect(prev).toHaveAttribute("aria-disabled", "true")
  })

  it("次へリンクが最後のページでは aria-disabled になる", () => {
    render(<Pagination currentPage={5} totalPages={5} buildHref={buildHref} />)
    const next = screen.getByRole("link", { name: /次へ/ })
    expect(next).toHaveAttribute("aria-disabled", "true")
  })

  it("前へリンクが中間ページでは有効な href を持つ", () => {
    render(<Pagination currentPage={3} totalPages={5} buildHref={buildHref} />)
    const prev = screen.getByRole("link", { name: /前へ/ })
    expect(prev).toHaveAttribute("href", "/blogs?page=2")
    expect(prev).toHaveAttribute("aria-disabled", "false")
  })
})
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
pnpm test src/features/blogs/components/Pagination.test.tsx
```

期待出力: `FAIL` (pageNumbers が export されていないため)

- [ ] **Step 3: Pagination.tsx で pageNumbers を export する**

`src/features/blogs/components/Pagination.tsx` の9行目を変更:

変更前:
```ts
function pageNumbers(current: number, total: number): (number | "...")[] {
```

変更後:
```ts
export function pageNumbers(current: number, total: number): (number | "...")[] {
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
pnpm test src/features/blogs/components/Pagination.test.tsx
```

期待出力: `PASS` (11件すべて)

- [ ] **Step 5: コミット**

```bash
git add src/features/blogs/components/Pagination.tsx src/features/blogs/components/Pagination.test.tsx
git commit -m "feat: pageNumbers を export してページネーションのテストを追加する"
```

---

## Task 3: contactSchema バリデーションのテスト

**Files:**
- Create: `src/features/contact/types/schema.test.ts`

- [ ] **Step 1: 失敗テストを書く**

`src/features/contact/types/schema.test.ts` を作成:

```ts
import { describe, expect, it } from "vitest"
import { contactSchema } from "@/features/contact/types/schema"

describe("contactSchema", () => {
  const valid = {
    name: "テスト太郎",
    email: "test@example.com",
    message: "これはテストメッセージです。",
  }

  it("すべてのフィールドが正常のとき成功する", () => {
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("name が空文字のときエラーメッセージを返す", () => {
    const result = contactSchema.safeParse({ ...valid, name: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("名前を入力してください")
    }
  })

  it("email が無効な形式のときエラーメッセージを返す", () => {
    const result = contactSchema.safeParse({ ...valid, email: "invalid-email" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("有効なメールアドレスを入力してください")
    }
  })

  it("message が 9 文字以下のときエラーメッセージを返す", () => {
    const result = contactSchema.safeParse({ ...valid, message: "短すぎる" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("メッセージは10文字以上で入力してください")
    }
  })

  it("message が 10 文字のとき成功する", () => {
    const result = contactSchema.safeParse({ ...valid, message: "1234567890" })
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 2: テストが通ることを確認する（スキーマは実装済みのため最初から green でよい）**

```bash
pnpm test src/features/contact/types/schema.test.ts
```

期待出力: `PASS` (5件すべて)

- [ ] **Step 3: コミット**

```bash
git add src/features/contact/types/schema.test.ts
git commit -m "feat: contactSchema のバリデーションテストを追加する"
```

---

## Task 4: sendContact サーバーアクションのテスト

**Files:**
- Create: `src/features/contact/actions/serverActions.test.ts`

- [ ] **Step 1: 失敗テストを書く**

`src/features/contact/actions/serverActions.test.ts` を作成:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { sendContact } from "@/features/contact/actions/serverActions"

vi.mock("resend", () => {
  const mockSend = vi.fn()
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
    })),
    _mockSend: mockSend,
  }
})

import { Resend } from "resend"

function getMockSend() {
  const instance = new (Resend as ReturnType<typeof vi.fn>)()
  return instance.emails.send as ReturnType<typeof vi.fn>
}

const validData = {
  name: "テスト太郎",
  email: "test@example.com",
  message: "これはテストメッセージです。",
}

describe("sendContact", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, CONTACT_TO_EMAIL: "admin@example.com", RESEND_API_KEY: "test-key" }
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("バリデーション失敗のとき失敗結果を返す", async () => {
    const result = await sendContact({ name: "", email: "", message: "" })
    expect(result).toEqual({ success: false, message: "名前を入力してください" })
  })

  it("CONTACT_TO_EMAIL が未設定のとき失敗結果を返す", async () => {
    process.env.CONTACT_TO_EMAIL = undefined
    const result = await sendContact(validData)
    expect(result).toEqual({ success: false, message: "送信先が設定されていません" })
  })

  it("Resend API がエラーを返したとき失敗結果を返す", async () => {
    const mockSend = getMockSend()
    mockSend.mockResolvedValueOnce({ error: { message: "API Error" } })
    const result = await sendContact(validData)
    expect(result).toEqual({
      success: false,
      message: "送信に失敗しました。しばらく後でお試しください。",
    })
  })

  it("正常送信のとき成功結果を返す", async () => {
    const mockSend = getMockSend()
    mockSend.mockResolvedValueOnce({ error: null })
    const result = await sendContact(validData)
    expect(result).toEqual({ success: true })
  })
})
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
pnpm test src/features/contact/actions/serverActions.test.ts
```

期待出力: `FAIL` または `PASS`（モックの挙動次第。サーバーアクション自体は実装済みのため green になる可能性あり）

> **Note:** `"use server"` ディレクティブが含まれるファイルは Vitest の jsdom 環境でもテスト可能。モックが正しく設定されていれば全件 PASS になる。

- [ ] **Step 3: テストが通ることを確認する**

```bash
pnpm test src/features/contact/actions/serverActions.test.ts
```

期待出力: `PASS` (4件すべて)

もし `getMockSend` のモック参照がうまく動作しない場合は以下の別パターンに変更:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mockSend = vi.fn()

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}))

import { sendContact } from "@/features/contact/actions/serverActions"

const validData = {
  name: "テスト太郎",
  email: "test@example.com",
  message: "これはテストメッセージです。",
}

describe("sendContact", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, CONTACT_TO_EMAIL: "admin@example.com", RESEND_API_KEY: "test-key" }
    mockSend.mockClear()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("バリデーション失敗のとき失敗結果を返す", async () => {
    const result = await sendContact({ name: "", email: "", message: "" })
    expect(result).toEqual({ success: false, message: "名前を入力してください" })
  })

  it("CONTACT_TO_EMAIL が未設定のとき失敗結果を返す", async () => {
    process.env = { ...originalEnv, RESEND_API_KEY: "test-key" }
    const result = await sendContact(validData)
    expect(result).toEqual({ success: false, message: "送信先が設定されていません" })
  })

  it("Resend API がエラーを返したとき失敗結果を返す", async () => {
    mockSend.mockResolvedValueOnce({ error: { message: "API Error" } })
    const result = await sendContact(validData)
    expect(result).toEqual({
      success: false,
      message: "送信に失敗しました。しばらく後でお試しください。",
    })
  })

  it("正常送信のとき成功結果を返す", async () => {
    mockSend.mockResolvedValueOnce({ error: null })
    const result = await sendContact(validData)
    expect(result).toEqual({ success: true })
  })
})
```

- [ ] **Step 4: コミット**

```bash
git add src/features/contact/actions/serverActions.test.ts
git commit -m "feat: sendContact サーバーアクションのユニットテストを追加する"
```

---

## Task 5: 既存テストのカバレッジ改善

**Files:**
- Modify: `src/shared/Card.test.tsx`
- Modify: `src/features/blogs/components/BlogCard.test.tsx`
- Modify: `src/features/contact/components/ContactForm.test.tsx`

- [ ] **Step 1: Card.test.tsx に tags 空配列ケースを追加する**

`src/shared/Card.test.tsx` の末尾（最後の `it` ブロックの後、`})` の前）に追加:

```tsx
  it("tags が空配列のときタグ一覧を表示しない", () => {
    render(<Card {...baseProps} tags={[]} />)
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: BlogCard.test.tsx に eyecatch 指定ケースを追加する**

`src/features/blogs/components/BlogCard.test.tsx` の末尾に追加:

```tsx
  it("eyecatch が指定されたとき img を表示する", () => {
    const blogWithEyecatch: BlogListItem = {
      ...baseBlog,
      eyecatch: {
        url: "https://example.com/image.jpg",
        height: 600,
        width: 800,
      },
    }
    render(<BlogCard blog={blogWithEyecatch} />)
    expect(screen.getByRole("img", { name: "テストブログ記事" })).toBeInTheDocument()
  })
```

- [ ] **Step 3: ContactForm.test.tsx の型を修正する**

`src/features/contact/components/ContactForm.test.tsx` の43行目を変更:

変更前:
```ts
    mockSendContact.mockResolvedValueOnce({ success: true, message: "" })
```

変更後:
```ts
    mockSendContact.mockResolvedValueOnce({ success: true })
```

- [ ] **Step 4: すべての既存テストが通ることを確認する**

```bash
pnpm test
```

期待出力: 全テストが `PASS`

- [ ] **Step 5: コミット**

```bash
git add src/shared/Card.test.tsx src/features/blogs/components/BlogCard.test.tsx src/features/contact/components/ContactForm.test.tsx
git commit -m "test: 既存テストにエッジケースを追加し型を修正する"
```

---

## Task 6: 最終確認

- [ ] **Step 1: 全テストを実行する**

```bash
pnpm test
```

期待出力: すべてのテストが `PASS`（新規テスト含む全件）

- [ ] **Step 2: 型チェック**

```bash
pnpm exec tsc --noEmit
```

期待出力: エラーなし

- [ ] **Step 3: Lint チェック**

```bash
pnpm lint
```

期待出力: エラーなし

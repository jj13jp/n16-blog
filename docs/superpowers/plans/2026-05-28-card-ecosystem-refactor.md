# Card エコシステム リファクタリング Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Card を UI 層に絞り、BlogCard・WorkCard がドメインロジックを担う明確な役割分担に整理する。

**Architecture:** `Card` は表示レイアウトのみ担当し、`orientation`・`children` を削除して `actions` スロットに置き換える。BlogCard は excerpt を prop 経由で渡すよう統一し、WorkCard は actions prop 経由でリンクを表示する。テストは CSS クラス依存を排除し、BlogCard テストを新規追加する。

**Tech Stack:** Next.js (App Router), TypeScript (strict), Tailwind CSS 4, Vitest + @testing-library/react

---

## File Map

| ファイル | 変更種別 | 責務 |
|---|---|---|
| `src/shared/Card.tsx` | 修正 | orientation/children 削除、actions 追加、publishedAt\|\|readingTime 条件緩和 |
| `src/shared/Card.test.tsx` | 修正 | orientation テスト削除、actions テスト追加 |
| `src/features/blogs/components/BlogCard.tsx` | 修正 | children 廃止、excerpt prop に一本化 |
| `src/features/blogs/components/BlogCard.test.tsx` | 新規作成 | BlogCard のロジックとレンダリングテスト |
| `src/features/works/components/WorkCard.tsx` | 修正 | children → actions prop に変更 |
| `src/features/works/components/WorkCard.test.tsx` | 修正 | 既存テストが引き続きパスすること確認（変更なしのはず） |

---

## Task 1: Card.tsx の props を更新する

**Files:**
- Modify: `src/shared/Card.tsx`

- [ ] **Step 1: Card.tsx を読む**

`src/shared/Card.tsx` を開いて現在の実装を確認する。

- [ ] **Step 2: Props interface を更新する**

`src/shared/Card.tsx` の Props interface を以下に書き換える：

```tsx
interface Props {
  title: string
  thumbnail?: string
  publishedAt?: string
  tags: string[]
  excerpt?: string
  readingTime?: number
  href?: string
  actions?: ReactNode
}
```

（`orientation` と `children` を削除し、`actions?: ReactNode` を追加）

- [ ] **Step 3: コンポーネント本体を更新する**

関数シグネチャと本体を更新する。`orientation` / `isHorizontal` の変数を削除し、`children` を `actions` に置き換え、`publishedAt && readingTime` 条件を `publishedAt || readingTime` に緩和する：

```tsx
export function Card({
  title,
  thumbnail,
  publishedAt,
  tags,
  excerpt,
  readingTime,
  href,
  actions,
}: Props) {
  const thumbnailArea = (
    <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-32 sm:w-36 sm:shrink-0 sm:self-stretch md:h-40 md:w-48">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 144px, 192px"
        />
      ) : (
        <div
          role="img"
          aria-label="サムネイルなし"
          className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800"
        >
          <span className="text-xs text-zinc-400 dark:text-zinc-600">No Image</span>
        </div>
      )}
    </div>
  )

  const body = (
    <div className="flex flex-1 flex-col gap-2">
      {href ? (
        <Link href={href} className="text-lg font-semibold text-zinc-900 hover:underline dark:text-zinc-100">
          {title}
        </Link>
      ) : (
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
      )}
      {(publishedAt || readingTime !== undefined) && (
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {publishedAt && <time dateTime={publishedAt}>{publishedAt}</time>}
          {publishedAt && readingTime !== undefined && <span aria-hidden="true">·</span>}
          {readingTime !== undefined && <span>{readingTime} 分で読めます</span>}
        </div>
      )}
      {tags && tags.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <ListItems key={tag} label={tag} className="text-xs" />
          ))}
        </ul>
      )}
      {excerpt && <p className="text-sm text-zinc-600 dark:text-zinc-400">{excerpt}</p>}
      {actions}
    </div>
  )

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:flex-row dark:border-zinc-800">
      {thumbnailArea}
      {body}
    </article>
  )
}
```

- [ ] **Step 4: 型チェックを実行する**

```bash
pnpm exec tsc --noEmit
```

期待: エラーなし（BlogCard・WorkCard はまだ `children` を使っているのでこの時点ではエラーが出る）。エラーは Task 2・3 で修正する。

---

## Task 2: Card.test.tsx を更新する

**Files:**
- Modify: `src/shared/Card.test.tsx`

- [ ] **Step 1: 既存テストファイルを読む**

`src/shared/Card.test.tsx` を開いて現在のテスト内容を確認する。

- [ ] **Step 2: テストファイルを書き換える**

`src/shared/Card.test.tsx` を以下の内容に書き換える（orientation テストを削除し、actions と publishedAt/readingTime 単独テストを追加）：

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Card } from "@/shared/Card"

const baseProps = {
  title: "テスト記事タイトル",
  publishedAt: "2026-05-27",
  tags: ["Next.js", "TypeScript"],
  excerpt: "これはテスト用の本文抜粋です。",
  readingTime: 3,
  href: "/posts/test",
}

describe("Card", () => {
  it("タイトルをリンクとして表示する", () => {
    render(<Card {...baseProps} />)
    const link = screen.getByRole("link", { name: "テスト記事タイトル" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/posts/test")
  })

  it("href がないとき タイトルをリンクにしない", () => {
    render(<Card {...baseProps} href={undefined} />)
    expect(screen.queryByRole("link", { name: "テスト記事タイトル" })).not.toBeInTheDocument()
    expect(screen.getByText("テスト記事タイトル")).toBeInTheDocument()
  })

  it("投稿日を表示する", () => {
    render(<Card {...baseProps} />)
    expect(screen.getByText("2026-05-27")).toBeInTheDocument()
  })

  it("publishedAt のみのとき日付を表示する", () => {
    render(<Card {...baseProps} readingTime={undefined} />)
    expect(screen.getByText("2026-05-27")).toBeInTheDocument()
  })

  it("readingTime のみのとき読了時間を表示する", () => {
    render(<Card {...baseProps} publishedAt={undefined} />)
    expect(screen.getByText("3 分で読めます")).toBeInTheDocument()
  })

  it("タグをすべて表示する", () => {
    render(<Card {...baseProps} />)
    expect(screen.getByText("Next.js")).toBeInTheDocument()
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
  })

  it("抜粋を表示する", () => {
    render(<Card {...baseProps} />)
    expect(screen.getByText("これはテスト用の本文抜粋です。")).toBeInTheDocument()
  })

  it("読了時間を表示する", () => {
    render(<Card {...baseProps} />)
    expect(screen.getByText("3 分で読めます")).toBeInTheDocument()
  })

  it("thumbnail が未指定のときプレースホルダーを表示する", () => {
    render(<Card {...baseProps} />)
    expect(screen.getByRole("img", { name: "サムネイルなし" })).toBeInTheDocument()
  })

  it("thumbnail が指定されたとき img を表示する", () => {
    render(<Card {...baseProps} thumbnail="https://example.com/image.jpg" />)
    const img = screen.getByRole("img", { name: "テスト記事タイトル" })
    expect(img).toHaveAttribute("src")
  })

  it("actions を表示する", () => {
    render(<Card {...baseProps} actions={<a href="https://github.com">GitHub</a>} />)
    const link = screen.getByRole("link", { name: "GitHub" })
    expect(link).toHaveAttribute("href", "https://github.com")
  })

  it("actions が未指定のとき何も表示しない", () => {
    render(<Card {...baseProps} />)
    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: テストを実行する**

```bash
pnpm test src/shared/Card.test.tsx
```

期待: 全テストがパス（Card.tsx の変更が完了しているため）。

- [ ] **Step 4: コミットする**

```bash
git add src/shared/Card.tsx src/shared/Card.test.tsx
git commit -m "refactor: Card から orientation/children を削除し actions prop を追加する"
```

---

## Task 3: BlogCard.tsx を更新する

**Files:**
- Modify: `src/features/blogs/components/BlogCard.tsx`

- [ ] **Step 1: BlogCard.tsx を読む**

`src/features/blogs/components/BlogCard.tsx` を開いて現在の実装を確認する。

- [ ] **Step 2: BlogCard.tsx を書き換える**

`children` 経由の excerpt を廃止し、`excerpt` prop に一本化する：

```tsx
import type { BlogListItem } from "@/features/blogs/types"
import { Card } from "@/shared/Card"

interface Props {
  blog: BlogListItem
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

function calcReadingTime(html: string): number {
  return Math.max(1, Math.ceil(stripHtml(html).length / 400))
}

export function BlogCard({ blog }: Props) {
  const updatedAt = new Date(blog.updatedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const excerpt = stripHtml(blog.content).slice(0, 100)

  return (
    <Card
      title={blog.title}
      thumbnail={blog.eyecatch?.url}
      publishedAt={updatedAt}
      tags={blog.category ? [blog.category.name] : []}
      readingTime={calcReadingTime(blog.content)}
      href={`/blogs/${blog.id}`}
      excerpt={excerpt}
    />
  )
}
```

- [ ] **Step 3: 型チェックを実行する**

```bash
pnpm exec tsc --noEmit
```

期待: BlogCard に関連するエラーがなくなること（WorkCard のエラーは残る可能性あり）。

---

## Task 4: BlogCard.test.tsx を新規作成する

**Files:**
- Create: `src/features/blogs/components/BlogCard.test.tsx`

- [ ] **Step 1: テストファイルを作成する**

`src/features/blogs/components/BlogCard.test.tsx` を以下の内容で作成する：

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BlogCard } from "@/features/blogs/components/BlogCard"
import type { BlogListItem } from "@/features/blogs/types"

const baseBlog: BlogListItem = {
  id: "test-id",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-05-27T00:00:00.000Z",
  publishedAt: "2026-01-01T00:00:00.000Z",
  revisedAt: "2026-05-27T00:00:00.000Z",
  title: "テストブログ記事",
  content: "<p>これはテスト用のブログコンテンツです。</p>",
  category: { id: "cat-1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", publishedAt: "2026-01-01T00:00:00.000Z", revisedAt: "2026-01-01T00:00:00.000Z", name: "Tech" },
}

describe("BlogCard", () => {
  it("タイトルをリンクとして表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    const link = screen.getByRole("link", { name: "テストブログ記事" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/blogs/test-id")
  })

  it("updatedAt を ja-JP ロケールでフォーマットして表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    expect(screen.getByText("2026年5月27日")).toBeInTheDocument()
  })

  it("カテゴリ名をタグとして表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    expect(screen.getByText("Tech")).toBeInTheDocument()
  })

  it("category がないときタグを表示しない", () => {
    const blogWithoutCategory: BlogListItem = { ...baseBlog, category: undefined }
    render(<BlogCard blog={blogWithoutCategory} />)
    expect(screen.queryByText("Tech")).not.toBeInTheDocument()
  })

  it("HTML タグを除去した抜粋を表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    expect(screen.getByText("これはテスト用のブログコンテンツです。")).toBeInTheDocument()
  })

  it("読了時間を表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    expect(screen.getByText("1 分で読めます")).toBeInTheDocument()
  })

  it("長いコンテンツのとき読了時間が1より大きくなる", () => {
    const longContent = "<p>" + "あ".repeat(800) + "</p>"
    const longBlog: BlogListItem = { ...baseBlog, content: longContent }
    render(<BlogCard blog={longBlog} />)
    expect(screen.getByText("2 分で読めます")).toBeInTheDocument()
  })

  it("eyecatch がないときプレースホルダーを表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    expect(screen.getByRole("img", { name: "サムネイルなし" })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: テストを実行する**

```bash
pnpm test src/features/blogs/components/BlogCard.test.tsx
```

期待: 全テストがパス。

- [ ] **Step 3: コミットする**

```bash
git add src/features/blogs/components/BlogCard.tsx src/features/blogs/components/BlogCard.test.tsx
git commit -m "refactor: BlogCard の excerpt を children から prop に統一し、テストを追加する"
```

---

## Task 5: WorkCard.tsx を更新する

**Files:**
- Modify: `src/features/works/components/WorkCard.tsx`
- Modify: `src/features/works/components/WorkCard.test.tsx`（確認のみ）

- [ ] **Step 1: WorkCard.tsx を読む**

`src/features/works/components/WorkCard.tsx` を開いて現在の実装を確認する。

- [ ] **Step 2: WorkCard.tsx を書き換える**

`children` を `actions` prop 経由に変更する：

```tsx
import type { Work } from "@/features/works/types"
import { Card } from "@/shared/Card"

interface Props {
  work: Work
}

export function WorkCard({ work }: Props) {
  const actions =
    work.githubUrl || work.demoUrl ? (
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
    ) : undefined

  return (
    <Card
      title={work.title}
      tags={work.techStack}
      excerpt={work.description}
      actions={actions}
    />
  )
}
```

- [ ] **Step 3: 既存テストがパスすることを確認する**

```bash
pnpm test src/features/works/components/WorkCard.test.tsx
```

期待: 既存の6テストが全てパス（WorkCard.test.tsx は変更不要）。

- [ ] **Step 4: 全テストを実行する**

```bash
pnpm test
```

期待: 全テストがパス。

- [ ] **Step 5: 型チェックを実行する**

```bash
pnpm exec tsc --noEmit
```

期待: エラーなし。

- [ ] **Step 6: コミットする**

```bash
git add src/features/works/components/WorkCard.tsx
git commit -m "refactor: WorkCard の GitHub/Demo リンクを children から actions prop に変更する"
```

---

## Task 6: 最終検証

- [ ] **Step 1: 全テストを実行する**

```bash
pnpm test
```

期待: 全テストがパス。

- [ ] **Step 2: 型チェックを実行する**

```bash
pnpm exec tsc --noEmit
```

期待: エラーなし。

- [ ] **Step 3: lint チェックを実行する**

```bash
pnpm lint
```

期待: エラーなし。

- [ ] **Step 4: ブラウザで動作確認する**

```bash
pnpm dev
```

`http://localhost:3000/blogs` にアクセスして確認：
- BlogCard: タイトル（リンク）・日付・読了時間・カテゴリ・抜粋・サムネイルが表示される

`http://localhost:3000/works` にアクセスして確認：
- WorkCard: タイトル・技術スタック・説明・GitHub リンクが表示される

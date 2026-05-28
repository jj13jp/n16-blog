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
  category: {
    id: "cat-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    publishedAt: "2026-01-01T00:00:00.000Z",
    revisedAt: "2026-01-01T00:00:00.000Z",
    name: "Tech",
  },
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
    const longContent = `<p>${"あ".repeat(800)}</p>`
    const longBlog: BlogListItem = { ...baseBlog, content: longContent }
    render(<BlogCard blog={longBlog} />)
    expect(screen.getByText("2 分で読めます")).toBeInTheDocument()
  })

  it("eyecatch がないときプレースホルダーを表示する", () => {
    render(<BlogCard blog={baseBlog} />)
    expect(screen.getByRole("img", { name: "サムネイルなし" })).toBeInTheDocument()
  })

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
})

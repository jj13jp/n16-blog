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

  it("publishedAt も readingTime もないときメタ行を表示しない", () => {
    render(<Card {...baseProps} publishedAt={undefined} readingTime={undefined} />)
    expect(screen.queryByText("分で読めます")).not.toBeInTheDocument()
    expect(screen.queryByRole("time")).not.toBeInTheDocument()
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

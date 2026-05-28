import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { WorkCard } from "@/features/works/components/WorkCard"
import type { Work } from "@/features/works/types"

const work: Work = {
  title: "n16-blog",
  description: "テスト用の説明文です。",
  techStack: ["Next.js", "TypeScript"],
  githubUrl: "https://github.com/example/repo",
}

describe("WorkCard", () => {
  it("タイトルを表示する", () => {
    render(
      <ul>
        <WorkCard work={work} />
      </ul>,
    )
    expect(screen.getByText("n16-blog")).toBeInTheDocument()
  })

  it("説明文を表示する", () => {
    render(
      <ul>
        <WorkCard work={work} />
      </ul>,
    )
    expect(screen.getByText("テスト用の説明文です。")).toBeInTheDocument()
  })

  it("techStack のラベルをすべて表示する", () => {
    render(
      <ul>
        <WorkCard work={work} />
      </ul>,
    )
    expect(screen.getByText("Next.js")).toBeInTheDocument()
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
  })

  it("githubUrl があるとき GitHub リンクを表示する", () => {
    render(
      <ul>
        <WorkCard work={work} />
      </ul>,
    )
    const link = screen.getByRole("link", { name: "GitHub" })
    expect(link).toHaveAttribute("href", "https://github.com/example/repo")
  })

  it("demoUrl がないとき Demo リンクを表示しない", () => {
    render(
      <ul>
        <WorkCard work={work} />
      </ul>,
    )
    expect(screen.queryByRole("link", { name: "Demo" })).not.toBeInTheDocument()
  })

  it("demoUrl があるとき Demo リンクを表示する", () => {
    const workWithDemo: Work = { ...work, demoUrl: "https://example.com" }
    render(
      <ul>
        <WorkCard work={workWithDemo} />
      </ul>,
    )
    expect(screen.getByRole("link", { name: "Demo" })).toHaveAttribute("href", "https://example.com")
  })

  it("githubUrl も demoUrl もないときリンクを表示しない", () => {
    const workNoLinks: Work = { title: "No Links", description: "説明", techStack: [] }
    render(
      <ul>
        <WorkCard work={workNoLinks} />
      </ul>,
    )
    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Demo" })).not.toBeInTheDocument()
  })
})

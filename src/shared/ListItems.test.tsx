import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ListItems } from "@/shared/ListItems"

describe("ListItems", () => {
  it("ラベルを表示する", () => {
    render(
      <ul>
        <ListItems label="TypeScript" />
      </ul>,
    )
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
  })

  it("li タグとしてレンダリングされる", () => {
    render(
      <ul>
        <ListItems label="React" />
      </ul>,
    )
    expect(screen.getByRole("listitem")).toBeInTheDocument()
  })

  it("className を追加できる", () => {
    render(
      <ul>
        <ListItems label="Next.js" className="text-xs" />
      </ul>,
    )
    expect(screen.getByRole("listitem")).toHaveClass("text-xs")
  })

  it("デフォルトのクラスを保持しつつ className を追加する", () => {
    render(
      <ul>
        <ListItems label="Node.js" className="text-xs" />
      </ul>,
    )
    const item = screen.getByRole("listitem")
    expect(item).toHaveClass("rounded-full")
    expect(item).toHaveClass("text-xs")
  })
})

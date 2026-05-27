import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ButtonLink } from "@/shared/ButtonLink"

describe("ButtonLink", () => {
  it("テキストを表示する", () => {
    render(<ButtonLink href="/">トップへ戻る</ButtonLink>)
    expect(screen.getByRole("link", { name: "トップへ戻る" })).toBeInTheDocument()
  })

  it("href を設定する", () => {
    render(<ButtonLink href="/about">About</ButtonLink>)
    expect(screen.getByRole("link")).toHaveAttribute("href", "/about")
  })

  it("className を追加できる", () => {
    render(
      <ButtonLink href="/" className="extra-class">
        Home
      </ButtonLink>,
    )
    expect(screen.getByRole("link")).toHaveClass("extra-class")
  })
})

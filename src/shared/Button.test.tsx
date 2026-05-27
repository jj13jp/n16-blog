import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Button } from "@/shared/Button"

describe("Button", () => {
  it("テキストを表示する", () => {
    render(<Button>送信する</Button>)
    expect(screen.getByRole("button", { name: "送信する" })).toBeInTheDocument()
  })

  it("type=submit を設定できる", () => {
    render(<Button type="submit">送信する</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it("disabled のとき操作不可になる", () => {
    render(<Button disabled>送信する</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("className を追加できる", () => {
    render(<Button className="extra-class">送信する</Button>)
    expect(screen.getByRole("button")).toHaveClass("extra-class")
  })
})

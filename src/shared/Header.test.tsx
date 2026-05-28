import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import Header from "@/shared/Header"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

describe("Header", () => {
  it("ナビゲーションリンクを4つ表示する", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Blogs" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Works" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument()
  })

  it("現在のパスのリンクにアクティブスタイルが適用される", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("font-semibold")
  })

  it("現在のパス以外のリンクにアクティブスタイルが適用されない", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "Blogs" })).not.toHaveClass("font-semibold")
  })
})

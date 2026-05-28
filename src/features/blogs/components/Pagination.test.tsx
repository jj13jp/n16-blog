import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Pagination, pageNumbers } from "@/features/blogs/components/Pagination"

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
    const { container } = render(<Pagination currentPage={1} totalPages={1} buildHref={buildHref} />)
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

  it("ellipsis が表示されるとき … スパンを含む", () => {
    render(<Pagination currentPage={5} totalPages={10} buildHref={buildHref} />)
    const ellipses = screen.getAllByText("…")
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })
})

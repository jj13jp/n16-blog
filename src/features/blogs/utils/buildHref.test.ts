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

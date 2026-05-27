import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TextArea } from "@/shared/TextArea"

describe("TextArea", () => {
  it("ラベルを表示する", () => {
    render(<TextArea label="メッセージ" id="message" />)
    expect(screen.getByLabelText("メッセージ")).toBeInTheDocument()
  })

  it("id がないときラベルを表示しない", () => {
    render(<TextArea label="メッセージ" />)
    expect(screen.queryByText("メッセージ")).not.toBeInTheDocument()
  })

  it("エラーメッセージを表示する", () => {
    render(<TextArea label="メッセージ" id="message" error="10文字以上で入力してください" />)
    expect(screen.getByText("10文字以上で入力してください")).toBeInTheDocument()
  })

  it("エラーがないときエラーメッセージを表示しない", () => {
    render(<TextArea label="メッセージ" id="message" />)
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("rows 属性を設定できる", () => {
    render(<TextArea label="メッセージ" id="message" rows={5} />)
    expect(screen.getByLabelText("メッセージ")).toHaveAttribute("rows", "5")
  })
})

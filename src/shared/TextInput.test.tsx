import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TextInput } from "@/shared/TextInput"

describe("TextInput", () => {
  it("ラベルを表示する", () => {
    render(<TextInput label="お名前" id="name" />)
    expect(screen.getByLabelText("お名前")).toBeInTheDocument()
  })

  it("id がないときラベルを表示しない", () => {
    render(<TextInput label="お名前" />)
    expect(screen.queryByText("お名前")).not.toBeInTheDocument()
  })

  it("エラーメッセージを表示する", () => {
    render(<TextInput label="お名前" id="name" error="名前を入力してください" />)
    expect(screen.getByText("名前を入力してください")).toBeInTheDocument()
  })

  it("エラーがないときエラーメッセージを表示しない", () => {
    render(<TextInput label="お名前" id="name" />)
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("type 属性を設定できる", () => {
    render(<TextInput label="メール" id="email" type="email" />)
    expect(screen.getByLabelText("メール")).toHaveAttribute("type", "email")
  })
})

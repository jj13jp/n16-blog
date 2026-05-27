import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ContactForm } from "@/features/contact/components/ContactForm"

vi.mock("@/features/contact/actions/serverActions", () => ({
  sendContact: vi.fn(),
}))

import { sendContact } from "@/features/contact/actions/serverActions"

const mockSendContact = vi.mocked(sendContact)

describe("ContactForm", () => {
  it("フォームの入力フィールドを表示する", () => {
    render(<ContactForm />)
    expect(screen.getByLabelText("お名前")).toBeInTheDocument()
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument()
    expect(screen.getByLabelText("メッセージ")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "送信する" })).toBeInTheDocument()
  })

  it("必須フィールドが空のとき送信するとバリデーションエラーを表示する", async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole("button", { name: "送信する" }))
    await waitFor(() => {
      expect(screen.getByText("名前を入力してください")).toBeInTheDocument()
    })
  })

  it("メールアドレスが空のときエラーを表示する", async () => {
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText("お名前"), "テスト太郎")
    await userEvent.type(screen.getByLabelText("メッセージ"), "これはテストメッセージです。")
    await userEvent.click(screen.getByRole("button", { name: "送信する" }))
    await waitFor(() => {
      expect(screen.getByText("有効なメールアドレスを入力してください")).toBeInTheDocument()
    })
  })

  it("送信成功時に完了メッセージを表示する", async () => {
    mockSendContact.mockResolvedValueOnce({ success: true, message: "" })
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText("お名前"), "テスト太郎")
    await userEvent.type(screen.getByLabelText("メールアドレス"), "test@example.com")
    await userEvent.type(screen.getByLabelText("メッセージ"), "これはテストメッセージです。")
    await userEvent.click(screen.getByRole("button", { name: "送信する" }))
    await waitFor(() => {
      expect(screen.getByText("お問い合わせを受け付けました。ありがとうございます。")).toBeInTheDocument()
    })
  })

  it("送信失敗時にサーバーエラーメッセージを表示する", async () => {
    mockSendContact.mockResolvedValueOnce({ success: false, message: "送信に失敗しました。" })
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText("お名前"), "テスト太郎")
    await userEvent.type(screen.getByLabelText("メールアドレス"), "test@example.com")
    await userEvent.type(screen.getByLabelText("メッセージ"), "これはテストメッセージです。")
    await userEvent.click(screen.getByRole("button", { name: "送信する" }))
    await waitFor(() => {
      expect(screen.getByText("送信に失敗しました。")).toBeInTheDocument()
    })
  })
})

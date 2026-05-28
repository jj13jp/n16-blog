import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mockSend = vi.fn()

vi.mock("resend", () => {
  const ResendMock = vi.fn(function (this: { emails: { send: typeof mockSend } }) {
    this.emails = { send: mockSend }
  })
  return { Resend: ResendMock }
})

import { sendContact } from "@/features/contact/actions/serverActions"

const validData = {
  name: "テスト太郎",
  email: "test@example.com",
  message: "これはテストメッセージです。",
}

describe("sendContact", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, CONTACT_TO_EMAIL: "admin@example.com", RESEND_API_KEY: "test-key" }
    mockSend.mockClear()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("バリデーション失敗のとき失敗結果を返す", async () => {
    const result = await sendContact({ name: "", email: "", message: "" })
    expect(result).toEqual({ success: false, message: "名前を入力してください" })
  })

  it("CONTACT_TO_EMAIL が未設定のとき失敗結果を返す", async () => {
    process.env = { ...originalEnv, RESEND_API_KEY: "test-key" }
    const result = await sendContact(validData)
    expect(result).toEqual({ success: false, message: "送信先が設定されていません" })
  })

  it("Resend API がエラーを返したとき失敗結果を返す", async () => {
    mockSend.mockResolvedValueOnce({ error: { message: "API Error" } })
    const result = await sendContact(validData)
    expect(result).toEqual({
      success: false,
      message: "送信に失敗しました。しばらく後でお試しください。",
    })
  })

  it("正常送信のとき成功結果を返す", async () => {
    mockSend.mockResolvedValueOnce({ error: null })
    const result = await sendContact(validData)
    expect(result).toEqual({ success: true })
  })
})

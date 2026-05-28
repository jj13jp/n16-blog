import { describe, expect, it } from "vitest"
import { contactSchema } from "@/features/contact/types/schema"

describe("contactSchema", () => {
  const valid = {
    name: "テスト太郎",
    email: "test@example.com",
    message: "これはテストメッセージです。",
  }

  it("すべてのフィールドが正常のとき成功する", () => {
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("name が空文字のときエラーメッセージを返す", () => {
    const result = contactSchema.safeParse({ ...valid, name: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("名前を入力してください")
    }
  })

  it("email が無効な形式のときエラーメッセージを返す", () => {
    const result = contactSchema.safeParse({ ...valid, email: "invalid-email" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("有効なメールアドレスを入力してください")
    }
  })

  it("message が 9 文字以下のときエラーメッセージを返す", () => {
    const result = contactSchema.safeParse({ ...valid, message: "短すぎる" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("メッセージは10文字以上で入力してください")
    }
  })

  it("message が 10 文字のとき成功する", () => {
    const result = contactSchema.safeParse({ ...valid, message: "1234567890" })
    expect(result.success).toBe(true)
  })
})

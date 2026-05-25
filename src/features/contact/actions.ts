"use server"

import { Resend } from "resend"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.email("有効なメールアドレスを入力してください"),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
})

export type ContactActionResult = { success: true } | { success: false; message: string }

export async function sendContact(
  _state: ContactActionResult | null,
  formData: FormData,
): Promise<ContactActionResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const { name, email, message } = parsed.data

  const resend = new Resend(process.env.RESEND_API_KEY)
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!toEmail) {
    return { success: false, message: "送信先が設定されていません" }
  }

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: toEmail,
    subject: `お問い合わせ: ${name}`,
    text: `名前: ${name}\nメール: ${email}\n\n${message}`,
  })

  if (error) {
    return { success: false, message: "送信に失敗しました。しばらく後でお試しください。" }
  }

  return { success: true }
}

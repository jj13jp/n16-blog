"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { sendContact } from "@/features/contact/actions/serverActions"
import { type ContactFormData, contactSchema } from "@/features/contact/types/schema"
import { TextArea } from "@/shared/TextArea"
import { TextInput } from "@/shared/TextInput"

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null)
    const result = await sendContact(data)
    if (result.success) {
      setIsSuccess(true)
    } else {
      setServerError(result.message)
    }
  }

  if (isSuccess) {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-200">
        お問い合わせを受け付けました。ありがとうございます。
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{serverError}</p>
      )}

      <TextInput id="name" type="text" label="お名前" error={errors.name?.message} {...register("name")} />

      <TextInput id="email" type="email" label="メールアドレス" error={errors.email?.message} {...register("email")} />

      <TextArea id="message" rows={5} label="メッセージ" error={errors.message?.message} {...register("message")} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isSubmitting ? "送信中..." : "送信する"}
      </button>
    </form>
  )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { sendContact } from "@/features/contact/actions/serverActions"
import { type ContactFormData, contactSchema } from "@/features/contact/types/schema"

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

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          お名前
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-black/50 dark:text-zinc-100"
        />
        {errors.name && <span className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-black/50 dark:text-zinc-100"
        />
        {errors.email && <span className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          メッセージ
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-black/50 dark:text-zinc-100"
        />
        {errors.message && <span className="text-sm text-red-600 dark:text-red-400">{errors.message.message}</span>}
      </div>

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

import { ContactForm } from "@/features/contact/ContactForm"

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Contact</h1>
        <p className="text-zinc-600 dark:text-zinc-400">お気軽にお問い合わせください。</p>
      </div>
      <ContactForm />
    </div>
  )
}

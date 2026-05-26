import { ButtonLink } from "@/shared/ButtonLink"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <p className="text-8xl font-bold text-zinc-300 dark:text-zinc-700">404</p>
      <p className="text-zinc-600 dark:text-zinc-400">ページが見つかりません</p>
      <ButtonLink href="/">トップへ戻る</ButtonLink>
    </div>
  )
}

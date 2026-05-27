import Image from "next/image"
import Link from "next/link"
import { ListItems } from "@/shared/ListItems"

interface Props {
  title: string
  thumbnail?: string
  publishedAt: string
  tags: string[]
  excerpt: string
  readingTime: number
  href: string
  orientation?: "vertical" | "horizontal"
}

export function Card({
  title,
  thumbnail,
  publishedAt,
  tags,
  excerpt,
  readingTime,
  href,
  orientation = "horizontal",
}: Props) {
  const isHorizontal = orientation === "horizontal"

  const thumbnailArea = (
    <div
      className={
        isHorizontal
          ? "relative h-full w-36 shrink-0 overflow-hidden rounded-lg sm:w-48"
          : "relative h-48 w-full overflow-hidden rounded-lg"
      }
    >
      {thumbnail ? (
        <Image src={thumbnail} alt={title} fill className="object-cover" sizes={isHorizontal ? "192px" : "100vw"} />
      ) : (
        <div
          role="img"
          aria-label="サムネイルなし"
          className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800"
        >
          <span className="text-xs text-zinc-400 dark:text-zinc-600">No Image</span>
        </div>
      )}
    </div>
  )

  const body = (
    <div className="flex flex-1 flex-col gap-2">
      <Link href={href} className="text-lg font-semibold text-zinc-900 hover:underline dark:text-zinc-100">
        {title}
      </Link>
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <time dateTime={publishedAt}>{publishedAt}</time>
        <span>·</span>
        <span>{readingTime} 分で読めます</span>
      </div>
      <ul className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <ListItems key={tag} label={tag} className="text-xs" />
        ))}
      </ul>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{excerpt}</p>
    </div>
  )

  return (
    <article
      className={[
        "flex gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800",
        isHorizontal ? "flex-row" : "flex-col",
      ].join(" ")}
    >
      {thumbnailArea}
      {body}
    </article>
  )
}

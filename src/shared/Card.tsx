import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ListItems } from "@/shared/ListItems"

interface Props {
  title: string
  thumbnail?: string
  publishedAt?: string
  tags: string[]
  excerpt?: string
  readingTime?: number
  href?: string
  actions?: ReactNode
  loading?: "lazy" | "eager"
}

export function Card({ title, thumbnail, publishedAt, tags, excerpt, readingTime, href, actions, loading }: Props) {
  const thumbnailArea = (
    <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-32 sm:w-36 sm:shrink-0 sm:self-stretch md:h-40 md:w-48">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 144px, 192px"
          loading={loading}
        />
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
      {href ? (
        <Link href={href} className="text-lg font-semibold text-zinc-900 hover:underline dark:text-zinc-100">
          {title}
        </Link>
      ) : (
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
      )}
      {(publishedAt || readingTime !== undefined) && (
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {publishedAt && <time dateTime={publishedAt}>{publishedAt}</time>}
          {publishedAt && readingTime !== undefined && <span aria-hidden="true">·</span>}
          {readingTime !== undefined && <span>{readingTime} 分で読めます</span>}
        </div>
      )}
      {tags && tags.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <ListItems key={tag} label={tag} className="text-xs" />
          ))}
        </ul>
      )}
      {excerpt && <p className="text-sm text-zinc-600 dark:text-zinc-400">{excerpt}</p>}
      {actions}
    </div>
  )

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:flex-row dark:border-zinc-800">
      {thumbnailArea}
      {body}
    </article>
  )
}

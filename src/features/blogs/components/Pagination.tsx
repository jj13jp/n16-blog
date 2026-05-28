import Link from "next/link"

interface Props {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]

  if (current > 3) pages.push("...")
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push("...")

  pages.push(total)
  return pages
}

export function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  const pages = pageNumbers(currentPage, totalPages)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav aria-label="ページネーション" className="flex items-center justify-center gap-1">
      <Link
        href={hasPrev ? buildHref(currentPage - 1) : "#"}
        aria-disabled={!hasPrev}
        className={[
          "rounded-lg border px-3 py-1.5 text-sm transition-colors",
          hasPrev
            ? "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            : "pointer-events-none border-zinc-100 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600",
        ].join(" ")}
      >
        ← 前へ
      </Link>

      {pages.map((p, i) =>
        p === "..." ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis items have no meaningful key
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-zinc-400 dark:text-zinc-600">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={[
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              p === currentPage
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50",
            ].join(" ")}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={hasNext ? buildHref(currentPage + 1) : "#"}
        aria-disabled={!hasNext}
        className={[
          "rounded-lg border px-3 py-1.5 text-sm transition-colors",
          hasNext
            ? "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
            : "pointer-events-none border-zinc-100 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600",
        ].join(" ")}
      >
        次へ →
      </Link>
    </nav>
  )
}

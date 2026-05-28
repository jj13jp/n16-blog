import type { Metadata } from "next"
import Link from "next/link"
import { BlogCard } from "@/features/blogs/components/BlogCard"
import { Pagination } from "@/features/blogs/components/Pagination"
import type { Blog } from "@/features/blogs/types"
import { buildHref } from "@/features/blogs/utils/buildHref"
import { client } from "@/libs/microcms"

export const metadata: Metadata = {
  title: "Blog",
  description: "ブログ記事一覧",
}

const PER_PAGE = 10

type Order = "updatedAt" | "-updatedAt"

type Props = {
  searchParams: Promise<{ order?: string; page?: string }>
}

export default async function BlogsPage({ searchParams }: Props) {
  const { order: orderParam, page: pageParam } = await searchParams
  const isAsc = orderParam === "asc"
  const order: Order = isAsc ? "updatedAt" : "-updatedAt"
  const currentPage = Math.max(1, Number(pageParam) || 1)

  const { contents, totalCount } = await client.getList<Blog>({
    endpoint: "blogs",
    queries: {
      orders: order,
      limit: PER_PAGE,
      offset: (currentPage - 1) * PER_PAGE,
    },
  })

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Blog</h1>
        <Link
          href={isAsc ? "/blogs" : "/blogs?order=asc"}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
        >
          {isAsc ? "古い順" : "新しい順"}
        </Link>
      </div>

      {contents.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">記事がありません。</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {contents.map((blog, index) => (
            <li key={blog.id}>
              <BlogCard blog={blog} loading={index < 5 ? "eager" : "lazy"} />
            </li>
          ))}
        </ul>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={(page) => buildHref(page, isAsc)} />
    </div>
  )
}

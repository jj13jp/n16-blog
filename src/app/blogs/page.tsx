import type { Metadata } from "next"
import Link from "next/link"
import { BlogCard } from "@/features/blogs/components/BlogCard"
import type { Blog } from "@/features/blogs/types"
import { client } from "@/libs/microcms"

export const metadata: Metadata = {
  title: "Blog",
  description: "ブログ記事一覧",
}

type Order = "updatedAt" | "-updatedAt"

type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function BlogsPage({ searchParams }: Props) {
  const { order: orderParam } = await searchParams
  const isDesc = orderParam === "desc"
  const order: Order = isDesc ? "-updatedAt" : "updatedAt"

  const { contents } = await client.getList<Blog>({
    endpoint: "blogs",
    queries: { orders: order, limit: 100 },
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Blog</h1>
        <Link
          href={isDesc ? "/blogs" : "/blogs?order=desc"}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
        >
          {isDesc ? "新しい順" : "古い順"}
        </Link>
      </div>

      {contents.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">記事がありません。</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {contents.map((blog) => (
            <li key={blog.id}>
              <BlogCard blog={blog} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import Link from "next/link"
import type { Blog } from "@/features/blogs/types"
import { client } from "@/libs/microcms"
import { BlogCard } from "./BlogCard"

export async function RecentPosts() {
  const { contents } = await client.getList<Blog>({
    endpoint: "blogs",
    queries: { orders: "-updatedAt", limit: 2 },
  })

  if (contents.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Recent Posts</h2>
        <Link
          href="/blogs"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          すべての記事を見る →
        </Link>
      </div>
      <ul className="flex flex-col gap-4">
        {contents.map((blog) => (
          <li key={blog.id}>
            <BlogCard blog={blog} loading="eager" />
          </li>
        ))}
      </ul>
    </section>
  )
}

import type { BlogListItem } from "@/features/blogs/types"
import { Card } from "@/shared/Card"

interface Props {
  blog: BlogListItem
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

function calcReadingTime(html: string): number {
  return Math.max(1, Math.ceil(stripHtml(html).length / 400))
}

export function BlogCard({ blog }: Props) {
  const updatedAt = new Date(blog.updatedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const excerpt = stripHtml(blog.content).slice(0, 100)

  return (
    <Card
      title={blog.title}
      thumbnail={blog.eyecatch?.url}
      publishedAt={updatedAt}
      tags={blog.category ? [blog.category.name] : []}
      readingTime={calcReadingTime(blog.content)}
      href={`/blogs/${blog.id}`}
      excerpt={excerpt}
    />
  )
}

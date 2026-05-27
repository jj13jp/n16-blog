import type { MicroCMSListContent } from "microcms-js-sdk"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Blog } from "@/features/blogs/types"
import { client } from "@/libs/microcms"

type BlogDetail = Blog & MicroCMSListContent

type Props = { params: Promise<{ slug: string }> }

async function getBlog(contentId: string): Promise<BlogDetail> {
  return client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
  })
}

async function getAllBlogIds(): Promise<string[]> {
  return client.getAllContentIds({ endpoint: "blogs" })
}

export async function generateStaticParams() {
  const ids = await getAllBlogIds()
  return ids.map((id) => ({ slug: id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug).catch(() => null)
  if (!blog) return { title: "記事が見つかりません" }
  return {
    title: blog.title,
    openGraph: blog.eyecatch ? { images: [{ url: blog.eyecatch.url }] } : undefined,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlog(slug).catch(() => null)
  if (!blog) notFound()

  const publishedAt = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        {blog.category && (
          <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {blog.category.name}
          </span>
        )}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{blog.title}</h1>
        {publishedAt && (
          <time dateTime={blog.publishedAt} className="text-sm text-zinc-500 dark:text-zinc-400">
            {publishedAt}
          </time>
        )}
        {blog.eyecatch && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={blog.eyecatch.url}
              alt={blog.eyecatch.alt ?? blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div
        className="prose prose-zinc max-w-none dark:prose-invert"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: microCMS rich editor HTML
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  )
}

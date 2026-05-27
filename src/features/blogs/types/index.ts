import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk"

export interface Category {
  name: string
}

export interface Blog {
  title: string
  content: string
  eyecatch?: MicroCMSImage
  category?: Category & MicroCMSListContent
}

export type BlogListItem = Blog & MicroCMSListContent

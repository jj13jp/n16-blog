import { WorkCard } from "@/features/works/components/WorkCard"
import type { Work } from "@/features/works/types"

const works: Work[] = [
  {
    title: "n16-blog",
    description:
      "Next.js 16 と Tailwind CSS 4 で構築した個人ブログ。MicroCMS と連携しており、簡単にブログ記事を追加することができる。feature-basedデザインを使っていることも特徴。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MicroCMS", "resend", "zod", "React-Hook-Form", "Claude Code"],
    githubUrl: "https://github.com/Joex13/n16-blog",
  },
  {
    title: "n15-blog",
    description:
      "Next.js 15 と Tailwind CSS で構築した個人ブログ。MicroCMS と連携しており、簡単にブログ記事を追加することができる。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MicroCMS", "Nodemailer"],
    githubUrl: "https://github.com/Joex13/n15-blog",
  },
]

export default function WorksPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Works</h1>

      <div className="flex flex-col gap-6">
        {works.map((work) => (
          <WorkCard key={work.title} work={work} />
        ))}
      </div>
    </div>
  )
}

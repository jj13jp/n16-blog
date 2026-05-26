import { WorkCard } from "@/features/works/components/WorkCard"
import type { Work } from "@/features/works/types"

const works: Work[] = [
  {
    title: "n16-blog",
    description: "Next.js 16 と Tailwind CSS 4 で構築した個人ブログ。MicroCMS と連携予定。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MicroCMS"],
    githubUrl: "https://github.com/Joex13/n16-blog",
  },
  {
    title: "Sample Project",
    description: "サンプルプロジェクトの説明をここに書きます。",
    techStack: ["React", "Node.js"],
    githubUrl: "https://github.com",
  },
]

export default function WorksPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Works</h1>

      <ul className="flex flex-col gap-6">
        {works.map((work) => (
          <WorkCard key={work.title} work={work} />
        ))}
      </ul>
    </div>
  )
}

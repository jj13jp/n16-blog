import { WorkCard } from "@/features/works/components/WorkCard"
import type { Work } from "@/features/works/types"

const works: Work[] = [
  {
    title: "automation-au_jibun",
    description:
      "ポイ活自動化用。auじぶん銀行の登録口座への振込を自動化するアプリ。",
    techStack: ["TypeScript", "playwright", "Claude Code"],
    githubUrl: "https://github.com/jj13jp/automation-au_jibun",
  },
  {
    title: "todo",
    description:
      "汎用的な TODO アプリ。Docker と Nest.js と デプロイ の練習用に作成・運用している。",
    techStack: ["React", "TypeScript", "Tailwind CSS", "react-router(v7)", "vite", "Nest.js", "pg", "Docker", "Docker Compose", "jest", "TypeORM", "Claude Code"],
    githubUrl: "https://github.com/jj13jp/todo",
  },
  {
    title: "Buckshot_Roulette_Like",
    description:
      "ゲーム、「Buckshot Roulette」を再現したゲーム。シングルプレイのみ実装。時間があったら、マルチプレイ部分を実装したい。",
    techStack: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zustand", "Three.js", "vitest", "Claude Code"],
    githubUrl: "https://github.com/jj13jp/Buckshot_Roulette_Like",
    demoUrl: "https://buckshot-roulette-like-web.vercel.app/"
  },
  {
    title: "n16-blog（ココ）",
    description:
      "Next.js 16 と Tailwind CSS 4 で構築した個人ブログ。MicroCMS と連携しており、簡単にブログ記事を追加することができる。feature-basedデザインを使っていることも特徴。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MicroCMS", "resend", "zod", "React-Hook-Form", "vitest", "Claude Code"],
    githubUrl: "https://github.com/jj13jp/n16-blog",
    demoUrl: ""
  },
  {
    title: "n15-blog",
    description:
      "Next.js 15 と Tailwind CSS で構築した個人ブログ。MicroCMS と連携しており、簡単にブログ記事を追加することができる。",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MicroCMS", "Nodemailer"],
    githubUrl: "https://github.com/jj13jp/n15-blog",
    demoUrl: "https://n15-blog.vercel.app/"
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

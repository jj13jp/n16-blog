import { RecentPosts } from "@/features/blogs/components/RecentPosts"
import { ListItems } from "@/shared/ListItems"

export default function AboutPage() {
  const skills = [
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Node.js",
    "Tailwind CSS",
    "Java",
    "Spring Boot",
    "Python",
    "Docker",
    "Docker Compose",
    "Claude",
    "llama.cpp",
    "LM Studio",
    "WSL2",
    "mise"
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Joex13</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          こんにちは。フロントエンドエンジニアとして日々開発に取り組んでいます。日常のことを書いていきます。※技術的なことも書くかも？
        </p>
      </section>

      <RecentPosts />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <ListItems key={skill} label={skill} />
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Links</h2>
        <ul className="flex gap-4">
          <li>
            <a
              href="https://github.com/Joex13"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}

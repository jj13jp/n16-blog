export default function AboutPage() {
  const skills = [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "Emotion",
    "Vue.js",
    "Claude Code（修行中）",
    "LocalLLM（RTX5090）",
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">About</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          こんにちは。フロントエンドエンジニアとして日々開発に取り組んでいます。日常のことを書いていきます。※たまに技術的なことも書こうかな。
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {skill}
            </li>
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

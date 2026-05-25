interface Work {
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
}

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
          <li
            key={work.title}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{work.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400">{work.description}</p>
            <ul className="flex flex-wrap gap-2">
              {work.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  GitHub
                </a>
              )}
              {work.demoUrl && (
                <a
                  href={work.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Demo
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

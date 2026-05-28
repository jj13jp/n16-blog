import type { Work } from "@/features/works/types"
import { Card } from "@/shared/Card"

interface Props {
  work: Work
  loading?: "lazy" | "eager"
}

export function WorkCard({ work, loading }: Props) {
  const actions =
    work.githubUrl || work.demoUrl ? (
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
    ) : undefined

  return (
    <Card title={work.title} tags={work.techStack} excerpt={work.description} actions={actions} loading={loading} />
  )
}

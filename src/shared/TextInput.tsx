import type { InputHTMLAttributes } from "react"

const inputClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-black/50 dark:text-zinc-100"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function TextInput({ label, id, error, className, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {id && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input id={id} className={[inputClass, className].filter(Boolean).join(" ")} {...props} />
      {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
    </div>
  )
}

import type { ButtonHTMLAttributes } from "react"

const variantClass = {
  primary:
    "rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300",
} as const

type Variant = keyof typeof variantClass

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = "primary", className, children, ...props }: Props) {
  return (
    <button className={[variantClass[variant], className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  )
}

interface Props {
  label: string
  className?: string
}

export function ListItems({ label, className }: Props) {
  const classes = [
    "rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <li className={classes}>{label}</li>
}

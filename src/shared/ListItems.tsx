interface Props {
  label: string
}

export function ListItems({ label }: Props) {
  return (
    <li className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      {label}
    </li>
  )
}

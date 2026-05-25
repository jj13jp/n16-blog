import Link from "next/link"

export function NavBar() {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900 dark:text-zinc-100">
          Home
        </Link>
        <Link href="/about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          About
        </Link>
        <Link href="/works" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Works
        </Link>
        <Link href="/contact" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Contact
        </Link>
      </nav>
    </header>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/works", label: "Works" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        {links.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={
                isActive
                  ? "font-semibold text-zinc-900 dark:text-red-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-red-400"
              }
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

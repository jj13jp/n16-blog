import Link, { type LinkProps } from "next/link"
import type { ReactNode } from "react"
import { type Variant, variantClass } from "@/shared/Button"

interface Props extends LinkProps {
  variant?: Variant
  className?: string
  children?: ReactNode
}

export function ButtonLink({ variant = "primary", className, children, ...props }: Props) {
  const classes = [variantClass[variant], className].filter(Boolean).join(" ")

  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  )
}

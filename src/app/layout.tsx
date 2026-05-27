import type { Metadata } from "next"
import { M_PLUS_2 } from "next/font/google"
import { Providers } from "@/app/providers"
import Header from "@/shared/Header"
import "@/app/globals.css"

const mPlus2 = M_PLUS_2({
  weight: "400",
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "n16-blog",
  description: "Personal blog",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${mPlus2.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

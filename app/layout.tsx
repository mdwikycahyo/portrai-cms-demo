import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@/styles/tiptap.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portrai CMS Demo",
  description: "Build and manage HR assessment simulations",
  generator: 'FoW'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  )
}

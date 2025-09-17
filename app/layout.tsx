import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ReactQueryProvider } from "@/components/ReactQueryProvider"

import "./globals.scss"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
})

export const metadata: Metadata = {
  title: "Jobtrackr",
  description: "Seguimiento de procesos de selección y proyectos laborales",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}

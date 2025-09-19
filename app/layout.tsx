import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ReactQueryProvider } from "@/components/ReactQueryProvider"
import "@/globalCss/index.scss"
import "@/globalCss/globals.scss"
import { ApolloDataProvider } from "@/components/ApolloDataProvider"

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
  icons: {
    icon: [ { url: "/favicon.svg", type: "image/svg+xml" } ],
    shortcut: [ { url: "/favicon.svg", type: "image/svg+xml" } ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <ApolloDataProvider>
            {children}
          </ApolloDataProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DesignSystemProvider } from "@/components/design-system"
import { AuthProvider } from "@/lib/auth/clerk-auth-context"
import { DataLayerProvider } from "@/lib/content/data-layer-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "writers web",
  description: "manage your story chapters, characters, and scenes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <AuthProvider>
            <DesignSystemProvider>
              <DataLayerProvider>
                <div className="flex h-full" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                  </div>
                </div>
              </DataLayerProvider>
            </DesignSystemProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

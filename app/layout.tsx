import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DesignSystemProvider } from "@/lib/contexts/design-system-context"
import { ClerkAuthProvider } from "@/lib/auth/clerk-auth-context"
import { DataLayerProvider } from "@/lib/content/data-layer-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Story Management System",
  description: "Manage your story chapters, characters, and scenes",
  generator: "v0.dev",
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
          <ClerkAuthProvider>
            <DesignSystemProvider>
              <DataLayerProvider>
                <div className="flex h-full bg-background">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                  </div>
                </div>
              </DataLayerProvider>
            </DesignSystemProvider>
          </ClerkAuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

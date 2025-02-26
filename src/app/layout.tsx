"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import localFont from "next/font/local"
import "./globals.css"

const sfpro = localFont({
    src: "../../public/fonts/sf-pro-display_regular.woff2",
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${sfpro.className} antialiased`}>
                <SessionProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        {children}
                    </ThemeProvider>
                    <Toaster />
                </SessionProvider>
            </body>
        </html>
    )
}

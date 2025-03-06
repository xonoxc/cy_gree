"use client"

import localFont from "next/font/local"
import "./globals.css"
import Providers from "@/components/Providers/prodviders"
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
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

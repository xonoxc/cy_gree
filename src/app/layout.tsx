"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import localFont from "next/font/local"
import { ImageKitProvider } from "imagekitio-next"
import "./globals.css"
import { useCallback } from "react"

const sfpro = localFont({
    src: "../../public/fonts/sf-pro-display_regular.woff2",
})

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_IO_ENDPOINT!
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_IO_PUBLIC_KEY!

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const authenticator = useCallback(async () => {
        try {
            const res = await fetch("/auth/bucket")
            if (!res.ok) {
                throw new Error("Failed to authenticate")
            }

            return res.json()
        } catch (error) {
            throw error
        }
    }, [])

    return (
        <html lang="en">
            <body className={`${sfpro.className} antialiased`}>
                <ImageKitProvider
                    publicKey={publicKey}
                    urlEndpoint={urlEndpoint}
                    authenticator={authenticator}
                >
                    <SessionProvider refetchInterval={5 * 60}>
                        <ThemeProvider attribute="class" defaultTheme="dark">
                            {children}
                        </ThemeProvider>
                        <Toaster />
                    </SessionProvider>
                </ImageKitProvider>
            </body>
        </html>
    )
}

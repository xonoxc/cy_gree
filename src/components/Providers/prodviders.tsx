"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"

import { queryClient } from "@/lib/query/client"
import { QueryClientProvider } from "@tanstack/react-query"

import { ImageKitProvider } from "imagekitio-next"

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_IO_ENDPOINT!
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_IO_PUBLIC_KEY!

const authenticator = async () => {
    try {
        const res = await fetch("/api/auth/bucket")
        if (!res.ok) {
            throw new Error("Failed to authenticate")
        }

        return res.json()
    } catch (e) {
        throw e
    }
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <SessionProvider refetchInterval={5 * 60}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        {children}
                    </ThemeProvider>
                </QueryClientProvider>
                <Toaster />
            </SessionProvider>
        </ImageKitProvider>
    )
}

export default Providers

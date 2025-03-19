"use client"

import React from "react"
import { ClientStatsProvider } from "@/hooks/useClientstats"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"

const FloatingChat = dynamic(() => import("@/components/Ai/chatbox"), {
    ssr: false,
})

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { data: session, status } = useSession()

    if (status === "loading") return <div>Loading...</div>

    return (
        <ClientStatsProvider userId={session?.user.id}>
            {children}
            <FloatingChat />
        </ClientStatsProvider>
    )
}

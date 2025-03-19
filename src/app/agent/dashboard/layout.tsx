"use client"

import React from "react"
import FloatingChat from "@/components/Ai/chatbox"
import { useSession } from "next-auth/react"
import { AgentProvider } from "@/hooks/useAgent"

export default function AgentLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { data: session, status } = useSession()

    if (status === "loading") return <div>loading .....</div>

    return (
        <AgentProvider agentId={session?.user.id}>
            {children}
            <FloatingChat />
        </AgentProvider>
    )
}

import React from "react"
import FloatingChat from "@/components/Ai/chatbox"

export default function AgentLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            {children}
            <FloatingChat />
        </>
    )
}

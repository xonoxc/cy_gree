"use client"
import AIChatbot from "@/components/Ai/chatbox"
import { refreshTokens } from "@/services/token"
import useTokenStore from "@/store/token"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { accessToken, refreshToken, role } = useTokenStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            if (!accessToken && refreshToken) {
                const refreshStatus = await refreshTokens(refreshToken)

                if (refreshStatus && role) {
                    router.replace(
                        `/${role === "Client" ? "usr" : "agent"}/dashboard`
                    )
                } else {
                    router.replace("/sign-in")
                }
            } else if ((!accessToken && !refreshToken) || !role) {
                router.replace("/sign-in")
            } else {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [accessToken, refreshToken, role, router])

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader2 size={60} className="text-green-400 animate-spin" />
            </div>
        )
    }

    return (
        <div>
            {children}
            <AIChatbot />
        </div>
    )
}

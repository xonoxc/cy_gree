"use client"
import useTokenStore from "@/store/token"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { accessToken, role } = useTokenStore()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (accessToken && role) {
            router.replace(`/${role === "Client" ? "usr" : "agent"}/dashboard`)
        } else {
            setIsLoading(false)
        }
    }, [accessToken, role, router, accessToken])

    if (isLoading || (accessToken && role))
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Loader2 size={60} className="mr-2 h-10 w-10 animate-spin" />
            </div>
        )

    return <div>{children}</div>
}

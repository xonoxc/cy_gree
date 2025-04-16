"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Users,
    UserCircle,
    Recycle,
    Gift,
    Award,
    Bell,
    Home,
    LogOut,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { logErrors } from "@/utils/errors/errorLogs"

const routes = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/admin/dashboard",
    },
    {
        label: "Users",
        icon: Users,
        href: "/admin/dashboard/users",
    },
    {
        label: "User Profiles",
        icon: UserCircle,
        href: "/admin/dashboard/user-profiles",
    },
    {
        label: "Plastic Collections",
        icon: Recycle,
        href: "/admin/dashboard/plastic-collections",
    },
    {
        label: "List Rewards",
        icon: Gift,
        href: "/admin/dashboard/list-rewards",
    },
    {
        label: "Rewards",
        icon: Gift,
        href: "/admin/dashboard/rewards",
    },
    {
        label: "Badges",
        icon: Award,
        href: "/admin/dashboard/badges",
    },
    {
        label: "Notifications",
        icon: Bell,
        href: "/admin/dashboard/notifications",
    },
]

export function Sidebar() {
    const [isLoggingOut, setLogginOut] = useState<boolean>(false)
    const pathname = usePathname()

    const { toast } = useToast()

    const router = useRouter()

    const handleLogout = async () => {
        setLogginOut(true)
        try {
            await signOut()
            router.push("/sign-in")
        } catch (e) {
            logErrors(e)
            toast({
                title: "Cannot log out!",
                description: "please try again later..",
            })
        } finally {
            setLogginOut(false)
        }
    }

    return (
        <div className="flex-col h-full space-y-4 py-4 bg-card text-card-foreground border-r w-64 hidden sm:flex">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-8">
                    <div className="relative w-8 h-8 mr-4">
                        <Recycle className="h-8 w-8 text-primary" />
                    </div>
                    <Logo />
                </Link>
                <div className="space-y-1">
                    {routes.map(route => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon
                                    className={"h-5 w-5 mr-3 text-gray-500"}
                                />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2 my-4 border-t">
                <div className="space-y-1 pt-2">
                    <Button
                        variant="ghost"
                        className="text-sm group flex p-3 w-full justify-center font-medium cursor-pointer  rounded-lg transition text-muted-foreground bg-white items-center hover:bg-white"
                        onClick={handleLogout}
                    >
                        <span className="text-black font-bold">
                            {isLoggingOut ? "Logging out ...." : "Logout"}
                        </span>
                        <LogOut className="h-5 w-5 mr-3 text-black font-bold" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

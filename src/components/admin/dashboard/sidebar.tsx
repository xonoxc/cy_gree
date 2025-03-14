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
    Settings,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { signOut } from "next-auth/react"

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
    const pathname = usePathname()

    const router = useRouter()

    const handleLogout = async () => {
        await signOut()
        router.push("/sign-in")
    }

    return (
        <div className="flex flex-col h-full space-y-4 py-4 bg-card text-card-foreground border-r w-64">
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
            <div className="px-3 py-2 border-t">
                <div className="space-y-1 pt-2">
                    <Link
                        href="/admin/dashboard/settings"
                        className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition text-muted-foreground"
                    >
                        <div className="flex items-center flex-1">
                            <Settings className="h-5 w-5 mr-3 text-gray-500" />
                            Settings
                        </div>
                    </Link>
                    <Button
                        variant="ghost"
                        className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-destructive/10 rounded-lg transition text-muted-foreground"
                        onClick={handleLogout}
                    >
                        <div className="flex items-center flex-1">
                            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
                            Logout
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

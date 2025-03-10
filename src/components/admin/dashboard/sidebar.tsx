"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

const routes = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/admin/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Users",
        icon: Users,
        href: "/admin/dashboard/users",
        color: "text-violet-500",
    },
    {
        label: "User Profiles",
        icon: UserCircle,
        href: "/admin/dashboard/user-profiles",
        color: "text-pink-700",
    },
    {
        label: "Plastic Collections",
        icon: Recycle,
        href: "/admin/dashboard/plastic-collections",
        color: "text-green-700",
    },
    {
        label: "List Rewards",
        icon: Gift,
        href: "/admin/dashboard/list-rewards",
        color: "text-orange-700",
    },
    {
        label: "Rewards",
        icon: Gift,
        href: "/admin/dashboard/rewards",
        color: "text-yellow-500",
    },
    {
        label: "Badges",
        icon: Award,
        href: "/admin/dashboard/badges",
        color: "text-emerald-500",
    },
    {
        label: "Notifications",
        icon: Bell,
        href: "/admin/dashboard/notifications",
        color: "text-rose-500",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full space-y-4 py-4 bg-card text-card-foreground border-r w-64">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-8">
                    <div className="relative w-8 h-8 mr-4">
                        <Recycle className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold">EcoTrack</h1>
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
                                    className={cn("h-5 w-5 mr-3", route.color)}
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

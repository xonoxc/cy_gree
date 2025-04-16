"use client"

import { useState } from "react"
import { Bell, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    Users,
    UserCircle,
    Recycle,
    Gift,
    Award,
    Home,
    LogOut,
    Settings,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { usePathname, useRouter } from "next/navigation"
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
]

export function TopNav() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut()
        router.push("/sign-in")
        setIsMobileOpen(false)
    }

    return (
        <>
            {/* Top Navigation Bar */}
            <div className="border-b bg-card">
                <div className="flex h-16 items-center px-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>

                    {/* Search Bar */}
                    <div className="w-full flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-8 bg-background"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isMobileOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible delay-300"
                )}
                onClick={() => setIsMobileOpen(false)}
            >
                {/* Mobile Sidebar Panel */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between px-4 h-16 border-b">
                        <div className="flex items-center">
                            <Recycle className="h-6 w-6 text-primary mr-2" />
                            <Logo />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileOpen(false)}
                            className="transition-transform hover:scale-110 duration-150"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
                        {/* Main Navigation Links */}
                        <div className="px-3 py-2 flex-1">
                            <div className="space-y-1">
                                {routes.map(route => (
                                    <a
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer",
                                            "hover:bg-primary/10 rounded-lg transition-all duration-200",
                                            pathname === route.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground"
                                        )}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <div className="flex items-center flex-1">
                                            <route.icon className="h-5 w-5 mr-3 text-gray-500 transition-transform group-hover:scale-110" />
                                            <span className="transition-transform group-hover:translate-x-1">
                                                {route.label}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Settings & Logout */}
                        <div className="px-3 py-2 my-4 border-t">
                            <div className="space-y-1 pt-2">
                                <a
                                    href="/admin/dashboard/settings"
                                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition-all duration-200 text-muted-foreground"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <Settings className="h-5 w-5 mr-3 text-gray-500 transition-transform group-hover:scale-110" />
                                    <span className="transition-transform group-hover:translate-x-1">
                                        Settings
                                    </span>
                                </a>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground hover:bg-destructive/10 transition-all duration-200 group"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-5 w-5 mr-3 text-gray-500 transition-transform group-hover:scale-110" />
                                    <span className="transition-transform group-hover:translate-x-1">
                                        Logout
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

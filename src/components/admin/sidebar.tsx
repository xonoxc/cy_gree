"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, UserCircle, Gift, Award, Bell, Database } from "lucide-react"

const models = [
    { name: "User", icon: User, href: "/admin/user" },
    { name: "UserProfile", icon: UserCircle, href: "/admin/user-profile" },
    {
        name: "PlasticCollection",
        icon: Database,
        href: "/admin/plastic-collection",
    },
    { name: "ListReward", icon: Gift, href: "/admin/list-reward" },
    { name: "Reward", icon: Gift, href: "/admin/reward" },
    { name: "Badge", icon: Award, href: "/admin/badge" },
    { name: "Notification", icon: Bell, href: "/admin/notification" },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div
            className={cn(
                "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[60px]" : "w-64"
            )}
        >
            <div className="flex h-14 items-center justify-between px-4 py-2">
                {!isCollapsed && (
                    <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={
                        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                >
                    {isCollapsed ? "→" : "←"}
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <nav className="flex flex-col gap-2 p-2">
                    {models.map(model => (
                        <Link key={model.name} href={model.href} passHref>
                            <Button
                                variant={
                                    pathname.startsWith(model.href)
                                        ? "secondary"
                                        : "ghost"
                                }
                                className={cn(
                                    "w-full justify-start",
                                    isCollapsed
                                        ? "h-10 w-10 p-0"
                                        : "h-10 px-4 py-2"
                                )}
                            >
                                <model.icon
                                    className={cn(
                                        "h-5 w-5",
                                        isCollapsed ? "mx-auto" : "mr-2"
                                    )}
                                />
                                {!isCollapsed && <span>{model.name}</span>}
                            </Button>
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Bell, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Recycle } from "lucide-react"

export function TopNav() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    return (
        <>
            <div className="border-b bg-card">
                <div className="flex h-16 items-center px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <div className="w-full flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-8 bg-background"
                            />
                        </div>
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

            {/* Mobile sidebar */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
                    showMobileMenu ? "block" : "hidden"
                )}
            >
                <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs">
                    <div className="flex h-full flex-col bg-card shadow-lg">
                        <div className="flex items-center justify-between px-4 h-16 border-b">
                            <div className="flex items-center">
                                <Recycle className="h-6 w-6 text-primary mr-2" />
                                <span className="font-bold text-lg">
                                    EcoTrack
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

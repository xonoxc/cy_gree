import type React from "react"
import { Sidebar } from "@/components/admin/dashboard/sidebar"
import { TopNav } from "@/components/admin/dashboard/top-nav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-muted/30">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    )
}

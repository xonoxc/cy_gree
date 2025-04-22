"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { Overview } from "@/components/admin/dashboard/overview"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"

export default function DashboardPage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Hi {session?.user.name} !
                </h1>
                <p className="text-muted-foreground">
                    Welcome to your plastic recycling management dashboard.
                </p>
            </div>

            <DashboardStats />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Plastic collection and recycling metrics for the
                            current month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest platform activities and notifications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

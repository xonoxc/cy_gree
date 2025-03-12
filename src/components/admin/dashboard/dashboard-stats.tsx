"use client"

import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Users, Recycle, Award, Gift } from "lucide-react"

interface IDashBoardStats {
    userCount: number
    totalPlasticCollected: number
    totalRewards: number
    totalBadges: number
}

export function DashboardStats() {
    const { data, error, status } = useQuery<IDashBoardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: fetchDashboardStats,
    })

    if (status === "pending") return <StatCardSkeleton />

    if (status === "error") {
        return (
            <ErrorMessage
                message={
                    error instanceof Error ? error.message : "An error occurred"
                }
            />
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Users"
                value={data.userCount}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                subtitle="+12% from last month"
            />
            <StatCard
                title="Plastic Collected"
                value={`${data.totalPlasticCollected} kg`}
                icon={<Recycle className="h-4 w-4 text-muted-foreground" />}
                subtitle="+18% from last month"
            />
            <StatCard
                title="Rewards Claimed"
                value={data.totalRewards}
                icon={<Gift className="h-4 w-4 text-muted-foreground" />}
                subtitle="+7% from last month"
            />
            <StatCard
                title="Badges Awarded"
                value={data.totalBadges}
                icon={<Award className="h-4 w-4 text-muted-foreground" />}
                subtitle="+5% from last month"
            />
        </div>
    )
}

/**
 * functiion for fetching dashboard stats into the components
 */

async function fetchDashboardStats(): Promise<IDashBoardStats> {
    const resp = await fetch("/api/admin/stats")
    if (!resp.ok) throw new Error("Failed to fetch stats")
    return resp.json()
}

function ErrorMessage({ message }: { message: string }) {
    return <div>Error: {message}</div>
}

/**
 * Stats cards
 *
 *Subcomponent and SkeltonCard for the cards that need to  render on the basis of the state
 */

interface StatCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    subtitle: string
}

function StatCard({ title, value, icon, subtitle }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    )
}

const StatCardSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Skeleton for Total Users Card */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-500 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-500 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
                <div className="h-8 w-16 bg-gray-500 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-500 rounded animate-pulse mt-2" />
            </CardContent>
        </Card>

        {/* Skeleton for Plastic Collected Card */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-28 bg-gray-500 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-500 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
                <div className="h-8 w-20 bg-gray-500 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-500 rounded animate-pulse mt-2" />
            </CardContent>
        </Card>

        {/* Skeleton for Rewards Claimed Card */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-500 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-500 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
                <div className="h-8 w-16 bg-gray-500 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-500 rounded animate-pulse mt-2" />
            </CardContent>
        </Card>

        {/* Skeleton for Badges Awarded Card */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-500 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-500 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
                <div className="h-8 w-16 bg-gray-500 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-500 rounded animate-pulse mt-2" />
            </CardContent>
        </Card>
    </div>
)

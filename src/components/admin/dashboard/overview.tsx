"use client"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts"
import { useQuery } from "@tanstack/react-query"

/**
 * Data type for chart data
 *
 *	@property name - The name of the month
 *  @property total - The total plastic collected in kg
 */

interface ChartData {
    name: string
    total: number
}

/*
function for fetching plastic collection stats
*/
async function fetchPlasticCollectionStats() {
    const response = await fetch("/api/admin/metrics")
    if (!response.ok) {
        throw new Error("Failed to fetch plastic collection data")
    }
    return response.json()
}

/*
 main component
*/
export function Overview() {
    const { data, isLoading, error } = useQuery<{ monthlyData: ChartData[] }>({
        queryKey: ["plastic-collections-monthly"],
        queryFn: fetchPlasticCollectionStats,
    })

    if (isLoading) {
        return (
            <ResponsiveContainer width="100%" height={350}>
                <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
            </ResponsiveContainer>
        )
    }

    if (error) {
        return (
            <div>
                Error:{" "}
                {error instanceof Error ? error.message : "An error occurred"}
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            {data && data.monthlyData.length === 0 ? (
                <>
                    <div className="flex items-center justify-center h-full rounded-xl">
                        <h2>No enough data to be represented</h2>
                    </div>
                </>
            ) : (
                <BarChart data={data?.monthlyData}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={value => `${value} kg`}
                    />
                    <Tooltip
                        formatter={value => [
                            `${value} kg`,
                            "Plastic Collected",
                        ]}
                        labelFormatter={label => `Month: ${label}`}
                    />
                    <Bar
                        dataKey="total"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                    />
                </BarChart>
            )}
        </ResponsiveContainer>
    )
}

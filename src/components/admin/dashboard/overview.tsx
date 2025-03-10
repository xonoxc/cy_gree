"use client"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts"

const data = [
    {
        name: "Jan",
        total: 120,
    },
    {
        name: "Feb",
        total: 180,
    },
    {
        name: "Mar",
        total: 240,
    },
    {
        name: "Apr",
        total: 280,
    },
    {
        name: "May",
        total: 350,
    },
    {
        name: "Jun",
        total: 390,
    },
    {
        name: "Jul",
        total: 420,
    },
    {
        name: "Aug",
        total: 490,
    },
    {
        name: "Sep",
        total: 520,
    },
    {
        name: "Oct",
        total: 580,
    },
    {
        name: "Nov",
        total: 650,
    },
    {
        name: "Dec",
        total: 720,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
                    formatter={value => [`${value} kg`, "Plastic Collected"]}
                    labelFormatter={label => `Month: ${label}`}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

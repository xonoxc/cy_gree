import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const DashboardHeaderSkeleton = () => {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="ml-auto flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
        </header>
    )
}

export const SummaryCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded mt-2 animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded mt-1 animate-pulse" />
            </CardContent>
        </Card>
    )
}

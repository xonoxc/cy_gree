"use client"

import { Skeleton } from "../ui/skeleton"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"

export const ProfileCardSkeleton = () => (
    <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle>
                <Skeleton className="h-6 w-1/4" />
            </CardTitle>
            <CardDescription>
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardDescription>
        </CardHeader>
        <CardContent>
            {/* Avatar and Name Section */}
            <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Form Fields Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

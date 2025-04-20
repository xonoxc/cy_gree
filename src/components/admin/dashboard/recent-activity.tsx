"use client"
import Time from "@/components/time"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"

/**
 * type for recent activities
 *
 */

interface IRecentCollection {
	name: string
	amount: number
	updatedAt: string
}

/**
 * Helper functions
 *
 * @fecthRecentCollections: Fetches recent collections
 * @grabInitials: Grabs first couple of cheracters to be displayed as the avatar fallback
 *
 */

async function fetchRecentCollections(): Promise<IRecentCollection[]> {
	const response = await fetch("/api/admin/recent-collections")
	if (!response.ok) {
		throw new Error("Cannot fetch recent collections")
	}
	return response.json()
}

const grabInitials = (s: string) => s.slice(0, 2).toUpperCase()

/**
 * Main Component for Recent Activities
 */
export function RecentActivity() {
	const { data, isError, error, status } = useQuery({
		queryKey: ["recent-activities"],
		queryFn: fetchRecentCollections,
	})

	if (status === "pending") return <RecentActivitySkeleton />

	if (isError) return <div>{error.message}</div>

	return (
		<div className="space-y-4">
			{data && data.length === 0 ? (
				<>
					<div className="flex items-center justify-center h-full rounded-xl">
						<p>No recent activities</p>
					</div>
				</>
			) : (
				data?.map((activity, index) => (
					<div key={index} className="flex items-center gap-4">
						<Avatar className="h-9 w-9">
							<AvatarImage
								src={`/placeholder.svg?height=36&width=36&text=${grabInitials(activity.name)}`}
								alt={activity.name}
							/>
							<AvatarFallback>
								{activity.name
									.split(" ")[0]
									.charAt(0)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">
								{activity.name} collected {activity.amount} of
								plastic
							</p>
							<p className="text-xs text-muted-foreground">
								<Time timeStamp={activity.updatedAt} />
							</p>
						</div>
					</div>
				))
			)}
		</div>
	)
}

/**
 * Skeleton for the component
 */

const RecentActivitySkeleton = () => {
	return (
		<div className="space-y-4">
			{Array.from({ length: 5 }).map((_, index) => (
				<div key={index} className="flex items-center gap-4">
					<div className="h-9 w-9 rounded-full bg-gray-500 animate-pulse"></div>
					<div className="space-y-1">
						<div className="h-4 w-48 bg-gray-500 rounded animate-pulse"></div>
						<div className="h-3 w-32 bg-gray-500 rounded animate-pulse"></div>
					</div>
				</div>
			))}
		</div>
	)
}

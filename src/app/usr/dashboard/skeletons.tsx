import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const CollectionSummaryCardSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-48 mt-2" />
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<div className="flex justify-between">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-8" />
					</div>
					<Skeleton className="h-1.5 w-full" />
				</div>

				<div className="space-y-2">
					<div className="flex justify-between">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-8" />
					</div>
					<Skeleton className="h-1.5 w-full" />
				</div>

				<div className="space-y-2">
					<div className="flex justify-between">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-8" />
					</div>
					<Skeleton className="h-1.5 w-full" />
				</div>

				<Separator />

				<div>
					<Skeleton className="h-5 w-24 mb-2" />
					{[...Array(3)].map((_, index) => (
						<div
							key={index}
							className="flex justify-between items-center py-2 text-sm"
						>
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-32" />
							</div>
							<Skeleton className="h-4 w-16" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

export const SummaryCardSkeleton = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
			{[...Array(3)].map((_, index) => (
				<Card key={index} className="space-y-4 p-4">
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-4" />
					</div>
					<Skeleton className="h-6 w-16" />
					<Skeleton className="h-2 w-full" />
					<Skeleton className="h-3 w-32" />
				</Card>
			))}
		</div>
	)
}

export const CollectionHistoryTableSkeleton = ({
	className,
}: {
	className?: string
}) => (
	<div className={`space-y-4 ${className}`}>
		<div className="flex items-center">
			<Skeleton className="h-6 w-32" />
			<Skeleton className="h-6 w-10 ml-2" />
		</div>

		<div className="rounded-lg border overflow-hidden">
			<div className="w-full">
				<div className="flex border-b">
					<Skeleton className="h-10 w-16 flex-1" />
					<Skeleton className="h-10 flex-1" />
					<Skeleton className="h-10 flex-1" />
					<Skeleton className="h-10 flex-1" />
				</div>

				<div className="space-y-2 p-2">
					{[...Array(5)].map((_, index) => (
						<div key={index} className="flex space-x-2">
							<Skeleton className="h-10 w-16 flex-1" />
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 flex-1" />
						</div>
					))}
				</div>
			</div>
		</div>
	</div>
)

export const ActivityStatsTabsSkeleton = () => {
	return (
		<Tabs defaultValue="rewards" className="space-y-4">
			<TabsList className="w-full">
				<TabsTrigger value="rewards" className="flex-1">
					<Skeleton className="h-4 w-4 mr-2" />
					<Skeleton className="h-4 w-16" />
				</TabsTrigger>
				<TabsTrigger value="history" className="flex-1">
					<Skeleton className="h-4 w-4 mr-2" />
					<Skeleton className="h-4 w-20" />
				</TabsTrigger>
			</TabsList>

			<TabsContent value="rewards">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48 mt-2" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[...Array(3)].map((_, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-4 rounded-lg border"
									>
										<div>
											<Skeleton className="h-5 w-24" />
											<div className="flex items-center mt-1">
												<Skeleton className="h-4 w-4 mr-1" />
												<Skeleton className="h-4 w-32" />
											</div>
										</div>
										<Skeleton className="h-10 w-16" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48 mt-2" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[...Array(2)].map((_, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-4 rounded-lg border"
									>
										<div>
											<Skeleton className="h-5 w-24" />
											<div className="flex items-center mt-1">
												<Skeleton className="h-4 w-4 mr-1" />
												<Skeleton className="h-4 w-32" />
											</div>
										</div>
										<Skeleton className="h-6 w-16" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</TabsContent>

			<TabsContent value="history">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64 mt-2" />
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							{[...Array(3)].map((_, index) => (
								<div key={index} className="space-y-4">
									<div className="flex items-center">
										<Skeleton className="h-6 w-32" />
										<Skeleton className="h-6 w-10 ml-2" />
									</div>
									<div className="rounded-lg border overflow-hidden">
										<div className="w-full">
											<div className="flex border-b">
												<Skeleton className="h-10 w-16 flex-1" />
												<Skeleton className="h-10 flex-1" />
												<Skeleton className="h-10 flex-1" />
												<Skeleton className="h-10 flex-1" />
											</div>
											<div className="space-y-2 p-2">
												{[...Array(3)].map((_, i) => (
													<div
														key={i}
														className="flex space-x-2"
													>
														<Skeleton className="h-10 w-16 flex-1" />
														<Skeleton className="h-10 flex-1" />
														<Skeleton className="h-10 flex-1" />
														<Skeleton className="h-10 flex-1" />
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}

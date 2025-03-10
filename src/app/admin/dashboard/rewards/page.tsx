import { RewardsTable } from "@/components/admin/dashboard/rewards/rewards-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function RewardsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Claimed Rewards
                    </h1>
                    <p className="text-muted-foreground">
                        Manage rewards claimed by users.
                    </p>
                </div>
                <Link href="/admin/dashboard/rewards/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Claimed Reward
                    </Button>
                </Link>
            </div>
            <RewardsTable />
        </div>
    )
}

import { ListRewardsTable } from "@/components/admin/dashboard/ListRewards/list-rewards"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ListRewardsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Reward Catalog
                    </h1>
                    <p className="text-muted-foreground">
                        Manage available rewards that users can claim.
                    </p>
                </div>
                <Link href="/dashboard/list-rewards/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Reward
                    </Button>
                </Link>
            </div>
            <ListRewardsTable />
        </div>
    )
}

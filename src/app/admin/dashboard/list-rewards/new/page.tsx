import { ListRewardForm } from "@/components/admin/dashboard/ListRewards/list-reward-form"
import BackBtn from "@/components/Backbtn"

export default function NewListRewardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BackBtn link={"/admin/dashboard/list-rewards"} />
            </div>

            <div className="w-full px-3 mt-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Reward
                </h1>
            </div>
            <ListRewardForm />
        </div>
    )
}

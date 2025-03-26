import { ListRewardForm } from "@/components/admin/dashboard/ListRewards/list-reward-form"
import BackBtn from "@/components/Backbtn"

export default async function EditListReward({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BackBtn link={"/admin/dashboard/user-profiles"} />
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit User Profile
                </h1>
            </div>
            <ListRewardForm rewardId={id} />
        </div>
    )
}

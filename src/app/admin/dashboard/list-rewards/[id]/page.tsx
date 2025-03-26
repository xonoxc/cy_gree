import { ListRewardDetails } from "@/components/admin/dashboard/ListRewards/list-rewards-details"
import BackBtn from "@/components/Backbtn"

export default async function RewardDetails({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = (await params) as {
        id: string
    }

    return (
        <div className="flex items-center justify-center w-full flex-col gap-4">
            <div className="flex items-center justify-start w-full">
                <BackBtn link={"/admin/dashboard/list-rewards"} />
            </div>
            <ListRewardDetails rewardId={id} />
        </div>
    )
}

import RewardForm from "@/components/admin/dashboard/rewards/reward-form"
import BackBtn from "@/components/Backbtn"

export default function NewRewardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 flex-col">
                <div className="w-full">
                    <BackBtn link={"/admin/dashboard/rewards"} />
                </div>
                <div className="w-full px-3 mt-5">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Add Claimed Reward
                    </h1>
                </div>
            </div>
            <RewardForm />
        </div>
    )
}

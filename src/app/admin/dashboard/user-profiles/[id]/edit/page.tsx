import { UserProfileForm } from "@/components/admin/dashboard/user-profiles/user-profiles"
import BackBtn from "@/components/Backbtn"

export default async function EditUserProfilePage({
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
                    Edit Reward
                </h1>
            </div>
            <UserProfileForm profileId={id} />
        </div>
    )
}

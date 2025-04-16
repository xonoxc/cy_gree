import { UserProfileForm } from "@/components/admin/dashboard/user-profiles/user-profiles"
import BackBtn from "@/components/Backbtn"

export default function NewUserProfilePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 justify-start flex-col">
                <div className="w-full">
                    <BackBtn link={"/admin/dashboard/user-profiles"} />
                </div>

                <div className="w-full px-4 mt-5">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create New User Profile
                    </h1>
                </div>
            </div>
            <UserProfileForm />
        </div>
    )
}

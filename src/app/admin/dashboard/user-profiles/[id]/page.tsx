import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"
import { UserProfileDetails } from "@/components/admin/dashboard/user-profiles/user-profile-details"
import BackBtn from "@/components/Backbtn"

export default async function UserPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: profileId } = await params

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BackBtn link={"/admin/dashboard/users"} />
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Details
                    </h1>
                </div>
                <Link href={`/admin/dashboard/users/${profileId}/edit`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                    </Button>
                </Link>
            </div>
            <UserProfileDetails profileId={profileId} />
        </div>
    )
}

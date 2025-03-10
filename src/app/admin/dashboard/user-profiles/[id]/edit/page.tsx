import { UserProfileForm } from "@/components/admin/dashboard/user-profiles/user-profiles"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditUserProfilePage({
    params,
}: {
    params: { id: string }
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/dashboard/user-profiles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit User Profile
                </h1>
            </div>
            <UserProfileForm profileId={params.id} />
        </div>
    )
}

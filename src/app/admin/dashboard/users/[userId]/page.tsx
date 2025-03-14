import { UserDetails } from "@/components/admin/dashboard/users/user-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

export default async function UserPage({
    params,
}: {
    params: Promise<{ userId: string }>
}) {
    const { userId } = await params

    console.log("userId", userId)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/admin/dashboard/users">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Details
                    </h1>
                </div>
                <Link href={`/admin/dashboard/users/${userId}/edit`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                    </Button>
                </Link>
            </div>
            <UserDetails userId={userId} />
        </div>
    )
}

import { UserForm } from "@/components/admin/dashboard/users/users-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ userId: string }>
}) {
    const { userId } = await params

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href={`/admin/dashboard/users/${userId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            </div>
            <UserForm userId={userId} />
        </div>
    )
}

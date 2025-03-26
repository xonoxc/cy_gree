import { UserForm } from "@/components/admin/dashboard/users/users-form"
import BackBtn from "@/components/Backbtn"

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ userId: string }>
}) {
    const { userId } = await params

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BackBtn link={`/admin/dashboard/users/${userId}`} />
                <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            </div>
            <UserForm userId={userId} />
        </div>
    )
}

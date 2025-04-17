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
            <div className="flex justify-start px-3 gap-2 flex-col ">
                <div className="flex flex-col gap-3">
                    <BackBtn link={`/admin/dashboard/users/${userId}`} />
                    <h1 className="text-3xl font-bold tracking-tight">
                        Edit User
                    </h1>
                </div>
            </div>
            <UserForm userId={userId} />
        </div>
    )
}

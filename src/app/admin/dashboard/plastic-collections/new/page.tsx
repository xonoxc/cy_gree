import { PlasticCollectionForm } from "@/components/admin/dashboard/plastic-collections/pcollection-form"
import BackBtn from "@/components/Backbtn"

export default function NewPlasticCollectionPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 flex-col">
                <div className="w-full">
                    <BackBtn link={"/admin/dashboard/plastic-collections"} />
                </div>
                <div className="w-full px-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Add Plastic Collection
                    </h1>
                </div>
            </div>
            <PlasticCollectionForm />
        </div>
    )
}

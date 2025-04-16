import { PlasticCollectionDetails } from "@/components/admin/dashboard/plastic-collections/plastic-collection-details"
import BackBtn from "@/components/Backbtn"

export default async function NewPlasticCollectionPage({
    params,
}: {
    params: Promise<{ collection_id: string }>
}) {
    const { collection_id } = await params

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BackBtn link={"/admin/dashboard/plastic-collections"} />
                <h1 className="text-3xl font-bold tracking-tight">
                    Add Plastic Collection
                </h1>
            </div>
            <PlasticCollectionDetails collectionId={collection_id} />
        </div>
    )
}

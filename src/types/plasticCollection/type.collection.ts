export interface ICollection {
    id: string
    userId: string
    userName?: string
    imagePath: string
    amount: number
    status: "Pending" | "Collected" | "Claimed"
    claimedBy?: string
    claimedByName?: string
    createdAt: string
    updateAt: string
}

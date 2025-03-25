export interface ICollection {
    id: string
    userId: string
    imagePath: string
    amount: number
    status: "Pending" | "Collected" | "Claimed"
    claimedBy?: string
    createdAt: Date
    updateAt: Date
}

import { z } from "zod"

/*
 *  create collection Schema
 *
 */
export const collectionCreateValidationSchema = z.object({
    amount_collected: z.number({ message: "Invalid collection amount" }),
    pic: z
        .string({ message: "pic must be a string" })
        .url({ message: "Pic must be a valid url" }),
})

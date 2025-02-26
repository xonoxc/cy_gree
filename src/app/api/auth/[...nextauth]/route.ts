import NexAuth from "next-auth"
import { authOptions } from "./options"

const handler = NexAuth(authOptions)

export { handler as GET, handler as POST }

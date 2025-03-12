import ImageKit from "imagekit"
import { NextResponse } from "next/server"

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_IO_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_IO_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_IO_ENDPOINT!,
})

export async function GET() {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters()

        return NextResponse.json(authenticationParameters)
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 })
    }
}

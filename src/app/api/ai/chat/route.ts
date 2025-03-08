import { NextRequest, NextResponse } from "next/server"
import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { checkAuth } from "@/utils/check.auth"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    await checkAuth()

    const groq = createGroq({
        apiKey: process.env.AI_API_KEY!,
    })

    try {
        const { messages } = await req.json()

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                {
                    error: "No messages provided",
                },
                { status: 400 }
            )
        }

        const result = streamText({
            messages,
            model: groq("deepseek-r1-distill-llama-70b"),
            temperature: 0.7,
        })

        return result.toDataStreamResponse()
    } catch (error: any) {
        console.error("Chat response error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}

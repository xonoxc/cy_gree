import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log("body:", body)

        const formattedMessages = body.messages.reduce(
            (acc: any[], message: any, index: number) => {
                if (index === 0 || message.role !== acc[acc.length - 1]?.role) {
                    acc.push(message)
                }
                return acc
            },
            []
        )

        const response = await fetch(
            `${process.env.AI_API_SERVER_URL!}/v1/chat/completions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.AI_API_KEY!}`,
                },
                body: JSON.stringify({
                    messages: formattedMessages,
                    model: "llama2-13b-chat-Q5_K_M",
                    max_tokens: 512,
                    temperature: 0.8,
                    top_k: 40,
                    top_p: 0.9,
                    stream: true,
                }),
            }
        )

        // Check if the response is not ok
        if (!response.ok) {
            const errorData = await response.json()
            console.error("API Error:", errorData)
            return NextResponse.json(
                { error: errorData.message || "API request failed" },
                { status: response.status }
            )
        }

        const readable = response.body
        if (!readable) {
            throw new Error("No response body")
        }

        return new NextResponse(readable, {
            status: response.status,
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "Cache-Control": "no-cache",
            },
        })
    } catch (error: any) {
        console.error("Chat response error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}

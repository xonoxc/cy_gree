import { useState } from "react"
import { useCompletion } from "ai/react"

type Role = "user" | "assistant" | "system"
type Message = { role: Role; content: string }
type Messages = Message[]

export const useChat = () => {
    const [messages, setMessages] = useState<Messages>([
        {
            role: "user",
            content:
                "You are a helpful AI assistant. Provide clear and concise responses.",
        },
    ])

    const { complete, completion, error, isLoading } = useCompletion({
        api: `${process.env.NEXT_PUBLIC_AI_API_SERVER_URL}/v1/chat/completions`,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: {
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            model: "llama2-13b-chat-Q5_K_M",
            max_tokens: 512,
            temperature: 0.8,
            top_k: 40,
            top_p: 0.9,
            stream: true,
        },
    })

    console.log(completion)

    const sendMessage = async (userInput: string) => {
        try {
            const newUserMessage: Message = { role: "user", content: userInput }
            const updatedMessages = [...messages, newUserMessage]
            setMessages(updatedMessages)

            const result = await complete(
                JSON.stringify({
                    messages: updatedMessages,
                })
            )

            if (result) {
                const newAiMessage: Message = {
                    role: "assistant",
                    content: result,
                }
                setMessages(prev => [...prev, newAiMessage])
            }
        } catch (err) {
            console.error("Error sending message:", err)
            throw err
        }
    }

    return {
        messages,
        setMessages,
        sendMessage,
        completion,
        error,
        isLoading,
    }
}

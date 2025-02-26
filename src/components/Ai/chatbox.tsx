"use client"

import { useChat } from "@ai-sdk/react"
import { useRef, useEffect } from "react"

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, status } =
        useChat({
            api: "/api/chat",
            initialMessages: [
                {
                    id: "system-1",
                    role: "system",
                    content:
                        "You are a helpful assistant. Respond concisely and accurately.",
                },
            ],
        })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="flex flex-col w-full max-w-xl mx-auto h-[80vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                            message.role === "user"
                                ? "bg-blue-100 ml-auto max-w-[80%]"
                                : message.role === "system"
                                  ? "bg-gray-100 text-gray-500 text-sm italic"
                                  : "bg-gray-200 max-w-[80%]"
                        }`}
                    >
                        <p className="text-sm font-semibold">
                            {message.role === "user"
                                ? "You"
                                : message.role === "system"
                                  ? "System"
                                  : "AI"}
                        </p>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Send a message..."
                        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={status === "streaming"}
                    />
                    <button
                        type="submit"
                        disabled={status === "streaming" || !input.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {status === "streaming" ? "..." : "Send"}
                    </button>
                </div>
            </form>
        </div>
    )
}

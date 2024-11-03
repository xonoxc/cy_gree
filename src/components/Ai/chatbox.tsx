"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, X } from "lucide-react"
import { ModeToggle } from "@/components/mode_toggle"

interface Message {
    role: "user" | "assistant"
    content: string
}

export default function AIChatbot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    const scrollToButton = () =>
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    useEffect(() => {
        scrollToButton()
    }, [messages, isLoading])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            if (!reader) throw new Error("No reader available")

            let assistantMessage = ""
            setMessages(prev => [...prev, { role: "assistant", content: "" }])

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                const lines = chunk
                    .split("\n")
                    .filter(line => line.trim() !== "")

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(5)
                        if (data === "[DONE]") continue

                        try {
                            const parsed = JSON.parse(data)
                            const content =
                                parsed.choices[0]?.delta?.content || ""
                            if (content) {
                                assistantMessage += content
                                setMessages(prev => {
                                    const newMessages = [...prev]
                                    newMessages[newMessages.length - 1] = {
                                        role: "assistant",
                                        content: assistantMessage,
                                    }
                                    return newMessages
                                })
                            }
                        } catch (e) {
                            console.error("Pasre chunk error:", e)
                        }
                    }
                }
            }
        } catch (err: any) {
            setError(err.message)
            console.error("Chat error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    aria-hidden="true"
                />
            )}
            <div>
                {!isOpen && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="rounded-full w-16 h-16 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <MessageCircle size={24} />
                        </Button>
                    </div>
                )}
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <Card className="w-full max-w-2xl h-[80vh] flex flex-col bg-background text-foreground shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold">
                                    AI Chat
                                </CardTitle>
                                <div className="flex space-x-2">
                                    <ModeToggle />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 px-0"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <div className="w-full flex items-center justify-center text-red-500">
                                {error && error}
                            </div>
                            <CardContent className="flex-grow overflow-auto py-4 px-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                                    >
                                        <div
                                            className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-2`}
                                        >
                                            <Avatar
                                                className={`w-8 h-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}
                                            >
                                                <AvatarImage
                                                    src={
                                                        message.role ===
                                                        "assistant"
                                                            ? "/placeholder.svg?height=32&width=32"
                                                            : undefined
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {message.role ===
                                                    "assistant"
                                                        ? "AI"
                                                        : "You"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`p-3 rounded-lg max-w-[70%] ${
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start mb-4">
                                        <div className="flex flex-row items-start space-x-2">
                                            <Avatar className="w-8 h-8 mr-2">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                                <AvatarFallback>
                                                    AI
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="p-3 rounded-lg max-w-[70%] bg-muted">
                                                <div className="animate-pulse">
                                                    <div className="h-4 w-4 bg-gray-300 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full items-center space-x-2"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={isLoading}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
            <div ref={messagesEndRef} />
        </>
    )
}

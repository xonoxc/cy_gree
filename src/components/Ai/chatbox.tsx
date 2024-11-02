"use client"

import { useState, useEffect } from "react"
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
import { MessageCircle, Send, X, Moon, Sun } from "lucide-react"

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<
        { role: "user" | "ai"; content: string }[]
    >([])
    const [input, setInput] = useState("")
    const [isDarkMode, setIsDarkMode] = useState(false)

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

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { role: "user", content: input }])
            // Simulate AI response
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    { role: "ai", content: "This is a simulated AI response." },
                ])
            }, 1000)
            setInput("")
        }
    }

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    aria-hidden="true"
                />
            )}
            <div className={`${isDarkMode ? "dark" : ""}`}>
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
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 px-0"
                                        onClick={toggleDarkMode}
                                    >
                                        {isDarkMode ? (
                                            <Sun size={16} />
                                        ) : (
                                            <Moon size={16} />
                                        )}
                                    </Button>
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
                                                        message.role === "ai"
                                                            ? "/placeholder.svg?height=32&width=32"
                                                            : undefined
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {message.role === "ai"
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
                            </CardContent>
                            <CardFooter>
                                <form
                                    onSubmit={e => {
                                        e.preventDefault()
                                        handleSend()
                                    }}
                                    className="flex w-full items-center space-x-2"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button type="submit" size="icon">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
        </>
    )
}

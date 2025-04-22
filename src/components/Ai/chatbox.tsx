"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Message, useChat } from "@ai-sdk/react"
import { X, Send, Maximize2, Minimize2, Brain, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { motion, useDragControls, MotionProps } from "framer-motion"
import { initialMessages } from "./initial-messages"
import Markdown from "react-markdown"

/**
 * modified type for motion div
 */

type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>

/**
 * Main Draggable Chat component
 */

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [mounted, setMounted] = useState<boolean>(false)
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: 400,
        height: 500,
    })
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [prevSize, setPrevSize] = useState<{ width: number; height: number }>(
        {
            width: 400,
            height: 500,
        }
    )

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const resizableRef = useRef<HTMLDivElement | null>(null)
    const dragControls = useDragControls()

    const { messages, input, handleInputChange, handleSubmit, status } =
        useChat({
            api: "/api/ai/chat",
            initialMessages: initialMessages as Message[],
        })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const toggleFullscreen = () => {
        if (isFullscreen) {
            setSize(prevSize)
            setIsFullscreen(false)
        } else {
            setPrevSize(size)
            setSize({
                width: window.innerWidth * 0.8,
                height: window.innerHeight * 0.8,
            })
            setIsFullscreen(true)
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (input.trim()) {
            handleSubmit(e)
        }
    }

    const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
        dragControls.start(e)
    }

    if (!mounted) return null

    return (
        <>
            {/* Chat toggle button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300",
                    "bg-gray-600 hover:bg-gray-500 dark:bg-white "
                )}
                aria-label="Open chat"
            >
                <Bot className={cn("h-5 w-5", "text-black")} />
            </Button>

            {/* Modal backdrop */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed inset-0  z-50 flex items-center justify-center",
                        "bg-transparent"
                    )}
                    onClick={() => setIsOpen(false)}
                >
                    {/* Chat modal */}
                    <motion.div
                        ref={resizableRef}
                        drag
                        dragControls={dragControls}
                        dragMomentum={false}
                        dragListener={false}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                            e.stopPropagation()
                        }
                        style={{
                            width: size.width,
                            height: size.height,
                            touchAction: "none",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "10px",
                            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                            overflow: "hidden",
                            backgroundColor: "#0F0F12",
                            border: "1px solid #333",
                            transition: "all 200ms",
                            position: "relative",
                        }}
                        {...({} as MotionDivProps)}
                    >
                        {/* Drag handle */}
                        <div
                            className="absolute inset-0 cursor-move"
                            onPointerDown={startDrag}
                            style={{ pointerEvents: "none" }}
                        />

                        {/* Chat header */}
                        <div
                            className={cn(
                                "p-3 flex justify-between items-center cursor-move rounded-t-lg bg-[#0F012]"
                            )}
                            onPointerDown={startDrag}
                            style={{ pointerEvents: "auto" }}
                        >
                            <h3 className="font-medium text-xl flex items-center justify-center gap-3">
                                <Bot color={"green"} />
                                Chat
                            </h3>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleFullscreen}
                                    className={cn("h-6 w-6 p-0 rounded-full")}
                                >
                                    {isFullscreen ? (
                                        <Minimize2 className="h-4 w-4" />
                                    ) : (
                                        <Maximize2 className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "h-6 w-6 p-0 rounded-full",
                                        "text-white hover:bg-[#3a3a3a]"
                                    )}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat messages */}
                        <div
                            className={cn(
                                "flex-1 overflow-y-auto p-4 space-y-4",
                                "text-white"
                            )}
                        >
                            {messages
                                .filter(m => m.role !== "system")
                                .map(message => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex flex-col",
                                            message.role === "user"
                                                ? "items-end"
                                                : "items-start"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "text-xs mb-1",
                                                "text-gray-400",
                                                message.role === "user"
                                                    ? "mr-2"
                                                    : "ml-2"
                                            )}
                                        >
                                            {message.role === "user"
                                                ? "You"
                                                : "AI"}
                                        </span>
                                        <div
                                            className={cn(
                                                "rounded-lg p-3 max-w-[70%] text-sm",
                                                message.role === "user"
                                                    ? "bg-[white] text-black"
                                                    : "bg-[#1e1e2e] text-white",
                                                "whitespace-pre-wrap",
                                                "overflow-wrap break-word",
                                                "word-break break-word"
                                            )}
                                        >
                                            <Markdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[
                                                    rehypeHighlight,
                                                ]}
                                            >
                                                {message.content}
                                            </Markdown>
                                        </div>
                                    </div>
                                ))}
                            {status === "streaming" && (
                                <div className="flex justify-start pl-3 items-center py-4">
                                    <span
                                        className={cn(
                                            "text-sm",
                                            "text-gray-400"
                                        )}
                                    >
                                        <Brain className="inline-block mr-2 h-4 w-4" />
                                        Thinking...
                                    </span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat input */}
                        <form
                            onSubmit={onSubmit}
                            className={cn(
                                "border-t p-3",
                                "border-[#333] bg-[#0f1014]"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Textarea
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Type your message..."
                                    className={cn(
                                        "flex-1 min-h-[40px] max-h-[100px] resize-none border-none focus-visible:ring-0 rounded-lg text-sm",
                                        "bg-muted/50 text-white placeholder-gray-400"
                                    )}
                                    disabled={status === "streaming"}
                                    onKeyDown={e => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            if (input.trim()) {
                                                handleSubmit(e as any)
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={
                                        status === "streaming" || !input.trim()
                                    }
                                    className={cn(
                                        "h-8 w-8 rounded-lg",
                                        "bg-white Q hover:bg-gray-500"
                                    )}
                                >
                                    {status === "streaming" ? (
                                        <div
                                            className={cn(
                                                "h-4 w-4 animate-pulse",
                                                "text-black"
                                            )}
                                        >
                                            •
                                        </div>
                                    ) : (
                                        <Send
                                            className={cn(
                                                "h-full w-full text-black"
                                            )}
                                        />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    )
}

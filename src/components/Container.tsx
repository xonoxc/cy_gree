"use client"

import * as React from "react"

const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="lg:max-w-[1920px]" suppressHydrationWarning>
            {children}
        </div>
    )
}

export default Container


import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import localFont from "next/font/local"
import "./globals.css"

const sfpro = localFont({
    src: "../../public/fonts/sf-pro-display_regular.woff2",
})

export const metadata: Metadata = {
    title: "cyGree",
    description: "platform for waste managment",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${sfpro.className} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    )
}

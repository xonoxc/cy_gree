import localFont from "next/font/local"
import Container from "@/components/Container"
import "./globals.css"
import Providers from "@/components/Providers/prodviders"

const sfpro = localFont({
    src: "../../public/fonts/sf-pro-display_regular.woff2",
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${sfpro.className} antialiased`}
                suppressHydrationWarning
            >
                <Providers>
                    <Container>{children}</Container>
                </Providers>
            </body>
        </html>
    )
}

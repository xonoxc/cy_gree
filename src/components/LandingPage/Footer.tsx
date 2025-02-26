"use client"

import Image from "next/image"
import { GridPattern } from "@/components/Animated"
import { cn } from "@/lib/utils"

const Footer = () => (
    <footer className="dark:bg-black dark:text-gray-300 text-gray-600  py-8 relative">
        <div className="container mx-auto px-4 text-center ">
            <p>&copy; 2024 CyGree. All rights reserved.</p>

            <div className="powered flex items-center justify-center flex-col gap-4">
                <span className="text-7xl">Powered by</span>
                <Image
                    src={"/images/vutr_logo.png"}
                    height={200}
                    width={200}
                    alt="Vutr logo"
                />
            </div>
        </div>

        <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
            )}
        />
    </footer>
)

export default Footer

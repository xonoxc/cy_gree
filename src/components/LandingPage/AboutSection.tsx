import { DotPattern } from "@/components/Animated"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Bitcoin, ClipboardList } from "lucide-react"

const AboutSection = () => (
    <section id="about" className="mb-16">
        <h3 className="text-3xl font-semibold text-green-400 mb-6 flex gap-2">
            About Our Project
            <ClipboardList color="white" size={40} />
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <p className="dark:text-gray-300 text-gray-600 mb-4">
                    Our project aims to contribute to environmental
                    sustainability by reducing plastic waste. We incentivize
                    users to collect and submit their used plastic materials,
                    which we sell to recycling agents.
                </p>
                <p className="dark:text-gray-300 text-gray-600 mb-4">
                    In return, users receive monetary gains in the form of gift
                    coupons, special offers, or our innovative plastic
                    cryptocurrency based on defined thresholds.
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="dark:bg-black p-6 rounded-lg shadow-md"
            >
                <h4 className="text-xl font-semibold text-green-400 mb-4 flex items-center">
                    Our Innovation: Plastic Crypto Coin{" "}
                    <Bitcoin color="white" size={60} />{" "}
                </h4>
                <p className="dark:text-gray-300 text-gray-600">
                    Earn our custom plastic cryptocurrency as you meet specific
                    plastic collection thresholds. These coins can be redeemed
                    for gift coupons, exchanged for other digital assets, or
                    even traded on supported platforms.
                </p>
            </motion.div>
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
                )}
            />
        </div>
    </section>
)

export default AboutSection

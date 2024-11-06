import {
    Recycle,
    Gift,
    Coins,
    BarChart3,
    Globe,
    Leaf,
    PieChart,
} from "lucide-react"
import { BentoGrid, BentoCard } from "@/components/Animated"

const features = [
    {
        Icon: Recycle,
        name: "Plastic Collection Tracking",
        description:
            "Monitor your plastic waste reduction efforts with our easy-to-use tracking system.",
        href: "/",
        cta: "Learn more",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
        Icon: Gift,
        name: "Reward Management",
        description:
            "Earn gift coupons and special offers as you reach collection milestones.",
        href: "/",
        cta: "Learn more",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
        Icon: Coins,
        name: "Plastic Crypto Coin",
        description:
            "Earn and trade our unique cryptocurrency based on your recycling efforts.",
        href: "/",
        cta: "Learn more",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
        Icon: BarChart3,
        name: "User Dashboard",
        description:
            "Track your environmental impact and rewards in real-time.",
        href: "/",
        cta: "Learn more",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
        Icon: Globe,
        name: "Global Network",
        description:
            "Connect with recycling agents and contribute to worldwide sustainability efforts.",
        href: "/",
        cta: "Learn more",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
    {
        Icon: Leaf,
        name: "Environmental Impact",
        description:
            "See the tangible effects of your contributions to a cleaner planet.",
        href: "/",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:col-start-2 lg:col-end-3 lg:row-start-4 lg:row-end-5",
    },

    {
        Icon: PieChart,
        name: "Recycling Analytics",
        description:
            "Get detailed insights on your recycling patterns and progress over time.",
        href: "/",
        cta: "Learn more",
        background: (
            <img
                className="absolute -right-20 -top-20 opacity-60"
                alt="image"
            />
        ),
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-4 lg:row-end-5",
    },
]

export function FeaturesSection() {
    return (
        <BentoGrid className="lg:grid-rows-3">
            {features.map(feature => (
                <BentoCard key={feature.name as string} {...feature} />
            ))}
        </BentoGrid>
    )
}

export default FeaturesSection

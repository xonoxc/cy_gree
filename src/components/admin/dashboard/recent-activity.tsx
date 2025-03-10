import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
    {
        user: "Olivia Davis",
        initials: "OD",
        action: "collected 5.2 kg of plastic",
        time: "2 minutes ago",
    },
    {
        user: "Jackson Lee",
        initials: "JL",
        action: "claimed a Gift Coupon reward",
        time: "15 minutes ago",
    },
    {
        user: "Sophia Martinez",
        initials: "SM",
        action: "earned Eco Warrior badge",
        time: "1 hour ago",
    },
    {
        user: "Ethan Wilson",
        initials: "EW",
        action: "registered as a new user",
        time: "2 hours ago",
    },
    {
        user: "Ava Thompson",
        initials: "AT",
        action: "collected 3.7 kg of plastic",
        time: "3 hours ago",
    },
]

export function RecentActivity() {
    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={`/placeholder.svg?height=36&width=36&text=${activity.initials}`}
                            alt={activity.user}
                        />
                        <AvatarFallback>{activity.initials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {activity.user} {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {activity.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

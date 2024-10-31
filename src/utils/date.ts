import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns"

function getRelativeTime(timestamp: string): string {
    const now = new Date()
    const date = new Date(timestamp)

    if (isToday(date)) {
        return formatDistanceToNow(date, { addSuffix: true })
    }

    if (isYesterday(date)) {
        return "yesterday"
    }

    const timeDifferenceMs: number = now.getTime() - date.getTime()
    const daysDiff: number = Math.floor(
        timeDifferenceMs / (1000 * 60 * 60 * 24)
    )

    if (daysDiff < 7) {
        return `${daysDiff} days ago`
    }

    return format(date, "MMM d, yyyy")
}

export default getRelativeTime

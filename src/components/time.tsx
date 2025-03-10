import getRelativeTime from "@/utils/date"

const Time = ({ timeStamp }: { timeStamp: string }) => (
    <time>{getRelativeTime(timeStamp)}</time>
)

export default Time

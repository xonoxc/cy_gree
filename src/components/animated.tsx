import type React from "react"

interface DotPatternProps {
    width: number
    height: number
    cx: number
    cy: number
    cr: number
    className?: string
}

export const DotPattern: React.FC<DotPatternProps> = ({
    width,
    height,
    cx,
    cy,
    cr,
    className,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            className={className}
        >
            <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
        </svg>
    )
}

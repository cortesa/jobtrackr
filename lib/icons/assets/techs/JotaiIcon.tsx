import type { IconProps } from "../../types"
import { getScaledDimensions } from "../../utils"

const VIEW_BOX = "0 0 100 100"

export function JotaiIcon({ size = 24, ...props }: IconProps) {
  const { width, height } = getScaledDimensions(VIEW_BOX, size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={width}
      height={height}
      {...props}
    >
      <rect width="100" height="100" rx="18" fill="#111827" />
      <text
        x="50"
        y="64"
        fontSize="64"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        👻
      </text>
    </svg>
  )
}

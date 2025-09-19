import type { IconProps } from "../types"
import { getScaledDimensions } from "../utils"

const VIEW_BOX = "0 0 24 24"

export function CodeIcon({ size = 24, ...props }: IconProps) {
  const { width, height } = getScaledDimensions(VIEW_BOX, size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      {...props}
    >
      <path d="m7 8-4 4 4 4M17 8l4 4-4 4M14 4l-4 16" />
    </svg>
  )
}


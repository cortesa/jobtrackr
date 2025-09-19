import type { IconProps } from "../types"
import { getScaledDimensions } from "../utils"

const VIEW_BOX = "0 0 24 24"

export function FlaskIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M9 3h6" />
      <path d="M10 9h4" />
      <path d="M10 3v6L6 20a.7.7 0 0 0 .5 1h11a.7.7 0 0 0 .5-1L14 9V3" />
    </svg>
  )
}


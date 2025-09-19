import type { IconProps } from "../../types"
import { getScaledDimensions } from "../../utils"

const VIEW_BOX = "0 0 24 24"

export function StackIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M12 2 4 6l8 4 8-4z" />
      <path d="m4 10 8 4 8-4" />
      <path d="m4 18 8 4 8-4" />
      <path d="m4 14 8 4 8-4" />
    </svg>
  )
}


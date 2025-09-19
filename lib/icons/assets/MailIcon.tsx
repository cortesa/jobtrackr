import type { IconProps } from "../types"
import { getScaledDimensions } from "../utils"

const VIEW_BOX = "0 0 24 24"

export function MailIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M12 18H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7.5" />
      <path d="m3 6 9 6 9-6M15 18h6M18 15l3 3-3 3" />
    </svg>
  )
}


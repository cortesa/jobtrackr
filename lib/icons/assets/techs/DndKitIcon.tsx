import type { IconProps } from "../../types"
import { getScaledDimensions } from "../../utils"

const VIEW_BOX = "0 0 24 24"

export function DndKitIcon({ size = 24, ...props }: IconProps) {
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
      strokeWidth={1}
      {...props}
    >
      <g transform="translate(12 12) rotate(45) scale(1.4) translate(-12 -12)">
        <path d="m18 9 3 3-3 3" />
        <path d="M15 12h6" />
        <path d="m6 9-3 3 3 3" />
        <path d="M3 12h6" />
        <path d="m9 18 3 3 3-3" />
        <path d="M12 15v6" />
        <path d="m15 6-3-3-3 3" />
        <path d="M12 3v15" />
      </g>
    </svg>
  )
}


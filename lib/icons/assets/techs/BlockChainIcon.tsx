import type { IconProps } from "../../types"
import { getScaledDimensions } from "../../utils"

const VIEW_BOX = "0 0 24 24"

export function BlockChainIcon({ size = 24, ...props }: IconProps) {
  const { width, height } = getScaledDimensions(VIEW_BOX, size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={width}
      height={height}
      fill="none"
      stroke="#6b7280"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.544 10.456a4.366 4.366 0 0 0-6.176 0L4.28 13.544a4.367 4.367 0 1 0 6.177 6.176L12 18.177"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.456 13.544a4.366 4.366 0 0 0 6.176 0l3.089-3.088a4.368 4.368 0 0 0-6.176-6.176L12 5.823"
      />
    </svg>
  )
}

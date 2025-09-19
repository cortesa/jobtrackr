import type { IconProps } from "../types"
import { getScaledDimensions } from "../utils"

const VIEW_BOX = "0 0 200 200"

export function CIcon({ size = 24, ...props }: IconProps) {
  const { width, height } = getScaledDimensions(VIEW_BOX, size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={width}
      height={height}
      {...props}
    >
      <defs>
        <radialGradient id="organicGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#34a0a4" stopOpacity="1" />
          <stop offset="100%" stopColor="#168aad" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="cStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#56cfe1" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#organicGrad)" />
      <path
        d="M130 70C100 30 40 70 60 120C80 170 140 150 140 110"
        fill="none"
        stroke="url(#cStrokeGrad)"
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="130" cy="70" r="5" fill="#ffffff" />
    </svg>
  )
}

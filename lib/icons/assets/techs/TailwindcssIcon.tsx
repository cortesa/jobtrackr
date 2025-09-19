import type { IconProps } from "../../types"
import { getScaledDimensions } from "../../utils"

const VIEW_BOX = "0 0 256 154"

export function TailwindcssIcon({ size = 24, ...props }: IconProps) {
  const { width, height } = getScaledDimensions(VIEW_BOX, size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <defs>
        <linearGradient id="tailwind-gradient" x1="-2.778%" y1="32%" x2="100%" y2="67.556%">
          <stop offset="0%" stopColor="#2298BD" />
          <stop offset="100%" stopColor="#0ED7B5" />
        </linearGradient>
      </defs>
      <path
        fill="url(#tailwind-gradient)"
        d="M128 0Q76.8 0 64 51.2 83.2 25.6 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8q51.2 0 64-51.2-19.2 25.6-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0M64 76.8q-51.2 0-64 51.2 19.2-25.6 44.8-19.2c9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6q51.2 0 64-51.2-19.2 25.6-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8"
      />
    </svg>
  )
}


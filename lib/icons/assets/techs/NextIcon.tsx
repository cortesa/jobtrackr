import type { IconProps } from "../../types"
import { getScaledDimensions } from "../../utils"

const VIEW_BOX = "0 0 180 180"

export function NextIcon({ size = 24, ...props }: IconProps) {
  const { width, height } = getScaledDimensions(VIEW_BOX, size)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEW_BOX}
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <mask id="next-mask" x={0} y={0} width={180} height={180} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
        <circle cx={90} cy={90} r={90} fill="#000" />
      </mask>
      <g mask="url(#next-mask)">
        <circle cx={90} cy={90} r={87} fill="#000" stroke="#fff" strokeWidth={6} />
        <path
          fill="url(#next-gradient-a)"
          d="M149.508 157.52 69.142 54H54v71.97h12.114V69.384l73.886 95.461a90 90 0 0 0 9.508-7.325"
        />
        <path fill="url(#next-gradient-b)" d="M115 54h12v72h-12z" />
      </g>
      <defs>
        <linearGradient
          id="next-gradient-a"
          x1={109}
          y1={116.5}
          x2={144.5}
          y2={160.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id="next-gradient-b"
          x1={121}
          y1={54}
          x2={120.799}
          y2={106.875}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}


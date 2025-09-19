import { DirectionalIconProps } from "../types"

const ROTATION: Record<Exclude<DirectionalIconProps["direction"], undefined>, string | undefined> = {
  up: "rotate(-90, 12, 12)",
  upRight: "rotate(-45, 12, 12)",
  right: undefined,
  downRight: "rotate(45, 12, 12)",
  down: "rotate(90, 12, 12)",
  downLeft: "rotate(135, 12, 12)",
  left: "rotate(180, 12, 12)",
  upLeft: "rotate(-135, 12, 12)",
}

export function ArrowIcon({
  direction = "right",
  unbordered = false,
  size = 20,
  ...props
}: DirectionalIconProps & { unbordered?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform={ROTATION[direction]}>
        <path
          visibility={!unbordered ? "visible" : "hidden"}
          d="M13.25 15L16.25 12M16.25 12L13.25 9M16.25 12H8.75M21.5 12C21.5 13.1819 21.2672 14.3522 20.8149 15.4442C20.3626 16.5361 19.6997 17.5282 18.864 18.364C18.0282 19.1997 17.0361 19.8626 15.9442 20.3149C14.8522 20.7672 13.6819 21 12.5 21C11.3181 21 10.1478 20.7672 9.05585 20.3149C7.96392 19.8626 6.97177 19.1997 6.13604 18.364C5.30031 17.5282 4.63738 16.5361 4.18508 15.4442C3.73279 14.3522 3.5 13.1819 3.5 12C3.5 9.61305 4.44821 7.32387 6.13604 5.63604C7.82387 3.94821 10.1131 3 12.5 3C14.8869 3 17.1761 3.94821 18.864 5.63604C20.5518 7.32387 21.5 9.61305 21.5 12Z"
        />
        <g visibility={unbordered ? "visible" : "hidden"}>
          <path d="M12.5 5L19.5 12L12.5 19" />
          <path d="M5.5 12H19.5" />
        </g>
      </g>
    </svg>
  )
}

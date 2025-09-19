import type { ElementType, SVGProps } from "react"

export type Direction =
  | "up"
  | "upRight"
  | "right"
  | "downRight"
  | "down"
  | "downLeft"
  | "left"
  | "upLeft"

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "ref" | "width" | "height"> {
  size?: number
}

export interface DirectionalIconProps extends IconProps {
  direction?: Direction
}

export type IconComponent<P extends IconProps = IconProps> = ElementType<P>

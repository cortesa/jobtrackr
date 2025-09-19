import { ArrowIcon } from "./assets/ArrowIcon"
import { BriefcaseIcon } from "./assets/BriefcaseIcon"
import { CIcon } from "./assets/CIcon"
import { ChatIcon } from "./assets/ChatIcon"
import { CodeIcon } from "./assets/CodeIcon"
import { FlaskIcon } from "./assets/FlaskIcon"
import { MailIcon } from "./assets/MailIcon"
import { PortfolioIcon } from "./assets/PortfolioIcon"
import { LinkedInIcon } from "./assets/companies/LinkedInIcon"
import { AstroIcon } from "./assets/techs/AstroIcon"
import { BlockChainIcon } from "./assets/techs/BlockChainIcon"
import { CssIcon } from "./assets/techs/CssIcon"
import { DndKitIcon } from "./assets/techs/DndKitIcon"
import { ExpressIcon } from "./assets/techs/ExpressIcon"
import { GitIcon } from "./assets/techs/GitIcon"
import { GithubIcon } from "./assets/techs/GithubIcon"
import { HtmlIcon } from "./assets/techs/HtmlIcon"
import { JotaiIcon } from "./assets/techs/JotaiIcon"
import { LitIcon } from "./assets/techs/LitIcon"
import { NextIcon } from "./assets/techs/NextIcon"
import { NodeIcon } from "./assets/techs/NodeIcon"
import { ReactIcon } from "./assets/techs/ReactIcon"
import { ReactQueryIcon } from "./assets/techs/ReactQueryIcon"
import { SassIcon } from "./assets/techs/SassIcon"
import { SocketIoIcon } from "./assets/techs/SocketIoIcon"
import { StackIcon } from "./assets/techs/StackIcon"
import { TailwindcssIcon } from "./assets/techs/TailwindcssIcon"
import { TypescriptIcon } from "./assets/techs/TypescriptIcon"
import { ViteIcon } from "./assets/techs/ViteIcon"
import { ZustandIcon } from "./assets/techs/ZustandIcon"

export const Icons = {
  arrow: ArrowIcon,
  astro: AstroIcon,
  blockChain: BlockChainIcon,
  briefcase: BriefcaseIcon,
  c: CIcon,
  chat: ChatIcon,
  code: CodeIcon,
  css: CssIcon,
  dndKit: DndKitIcon,
  express: ExpressIcon,
  flask: FlaskIcon,
  git: GitIcon,
  github: GithubIcon,
  html: HtmlIcon,
  jotai: JotaiIcon,
  linkedIn: LinkedInIcon,
  lit: LitIcon,
  mail: MailIcon,
  next: NextIcon,
  node: NodeIcon,
  portfolio: PortfolioIcon,
  react: ReactIcon,
  reactQuery: ReactQueryIcon,
  sass: SassIcon,
  socketIo: SocketIoIcon,
  stack: StackIcon,
  tailwindcss: TailwindcssIcon,
  typescript: TypescriptIcon,
  vite: ViteIcon,
  zustand: ZustandIcon,
} as const

export type IconName = keyof typeof Icons

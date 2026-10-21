// Ported from RigRAG's frontend/src/components/icons.tsx.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const PlusIcon = (p: IconProps) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
export const ArrowUpIcon = (p: IconProps) => <Icon {...p}><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></Icon>
export const StopIcon = (p: IconProps) => <Icon {...p}><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none" /></Icon>
export const MenuIcon = (p: IconProps) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Icon>
export const CloseIcon = (p: IconProps) => <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>
export const CopyIcon = (p: IconProps) => <Icon {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></Icon>
export const CheckIcon = (p: IconProps) => <Icon {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>
export const WarningIcon = (p: IconProps) => <Icon {...p}><path d="M12 4 2.5 20h19L12 4ZM12 10v4M12 17h.01" /></Icon>

/** RigRAG mark: a chip with pins, echoing the favicon. */
export function LogoMark(p: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...p}>
      <rect x="7" y="7" width="18" height="18" rx="3" fill="var(--accent)" />
      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="var(--bg)" />
      <path
        d="M12 3v3M16 3v3M20 3v3M12 26v3M16 26v3M20 26v3M3 12h3M3 16h3M3 20h3M26 12h3M26 16h3M26 20h3"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

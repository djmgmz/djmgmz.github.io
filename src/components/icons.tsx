import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

/** Arrow leaving a box, marking links that open in a new tab. */
export function ExternalIcon(props: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  )
}

/** Shown in light mode on the colour-mode switch. */
export function SunIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </svg>
  )
}

/** Shown in dark mode on the colour-mode switch. */
export function MoonIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...stroke} {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

/** Play triangle on the buttons that start a demo replay. */
export function PlayIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
    </svg>
  )
}

/**
 * One drawn mark per page section, on the same 24px grid and 1.6 stroke. Each has one `nav-fill`
 * shape that fills with the accent when its section is the one being read.
 */
export function SectionIcon({ id }: { id: string }) {
  const art: Record<string, ReactNode> = {
    top: (
      <>
        <path d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1h-4.6v-5.2H9.6V20H5a1 1 0 0 1-1-1z" />
        <path className="nav-fill" d="M9.6 14.8h4.8V20H9.6z" />
      </>
    ),
    about: (
      <>
        <path d="M5 19.8c1.2-3.4 3.8-5.2 7-5.2s5.8 1.8 7 5.2" />
        <circle className="nav-fill" cx="12" cy="8.6" r="3.6" />
      </>
    ),
    projects: (
      <>
        <rect x="3.4" y="4.8" width="17.2" height="14.4" rx="2.4" />
        <path d="M3.4 8.8h17.2" />
        <path className="nav-fill" d="M10.4 11.6v5l4.3-2.5z" />
      </>
    ),
    skills: (
      <>
        <path d="M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9" />
        <circle className="nav-fill" cx="15" cy="7.5" r="2.2" />
        <circle className="nav-fill" cx="9" cy="16.5" r="2.2" />
      </>
    ),
    interests: (
      <>
        <path d="M5 15.5V12a7 7 0 0 1 14 0v3.5" />
        <path className="nav-fill" d="M4.8 14h2.8v5.6H6a1.2 1.2 0 0 1-1.2-1.2zM19.2 14h-2.8v5.6H18a1.2 1.2 0 0 0 1.2-1.2z" />
      </>
    ),
    faq: (
      <>
        <path d="M5.2 5h13.6A1.7 1.7 0 0 1 20.5 6.7v8.2a1.7 1.7 0 0 1-1.7 1.7h-7.5L6.6 20.2v-3.6H5.2a1.7 1.7 0 0 1-1.7-1.7V6.7A1.7 1.7 0 0 1 5.2 5z" />
        <path d="M10.3 9.3a1.8 1.8 0 1 1 2.5 1.7c-.5.2-.8.6-.8 1.1v.4" />
        <circle className="nav-fill" cx="12" cy="14.2" r="1" />
      </>
    ),
    contact: (
      <>
        <rect x="3.4" y="5.8" width="17.2" height="12.4" rx="2" />
        <path className="nav-fill nav-fill--line" d="M4.2 7.2 12 12.6l7.8-5.4" />
      </>
    ),
  }
  return (
    <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" {...stroke} strokeWidth={1.6}>
      {art[id]}
    </svg>
  )
}

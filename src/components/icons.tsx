import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

/** Side-on airliner pointing right, used between route codes and on boarding actions. */
export function PlaneIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M21.5 12c0-.8-.7-1.5-1.5-1.5h-5L10 3H8l2.5 7.5H6L4.2 8H2.5l1.2 4-1.2 4h1.7L6 13.5h4.5L8 21h2l5-7.5h5c.8 0 1.5-.7 1.5-1.5z" />
    </svg>
  )
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  )
}

/** Wallet monogram: a coupon with the DG initials, matching the favicon. */
export function Monogram(props: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
      <path d="M3 8h26v6a2 2 0 0 0 0 4v6H3v-6a2 2 0 0 0 0-4z" fill="#fff" />
      <path
        d="M8 12.5h3.4c2.1 0 3.5 1.4 3.5 3.5s-1.4 3.5-3.5 3.5H8zM17.2 16c0-2.1 1.5-3.5 3.6-3.5 1.1 0 2 .4 2.6 1l-1 1c-.4-.4-.9-.6-1.6-.6-1.2 0-2 .8-2 2.1s.8 2.1 2 2.1c.5 0 .8-.1 1.1-.3v-1.1h-1.4v-1.3h2.9v3.2c-.7.6-1.6.9-2.6.9-2.1 0-3.6-1.4-3.6-3.5z"
        fill="#d7262d"
      />
    </svg>
  )
}

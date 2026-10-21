import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { skills } from '../content'
import { skillIcons } from './skillIcons'

// Belt surface speed in px per second. Bags and the rubber slats under them share it, so the
// bags ride the belt instead of sliding over it.
const BELT_SPEED = 46
const SLAT_PITCH = 64
// Three copies keep the belt full on very wide screens; the track loops after one copy.
const COPIES = 3

function relativeLuminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
}

function Bag({ name, tilt, copy }: { name: string; tilt: number; copy: number }) {
  const icon = skillIcons[name]
  // Light brand marks (React cyan, Hugging Face yellow) vanish on a white case, so they ride on a navy one.
  const dark = icon && 'hex' in icon && relativeLuminance(icon.hex) > 0.45
  return (
    <li
      className={`bag${dark ? ' bag--dark' : ''}`}
      data-copy={copy > 0 || undefined}
      style={{ '--tilt': `${tilt}deg` } as CSSProperties}
    >
      <span className="bag-handle" aria-hidden="true" />
      <span className="bag-case" aria-hidden="true">
        {icon && 'path' in icon ? (
          <svg viewBox="0 0 24 24" width="40" height="40" focusable="false">
            <path d={icon.path} fill={`#${icon.hex}`} />
          </svg>
        ) : (
          <span className="bag-mark">{icon && 'mark' in icon ? icon.mark : name.slice(0, 3)}</span>
        )}
      </span>
      <span className="bag-tag caps">{name}</span>
    </li>
  )
}

function Belt({ names, direction, paused }: { names: string[]; direction: 'right' | 'left'; paused: boolean }) {
  const track = useRef<HTMLUListElement>(null)
  const [loop, setLoop] = useState(0)

  // The loop length is one copy of the bags, which depends on the rendered tag widths. The
  // observer also fires once on start, which takes the first measurement.
  useEffect(() => {
    const el = track.current
    if (!el) return
    const observer = new ResizeObserver(() => setLoop(el.scrollWidth / COPIES))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = {
    '--loop': `${loop}px`,
    '--loop-duration': `${loop / BELT_SPEED}s`,
    '--slat-pitch': `${SLAT_PITCH}px`,
    '--slat-duration': `${SLAT_PITCH / BELT_SPEED}s`,
  } as CSSProperties

  return (
    <div className={`belt belt--${direction}`} data-paused={paused || undefined} style={style}>
      <span className="belt-surface" />
      <ul className="belt-track" ref={track}>
        {Array.from({ length: COPIES }, (_, copy) =>
          names.map((name, i) => (
            <Bag key={`${copy}-${name}`} name={name} copy={copy} tilt={((i * 7) % 5) - 2} />
          )),
        )}
      </ul>
    </div>
  )
}

/** Technical skills as a baggage carousel: two belts running opposite ways around the island. */
export function BaggageClaim() {
  const [paused, setPaused] = useState(false)
  const unique = [...new Set(skills.flatMap((group) => group.items))]
  const split = Math.ceil(unique.length / 2)

  return (
    <section className="claim" data-reveal="rise" id="skills" aria-labelledby="skills-title">
      <header className="claim-sign">
        <span className="coupon-num" aria-hidden="true">3</span>
        <svg className="claim-pictogram" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
          <path d="M11 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <rect x="4" y="8" width="24" height="18" rx="2.5" fill="currentColor" />
          <path d="M10 8v18M22 8v18" stroke="var(--navy)" strokeWidth="2" />
          <circle cx="9" cy="28.5" r="1.6" fill="currentColor" />
          <circle cx="23" cy="28.5" r="1.6" fill="currentColor" />
        </svg>
        <h2 className="display claim-title" id="skills-title">Technical skills</h2>
        <p className="claim-count carbon">{unique.length} tools, {skills.length} categories</p>
        <button
          type="button"
          className="claim-pause caps"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </header>

      {/* The moving belts are decorative copies; this list is what assistive technology reads. */}
      <dl className="visually-hidden">
        {skills.map((group) => (
          <div key={group.category}>
            <dt>{group.category}</dt>
            <dd>{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>

      <div className="carousel" aria-hidden="true">
        <Belt names={unique.slice(0, split)} direction="right" paused={paused} />
        <div className="carousel-island" />
        <Belt names={unique.slice(split)} direction="left" paused={paused} />
      </div>
    </section>
  )
}

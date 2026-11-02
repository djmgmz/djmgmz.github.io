import { useEffect, useState, type CSSProperties } from 'react'
import { sections, type SectionId } from '../content'
import { SectionIcon } from './icons'
import type { NavVariant } from './navVariant'


/**
 * The section being read: the last one whose top has passed a line 35% down the viewport, or the
 * last section once the page is scrolled to the bottom (a short final section never reaches the line).
 */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('top')
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current: SectionId = 'top'
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      setActive(atBottom ? sections[sections.length - 1].id : current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  return active
}

/**
 * The page's sections as drawn icons, fixed in the left margin, with the section being read lit
 * in the accent. Names show beside the icons on hover and focus (and always, in the contents
 * design). Narrow screens get the same icons as a bar along the bottom instead.
 */
export function SideNav({ variant }: { variant: NavVariant }) {
  const active = useActiveSection()
  const index = sections.findIndex((s) => s.id === active)

  const items = sections.map((section) => (
    <li key={section.id}>
      <a href={`#${section.id}`} aria-current={section.id === active ? 'location' : undefined}>
        <SectionIcon id={section.id} />
        <span className="side-nav-label">{section.label}</span>
      </a>
    </li>
  ))

  return (
    <>
      <nav className={`side-nav side-nav--${variant}`} aria-label="Page sections" style={{ '--active': index } as CSSProperties}>
        {variant !== 'contents' && <span className="side-nav-marker" aria-hidden="true" />}
        <ol>{items}</ol>
      </nav>
      <nav className="bottom-nav" aria-label="Page sections">
        <ol>{items}</ol>
      </nav>
    </>
  )
}

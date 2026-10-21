import { useEffect, useState } from 'react'
import { profile } from '../content'
import { Monogram } from './icons'

const TABS = [
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'interests', label: 'Interests' },
  { id: 'rigrag', label: 'RigRAG' },
  { id: 'fullcourt', label: 'FullCourt' },
  { id: 'contact', label: 'Contact' },
]

// How far below the nav a section's top may sit and still count as reached. A jump link parks the
// section just under the nav, so short sections like Education still win after a tab click.
const REACHED_OFFSET = 96

/** Tracks which section sits under the nav so its tab can flood red. */
function useCurrentSection(ids: string[]) {
  const [current, setCurrent] = useState<string | null>(null)
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el) => el !== null)
    const nav = document.querySelector('.nav')
    let frame = 0

    // The current section is the last one whose top has passed the line under the nav. At the
    // bottom of the page the last section can never reach that line, so it wins once its top is on screen.
    const update = () => {
      frame = 0
      const line = (nav?.getBoundingClientRect().bottom ?? 0) + REACHED_OFFSET
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      let next: string | null = null
      for (const section of sections) {
        const top = section.getBoundingClientRect().top
        if (top <= line || (atEnd && top < window.innerHeight)) next = section.id
      }
      setCurrent(next)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids])
  return current
}

const TAB_IDS = TABS.map((tab) => tab.id)

export function WalletNav() {
  const current = useCurrentSection(TAB_IDS)
  return (
    <header className="nav">
      <a className="nav-brand" href="#top" aria-label={`${profile.name}, back to top`}>
        <Monogram />
        <span className="caps">{profile.name}</span>
      </a>
      <nav aria-label="Sections">
        <ul className="nav-tabs">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <a
                className="nav-tab caps"
                href={`#${tab.id}`}
                aria-current={current === tab.id ? 'location' : undefined}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

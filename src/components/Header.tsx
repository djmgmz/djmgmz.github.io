import { useState } from 'react'
import { EMAIL, profile } from '../content'
import { MoonIcon, SunIcon } from './icons'

type Mode = 'light' | 'dark'

function currentMode(): Mode {
  return document.documentElement.dataset.mode === 'light' ? 'light' : 'dark'
}

/** Switches between the light and dark page; the choice is remembered (index.html applies it on load). */
function ModeSwitch() {
  const [mode, setMode] = useState<Mode>(currentMode)
  const next: Mode = mode === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    document.documentElement.dataset.mode = next
    try {
      localStorage.setItem('mode', next)
    } catch {
      // Storage can be blocked; the switch still works for this visit.
    }
    setMode(next)
  }

  return (
    <button type="button" className="mode-switch" onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      {mode === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

/** Avatar, name and role, the section links, the mode switch and the one action. */
export function Header() {
  return (
    <header className="top">
      <a className="who" href="#top" aria-label={`${profile.name}, back to top`}>
        <img src={profile.photo} alt="" width={48} height={48} />
        <span>
          <b>{profile.name}</b>
          <span>{profile.role}</span>
        </span>
      </a>
      <nav aria-label="Sections">
        <a href="#projects">Projects</a>
        <a href="#about">About</a>
        <a href="#interests">Interests</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="top-actions">
        <ModeSwitch />
        <a className="btn" href={`mailto:${EMAIL}`}>Email me</a>
      </div>
    </header>
  )
}

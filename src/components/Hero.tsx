import { EMAIL, profile, toolStrip } from '../content'
import { skillIcons } from './skillIcons'

/** The rounded panel with the glow rising behind the headline, then the strip of tool marks. */
export function Hero() {
  return (
    <div className="hero" id="top">
      <div className="hero-panel">
        <div className="glow" aria-hidden="true" />
        <h1 className="display hero-title" data-reveal>
          {profile.headline.map((line) => <span key={line}>{line} </span>)}
        </h1>
        <p className="hero-lede" data-reveal>{profile.lede}</p>
        <div className="hero-actions" data-reveal>
          <a className="btn btn--accent" href="#projects">Try a live demo</a>
          <a className="btn btn--quiet" href={`mailto:${EMAIL}`}>Email me</a>
        </div>
      </div>
      <p className="tools-cap">The tools behind the three projects</p>
      <ul className="tools" aria-label="Tools behind the projects">
        {toolStrip.map((name) => {
          const icon = skillIcons[name]
          return (
            <li key={name} title={name}>
              {icon && (
                <svg viewBox="0 0 24 24" width="26" height="26" role="img" aria-label={name}>
                  <path d={icon.path} fill="currentColor" />
                </svg>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

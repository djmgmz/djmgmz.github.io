import { education, skills } from '../content'
import { skillIcons } from './skillIcons'

/** Tools grouped by area, then the two steps of education. */
export function Skills() {
  return (
    <section className="band" id="skills" aria-labelledby="skills-title">
      <div className="section-head">
        <h2 className="display section-title" id="skills-title" data-reveal>Skills</h2>
        <p data-reveal>The languages, frameworks and tools I use most.</p>
      </div>
      <div className="skills">
        {skills.map((group) => (
          <div key={group.category} className="skill-group" data-reveal>
            <h3>{group.category}</h3>
            <ul>
              {group.items.map((name) => {
                const icon = skillIcons[name]
                return (
                  <li key={name}>
                    {icon && (
                      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                        <path d={icon.path} fill="currentColor" />
                      </svg>
                    )}
                    {name}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <ol className="education" aria-label="Education">
        {education.map((step) => (
          <li key={step.title} data-reveal>
            <h3 className="display">{step.title}</h3>
            <p className="education-dates">{step.dates}</p>
            <p>{step.school}. {step.note}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

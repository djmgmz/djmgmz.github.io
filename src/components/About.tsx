import { numbers, profile, projects } from '../content'

/** Big heading beside the intro, the number tiles, and a strip of the three apps. */
export function About() {
  return (
    <section className="band" id="about" aria-labelledby="about-title">
      <div className="split">
        <h2 className="display section-title" id="about-title" data-reveal>{profile.aboutTitle}</h2>
        <div className="split-text" data-reveal>
          {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <dl className="numbers" data-reveal>
        {numbers.map((n) => (
          <div key={n.label}>
            <dt className="visually-hidden">{n.label}</dt>
            <dd className="number-value">{n.value}</dd>
            <dd className="number-label" aria-hidden="true">{n.label}</dd>
          </div>
        ))}
      </dl>
      <ul className="strip">
        {Object.values(projects).map((project) => (
          <li key={project.id} data-reveal>
            <a href={`#${project.id}`}>
              <img src={project.shot} alt={`${project.name}'s interface`} width={1200} height={750} loading="lazy" />
              <span>{project.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

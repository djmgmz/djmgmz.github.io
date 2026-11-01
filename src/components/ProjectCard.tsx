import type { ReactNode } from 'react'
import { projects, type ProjectId } from '../content'
import { ExternalIcon } from './icons'

interface Props {
  id: ProjectId
  /** Index of the stage the replay is on, the stage count once a run finishes, or null when idle. */
  stage: number | null
  /** The project's demo interface. */
  children: ReactNode
}

function stageState(stage: number | null, index: number) {
  if (stage === null) return 'idle'
  return index < stage ? 'done' : index === stage ? 'active' : 'idle'
}

/**
 * One project as a large card: what it does and its pipeline, whose steps light up while the demo
 * below replays a recorded run, then the app's own interface in a window frame.
 */
export function ProjectCard({ id, stage, children }: Props) {
  const project = projects[id]
  return (
    <article className={`card${project.dark ? ' card--dark' : ''}`} id={id} aria-labelledby={`${id}-title`} data-reveal>
      <div className="card-info">
        <div>
          <h3 className="display card-title" id={`${id}-title`}>{project.name}</h3>
          <p className="card-summary"><b>What it does:</b> {project.summary}</p>
          <p className="card-stack">{project.stack.join(', ')}</p>
          <a className="btn btn--quiet" href={project.repo} target="_blank" rel="noreferrer">
            View source <ExternalIcon />
            <span className="visually-hidden"> for {project.name} on GitHub (opens in a new tab)</span>
          </a>
        </div>
        <div>
          <ol className="steps" aria-label={`${project.name} pipeline`}>
            {project.stages.map((name, index) => (
              <li key={name} data-state={stageState(stage, index)}>{name}</li>
            ))}
          </ol>
          <p className="card-recording">{project.recording}</p>
        </div>
      </div>
      <div className="window">
        <p className="window-bar"><i /><i /><i /><span>{project.name}, recorded run</span></p>
        <div className="window-body" data-ui>{children}</div>
      </div>
    </article>
  )
}

import type { ReactNode } from 'react'
import { legs, type LegId } from '../content'
import { ExternalIcon } from './icons'

interface Props {
  id: LegId
  /** Coupon number in the wallet's running sequence. */
  number: number
  /** Index of the stage the replay is on, the stage count once a run finishes, or null when idle. */
  stage: number | null
  /** True once a demo run has finished, which shows the Completed stamp. */
  validated: boolean
  /** The project's demo interface. */
  children: ReactNode
}

/**
 * One project as a full boarding pass: the stub explains the system and lights its pipeline
 * stages while the demo replays; the main body is the app's own interface.
 */
export function LegSection({ id, number, stage, validated, children }: Props) {
  const leg = legs[id]
  return (
    <section className="leg" id={id} aria-labelledby={`${id}-title`}>
      <div className="coupon pass" data-reveal="board">
        <aside className="pass-stub">
          <header className="coupon-head">
            <span className="coupon-num" aria-hidden="true">{number}</span>
            <p className="coupon-title caps"><span className="carbon">{leg.code}</span></p>
            <span className="coupon-tab caps">{leg.tab}</span>
          </header>
          <div className="pass-stub-body">
            <h3 id={`${id}-title`} className="display pass-title">{leg.name}</h3>
            <p className="pass-summary">{leg.summary}</p>
            {leg.detail.map((paragraph) => <p key={paragraph} className="pass-detail">{paragraph}</p>)}
            <p className="pass-recording">{leg.recording}</p>

            <h4 className="caps pass-label">Pipeline</h4>
            <ol className="stages" aria-label={`${leg.name} pipeline`}>
              {leg.stages.map((name, index) => (
                <li
                  key={name}
                  className="stage"
                  data-state={stage === null ? 'idle' : index < stage ? 'done' : index === stage ? 'active' : 'idle'}
                >
                  <span className="stage-num carbon">{String(index + 1).padStart(2, '0')}</span>
                  <span>{name}</span>
                </li>
              ))}
            </ol>

          </div>
          <div className="pass-foot">
            <a className="btn" href={leg.repo} target="_blank" rel="noreferrer">
              View source <ExternalIcon />
              <span className="visually-hidden"> code for {leg.name} on GitHub (opens in a new tab)</span>
            </a>
            <div className="pass-stamp" aria-live="polite">
              {/* Mounts on the first completed run, so the slam plays exactly once. */}
              {validated && <span className="stamp stamp--slam">Completed</span>}
            </div>
          </div>
        </aside>

        <div className="pass-screen">
          <p className="pass-screen-band caps">
            <span>Interactive demo, recorded responses</span>
            <span className="pass-screen-tag">Recorded</span>
          </p>
          <div className="pass-screen-frame">{children}</div>
        </div>
      </div>
    </section>
  )
}

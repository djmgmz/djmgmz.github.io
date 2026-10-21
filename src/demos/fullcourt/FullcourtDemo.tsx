import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-600.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import './fullcourt.css'
import { memo, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { isAbort, playStages } from '../replay'
import recorded from './runs.json'
import type { Meta, Method, PlayerResult, RecordedRun, SearchResponse } from './types'

const DATA = recorded as unknown as { meta: Meta; runs: RecordedRun[] }
const META = DATA.meta
const RUNS = DATA.runs
const REPO = 'https://github.com/djmgmz/FullCourt'
// Every replay lasts this long, split across stages by the recorded timings.
const REPLAY_MS = 3000
const STAGE_KEYS = ['parse', 'sql', 'vector_search', 'ranking', 'generation']

type SearchState =
  | { kind: 'idle' }
  | { kind: 'searching' }
  | { kind: 'done'; response: SearchResponse }
  | { kind: 'off-script' }

function statusText(state: SearchState): string {
  if (state.kind === 'searching') return 'Searching. Writing explanations can take up to half a minute.'
  if (state.kind === 'done') {
    const count = state.response.results.length
    return count === 0 ? 'No players matched.' : `Found ${count} player${count === 1 ? '' : 's'}.`
  }
  return ''
}

/* --- Result card (ported from ResultCard.tsx, ScoreBreakdown.tsx, StyleEvidence.tsx) --- */

function teamText(player: PlayerResult): string {
  if (!player.team) return 'team not listed'
  return player.teams && player.teams !== player.team ? `${player.team} (${player.teams.split(',').join(', ')})` : player.team
}

function ScoreBar({ score }: { score: PlayerResult['score'] }) {
  const stat = Math.max(0, score.stat_contribution)
  const style = Math.max(0, score.style_contribution)
  const description = `Score ${score.final.toFixed(2)} out of 1: ${stat.toFixed(2)} from statistics, ${style.toFixed(2)} from style match.`
  return (
    <div className="score">
      <p className="score-value">
        <span className="score-number">{score.final.toFixed(2)}</span>
        <span className="score-caption">score</span>
      </p>
      <div className="score-bar" role="img" aria-label={description} title={description}>
        <span className="score-bar-stat" style={{ width: `${stat * 100}%` }} />
        <span className="score-bar-style" style={{ width: `${style * 100}%` }} />
      </div>
      <p className="score-legend" aria-hidden="true">
        <span className="legend-stat">stats {stat.toFixed(2)}</span>
        <span className="legend-style">style {style.toFixed(2)}</span>
      </p>
    </div>
  )
}

const COMPONENT_LABELS: Record<string, string> = { statistics: 'statistics', semantic: 'style match' }

function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function formatScore(score: number | null): string {
  return score === null ? 'not available' : score.toFixed(3)
}

function ScoreBreakdown({ player }: { player: PlayerResult }) {
  const { score, goals } = player
  const used = score.components_used.map((c) => COMPONENT_LABELS[c] ?? c)
  const proxyNotes = [...new Set(goals.map((g) => g.proxy_note).filter((note): note is string => Boolean(note)))]
  return (
    <details className="disclosure">
      <summary>
        <span>Score breakdown<span className="visually-hidden"> for {player.player_name}</span></span>
      </summary>
      <p className="field-help">
        {used.length > 0 ? `This score uses ${used.join(' and ')}.` : 'Nothing in the question could be scored.'}
      </p>
      <table className="data-table">
        <thead>
          <tr><th scope="col">Part</th><th scope="col" className="numeric">Score (0 to 1)</th></tr>
        </thead>
        <tbody>
          <tr><td>Statistical fit</td><td className="numeric">{formatScore(score.stat_fit)}</td></tr>
          <tr>
            <td>Style match{score.style_missing && score.components_used.includes('semantic') && ' (no style profile, default applied)'}</td>
            <td className="numeric">{formatScore(score.style_match)}</td>
          </tr>
        </tbody>
      </table>
      {goals.length > 0 && (
        <div className="table-scroll" role="region" aria-label="What the statistical fit is made of" tabIndex={0}>
          <table className="data-table data-table-wide">
            <caption className="panel-heading">What the statistical fit is made of</caption>
            <thead>
              <tr>
                <th scope="col">Goal</th>
                <th scope="col" className="numeric">Goal score</th>
                <th scope="col">Stat</th>
                <th scope="col" className="numeric">Value</th>
                <th scope="col">Among candidates</th>
              </tr>
            </thead>
            <tbody>
              {goals.flatMap((goal) =>
                goal.metrics.length === 0
                  ? [
                      <tr key={goal.label}>
                        <th scope="row">{sentenceCase(goal.label)}</th>
                        <td className="numeric">{formatScore(goal.score)}</td>
                        <td colSpan={3} />
                      </tr>,
                    ]
                  : goal.metrics.map((metric, index) => (
                      <tr key={`${goal.label}-${metric.label}`}>
                        {index === 0 && (
                          <>
                            <th scope="row" rowSpan={goal.metrics.length}>{sentenceCase(goal.label)}</th>
                            <td className="numeric" rowSpan={goal.metrics.length}>{formatScore(goal.score)}</td>
                          </>
                        )}
                        <td>{metric.label}</td>
                        <td className="numeric">{metric.value}</td>
                        <td>{metric.pool_rank}</td>
                      </tr>
                    )),
              )}
            </tbody>
          </table>
        </div>
      )}
      {proxyNotes.map((note) => <p key={note} className="field-help">Stand-in stat: {note}</p>)}
      <p className="field-help">
        Statistics from {player.stats_source.name}:{' '}
        {player.stats_source.tables.map((table, index) => (
          <span key={table.url}>
            {index > 0 && ', '}
            <a href={table.url} target="_blank" rel="noreferrer">{table.label}</a>
          </span>
        ))}
        .
      </p>
    </details>
  )
}

// Profiles are written as labelled sentences; one per line is easier to scan than a paragraph.
function sentences(text: string): string[] {
  return text.split(/(?<=\.)\s+(?=[A-Z])/)
}

function StyleEvidence({ player, method }: { player: PlayerResult; method: Method }) {
  const { passages, score } = player
  const count = passages.length === 1 ? '1 profile' : `${passages.length} profiles`
  const styleMatch = score.style_match === null ? null : score.style_match.toFixed(2)
  return (
    <details className="disclosure">
      <summary>
        <span>Style evidence<span className="visually-hidden"> for {player.player_name}</span> ({count})</span>
      </summary>
      {method === 'stats' && <p className="field-help">The statistics-only method doesn't use style profiles.</p>}
      {method !== 'stats' && passages.length === 0 && <p className="field-help">There's no style profile for this player.</p>}
      {passages.map((passage) => (
        <figure key={passage.document_id} className="passage">
          <blockquote>
            {sentences(passage.text).map((sentence, index) => <p key={index}>{sentence}</p>)}
          </blockquote>
          <figcaption className="field-help">
            {passage.is_stat_profile ? (
              <>Written from {player.season} Basketball-Reference numbers by a fixed template, not scouting text.</>
            ) : (
              <>
                From <a href={passage.source_url} target="_blank" rel="noreferrer">{passage.source_name}</a>
                {passage.source_section && `, ${passage.source_section}`}.
              </>
            )}
            {styleMatch && <> Style match {styleMatch} on a scale from 0 to 1 across these candidates.</>}
          </figcaption>
        </figure>
      ))}
    </details>
  )
}

const ResultCard = memo(function ResultCard({ player, method }: { player: PlayerResult; method: Method }) {
  const explanation = player.explanation
  return (
    <article className="result" aria-labelledby={`fc-player-${player.player_id}`}>
      <header className="result-header">
        <p className="result-rank" aria-hidden="true">{player.rank}</p>
        <div className="result-identity">
          <h5 id={`fc-player-${player.player_id}`} className="result-name">
            <span className="visually-hidden">Rank {player.rank}: </span>
            {player.player_name}
          </h5>
          <p className="result-meta">
            {player.position ?? 'Position not listed'} for {teamText(player)}, {player.season}, {player.games} games
          </p>
        </div>
        <ScoreBar score={player.score} />
      </header>
      <dl className="stat-tiles">
        {player.key_stats.map((stat) => (
          <div key={stat.metric} className="stat-tile">
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
      {explanation && (
        <div className="explanation">
          <h6 className="explanation-label">
            {explanation.source === 'llm' ? 'Explanation, checked against the evidence' : 'Explanation from the template'}
          </h6>
          <p>{explanation.text}</p>
          {explanation.grounding_issues.length > 0 && (
            <p className="field-help">The generated explanation was replaced because it {explanation.grounding_issues.join('; ')}.</p>
          )}
        </div>
      )}
      <ScoreBreakdown player={player} />
      <StyleEvidence player={player} method={method} />
    </article>
  )
})

/* --- Search overview (ported from SearchOverview.tsx) --- */

const STAGE_LABELS: Record<string, string> = {
  parse: 'Reading the question',
  sql: 'Statistics lookup',
  vector_search: 'Style search',
  ranking: 'Ranking',
  generation: 'Explanations',
}

function SearchOverview({ response }: { response: SearchResponse }) {
  const { summary } = response
  const notices = [...response.messages, ...response.warnings]
  return (
    <section className="overview" aria-label="How this search ran">
      <dl className="summary">
        <div><dt>Method</dt><dd>{summary.method_label}</dd></div>
        <div><dt>Season</dt><dd>{summary.season}{summary.season_was_defaulted && ' (default)'}</dd></div>
        <div><dt>Question read by</dt><dd>{summary.parser === 'llm' ? 'LLM' : 'Keyword rules'}</dd></div>
        <div><dt>Candidates after filters</dt><dd>{summary.candidate_count}</dd></div>
      </dl>
      {notices.length > 0 && (
        <ul className="notices" aria-label="Notes about this search">
          {notices.map((notice) => <li key={notice} className="notice">{notice}</li>)}
        </ul>
      )}
      {response.unsupported.length > 0 && (
        <ul className="notices" aria-label="Parts of the question this data can't answer">
          {response.unsupported.map((item) => <li key={item} className="notice notice-warning">Not covered by this data: {item}</li>)}
        </ul>
      )}
      <details className="disclosure">
        <summary>Search plan and timings</summary>
        <div className="plan-grid">
          <div>
            <h6 className="panel-heading">Search plan</h6>
            <pre className="plan-json">{JSON.stringify(response.plan, null, 2)}</pre>
          </div>
          <div>
            <h6 className="panel-heading">Time per stage</h6>
            <table className="data-table">
              <thead>
                <tr><th scope="col">Stage</th><th scope="col" className="numeric">Milliseconds</th></tr>
              </thead>
              <tbody>
                {Object.entries(response.timings_ms).map(([stage, ms]) => (
                  <tr key={stage}>
                    <td>{STAGE_LABELS[stage] ?? stage}</td>
                    <td className="numeric">{Math.round(ms).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {summary.eligibility_applied && (
              <p className="field-help">
                Only rotation players were considered: at least {META.defaults.min_games} games and {META.defaults.min_minutes} minutes per game.
              </p>
            )}
          </div>
        </div>
      </details>
    </section>
  )
}

/* --- Sidebar (ported from Sidebar.tsx; fixed to the defaults the runs used) --- */

function Sidebar() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const defaults = META.defaults
  return (
    <aside className="sidebar" aria-label="Search settings">
      <button type="button" className="sidebar-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        Search settings
      </button>
      <div id={panelId} className="sidebar-panel" data-open={open}>
        <h5 className="sidebar-heading">Search settings</h5>
        <p className="sidebar-replay">
          These runs were recorded with the default settings, so the controls are locked in this replay.
        </p>
        <fieldset className="field" disabled>
          <legend className="field-label">Retrieval method</legend>
          {META.methods.map((method) => (
            <label key={method.value} className="radio">
              <input type="radio" name="fc-method" value={method.value} defaultChecked={method.value === 'hybrid'} />
              <span>{method.label}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="field" disabled>
          <label className="field-label" htmlFor="fc-season">Season</label>
          <select id="fc-season" defaultValue={META.default_season}>
            {META.seasons.map((season) => <option key={season} value={season}>{season}</option>)}
          </select>
          <p className="field-help">Used when the question doesn't name a season.</p>
        </fieldset>
        <fieldset className="field" disabled>
          <label className="checkbox">
            <input type="checkbox" defaultChecked />
            <span>Only rotation players (at least {defaults.min_games} games and {defaults.min_minutes} minutes per game)</span>
          </label>
        </fieldset>
        <fieldset className="field" disabled>
          <label className="field-label" htmlFor="fc-weight">
            Statistics weight <output htmlFor="fc-weight">{defaults.stat_weight.toFixed(2)}</output>
          </label>
          <input id="fc-weight" type="range" min={0} max={1} step={0.05} defaultValue={defaults.stat_weight} />
          <p className="field-help">The rest ({(1 - defaults.stat_weight).toFixed(2)}) goes to style match.</p>
        </fieldset>
        <div className="sidebar-status">
          <p>{META.llm.status}</p>
          <p>{META.index_size} style profiles indexed.</p>
        </div>
      </div>
    </aside>
  )
}

/* --- App --- */

interface Props {
  /** Reports replay progress in the shape `playStages` emits. */
  onStage: (index: number | null) => void
  /** Called each time a replay finishes. */
  onComplete: () => void
}

/**
 * FullCourt's search interface replaying recorded /api/search responses. The example questions
 * map to recorded runs; any other question gets an off-script note instead of invented results.
 */
export default function FullcourtDemo({ onStage, onComplete }: Props) {
  const [question, setQuestion] = useState('')
  const [state, setState] = useState<SearchState>({ kind: 'idle' })
  const [error, setError] = useState<string | null>(null)
  // Open until the first answer lands, then folded away like the real app so the results lead.
  const [examplesOpen, setExamplesOpen] = useState(true)
  const inFlight = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)
  const callbacks = useRef({ onStage, onComplete })
  useLayoutEffect(() => {
    callbacks.current = { onStage, onComplete }
  })
  const searching = state.kind === 'searching'

  async function runSearch(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    inFlight.current?.abort()
    const run = RUNS.find((r) => r.question.toLowerCase() === trimmed.toLowerCase())
    if (!run) {
      callbacks.current.onStage(null)
      setState({ kind: 'off-script' })
      return
    }
    const controller = new AbortController()
    inFlight.current = controller
    setState({ kind: 'searching' })
    try {
      const weights = STAGE_KEYS.map((key) => run.timings_ms[key] ?? 0)
      await playStages(weights, REPLAY_MS, callbacks.current.onStage, controller.signal)
      setExamplesOpen(false)
      setState({ kind: 'done', response: run })
      callbacks.current.onComplete()
    } catch (err) {
      if (!isAbort(err)) throw err
    }
  }

  // Bring the result count and the first ranked player into view inside the frame.
  useEffect(() => {
    if (state.kind !== 'done') return
    const main = mainRef.current
    const status = statusRef.current
    if (main && status) main.scrollTo({ top: status.offsetTop - 24 })
  }, [state])

  useEffect(() => () => inFlight.current?.abort(), [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (searching) return
    if (!question.trim()) {
      setError('Type a question first, or pick one of the examples.')
      inputRef.current?.focus()
      return
    }
    setError(null)
    runSearch(question)
  }

  return (
    <div className="fc">
      <div className="layout">
        <Sidebar />
        <div className="main" ref={mainRef}>
          <header className="masthead">
            <h4 className="title">FullCourt</h4>
            <p className="lede">
              Ask about NBA players' statistics and playing style. Every number comes from the loaded season's data, and
              every style claim links to the profile it came from.
            </p>
          </header>

          <section className="question" aria-label="Ask a question">
            <form onSubmit={submit} className="question-form" noValidate>
              <label htmlFor="fc-question" className="question-label">Question</label>
              <div className="question-row">
                <input
                  ref={inputRef}
                  id="fc-question"
                  type="text"
                  value={question}
                  maxLength={500}
                  autoComplete="off"
                  placeholder="Which guards attack the rim and get to the line?"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'fc-question-error' : undefined}
                  onChange={(event) => {
                    if (error) setError(null)
                    setQuestion(event.target.value)
                  }}
                />
                <button type="submit" className="button-primary" aria-disabled={searching}>
                  {searching ? 'Searching…' : 'Search'}
                </button>
              </div>
              {error && <p id="fc-question-error" className="field-error" role="alert">{error}</p>}
            </form>
            <details
              className="disclosure examples"
              open={examplesOpen}
              onToggle={(event) => setExamplesOpen(event.currentTarget.open)}
            >
              <summary>Example questions</summary>
              <ul className="example-list">
                {RUNS.map((run) => (
                  <li key={run.question}>
                    <button
                      type="button"
                      className="example"
                      aria-disabled={searching}
                      onClick={() => {
                        if (searching) return
                        setError(null)
                        setQuestion(run.question)
                        runSearch(run.question)
                      }}
                    >
                      {run.question}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </section>

          <p className="status" role="status" aria-live="polite" ref={statusRef}>{statusText(state)}</p>

          {state.kind === 'off-script' && (
            <p className="notice" role="alert">
              This copy of FullCourt replays recorded searches, so it can only answer the example questions above. To ask
              your own, run the app from the <a href={REPO} target="_blank" rel="noreferrer">FullCourt repository</a>.
            </p>
          )}

          {state.kind === 'idle' && (
            <p className="empty">Describe the kind of player you're looking for, or pick one of the example questions.</p>
          )}

          {state.kind === 'done' && (
            <>
              <SearchOverview response={state.response} />
              <section aria-label="Ranked players">
                <ol className="results">
                  {state.response.results.map((player) => (
                    <li key={player.player_id}>
                      <ResultCard player={player} method={state.response.summary.method} />
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          <footer className="footer">
            <p>
              Statistics come from Basketball-Reference. Style profiles are written from the same season's statistics by a
              fixed template; they are not scouting reports.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

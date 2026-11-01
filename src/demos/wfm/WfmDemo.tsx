import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isAbort, playStages } from '../replay'
import { ColumnChart, LineChart, type Series } from './charts'
import { formatCredits, formatDateTime, formatDay, formatNumber, formatPercent, formatPlat, timeAgo, titleCase } from './format'
import data from './runs.json'
import type { Item, ItemSummary, Recording, Run } from './types'
import './wfm.css'

const recording = data as Recording
const STAGE_COUNT = 5
const REPLAY_MS = 3200
const DAY_MS = 86_400_000
const RECORDED_AT = Date.parse(recording.recordedAt)
const RUNS = new Map(recording.runs.map((run) => [run.item.slug, run]))

type View = 'overview' | 'items' | 'ducats' | 'forecast' | 'watchlist'

/** Only the recorded items can open; every other name is plain text, as in a static snapshot. */
type Open = (slug: string) => void

function imageUrl(image: string | null) {
  return image ? `/demos/wfm/${encodeURIComponent(image)}` : null
}

/** Item image with the app's lettered fallback. */
function Thumb({ image, name, size }: { image: string | null; name: string; size: number }) {
  const [failed, setFailed] = useState(false)
  const src = imageUrl(image)
  return src && !failed ? (
    <img className="thumb" src={src} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <span className="thumb thumb--fallback" style={{ width: size, height: size }}>{name.charAt(0)}</span>
  )
}

/** An item's thumb and name, opening its page when the item was recorded. */
function ItemName({ item, rank, open, size = 22 }: { item: ItemSummary; rank?: number | null; open: Open; size?: number }) {
  const body = (
    <>
      <Thumb image={item.image} name={item.name} size={size} />
      {item.name}
    </>
  )
  return (
    <span className="item-cell">
      {RUNS.has(item.slug) ? <button type="button" className="item-link" onClick={() => open(item.slug)}>{body}</button> : body}
      {rank !== null && rank !== undefined && <span className="muted"> · rank {rank}</span>}
    </span>
  )
}

const ICONS = {
  overview: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  items: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  ducats: 'M12 3l9 9-9 9-9-9zM12 8.5l3.5 3.5-3.5 3.5-3.5-3.5z',
  forecast: 'M3 17l6-6 4 4 8-8',
  watchlist: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  back: 'M19 12H5M11 18l-6-6 6-6',
}

function Icon({ name, filled = false }: { name: keyof typeof ICONS; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="tile">
      <div className="fact-label">{label}</div>
      <div className="tile-value">{value}</div>
      {note && <p>{note}</p>}
    </div>
  )
}

function Delta({ value }: { value: number }) {
  return <td className={`r ${value > 0 ? 'up' : value < 0 ? 'down' : ''}`}>{formatPercent(value)}</td>
}

function PageHeader({ title, sub, children }: { title: string; sub: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h3 className="wf-title">{title}</h3>
        <p className="panel-sub">{sub}</p>
      </div>
      {children}
    </header>
  )
}

/** The price series exactly as the app builds them: trades, listings, then forecasts continuing the trade line. */
function priceSeries(run: Run): Series[] {
  const series: Series[] = []
  if (run.history.closed.length) {
    series.push({
      key: 'closed', label: 'Median trade', color: 'var(--series-1)',
      points: run.history.closed.map((p) => ({ t: Date.parse(p.bucket), v: p.median })),
    })
  }
  if (run.history.sell.some((p) => p.ask !== null)) {
    series.push({
      key: 'listed', label: 'Sell listings', color: 'var(--series-2)',
      points: run.history.sell.map((p) => ({ t: Date.parse(p.bucket), v: p.ask })),
    })
  }
  if (run.forecast.length) {
    // Tomorrow is a point on day 1; a longer horizon is an average over days 1..h, drawn flat.
    const t0 = Date.parse(run.forecast[0].base_date)
    const at = (days: number) => t0 + days * DAY_MS
    for (const f of run.forecast) {
      const flat = f.horizon > 1
      const from = flat ? { t: at(1), v: f.predicted, low: f.low, high: f.high } : { t: t0, v: f.base_price, low: f.base_price, high: f.base_price }
      const to = { t: at(f.horizon), v: f.predicted, low: f.low, high: f.high }
      series.push({
        key: `forecast-${f.horizon}`, label: flat ? `Next ${f.horizon} days (avg)` : 'Tomorrow', color: 'var(--series-1)', dashed: true,
        points: [from, to].map(({ t, v }) => ({ t, v })),
        range: [from, to].map(({ t, low, high }) => ({ t, low, high })),
      })
    }
  }
  return series
}

/** The latest sell listing, standing in for the app's live order snapshot. */
function lowestListing(run: Run): number | null {
  return [...run.history.sell].reverse().find((p) => p.ask !== null)?.ask ?? null
}

function facts(item: Item) {
  const list = [
    { label: 'Latest median price', value: formatPlat(item.price) },
    { label: 'Ducats', value: formatNumber(item.ducats) },
    { label: 'Trading tax', value: formatCredits(item.trading_tax) },
    { label: 'Mastery rank', value: formatNumber(item.req_mastery_rank) },
    { label: 'Max rank', value: formatNumber(item.max_rank) },
    { label: 'Orders recorded', value: formatNumber(item.recordedOrders) },
  ]
  if (item.bulk_tradable !== null) list.push({ label: 'Bulk tradable', value: item.bulk_tradable ? 'Yes' : 'No' })
  list.push({ label: 'Details synced', value: formatDateTime(item.detail_synced_at) })
  return list
}

function OverviewPage({ open, go }: { open: Open; go: (view: View) => void }) {
  const o = recording.overview
  const top = recording.movers[0]
  const ago = (value: string | null) => timeAgo(value, RECORDED_AT)
  return (
    <div className="page">
      <PageHeader
        title="Market overview"
        sub={top ? `Biggest rise this week: ${top.item.name}${top.rank !== null ? ` (rank ${top.rank})` : ''}, ${formatPercent(top.change)} to ${formatPlat(top.to)}.` : 'Catalog and recording status for warframe.market (PC, crossplay).'}
      />
      <section className="panel tiles tiles--6" aria-label="Key figures">
        <Tile label="Tradable items" value={formatNumber(o.items)} note={`List synced ${ago(o.listSyncedAt)}`} />
        <Tile label="Item details synced" value={formatNumber(o.detailsSynced)} note={o.detailsSynced === o.items ? 'Complete' : undefined} />
        <Tile label="Prime parts with ducats" value={formatNumber(o.primeParts)} />
        <Tile label="Vaulted relics" value={formatNumber(o.relicsVaulted)} note={`of ${formatNumber(o.relicsTotal)} relics`} />
        <Tile label="Orders recorded" value={formatNumber(o.ordersTotal)} note={`${formatNumber(o.orders24h)} in the last 24h`} />
        <Tile label="Items with price history" value={formatNumber(o.itemsWithHistory)} note={`Backfilled ${ago(o.statsBackfilledAt)}`} />
      </section>
      <div className="charts charts--even">
        <section className="panel">
          <h4>Biggest movers</h4>
          <p className="panel-sub">Latest daily median trade price vs 7 days earlier.</p>
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Item</th><th className="r">Was</th><th className="r">Now</th><th className="r">Change</th></tr></thead>
              <tbody>
                {recording.movers.map((m) => (
                  <tr key={`${m.item.slug}-${m.rank}`}>
                    <td><ItemName item={m.item} rank={m.rank} open={open} /></td>
                    <td className="r">{formatPlat(m.from)}</td>
                    <td className="r">{formatPlat(m.to)}</td>
                    <Delta value={m.change} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h4>Predicted movers</h4>
            <button type="button" className="link" onClick={() => go('forecast')}>How reliable?</button>
          </div>
          <p className="panel-sub">Largest expected changes in the average price over the next 7 days (model forecasts only).</p>
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Item</th><th className="r">Next 7 days (avg)</th><th className="r">Change</th></tr></thead>
              <tbody>
                {recording.predicted.map((m) => (
                  <tr key={`${m.item.slug}-${m.rank}`}>
                    <td><ItemName item={m.item} rank={m.rank} open={open} /></td>
                    <td className="r">{formatPlat(m.predicted)}<span className="sub">likely {formatPlat(m.low)}–{formatPlat(m.high)}</span></td>
                    <Delta value={m.change} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function ItemsPage({ loading, onPick }: { loading: Run | null; onPick: (run: Run) => void }) {
  return (
    <div className="page">
      <PageHeader title="Items" sub="Pick an item to load its 90-day history, the trades left out as fakes, and its forecast." />
      <section className="panel">
        <ul className="item-list">
          {recording.runs.map((run) => {
            const week = run.forecast.find((f) => f.horizon === 7)
            const busy = loading?.item.slug === run.item.slug
            return (
              <li key={run.item.slug}>
                <button type="button" className="item-row" onClick={() => onPick(run)} aria-busy={busy || undefined} disabled={!!loading}>
                  <Thumb image={run.item.image} name={run.item.name} size={40} />
                  <span className="item-row-name"><b>{run.item.name}</b><span className="muted">{run.item.category}</span></span>
                  <span className="item-row-num"><span className="muted">Latest</span>{formatPlat(run.item.price)}</span>
                  <span className="item-row-num"><span className="muted">Next 7 days</span>{week ? formatPlat(week.predicted) : '–'}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="status" role="status">{loading ? `Loading ${loading.item.name}…` : ''}</p>
      </section>
    </div>
  )
}

function ItemPage({ run, watching, onWatch, onBack, go, open }: {
  run: Run
  watching: boolean
  onWatch: () => void
  onBack: () => void
  go: (view: View) => void
  open: Open
}) {
  const { item, history } = run
  const series = useMemo(() => priceSeries(run), [run])
  const volume = useMemo(() => history.closed.map((p) => ({ t: Date.parse(p.bucket), v: p.volume })), [history])
  const week = run.forecast.find((f) => f.horizon === 7)
  const tags = item.tags.filter((tag) => tag.toLowerCase() !== item.category.toLowerCase())
  // 99,999, not 100K: the oddness is the point.
  const exact = (n: number | null) => (n ?? 0).toLocaleString('en-US')
  const excluded = history.excluded

  return (
    <div className="page">
      <button type="button" className="back" onClick={onBack}><Icon name="back" />All items</button>
      <header className="item-hero">
        <Thumb image={item.image} name={item.name} size={72} />
        <div className="item-hero-text">
          <h3 className="wf-title">{item.name}</h3>
          <div className="chips">
            <span className="chip">{item.category}</span>
            {item.vaulted && <span className="chip">Vaulted</span>}
            {tags.map((tag) => <span key={tag} className="chip">{titleCase(tag)}</span>)}
          </div>
          {item.description && <p className="description">{item.description}</p>}
        </div>
        <button type="button" className={`wf-btn${watching ? '' : ' wf-btn--primary'}`} onClick={onWatch} aria-pressed={watching}>
          <Icon name="watchlist" filled={watching} />{watching ? 'Watching' : 'Add to watchlist'}
        </button>
      </header>

      <section className="panel facts" aria-label="Item facts">
        {facts(item).map((fact) => (
          <div key={fact.label}><div className="fact-label">{fact.label}</div><div className="fact-value">{fact.value}</div></div>
        ))}
      </section>

      <div className="charts">
        <section className="panel">
          <h4>Price</h4>
          <p className="panel-sub">Median completed trade vs what sellers ask, in platinum{week ? ', with the forecast (dashed)' : ''}.</p>
          <LineChart series={series} label={`${item.name} price history`} />
          {excluded.length > 0 && (
            <p className="note">
              Left out {excluded.length === 1 ? 'one entry' : `${excluded.length} entries`} that look like faked trades:{' '}
              {excluded.slice(0, 3).map((p) => `${formatDay(Date.parse(p.bucket))} (${exact(p.volume)} at ${exact(p.median)}p)`).join(', ')}
              {excluded.length > 3 ? ` and ${excluded.length - 3} more` : ''}. They stay in the data but don't count toward prices or volume.
            </p>
          )}
          {week && (
            <p className="forecast-line">
              <span className="forecast-key" aria-hidden="true" />
              <span>Next 7 days: about <strong>{formatPlat(week.predicted)}</strong> on average, likely {formatPlat(week.low)}–{formatPlat(week.high)}</span>
              <span className="muted">
                {week.method === 'baseline'
                  ? <>· Baseline forecast: the model isn't reliable for items like this yet (<button type="button" className="link" onClick={() => go('forecast')}>why</button>).</>
                  : <>· Model forecast (<button type="button" className="link" onClick={() => go('forecast')}>how it was tested</button>).</>}
              </span>
            </p>
          )}
        </section>
        <section className="panel">
          <h4>Trade volume</h4>
          <p className="panel-sub">Completed trades per day.</p>
          <ColumnChart points={volume} label={`${item.name} trade volume`} />
        </section>
      </div>

      {item.setItems.length > 0 && (
        <section className="panel">
          <h4>Set contents</h4>
          <p className="panel-sub">Every part of this set, with ducat values.</p>
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Part</th><th className="r">Qty in set</th><th className="r">Ducats</th><th className="r">Latest price</th></tr></thead>
              <tbody>
                {item.setItems.map((part) => (
                  <tr key={part.slug}>
                    <td><ItemName item={part} open={open} size={24} /></td>
                    <td className="r">{formatNumber(part.quantity_in_set)}</td>
                    <td className="r">{formatNumber(part.ducats)}</td>
                    <td className="r">{formatPlat(part.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function DucatsPage({ open }: { open: Open }) {
  const [filter, setFilter] = useState('')
  const rows = recording.ducats
  const best = rows[0]
  const top = rows.slice(0, 12)
  const max = Math.max(...top.map((r) => r.ducats_per_plat ?? 0), 1)
  const shown = rows.filter((r) => r.name.toLowerCase().includes(filter.trim().toLowerCase()))
  return (
    <div className="page">
      <PageHeader title="Ducats" sub="Prime parts ranked by ducats per platinum. High ratios are worth more to Baro Ki'Teer than to players." />
      <section className="panel tiles tiles--3">
        <Tile label="Prime parts" value={formatNumber(recording.overview.primeParts)} />
        <Tile label="Parts in this recording" value={formatNumber(rows.length)} note="The top of the ranking" />
        <Tile label="Best ducats per platinum" value={best?.ducats_per_plat ? `${best.ducats_per_plat} : 1` : '–'} note={best?.name} />
      </section>
      <section className="panel">
        <h4>Best value for ducats</h4>
        <p className="panel-sub">Top 12 parts by ducats per platinum.</p>
        <ol className="bars" aria-label="Ducats per platinum">
          {top.map((row) => (
            <li key={row.slug}>
              <span className="bar-name">{row.name}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: `${((row.ducats_per_plat ?? 0) / max) * 100}%` }} /></span>
              <span className="bar-value">{row.ducats_per_plat}</span>
            </li>
          ))}
        </ol>
      </section>
      <input className="wf-input" type="search" placeholder="Filter parts" aria-label="Filter parts" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <section className="panel">
        <div className="table-scroll">
          <table className="data">
            <thead><tr><th>Part</th><th className="r">Ducats</th><th className="r">Latest price</th><th className="r">Ducats / plat</th></tr></thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.slug}>
                  <td><ItemName item={row} open={open} size={24} />{row.vaulted && <span className="chip chip--inline">Vaulted</span>}</td>
                  <td className="r">{formatNumber(row.ducats)}</td>
                  <td className="r">{formatPlat(row.price)}</td>
                  <td className="r">{row.ducats_per_plat ?? '–'}</td>
                </tr>
              ))}
              {!shown.length && <tr><td colSpan={4} className="muted">No recorded part matches “{filter}”.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function ForecastPage({ open }: { open: Open }) {
  const { report, gainers } = recording
  const week = report.horizons['7']
  const o = week.overall
  return (
    <div className="page">
      <PageHeader title="Forecast" sub="Each item's average price over the next 7 days, with a likely range, tested against simply assuming no change." />
      <section className="panel verdict">
        <h4>
          <svg className="tick-mark" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          The 7-day forecast beats "no change" by {formatPercent(o.skill)}
        </h4>
        <p>Its errors are smaller than assuming prices stay where they are. It is still only used for the segments where it wins.</p>
        <p className="muted">
          Trained on {formatNumber(report.series)} price series (latest day {report.last_date}). Tested on the {report.test_days} days after {report.cutoff}:{' '}
          {formatNumber(week.train_rows)} training rows, {formatNumber(week.test_rows)} test rows.
        </p>
      </section>
      <section className="panel tiles" aria-label="Test results">
        <Tile label="Skill vs no change" value={formatPercent(o.skill)} note="Above 0% means smaller errors than assuming no change" />
        <Tile label="Direction right" value={formatPercent(o.direction, false)} note="Of test days where the price moved" />
        <Tile label="Range coverage" value={formatPercent(o.coverage, false)} note="How often the real price fell inside the range (target 80%)" />
        <Tile label="Typical error" value={formatPlat(o.model_mae_plat)} note={`No change: ${formatPlat(o.naive_mae_plat)}`} />
      </section>
      <section className="panel">
        <h4>Expected to rise</h4>
        <p className="panel-sub">The largest predicted rises for the next 7 days (average price), by platinum gained per item bought now.</p>
        <div className="table-scroll">
          <table className="data">
            <thead><tr><th>Item</th><th className="r">Now</th><th className="r">Next 7 days (avg)</th><th className="r">Likely range</th><th className="r">Change</th></tr></thead>
            <tbody>
              {gainers.map((m) => (
                <tr key={`${m.item.slug}-${m.rank}`}>
                  <td><ItemName item={m.item} rank={m.rank} open={open} size={24} /></td>
                  <td className="r">{formatPlat(m.base_price)}</td>
                  <td className="r">{formatPlat(m.predicted)}</td>
                  <td className="r muted">{formatPlat(m.low)}–{formatPlat(m.high)}</td>
                  <Delta value={m.change} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function WatchlistPage({ watched, setTarget, remove, open, go }: {
  watched: Map<string, number | null>
  setTarget: (slug: string, target: number | null) => void
  remove: (slug: string) => void
  open: Open
  go: (view: View) => void
}) {
  const rows = [...watched.entries()].map(([slug, target]) => ({ run: RUNS.get(slug)!, target }))
  return (
    <div className="page">
      <PageHeader title="Watchlist" sub="Set a target price; items at or below it are flagged. Kept for this visit only in the demo." />
      <section className="panel">
        {rows.length ? (
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>Item</th><th className="r">Latest median</th><th className="r">Lowest listing</th><th className="r">Target</th><th>Status</th><th /></tr></thead>
              <tbody>
                {rows.map(({ run, target }) => {
                  const ask = lowestListing(run)
                  const status = ask === null ? 'none' : target === null ? 'no-target' : ask <= target ? 'hit' : 'above'
                  return (
                    <tr key={run.item.slug}>
                      <td><ItemName item={run.item} open={open} size={24} /></td>
                      <td className="r">{formatPlat(run.item.price)}</td>
                      <td className="r">{formatPlat(ask)}</td>
                      <td className="r">
                        <input className="wf-input wf-input--target" type="number" min={1} placeholder="–" aria-label={`Target price for ${run.item.name}`}
                          value={target ?? ''} onChange={(e) => setTarget(run.item.slug, e.target.value ? Math.max(1, Number(e.target.value)) : null)} />
                      </td>
                      <td>
                        {status === 'hit' && <span className="up">At or below target</span>}
                        {status === 'above' && <span>Above target</span>}
                        {status === 'no-target' && <span className="muted">No target set</span>}
                        {status === 'none' && <span className="muted">No price yet</span>}
                      </td>
                      <td className="r"><button type="button" className="wf-btn wf-btn--small" onClick={() => remove(run.item.slug)}>Remove</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <p><b>Nothing on your watchlist yet</b></p>
            <p className="muted">Open an item and choose Add to watchlist to follow its price here.</p>
            <button type="button" className="wf-btn wf-btn--primary" onClick={() => go('items')}>Browse items</button>
          </div>
        )}
      </section>
    </div>
  )
}

interface Props {
  /** Reports replay progress in the shape `playStages` emits. */
  onStage: (index: number | null) => void
  /** Called once a replay finishes. */
  onComplete: () => void
}

/**
 * WF Market Analyst's own dashboard, replaying recorded API responses: pick an item and its
 * history, faked-trade check and forecast load stage by stage, then render as the app shows them.
 * The other tabs show the recorded overview, ducat ranking and forecast report.
 */
export default function WfmDemo({ onStage, onComplete }: Props) {
  const [view, setView] = useState<View>('items')
  const [loading, setLoading] = useState<Run | null>(null)
  const [selected, setSelected] = useState<Run | null>(null)
  const [watched, setWatched] = useState<Map<string, number | null>>(() => new Map())
  const inFlight = useRef<AbortController | null>(null)
  const main = useRef<HTMLDivElement>(null)

  // The parent passes fresh callbacks each render; the replay reads the latest ones.
  const callbacks = useRef({ onStage, onComplete })
  useEffect(() => {
    callbacks.current = { onStage, onComplete }
  })
  useEffect(() => () => inFlight.current?.abort(), [])

  const pick = async (run: Run) => {
    inFlight.current?.abort()
    const controller = new AbortController()
    inFlight.current = controller
    setView('items')
    setSelected(null)
    setLoading(run)
    main.current?.scrollTo({ top: 0 })
    try {
      await playStages(Array(STAGE_COUNT).fill(1), REPLAY_MS, callbacks.current.onStage, controller.signal)
      setSelected(run)
      setLoading(null)
      callbacks.current.onComplete()
    } catch (error) {
      if (!isAbort(error)) throw error
    }
  }

  const open: Open = (slug) => {
    const run = RUNS.get(slug)
    if (run) void pick(run)
  }

  const go = (next: View) => {
    inFlight.current?.abort()
    setLoading(null)
    setSelected(null)
    setView(next)
    main.current?.scrollTo({ top: 0 })
  }

  const toggleWatch = (slug: string) =>
    setWatched((current) => {
      const next = new Map(current)
      if (next.has(slug)) next.delete(slug)
      else next.set(slug, null)
      return next
    })

  const tabs: { view: View; label: string }[] = [
    { view: 'overview', label: 'Overview' },
    { view: 'items', label: 'Items' },
    { view: 'ducats', label: 'Ducats' },
    { view: 'forecast', label: 'Forecast' },
    { view: 'watchlist', label: 'Watchlist' },
  ]

  return (
    <div className="wf">
      <div className="wf-shell">
      <aside className="wf-rail">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d={ICONS.ducats} /></svg>
          </span>
          <span><b>WF Market Analyst</b><small>warframe.market insights</small></span>
        </div>
        <nav aria-label="WF Market Analyst">
          {tabs.map((tab) => (
            <button key={tab.view} type="button" aria-current={view === tab.view ? 'page' : undefined} onClick={() => go(tab.view)}>
              <Icon name={tab.view} />{tab.label}
              {tab.view === 'watchlist' && watched.size > 0 && <span className="count">{watched.size}</span>}
            </button>
          ))}
        </nav>
        <p className="rail-note">
          Data from the warframe.market public API, recorded {formatDay(RECORDED_AT)}. Item images from WFCD. Not affiliated with
          warframe.market or Digital Extremes.
        </p>
      </aside>

      <div className="wf-main" ref={main}>
        {view === 'overview' && <OverviewPage open={open} go={go} />}
        {view === 'items' && (selected ? (
          <ItemPage run={selected} watching={watched.has(selected.item.slug)} onWatch={() => toggleWatch(selected.item.slug)}
            onBack={() => go('items')} go={go} open={open} />
        ) : (
          <ItemsPage loading={loading} onPick={pick} />
        ))}
        {view === 'ducats' && <DucatsPage open={open} />}
        {view === 'forecast' && <ForecastPage open={open} />}
        {view === 'watchlist' && (
          <WatchlistPage watched={watched} open={open} go={go} remove={toggleWatch}
            setTarget={(slug, target) => setWatched((current) => new Map(current).set(slug, target))} />
        )}
      </div>
      </div>
    </div>
  )
}

// Ported from WF Market Analyst's shared/charts (scale.ts, line-chart and column-chart components):
// hand-built SVG charts with a crosshair tooltip and keyboard stepping.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { formatDay, formatNumber, formatPlat } from './format'

export interface Point {
  t: number
  v: number | null
}

export interface RangePoint {
  t: number
  low: number
  high: number
}

export interface Series {
  key: string
  label: string
  /** A CSS custom property reference, such as 'var(--series-1)'. */
  color: string
  points: Point[]
  /** Drawn dashed: a projection, not recorded data. */
  dashed?: boolean
  /** Likely range around the series, drawn as a light band. */
  range?: RangePoint[]
}

type Scale = (value: number) => number

// The right margin leaves room for end labels.
const M = { top: 12, right: 64, bottom: 28, left: 44 }

function linear([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  const span = d1 - d0 || 1
  return (value) => r0 + ((value - d0) / span) * (r1 - r0)
}

/** Round tick values covering [min, max]. */
function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1
    min -= pad
    max += pad
  }
  const raw = (max - min) / Math.max(1, count)
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const residual = raw / magnitude
  const step = (residual >= 5 ? 10 : residual >= 2 ? 5 : residual >= 1 ? 2 : 1) * magnitude
  const ticks: number[] = []
  for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step + step / 2; v += step) {
    ticks.push(Math.round(v * 1e6) / 1e6)
  }
  return ticks
}

/** Evenly spaced indexes for x-axis labels so they never crowd. */
function spacedIndexes(length: number, maxLabels: number): number[] {
  if (length <= maxLabels) return Array.from({ length }, (_, i) => i)
  const step = Math.ceil(length / maxLabels)
  const out: number[] = []
  for (let i = 0; i < length; i += step) out.push(i)
  return out
}

/** SVG path for a line, breaking at null values. */
function linePath(points: Point[], x: Scale, y: Scale): string {
  let d = ''
  let pen = false
  for (const p of points) {
    if (p.v === null) {
      pen = false
      continue
    }
    d += `${pen ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`
    pen = true
  }
  return d
}

function bandPath(range: RangePoint[], x: Scale, y: Scale): string {
  if (range.length < 2) return ''
  const top = range.map((p) => `${x(p.t).toFixed(1)},${y(p.high).toFixed(1)}`)
  const bottom = [...range].reverse().map((p) => `${x(p.t).toFixed(1)},${y(p.low).toFixed(1)}`)
  return `M${top.join('L')}L${bottom.join('L')}Z`
}

/** Column with a 3px rounded data end and a square baseline. */
function columnPath(x: number, y: number, width: number, baseline: number, radius = 3): string {
  const h = baseline - y
  if (h <= 0) return ''
  const r = Math.min(radius, width / 2, h)
  return `M${x},${baseline}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${baseline}Z`
}

function nearestIndex(timestamps: number[], t: number): number {
  let lo = 0
  let hi = timestamps.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (timestamps[mid] < t) lo = mid
    else hi = mid
  }
  return Math.abs(timestamps[lo] - t) <= Math.abs(timestamps[hi] - t) ? lo : hi
}

function tooltipLeft(x: number, width: number, tooltipWidth = 170): number {
  return x + tooltipWidth > width ? x - tooltipWidth : x + 12
}

function formatTick(v: number): string {
  return Math.abs(v) >= 10_000 ? `${Math.round(v / 1000)}K` : v.toLocaleString('en-US')
}

/** Tracks an element's content width so the SVG can be drawn at true pixel size. */
function useWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

function Axes({ width, height, yTicks, xTicks }: {
  width: number
  height: number
  yTicks: { v: number; y: number; label: string }[]
  xTicks: { t: number; x: number; label: string }[]
}) {
  return (
    <g aria-hidden="true">
      {yTicks.map((tick) => (
        <g key={tick.v}>
          <line className="grid" x1={M.left} x2={width - M.right} y1={tick.y} y2={tick.y} />
          <text className="tick" x={M.left - 8} y={tick.y} textAnchor="end" dominantBaseline="middle">{tick.label}</text>
        </g>
      ))}
      {xTicks.map((tick) => (
        <text key={tick.t} className="tick" x={tick.x} y={height - 8} textAnchor="middle">{tick.label}</text>
      ))}
    </g>
  )
}

/** Line chart for up to a few series, with dashed projections carrying a likely range. */
export function LineChart({ series, height = 250, label }: { series: Series[]; height?: number; label: string }) {
  const [ref, width] = useWidth()
  const [hover, setHover] = useState<number | null>(null)

  const times = useMemo(
    () => [...new Set(series.flatMap((s) => [...s.points.map((p) => p.t), ...(s.range ?? []).map((r) => r.t)]))].sort((a, b) => a - b),
    [series],
  )

  const geo = useMemo(() => {
    const values = series
      .flatMap((s) => [...s.points.map((p) => p.v), ...(s.range ?? []).flatMap((r) => [r.low, r.high])])
      .filter((v): v is number => v !== null)
    const ticks = niceTicks(Math.min(...values), Math.max(...values))
    const x = linear([times[0] ?? 0, times[times.length - 1] ?? 1], [M.left, width - M.right])
    const y = linear([ticks[0], ticks[ticks.length - 1]], [height - M.bottom, M.top])

    // A line continued by a dashed projection leaves its end label to the projection's end; a
    // label that would collide with one already placed is dropped (the legend still names it).
    const continued = new Set(series.filter((s) => s.dashed && s.points.length).map((s) => `${s.color}@${s.points[0].t}`))
    const placed: number[] = []
    const ends = series.flatMap((s) => {
      const last = [...s.points].reverse().find((p) => p.v !== null)
      if (!last || last.v === null || (!s.dashed && continued.has(`${s.color}@${last.t}`))) return []
      const ey = y(last.v)
      const showLabel = placed.every((py) => Math.abs(py - ey) > 14)
      if (showLabel) placed.push(ey)
      return [{ key: s.key, color: s.color, x: x(last.t), y: ey, label: formatPlat(last.v), showLabel }]
    })

    return {
      x,
      y,
      lines: series.map((s) => ({ key: s.key, color: s.color, dashed: !!s.dashed, d: linePath(s.points, x, y) })),
      bands: series.filter((s) => s.range?.length).map((s) => ({ key: s.key, color: s.color, d: bandPath(s.range!, x, y) })),
      ends,
      yTicks: ticks.map((v) => ({ v, y: y(v), label: formatTick(v) })),
      xTicks: spacedIndexes(times.length, Math.max(2, Math.floor((width - M.left - M.right) / 80))).map((i) => ({
        t: times[i], x: x(times[i]), label: formatDay(times[i]),
      })),
    }
  }, [series, times, width, height])

  const info = useMemo(() => {
    if (hover === null || !times.length) return null
    const t = times[hover]
    const rows = series.map((s) => {
      const v = s.points.find((p) => p.t === t)?.v ?? null
      const r = s.range?.find((p) => p.t === t)
      return {
        key: s.key, color: s.color, label: s.label, v, value: formatPlat(v),
        range: r && r.high > r.low ? `(${formatPlat(r.low)}–${formatPlat(r.high)})` : null,
      }
    })
    return { x: geo.x(t), title: formatDay(t), rows }
  }, [hover, times, series, geo])

  const onPointer = (event: PointerEvent<SVGRectElement>) => {
    const svg = event.currentTarget.ownerSVGElement!
    const px = event.clientX - svg.getBoundingClientRect().left
    const [t0, t1] = [times[0], times[times.length - 1]]
    setHover(nearestIndex(times, t0 + ((px - geo.x(t0)) / (geo.x(t1) - geo.x(t0) || 1)) * (t1 - t0)))
  }

  const onKey = (event: KeyboardEvent) => {
    const last = times.length - 1
    const current = hover ?? last
    if (event.key === 'ArrowLeft') setHover(Math.max(0, current - 1))
    else if (event.key === 'ArrowRight') setHover(Math.min(last, current + 1))
    else return
    event.preventDefault()
  }

  return (
    <div className="chart">
      {series.length > 1 && (
        <div className="legend">
          {series.map((s) => (
            <span key={s.key} className="legend-item">
              <span className={`key-line${s.dashed ? ' key-dashed' : ''}`} style={{ background: s.dashed ? undefined : s.color, color: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <div className="chart-plot" ref={ref}>
        <svg width={width} height={height} role="img" aria-label={label}>
          <Axes width={width} height={height} yTicks={geo.yTicks} xTicks={geo.xTicks} />
          <g tabIndex={0} onKeyDown={onKey} onBlur={() => setHover(null)} aria-label={`${label}: use the arrow keys to step through days`}>
            {geo.bands.map((band) => <path key={band.key} className="band" d={band.d} style={{ fill: band.color }} />)}
            {geo.lines.map((line) => (
              <path key={line.key} className={`line${line.dashed ? ' dashed' : ''}`} d={line.d} style={{ stroke: line.color }} />
            ))}
            {geo.ends.map((end) => (
              <g key={end.key}>
                <circle className="dot" cx={end.x} cy={end.y} r={4} style={{ fill: end.color }} />
                {end.showLabel && <text className="end-label" x={end.x + 8} y={end.y} dominantBaseline="middle">{end.label}</text>}
              </g>
            ))}
            {info && (
              <g>
                <line className="crosshair" x1={info.x} x2={info.x} y1={M.top} y2={height - M.bottom} />
                {info.rows.filter((row) => row.v !== null).map((row) => (
                  <circle key={row.key} className="dot" cx={info.x} cy={geo.y(row.v as number)} r={4} style={{ fill: row.color }} />
                ))}
              </g>
            )}
            <rect className="hit" x={M.left} y={M.top} width={Math.max(0, width - M.left - M.right)} height={height - M.top - M.bottom}
              onPointerMove={onPointer} onPointerLeave={() => setHover(null)} />
          </g>
        </svg>
        {info && (
          <div className="chart-tooltip" style={{ left: tooltipLeft(info.x, width), top: M.top }}>
            <div className="tt-title">{info.title}</div>
            {info.rows.map((row) => (
              <div key={row.key} className="tt-row">
                <span className="tt-key" style={{ background: row.color }} />
                <span className="tt-value">{row.value}</span>
                {row.range && <span className="tt-range">{row.range}</span>}
                <span className="tt-label">{row.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** One column per day, as in the app's trade volume chart. */
export function ColumnChart({ points, height = 250, label }: { points: Point[]; height?: number; label: string }) {
  const [ref, width] = useWidth()
  const [hover, setHover] = useState<number | null>(null)

  const geo = useMemo(() => {
    const values = points.map((p) => p.v ?? 0)
    const ticks = niceTicks(0, Math.max(1, ...values))
    const y = linear([0, ticks[ticks.length - 1]], [height - M.bottom, M.top])
    const inner = width - M.left - M.right
    const slot = inner / Math.max(1, points.length)
    const barWidth = Math.max(1, slot * 0.7)
    const baseline = height - M.bottom
    return {
      slot,
      bars: points.map((p, i) => ({ t: p.t, v: p.v, x: M.left + i * slot + (slot - barWidth) / 2, d: columnPath(M.left + i * slot + (slot - barWidth) / 2, y(p.v ?? 0), barWidth, baseline) })),
      yTicks: ticks.map((v) => ({ v, y: y(v), label: formatTick(v) })),
      xTicks: spacedIndexes(points.length, Math.max(2, Math.floor(inner / 80))).map((i) => ({
        t: points[i].t, x: M.left + i * slot + slot / 2, label: formatDay(points[i].t),
      })),
    }
  }, [points, width, height])

  const active = hover === null ? null : geo.bars[hover]

  return (
    <div className="chart">
      <div className="chart-plot" ref={ref}>
        <svg width={width} height={height} role="img" aria-label={label}>
          <Axes width={width} height={height} yTicks={geo.yTicks} xTicks={geo.xTicks} />
          {geo.bars.map((bar, i) => <path key={bar.t} className={`column${hover === i ? ' on' : ''}`} d={bar.d} />)}
          <rect className="hit" x={M.left} y={M.top} width={Math.max(0, width - M.left - M.right)} height={height - M.top - M.bottom}
            onPointerMove={(event) => {
              const left = event.currentTarget.ownerSVGElement!.getBoundingClientRect().left
              setHover(Math.min(points.length - 1, Math.max(0, Math.floor((event.clientX - left - M.left) / geo.slot))))
            }}
            onPointerLeave={() => setHover(null)} />
        </svg>
        {active && (
          <div className="chart-tooltip" style={{ left: tooltipLeft(active.x, width), top: M.top }}>
            <div className="tt-title">{formatDay(active.t)}</div>
            <div className="tt-row"><span className="tt-key" style={{ background: 'var(--series-1)' }} /><span className="tt-value">{formatNumber(active.v)}</span><span className="tt-label">Trades</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

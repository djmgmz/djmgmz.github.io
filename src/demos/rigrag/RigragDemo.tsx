import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import './rigrag.css'
import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { isAbort, playStages } from '../replay'
import { formatPeso, partName, partSpecs, requestChips } from './format'
import { ArrowUpIcon, CheckIcon, CloseIcon, CopyIcon, LogoMark, MenuIcon, PlusIcon, StopIcon, WarningIcon } from './icons'
import { Markdown } from './Markdown'
import recorded from './runs.json'
import type { BuildRequest, BuildResult, CompatibilityResult, Part, RecordedRun, ScoredBuild } from './types'

const RUNS = recorded as unknown as RecordedRun[]

// The empty state's four suggestions, worded exactly as they were sent when the runs were recorded.
const SUGGESTIONS = [
  { title: '1440p gaming, ₱70k', prompt: 'Build me a ₱70,000 gaming PC for 1440p, AMD CPU, and I need Wi-Fi.' },
  { title: 'Quiet coding workstation', prompt: 'I need a quiet ₱50,000 PC for programming and lots of browser tabs.' },
  { title: 'Esports on a budget', prompt: 'What is the best 1080p esports build under ₱40,000?' },
  { title: 'Video editing rig', prompt: 'Recommend a video editing PC around ₱120,000 with at least 32GB of RAM.' },
]

const REPO = 'https://github.com/djmgmz/RigRAG'
// Every replay lasts this long; the reply then states how long the recorded run took.
const REPLAY_MS = 2600
const STAGE_COUNT = 6

type Message =
  | { id: string; role: 'user'; content: string }
  | { id: string; role: 'assistant'; kind: 'pending'; createdAt: number }
  | { id: string; role: 'assistant'; kind: 'reply'; run: number }
  | { id: string; role: 'assistant'; kind: 'off-script' }

interface Conversation {
  id: string
  title: string
  messages: Message[]
  state?: BuildRequest
}

let nextId = 0
const newId = () => `rg-${++nextId}`

/** Index of the recorded run for a prompt, or -1 when none was recorded. */
function runFor(text: string): number {
  const wanted = text.trim().toLowerCase()
  return SUGGESTIONS.findIndex((s) => s.prompt.toLowerCase() === wanted)
}

/* --- Build card (ported from RigRAG's BuildCard.tsx) ---------------------- */

const ROWS: { key: keyof ScoredBuild['components']; label: string }[] = [
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: 'GPU' },
  { key: 'motherboard', label: 'Board' },
  { key: 'ram', label: 'Memory' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power' },
  { key: 'cooler', label: 'Cooler' },
  { key: 'case', label: 'Case' },
]

function priceNote(parts: Part[]): string {
  const types = new Set(parts.map((p) => p.price_type))
  if (types.size === 1 && types.has('observed')) return 'Median of current Shopee and Lazada listings.'
  if (types.has('observed')) return 'Mix of live retailer medians and curated estimates.'
  return 'Prices are curated estimates, not live quotes.'
}

function Compatibility({ results }: { results: CompatibilityResult[] }) {
  const issues = results.filter((r) => r.severity !== 'info')
  const passed = results.length - issues.length
  return (
    <div className="build-compat">
      <p className="build-compat-summary">
        {issues.length === 0 ? `All ${results.length} compatibility checks passed.` : `${passed} of ${results.length} checks passed.`}
      </p>
      {issues.length > 0 && (
        <ul className="build-issues">
          {issues.map((issue) => (
            <li key={issue.rule} className={`build-issue build-issue--${issue.severity}`}>
              <WarningIcon width={16} height={16} />
              <span>{issue.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PartsTable({ build }: { build: ScoredBuild }) {
  const rows = ROWS.map(({ key, label }) => {
    const value = build.components[key]
    return { key, label, parts: Array.isArray(value) ? value : value ? [value] : [] }
  })
  const parts = rows.flatMap((r) => r.parts)
  return (
    <table className="build-parts">
      <caption className="visually-hidden">Parts in the {build.label.toLowerCase()} build</caption>
      <tbody>
        {rows.map(({ key, label, parts: list }) => {
          if (list.length === 0) {
            return key === 'gpu' ? (
              <tr key={key}>
                <th scope="row">{label}</th>
                <td className="build-part-none">Integrated graphics</td>
                <td className="build-part-price" />
              </tr>
            ) : null
          }
          return list.map((part, i) => (
            <tr key={`${key}-${part.id}`}>
              <th scope="row">{i === 0 ? label : ''}</th>
              <td>
                {part.url ? (
                  <a className="build-part-name build-part-link" href={part.url} target="_blank" rel="noopener noreferrer">
                    {partName(part)}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="build-part-name">{partName(part)}</span>
                )}
                <span className="build-part-specs">{partSpecs(part)}</span>
              </td>
              <td className="build-part-price">{part.owned ? 'Owned' : formatPeso(part.price_php)}</td>
            </tr>
          ))
        })}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total</th>
          <td className="build-price-note">{priceNote(parts)}</td>
          <td className="build-part-price build-total">{formatPeso(build.score.total_price_php)}</td>
        </tr>
      </tfoot>
    </table>
  )
}

function BuildCard({ result }: { result: BuildResult }) {
  const builds = [result.primary, ...result.alternatives]
  const [selected, setSelected] = useState(0)
  const tabsId = useId()
  const build = builds[selected]
  return (
    <section className="build" aria-label="Recommended build">
      {builds.length > 1 && (
        <div className="build-tabs" role="tablist" aria-label="Build options">
          {builds.map((b, i) => (
            <button
              key={b.label}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${i}`}
              aria-selected={i === selected}
              aria-controls={`${tabsId}-panel`}
              tabIndex={i === selected ? 0 : -1}
              className="build-tab"
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
                const next = (i + (e.key === 'ArrowRight' ? 1 : builds.length - 1)) % builds.length
                setSelected(next)
                document.getElementById(`${tabsId}-tab-${next}`)?.focus()
              }}
            >
              <span>{b.label}</span>
              <span className="build-tab-price">{formatPeso(b.score.total_price_php)}</span>
            </button>
          ))}
        </div>
      )}
      <div
        id={`${tabsId}-panel`}
        role={builds.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={builds.length > 1 ? `${tabsId}-tab-${selected}` : undefined}
      >
        <PartsTable build={build} />
        <Compatibility results={build.compatibility} />
      </div>
    </section>
  )
}

/* --- Messages ------------------------------------------------------------- */

function Thinking() {
  return (
    <div className="thinking">
      <span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span>
      <span>Working out your build</span>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked (insecure context or permissions); nothing to do.
    }
  }
  return (
    <button type="button" className="icon-button icon-button--small" onClick={copy} aria-label={copied ? 'Copied' : 'Copy reply'}>
      {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
    </button>
  )
}

function MessageItem({ message }: { message: Message }) {
  if (message.role === 'user') {
    return (
      <div className="message message--user" data-message-id={message.id}>
        <p className="message-bubble">{message.content}</p>
      </div>
    )
  }
  return (
    <div className="message message--assistant" data-message-id={message.id}>
      <div className="message-avatar" aria-hidden="true">
        <LogoMark width={20} height={20} />
      </div>
      <div className="message-body">
        {message.kind === 'pending' && <Thinking />}
        {message.kind === 'off-script' && (
          <div className="replay-note">
            <p>
              This copy of RigRAG replays recorded runs, so it can only answer the four example requests. Start a{' '}
              <strong>New build</strong> to pick one, or run the full app from the{' '}
              <a href={REPO} target="_blank" rel="noreferrer">RigRAG repository</a>.
            </p>
          </div>
        )}
        {message.kind === 'reply' && (
          <>
            <div className="prose">
              <Markdown source={RUNS[message.run].reply} />
            </div>
            <BuildCard result={RUNS[message.run].build} />
            <div className="message-actions">
              <CopyButton text={RUNS[message.run].reply} />
              <span className="replay-timing">Replay of a run that took {RUNS[message.run].recordedSeconds} s</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="empty">
      <h4 className="empty-title">What are you building?</h4>
      <p className="empty-lede">
        Tell me your budget and what you'll use it for. Every part comes from a real catalog and is checked for
        compatibility before you see it.
      </p>
      <ul className="suggestions">
        {SUGGESTIONS.map((s) => (
          <li key={s.title}>
            <button type="button" className="suggestion" onClick={() => onPick(s.prompt)}>
              <span className="suggestion-title">{s.title}</span>
              <span className="suggestion-prompt">{s.prompt}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* --- App ------------------------------------------------------------------ */

interface Props {
  /** Reports replay progress in the shape `playStages` emits. */
  onStage: (index: number | null) => void
  /** Called each time a replay finishes. */
  onComplete: () => void
}

/**
 * RigRAG's chat interface replaying recorded /api/chat responses. The four suggestions map to
 * recorded runs; any other prompt gets an off-script note instead of an invented answer.
 */
export default function RigragDemo({ onStage, onComplete }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [text, setText] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const inFlight = useRef<AbortController | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const anchor = useRef<string | null>(null)
  // Latest callbacks live in a ref, so a parent re-render never restarts a replay in flight.
  const callbacks = useRef({ onStage, onComplete })
  useLayoutEffect(() => {
    callbacks.current = { onStage, onComplete }
  })

  const active = conversations.find((c) => c.id === activeId) ?? null
  const chips = requestChips(active?.state)

  const patch = (id: string, update: (c: Conversation) => Conversation) =>
    setConversations((list) => list.map((c) => (c.id === id ? update(c) : c)))

  async function send(raw: string, intoNew = false) {
    const content = raw.trim()
    if (!content || busy) return
    const userMessage: Message = { id: newId(), role: 'user', content }
    const pending: Message = { id: newId(), role: 'assistant', kind: 'pending', createdAt: Date.now() }

    let conversationId = intoNew ? null : activeId
    if (!conversationId) {
      conversationId = newId()
      const created: Conversation = { id: conversationId, title: content, messages: [userMessage, pending] }
      setConversations((list) => [created, ...list])
      setActiveId(conversationId)
    } else {
      patch(conversationId, (c) => ({ ...c, messages: [...c.messages, userMessage, pending] }))
    }
    setText('')
    setDrawerOpen(false)

    const run = runFor(content)
    const id = conversationId
    const settle = (message: Message, state?: BuildRequest) =>
      patch(id, (c) => ({
        ...c,
        state: state ?? c.state,
        messages: c.messages.map((m) => (m.id === pending.id ? message : m)),
      }))

    if (run < 0) {
      settle({ id: pending.id, role: 'assistant', kind: 'off-script' })
      return
    }

    const controller = new AbortController()
    inFlight.current = controller
    setBusy(true)
    try {
      await playStages(Array(STAGE_COUNT).fill(1), REPLAY_MS, callbacks.current.onStage, controller.signal)
      anchor.current = userMessage.id
      settle({ id: pending.id, role: 'assistant', kind: 'reply', run }, RUNS[run].state)
      callbacks.current.onComplete()
    } catch (error) {
      if (!isAbort(error)) throw error
      patch(id, (c) => ({ ...c, messages: c.messages.filter((m) => m.id !== pending.id && m.id !== userMessage.id) }))
    } finally {
      inFlight.current = null
      setBusy(false)
    }
  }

  // Keep the newest message in view while waiting; when a reply lands, scroll to the question it
  // answers rather than the bottom, as the real app does.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    if (anchor.current) {
      const target = el.querySelector<HTMLElement>(`[data-message-id="${anchor.current}"]`)
      anchor.current = null
      if (target) {
        el.scrollTo({ top: target.offsetTop - 24 })
        return
      }
    }
    el.scrollTo({ top: el.scrollHeight })
  }, [conversations, activeId])

  useEffect(() => () => inFlight.current?.abort(), [])

  // Grow with the content up to 220px, then scroll, like the real composer.
  useLayoutEffect(() => {
    const el = textarea.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }, [text])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(text)
  }

  return (
    <div className="rg">
      <div className="app">
        {drawerOpen && <div className="scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}
        <aside className={`sidebar${drawerOpen ? ' sidebar--open' : ''}`} aria-label="Conversations">
          <div className="sidebar-head">
            <span className="brand">
              <LogoMark />
              <span className="brand-name">RigRAG</span>
            </span>
            <button type="button" className="icon-button sidebar-close" onClick={() => setDrawerOpen(false)} aria-label="Close sidebar">
              <CloseIcon />
            </button>
          </div>
          <button
            type="button"
            className="new-chat"
            onClick={() => {
              setActiveId(null)
              setDrawerOpen(false)
              textarea.current?.focus()
            }}
          >
            <PlusIcon /> New build
          </button>
          <nav className="history" aria-label="Previous builds">
            {conversations.length === 0 ? (
              <p className="history-empty">Your builds will show up here.</p>
            ) : (
              <ul>
                {conversations.map((c) => (
                  <li key={c.id} className={`history-item${c.id === activeId ? ' history-item--active' : ''}`}>
                    <button
                      type="button"
                      className="history-link"
                      onClick={() => {
                        setActiveId(c.id)
                        setDrawerOpen(false)
                      }}
                      aria-current={c.id === activeId ? 'page' : undefined}
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </aside>

        <div className="chat">
          <header className="chat-header">
            <button type="button" className="icon-button menu-button" onClick={() => setDrawerOpen(true)} aria-label="Open sidebar">
              <MenuIcon />
            </button>
            <h4 className="chat-title">{active?.title ?? 'New build'}</h4>
            {chips.length > 0 && (
              <ul className="chips" aria-label="What RigRAG knows about this build">
                {chips.map((chip) => <li key={chip} className="chip">{chip}</li>)}
              </ul>
            )}
          </header>

          <div className="chat-scroll" ref={scroller}>
            <div className="chat-column">
              {active ? (
                <div className="messages" aria-live="polite">
                  {active.messages.map((message) => <MessageItem key={message.id} message={message} />)}
                </div>
              ) : (
                <EmptyState onPick={(prompt) => send(prompt, true)} />
              )}
            </div>
          </div>

          <div className="chat-footer">
            <div className="chat-column">
              <form className="composer" onSubmit={submit}>
                <label htmlFor="rg-composer" className="visually-hidden">Message RigRAG</label>
                <textarea
                  id="rg-composer"
                  ref={textarea}
                  rows={1}
                  value={text}
                  placeholder="Describe the PC you want, e.g. budget, games, resolution"
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter sends; Shift+Enter adds a line. Ignore Enter while an IME is composing.
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      send(text)
                    }
                  }}
                />
                {busy ? (
                  <button type="button" className="composer-send" onClick={() => inFlight.current?.abort()} aria-label="Stop waiting for the reply">
                    <StopIcon />
                  </button>
                ) : (
                  <button type="submit" className="composer-send" disabled={!text.trim()} aria-label="Send message">
                    <ArrowUpIcon />
                  </button>
                )}
              </form>
              <p className="disclaimer">Parts and prices come from RigRAG's catalog. Check compatibility notes before you buy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

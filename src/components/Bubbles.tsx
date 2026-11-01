import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { hobbies } from '../content'

// Half the 88px bubble size in site.css.
const RADIUS = 44
const FRICTION = 0.98
const BOUNCE = 0.8
// A weak pull toward the centre keeps thrown bubbles from settling in a corner.
const RETURN_FORCE = 0.0002
// The loop sleeps after this many consecutive frames with no bubble moving more than SETTLED_PX.
const SETTLED_PX = 0.05
const SETTLED_FRAMES = 30
const MAX_AWAKE_MS = 10_000
// A throw takes the pointer's speed over this window, so a brief pause before letting go
// doesn't drop the bubble dead.
const THROW_WINDOW_MS = 100
// px per frame; keeps a frantic flick from tunnelling through the walls.
const MAX_THROW = 40
const FRAME_MS = 1000 / 60

interface Tag {
  x: number
  y: number
  vx: number
  vy: number
  dragging: boolean
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Seats bubbles on a loose grid so the first frame is readable before anything moves. They start
 * with a little drift, except under reduced motion, where nothing moves until it is thrown.
 */
function seat(width: number, height: number, still: boolean): Tag[] {
  const cols = Math.max(1, Math.floor(width / (RADIUS * 2.3)))
  return hobbies.map((_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      x: Math.min(width - RADIUS, RADIUS + col * RADIUS * 2.3 + (row % 2) * RADIUS * 0.6),
      y: Math.min(height - RADIUS, RADIUS + row * RADIUS * 2.1),
      vx: still ? 0 : (Math.random() - 0.5) * 3,
      vy: still ? 0 : (Math.random() - 0.5) * 3,
      dragging: false,
    }
  })
}

/** Pushes two overlapping bubbles apart and trades their velocity along the line between centres. */
function collide(a: Tag, b: Tag) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.hypot(dx, dy)
  const min = RADIUS * 2
  if (distance >= min || distance === 0) return
  const nx = dx / distance
  const ny = dy / distance
  const push = (min - distance) / 2
  a.x -= nx * push
  a.y -= ny * push
  b.x += nx * push
  b.y += ny * push
  const along = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
  if (along > 0) return
  const impulse = (-(1 + BOUNCE) * along) / 2
  a.vx -= impulse * nx
  a.vy -= impulse * ny
  b.vx += impulse * nx
  b.vy += impulse * ny
}

/**
 * Hobbies as round bubbles that can be grabbed and thrown around their panel.
 * With reduced motion nothing moves on its own; a throw the visitor makes still plays out.
 */
export function Bubbles() {
  const box = useRef<HTMLDivElement>(null)
  const tags = useRef<Tag[]>([])
  const pointer = useRef({ x: 0, y: 0, id: -1, index: -1 })
  const [snapshot, setSnapshot] = useState<Tag[]>([])

  // Wakes the physics loop; set by the effect, called when a bubble is grabbed.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    const el = box.current
    if (!el) return
    tags.current = seat(el.clientWidth, el.clientHeight, prefersReducedMotion())

    let frame = 0
    let visible = false
    let quietFrames = 0
    let awakeSince = 0

    const step = () => {
      const width = el.clientWidth
      const height = el.clientHeight
      const still = prefersReducedMotion()
      let motion = 0
      let dragging = false
      for (const tag of tags.current) {
        const x = tag.x
        const y = tag.y
        if (tag.dragging) {
          dragging = true
          // Velocity tracks the pointer, so letting go mid-drag throws the bubble.
          tag.vx = (pointer.current.x - tag.x) * 0.3
          tag.vy = (pointer.current.y - tag.y) * 0.3
          tag.x = pointer.current.x
          tag.y = pointer.current.y
          continue
        }
        // Under reduced motion a throw the visitor makes still plays out, but nothing drifts on
        // its own: no pull toward the centre.
        if (!still) {
          tag.vx += (width / 2 - tag.x) * RETURN_FORCE
          tag.vy += (height / 2 - tag.y) * RETURN_FORCE
        }
        tag.x += tag.vx
        tag.y += tag.vy
        tag.vx *= FRICTION
        tag.vy *= FRICTION
        if (tag.x < RADIUS || tag.x > width - RADIUS) {
          tag.x = Math.min(Math.max(tag.x, RADIUS), width - RADIUS)
          tag.vx *= -BOUNCE
        }
        if (tag.y < RADIUS || tag.y > height - RADIUS) {
          tag.y = Math.min(Math.max(tag.y, RADIUS), height - RADIUS)
          tag.vy *= -BOUNCE
        }
        motion = Math.max(motion, Math.abs(tag.x - x), Math.abs(tag.y - y))
      }
      for (let i = 0; i < tags.current.length; i++) {
        for (let j = i + 1; j < tags.current.length; j++) collide(tags.current[i], tags.current[j])
      }
      setSnapshot(tags.current.map((tag) => ({ ...tag })))

      // Sleep once the bubbles have settled, or a while after the last interaction, so the
      // slow drift toward the centre can't keep the loop (and React) busy forever.
      quietFrames = motion < SETTLED_PX && !dragging ? quietFrames + 1 : 0
      const idleTooLong = !dragging && performance.now() - awakeSince > MAX_AWAKE_MS
      frame = visible && quietFrames < SETTLED_FRAMES && !idleTooLong ? requestAnimationFrame(step) : 0
    }

    wake.current = () => {
      awakeSince = performance.now()
      quietFrames = 0
      if (!frame && visible) frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake.current()
      else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  // Recent pointer positions, newest last, for measuring the throw on release.
  const trail = useRef<{ x: number; y: number; t: number }[]>([])

  const localPoint = (event: ReactPointerEvent) => {
    const rect = box.current!.getBoundingClientRect()
    pointer.current.x = event.clientX - rect.left
    pointer.current.y = event.clientY - rect.top
    const t = event.timeStamp
    trail.current.push({ x: pointer.current.x, y: pointer.current.y, t })
    while (trail.current.length > 2 && t - trail.current[0].t > THROW_WINDOW_MS) trail.current.shift()
  }

  const grab = (index: number) => (event: ReactPointerEvent<HTMLLIElement>) => {
    trail.current = []
    localPoint(event)
    pointer.current.id = event.pointerId
    pointer.current.index = index
    tags.current[index].dragging = true
    wake.current()
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // The pointer is already gone (lifted mid-press); the drag simply ends on the next release.
    }
  }

  const release = (event: ReactPointerEvent) => {
    const index = pointer.current.index
    if (index >= 0) {
      const tag = tags.current[index]
      tag.dragging = false
      // Throw at the pointer's average speed over the last moments of the drag.
      const recent = trail.current.filter((p) => event.timeStamp - p.t <= THROW_WINDOW_MS)
      if (recent.length >= 2) {
        const first = recent[0]
        const last = recent[recent.length - 1]
        const frames = Math.max(1, (last.t - first.t) / FRAME_MS)
        const clamp = (v: number) => Math.max(-MAX_THROW, Math.min(MAX_THROW, v))
        tag.vx = clamp((last.x - first.x) / frames)
        tag.vy = clamp((last.y - first.y) / frames)
      }
    }
    pointer.current.index = -1
    // A long hold should still let the throw play out after release.
    wake.current()
  }

  return (
    <div className="bubbles" ref={box}>
      <ul className="bubbles-list" aria-label="Hobbies">
        {hobbies.map((hobby, index) => {
          const tag = snapshot[index]
          return (
            <li
              key={hobby.name}
              className={`bubble${tag?.dragging ? ' bubble--dragging' : ''}`}
              style={tag ? { transform: `translate(${tag.x - RADIUS}px, ${tag.y - RADIUS}px)` } : { visibility: 'hidden' }}
              onPointerDown={grab(index)}
              onPointerMove={(event) => event.pointerId === pointer.current.id && localPoint(event)}
              onPointerUp={release}
              onPointerCancel={release}
            >
              {hobby.image && <img src={hobby.image} alt="" draggable={false} />}
              {hobby.emoji && <span className="bubble-emoji" aria-hidden="true">{hobby.emoji}</span>}
              <span>{hobby.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

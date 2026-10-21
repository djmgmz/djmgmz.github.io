import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { hobbies } from '../content'

// Half the 92px sticker size in site.css.
const RADIUS = 46
const FRICTION = 0.98
const BOUNCE = 0.8
// A weak pull toward the centre keeps thrown tags from settling in a corner.
const RETURN_FORCE = 0.0002
// The loop sleeps after this many consecutive frames with no sticker moving more than SETTLED_PX.
const SETTLED_PX = 0.05
const SETTLED_FRAMES = 30
const MAX_AWAKE_MS = 10_000

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

/** Seats tags on a loose grid so the first frame is readable before anything moves. */
function seat(width: number, height: number): Tag[] {
  const cols = Math.max(1, Math.floor(width / (RADIUS * 2.3)))
  return hobbies.map((_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      x: Math.min(width - RADIUS, RADIUS + col * RADIUS * 2.3 + (row % 2) * RADIUS * 0.6),
      y: Math.min(height - RADIUS, RADIUS + row * RADIUS * 2.1),
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      dragging: false,
    }
  })
}

/** Pushes two overlapping stickers apart and trades their velocity along the line between centres. */
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
 * Hobbies as round luggage stickers that can be grabbed and thrown around the slip.
 * With reduced motion the stickers stay seated and only move while dragged.
 */
export function LuggageTags() {
  const box = useRef<HTMLDivElement>(null)
  const tags = useRef<Tag[]>([])
  const pointer = useRef({ x: 0, y: 0, id: -1, index: -1 })
  const [snapshot, setSnapshot] = useState<Tag[]>([])

  // Wakes the physics loop; set by the effect, called when a sticker is grabbed.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    const el = box.current
    if (!el) return
    tags.current = seat(el.clientWidth, el.clientHeight)

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
          // Velocity tracks the pointer, so letting go mid-drag throws the sticker.
          tag.vx = (pointer.current.x - tag.x) * 0.3
          tag.vy = (pointer.current.y - tag.y) * 0.3
          tag.x = pointer.current.x
          tag.y = pointer.current.y
          continue
        }
        if (still) {
          tag.vx = 0
          tag.vy = 0
        }
        tag.vx += (width / 2 - tag.x) * RETURN_FORCE
        tag.vy += (height / 2 - tag.y) * RETURN_FORCE
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

      // Sleep once the stickers have settled, or a while after the last interaction, so the
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

  const localPoint = (event: ReactPointerEvent) => {
    const rect = box.current!.getBoundingClientRect()
    pointer.current.x = event.clientX - rect.left
    pointer.current.y = event.clientY - rect.top
  }

  const grab = (index: number) => (event: ReactPointerEvent<HTMLLIElement>) => {
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

  const release = () => {
    const index = pointer.current.index
    if (index >= 0) tags.current[index].dragging = false
    pointer.current.index = -1
    // A long hold should still let the throw play out after release.
    wake.current()
  }

  return (
    <div className="tags" ref={box}>
      <ul className="tags-list" aria-label="Hobbies">
        {hobbies.map((hobby, index) => {
          const tag = snapshot[index]
          return (
            <li
              key={hobby.name}
              className={`tag${tag?.dragging ? ' tag--dragging' : ''}${hobby.image || hobby.emoji ? ' tag--art' : ''}`}
              style={tag ? { transform: `translate(${tag.x - RADIUS}px, ${tag.y - RADIUS}px)` } : { visibility: 'hidden' }}
              onPointerDown={grab(index)}
              onPointerMove={(event) => event.pointerId === pointer.current.id && localPoint(event)}
              onPointerUp={release}
              onPointerCancel={release}
            >
              {hobby.image && <img src={hobby.image} alt="" draggable={false} />}
              {hobby.emoji && <span className="tag-emoji" aria-hidden="true">{hobby.emoji}</span>}
              <span>{hobby.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

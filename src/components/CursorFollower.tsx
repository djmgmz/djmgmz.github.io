import { useEffect, useRef } from 'react'
import './CursorFollower.css'
const poroImage = '/assets/poro.png'

type CursorFollowerProps = {
  active?: boolean
}

/** Last pointer position — always updated */
const lastPointer = { x: 0, y: 0 }

/**
 * Spring + damping + light downward pull.
 * Applied globally when active prop is true.
 */
export function CursorFollower({ active = true }: CursorFollowerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastPointer.x = e.clientX
      lastPointer.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current)
      return
    }

    const el = rootRef.current
    if (!el) return

    posRef.current = { x: lastPointer.x, y: lastPointer.y }
    velRef.current = { x: 0, y: 0 }
    el.style.left = `${posRef.current.x}px`
    el.style.top = `${posRef.current.y}px`

    let last = performance.now()

    const spring = 0.052
    const gravity = 0.2
    const damping = 0.9

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2.5)
      last = now

      const target = lastPointer
      const pos = posRef.current
      const vel = velRef.current

      const dx = target.x - pos.x
      const dy = target.y - pos.y

      vel.x += dx * spring * dt
      vel.y += dy * spring * dt + gravity * dt
      vel.x *= Math.pow(damping, dt)
      vel.y *= Math.pow(damping, dt)
      pos.x += vel.x * dt
      pos.y += vel.y * dt

      el.style.left = `${pos.x}px`
      el.style.top = `${pos.y}px`

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        left: '-100px',
        top: '-100px',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: active ? 1 : 0,
        transition: 'opacity 0.2s ease',
        color: '#facc15',
      }}
    >
      <div className="cursor-follower__glow">
        <img src={poroImage} alt="Poro cursor" width={32} height={32} />
      </div>
    </div>
  )
}

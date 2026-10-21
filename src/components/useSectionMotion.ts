import { useEffect, type RefObject } from 'react'

// Fraction of the remaining distance the arch closes each frame, so it trails the scroll
// slightly instead of snapping to it.
const ARCH_EASE = 0.14

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Section entrances and the contact arch.
 *
 * Every element marked `data-reveal` starts visible; the hidden starting states only apply once
 * `motion-ready` is on the root, so content never depends on this script running. Elements are
 * revealed once, the first time they enter the viewport.
 *
 * The arch grows from flat to a full curve as the contact zone rises from the bottom of the
 * viewport toward its upper third, exposed to CSS as `--arch` (0 to 1).
 *
 * @param archZone - Element that receives `--arch`; its position drives the curve.
 */
export function useSectionMotion(archZone: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      archZone.current?.style.setProperty('--arch', '1')
      return
    }
    root.classList.add('motion-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = 'true'
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

    let current = 0
    let frame = 0
    const target = () => {
      const zone = archZone.current
      if (!zone) return 0
      const top = zone.getBoundingClientRect().top
      const vh = window.innerHeight
      return Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.6)))
    }
    const tick = () => {
      const goal = target()
      current += (goal - current) * ARCH_EASE
      if (Math.abs(goal - current) < 0.001) current = goal
      archZone.current?.style.setProperty('--arch', current.toFixed(4))
      frame = current === goal ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      root.classList.remove('motion-ready')
    }
  }, [archZone])
}

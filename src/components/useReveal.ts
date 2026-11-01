import { useEffect } from 'react'

/**
 * Entrances for every element marked `data-reveal`: each rises into place the first time it enters
 * the viewport, staggered with its marked siblings.
 *
 * Elements start visible; the hidden starting state only applies once `motion-ready` is on the
 * root, so content never depends on this script running. Reduced motion skips it entirely.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const root = document.documentElement
    const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')]

    // Siblings that enter together come in one after another rather than all at once.
    for (const el of targets) {
      const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal')) : []
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 5) * 80}ms`)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    // Anything already on screen is revealed in the same frame, so the first paint never blinks.
    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-revealed')
      else observer.observe(el)
    }
    root.classList.add('motion-ready')
    return () => observer.disconnect()
  }, [])
}

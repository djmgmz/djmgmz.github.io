const REDUCED_MOTION_MS = 500

/**
 * Walks a recorded run's pipeline stages at a watchable pace. Each stage gets a share of `totalMs`
 * proportional to its weight (with a floor so a 5 ms SQL lookup still registers), and `onStage`
 * reports the active index, then the stage count once all are done, or null when stopped. Resolves
 * when the last stage ends; rejects with an AbortError when `signal` fires.
 */
export function playStages(
  weights: number[],
  totalMs: number,
  onStage: (index: number | null) => void,
  signal: AbortSignal,
): Promise<void> {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const budget = reduced ? REDUCED_MOTION_MS : totalMs
  const sum = weights.reduce((a, b) => a + b, 0) || 1
  const floor = 0.08
  const shares = weights.map((w) => Math.max(w / sum, floor))
  const scale = budget / shares.reduce((a, b) => a + b, 0)
  const durations = shares.map((share) => share * scale)

  return new Promise((resolve, reject) => {
    let index = 0
    let timer = 0
    const abort = () => {
      window.clearTimeout(timer)
      onStage(null)
      reject(new DOMException('Replay stopped', 'AbortError'))
    }
    if (signal.aborted) return abort()
    signal.addEventListener('abort', abort, { once: true })

    const next = () => {
      if (index >= durations.length) {
        signal.removeEventListener('abort', abort)
        // One past the last stage marks every stage done, so the finished pipeline stays visible.
        onStage(durations.length)
        resolve()
        return
      }
      onStage(index)
      timer = window.setTimeout(() => {
        index += 1
        next()
      }, durations[index])
    }
    next()
  })
}

export function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

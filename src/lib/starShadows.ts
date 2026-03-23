/** Seeded PRNG — same output every build (like compiled Sass in the CodePen). */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Parallax star layers from https://codepen.io/sarazond/pen/LYGbwj — many tiny
 * box-shadows on a 1×1 (or 2×2, 3×3) element, duplicated via ::after at +2000px Y.
 */
export function generateStarShadows(count: number, seed: number): string {
  const rand = mulberry32(seed)
  const parts: string[] = []
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * 2000)
    const y = Math.floor(rand() * 2000)
    parts.push(`${x}px ${y}px #fff`)
  }
  return parts.join(', ')
}

export const STAR_SHADOW_SMALL = generateStarShadows(700, 0x2f1a4e01)
export const STAR_SHADOW_MEDIUM = generateStarShadows(200, 0x2f1a4e02)
export const STAR_SHADOW_BIG = generateStarShadows(100, 0x2f1a4e03)

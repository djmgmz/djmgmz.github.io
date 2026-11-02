export type NavVariant = 'frame' | 'contents' | 'dock'

/** Which side navigation design is on screen; `?nav=` switches it while the options are compared. */
export function navVariant(): NavVariant {
  const value = new URLSearchParams(window.location.search).get('nav')
  return value === 'contents' || value === 'dock' ? value : 'frame'
}

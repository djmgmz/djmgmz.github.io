import { createTheme, type MantineColorsTuple } from '@mantine/core'

/** New purple color palette
 * #242038 - Dark purple (main background)
 * #9067C6 - Medium purple (primary accent)
 * #8D86C9 - Light purple/lavender (secondary accent)
 * #CAC4CE - Light gray (text)
 * #F7ECE1 - Cream/off-white (light text)
 */
export const palette = {
  bg: '#242038',
  bgDeep: '#1a1a2e',
  panel: '#2d2b42',
  cardBg: '#1f1d33',
  primary: '#9067C6',
  primaryLight: '#8D86C9',
  primaryDark: '#7a4fb0',
  textLight: '#CAC4CE',
  textLighter: '#F7ECE1',
  /** Keeping for backward compatibility but updated to purple */
  gold: '#9067C6',
  goldBright: '#8D86C9',
  blue: '#8D86C9',
  blueLight: '#CAC4CE',
  blueDark: '#9067C6',
  magic: '#9067C6',
  magicGlow: '#8D86C9',
  /** Accent colors for CTA buttons */
  orangeBright: '#9067C6',
  orangeDeep: '#7a4fb0',
  /** Gradient colors for section transitions */
  orangeGradientStart: '#9067C6',
  orangeGradientEnd: '#8D86C9',
} as const

const primary: MantineColorsTuple = [
  '#F7ECE1', // 0 - lightest
  '#EDE4F0',
  '#D4C4E0',
  '#B8A4D0',
  '#9B84C0',
  '#9067C6', // 5 - main primary
  '#8D86C9', // 6 - primary light
  '#7a4fb0',
  '#6a4399',
  '#5a3782',
]

const secondary: MantineColorsTuple = [
  '#F7ECE1',
  '#E8E0F0',
  '#CAC4CE',
  '#B4ACCC',
  '#9E94CA',
  '#8D86C9',
  '#7a70b8',
  '#6a5aa7',
  '#5a4496',
  '#4a2e85',
]

/** Dark scale based on #242038 */
const dark: MantineColorsTuple = [
  '#F7ECE1', // 0 - text on dark
  '#CAC4CE',
  '#8D86C9',
  '#9067C6',
  '#6a5aa7',
  '#4a4a6a',
  '#3d3d58',
  '#2d2b42', // 7 - panel
  '#242038', // 8 - main bg
  '#1a1a2e', // 9 - deep bg
]

export const theme = createTheme({
  colors: {
    primary,
    secondary,
    dark,
  },
  primaryColor: 'primary',
  defaultGradient: {
    from: 'primary',
    to: 'secondary',
    deg: 125,
  },
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
})

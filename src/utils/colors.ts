/**
 * Color utility functions for visualizations
 */

/**
 * RGB color representation
 */
export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * RGBA color representation
 */
export interface RGBA extends RGB {
  a: number
}

/**
 * HSL color representation
 */
export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * HSLA color representation
 */
export interface HSLA extends HSL {
  a: number
}

/**
 * Convert HSL to RGB
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0, g = 0, b = 0

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

/**
 * Convert RGB to HSL
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
        break
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) * 60
        break
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) * 60
        break
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Convert hex color to RGB
 * @param hex Hex color string (with or without #)
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result || !result[1] || !result[2] || !result[3]) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Convert RGB to hex color
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Create an HSL color string
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 */
export function hsl(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`
}

/**
 * Create an HSLA color string
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @param a Alpha (0-1)
 */
export function hsla(h: number, s: number, l: number, a: number): string {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

/**
 * Create an RGB color string
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 */
export function rgb(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

/**
 * Create an RGBA color string
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @param a Alpha (0-1)
 */
export function rgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`
}

/**
 * Map a normalized value (0-1) to a hue in a color range
 * @param value Normalized value (0-1)
 * @param minHue Minimum hue (default: 0, red)
 * @param maxHue Maximum hue (default: 240, blue)
 */
export function valueToHue(
  value: number,
  minHue = 0,
  maxHue = 240
): number {
  return minHue + (maxHue - minHue) * value
}

/**
 * Create a color based on a normalized value
 * Uses HSL for smooth color transitions
 * @param value Normalized value (0-1)
 * @param saturation Saturation (0-100, default: 70)
 * @param lightness Lightness (0-100, default: 50)
 * @param minHue Minimum hue (default: 0)
 * @param maxHue Maximum hue (default: 240)
 */
export function valueToColor(
  value: number,
  saturation = 70,
  lightness = 50,
  minHue = 0,
  maxHue = 240
): string {
  const hue = valueToHue(value, minHue, maxHue)
  return hsl(hue, saturation, lightness)
}

/**
 * Interpolate between two colors
 * @param color1 Start color (hex or rgb string)
 * @param color2 End color (hex or rgb string)
 * @param t Interpolation factor (0-1)
 */
export function interpolateColors(
  color1: string,
  color2: string,
  t: number
): string {
  const rgb1 = parseColor(color1)
  const rgb2 = parseColor(color2)

  if (!rgb1 || !rgb2) {
    return color1
  }

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)

  return rgb(r, g, b)
}

/**
 * Parse a color string to RGB
 * @param color Color string (hex, rgb, or rgba)
 */
export function parseColor(color: string): RGB | null {
  // Try hex
  if (color.startsWith('#')) {
    return hexToRgb(color)
  }

  // Try rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    }
  }

  return null
}

/**
 * Lighten a color
 * @param color Color string
 * @param amount Amount to lighten (0-1)
 */
export function lighten(color: string, amount: number): string {
  const parsed = parseColor(color)
  if (!parsed) return color

  const hslColor = rgbToHsl(parsed.r, parsed.g, parsed.b)
  hslColor.l = Math.min(100, hslColor.l + amount * 100)

  return hsl(hslColor.h, hslColor.s, hslColor.l)
}

/**
 * Darken a color
 * @param color Color string
 * @param amount Amount to darken (0-1)
 */
export function darken(color: string, amount: number): string {
  const parsed = parseColor(color)
  if (!parsed) return color

  const hslColor = rgbToHsl(parsed.r, parsed.g, parsed.b)
  hslColor.l = Math.max(0, hslColor.l - amount * 100)

  return hsl(hslColor.h, hslColor.s, hslColor.l)
}

/**
 * Adjust color saturation
 * @param color Color string
 * @param amount Amount to adjust (-1 to 1)
 */
export function saturate(color: string, amount: number): string {
  const parsed = parseColor(color)
  if (!parsed) return color

  const hslColor = rgbToHsl(parsed.r, parsed.g, parsed.b)
  hslColor.s = Math.max(0, Math.min(100, hslColor.s + amount * 100))

  return hsl(hslColor.h, hslColor.s, hslColor.l)
}

/**
 * Get a contrasting text color (black or white) for a background
 * @param backgroundColor Background color string
 */
export function getContrastingTextColor(backgroundColor: string): string {
  const parsed = parseColor(backgroundColor)
  if (!parsed) return '#000000'

  // Calculate relative luminance
  const luminance = (0.299 * parsed.r + 0.587 * parsed.g + 0.114 * parsed.b) / 255

  return luminance > 0.5 ? '#000000' : '#ffffff'
}

/**
 * Pre-defined color palettes for visualizations
 */
export const PALETTES = {
  /** Rainbow spectrum */
  rainbow: (value: number) => valueToColor(value, 70, 50, 0, 300),

  /** Heat map (blue to red) */
  heat: (value: number) => valueToColor(value, 70, 50, 240, 0),

  /** Cool (blue to green) */
  cool: (value: number) => valueToColor(value, 70, 50, 180, 120),

  /** Warm (yellow to red) */
  warm: (value: number) => valueToColor(value, 70, 50, 60, 0),

  /** Grayscale */
  grayscale: (value: number) => hsl(0, 0, value * 80 + 10),

  /** Single hue with varying lightness */
  singleHue: (baseHue: number) =>
    (value: number) => hsl(baseHue, 70, 30 + value * 40),
} as const

/**
 * Visualization-specific colors
 */
export const VIZ_COLORS = {
  /** Default bar color */
  barDefault: '#6366f1',

  /** Active/comparing bar color */
  barActive: '#f59e0b',

  /** Sorted/completed bar color */
  barSorted: '#10b981',

  /** Pivot element color */
  barPivot: '#ef4444',

  /** Background color */
  background: '#1e1e2e',

  /** Grid lines */
  gridLine: 'rgba(255, 255, 255, 0.1)',

  /** Text color */
  text: '#ffffff',

  /** Secondary text color */
  textSecondary: 'rgba(255, 255, 255, 0.6)',
} as const

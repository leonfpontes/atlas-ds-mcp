// Color math for the token build: hex → oklch for the CSS (docs/DESIGN.md: "hex is the
// source; oklch is what goes into globals.css") and the WCAG 2.x contrast ratio for the AA test.

export interface Rgba {
  r: number
  g: number
  b: number
  /** 0 to 1. */
  a: number
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

/** `#RGB`, `#RRGGBB` or `#RRGGBBAA` to channels 0–255 and alpha 0–1. */
export function parseHex(hex: string): Rgba {
  const match = HEX.exec(hex)
  if (!match) throw new Error(`"${hex}" is not a hex color (#RGB, #RRGGBB or #RRGGBBAA).`)
  let digits = match[1] as string
  if (digits.length === 3) digits = [...digits].map((d) => d + d).join('')
  const byte = (i: number) => parseInt(digits.slice(i, i + 2), 16)
  return { r: byte(0), g: byte(2), b: byte(4), a: digits.length === 8 ? byte(6) / 255 : 1 }
}

const toLinear = (channel: number) => {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance of an opaque color. */
export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG 2.x contrast ratio, from 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** OKLCH of a hex color: lightness 0–1, chroma, hue in degrees (0 for greys). */
export function hexToOklch(hex: string): { l: number; c: number; h: number; alpha: number } {
  const { r, g, b, a } = parseHex(hex)
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)]
  // Björn Ottosson's linear sRGB → OKLab matrices.
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const c = Math.hypot(A, B)
  const h = c < 0.0005 ? 0 : (Math.atan2(B, A) * (180 / Math.PI) + 360) % 360
  return { l: L, c, h, alpha: a }
}

const round = (n: number, digits: number) => Number(n.toFixed(digits))

/** CSS `oklch(L C H)` with 3 decimals for L and C and 1 for H, as in docs/DESIGN.md. */
export function toOklchCss(hex: string): string {
  const { l, c, h, alpha } = hexToOklch(hex)
  const body = `${round(l, 3)} ${round(c, 3)} ${round(h, 1)}`
  return alpha < 1 ? `oklch(${body} / ${round(alpha, 3)})` : `oklch(${body})`
}

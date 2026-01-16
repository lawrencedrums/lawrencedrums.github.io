/**
 * Canvas utility functions for visualization rendering
 */

/**
 * Options for creating a canvas
 */
export interface CanvasOptions {
  /** Width in CSS pixels (0 = auto-fit container) */
  width?: number
  /** Height in CSS pixels (0 = auto-fit container) */
  height?: number
  /** Whether to scale for high-DPI displays */
  scaleForDPI?: boolean
  /** CSS class names to apply */
  className?: string
}

/**
 * Result of creating a canvas
 */
export interface CanvasResult {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  /** Actual width in CSS pixels */
  width: number
  /** Actual height in CSS pixels */
  height: number
  /** Device pixel ratio */
  dpr: number
}

/**
 * Create a canvas element with proper DPI scaling
 * @param container The container element
 * @param options Canvas options
 */
export function createCanvas(
  container: HTMLElement,
  options: CanvasOptions = {}
): CanvasResult {
  const {
    width = 0,
    height = 0,
    scaleForDPI = true,
    className = '',
  } = options

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2D rendering context')
  }

  if (className) {
    canvas.className = className
  }

  const rect = container.getBoundingClientRect()
  const actualWidth = width || rect.width
  const actualHeight = height || rect.height
  const dpr = scaleForDPI ? (window.devicePixelRatio || 1) : 1

  // Set canvas size in memory (scaled for DPI)
  canvas.width = actualWidth * dpr
  canvas.height = actualHeight * dpr

  // Set display size
  canvas.style.width = `${actualWidth}px`
  canvas.style.height = `${actualHeight}px`
  canvas.style.display = 'block'

  // Scale context for DPI
  ctx.scale(dpr, dpr)

  return {
    canvas,
    ctx,
    width: actualWidth,
    height: actualHeight,
    dpr,
  }
}

/**
 * Resize a canvas while preserving content
 * @param canvas The canvas to resize
 * @param width New width in CSS pixels
 * @param height New height in CSS pixels
 * @param scaleForDPI Whether to scale for high-DPI displays
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  scaleForDPI = true
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = scaleForDPI ? (window.devicePixelRatio || 1) : 1

  // Store the current content
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  // Resize canvas
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  // Restore context settings
  ctx.scale(dpr, dpr)

  // Optionally restore content (may be distorted if sizes differ significantly)
  ctx.putImageData(imageData, 0, 0)
}

/**
 * Clear a canvas
 * @param ctx The rendering context
 * @param width Canvas width in CSS pixels
 * @param height Canvas height in CSS pixels
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height)
}

/**
 * Fill a canvas with a color
 * @param ctx The rendering context
 * @param width Canvas width in CSS pixels
 * @param height Canvas height in CSS pixels
 * @param color Fill color
 */
export function fillCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

/**
 * Draw a rectangle
 * @param ctx The rendering context
 * @param x X coordinate
 * @param y Y coordinate
 * @param width Rectangle width
 * @param height Rectangle height
 * @param fill Fill color (optional)
 * @param stroke Stroke color (optional)
 * @param strokeWidth Stroke width (optional)
 */
export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill?: string,
  stroke?: string,
  strokeWidth = 1
): void {
  if (fill) {
    ctx.fillStyle = fill
    ctx.fillRect(x, y, width, height)
  }

  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.strokeRect(x, y, width, height)
  }
}

/**
 * Draw a rounded rectangle
 * @param ctx The rendering context
 * @param x X coordinate
 * @param y Y coordinate
 * @param width Rectangle width
 * @param height Rectangle height
 * @param radius Corner radius
 * @param fill Fill color (optional)
 * @param stroke Stroke color (optional)
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill?: string,
  stroke?: string
): void {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)

  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }

  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}

/**
 * Draw a line
 * @param ctx The rendering context
 * @param x1 Start X coordinate
 * @param y1 Start Y coordinate
 * @param x2 End X coordinate
 * @param y2 End Y coordinate
 * @param color Line color
 * @param width Line width
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 1
): void {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

/**
 * Draw text
 * @param ctx The rendering context
 * @param text Text to draw
 * @param x X coordinate
 * @param y Y coordinate
 * @param options Text options
 */
export interface TextOptions {
  font?: string
  color?: string
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
  maxWidth?: number
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: TextOptions = {}
): void {
  const {
    font = '14px sans-serif',
    color = '#000',
    align = 'left',
    baseline = 'alphabetic',
    maxWidth,
  } = options

  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = baseline

  if (maxWidth !== undefined) {
    ctx.fillText(text, x, y, maxWidth)
  } else {
    ctx.fillText(text, x, y)
  }
}

/**
 * Draw a circle
 * @param ctx The rendering context
 * @param x Center X coordinate
 * @param y Center Y coordinate
 * @param radius Circle radius
 * @param fill Fill color (optional)
 * @param stroke Stroke color (optional)
 * @param strokeWidth Stroke width (optional)
 */
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill?: string,
  stroke?: string,
  strokeWidth = 1
): void {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)

  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }

  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.stroke()
  }
}

/**
 * Save and restore context state around a function
 * @param ctx The rendering context
 * @param fn Function to execute with saved state
 */
export function withContextState(
  ctx: CanvasRenderingContext2D,
  fn: () => void
): void {
  ctx.save()
  try {
    fn()
  } finally {
    ctx.restore()
  }
}

/**
 * Apply a transform and execute a function
 * @param ctx The rendering context
 * @param transform Transform parameters
 * @param fn Function to execute with transform
 */
export interface Transform {
  translateX?: number
  translateY?: number
  scaleX?: number
  scaleY?: number
  rotate?: number
}

export function withTransform(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  fn: () => void
): void {
  withContextState(ctx, () => {
    if (transform.translateX !== undefined || transform.translateY !== undefined) {
      ctx.translate(transform.translateX || 0, transform.translateY || 0)
    }

    if (transform.rotate !== undefined) {
      ctx.rotate(transform.rotate)
    }

    if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
      ctx.scale(transform.scaleX || 1, transform.scaleY || 1)
    }

    fn()
  })
}

/**
 * Calculate the dimensions needed for an array visualization
 * @param arrayLength Number of elements
 * @param canvasWidth Available width
 * @param canvasHeight Available height
 * @param padding Padding around the visualization
 * @param gap Gap between bars
 */
export interface BarDimensions {
  barWidth: number
  maxBarHeight: number
  startX: number
  startY: number
}

export function calculateBarDimensions(
  arrayLength: number,
  canvasWidth: number,
  canvasHeight: number,
  padding = 20,
  gap = 2
): BarDimensions {
  const availableWidth = canvasWidth - padding * 2
  const availableHeight = canvasHeight - padding * 2

  const totalGapWidth = gap * (arrayLength - 1)
  const barWidth = Math.max(1, (availableWidth - totalGapWidth) / arrayLength)

  return {
    barWidth,
    maxBarHeight: availableHeight,
    startX: padding,
    startY: padding,
  }
}

/**
 * Draw an array as vertical bars
 * @param ctx The rendering context
 * @param array Array of values (normalized 0-1)
 * @param dimensions Bar dimensions
 * @param getColor Function to get color for each bar
 * @param gap Gap between bars
 */
export function drawBars(
  ctx: CanvasRenderingContext2D,
  array: number[],
  dimensions: BarDimensions,
  getColor: (value: number, index: number) => string,
  gap = 2
): void {
  const { barWidth, maxBarHeight, startX, startY } = dimensions

  for (let i = 0; i < array.length; i++) {
    const value = array[i]!
    const barHeight = value * maxBarHeight
    const x = startX + i * (barWidth + gap)
    const y = startY + maxBarHeight - barHeight
    const color = getColor(value, i)

    drawRect(ctx, x, y, barWidth, barHeight, color)
  }
}

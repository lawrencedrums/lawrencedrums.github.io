/**
 * Animation utility functions and helpers
 */

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number

/**
 * Common easing functions
 */
export const Easing = {
  /** Linear - no easing */
  linear: (t: number): number => t,

  /** Ease in quad - accelerate from zero */
  easeInQuad: (t: number): number => t * t,

  /** Ease out quad - decelerate to zero */
  easeOutQuad: (t: number): number => t * (2 - t),

  /** Ease in-out quad - accelerate then decelerate */
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  /** Ease in cubic */
  easeInCubic: (t: number): number => t * t * t,

  /** Ease out cubic */
  easeOutCubic: (t: number): number => --t * t * t + 1,

  /** Ease in-out cubic */
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  /** Ease in elastic - elastic bounce at start */
  easeInElastic: (t: number): number => {
    if (t === 0 || t === 1) return t
    const p = 0.3
    const s = p / 4
    return -Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - s) * (2 * Math.PI)) / p)
  },

  /** Ease out elastic - elastic bounce at end */
  easeOutElastic: (t: number): number => {
    if (t === 0 || t === 1) return t
    const p = 0.3
    const s = p / 4
    return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
  },

  /** Ease out bounce */
  easeOutBounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  },
} as const

/**
 * Animation frame callback type
 */
export type AnimationFrameCallback = (progress: number, elapsed: number) => boolean | void

/**
 * Options for animation loop
 */
export interface AnimationLoopOptions {
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Easing function to apply */
  easing?: EasingFunction
  /** Callback when animation completes */
  onComplete?: () => void
}

/**
 * Create an animation loop using requestAnimationFrame
 * @param callback Called each frame with progress (0-1) and elapsed time
 * @param options Animation options
 * @returns Function to cancel the animation
 */
export function animate(
  callback: AnimationFrameCallback,
  options: AnimationLoopOptions = {}
): () => void {
  const {
    duration = 1000,
    easing = Easing.linear,
    onComplete,
  } = options

  let animationId: number | null = null
  let startTime: number | null = null
  let cancelled = false

  const tick = (timestamp: number): void => {
    if (cancelled) return

    if (startTime === null) {
      startTime = timestamp
    }

    const elapsed = timestamp - startTime
    const rawProgress = Math.min(elapsed / duration, 1)
    const progress = easing(rawProgress)

    const shouldContinue = callback(progress, elapsed)

    if (rawProgress < 1 && shouldContinue !== false) {
      animationId = requestAnimationFrame(tick)
    } else {
      onComplete?.()
    }
  }

  animationId = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
  }
}

/**
 * Sleep for a specified duration
 * @param ms Duration in milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create a cancellable delay
 * @param ms Duration in milliseconds
 * @returns Object with promise and cancel function
 */
export function cancellableDelay(ms: number): {
  promise: Promise<boolean>
  cancel: () => void
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let resolve: ((cancelled: boolean) => void) | null = null

  const promise = new Promise<boolean>(r => {
    resolve = r
    timeoutId = setTimeout(() => r(false), ms)
  })

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    resolve?.(true)
  }

  return { promise, cancel }
}

/**
 * Interpolate between two values
 * @param start Start value
 * @param end End value
 * @param progress Progress (0-1)
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

/**
 * Interpolate between two points
 * @param start Start point
 * @param end End point
 * @param progress Progress (0-1)
 */
export function lerpPoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  progress: number
): { x: number; y: number } {
  return {
    x: lerp(start.x, end.x, progress),
    y: lerp(start.y, end.y, progress),
  }
}

/**
 * Create an animation frame scheduler that maintains consistent timing
 * @param targetFPS Target frames per second (default: 60)
 */
export function createFrameScheduler(targetFPS = 60): {
  schedule: (callback: () => void) => void
  cancel: () => void
} {
  const frameInterval = 1000 / targetFPS
  let lastFrameTime = 0
  let animationId: number | null = null
  let scheduledCallback: (() => void) | null = null

  const tick = (timestamp: number): void => {
    const elapsed = timestamp - lastFrameTime

    if (elapsed >= frameInterval && scheduledCallback) {
      lastFrameTime = timestamp - (elapsed % frameInterval)
      scheduledCallback()
    }

    if (scheduledCallback) {
      animationId = requestAnimationFrame(tick)
    }
  }

  return {
    schedule: (callback: () => void) => {
      scheduledCallback = callback
      if (animationId === null) {
        animationId = requestAnimationFrame(tick)
      }
    },
    cancel: () => {
      scheduledCallback = null
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    },
  }
}

/**
 * Create a throttled function that runs at most once per animation frame
 * @param fn Function to throttle
 */
export function throttleRAF<T extends (...args: unknown[]) => void>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null
  let latestArgs: Parameters<T> | null = null

  return (...args: Parameters<T>): void => {
    latestArgs = args

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (latestArgs !== null) {
          fn(...latestArgs)
        }
      })
    }
  }
}

/**
 * Create a debounced function
 * @param fn Function to debounce
 * @param ms Debounce delay in milliseconds
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, ms)
  }
}

/**
 * Spring animation parameters
 */
export interface SpringConfig {
  /** Stiffness (higher = faster) */
  stiffness: number
  /** Damping (higher = less oscillation) */
  damping: number
  /** Mass (higher = more inertia) */
  mass: number
}

/**
 * Default spring configurations
 */
export const SpringPresets = {
  /** Gentle spring */
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  /** Wobbly spring */
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  /** Stiff spring */
  stiff: { stiffness: 210, damping: 20, mass: 1 },
  /** Slow spring */
  slow: { stiffness: 280, damping: 60, mass: 1 },
} as const

/**
 * Calculate spring animation value
 * @param current Current value
 * @param target Target value
 * @param velocity Current velocity
 * @param config Spring configuration
 * @param deltaTime Time since last update in seconds
 */
export function spring(
  current: number,
  target: number,
  velocity: number,
  config: SpringConfig,
  deltaTime: number
): { value: number; velocity: number } {
  const { stiffness, damping, mass } = config

  const displacement = current - target
  const springForce = -stiffness * displacement
  const dampingForce = -damping * velocity
  const acceleration = (springForce + dampingForce) / mass

  const newVelocity = velocity + acceleration * deltaTime
  const newValue = current + newVelocity * deltaTime

  return { value: newValue, velocity: newVelocity }
}

/**
 * Check if spring animation has settled
 * @param current Current value
 * @param target Target value
 * @param velocity Current velocity
 * @param threshold Threshold for considering settled
 */
export function isSpringSettled(
  current: number,
  target: number,
  velocity: number,
  threshold = 0.01
): boolean {
  return Math.abs(current - target) < threshold && Math.abs(velocity) < threshold
}

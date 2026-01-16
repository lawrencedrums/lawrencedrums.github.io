/**
 * Core types and interfaces for the visualization system
 */

/**
 * Base configuration interface that all visualizations can extend
 */
export interface BaseVisualizationConfig {
  /** Canvas width in pixels (0 = auto-fit container) */
  width: number
  /** Canvas height in pixels (0 = auto-fit container) */
  height: number
  /** Background color of the canvas */
  backgroundColor: string
  /** Whether to show performance metrics */
  showMetrics: boolean
}

/**
 * Metadata for a registered visualization
 */
export interface VisualizationMetadata {
  /** Unique identifier for the visualization */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** Category for grouping (e.g., 'sorting', 'pathfinding', 'graph') */
  category: string
  /** Optional thumbnail URL or data URI */
  thumbnail?: string
  /** Tags for filtering and search */
  tags?: string[]
  /** Difficulty/complexity indicator (1-5) */
  difficulty?: number
}

/**
 * State of the visualization playback
 */
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed'

/**
 * Animation step that can be queued and played back
 */
export interface AnimationStep<T = unknown> {
  /** Type of action to perform */
  action: string
  /** Data associated with this step */
  data: T
  /** Optional duration override in milliseconds */
  duration?: number
  /** Optional description for debugging/display */
  description?: string
}

/**
 * Performance metrics tracked during visualization
 */
export interface PerformanceMetrics {
  /** Number of comparison operations */
  comparisons: number
  /** Number of swap/move operations */
  swaps: number
  /** Number of array accesses */
  arrayAccesses: number
  /** Start timestamp */
  startTime: number
  /** End timestamp (0 if not completed) */
  endTime: number
  /** Total animation steps executed */
  stepsExecuted: number
}

/**
 * Events emitted by visualizations
 */
export interface VisualizationEvents {
  /** Fired when playback state changes */
  stateChange: (state: PlaybackState) => void
  /** Fired when an animation step completes */
  stepComplete: (step: AnimationStep, index: number) => void
  /** Fired when all animation steps complete */
  complete: (metrics: PerformanceMetrics) => void
  /** Fired when visualization is reset */
  reset: () => void
  /** Fired on error */
  error: (error: Error) => void
}

/**
 * Speed preset for animation playback
 */
export interface SpeedPreset {
  name: string
  delayMs: number
}

/**
 * Default speed presets
 */
export const DEFAULT_SPEED_PRESETS: SpeedPreset[] = [
  { name: 'Slow', delayMs: 200 },
  { name: 'Normal', delayMs: 100 },
  { name: 'Fast', delayMs: 50 },
  { name: 'Very Fast', delayMs: 20 },
  { name: 'Instant', delayMs: 1 },
]

/**
 * Configuration for the animation controller
 */
export interface AnimationConfig {
  /** Delay between animation steps in milliseconds */
  stepDelay: number
  /** Whether to pause between major phases */
  pauseBetweenPhases: boolean
  /** Speed presets available */
  speedPresets: SpeedPreset[]
}

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  stepDelay: 100,
  pauseBetweenPhases: false,
  speedPresets: DEFAULT_SPEED_PRESETS,
}

/**
 * Default base visualization configuration
 */
export const DEFAULT_BASE_CONFIG: BaseVisualizationConfig = {
  width: 0,
  height: 400,
  backgroundColor: 'var(--color-canvas-bg)',
  showMetrics: true,
}

/**
 * Types and interfaces for the sorting visualization module
 */

import type { BaseVisualizationConfig, AnimationStep } from '../core/types'

/**
 * Configuration for the sorting visualizer
 */
export interface SortingConfig extends BaseVisualizationConfig {
  /** Number of elements in the array */
  arraySize: number
  /** Minimum value in array */
  minValue: number
  /** Maximum value in array */
  maxValue: number
  /** Gap between bars in pixels */
  barGap: number
  /** Padding around visualization in pixels */
  padding: number
  /** Whether to show array values on bars */
  showValues: boolean
}

/**
 * Default sorting configuration
 */
export const DEFAULT_SORTING_CONFIG: SortingConfig = {
  width: 0,
  height: 400,
  backgroundColor: '#1e1e2e',
  showMetrics: true,
  arraySize: 50,
  minValue: 5,
  maxValue: 100,
  barGap: 2,
  padding: 20,
  showValues: false,
}

/**
 * Actions that can be performed in a sorting step
 */
export type SortingAction =
  | 'compare'
  | 'swap'
  | 'set'
  | 'mark-sorted'
  | 'mark-pivot'
  | 'mark-range'
  | 'clear-marks'
  | 'complete'

/**
 * Data for a sorting animation step
 */
export interface SortingStepData {
  /** Array state after this step */
  array: number[]
  /** Indices being compared */
  comparing?: [number, number]
  /** Indices being swapped */
  swapping?: [number, number]
  /** Index being set to a new value */
  setting?: { index: number; value: number }
  /** Indices that are now sorted */
  sorted?: number[]
  /** Index of pivot element */
  pivot?: number
  /** Range being processed [start, end] */
  range?: [number, number]
}

/**
 * A sorting animation step
 */
export type SortingStep = AnimationStep<SortingStepData>

/**
 * Metadata about a sorting algorithm
 */
export interface SortingAlgorithmInfo {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Brief description */
  description: string
  /** Time complexity (worst case) */
  timeComplexity: string
  /** Space complexity */
  spaceComplexity: string
  /** Whether the algorithm is stable */
  stable: boolean
  /** Difficulty level (1-5) */
  difficulty: number
}

/**
 * Result of running a sorting algorithm
 */
export interface SortingResult {
  /** Generated animation steps */
  steps: SortingStep[]
  /** Final sorted array */
  sortedArray: number[]
  /** Number of comparisons made */
  comparisons: number
  /** Number of swaps/moves made */
  swaps: number
  /** Number of array accesses */
  arrayAccesses: number
}

/**
 * Interface for sorting algorithm implementations
 */
export interface SortingAlgorithm {
  /** Algorithm metadata */
  readonly info: SortingAlgorithmInfo
  /**
   * Generate sorting steps for the given array
   * @param array The array to sort (will be copied, not mutated)
   * @returns The sorting result with all animation steps
   */
  sort(array: number[]): SortingResult
}

/**
 * Bar state for rendering
 */
export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'range'

/**
 * Bar data for rendering
 */
export interface Bar {
  value: number
  state: BarState
}

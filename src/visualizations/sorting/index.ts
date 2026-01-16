/**
 * Sorting visualization module exports
 *
 * This module provides:
 * - SortingVisualizer: Main visualization class for sorting algorithms
 * - Sorting algorithms: BubbleSort, SelectionSort, InsertionSort, QuickSort
 * - Types and interfaces for the sorting system
 */

// Main visualizer
export { SortingVisualizer } from './SortingVisualizer'

// Algorithms
export {
  BubbleSort,
  SelectionSort,
  InsertionSort,
  QuickSort,
  SORTING_ALGORITHMS,
  getAlgorithmById,
} from './algorithms'

// Types
export type {
  SortingConfig,
  SortingAction,
  SortingStepData,
  SortingStep,
  SortingAlgorithmInfo,
  SortingResult,
  SortingAlgorithm,
  BarState,
  Bar,
} from './types'

export { DEFAULT_SORTING_CONFIG } from './types'

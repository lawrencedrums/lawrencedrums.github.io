/**
 * Sorting visualization module exports
 *
 * This module provides:
 * - SortingVisualizer: Main visualization class for sorting algorithms
 * - Sorting algorithms: BubbleSort, SelectionSort, InsertionSort, QuickSort
 * - Types and interfaces for the sorting system
 */

import { VisualizationRegistry } from '../core'
import { SortingVisualizer } from './SortingVisualizer'
import type { SortingConfig } from './types'

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

/**
 * Register SortingVisualizer with the visualization registry
 * This allows the visualization to be discovered and instantiated via the registry
 */
VisualizationRegistry.register(
  {
    id: 'sorting-visualizer',
    name: 'Sorting Visualizer',
    description: 'Visualize sorting algorithms step by step with interactive controls',
    category: 'sorting',
    tags: ['sorting', 'algorithms', 'comparison', 'interactive'],
    difficulty: 1,
  },
  (config?: Partial<SortingConfig>) => new SortingVisualizer(config)
)

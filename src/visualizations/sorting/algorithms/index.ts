/**
 * Sorting algorithms module exports
 *
 * Each algorithm implements the SortingAlgorithm interface and generates
 * animation steps that can be played back by the SortingVisualizer.
 */

export { BubbleSort } from './BubbleSort'
export { SelectionSort } from './SelectionSort'
export { InsertionSort } from './InsertionSort'
export { QuickSort } from './QuickSort'

import { BubbleSort } from './BubbleSort'
import { SelectionSort } from './SelectionSort'
import { InsertionSort } from './InsertionSort'
import { QuickSort } from './QuickSort'
import type { SortingAlgorithm } from '../types'

/**
 * All available sorting algorithms
 */
export const SORTING_ALGORITHMS: SortingAlgorithm[] = [
  BubbleSort,
  SelectionSort,
  InsertionSort,
  QuickSort,
]

/**
 * Get a sorting algorithm by ID
 */
export function getAlgorithmById(id: string): SortingAlgorithm | undefined {
  return SORTING_ALGORITHMS.find(algo => algo.info.id === id)
}

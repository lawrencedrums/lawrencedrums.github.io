/**
 * Quick Sort Algorithm
 *
 * An efficient, divide-and-conquer sorting algorithm. It works by selecting
 * a 'pivot' element and partitioning the array around the pivot so that
 * elements less than pivot come before it, and elements greater come after.
 *
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n) - due to recursion stack
 * Stable: No
 */

import type { SortingAlgorithm, SortingAlgorithmInfo, SortingResult, SortingStep } from '../types'

const info: SortingAlgorithmInfo = {
  id: 'quick-sort',
  name: 'Quick Sort',
  description: 'Divides array around a pivot, recursively sorting the partitions',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(log n)',
  stable: false,
  difficulty: 3,
}

/**
 * Generate sorting steps using Quick Sort algorithm
 */
function sort(inputArray: number[]): SortingResult {
  const array = [...inputArray]
  const n = array.length
  const steps: SortingStep[] = []
  const sorted: number[] = []

  let comparisons = 0
  let swaps = 0
  let arrayAccesses = 0

  /**
   * Partition the array around a pivot (last element)
   * Returns the final index of the pivot
   */
  function partition(low: number, high: number): number {
    const pivot = array[high]!
    arrayAccesses++

    // Mark pivot and range
    steps.push({
      action: 'mark-pivot',
      data: {
        array: [...array],
        pivot: high,
        range: [low, high],
        sorted: [...sorted],
      },
      description: `Pivot selected at index ${high} (value: ${pivot})`,
    })

    let i = low - 1

    for (let j = low; j < high; j++) {
      arrayAccesses++
      comparisons++

      steps.push({
        action: 'compare',
        data: {
          array: [...array],
          comparing: [j, high],
          pivot: high,
          range: [low, high],
          sorted: [...sorted],
        },
        description: `Compare element at index ${j} with pivot`,
      })

      if (array[j]! <= pivot) {
        i++

        if (i !== j) {
          // Swap elements
          const temp = array[i]!
          array[i] = array[j]!
          array[j] = temp
          swaps++
          arrayAccesses += 2

          steps.push({
            action: 'swap',
            data: {
              array: [...array],
              swapping: [i, j],
              pivot: high,
              range: [low, high],
              sorted: [...sorted],
            },
            description: `Swap elements at index ${i} and ${j}`,
          })
        }
      }
    }

    // Place pivot in its correct position
    const pivotIndex = i + 1

    if (pivotIndex !== high) {
      const temp = array[pivotIndex]!
      array[pivotIndex] = array[high]!
      array[high] = temp
      swaps++
      arrayAccesses += 2

      steps.push({
        action: 'swap',
        data: {
          array: [...array],
          swapping: [pivotIndex, high],
          range: [low, high],
          sorted: [...sorted],
        },
        description: `Place pivot at its correct position (index ${pivotIndex})`,
      })
    }

    // Mark pivot as sorted
    sorted.push(pivotIndex)

    steps.push({
      action: 'mark-sorted',
      data: {
        array: [...array],
        sorted: [...sorted],
      },
      description: `Element at index ${pivotIndex} is now in its final position`,
    })

    return pivotIndex
  }

  /**
   * Recursively sort the array
   */
  function quickSort(low: number, high: number): void {
    if (low < high) {
      // Mark the range being processed
      steps.push({
        action: 'mark-range',
        data: {
          array: [...array],
          range: [low, high],
          sorted: [...sorted],
        },
        description: `Processing subarray [${low}, ${high}]`,
      })

      const pivotIndex = partition(low, high)

      // Recursively sort elements before and after partition
      quickSort(low, pivotIndex - 1)
      quickSort(pivotIndex + 1, high)
    } else if (low === high && !sorted.includes(low)) {
      // Single element is already sorted
      sorted.push(low)

      steps.push({
        action: 'mark-sorted',
        data: {
          array: [...array],
          sorted: [...sorted],
        },
        description: `Single element at index ${low} is sorted`,
      })
    }
  }

  // Start quicksort
  if (n > 0) {
    quickSort(0, n - 1)
  }

  // Final completion step
  steps.push({
    action: 'complete',
    data: {
      array: [...array],
      sorted: Array.from({ length: n }, (_, i) => i),
    },
    description: 'Sorting complete!',
  })

  return {
    steps,
    sortedArray: array,
    comparisons,
    swaps,
    arrayAccesses,
  }
}

export const QuickSort: SortingAlgorithm = {
  info,
  sort,
}

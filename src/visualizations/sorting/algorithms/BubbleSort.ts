/**
 * Bubble Sort Algorithm
 *
 * A simple comparison-based sorting algorithm that repeatedly steps through
 * the list, compares adjacent elements, and swaps them if they are in the
 * wrong order.
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * Stable: Yes
 */

import type { SortingAlgorithm, SortingAlgorithmInfo, SortingResult, SortingStep } from '../types'

const info: SortingAlgorithmInfo = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  description: 'Repeatedly swaps adjacent elements if they are in the wrong order',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: true,
  difficulty: 1,
}

/**
 * Generate sorting steps using Bubble Sort algorithm
 */
function sort(inputArray: number[]): SortingResult {
  const array = [...inputArray]
  const n = array.length
  const steps: SortingStep[] = []
  const sorted: number[] = []

  let comparisons = 0
  let swaps = 0
  let arrayAccesses = 0

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      arrayAccesses += 2
      comparisons++

      steps.push({
        action: 'compare',
        data: {
          array: [...array],
          comparing: [j, j + 1],
          sorted: [...sorted],
        },
        description: `Compare elements at index ${j} and ${j + 1}`,
      })

      if (array[j]! > array[j + 1]!) {
        // Swap elements
        const temp = array[j]!
        array[j] = array[j + 1]!
        array[j + 1] = temp
        swapped = true
        swaps++
        arrayAccesses += 2

        steps.push({
          action: 'swap',
          data: {
            array: [...array],
            swapping: [j, j + 1],
            sorted: [...sorted],
          },
          description: `Swap elements at index ${j} and ${j + 1}`,
        })
      }
    }

    // Mark the last unsorted element as sorted
    sorted.push(n - i - 1)

    steps.push({
      action: 'mark-sorted',
      data: {
        array: [...array],
        sorted: [...sorted],
      },
      description: `Element at index ${n - i - 1} is now in its final position`,
    })

    // If no swaps occurred, array is already sorted
    if (!swapped) {
      // Mark all remaining elements as sorted
      for (let k = 0; k < n - i - 1; k++) {
        if (!sorted.includes(k)) {
          sorted.push(k)
        }
      }
      break
    }
  }

  // Mark the first element as sorted (it's in place by default)
  if (!sorted.includes(0)) {
    sorted.push(0)
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

export const BubbleSort: SortingAlgorithm = {
  info,
  sort,
}

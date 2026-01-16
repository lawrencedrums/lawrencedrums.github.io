/**
 * Selection Sort Algorithm
 *
 * A simple comparison-based sorting algorithm that divides the input into
 * a sorted and unsorted region. It repeatedly selects the smallest element
 * from the unsorted region and moves it to the sorted region.
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * Stable: No
 */

import type { SortingAlgorithm, SortingAlgorithmInfo, SortingResult, SortingStep } from '../types'

const info: SortingAlgorithmInfo = {
  id: 'selection-sort',
  name: 'Selection Sort',
  description: 'Repeatedly finds the minimum element and moves it to the sorted portion',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: false,
  difficulty: 1,
}

/**
 * Generate sorting steps using Selection Sort algorithm
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
    let minIndex = i
    arrayAccesses++

    // Mark the current range being processed
    steps.push({
      action: 'mark-range',
      data: {
        array: [...array],
        range: [i, n - 1],
        sorted: [...sorted],
      },
      description: `Finding minimum in range [${i}, ${n - 1}]`,
    })

    // Find minimum element in unsorted portion
    for (let j = i + 1; j < n; j++) {
      arrayAccesses += 2
      comparisons++

      steps.push({
        action: 'compare',
        data: {
          array: [...array],
          comparing: [minIndex, j],
          range: [i, n - 1],
          sorted: [...sorted],
        },
        description: `Compare current minimum (index ${minIndex}) with element at index ${j}`,
      })

      if (array[j]! < array[minIndex]!) {
        minIndex = j
      }
    }

    // Swap minimum with first unsorted element
    if (minIndex !== i) {
      const temp = array[i]!
      array[i] = array[minIndex]!
      array[minIndex] = temp
      swaps++
      arrayAccesses += 2

      steps.push({
        action: 'swap',
        data: {
          array: [...array],
          swapping: [i, minIndex],
          sorted: [...sorted],
        },
        description: `Swap minimum element at index ${minIndex} with index ${i}`,
      })
    }

    // Mark current position as sorted
    sorted.push(i)

    steps.push({
      action: 'mark-sorted',
      data: {
        array: [...array],
        sorted: [...sorted],
      },
      description: `Element at index ${i} is now in its final position`,
    })
  }

  // Mark the last element as sorted
  sorted.push(n - 1)

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

export const SelectionSort: SortingAlgorithm = {
  info,
  sort,
}

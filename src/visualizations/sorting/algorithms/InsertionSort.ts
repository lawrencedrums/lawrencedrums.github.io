/**
 * Insertion Sort Algorithm
 *
 * A simple sorting algorithm that builds the final sorted array one item
 * at a time. It iterates through the input, growing the sorted portion
 * by inserting each element in its correct position.
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * Stable: Yes
 */

import type { SortingAlgorithm, SortingAlgorithmInfo, SortingResult, SortingStep } from '../types'

const info: SortingAlgorithmInfo = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  description: 'Builds the sorted array one element at a time by inserting each in its correct position',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: true,
  difficulty: 1,
}

/**
 * Generate sorting steps using Insertion Sort algorithm
 */
function sort(inputArray: number[]): SortingResult {
  const array = [...inputArray]
  const n = array.length
  const steps: SortingStep[] = []
  const sorted: number[] = [0] // First element is considered sorted

  let comparisons = 0
  let swaps = 0
  let arrayAccesses = 0

  // Initial state - first element is sorted
  steps.push({
    action: 'mark-sorted',
    data: {
      array: [...array],
      sorted: [...sorted],
    },
    description: 'First element is trivially sorted',
  })

  for (let i = 1; i < n; i++) {
    const key = array[i]!
    arrayAccesses++
    let j = i - 1

    // Show the key being inserted
    steps.push({
      action: 'mark-pivot',
      data: {
        array: [...array],
        pivot: i,
        sorted: [...sorted],
      },
      description: `Insert element at index ${i} (value: ${key}) into sorted portion`,
    })

    // Move elements greater than key one position ahead
    while (j >= 0) {
      arrayAccesses++
      comparisons++

      steps.push({
        action: 'compare',
        data: {
          array: [...array],
          comparing: [j, i],
          pivot: i,
          sorted: [...sorted],
        },
        description: `Compare element at index ${j} with key (${key})`,
      })

      if (array[j]! > key) {
        array[j + 1] = array[j]!
        arrayAccesses++
        swaps++

        steps.push({
          action: 'set',
          data: {
            array: [...array],
            setting: { index: j + 1, value: array[j + 1]! },
            pivot: i,
            sorted: [...sorted],
          },
          description: `Move element from index ${j} to index ${j + 1}`,
        })

        j--
      } else {
        break
      }
    }

    // Insert key at correct position
    array[j + 1] = key
    arrayAccesses++

    steps.push({
      action: 'set',
      data: {
        array: [...array],
        setting: { index: j + 1, value: key },
        sorted: [...sorted],
      },
      description: `Insert key at index ${j + 1}`,
    })

    // Mark the sorted portion
    sorted.push(i)

    steps.push({
      action: 'mark-sorted',
      data: {
        array: [...array],
        sorted: [...sorted],
      },
      description: `Sorted portion now includes indices 0 to ${i}`,
    })
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

export const InsertionSort: SortingAlgorithm = {
  info,
  sort,
}

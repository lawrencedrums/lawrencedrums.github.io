/**
 * Sorting Visualizer
 *
 * A visualization for sorting algorithms that displays an array as vertical
 * bars and animates the sorting process step by step.
 */

import { Visualization } from '../core/Visualization'
import type { VisualizationMetadata } from '../core/types'
import type {
  SortingConfig,
  SortingStep,
  SortingStepData,
  SortingAlgorithm,
  Bar,
  BarState,
} from './types'
import { DEFAULT_SORTING_CONFIG } from './types'
import { BubbleSort, SORTING_ALGORITHMS } from './algorithms'
import { VIZ_COLORS } from '../../utils/colors'

/**
 * Color mapping for bar states
 */
const BAR_COLORS: Record<BarState, string> = {
  default: VIZ_COLORS.barDefault,
  comparing: VIZ_COLORS.barActive,
  swapping: '#f59e0b',
  sorted: VIZ_COLORS.barSorted,
  pivot: VIZ_COLORS.barPivot,
  range: '#8b5cf6',
}

/**
 * Sorting Visualizer class
 */
export class SortingVisualizer extends Visualization<SortingConfig, SortingStepData> {
  /** Current array of values */
  private array: number[] = []

  /** Current bar states for rendering */
  private bars: Bar[] = []

  /** Indices that are sorted */
  private sortedIndices: Set<number> = new Set()

  /** Currently active algorithm */
  private algorithm: SortingAlgorithm = BubbleSort

  /** Max value in array (for scaling) */
  private maxValue: number = 100

  constructor(config?: Partial<SortingConfig>) {
    super(config)
  }

  /**
   * Merge config with defaults
   */
  protected mergeConfig(config?: Partial<SortingConfig>): SortingConfig {
    return {
      ...DEFAULT_SORTING_CONFIG,
      ...config,
    }
  }

  /**
   * Get metadata for this visualization
   */
  getMetadata(): VisualizationMetadata {
    return {
      id: 'sorting-visualizer',
      name: 'Sorting Visualizer',
      description: 'Visualize sorting algorithms step by step',
      category: 'sorting',
      tags: ['sorting', 'algorithms', 'comparison'],
      difficulty: 1,
    }
  }

  /**
   * Initialize the visualization with a random array
   */
  initialize(): void {
    this.generateRandomArray()
    this.sortedIndices.clear()
    this.updateBars()
  }

  /**
   * Generate a random array
   */
  generateRandomArray(): void {
    const { arraySize, minValue, maxValue } = this.config
    this.array = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
    )
    this.maxValue = Math.max(...this.array)
    this.sortedIndices.clear()
    this.updateBars()
    this.render()
  }

  /**
   * Set a specific array
   */
  setArray(array: number[]): void {
    this.array = [...array]
    this.maxValue = Math.max(...this.array)
    this.sortedIndices.clear()
    this.updateBars()
    this.render()
  }

  /**
   * Get current array
   */
  getArray(): number[] {
    return [...this.array]
  }

  /**
   * Set the sorting algorithm
   */
  setAlgorithm(algorithm: SortingAlgorithm): void {
    this.algorithm = algorithm
  }

  /**
   * Set algorithm by ID
   */
  setAlgorithmById(id: string): boolean {
    const algo = SORTING_ALGORITHMS.find(a => a.info.id === id)
    if (algo) {
      this.algorithm = algo
      return true
    }
    return false
  }

  /**
   * Get current algorithm
   */
  getAlgorithm(): SortingAlgorithm {
    return this.algorithm
  }

  /**
   * Get all available algorithms
   */
  static getAvailableAlgorithms(): SortingAlgorithm[] {
    return SORTING_ALGORITHMS
  }

  /**
   * Generate animation steps using the current algorithm
   */
  generateSteps(): SortingStep[] {
    const result = this.algorithm.sort(this.array)
    return result.steps
  }

  /**
   * Render a single animation step
   */
  renderStep(step: SortingStep): void {
    const { action, data } = step

    // Update metrics based on step action
    this.updateMetricsFromStep(action, data)

    // Update array state
    this.array = [...data.array]

    // Update sorted indices
    if (data.sorted) {
      this.sortedIndices = new Set(data.sorted)
    }

    // Update bar states based on step action
    this.updateBarsFromStep(step)

    // Render the current state
    this.render()
  }

  /**
   * Update performance metrics based on step action
   */
  private updateMetricsFromStep(action: string, data: SortingStepData): void {
    switch (action) {
      case 'compare':
        this.metrics.comparisons++
        // Reading 2 elements to compare
        this.metrics.arrayAccesses += 2
        break

      case 'swap':
        this.metrics.swaps++
        // Reading 2 elements and writing 2 elements
        this.metrics.arrayAccesses += 4
        break

      case 'set':
        // Writing 1 element
        this.metrics.arrayAccesses++
        if (data.setting) {
          // Reading 1 element (the value being set)
          this.metrics.arrayAccesses++
        }
        break
    }
  }

  /**
   * Update bar states from a step
   */
  private updateBarsFromStep(step: SortingStep): void {
    const { action, data } = step

    // Reset all bars to default or sorted
    this.bars = this.array.map((value, index) => ({
      value,
      state: this.sortedIndices.has(index) ? 'sorted' : 'default',
    }))

    // Apply step-specific states
    switch (action) {
      case 'compare':
        if (data.comparing) {
          const [i, j] = data.comparing
          if (this.bars[i]) this.bars[i].state = 'comparing'
          if (this.bars[j]) this.bars[j].state = 'comparing'
        }
        break

      case 'swap':
        if (data.swapping) {
          const [i, j] = data.swapping
          if (this.bars[i]) this.bars[i].state = 'swapping'
          if (this.bars[j]) this.bars[j].state = 'swapping'
        }
        break

      case 'set':
        if (data.setting) {
          const { index } = data.setting
          if (this.bars[index]) this.bars[index].state = 'swapping'
        }
        break

      case 'mark-pivot':
        if (data.pivot !== undefined) {
          const bar = this.bars[data.pivot]
          if (bar) bar.state = 'pivot'
        }
        break

      case 'mark-range':
        if (data.range) {
          const [start, end] = data.range
          for (let i = start; i <= end; i++) {
            const bar = this.bars[i]
            if (bar && !this.sortedIndices.has(i)) {
              bar.state = 'range'
            }
          }
        }
        break

      case 'mark-sorted':
      case 'complete':
        // States already set above
        break

      case 'clear-marks':
        // Already reset above
        break
    }

    // Pivot takes precedence over range
    if (data.pivot !== undefined) {
      const pivotBar = this.bars[data.pivot]
      if (pivotBar) pivotBar.state = 'pivot'
    }
  }

  /**
   * Update bars array from current array state
   */
  private updateBars(): void {
    this.bars = this.array.map((value, index) => ({
      value,
      state: this.sortedIndices.has(index) ? 'sorted' : 'default',
    }))
  }

  /**
   * Render the current visualization state
   */
  render(): void {
    if (!this.ctx) return

    const { width, height } = this.getCanvasDimensions()
    const { padding, barGap, showValues } = this.config

    // Clear and fill background
    this.clearCanvas()
    this.fillBackground()

    // Calculate bar dimensions
    const availableWidth = width - padding * 2
    const availableHeight = height - padding * 2
    const n = this.bars.length

    if (n === 0) return

    const totalGapWidth = barGap * (n - 1)
    const barWidth = Math.max(1, (availableWidth - totalGapWidth) / n)

    // Draw bars
    for (let i = 0; i < n; i++) {
      const bar = this.bars[i]
      if (!bar) continue

      const normalizedValue = bar.value / this.maxValue
      const barHeight = normalizedValue * availableHeight
      const x = padding + i * (barWidth + barGap)
      const y = padding + availableHeight - barHeight

      // Get color based on state
      const color = BAR_COLORS[bar.state]

      // Draw bar
      this.ctx.fillStyle = color
      this.ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value text if enabled and bars are wide enough
      if (showValues && barWidth >= 20) {
        this.ctx.fillStyle = '#ffffff'
        this.ctx.font = '10px sans-serif'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'bottom'
        this.ctx.fillText(
          bar.value.toString(),
          x + barWidth / 2,
          y - 2
        )
      }
    }
  }

  /**
   * Reset the visualization
   */
  reset(): void {
    super.reset()
    this.sortedIndices.clear()
  }
}

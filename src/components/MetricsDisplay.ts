/**
 * Metrics Display Component
 *
 * Displays performance metrics for visualizations such as
 * comparisons, swaps, array accesses, and execution time.
 */

import type { PerformanceMetrics } from '../visualizations/core/types'

/**
 * Metrics display configuration
 */
export interface MetricsDisplayConfig {
  /** Show comparisons count */
  showComparisons: boolean
  /** Show swaps count */
  showSwaps: boolean
  /** Show array accesses count */
  showArrayAccesses: boolean
  /** Show execution time */
  showTime: boolean
  /** Show steps executed */
  showSteps: boolean
}

/**
 * Default metrics display configuration
 */
export const DEFAULT_METRICS_CONFIG: MetricsDisplayConfig = {
  showComparisons: true,
  showSwaps: true,
  showArrayAccesses: true,
  showTime: true,
  showSteps: true,
}

/**
 * Metrics Display Component
 */
export class MetricsDisplay {
  private container: HTMLElement
  private config: MetricsDisplayConfig
  private elements: Map<string, HTMLElement> = new Map()

  constructor(
    container: HTMLElement,
    config: Partial<MetricsDisplayConfig> = {}
  ) {
    this.container = container
    this.config = { ...DEFAULT_METRICS_CONFIG, ...config }
    this.render()
  }

  /**
   * Render the metrics display
   */
  private render(): void {
    this.container.innerHTML = ''
    this.container.className = 'metrics-display'

    const grid = document.createElement('div')
    grid.className = 'metrics-display__grid'

    if (this.config.showComparisons) {
      grid.appendChild(this.createMetric('comparisons', 'Comparisons', '0'))
    }

    if (this.config.showSwaps) {
      grid.appendChild(this.createMetric('swaps', 'Swaps', '0'))
    }

    if (this.config.showArrayAccesses) {
      grid.appendChild(this.createMetric('arrayAccesses', 'Array Accesses', '0'))
    }

    if (this.config.showSteps) {
      grid.appendChild(this.createMetric('steps', 'Steps', '0'))
    }

    if (this.config.showTime) {
      grid.appendChild(this.createMetric('time', 'Time', '0ms'))
    }

    this.container.appendChild(grid)
  }

  /**
   * Create a single metric element
   */
  private createMetric(id: string, label: string, initialValue: string): HTMLElement {
    const metric = document.createElement('div')
    metric.className = 'metrics-display__metric'

    const labelEl = document.createElement('span')
    labelEl.className = 'metrics-display__label'
    labelEl.textContent = label

    const valueEl = document.createElement('span')
    valueEl.className = 'metrics-display__value'
    valueEl.textContent = initialValue

    this.elements.set(id, valueEl)

    metric.appendChild(labelEl)
    metric.appendChild(valueEl)

    return metric
  }

  /**
   * Update metrics from performance data
   */
  update(metrics: PerformanceMetrics): void {
    this.setValue('comparisons', metrics.comparisons.toLocaleString())
    this.setValue('swaps', metrics.swaps.toLocaleString())
    this.setValue('arrayAccesses', metrics.arrayAccesses.toLocaleString())
    this.setValue('steps', metrics.stepsExecuted.toLocaleString())

    if (metrics.endTime > 0) {
      const time = (metrics.endTime - metrics.startTime).toFixed(0)
      this.setValue('time', `${time}ms`)
    } else if (metrics.startTime > 0) {
      const time = (performance.now() - metrics.startTime).toFixed(0)
      this.setValue('time', `${time}ms`)
    } else {
      this.setValue('time', '0ms')
    }
  }

  /**
   * Set a single metric value
   */
  private setValue(id: string, value: string): void {
    const element = this.elements.get(id)
    if (element) {
      element.textContent = value
    }
  }

  /**
   * Reset all metrics to zero
   */
  reset(): void {
    this.setValue('comparisons', '0')
    this.setValue('swaps', '0')
    this.setValue('arrayAccesses', '0')
    this.setValue('steps', '0')
    this.setValue('time', '0ms')
  }

  /**
   * Destroy the component
   */
  destroy(): void {
    this.container.innerHTML = ''
    this.elements.clear()
  }
}

/**
 * Get metrics display CSS styles
 */
export function getMetricsDisplayStyles(): string {
  return `
    .metrics-display {
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .metrics-display__grid {
      display: flex;
      gap: var(--space-lg);
      flex-wrap: wrap;
    }

    .metrics-display__metric {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .metrics-display__label {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metrics-display__value {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--color-text);
      font-variant-numeric: tabular-nums;
    }

    @media (max-width: 480px) {
      .metrics-display__grid {
        gap: var(--space-md);
      }

      .metrics-display__metric {
        flex: 1;
        min-width: 80px;
      }
    }
  `
}

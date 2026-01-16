/**
 * Registry for auto-discovery and management of visualizations
 *
 * Visualizations register themselves with this registry, allowing the
 * application to dynamically discover and instantiate them.
 */

import type { Visualization } from './Visualization'
import type { VisualizationMetadata, BaseVisualizationConfig } from './types'

/**
 * Factory function type for creating visualization instances
 */
export type VisualizationFactory<
  T extends Visualization = Visualization
> = (config?: Partial<BaseVisualizationConfig>) => T

/**
 * Registration entry combining metadata with factory
 */
export interface VisualizationRegistration {
  metadata: VisualizationMetadata
  factory: VisualizationFactory
}

/**
 * Filter options for querying visualizations
 */
export interface VisualizationFilter {
  /** Filter by category */
  category?: string
  /** Filter by tags (matches if any tag matches) */
  tags?: string[]
  /** Filter by difficulty level (matches if <= this value) */
  maxDifficulty?: number
  /** Filter by difficulty level (matches if >= this value) */
  minDifficulty?: number
  /** Search text (matches against name, description, tags) */
  search?: string
}

/**
 * Singleton registry for visualization management
 */
class VisualizationRegistryImpl {
  private registrations: Map<string, VisualizationRegistration> = new Map()
  private listeners: Set<(registrations: VisualizationRegistration[]) => void> = new Set()

  /**
   * Register a new visualization
   * @param metadata Visualization metadata
   * @param factory Factory function to create instances
   */
  register(metadata: VisualizationMetadata, factory: VisualizationFactory): void {
    if (this.registrations.has(metadata.id)) {
      console.warn(`Visualization "${metadata.id}" is already registered. Overwriting.`)
    }

    this.registrations.set(metadata.id, { metadata, factory })
    this.notifyListeners()
  }

  /**
   * Unregister a visualization
   * @param id Visualization ID
   */
  unregister(id: string): boolean {
    const deleted = this.registrations.delete(id)
    if (deleted) {
      this.notifyListeners()
    }
    return deleted
  }

  /**
   * Get a specific visualization registration by ID
   * @param id Visualization ID
   */
  get(id: string): VisualizationRegistration | undefined {
    return this.registrations.get(id)
  }

  /**
   * Create an instance of a visualization
   * @param id Visualization ID
   * @param config Optional configuration
   */
  create<T extends Visualization = Visualization>(
    id: string,
    config?: Partial<BaseVisualizationConfig>
  ): T | null {
    const registration = this.registrations.get(id)
    if (!registration) {
      console.error(`Visualization "${id}" not found in registry`)
      return null
    }
    return registration.factory(config) as T
  }

  /**
   * Get all registered visualizations
   */
  getAll(): VisualizationRegistration[] {
    return Array.from(this.registrations.values())
  }

  /**
   * Get all visualization metadata
   */
  getAllMetadata(): VisualizationMetadata[] {
    return this.getAll().map(r => r.metadata)
  }

  /**
   * Filter visualizations by criteria
   * @param filter Filter options
   */
  filter(filter: VisualizationFilter): VisualizationRegistration[] {
    return this.getAll().filter(registration => {
      const { metadata } = registration

      // Filter by category
      if (filter.category && metadata.category !== filter.category) {
        return false
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        const metadataTags = metadata.tags || []
        const hasMatchingTag = filter.tags.some(tag =>
          metadataTags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Filter by difficulty
      if (filter.minDifficulty !== undefined && metadata.difficulty !== undefined) {
        if (metadata.difficulty < filter.minDifficulty) {
          return false
        }
      }

      if (filter.maxDifficulty !== undefined && metadata.difficulty !== undefined) {
        if (metadata.difficulty > filter.maxDifficulty) {
          return false
        }
      }

      // Filter by search text
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const matchesName = metadata.name.toLowerCase().includes(searchLower)
        const matchesDescription = metadata.description.toLowerCase().includes(searchLower)
        const matchesTags = (metadata.tags || []).some(tag =>
          tag.toLowerCase().includes(searchLower)
        )

        if (!matchesName && !matchesDescription && !matchesTags) {
          return false
        }
      }

      return true
    })
  }

  /**
   * Get visualizations grouped by category
   */
  getByCategory(): Map<string, VisualizationRegistration[]> {
    const grouped = new Map<string, VisualizationRegistration[]>()

    for (const registration of this.registrations.values()) {
      const category = registration.metadata.category
      if (!grouped.has(category)) {
        grouped.set(category, [])
      }
      grouped.get(category)!.push(registration)
    }

    return grouped
  }

  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const categories = new Set<string>()
    for (const registration of this.registrations.values()) {
      categories.add(registration.metadata.category)
    }
    return Array.from(categories).sort()
  }

  /**
   * Get all unique tags across all visualizations
   */
  getAllTags(): string[] {
    const tags = new Set<string>()
    for (const registration of this.registrations.values()) {
      for (const tag of registration.metadata.tags || []) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort()
  }

  /**
   * Check if a visualization is registered
   * @param id Visualization ID
   */
  has(id: string): boolean {
    return this.registrations.has(id)
  }

  /**
   * Get the count of registered visualizations
   */
  get count(): number {
    return this.registrations.size
  }

  /**
   * Subscribe to registry changes
   * @param callback Function to call when registrations change
   */
  subscribe(callback: (registrations: VisualizationRegistration[]) => void): () => void {
    this.listeners.add(callback)
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Notify all listeners of registry changes
   */
  private notifyListeners(): void {
    const registrations = this.getAll()
    for (const listener of this.listeners) {
      try {
        listener(registrations)
      } catch (error) {
        console.error('Error in registry listener:', error)
      }
    }
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.registrations.clear()
    this.notifyListeners()
  }
}

/**
 * Singleton instance of the visualization registry
 */
export const VisualizationRegistry = new VisualizationRegistryImpl()

/**
 * Decorator for registering a visualization class
 * Note: Requires experimentalDecorators in tsconfig
 *
 * @example
 * ```typescript
 * @registerVisualization({
 *   id: 'bubble-sort',
 *   name: 'Bubble Sort',
 *   description: 'Simple comparison-based sorting algorithm',
 *   category: 'sorting',
 *   tags: ['sorting', 'comparison', 'simple'],
 *   difficulty: 1
 * })
 * class BubbleSortVisualization extends Visualization { ... }
 * ```
 */
export function registerVisualization(metadata: VisualizationMetadata) {
  return function <T extends new (config?: Partial<BaseVisualizationConfig>) => Visualization>(
    constructor: T
  ): T {
    VisualizationRegistry.register(metadata, (config) => new constructor(config))
    return constructor
  }
}

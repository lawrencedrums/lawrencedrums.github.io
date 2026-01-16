/**
 * Configuration manager for visualizations
 *
 * Provides type-safe configuration validation, merging, and persistence.
 */

import type { BaseVisualizationConfig } from './types'
import { DEFAULT_BASE_CONFIG } from './types'

/**
 * Configuration validation error
 */
export class ConfigValidationError extends Error {
  constructor(
    public readonly field: string,
    public readonly value: unknown,
    public readonly reason: string
  ) {
    super(`Invalid config value for "${field}": ${reason}`)
    this.name = 'ConfigValidationError'
  }
}

/**
 * Validation rule for a configuration field
 */
export interface ValidationRule<T> {
  /** Validation function, returns true if valid */
  validate: (value: T) => boolean
  /** Error message if validation fails */
  message: string
}

/**
 * Schema for validating configuration
 */
export type ConfigSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

/**
 * Base validation rules for common config fields
 */
export const BASE_CONFIG_SCHEMA: ConfigSchema<BaseVisualizationConfig> = {
  width: [
    {
      validate: (v) => typeof v === 'number' && v >= 0,
      message: 'Width must be a non-negative number',
    },
  ],
  height: [
    {
      validate: (v) => typeof v === 'number' && v >= 0,
      message: 'Height must be a non-negative number',
    },
  ],
  backgroundColor: [
    {
      validate: (v) => typeof v === 'string' && v.length > 0,
      message: 'Background color must be a non-empty string',
    },
  ],
  showMetrics: [
    {
      validate: (v) => typeof v === 'boolean',
      message: 'Show metrics must be a boolean',
    },
  ],
}

/**
 * Configuration manager for type-safe config handling
 */
export class ConfigManager<T extends BaseVisualizationConfig = BaseVisualizationConfig> {
  /** Storage key for persistence */
  private storageKey: string | null = null

  /** Default configuration values */
  private defaults: T

  /** Current configuration */
  private config: T

  /** Validation schema */
  private schema: ConfigSchema<T>

  /** Change listeners */
  private listeners: Set<(config: T, changedKeys: (keyof T)[]) => void> = new Set()

  constructor(
    defaults: T,
    schema: ConfigSchema<T> = {} as ConfigSchema<T>
  ) {
    this.defaults = { ...defaults }
    this.schema = { ...BASE_CONFIG_SCHEMA, ...schema } as ConfigSchema<T>
    this.config = { ...defaults }
  }

  /**
   * Enable localStorage persistence
   * @param key Storage key to use
   */
  enablePersistence(key: string): this {
    this.storageKey = key
    this.loadFromStorage()
    return this
  }

  /**
   * Disable localStorage persistence
   */
  disablePersistence(): this {
    this.storageKey = null
    return this
  }

  /**
   * Get the current configuration
   */
  get(): T {
    return { ...this.config }
  }

  /**
   * Get a specific configuration value
   * @param key The configuration key
   */
  getValue<K extends keyof T>(key: K): T[K] {
    return this.config[key]
  }

  /**
   * Set configuration values
   * @param values Partial configuration to merge
   * @param validate Whether to validate the values (default: true)
   */
  set(values: Partial<T>, validate = true): void {
    if (validate) {
      this.validate(values)
    }

    const changedKeys: (keyof T)[] = []

    for (const key of Object.keys(values) as (keyof T)[]) {
      if (this.config[key] !== values[key]) {
        changedKeys.push(key)
      }
    }

    this.config = { ...this.config, ...values }

    if (changedKeys.length > 0) {
      this.notifyListeners(changedKeys)
      this.saveToStorage()
    }
  }

  /**
   * Set a single configuration value
   * @param key The configuration key
   * @param value The new value
   */
  setValue<K extends keyof T>(key: K, value: T[K]): void {
    const partial: Partial<T> = {}
    partial[key] = value
    this.set(partial)
  }

  /**
   * Reset configuration to defaults
   */
  reset(): void {
    const changedKeys = Object.keys(this.config) as (keyof T)[]
    this.config = { ...this.defaults }
    this.notifyListeners(changedKeys)
    this.saveToStorage()
  }

  /**
   * Reset a specific key to its default value
   * @param key The configuration key
   */
  resetValue<K extends keyof T>(key: K): void {
    this.setValue(key, this.defaults[key])
  }

  /**
   * Get the default value for a key
   * @param key The configuration key
   */
  getDefault<K extends keyof T>(key: K): T[K] {
    return this.defaults[key]
  }

  /**
   * Get all default values
   */
  getDefaults(): T {
    return { ...this.defaults }
  }

  /**
   * Check if a key has been modified from its default
   * @param key The configuration key
   */
  isModified<K extends keyof T>(key: K): boolean {
    return this.config[key] !== this.defaults[key]
  }

  /**
   * Get all modified keys
   */
  getModifiedKeys(): (keyof T)[] {
    return (Object.keys(this.config) as (keyof T)[]).filter(key =>
      this.isModified(key)
    )
  }

  /**
   * Validate configuration values
   * @param values Values to validate
   * @throws ConfigValidationError if validation fails
   */
  validate(values: Partial<T>): void {
    for (const [key, value] of Object.entries(values)) {
      const rules = this.schema[key as keyof T]
      if (rules) {
        for (const rule of rules) {
          if (!rule.validate(value as T[keyof T])) {
            throw new ConfigValidationError(key, value, rule.message)
          }
        }
      }
    }
  }

  /**
   * Check if values are valid without throwing
   * @param values Values to check
   */
  isValid(values: Partial<T>): boolean {
    try {
      this.validate(values)
      return true
    } catch {
      return false
    }
  }

  /**
   * Merge configuration with new values
   * Returns a new config object without modifying the current one
   * @param values Values to merge
   */
  merge(values: Partial<T>): T {
    return { ...this.config, ...values }
  }

  /**
   * Subscribe to configuration changes
   * @param callback Function to call when config changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (config: T, changedKeys: (keyof T)[]) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Notify listeners of config changes
   */
  private notifyListeners(changedKeys: (keyof T)[]): void {
    const config = this.get()
    for (const listener of this.listeners) {
      try {
        listener(config, changedKeys)
      } catch (error) {
        console.error('Error in config listener:', error)
      }
    }
  }

  /**
   * Save current config to localStorage
   */
  private saveToStorage(): void {
    if (!this.storageKey) return

    try {
      const data = JSON.stringify(this.config)
      localStorage.setItem(this.storageKey, data)
    } catch (error) {
      console.warn('Failed to save config to localStorage:', error)
    }
  }

  /**
   * Load config from localStorage
   */
  private loadFromStorage(): void {
    if (!this.storageKey) return

    try {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        const parsed = JSON.parse(data) as Partial<T>
        // Only apply valid values, ignore invalid ones
        const validValues: Partial<T> = {}
        for (const [key, value] of Object.entries(parsed)) {
          const typedKey = key as keyof T
          if (typedKey in this.defaults) {
            try {
              this.validate({ [typedKey]: value } as Partial<T>)
              validValues[typedKey] = value as T[keyof T]
            } catch {
              // Skip invalid values
              console.warn(`Ignoring invalid stored value for "${key}"`)
            }
          }
        }
        this.config = { ...this.defaults, ...validValues }
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error)
    }
  }

  /**
   * Clear persisted config from localStorage
   */
  clearStorage(): void {
    if (!this.storageKey) return

    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.warn('Failed to clear config from localStorage:', error)
    }
  }

  /**
   * Create a derived config manager with additional schema
   * @param additionalDefaults Additional default values
   * @param additionalSchema Additional validation rules
   */
  extend<U extends object>(
    additionalDefaults: U,
    additionalSchema: ConfigSchema<U> = {} as ConfigSchema<U>
  ): ConfigManager<T & U> {
    return new ConfigManager(
      { ...this.defaults, ...additionalDefaults },
      { ...this.schema, ...additionalSchema } as ConfigSchema<T & U>
    )
  }
}

/**
 * Create a config manager with defaults
 */
export function createConfigManager<T extends BaseVisualizationConfig>(
  defaults: T,
  schema?: ConfigSchema<T>
): ConfigManager<T> {
  return new ConfigManager(
    { ...DEFAULT_BASE_CONFIG, ...defaults },
    schema
  )
}

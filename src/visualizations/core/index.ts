/**
 * Core visualization module exports
 *
 * This module provides the foundation for building visualizations:
 * - Visualization: Abstract base class for all visualizations
 * - VisualizationRegistry: Auto-discovery system for visualizations
 * - AnimationController: Playback control for visualizations
 * - ConfigManager: Type-safe configuration management
 */

// Base class
export { Visualization } from './Visualization'

// Registry
export {
  VisualizationRegistry,
  registerVisualization,
  type VisualizationFactory,
  type VisualizationRegistration,
  type VisualizationFilter,
} from './VisualizationRegistry'

// Animation controller
export {
  AnimationController,
  type AnimationControllerEvents,
} from './AnimationController'

// Configuration manager
export {
  ConfigManager,
  ConfigValidationError,
  createConfigManager,
  BASE_CONFIG_SCHEMA,
  type ValidationRule,
  type ConfigSchema,
} from './ConfigManager'

// Types
export {
  type BaseVisualizationConfig,
  type VisualizationMetadata,
  type PlaybackState,
  type AnimationStep,
  type PerformanceMetrics,
  type VisualizationEvents,
  type SpeedPreset,
  type AnimationConfig,
  DEFAULT_SPEED_PRESETS,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_BASE_CONFIG,
} from './types'

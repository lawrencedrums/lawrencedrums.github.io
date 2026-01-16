/**
 * Utility module exports
 *
 * This module provides shared utilities for visualizations:
 * - Canvas utilities for rendering
 * - Color utilities for generating and manipulating colors
 * - Animation utilities for smooth animations
 */

// Canvas utilities
export {
  createCanvas,
  resizeCanvas,
  clearCanvas,
  fillCanvas,
  drawRect,
  drawRoundedRect,
  drawLine,
  drawText,
  drawCircle,
  withContextState,
  withTransform,
  calculateBarDimensions,
  drawBars,
  type CanvasOptions,
  type CanvasResult,
  type TextOptions,
  type Transform,
  type BarDimensions,
} from './canvas'

// Color utilities
export {
  hslToRgb,
  rgbToHsl,
  hexToRgb,
  rgbToHex,
  hsl,
  hsla,
  rgb,
  rgba,
  valueToHue,
  valueToColor,
  interpolateColors,
  parseColor,
  lighten,
  darken,
  saturate,
  getContrastingTextColor,
  PALETTES,
  VIZ_COLORS,
  type RGB,
  type RGBA,
  type HSL,
  type HSLA,
} from './colors'

// Animation utilities
export {
  animate,
  sleep,
  cancellableDelay,
  lerp,
  lerpPoint,
  createFrameScheduler,
  throttleRAF,
  debounce,
  spring,
  isSpringSettled,
  Easing,
  SpringPresets,
  type EasingFunction,
  type AnimationFrameCallback,
  type AnimationLoopOptions,
  type SpringConfig,
} from './animation'

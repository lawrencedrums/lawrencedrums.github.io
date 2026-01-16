/**
 * Animation controller for managing visualization playback
 *
 * Provides play, pause, step, and speed control functionality
 * that can be connected to any visualization.
 */

import type { Visualization } from './Visualization'
import type { AnimationConfig, PlaybackState, SpeedPreset } from './types'
import { DEFAULT_ANIMATION_CONFIG } from './types'

/**
 * Events emitted by the animation controller
 */
export interface AnimationControllerEvents {
  speedChange: (delayMs: number) => void
  tick: (stepIndex: number, totalSteps: number) => void
}

/**
 * Controller for managing visualization animation playback
 */
export class AnimationController {
  /** The visualization being controlled */
  private visualization: Visualization | null = null

  /** Animation configuration */
  private config: AnimationConfig

  /** Current step delay in milliseconds */
  private stepDelay: number

  /** Timeout ID for the animation loop */
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  /** Whether the animation is currently running */
  private isRunning = false

  /** Event listeners */
  private eventListeners: Map<keyof AnimationControllerEvents, Set<AnimationControllerEvents[keyof AnimationControllerEvents]>> = new Map()

  constructor(config?: Partial<AnimationConfig>) {
    this.config = { ...DEFAULT_ANIMATION_CONFIG, ...config }
    this.stepDelay = this.config.stepDelay
  }

  /**
   * Attach a visualization to this controller
   * @param visualization The visualization to control
   */
  attach(visualization: Visualization): void {
    // Detach any existing visualization
    if (this.visualization) {
      this.detach()
    }

    this.visualization = visualization

    // Listen to visualization state changes
    this.visualization.on('stateChange', this.handleStateChange)
    this.visualization.on('reset', this.handleReset)
  }

  /**
   * Detach the current visualization
   */
  detach(): void {
    if (!this.visualization) return

    this.stop()
    this.visualization.off('stateChange', this.handleStateChange)
    this.visualization.off('reset', this.handleReset)
    this.visualization = null
  }

  /**
   * Handle visualization state changes
   */
  private handleStateChange = (state: PlaybackState): void => {
    if (state === 'playing' && !this.isRunning) {
      this.startLoop()
    } else if (state !== 'playing' && this.isRunning) {
      this.stopLoop()
    }
  }

  /**
   * Handle visualization reset
   */
  private handleReset = (): void => {
    this.stop()
  }

  /**
   * Start playback
   */
  async play(): Promise<void> {
    if (!this.visualization) {
      console.warn('No visualization attached to controller')
      return
    }

    await this.visualization.start()
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.visualization) return
    this.visualization.pause()
  }

  /**
   * Resume paused playback
   */
  resume(): void {
    if (!this.visualization) return
    this.visualization.resume()
  }

  /**
   * Toggle between play and pause
   */
  togglePlayPause(): void {
    if (!this.visualization) return

    const state = this.visualization.getState()
    if (state === 'playing') {
      this.pause()
    } else if (state === 'paused') {
      this.resume()
    } else {
      this.play()
    }
  }

  /**
   * Execute a single step
   */
  step(): void {
    if (!this.visualization) return
    this.visualization.step()
  }

  /**
   * Stop and reset
   */
  stop(): void {
    this.stopLoop()
    if (this.visualization) {
      this.visualization.reset()
    }
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    if (!this.visualization) return
    this.visualization.reset()
  }

  /**
   * Set the animation speed (delay between steps)
   * @param delayMs Delay in milliseconds
   */
  setSpeed(delayMs: number): void {
    this.stepDelay = Math.max(1, delayMs)
    this.emit('speedChange', this.stepDelay)
  }

  /**
   * Get current speed (delay in ms)
   */
  getSpeed(): number {
    return this.stepDelay
  }

  /**
   * Set speed from a preset
   * @param preset Speed preset or preset name
   */
  setSpeedPreset(preset: SpeedPreset | string): void {
    const presetObj = typeof preset === 'string'
      ? this.config.speedPresets.find(p => p.name === preset)
      : preset

    if (presetObj) {
      this.setSpeed(presetObj.delayMs)
    } else {
      console.warn(`Speed preset "${preset}" not found`)
    }
  }

  /**
   * Get available speed presets
   */
  getSpeedPresets(): SpeedPreset[] {
    return [...this.config.speedPresets]
  }

  /**
   * Get the current speed preset (if matching one)
   */
  getCurrentSpeedPreset(): SpeedPreset | null {
    return this.config.speedPresets.find(p => p.delayMs === this.stepDelay) || null
  }

  /**
   * Increase speed (decrease delay)
   */
  speedUp(): void {
    const currentIndex = this.config.speedPresets.findIndex(p => p.delayMs === this.stepDelay)
    const nextPreset = this.config.speedPresets[currentIndex + 1]
    if (currentIndex >= 0 && currentIndex < this.config.speedPresets.length - 1 && nextPreset) {
      this.setSpeedPreset(nextPreset)
    } else {
      // Already at fastest preset, halve the delay
      this.setSpeed(Math.max(1, this.stepDelay / 2))
    }
  }

  /**
   * Decrease speed (increase delay)
   */
  slowDown(): void {
    const currentIndex = this.config.speedPresets.findIndex(p => p.delayMs === this.stepDelay)
    const prevPreset = this.config.speedPresets[currentIndex - 1]
    if (currentIndex > 0 && prevPreset) {
      this.setSpeedPreset(prevPreset)
    } else {
      // Already at slowest preset, double the delay
      this.setSpeed(this.stepDelay * 2)
    }
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    return this.visualization?.getState() || 'idle'
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.getState() === 'playing'
  }

  /**
   * Check if paused
   */
  isPaused(): boolean {
    return this.getState() === 'paused'
  }

  /**
   * Start the animation loop
   */
  private startLoop(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.tick()
  }

  /**
   * Stop the animation loop
   */
  private stopLoop(): void {
    this.isRunning = false
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  /**
   * Animation tick - executes one step and schedules the next
   */
  private tick = (): void => {
    if (!this.isRunning || !this.visualization) return

    const state = this.visualization.getState()
    if (state !== 'playing') {
      this.stopLoop()
      return
    }

    // Execute the step through visualization
    // The visualization handles its own step execution
    // We just need to schedule the next tick
    this.timeoutId = setTimeout(this.tick, this.stepDelay)
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof AnimationControllerEvents>(
    event: K,
    callback: AnimationControllerEvents[K]
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof AnimationControllerEvents>(
    event: K,
    callback: AnimationControllerEvents[K]
  ): void {
    this.eventListeners.get(event)?.delete(callback)
  }

  /**
   * Emit an event
   */
  private emit<K extends keyof AnimationControllerEvents>(
    event: K,
    ...args: Parameters<AnimationControllerEvents[K]>
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          (callback as (...args: Parameters<AnimationControllerEvents[K]>) => void)(...args)
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error)
        }
      })
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.detach()
    this.eventListeners.clear()
  }
}

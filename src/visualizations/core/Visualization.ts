/**
 * Abstract base class for all visualizations
 *
 * All visualization implementations should extend this class and implement
 * the abstract methods. This provides a consistent interface for the
 * visualization system.
 */

import type {
  BaseVisualizationConfig,
  PlaybackState,
  AnimationStep,
  PerformanceMetrics,
  VisualizationEvents,
  VisualizationMetadata,
} from './types'
import { DEFAULT_BASE_CONFIG } from './types'

type EventCallback<K extends keyof VisualizationEvents> = VisualizationEvents[K]

/**
 * Abstract base class that all visualizations must extend
 */
export abstract class Visualization<
  TConfig extends BaseVisualizationConfig = BaseVisualizationConfig,
  TStep = unknown
> {
  /** The canvas element for rendering */
  protected canvas: HTMLCanvasElement | null = null

  /** The 2D rendering context */
  protected ctx: CanvasRenderingContext2D | null = null

  /** Container element for the visualization */
  protected container: HTMLElement | null = null

  /** Current configuration */
  protected config: TConfig

  /** Current playback state */
  protected state: PlaybackState = 'idle'

  /** Queue of animation steps to execute */
  protected animationQueue: AnimationStep<TStep>[] = []

  /** Current position in the animation queue */
  protected currentStepIndex = 0

  /** Performance metrics */
  protected metrics: PerformanceMetrics = this.createEmptyMetrics()

  /** Event listeners */
  private eventListeners: Map<keyof VisualizationEvents, Set<EventCallback<keyof VisualizationEvents>>> = new Map()

  /** Animation frame request ID */
  protected animationFrameId: number | null = null

  /** Resize observer for responsive canvas */
  private resizeObserver: ResizeObserver | null = null

  constructor(config?: Partial<TConfig>) {
    this.config = this.mergeConfig(config)
  }

  /**
   * Get the metadata for this visualization
   * Must be implemented by subclasses
   */
  abstract getMetadata(): VisualizationMetadata

  /**
   * Initialize the visualization with data
   * Called after setup() and before start()
   */
  abstract initialize(): void

  /**
   * Generate animation steps from current data
   * Called when starting the visualization
   */
  abstract generateSteps(): AnimationStep<TStep>[]

  /**
   * Render a single animation step
   * @param step The step to render
   */
  abstract renderStep(step: AnimationStep<TStep>): void

  /**
   * Render the current state of the visualization
   * Called on each frame
   */
  abstract render(): void

  /**
   * Merge provided config with defaults
   * Override in subclasses to handle custom config
   */
  protected mergeConfig(config?: Partial<TConfig>): TConfig {
    return {
      ...DEFAULT_BASE_CONFIG,
      ...config,
    } as TConfig
  }

  /**
   * Create empty performance metrics
   */
  protected createEmptyMetrics(): PerformanceMetrics {
    return {
      comparisons: 0,
      swaps: 0,
      arrayAccesses: 0,
      startTime: 0,
      endTime: 0,
      stepsExecuted: 0,
    }
  }

  /**
   * Set up the visualization in the given container
   * @param container The container element to render into
   */
  setup(container: HTMLElement): void {
    this.container = container
    this.createCanvas()
    this.setupResizeObserver()
    this.initialize()
    this.render()
  }

  /**
   * Create and configure the canvas element
   */
  protected createCanvas(): void {
    if (!this.container) return

    this.canvas = document.createElement('canvas')
    this.canvas.style.display = 'block'
    this.canvas.style.width = '100%'
    this.canvas.style.height = this.config.height ? `${this.config.height}px` : '100%'

    this.ctx = this.canvas.getContext('2d')
    this.container.appendChild(this.canvas)

    this.resizeCanvas()
  }

  /**
   * Set up resize observer for responsive canvas
   */
  protected setupResizeObserver(): void {
    if (!this.container || !this.canvas) return

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas()
      this.render()
    })
    this.resizeObserver.observe(this.container)
  }

  /**
   * Resize canvas to match container dimensions
   */
  protected resizeCanvas(): void {
    if (!this.canvas || !this.container) return

    const rect = this.container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    // Set actual canvas size in memory (scaled for device pixel ratio)
    this.canvas.width = (this.config.width || rect.width) * dpr
    this.canvas.height = (this.config.height || rect.height) * dpr

    // Scale context to account for device pixel ratio
    if (this.ctx) {
      this.ctx.scale(dpr, dpr)
    }
  }

  /**
   * Start the visualization animation
   */
  async start(): Promise<void> {
    if (this.state === 'playing') return

    if (this.state === 'idle' || this.state === 'completed') {
      this.animationQueue = this.generateSteps()
      this.currentStepIndex = 0
      this.metrics = this.createEmptyMetrics()
      this.metrics.startTime = performance.now()
    }

    this.setState('playing')
  }

  /**
   * Pause the visualization
   */
  pause(): void {
    if (this.state !== 'playing') return
    this.setState('paused')
  }

  /**
   * Resume a paused visualization
   */
  resume(): void {
    if (this.state !== 'paused') return
    this.setState('playing')
  }

  /**
   * Execute a single step forward
   */
  step(): void {
    if (this.state === 'completed') return

    if (this.state === 'idle') {
      this.animationQueue = this.generateSteps()
      this.currentStepIndex = 0
      this.metrics = this.createEmptyMetrics()
      this.metrics.startTime = performance.now()
    }

    this.executeNextStep()
    this.setState('paused')
  }

  /**
   * Reset the visualization to initial state
   */
  reset(): void {
    this.cancelAnimation()
    this.animationQueue = []
    this.currentStepIndex = 0
    this.metrics = this.createEmptyMetrics()
    this.setState('idle')
    this.initialize()
    this.render()
    this.emit('reset')
  }

  /**
   * Execute the next step in the animation queue
   */
  protected executeNextStep(): void {
    if (this.currentStepIndex >= this.animationQueue.length) {
      this.onComplete()
      return
    }

    const step = this.animationQueue[this.currentStepIndex]
    if (!step) {
      this.onComplete()
      return
    }
    this.renderStep(step)
    this.metrics.stepsExecuted++
    this.emit('stepComplete', step, this.currentStepIndex)
    this.currentStepIndex++
  }

  /**
   * Called when all animation steps are complete
   */
  protected onComplete(): void {
    this.metrics.endTime = performance.now()
    this.setState('completed')
    this.emit('complete', this.metrics)
  }

  /**
   * Cancel any pending animation
   */
  protected cancelAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  /**
   * Set the playback state and emit event
   */
  protected setState(newState: PlaybackState): void {
    if (this.state === newState) return
    this.state = newState
    this.emit('stateChange', newState)
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    return this.state
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get current configuration
   */
  getConfig(): TConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TConfig>): void {
    this.config = this.mergeConfig({ ...this.config, ...config })
    if (this.state === 'idle') {
      this.render()
    }
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof VisualizationEvents>(
    event: K,
    callback: VisualizationEvents[K]
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback as EventCallback<keyof VisualizationEvents>)
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof VisualizationEvents>(
    event: K,
    callback: VisualizationEvents[K]
  ): void {
    this.eventListeners.get(event)?.delete(callback as EventCallback<keyof VisualizationEvents>)
  }

  /**
   * Emit an event to all listeners
   */
  protected emit<K extends keyof VisualizationEvents>(
    event: K,
    ...args: Parameters<VisualizationEvents[K]>
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          (callback as (...args: Parameters<VisualizationEvents[K]>) => void)(...args)
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error)
        }
      })
    }
  }

  /**
   * Get the canvas dimensions (accounting for device pixel ratio)
   */
  protected getCanvasDimensions(): { width: number; height: number } {
    if (!this.canvas || !this.container) {
      return { width: 0, height: 0 }
    }
    const rect = this.container.getBoundingClientRect()
    return {
      width: this.config.width || rect.width,
      height: this.config.height || rect.height,
    }
  }

  /**
   * Clear the canvas
   */
  protected clearCanvas(): void {
    if (!this.ctx || !this.canvas) return
    const { width, height } = this.getCanvasDimensions()
    this.ctx.clearRect(0, 0, width, height)
  }

  /**
   * Fill canvas with background color
   */
  protected fillBackground(): void {
    if (!this.ctx) return
    const { width, height } = this.getCanvasDimensions()
    this.ctx.fillStyle = this.config.backgroundColor
    this.ctx.fillRect(0, 0, width, height)
  }

  /**
   * Clean up resources when visualization is destroyed
   */
  destroy(): void {
    this.cancelAnimation()
    this.resizeObserver?.disconnect()
    this.eventListeners.clear()

    if (this.canvas && this.container) {
      this.container.removeChild(this.canvas)
    }

    this.canvas = null
    this.ctx = null
    this.container = null
  }
}

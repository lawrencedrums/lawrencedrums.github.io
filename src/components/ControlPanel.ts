/**
 * Control Panel Component
 *
 * A reusable UI component for controlling visualization playback.
 * Provides play/pause, step, reset, and speed controls.
 */

import type { PlaybackState, SpeedPreset } from '../visualizations/core/types'
import { DEFAULT_SPEED_PRESETS } from '../visualizations/core/types'

/**
 * Control panel configuration
 */
export interface ControlPanelConfig {
  /** Show play/pause button */
  showPlayPause: boolean
  /** Show step button */
  showStep: boolean
  /** Show reset button */
  showReset: boolean
  /** Show speed controls */
  showSpeed: boolean
  /** Available speed presets */
  speedPresets: SpeedPreset[]
  /** Initial speed preset index */
  initialSpeedIndex: number
}

/**
 * Default control panel configuration
 */
export const DEFAULT_CONTROL_PANEL_CONFIG: ControlPanelConfig = {
  showPlayPause: true,
  showStep: true,
  showReset: true,
  showSpeed: true,
  speedPresets: DEFAULT_SPEED_PRESETS,
  initialSpeedIndex: 1, // 'Normal'
}

/**
 * Control panel event callbacks
 */
export interface ControlPanelCallbacks {
  onPlay?: () => void
  onPause?: () => void
  onStep?: () => void
  onReset?: () => void
  onSpeedChange?: (preset: SpeedPreset) => void
}

/**
 * Control Panel Component
 */
export class ControlPanel {
  private container: HTMLElement
  private config: ControlPanelConfig
  private callbacks: ControlPanelCallbacks

  private playButton: HTMLButtonElement | null = null
  private stepButton: HTMLButtonElement | null = null
  private resetButton: HTMLButtonElement | null = null
  private speedSelect: HTMLSelectElement | null = null

  private currentState: PlaybackState = 'idle'
  private currentSpeedIndex: number

  constructor(
    container: HTMLElement,
    callbacks: ControlPanelCallbacks = {},
    config: Partial<ControlPanelConfig> = {}
  ) {
    this.container = container
    this.config = { ...DEFAULT_CONTROL_PANEL_CONFIG, ...config }
    this.callbacks = callbacks
    this.currentSpeedIndex = this.config.initialSpeedIndex

    this.render()
    this.attachEventListeners()
  }

  /**
   * Render the control panel
   */
  private render(): void {
    this.container.innerHTML = ''
    this.container.className = 'control-panel'

    const controls = document.createElement('div')
    controls.className = 'control-panel__controls'

    // Play/Pause button
    if (this.config.showPlayPause) {
      this.playButton = this.createButton('play', 'Play', 'control-panel__btn--primary')
      controls.appendChild(this.playButton)
    }

    // Step button
    if (this.config.showStep) {
      this.stepButton = this.createButton('step', 'Step', 'control-panel__btn--secondary')
      controls.appendChild(this.stepButton)
    }

    // Reset button
    if (this.config.showReset) {
      this.resetButton = this.createButton('reset', 'Reset', 'control-panel__btn--secondary')
      controls.appendChild(this.resetButton)
    }

    // Speed controls
    if (this.config.showSpeed) {
      const speedContainer = document.createElement('div')
      speedContainer.className = 'control-panel__speed'

      const speedLabel = document.createElement('label')
      speedLabel.className = 'control-panel__label'
      speedLabel.textContent = 'Speed:'
      speedLabel.htmlFor = 'speed-select'

      this.speedSelect = document.createElement('select')
      this.speedSelect.id = 'speed-select'
      this.speedSelect.className = 'control-panel__select'

      this.config.speedPresets.forEach((preset, index) => {
        const option = document.createElement('option')
        option.value = index.toString()
        option.textContent = preset.name
        option.selected = index === this.currentSpeedIndex
        this.speedSelect!.appendChild(option)
      })

      speedContainer.appendChild(speedLabel)
      speedContainer.appendChild(this.speedSelect)
      controls.appendChild(speedContainer)
    }

    this.container.appendChild(controls)
  }

  /**
   * Create a button element
   */
  private createButton(id: string, text: string, className: string): HTMLButtonElement {
    const button = document.createElement('button')
    button.id = `control-${id}`
    button.className = `control-panel__btn ${className}`
    button.textContent = text
    button.type = 'button'
    return button
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    this.playButton?.addEventListener('click', () => {
      if (this.currentState === 'playing') {
        this.callbacks.onPause?.()
      } else {
        this.callbacks.onPlay?.()
      }
    })

    this.stepButton?.addEventListener('click', () => {
      this.callbacks.onStep?.()
    })

    this.resetButton?.addEventListener('click', () => {
      this.callbacks.onReset?.()
    })

    this.speedSelect?.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement
      const index = parseInt(select.value, 10)
      this.currentSpeedIndex = index
      const preset = this.config.speedPresets[index]
      if (preset) {
        this.callbacks.onSpeedChange?.(preset)
      }
    })
  }

  /**
   * Update the control panel state
   */
  setState(state: PlaybackState): void {
    this.currentState = state

    if (this.playButton) {
      switch (state) {
        case 'playing':
          this.playButton.textContent = 'Pause'
          this.playButton.classList.remove('control-panel__btn--primary')
          this.playButton.classList.add('control-panel__btn--warning')
          break
        case 'paused':
          this.playButton.textContent = 'Resume'
          this.playButton.classList.remove('control-panel__btn--warning')
          this.playButton.classList.add('control-panel__btn--primary')
          break
        case 'completed':
          this.playButton.textContent = 'Replay'
          this.playButton.classList.remove('control-panel__btn--warning')
          this.playButton.classList.add('control-panel__btn--primary')
          break
        default:
          this.playButton.textContent = 'Play'
          this.playButton.classList.remove('control-panel__btn--warning')
          this.playButton.classList.add('control-panel__btn--primary')
      }
    }

    // Disable step during playback
    if (this.stepButton) {
      this.stepButton.disabled = state === 'playing'
    }
  }

  /**
   * Get current speed preset
   */
  getCurrentSpeedPreset(): SpeedPreset {
    return this.config.speedPresets[this.currentSpeedIndex] ?? this.config.speedPresets[0]!
  }

  /**
   * Set speed by preset index
   */
  setSpeed(index: number): void {
    if (index >= 0 && index < this.config.speedPresets.length) {
      this.currentSpeedIndex = index
      if (this.speedSelect) {
        this.speedSelect.value = index.toString()
      }
    }
  }

  /**
   * Enable/disable all controls
   */
  setEnabled(enabled: boolean): void {
    if (this.playButton) this.playButton.disabled = !enabled
    if (this.stepButton) this.stepButton.disabled = !enabled
    if (this.resetButton) this.resetButton.disabled = !enabled
    if (this.speedSelect) this.speedSelect.disabled = !enabled
  }

  /**
   * Destroy the control panel
   */
  destroy(): void {
    this.container.innerHTML = ''
  }
}

/**
 * Create control panel CSS styles
 */
export function getControlPanelStyles(): string {
  return `
    .control-panel {
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .control-panel__controls {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .control-panel__btn {
      padding: var(--space-sm) var(--space-lg);
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: var(--font-size-sm);
    }

    .control-panel__btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .control-panel__btn--primary {
      background: var(--color-primary);
      color: white;
    }

    .control-panel__btn--primary:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }

    .control-panel__btn--secondary {
      background: var(--color-surface-hover);
      color: var(--color-text);
    }

    .control-panel__btn--secondary:hover:not(:disabled) {
      background: var(--color-border);
    }

    .control-panel__btn--warning {
      background: #f59e0b;
      color: white;
    }

    .control-panel__btn--warning:hover:not(:disabled) {
      background: #d97706;
    }

    .control-panel__speed {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-left: auto;
    }

    .control-panel__label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    .control-panel__select {
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-surface-hover);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      cursor: pointer;
    }

    .control-panel__select:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  `
}

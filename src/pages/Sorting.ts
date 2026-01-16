/**
 * Sorting Visualizer Page
 *
 * Interactive page for visualizing sorting algorithms with controls
 * for algorithm selection, array configuration, and playback.
 */

import { SortingVisualizer, SORTING_ALGORITHMS } from '../visualizations/sorting'
import { AnimationController } from '../visualizations/core'
import { ControlPanel, getControlPanelStyles } from '../components/ControlPanel'
import { MetricsDisplay, getMetricsDisplayStyles } from '../components/MetricsDisplay'
import type { SortingAlgorithm } from '../visualizations/sorting'

/**
 * Inject component styles into the document
 */
function injectStyles(): void {
  const styleId = 'sorting-page-styles'
  if (document.getElementById(styleId)) return

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    ${getControlPanelStyles()}
    ${getMetricsDisplayStyles()}

    .sorting-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      padding: var(--space-lg) 0;
    }

    .sorting-page__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-md);
    }

    .sorting-page__title {
      margin: 0;
    }

    .sorting-page__back {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--font-size-sm);
    }

    .sorting-page__back:hover {
      color: var(--color-primary);
    }

    .sorting-page__canvas-container {
      background: var(--color-canvas-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      overflow: hidden;
      min-height: 400px;
    }

    .sorting-page__options {
      display: flex;
      gap: var(--space-lg);
      flex-wrap: wrap;
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .sorting-page__option {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .sorting-page__option label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .sorting-page__option select,
    .sorting-page__option input {
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-surface-hover);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text);
      font-size: var(--font-size-sm);
    }

    .sorting-page__option input[type="range"] {
      width: 150px;
    }

    .sorting-page__option-value {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      min-width: 40px;
      text-align: right;
    }

    .sorting-page__option-row {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .sorting-page__generate-btn {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-secondary);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: var(--font-size-sm);
      align-self: flex-end;
    }

    .sorting-page__generate-btn:hover {
      opacity: 0.9;
    }

    .sorting-page__info {
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .sorting-page__info h3 {
      margin: 0 0 var(--space-sm) 0;
      font-size: var(--font-size-md);
    }

    .sorting-page__info p {
      margin: 0 0 var(--space-sm) 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    .sorting-page__info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .sorting-page__info-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm);
    }

    .sorting-page__info-item span:first-child {
      color: var(--color-text-secondary);
    }

    .sorting-page__info-item span:last-child {
      font-weight: 500;
    }
  `
  document.head.appendChild(style)
}

/**
 * Create the Sorting Page
 */
export function SortingPage(): HTMLElement {
  injectStyles()

  // Create main container
  const container = document.createElement('div')
  container.className = 'container sorting-page'

  // State
  let visualizer: SortingVisualizer | null = null
  let controller: AnimationController | null = null
  let controlPanel: ControlPanel | null = null
  let metricsDisplay: MetricsDisplay | null = null
  let currentAlgorithm: SortingAlgorithm = SORTING_ALGORITHMS[0]!
  let arraySize = 50

  // Create header
  const header = document.createElement('div')
  header.className = 'sorting-page__header'
  header.innerHTML = `
    <h1 class="sorting-page__title">Sorting Visualizer</h1>
    <a href="#/" class="sorting-page__back">← Back to Home</a>
  `
  container.appendChild(header)

  // Create options panel
  const options = document.createElement('div')
  options.className = 'sorting-page__options'

  // Algorithm selector
  const algoOption = document.createElement('div')
  algoOption.className = 'sorting-page__option'
  algoOption.innerHTML = `<label for="algo-select">Algorithm</label>`

  const algoSelect = document.createElement('select')
  algoSelect.id = 'algo-select'
  SORTING_ALGORITHMS.forEach(algo => {
    const option = document.createElement('option')
    option.value = algo.info.id
    option.textContent = algo.info.name
    algoSelect.appendChild(option)
  })
  algoOption.appendChild(algoSelect)
  options.appendChild(algoOption)

  // Array size slider
  const sizeOption = document.createElement('div')
  sizeOption.className = 'sorting-page__option'
  sizeOption.innerHTML = `<label for="size-slider">Array Size</label>`

  const sizeRow = document.createElement('div')
  sizeRow.className = 'sorting-page__option-row'

  const sizeSlider = document.createElement('input')
  sizeSlider.type = 'range'
  sizeSlider.id = 'size-slider'
  sizeSlider.min = '10'
  sizeSlider.max = '200'
  sizeSlider.value = arraySize.toString()

  const sizeValue = document.createElement('span')
  sizeValue.className = 'sorting-page__option-value'
  sizeValue.textContent = arraySize.toString()

  sizeRow.appendChild(sizeSlider)
  sizeRow.appendChild(sizeValue)
  sizeOption.appendChild(sizeRow)
  options.appendChild(sizeOption)

  // Generate button
  const generateBtn = document.createElement('button')
  generateBtn.className = 'sorting-page__generate-btn'
  generateBtn.textContent = 'Generate New Array'
  generateBtn.type = 'button'
  options.appendChild(generateBtn)

  container.appendChild(options)

  // Create canvas container
  const canvasContainer = document.createElement('div')
  canvasContainer.className = 'sorting-page__canvas-container'
  container.appendChild(canvasContainer)

  // Create control panel container
  const controlContainer = document.createElement('div')
  container.appendChild(controlContainer)

  // Create metrics container
  const metricsContainer = document.createElement('div')
  container.appendChild(metricsContainer)

  // Create algorithm info section
  const infoSection = document.createElement('div')
  infoSection.className = 'sorting-page__info'
  container.appendChild(infoSection)

  /**
   * Update algorithm info display
   */
  function updateAlgorithmInfo(): void {
    const info = currentAlgorithm.info
    infoSection.innerHTML = `
      <h3>${info.name}</h3>
      <p>${info.description}</p>
      <div class="sorting-page__info-grid">
        <div class="sorting-page__info-item">
          <span>Time Complexity</span>
          <span>${info.timeComplexity}</span>
        </div>
        <div class="sorting-page__info-item">
          <span>Space Complexity</span>
          <span>${info.spaceComplexity}</span>
        </div>
        <div class="sorting-page__info-item">
          <span>Stable</span>
          <span>${info.stable ? 'Yes' : 'No'}</span>
        </div>
        <div class="sorting-page__info-item">
          <span>Difficulty</span>
          <span>${'★'.repeat(info.difficulty)}${'☆'.repeat(5 - info.difficulty)}</span>
        </div>
      </div>
    `
  }

  /**
   * Initialize the visualizer and controls
   */
  function initialize(): void {
    // Create visualizer
    visualizer = new SortingVisualizer({
      arraySize,
      height: 400,
    })

    visualizer.setup(canvasContainer)
    visualizer.setAlgorithm(currentAlgorithm)

    // Create animation controller
    controller = new AnimationController()
    controller.attach(visualizer)

    // Create control panel
    controlPanel = new ControlPanel(controlContainer, {
      onPlay: () => {
        if (visualizer?.getState() === 'completed') {
          visualizer.reset()
        }
        controller?.play()
      },
      onPause: () => controller?.pause(),
      onStep: () => visualizer?.step(),
      onReset: () => {
        visualizer?.reset()
        metricsDisplay?.reset()
      },
      onSpeedChange: (preset) => controller?.setSpeed(preset.delayMs),
    })

    // Create metrics display
    metricsDisplay = new MetricsDisplay(metricsContainer)

    // Listen to state changes
    visualizer.on('stateChange', (state) => {
      controlPanel?.setState(state)
    })

    // Listen to step completion for metrics updates
    visualizer.on('stepComplete', () => {
      if (visualizer) {
        metricsDisplay?.update(visualizer.getMetrics())
      }
    })

    // Listen to completion
    visualizer.on('complete', (metrics) => {
      metricsDisplay?.update(metrics)
    })

    // Update initial algorithm info
    updateAlgorithmInfo()
  }

  /**
   * Handle algorithm change
   */
  algoSelect.addEventListener('change', () => {
    const algo = SORTING_ALGORITHMS.find(a => a.info.id === algoSelect.value)
    if (algo) {
      currentAlgorithm = algo
      visualizer?.setAlgorithm(algo)
      visualizer?.reset()
      metricsDisplay?.reset()
      updateAlgorithmInfo()
    }
  })

  /**
   * Handle array size change
   */
  sizeSlider.addEventListener('input', () => {
    arraySize = parseInt(sizeSlider.value, 10)
    sizeValue.textContent = arraySize.toString()
  })

  sizeSlider.addEventListener('change', () => {
    if (visualizer) {
      visualizer.updateConfig({ arraySize })
      visualizer.reset()
      metricsDisplay?.reset()
    }
  })

  /**
   * Handle generate button
   */
  generateBtn.addEventListener('click', () => {
    visualizer?.generateRandomArray()
    metricsDisplay?.reset()
  })

  // Initialize after DOM is ready
  requestAnimationFrame(() => {
    initialize()
  })

  // Cleanup on navigation
  const cleanup = () => {
    visualizer?.destroy()
    controller?.destroy()
    controlPanel?.destroy()
    metricsDisplay?.destroy()
  }

  // Store cleanup function for router to call
  ;(container as HTMLElement & { cleanup?: () => void }).cleanup = cleanup

  return container
}

/**
 * Sorting Visualizer Page - Mobile First
 *
 * Interactive page for visualizing sorting algorithms with touch-friendly
 * controls and responsive vertical layout.
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
      gap: var(--space-md);
      padding: var(--space-md);
      max-width: var(--max-width-xl);
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .sorting-page {
        gap: var(--space-lg);
        padding: var(--space-lg);
      }
    }

    .sorting-page__header {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    @media (min-width: 768px) {
      .sorting-page__header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .sorting-page__title {
      font-size: var(--font-size-2xl);
      margin: 0;
    }

    @media (min-width: 768px) {
      .sorting-page__title {
        font-size: var(--font-size-3xl);
      }
    }

    .sorting-page__back {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--font-size-sm);
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .sorting-page__back:hover {
      color: var(--color-primary);
    }

    .sorting-page__canvas-container {
      background: var(--color-canvas-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      overflow: hidden;
      min-height: 250px;
      width: 100%;
      transition: none;
    }

    @media (min-width: 768px) {
      .sorting-page__canvas-container {
        min-height: 400px;
      }
    }

    .sorting-page__options {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    @media (min-width: 768px) {
      .sorting-page__options {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-end;
      }
    }

    .sorting-page__option {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      flex: 1;
      min-width: 0;
    }

    @media (min-width: 768px) {
      .sorting-page__option {
        flex: 0 0 auto;
        min-width: 180px;
      }
    }

    .sorting-page__option label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
    }

    .sorting-page__option select,
    .sorting-page__option input[type="text"],
    .sorting-page__option input[type="number"] {
      width: 100%;
    }

    .sorting-page__option input[type="range"] {
      width: 100%;
      margin: 0;
    }

    .sorting-page__option-value {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      min-width: 40px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    .sorting-page__option-row {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .sorting-page__generate-btn {
      width: 100%;
      min-height: var(--touch-target-min);
    }

    @media (min-width: 768px) {
      .sorting-page__generate-btn {
        width: auto;
      }
    }

    .sorting-page__info {
      padding: var(--space-md);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .sorting-page__info h3 {
      margin: 0 0 var(--space-sm) 0;
      font-size: var(--font-size-lg);
    }

    .sorting-page__info p {
      margin: 0 0 var(--space-md) 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }

    .sorting-page__info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }

    @media (min-width: 480px) {
      .sorting-page__info-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 768px) {
      .sorting-page__info-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .sorting-page__info-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm);
      padding: var(--space-xs) 0;
      border-bottom: 1px solid var(--color-border);
    }

    @media (min-width: 768px) {
      .sorting-page__info-item {
        flex-direction: column;
        gap: var(--space-xs);
        border-bottom: none;
        text-align: center;
      }
    }

    .sorting-page__info-item span:first-child {
      color: var(--color-text-secondary);
    }

    .sorting-page__info-item span:last-child {
      font-weight: var(--font-weight-medium);
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
  container.className = 'sorting-page'

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
    <a href="#/" class="sorting-page__back">
      <span aria-hidden="true">←</span> Back to Home
    </a>
    <h1 class="sorting-page__title">Sorting Visualizer</h1>
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
  SORTING_ALGORITHMS.forEach((algo) => {
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
  sizeSlider.style.flex = '1'

  const sizeValue = document.createElement('span')
  sizeValue.className = 'sorting-page__option-value'
  sizeValue.textContent = arraySize.toString()

  sizeRow.appendChild(sizeSlider)
  sizeRow.appendChild(sizeValue)
  sizeOption.appendChild(sizeRow)
  options.appendChild(sizeOption)

  // Generate button
  const generateBtn = document.createElement('button')
  generateBtn.className = 'btn-secondary sorting-page__generate-btn'
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
    // Responsive canvas height
    const isMobile = window.innerWidth < 768
    const canvasHeight = isMobile ? 250 : 400

    // Create visualizer
    visualizer = new SortingVisualizer({
      arraySize,
      height: canvasHeight,
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

    // Handle window resize
    const handleResize = (): void => {
      const newIsMobile = window.innerWidth < 768
      const newHeight = newIsMobile ? 250 : 400
      if (visualizer) {
        visualizer.updateConfig({ height: newHeight })
      }
    }

    window.addEventListener('resize', handleResize)

    // Store resize handler for cleanup
    ;(container as HTMLElement & { _resizeHandler?: () => void })._resizeHandler = handleResize
  }

  /**
   * Handle algorithm change
   */
  algoSelect.addEventListener('change', () => {
    const algo = SORTING_ALGORITHMS.find((a) => a.info.id === algoSelect.value)
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
  const cleanup = (): void => {
    const resizeHandler = (container as HTMLElement & { _resizeHandler?: () => void })
      ._resizeHandler
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
    visualizer?.destroy()
    controller?.destroy()
    controlPanel?.destroy()
    metricsDisplay?.destroy()
  }

  // Store cleanup function for router to call
  ;(container as HTMLElement & { cleanup?: () => void }).cleanup = cleanup

  return container
}

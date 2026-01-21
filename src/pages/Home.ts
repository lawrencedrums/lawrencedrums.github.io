/**
 * Home Page - Landing & Gallery
 *
 * Mobile-first landing page with hero section and visualization gallery.
 * Auto-populates visualizations from the registry.
 */

import { VisualizationRegistry } from '../visualizations/core/VisualizationRegistry'
import type { VisualizationMetadata } from '../visualizations/core/types'

/**
 * Category icons mapping
 */
const categoryIcons: Record<string, string> = {
  sorting: '📊',
  pathfinding: '🗺️',
  'data-structures': '🌳',
  graphs: '🔗',
  default: '✨',
}

/**
 * Coming soon visualizations
 */
const comingSoonItems = [
  {
    id: 'pathfinding',
    name: 'Pathfinding',
    description: 'A*, Dijkstra, BFS, DFS algorithms visualized on a grid',
    category: 'pathfinding',
    difficulty: 2,
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Trees, Heaps, Graphs, and more visualized interactively',
    category: 'data-structures',
    difficulty: 3,
  },
]

/**
 * Renders difficulty stars
 */
function renderDifficulty(level: number): string {
  const filled = '★'.repeat(level)
  const empty = '☆'.repeat(5 - level)
  return `<span class="difficulty" aria-label="Difficulty ${level} of 5">${filled}${empty}</span>`
}

/**
 * Creates a visualization card
 */
function createVisualizationCard(
  metadata: VisualizationMetadata,
  isComingSoon = false
): HTMLElement {
  const card = document.createElement('article')
  card.className = `card ${isComingSoon ? '' : 'card-clickable'}`

  if (isComingSoon) {
    card.style.opacity = '0.6'
  }

  const icon = categoryIcons[metadata.category] || categoryIcons.default

  card.innerHTML = `
    <div class="card-thumbnail">${icon}</div>
    <h3>${metadata.name}</h3>
    <p>${metadata.description}</p>
    <div class="card-footer">
      <div class="tags">
        ${metadata.tags?.map((tag) => `<span class="tag">${tag}</span>`).join('') || ''}
      </div>
      ${metadata.difficulty ? renderDifficulty(metadata.difficulty) : ''}
    </div>
    ${
      isComingSoon
        ? '<span class="badge badge-outline" style="margin-top: var(--space-sm);">Coming Soon</span>'
        : `<a href="#/${metadata.category}" class="btn-primary" style="margin-top: var(--space-md); width: 100%;">Explore</a>`
    }
  `

  if (!isComingSoon) {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking the button (it has its own href)
      if ((e.target as HTMLElement).tagName !== 'A') {
        window.location.hash = `#/${metadata.category}`
      }
    })
  }

  return card
}

/**
 * Creates the hero section
 */
function createHeroSection(): HTMLElement {
  const section = document.createElement('section')
  section.className = 'hero section'

  section.innerHTML = `
    <div class="hero-content stack stack-lg" style="max-width: var(--max-width-md); margin: 0 auto; text-align: center;">
      <h1 style="font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-4xl)); margin: 0;">
        Visualization Platform
      </h1>
      <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary); margin: 0;">
        Interactive algorithm visualizations built with TypeScript
      </p>
      <div class="cluster" style="justify-content: center;">
        <a href="#/sorting" class="btn-primary btn-lg">
          Start Exploring
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn-secondary btn-lg">
          View Source
        </a>
      </div>
    </div>
  `

  return section
}

/**
 * Creates the visualization gallery section
 */
function createGallerySection(): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section'

  const container = document.createElement('div')
  container.style.maxWidth = 'var(--max-width-xl)'
  container.style.margin = '0 auto'

  // Section header
  const header = document.createElement('div')
  header.className = 'stack stack-sm'
  header.style.marginBottom = 'var(--space-lg)'
  header.innerHTML = `
    <h2 style="margin: 0;">Visualizations</h2>
    <p style="margin: 0; color: var(--color-text-secondary);">
      Explore interactive algorithm visualizations
    </p>
  `
  container.appendChild(header)

  // Gallery grid
  const gallery = document.createElement('div')
  gallery.className = 'card-grid'
  gallery.style.padding = '0'

  // Get registered visualizations
  const registrations = VisualizationRegistry.getAll()

  // Add registered visualizations
  registrations.forEach((registration) => {
    const card = createVisualizationCard(registration.metadata)
    gallery.appendChild(card)
  })

  // Add coming soon items
  comingSoonItems.forEach((item) => {
    const card = createVisualizationCard(item as VisualizationMetadata, true)
    gallery.appendChild(card)
  })

  container.appendChild(gallery)
  section.appendChild(container)

  return section
}

/**
 * Creates the features section
 */
function createFeaturesSection(): HTMLElement {
  const section = document.createElement('section')
  section.className = 'section'
  section.style.backgroundColor = 'var(--color-bg-secondary)'

  const container = document.createElement('div')
  container.style.maxWidth = 'var(--max-width-xl)'
  container.style.margin = '0 auto'

  const header = document.createElement('div')
  header.className = 'stack stack-sm'
  header.style.marginBottom = 'var(--space-lg)'
  header.style.textAlign = 'center'
  header.innerHTML = `
    <h2 style="margin: 0;">Built for Learning</h2>
    <p style="margin: 0; color: var(--color-text-secondary);">
      Understand algorithms through visual interaction
    </p>
  `
  container.appendChild(header)

  const features = [
    {
      icon: '⚡',
      title: 'Step-by-Step',
      description: 'Step through algorithms one operation at a time',
    },
    {
      icon: '🎯',
      title: 'Interactive Controls',
      description: 'Play, pause, speed up, or slow down animations',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Works great on phones, tablets, and desktops',
    },
    {
      icon: '📈',
      title: 'Real-time Metrics',
      description: 'Track comparisons, swaps, and performance',
    },
  ]

  const grid = document.createElement('div')
  grid.className = 'grid md:grid-cols-2 lg:grid-cols-4 gap-lg'

  features.forEach((feature) => {
    const card = document.createElement('div')
    card.className = 'stack stack-sm'
    card.style.textAlign = 'center'
    card.innerHTML = `
      <div style="font-size: var(--font-size-3xl);">${feature.icon}</div>
      <h3 style="font-size: var(--font-size-lg); margin: 0;">${feature.title}</h3>
      <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0;">
        ${feature.description}
      </p>
    `
    grid.appendChild(card)
  })

  container.appendChild(grid)
  section.appendChild(container)

  return section
}

/**
 * Creates the Home Page
 */
export function HomePage(): HTMLElement {
  const container = document.createElement('div')
  container.className = 'home-page'

  // Hero section
  container.appendChild(createHeroSection())

  // Gallery section
  container.appendChild(createGallerySection())

  // Features section
  container.appendChild(createFeaturesSection())

  return container
}

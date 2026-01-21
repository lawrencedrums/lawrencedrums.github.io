/**
 * Main Application Controller - Mobile First
 *
 * Manages the overall application structure including the navigation bar,
 * footer, and main content area. Coordinates between the router and UI components.
 */

import { Router } from './Router'
import { NavigationBar, updateNavigation } from '../components/NavigationBar'
import { Footer } from '../components/Footer'
import { HomePage } from '../pages/Home'
import { SortingPage } from '../pages/Sorting'
import type { Route } from '../types/router'

/**
 * Application class that initializes and manages the app
 */
export class App {
  private router: Router
  private rootElement: HTMLElement
  private navElement: HTMLElement | null = null
  private contentElement: HTMLElement | null = null
  private footerElement: HTMLElement | null = null

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement
    this.setupLayout()
    this.router = this.createRouter()
  }

  /**
   * Set up the application layout structure
   */
  private setupLayout(): void {
    // Clear root
    this.rootElement.innerHTML = ''

    // Create navigation bar
    this.navElement = NavigationBar('/')

    // Create main content container
    this.contentElement = document.createElement('main')
    this.contentElement.id = 'main-content'
    this.contentElement.style.flex = '1'
    this.contentElement.style.display = 'flex'
    this.contentElement.style.flexDirection = 'column'

    // Create footer
    this.footerElement = Footer({
      links: [
        { label: 'GitHub', href: 'https://github.com', external: true },
        { label: 'Twitter', href: 'https://twitter.com', external: true },
        { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
      ],
      showCopyright: true,
      copyrightText: `© ${new Date().getFullYear()} Visualization Platform`,
    })

    // Append to root
    this.rootElement.appendChild(this.navElement)
    this.rootElement.appendChild(this.contentElement)
    this.rootElement.appendChild(this.footerElement)
  }

  /**
   * Create and configure the router
   */
  private createRouter(): Router {
    if (!this.contentElement) {
      throw new Error('Content element not initialized')
    }

    const routes: Route[] = [
      {
        path: '/',
        title: 'Visualization Platform - Home',
        render: () => HomePage(),
      },
      {
        path: '/sorting',
        title: 'Sorting Visualizer - Visualization Platform',
        render: () => SortingPage(),
      },
    ]

    const notFoundRoute: Route = {
      path: '/404',
      title: '404 - Page Not Found',
      render: () => {
        const container = document.createElement('div')
        container.className = 'section'
        container.style.flex = '1'
        container.innerHTML = `
          <div class="center-content" style="min-height: 60vh;">
            <div class="stack stack-lg" style="text-align: center;">
              <h1 style="font-size: clamp(var(--font-size-3xl), 10vw, 6rem); margin: 0; color: var(--color-primary);">
                404
              </h1>
              <p style="font-size: var(--font-size-xl); color: var(--color-text-secondary); margin: 0;">
                Page not found
              </p>
              <a href="#/" class="btn-primary btn-lg">
                Go Home
              </a>
            </div>
          </div>
        `
        return container
      },
    }

    return new Router({
      root: this.contentElement,
      routes,
      notFoundRoute,
      afterRouteChange: (route) => {
        // Update navigation active state
        updateNavigation(route.path)

        // Scroll to top on navigation
        window.scrollTo({ top: 0, behavior: 'instant' })

        // Log navigation for debugging
        if (import.meta.env.DEV) {
          console.log(`Navigated to: ${route.path}`)
        }
      },
    })
  }

  /**
   * Start the application
   */
  public start(): void {
    this.router.start()

    if (import.meta.env.DEV) {
      console.log('Application started')
    }
  }

  /**
   * Get the router instance
   */
  public getRouter(): Router {
    return this.router
  }
}

/**
 * Main Application Controller
 *
 * Manages the overall application structure including the navigation bar
 * and main content area. Coordinates between the router and UI components.
 */

import { Router } from './Router';
import { NavigationBar, updateNavigation } from '../components/NavigationBar';
import { HomePage } from '../pages/Home';
import { SortingPage } from '../pages/Sorting';
import type { Route } from '../types/router';

/**
 * Application class that initializes and manages the app
 */
export class App {
  private router: Router;
  private rootElement: HTMLElement;
  private navElement: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.setupLayout();
    this.router = this.createRouter();
  }

  /**
   * Set up the application layout structure
   */
  private setupLayout(): void {
    // Clear root
    this.rootElement.innerHTML = '';

    // Create navigation bar
    this.navElement = NavigationBar('/');

    // Create main content container
    this.contentElement = document.createElement('main');
    this.contentElement.id = 'main-content';
    this.contentElement.style.flex = '1';

    // Append to root
    this.rootElement.appendChild(this.navElement);
    this.rootElement.appendChild(this.contentElement);
  }

  /**
   * Create and configure the router
   */
  private createRouter(): Router {
    if (!this.contentElement) {
      throw new Error('Content element not initialized');
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
    ];

    const notFoundRoute: Route = {
      path: '/404',
      title: '404 - Page Not Found',
      render: () => {
        const container = document.createElement('div');
        container.className = 'container';
        container.innerHTML = `
          <div class="center-content" style="min-height: 80vh; flex-direction: column;">
            <h1 style="font-size: var(--font-size-4xl);">404</h1>
            <p style="font-size: var(--font-size-xl); margin-top: var(--space-md);">
              Page not found
            </p>
            <a href="#/" class="btn-primary" style="margin-top: var(--space-xl);">
              Go Home
            </a>
          </div>
        `;
        return container;
      },
    };

    return new Router({
      root: this.contentElement,
      routes,
      notFoundRoute,
      afterRouteChange: (route) => {
        // Update navigation active state
        updateNavigation(route.path);

        // Log navigation for debugging
        console.log(`Navigated to: ${route.path}`);
      },
    });
  }

  /**
   * Start the application
   */
  public start(): void {
    this.router.start();
    console.log('Application started');
  }

  /**
   * Get the router instance
   */
  public getRouter(): Router {
    return this.router;
  }
}

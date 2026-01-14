/**
 * Hash-based Router for GitHub Pages Compatibility
 *
 * This router uses hash-based routing (#/path) which works perfectly with
 * GitHub Pages without requiring server configuration. It provides a clean
 * API for managing routes and navigation in the single-page application.
 */

import type { Route, RouterConfig, IRouter } from '../types/router';

export class Router implements IRouter {
  private routes: Map<string, Route>;
  private root: HTMLElement;
  private notFoundRoute?: Route;
  private beforeRouteChange?: RouterConfig['beforeRouteChange'];
  private afterRouteChange?: RouterConfig['afterRouteChange'];
  private currentPath: string = '';

  /**
   * Creates a new Router instance
   * @param config - Router configuration
   */
  constructor(config: RouterConfig) {
    this.root = config.root;
    this.routes = new Map();
    this.notFoundRoute = config.notFoundRoute;
    this.beforeRouteChange = config.beforeRouteChange;
    this.afterRouteChange = config.afterRouteChange;

    // Register all routes
    config.routes.forEach((route) => this.registerRoute(route));
  }

  /**
   * Register a new route
   * @param route - Route configuration
   */
  public registerRoute(route: Route): void {
    // Normalize path (ensure it starts with /)
    const normalizedPath = route.path.startsWith('/')
      ? route.path
      : `/${route.path}`;

    this.routes.set(normalizedPath, route);
  }

  /**
   * Start the router (begin listening to hash changes)
   */
  public start(): void {
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());

    // Handle initial route
    this.handleRouteChange();
  }

  /**
   * Stop the router (stop listening to hash changes)
   */
  public stop(): void {
    window.removeEventListener('hashchange', () => this.handleRouteChange());
  }

  /**
   * Navigate to a specific route
   * @param path - Route path to navigate to
   */
  public async navigate(path: string): Promise<void> {
    // Normalize path
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Update hash (this will trigger hashchange event)
    window.location.hash = normalizedPath;
  }

  /**
   * Get the current route path from URL hash
   * @returns Current route path
   */
  public getCurrentRoute(): string {
    const hash = window.location.hash;

    // Remove # and return path, default to '/'
    if (!hash || hash === '#' || hash === '#/') {
      return '/';
    }

    return hash.slice(1); // Remove the # character
  }

  /**
   * Get the current route object
   * @returns Current route object or undefined
   */
  public getCurrentRouteObject(): Route | undefined {
    const path = this.getCurrentRoute();
    return this.routes.get(path);
  }

  /**
   * Handle route changes
   */
  private async handleRouteChange(): Promise<void> {
    const newPath = this.getCurrentRoute();
    const oldPath = this.currentPath;

    // Check if route actually changed
    if (newPath === oldPath) {
      return;
    }

    // Call beforeRouteChange hook if defined
    if (this.beforeRouteChange) {
      const shouldContinue = await this.beforeRouteChange(oldPath, newPath);
      if (!shouldContinue) {
        // Revert navigation
        window.location.hash = oldPath;
        return;
      }
    }

    // Find matching route
    const route = this.routes.get(newPath);

    if (route) {
      await this.renderRoute(route);
      this.currentPath = newPath;
    } else if (this.notFoundRoute) {
      await this.renderRoute(this.notFoundRoute);
      this.currentPath = newPath;
    } else {
      console.error(`Route not found: ${newPath}`);
      this.root.innerHTML = `
        <div class="error">
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a href="#/">Go Home</a>
        </div>
      `;
    }

    // Call afterRouteChange hook if defined
    if (this.afterRouteChange && route) {
      this.afterRouteChange(route);
    }
  }

  /**
   * Render a route
   * @param route - Route to render
   */
  private async renderRoute(route: Route): Promise<void> {
    try {
      // Update document title
      document.title = route.title;

      // Clear current content
      this.root.innerHTML = '';

      // Render new content
      const content = await route.render();
      this.root.appendChild(content);

      // Scroll to top on route change
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error rendering route:', error);
      this.root.innerHTML = `
        <div class="error">
          <h1>Error</h1>
          <p>Failed to load page. Please try again.</p>
          <a href="#/">Go Home</a>
        </div>
      `;
    }
  }
}

/**
 * Create a link that navigates using the router
 * @param path - Path to navigate to
 * @param text - Link text
 * @param className - Optional CSS class
 * @returns HTMLAnchorElement
 */
export function createRouterLink(
  path: string,
  text: string,
  className?: string
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `#${path}`;
  link.textContent = text;
  if (className) {
    link.className = className;
  }
  return link;
}

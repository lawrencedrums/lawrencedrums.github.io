/**
 * Type definitions for the routing system
 */

/**
 * Route configuration object
 */
export interface Route {
  /** Unique route path (e.g., '/', '/sorting', '/about') */
  path: string;
  /** Route title for document.title */
  title: string;
  /** Function that renders the route content */
  render: () => HTMLElement | Promise<HTMLElement>;
  /** Optional route metadata */
  meta?: {
    description?: string;
    requiresAuth?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Router configuration options
 */
export interface RouterConfig {
  /** Root element to render routes into */
  root: HTMLElement;
  /** Routes configuration */
  routes: Route[];
  /** Optional route to use when no match is found */
  notFoundRoute?: Route;
  /** Optional callback before route changes */
  beforeRouteChange?: (from: string, to: string) => boolean | Promise<boolean>;
  /** Optional callback after route changes */
  afterRouteChange?: (route: Route) => void;
}

/**
 * Router instance interface
 */
export interface IRouter {
  /** Navigate to a specific route */
  navigate(path: string): Promise<void>;
  /** Get current route path */
  getCurrentRoute(): string;
  /** Get current route object */
  getCurrentRouteObject(): Route | undefined;
  /** Start listening to route changes */
  start(): void;
  /** Stop listening to route changes */
  stop(): void;
  /** Register a new route */
  registerRoute(route: Route): void;
}

/**
 * Main entry point for the application
 * This file initializes the app and sets up the router
 */

import './styles/main.css';
import { Router } from './app/Router';
import { HomePage } from './pages/Home';
import { SortingPage } from './pages/Sorting';

console.log('Application initialized');

// Initialize the router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('App root element not found');
    return;
  }

  // Create router instance with routes
  const router = new Router({
    root: app,
    routes: [
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
    ],
    notFoundRoute: {
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
    },
    afterRouteChange: (route) => {
      console.log(`Navigated to: ${route.path}`);
    },
  });

  // Start the router
  router.start();

  console.log('Router initialized and started');
});

/**
 * Main entry point for the application
 * This file initializes the app and sets up the router
 */

import './styles/main.css';
import { App } from './app/App';

console.log('Application initialized');

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.querySelector<HTMLDivElement>('#app');

  if (!rootElement) {
    console.error('App root element not found');
    return;
  }

  // Create and start the application
  const app = new App(rootElement);
  app.start();
});

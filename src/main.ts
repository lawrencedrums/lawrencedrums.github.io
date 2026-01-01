/**
 * Main entry point for the application
 * This file initializes the app and sets up the router
 */

import './styles/main.css';

console.log('Application initialized');

// Temporary initialization - will be replaced with router and app setup
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (app) {
    app.innerHTML = `
      <div>
        <h1>Visualization Platform</h1>
        <p>Phase 1: Foundation Setup Complete</p>
      </div>
    `;
  }
});

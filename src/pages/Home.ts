/**
 * Home Page
 *
 * Landing page that will eventually display the visualization gallery.
 * For now, it's a simple placeholder showing the platform is ready.
 */

export function HomePage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.paddingTop = 'var(--space-3xl)';

  container.innerHTML = `
    <div class="center-content" style="min-height: 80vh; flex-direction: column;">
      <h1>Visualization Platform</h1>
      <p style="font-size: var(--font-size-xl); text-align: center; max-width: 600px;">
        A modular TypeScript library for algorithm visualizations
      </p>

      <div class="flex flex-gap-md" style="margin-top: var(--space-xl);">
        <a href="#/sorting" class="btn-primary">
          View Sorting Visualizer
        </a>
      </div>

      <div class="card-grid" style="margin-top: var(--space-3xl); max-width: var(--max-width-lg);">
        <div class="card">
          <h3>🎨 Sorting Algorithms</h3>
          <p>Visualize classic sorting algorithms including Bubble Sort, Quick Sort, and more.</p>
          <a href="#/sorting">Explore →</a>
        </div>

        <div class="card" style="opacity: 0.6;">
          <h3>🗺️ Pathfinding</h3>
          <p style="color: var(--color-text-muted);">Coming soon: A*, Dijkstra, BFS, DFS</p>
        </div>

        <div class="card" style="opacity: 0.6;">
          <h3>📊 Data Structures</h3>
          <p style="color: var(--color-text-muted);">Coming soon: Trees, Heaps, Graphs</p>
        </div>
      </div>

      <div style="margin-top: var(--space-3xl); text-align: center; color: var(--color-text-muted);">
        <p>Phase 1: Foundation Setup ✓</p>
        <p style="font-size: var(--font-size-sm);">
          TypeScript • Vite • Custom CSS • Hash Router
        </p>
      </div>
    </div>
  `;

  return container;
}

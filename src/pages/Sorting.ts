/**
 * Sorting Visualizer Page
 *
 * Placeholder page for the sorting visualizer.
 * The actual visualization will be implemented in Phase 3.
 */

export function SortingPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.paddingTop = 'var(--space-2xl)';

  container.innerHTML = `
    <div class="stack">
      <div class="flex items-center justify-between">
        <h1>Sorting Visualizer</h1>
        <a href="#/" style="color: var(--color-text-secondary);">← Back to Home</a>
      </div>

      <div class="center-content" style="min-height: 60vh; flex-direction: column; gap: var(--space-lg);">
        <div style="text-align: center;">
          <h2>Coming in Phase 3</h2>
          <p style="max-width: 500px; margin-top: var(--space-md);">
            The sorting visualizer will be migrated from JavaScript to TypeScript
            as part of Phase 3: Migrate Sorting Visualizer.
          </p>
        </div>

        <div class="card" style="max-width: 600px;">
          <h3>Planned Features</h3>
          <ul style="list-style: disc; margin-left: var(--space-lg); color: var(--color-text-secondary);">
            <li>Bubble Sort</li>
            <li>Quick Sort</li>
            <li>Insertion Sort</li>
            <li>Selection Sort</li>
            <li>Merge Sort (future)</li>
            <li>Heap Sort (future)</li>
          </ul>
        </div>

        <a href="#/" class="btn-secondary">Return Home</a>
      </div>
    </div>
  `;

  return container;
}

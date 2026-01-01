/**
 * Navigation Bar Component
 *
 * A responsive navigation bar that displays site-wide navigation links.
 * Highlights the active route and provides easy navigation between pages.
 */

import { createRouterLink } from '../app/Router';

interface NavLink {
  path: string;
  label: string;
  disabled?: boolean;
}

/**
 * Creates the navigation bar component
 * @param currentPath - Current active path for highlighting
 * @returns HTMLElement navigation bar
 */
export function NavigationBar(currentPath: string = '/'): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'nav';

  const container = document.createElement('div');
  container.className = 'nav-container';

  // Brand/Logo
  const brand = createRouterLink('/', 'Viz Platform', 'nav-brand');

  // Navigation links
  const navLinks: NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/sorting', label: 'Sorting' },
    { path: '/about', label: 'About', disabled: true },
  ];

  const linksList = document.createElement('ul');
  linksList.className = 'nav-links';

  navLinks.forEach((navLink) => {
    const li = document.createElement('li');

    if (navLink.disabled) {
      // Disabled link
      const span = document.createElement('span');
      span.className = 'nav-link';
      span.style.opacity = '0.5';
      span.style.cursor = 'not-allowed';
      span.textContent = navLink.label;
      li.appendChild(span);
    } else {
      // Active link
      const link = createRouterLink(navLink.path, navLink.label, 'nav-link');

      // Add active class if current path matches
      if (currentPath === navLink.path) {
        link.classList.add('active');
      }

      li.appendChild(link);
    }

    linksList.appendChild(li);
  });

  container.appendChild(brand);
  container.appendChild(linksList);
  nav.appendChild(container);

  return nav;
}

/**
 * Updates the active link in the navigation bar
 * @param currentPath - Current active path
 */
export function updateNavigation(currentPath: string): void {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      const linkPath = link.getAttribute('href')?.replace('#', '') || '/';

      if (linkPath === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/**
 * Navigation Bar Component - Mobile First
 *
 * Responsive navigation bar with hamburger menu for mobile.
 * Displays site-wide navigation links with active route highlighting.
 */

import { createRouterLink } from '../app/Router'

interface NavLink {
  path: string
  label: string
  disabled?: boolean
}

const defaultNavLinks: NavLink[] = [
  { path: '/', label: 'Home' },
  { path: '/sorting', label: 'Sorting' },
  { path: '/about', label: 'About', disabled: true },
]

/**
 * Creates the navigation bar component
 * @param currentPath - Current active path for highlighting
 * @param navLinks - Navigation links to display
 * @returns HTMLElement navigation bar
 */
export function NavigationBar(
  currentPath: string = '/',
  navLinks: NavLink[] = defaultNavLinks
): HTMLElement {
  const nav = document.createElement('nav')
  nav.className = 'nav'

  const container = document.createElement('div')
  container.className = 'nav-container'

  // Brand/Logo
  const brand = createRouterLink('/', 'Viz Platform', 'nav-brand')

  // Mobile menu toggle button
  const menuToggle = document.createElement('button')
  menuToggle.className = 'nav-toggle'
  menuToggle.setAttribute('aria-label', 'Toggle navigation menu')
  menuToggle.setAttribute('aria-expanded', 'false')
  menuToggle.innerHTML = `
    <div class="nav-toggle-icon">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `

  // Navigation links list
  const linksList = document.createElement('ul')
  linksList.className = 'nav-links'
  linksList.id = 'nav-links'

  navLinks.forEach((navLink) => {
    const li = document.createElement('li')

    if (navLink.disabled) {
      // Disabled link - render as span
      const span = document.createElement('span')
      span.className = 'nav-link disabled'
      span.textContent = navLink.label
      li.appendChild(span)
    } else {
      // Active link
      const link = createRouterLink(navLink.path, navLink.label, 'nav-link')

      // Add active class if current path matches
      if (currentPath === navLink.path) {
        link.classList.add('active')
      }

      // Close mobile menu on link click
      link.addEventListener('click', () => {
        closeMobileMenu(menuToggle, linksList)
      })

      li.appendChild(link)
    }

    linksList.appendChild(li)
  })

  // Toggle menu on button click
  menuToggle.addEventListener('click', () => {
    const isOpen = linksList.classList.contains('open')
    if (isOpen) {
      closeMobileMenu(menuToggle, linksList)
    } else {
      openMobileMenu(menuToggle, linksList)
    }
  })

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!nav.contains(target)) {
      closeMobileMenu(menuToggle, linksList)
    }
  })

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu(menuToggle, linksList)
    }
  })

  container.appendChild(brand)
  container.appendChild(menuToggle)
  container.appendChild(linksList)
  nav.appendChild(container)

  return nav
}

/**
 * Opens the mobile navigation menu
 */
function openMobileMenu(toggle: HTMLElement, menu: HTMLElement): void {
  toggle.classList.add('active')
  toggle.setAttribute('aria-expanded', 'true')
  menu.classList.add('open')
}

/**
 * Closes the mobile navigation menu
 */
function closeMobileMenu(toggle: HTMLElement, menu: HTMLElement): void {
  toggle.classList.remove('active')
  toggle.setAttribute('aria-expanded', 'false')
  menu.classList.remove('open')
}

/**
 * Updates the active link in the navigation bar
 * @param currentPath - Current active path
 */
export function updateNavigation(currentPath: string): void {
  const navLinks = document.querySelectorAll('.nav-link')

  navLinks.forEach((link) => {
    if (link instanceof HTMLAnchorElement) {
      const linkPath = link.getAttribute('href')?.replace('#', '') || '/'

      if (linkPath === currentPath) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    }
  })

  // Close mobile menu on navigation
  const toggle = document.querySelector('.nav-toggle')
  const menu = document.querySelector('.nav-links')
  if (toggle && menu) {
    closeMobileMenu(toggle as HTMLElement, menu as HTMLElement)
  }
}

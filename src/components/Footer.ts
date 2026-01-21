/**
 * Footer Component
 *
 * Site-wide footer with social links and copyright.
 * Mobile-first design with vertical stacking on small screens.
 */

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterConfig {
  links?: FooterLink[]
  showCopyright?: boolean
  copyrightText?: string
}

const defaultLinks: FooterLink[] = [
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
]

/**
 * Creates the footer component
 */
export function Footer(config: FooterConfig = {}): HTMLElement {
  const {
    links = defaultLinks,
    showCopyright = true,
    copyrightText = `${new Date().getFullYear()} Visualization Platform`,
  } = config

  const footer = document.createElement('footer')
  footer.className = 'footer'

  const container = document.createElement('div')
  container.className = 'footer-container'

  // Social/external links
  if (links.length > 0) {
    const linksContainer = document.createElement('div')
    linksContainer.className = 'footer-links'

    links.forEach((link) => {
      const anchor = document.createElement('a')
      anchor.href = link.href
      anchor.className = 'footer-link'
      anchor.textContent = link.label

      if (link.external) {
        anchor.target = '_blank'
        anchor.rel = 'noopener noreferrer'
      }

      linksContainer.appendChild(anchor)
    })

    container.appendChild(linksContainer)
  }

  // Copyright text
  if (showCopyright) {
    const copyright = document.createElement('p')
    copyright.className = 'footer-text'
    copyright.textContent = copyrightText
    container.appendChild(copyright)
  }

  footer.appendChild(container)

  return footer
}

/**
 * Updates footer links dynamically
 */
export function updateFooterLinks(links: FooterLink[]): void {
  const linksContainer = document.querySelector('.footer-links')
  if (!linksContainer) return

  linksContainer.innerHTML = ''

  links.forEach((link) => {
    const anchor = document.createElement('a')
    anchor.href = link.href
    anchor.className = 'footer-link'
    anchor.textContent = link.label

    if (link.external) {
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
    }

    linksContainer.appendChild(anchor)
  })
}

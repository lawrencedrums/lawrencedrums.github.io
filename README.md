# Visualization Platform

> An expandable TypeScript visualization library and personal website platform

[![Deploy to GitHub Pages](https://github.com/lawrencedrums/lawrencedrums.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/lawrencedrums/lawrencedrums.github.io/actions/workflows/deploy.yml)

## 🎯 Overview

A modular, type-safe visualization platform built with TypeScript and Vite. This project serves as both a standalone visualization library and a foundation for a personal website, featuring algorithm visualizations, interactive demos, and educational content.

**Live Demo:** https://lawrencedrums.github.io/

## ✨ Features

### Current (Phase 1 Complete)
- ✅ Modern TypeScript + Vite build system
- ✅ Zero runtime dependencies (< 6 KB gzipped)
- ✅ Custom lightweight CSS system (no Bootstrap)
- ✅ Hash-based routing for GitHub Pages compatibility
- ✅ Responsive grid system with CSS Grid and Flexbox
- ✅ Automated GitHub Actions deployment

### Coming Soon
- 🎨 Sorting algorithm visualizations (Phase 3)
- 🗺️ Pathfinding visualizers (A*, Dijkstra, BFS, DFS)
- 📊 Data structure visualizations (Trees, Heaps, Graphs)
- 📝 Blog and project portfolio pages

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/lawrencedrums/lawrencedrums.github.io.git
cd lawrencedrums.github.io

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
.
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app/
│   │   ├── App.ts              # Application controller
│   │   └── Router.ts           # Hash-based router
│   ├── pages/
│   │   ├── Home.ts             # Landing page
│   │   └── Sorting.ts          # Sorting visualizer page
│   ├── components/
│   │   └── NavigationBar.ts    # Navigation component
│   ├── visualizations/         # Visualization modules (coming in Phase 2-3)
│   ├── styles/
│   │   ├── main.css            # Global styles
│   │   ├── variables.css       # Design tokens
│   │   ├── reset.css           # CSS reset
│   │   ├── grid.css            # Grid utilities
│   │   └── components.css      # Component styles
│   ├── utils/                  # Shared utilities (coming in Phase 2)
│   └── types/
│       └── router.d.ts         # TypeScript definitions
├── legacy/                     # Original JavaScript code (for reference)
├── dist/                       # Production build output
└── index.html                  # HTML entry point
```

## 🛠️ Technology Stack

- **TypeScript 5.9** - Type-safe development
- **Vite 7.3** - Lightning-fast build tool
- **CSS Grid + Flexbox** - Modern responsive layouts
- **CSS Custom Properties** - Themeable design system
- **GitHub Pages** - Free hosting with automated deployment
- **GitHub Actions** - CI/CD pipeline

## 🎨 Architecture

### Design Principles
- **Type Safety First**: Strict TypeScript for catching errors at compile time
- **Zero Dependencies**: No external runtime libraries, minimal bundle size
- **Modular Architecture**: Easy to add new visualizations and pages
- **Performance**: Target 60fps animations, < 100 KB bundle
- **Accessibility**: WCAG AA compliant, keyboard navigation, reduced motion support

### Routing System
Hash-based routing (`#/path`) ensures compatibility with GitHub Pages without server configuration:
- `/` - Home page
- `/sorting` - Sorting visualizer
- `/404` - Custom 404 page

Adding new routes is simple - see `src/app/App.ts`.

## 📦 Bundle Size

Current production bundle (Phase 1):
- **JavaScript**: 8.30 KB (2.80 KB gzipped)
- **CSS**: 11.33 KB (2.88 KB gzipped)
- **Total**: ~5.7 KB gzipped

Target: Stay under 100 KB for the complete platform.

## 🔧 Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally

### Code Quality
- Strict TypeScript mode enabled
- ES2020+ target for modern JavaScript features
- Source maps for debugging
- Path aliases (`@/*` for `src/*`)

## 🚢 Deployment

Automated deployment via GitHub Actions:
1. Push to `master` branch
2. GitHub Actions builds the project
3. Deploys to GitHub Pages automatically

Manual deployment is also supported via the Actions tab.

## 📋 Implementation Phases

- ✅ **Phase 1**: Foundation Setup (Complete)
  - Vite + TypeScript setup
  - Custom CSS system
  - Hash-based routing
  - Navigation component

- 🚧 **Phase 2**: Core Visualization Architecture (Next)
  - Abstract Visualization class
  - VisualizationRegistry
  - AnimationController
  - Configuration system

- 📅 **Phase 3**: Migrate Sorting Visualizer
  - Convert algorithms to TypeScript
  - Implement SortingVisualizer
  - UI controls and integration

- 📅 **Phase 4-6**: Gallery, Documentation, Polish

## 🤝 Contributing

This project is currently in active development. Contribution guidelines will be added in Phase 5.

## 📄 License

ISC License

## 🙏 Acknowledgments

Originally created as a CS50x final project. Now being transformed into a comprehensive visualization platform and personal website.

---

**Built with TypeScript, Vite, and lots of ☕**

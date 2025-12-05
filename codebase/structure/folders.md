# Project Structure

This document explains the directory organization and file conventions of the OpenNoodl codebase.

## Root Directory Structure

```
noodl/
├── packages/           # Monorepo packages
├── apps/              # Application entry points
├── docs/              # Documentation
├── scripts/           # Build and utility scripts
├── tests/             # Integration and e2e tests
├── .github/           # GitHub workflows and templates
├── package.json       # Root package configuration
└── README.md          # Project overview
```

## Core Packages (`/packages`)

### `/packages/noodl-editor`

The visual editor application (main UI).

```
noodl-editor/
├── src/
│   ├── components/    # React components
│   ├── editor/        # Core editor logic
│   ├── models/        # Data models
│   ├── stores/        # State management
│   ├── utils/         # Utility functions
│   └── index.js       # Entry point
├── public/            # Static assets
├── build/             # Build output
└── package.json
```

### `/packages/noodl-runtime`

The runtime engine that executes node graphs.

```
noodl-runtime/
├── src/
│   ├── nodes/         # Node implementations
│   ├── engine/        # Execution engine
│   ├── events/        # Event system
│   ├── data/          # Data management
│   └── index.js       # Runtime entry
├── tests/             # Unit tests
└── package.json
```

### `/packages/noodl-core-nodes`

Built-in node implementations.

```
noodl-core-nodes/
├── src/
│   ├── ui/            # UI component nodes
│   ├── logic/         # Logic and control nodes
│   ├── data/          # Data manipulation nodes
│   ├── events/        # Event handling nodes
│   └── index.js       # Node registry
└── package.json
```

### `/packages/noodl-platform`

Platform-specific code and adapters.

```
noodl-platform/
├── src/
│   ├── electron/      # Electron desktop app
│   ├── web/           # Web platform
│   ├── mobile/        # Mobile platform (future)
│   └── common/        # Shared platform code
└── package.json
```

## Application Entry Points (`/apps`)

### `/apps/noodl-editor-app`

Main desktop application (Electron wrapper).

### `/apps/noodl-web-app`

Web version of the editor.

### `/apps/noodl-cloud-app`

Cloud services and deployment tools.

## File Naming Conventions

### Component Files

- React components: `PascalCase.jsx`
- Utility modules: `camelCase.js`
- Constants: `UPPER_SNAKE_CASE.js`
- Tests: `filename.test.js`

### Directory Structure

- Components in `/components` with index exports
- Models in `/models` following domain organization
- Utilities in `/utils` by functionality

## Import/Export Patterns

### Barrel Exports

Use index files for clean imports:

```javascript
// /components/index.js
export { NodeEditor } from "./NodeEditor";
export { PropertyPanel } from "./PropertyPanel";
export { Toolbar } from "./Toolbar";
```

### Absolute Imports

Configure path mapping for cleaner imports:

```javascript
// Instead of: import { Node } from '../../../models/Node'
import { Node } from "@noodl/models/Node";
```

## Asset Organization

### Static Assets

```
public/
├── icons/             # SVG icons and graphics
├── fonts/             # Custom fonts
├── images/            # Images and illustrations
├── themes/            # CSS theme files
└── manifest.json      # App manifest
```

### Generated Assets

```
build/
├── static/            # Webpack output
├── locales/           # Internationalization
└── docs/              # Generated documentation
```

## Configuration Files

### Build Configuration

- `webpack.config.js` - Webpack build setup
- `babel.config.js` - Babel transformation
- `tsconfig.json` - TypeScript configuration

### Development Tools

- `.eslintrc.js` - Code linting rules
- `.prettierrc` - Code formatting
- `jest.config.js` - Test configuration

## Development Guidelines

### Adding New Features

1. Create feature branch
2. Add components to appropriate package
3. Update tests and documentation
4. Follow naming conventions
5. Submit PR with clear description

### Package Dependencies

- Keep packages loosely coupled
- Use interfaces for package communication
- Avoid circular dependencies
- Document inter-package APIs

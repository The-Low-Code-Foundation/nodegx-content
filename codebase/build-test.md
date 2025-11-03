# Building and Testing

This guide covers the build process and testing procedures for OpenNoodl.

## Building the Project

### Development Build

```bash
npm run dev
# or
yarn dev
```

### Production Build

```bash
npm run build
# or
yarn build
```

### Platform-Specific Builds

```bash
# Desktop app (Electron)
npm run build:desktop

# Web app
npm run build:web

# All platforms
npm run build:all
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Types

#### Unit Tests

- Located alongside source files (`.test.js`)
- Test individual functions and components
- Use Jest framework

#### Integration Tests

- Located in `/tests/integration`
- Test component interactions
- Use React Testing Library

#### End-to-End Tests

- Located in `/tests/e2e`
- Test complete user workflows
- Use Playwright or Cypress

### Writing Tests

Follow the testing guidelines in [Testing Guidelines](./guides/testing.md).

## Continuous Integration

Our CI pipeline runs on GitHub Actions:

- Automated testing on pull requests
- Build verification for all platforms
- Code quality checks (ESLint, Prettier)
- Security scanning

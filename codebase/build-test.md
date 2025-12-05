# Building and Testing

This guide covers the build process and testing procedures for OpenNoodl.

## Building the Project

### Development Build

```bash
npm run dev
# or
yarn dev
```

### Build

```bash
# Desktop app (Electron)
npm run build:editor

# Extract executables into /dist folder
npm run build:editor:pack
```

## Testing

### Running Tests

```bash
# Run editor tests
npm run test:editor

# Run platform tests
npm run test:platform
```

## Continuous Integration

Our CI pipeline runs on GitHub Actions:

- Automated testing on pull requests
- Build verification for all platforms
- Code quality checks (ESLint, Prettier)

# Development Setup

This guide will help you set up your development environment to contribute to OpenNoodl.

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Git**
- **Code editor** (VS Code recommended)

## Clone and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/noodlapp/noodl.git
   cd noodl
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the project**

   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Development Environment

### Recommended VS Code Extensions

- ESLint
- Prettier
- GitLens
- Auto Rename Tag

### Environment Variables

Create a `.env` file in the root directory:

```env
# Add any required environment variables here
NODE_ENV=development
```

## Common Issues

### Build Failures

- Ensure Node.js version is 16+
- Clear node_modules and reinstall dependencies
- Check for platform-specific build requirements

### Hot Reload Issues

- Restart the development server
- Check for syntax errors in recent changes

## Next Steps

- Read the [Contributing Guidelines](./contributing.md)
- Explore the [Project Structure](./structure/folders.md)
- Check out [Building and Testing](./build-test.md)

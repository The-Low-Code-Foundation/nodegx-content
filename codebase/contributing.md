# Contributing Guidelines

Thank you for your interest in contributing to OpenNoodl! This document outlines our development process and guidelines.

## Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/noodlapp/noodl/blob/main/CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit a pull request**

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/add-new-node-type`
- `bugfix/fix-memory-leak`
- `docs/update-api-reference`

### Commit Messages

Follow conventional commit format:

```
type(scope): description

feat(nodes): add new Chart node
fix(editor): resolve connection rendering issue
docs(api): update JavaScript API examples
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Request review** from maintainers
5. **Address feedback** promptly

## Coding Standards

### JavaScript/TypeScript

- Use ESLint and Prettier configurations
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use TypeScript for new code when possible

### Testing

- Write unit tests for new features
- Update existing tests when modifying functionality
- Ensure test coverage doesn't decrease

## Issue Guidelines

### Reporting Bugs

- Use the bug report template
- Include reproduction steps
- Provide system information
- Add relevant screenshots/logs

### Feature Requests

- Use the feature request template
- Explain the use case and motivation
- Consider implementation complexity
- Discuss with maintainers first for major changes

## Review Process

- All PRs require at least one review
- Address feedback before merging
- Squash commits when merging

## Getting Help

- Join our [Discord](https://discord.com/invite/23xU2hYrSJ)
- Check existing [issues](https://github.com/noodlapp/noodl/issues)
- Read the [development docs](./overview.md)

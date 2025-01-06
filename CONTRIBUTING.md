# Contributing to Wishlist App

## Welcome Contributors! 🎉

We're thrilled that you're interested in contributing to the Wishlist App. This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful, inclusive, and considerate of others. Harassment and discrimination will not be tolerated.

## How to Contribute

### Reporting Bugs
1. Check existing issues to ensure the bug hasn't been reported
2. Use the bug report template
3. Provide detailed steps to reproduce
4. Include your environment details

### Feature Requests
1. Check existing issues to avoid duplicates
2. Clearly describe the feature
3. Explain the use case and potential benefits

### Development Process

#### Setup
1. Fork the repository
2. Clone your fork
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Coding Standards
- Follow Next.js and React best practices
- Use TypeScript
- Maintain consistent code style
- Write clear, concise comments
- Add/update tests for new features

#### Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commits format:
  ```
  type(scope): description
  
  Examples:
  feat(auth): add Google OAuth login
  fix(wishlist): resolve item deletion bug
  docs(readme): update installation instructions
  ```

#### Pull Request Process
1. Ensure code passes all tests
2. Update documentation
3. Add description of changes
4. Request review from maintainers

### Development Environment

#### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

#### Local Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local`
3. Configure environment variables
4. Run development server
   ```bash
   npm run dev
   ```

### Testing
- Run tests before submitting PR
  ```bash
  npm test
  ```

## Questions?
Open an issue or reach out to the maintainers.

Thank you for contributing! 🚀

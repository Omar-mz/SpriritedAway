# Contributing to EduBoard LMS

We love your input! We want to make contributing to EduBoard LMS as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### 1. Fork the Repository

1. Fork the repo on GitHub
2. Clone your fork locally
3. Set up the development environment

```bash
git clone https://github.com/yourusername/eduboard-lms.git
cd eduboard-lms
npm install --legacy-peer-deps
cp .env.local.example .env.local
# Configure your environment variables
npm run dev
```

### 2. Create a Branch

Create a branch for your feature or bug fix:

```bash
git checkout -b feature/amazing-new-feature
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

- Write clean, maintainable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
npm run test          # Run unit tests
npm run lint          # Check code style
npm run build         # Ensure it builds correctly
```

### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```bash
git commit -m "feat: add user profile management"
git commit -m "fix: resolve authentication token refresh issue"
git commit -m "docs: update installation instructions"
```

### 6. Push and Create Pull Request

```bash
git push origin feature/amazing-new-feature
```

Then create a pull request on GitHub.

## 📝 Pull Request Process

1. **Fill out the PR template** with all required information
2. **Update documentation** if you've changed functionality
3. **Add tests** for new features or bug fixes
4. **Ensure CI passes** - all tests and linting must pass
5. **Request review** from maintainers
6. **Address feedback** promptly and professionally

### Pull Request Template

When creating a PR, please include:

- **Description**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Testing**: How has this been tested?
- **Screenshots**: If UI changes are involved
- **Breaking Changes**: Are there any breaking changes?

## 🐛 Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/eduboard-lms/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser [e.g. chrome, safari]
 - Node.js version
 - Project version

**Additional Context**
Add any other context about the problem here.
```

## 💡 Feature Requests

We welcome feature requests! Please provide:

- **Clear description** of the feature
- **Use case** - why would this be useful?
- **Possible implementation** - if you have ideas
- **Examples** from other platforms (if applicable)

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow the existing **ESLint** configuration
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Prefer **functional programming** patterns when appropriate

### React Components

- Use **functional components** with hooks
- Follow **component composition** patterns
- Use **proper prop types** with TypeScript interfaces
- Implement **error boundaries** for complex components

### Database

- Use **Mongoose schemas** with proper validation
- Add **indexes** for query optimization
- Follow **data modeling** best practices
- Use **transactions** for complex operations

### API Design

- Follow **RESTful** conventions
- Use proper **HTTP status codes**
- Implement **input validation** with Zod
- Add **comprehensive error handling**
- Document APIs with **JSDoc** comments

### Git Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat(auth): add two-factor authentication
fix(quiz): resolve scoring calculation issue
docs(api): update authentication endpoints
style(ui): improve button hover states
refactor(db): optimize user query performance
test(auth): add login flow test cases
chore(deps): update dependencies
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for **all new functions**
- Use **Jest** and **React Testing Library**
- Aim for **80%+ code coverage**
- Test **edge cases** and **error conditions**

### Integration Tests
- Test **API endpoints** with sample data
- Verify **database operations**
- Test **authentication flows**

### E2E Tests
- Test **critical user journeys**
- Use **Playwright** or **Cypress**
- Test **different browsers** and devices

## 📁 Project Structure

When adding new files, follow this structure:

```
app/
├── api/                    # API routes
├── (auth)/                 # Authentication pages
├── dashboard/              # Dashboard pages
└── courses/                # Course-related pages

components/
├── ui/                     # Base UI components
├── forms/                  # Form components
├── layouts/                # Layout components
└── features/               # Feature-specific components

lib/
├── auth/                   # Authentication utilities
├── db/                     # Database utilities
├── email/                  # Email utilities
└── utils/                  # General utilities

models/                     # Database models
types/                      # TypeScript type definitions
hooks/                      # Custom React hooks
contexts/                   # React contexts
```

## 🔒 Security Guidelines

- **Never commit** sensitive data (passwords, keys, tokens)
- Use **environment variables** for configuration
- Implement **input validation** for all user inputs
- Follow **OWASP** security guidelines
- Report security vulnerabilities **privately** to security@eduboard.com

## 📚 Documentation

### Code Documentation
- Add **JSDoc comments** for complex functions
- Use **TypeScript interfaces** for data structures
- Include **usage examples** in comments

### API Documentation
- Document **all endpoints** with JSDoc
- Include **request/response** examples
- Specify **authentication requirements**
- Document **error responses**

### User Documentation
- Update **README.md** for setup changes
- Add **usage examples** for new features
- Include **screenshots** for UI changes

## 🎯 Development Priorities

### High Priority
1. **Security improvements**
2. **Performance optimizations**
3. **Bug fixes**
4. **Accessibility improvements**

### Medium Priority
1. **New core features**
2. **UI/UX enhancements**
3. **Developer experience**
4. **Test coverage**

### Low Priority
1. **Nice-to-have features**
2. **Code refactoring**
3. **Documentation improvements**

## 🤝 Community Guidelines

### Be Respectful
- Use **welcoming and inclusive language**
- Respect **different viewpoints** and experiences
- Accept **constructive criticism** gracefully
- Focus on **what's best** for the community

### Be Professional
- Keep discussions **on-topic**
- Provide **constructive feedback**
- Help **newcomers** get started
- Share **knowledge** and expertise

## 📞 Getting Help

### Development Questions
- Create a **GitHub Discussion** for general questions
- Join our **Discord server** for real-time chat
- Check **existing issues** before creating new ones

### Code Review
- Request reviews from **relevant maintainers**
- Be **patient** - reviews take time
- Address **feedback constructively**
- Ask **questions** if feedback is unclear

## 🏆 Recognition

We believe in recognizing contributors:

- **Contributors** are listed in README.md
- **Significant contributions** get special recognition
- **Regular contributors** may be invited as maintainers
- **Outstanding work** is highlighted in release notes

## 📄 License

By contributing to EduBoard LMS, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

## 🙏 Thank You!

Your contributions make EduBoard LMS better for everyone. Whether you're fixing a typo, adding a feature, or improving documentation, every contribution matters.

---

**Questions?** Feel free to reach out to the maintainers or create a discussion on GitHub!
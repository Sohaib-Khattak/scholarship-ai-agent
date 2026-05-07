# Contributing to WhatsApp Scholarship Agent

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, Node.js version)
- Relevant logs or screenshots

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature already exists or is planned
- Describe the feature and its use case
- Explain why it would be valuable
- Provide examples if possible

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/whatsapp-scholarship-agent.git
   cd whatsapp-scholarship-agent
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm start
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Wait for review

## 📝 Code Style Guidelines

### JavaScript

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use async/await over callbacks
- Add JSDoc comments for functions
- Use meaningful variable names

**Example**:
```javascript
/**
 * Validate scholarship deadline
 * @param {string} deadline - Deadline date string
 * @returns {boolean} True if valid
 */
async function validateDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return deadlineDate > today;
}
```

### File Structure

```
src/
├── agents/          # AI agent implementations
├── database/        # Database connection and queries
├── utils/           # Utility functions
└── index.js         # Main entry point
```

### Naming Conventions

- Files: `camelCase.js`
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Database tables: `snake_case`

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Writing Tests

Add tests for new features:

```javascript
// test/scholarshipHunter.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import ScholarshipHunter from '../src/agents/scholarshipHunter.js';

describe('ScholarshipHunter', () => {
  it('should extract scholarship data', async () => {
    const hunter = new ScholarshipHunter();
    const scholarships = await hunter.hunt();
    assert(Array.isArray(scholarships));
  });
});
```

## 📚 Documentation

Update documentation when:

- Adding new features
- Changing API endpoints
- Modifying configuration options
- Updating dependencies

Files to update:
- `README.md` - Main documentation
- `API.md` - API reference
- `SETUP.md` - Setup instructions
- `ARCHITECTURE.md` - System architecture

## 🔍 Code Review Process

Pull requests will be reviewed for:

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it clean and maintainable?
3. **Tests** - Are there adequate tests?
4. **Documentation** - Is it properly documented?
5. **Performance** - Does it impact performance?
6. **Security** - Are there security concerns?

## 🎯 Priority Areas

We especially welcome contributions in:

- [ ] Additional scholarship sources
- [ ] Improved AI prompts
- [ ] Better error handling
- [ ] Performance optimizations
- [ ] Test coverage
- [ ] Documentation improvements
- [ ] UI/Dashboard development
- [ ] Mobile app development

## 📋 Commit Message Guidelines

Use clear, descriptive commit messages:

```
Add: New feature
Fix: Bug fix
Update: Update existing feature
Refactor: Code refactoring
Docs: Documentation changes
Test: Add or update tests
Style: Code style changes
```

**Examples**:
```
Add: Telegram bot integration
Fix: Database connection timeout issue
Update: Improve AI validation prompts
Docs: Add API documentation
```

## 🐛 Debugging

### Enable Debug Logging

```env
LOG_LEVEL=debug
```

### Common Issues

**Database Connection**:
```bash
# Test connection
psql $DATABASE_URL
```

**WhatsApp Session**:
```bash
# Clear session
rm -rf whatsapp-session/
```

**API Errors**:
```bash
# Check logs
curl http://localhost:3000/api/logs
```

## 🔐 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead, email: security@example.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices

- Never commit API keys or credentials
- Use environment variables for secrets
- Validate all user inputs
- Use parameterized database queries
- Keep dependencies updated

## 📞 Getting Help

- **Documentation**: Check README.md and other docs
- **Issues**: Search existing issues
- **Discussions**: Start a discussion for questions
- **Email**: contact@example.com

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make this project better for everyone. Thank you for taking the time to contribute!

---

**Happy Coding! 🎓**

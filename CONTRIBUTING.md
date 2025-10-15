# Contributing to Finance App (BDT)

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/finance-app-bdt.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure
5. Run the development server: `npm run dev`

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions/updates
- `refactor/` - Code refactoring

### 2. Make Your Changes

- Follow existing code style
- Write clean, readable code
- Add comments for complex logic
- Update types as needed

### 3. Write Tests

Add tests for new features:

```bash
npm test
```

Test files should be in `__tests__/` directory.

### 4. Commit Your Changes

Use conventional commits:

```bash
git commit -m "feat: add monthly budget feature"
git commit -m "fix: resolve PDF generation error"
git commit -m "docs: update deployment guide"
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `style` - Formatting
- `chore` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` types when possible
- Use meaningful variable names

```typescript
// Good
interface Transaction {
  userId: string;
  amount: number;
  category: string;
}

// Avoid
let data: any = {};
```

### React Components

- Use functional components
- Use TypeScript for props
- Keep components focused and small
- Extract reusable logic into hooks

```typescript
// Good
interface Props {
  userId: string;
  onSuccess: () => void;
}

export function TransactionForm({ userId, onSuccess }: Props) {
  // ...
}
```

### API Routes

- Always validate input with Zod
- Check authentication
- Return consistent error formats
- Use proper HTTP status codes

```typescript
// Good
const schema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
});

const validation = schema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    { error: 'Validation failed', details: validation.error.errors },
    { status: 400 }
  );
}
```

### Database Models

- Use Mongoose schemas
- Add indexes for frequently queried fields
- Use TypeScript interfaces
- Add validation

```typescript
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

UserSchema.index({ email: 1 });
```

## Testing Guidelines

### Unit Tests

Test utility functions:

```typescript
describe('bdtToPaisa', () => {
  it('should convert BDT to paisa', () => {
    expect(bdtToPaisa(100)).toBe(10000);
  });
});
```

### API Tests

Test API endpoints:

```typescript
describe('POST /api/transactions', () => {
  it('should create a transaction', async () => {
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

### Test Coverage

Aim for:
- 80%+ coverage for utils
- 70%+ coverage for API routes
- Critical paths fully tested

## Documentation

### Code Comments

Add JSDoc comments for functions:

```typescript
/**
 * Converts BDT to paisa (integer storage)
 * @param bdt - Amount in BDT
 * @returns Amount in paisa (BDT * 100)
 */
export function bdtToPaisa(bdt: number): number {
  return Math.round(bdt * 100);
}
```

### README Updates

Update README.md when adding:
- New features
- API endpoints
- Environment variables
- Dependencies

## Pull Request Guidelines

### PR Title

Use conventional commit format:

```
feat: add budget tracking feature
fix: resolve transaction deletion bug
docs: update API documentation
```

### PR Description

Include:
- What changed
- Why it changed
- How to test
- Screenshots (if UI changes)

Example:

```markdown
## What

Added monthly budget tracking feature.

## Why

Users requested ability to set and track monthly budgets.

## How to Test

1. Go to dashboard
2. Click "Set Budget"
3. Enter amount
4. Verify budget shows in summary

## Screenshots

[Add screenshots here]
```

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass: `npm test`
- [ ] Linter passes: `npm run lint`
- [ ] Documentation updated
- [ ] Commits follow conventions
- [ ] No merge conflicts

## Issue Reporting

### Bug Reports

Include:
- Description of bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment (OS, browser, etc.)

### Feature Requests

Include:
- Clear description
- Use case
- Why it's needed
- Possible implementation

## Questions?

- Open a discussion on GitHub
- Check existing issues
- Review documentation

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- No harassment or discrimination

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉


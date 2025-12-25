# Template Backend

NestJS backend template with TypeORM, PostgreSQL, JWT authentication, and more.

## Setup

```bash
# Install dependencies
npm install

# Setup Husky (already configured in package.json prepare script)
# This will be run automatically on npm install

# Copy environment file
cp env.example .env

# Update .env with your database credentials
```

## Development

```bash
# Start development server
npm run start:dev

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## Git Hooks

This project uses Husky for git hooks:

- **pre-commit**: Runs lint-staged (prettier + eslint) on staged files
- **commit-msg**: Validates commit messages using conventional commits

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert a previous commit

**Examples:**

```
feat(users): add user authentication
fix(auth): resolve JWT token expiration issue
docs: update API documentation
refactor(database): optimize query performance
```

## Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Create empty migration
npm run migration:create -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## Code Quality

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit and commit-msg
- **Commitlint**: Commit message validation

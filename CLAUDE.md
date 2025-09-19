# Claude Development Guidelines

## Post-Edit Requirements

**CRITICAL**: After making any code changes, you MUST immediately run:
```bash
npm run check:all
```
This ensures all edits pass TypeScript checking and linting before proceeding with any other tasks.

## Pre-Commit Checklist

**IMPORTANT**: Before committing any changes, you MUST run these commands to ensure code quality and prevent TypeScript errors on Vercel:

### Required Checks (Run in Order)

1. **TypeScript Type Checking**
   ```bash
   npm run typecheck
   ```
   This ensures all TypeScript types are correct and will not break the build on Vercel.

2. **Build-Safe Check (REQUIRED BEFORE COMMIT)**
   ```bash
   npm run check:all
   ```
   This runs TypeScript checking and critical error checking. **This MUST pass before pushing code.**

3. **Strict Linting (Optional for code quality)**
   ```bash
   npm run check:strict
   ```
   This includes all warnings and helps maintain code quality during development.

### Auto-Fix Commands

If you encounter formatting issues:
```bash
npm run format
```

For a complete fix attempt:
```bash
npm run check:fix
```

## Build Testing

Before pushing significant changes, test the production build locally:
```bash
npm run build
```

This command will:
1. Run TypeScript type checking
2. Run build-safe linting (errors only, warnings allowed)
3. Build the Next.js application

If the build fails, the deployment to Vercel will also fail.

## Project Structure

- **TypeScript**: Strict mode enabled with `noEmit` for type checking only
- **Linting**: Biome for code quality and formatting
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v4

## Git Hooks

This project uses Husky for Git hooks:
- **Pre-commit**: Automatically runs TypeScript checks and linting
- Files are auto-formatted using lint-staged

## CI/CD Pipeline

GitHub Actions are configured to:
1. Run TypeScript type checking on every PR
2. Run linting on every PR
3. Attempt a test build
4. Block merging if any checks fail

## Common Issues and Solutions

### TypeScript Errors
- Always check for missing type definitions: `npm install --save-dev @types/[package-name]`
- Ensure all async route handlers properly handle params: `const params = await props.params`
- Use proper error handling with type guards instead of assuming error types

### Import Errors
- Use absolute imports with `@/` prefix for consistency
- Ensure all imports have proper type definitions

### Build Failures
- Check environment variables are properly configured
- Ensure all dependencies are listed in package.json
- Verify database connections and migrations are up to date

## Emergency Commands

If you need to bypass checks temporarily (NOT RECOMMENDED):
```bash
# Skip pre-commit hooks (use sparingly)
git commit --no-verify -m "message"

# Build without type checking (for debugging only)
next build --turbopack
```

## Contact for Issues

If you encounter persistent issues with the TypeScript setup or build process, check:
1. Node version compatibility (requires Node 20+)
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
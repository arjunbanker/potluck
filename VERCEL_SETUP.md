# Vercel Deployment Setup

This project includes GitHub Actions workflows for automatic Vercel deployments. However, you need to configure secrets first.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Your project linked to Vercel

## Setup Instructions

### 1. Link Your Project to Vercel

If you haven't already linked your project:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link
```

This will create a `.vercel` directory with a `project.json` file containing your project IDs.

### 2. Get Your Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token (you won't be able to see it again!)

### 3. Add Secrets to GitHub

Go to your repository settings: https://github.com/arjunbanker/potluck/settings/secrets/actions

Add these repository secrets:

1. **VERCEL_TOKEN**: The token you created in step 2
2. **VERCEL_ORG_ID**: Found in `.vercel/project.json` (the `orgId` field)
3. **VERCEL_PROJECT_ID**: Found in `.vercel/project.json` (the `projectId` field)

### 4. Test the Deployment

Once configured, the GitHub Actions workflow will:
- Run TypeScript checks on every push
- Deploy preview builds for non-main branches
- Show deployment URLs in the GitHub Actions logs

## Workflow Behavior

The workflow is designed to be non-blocking:
- TypeScript and linting checks always run
- Vercel deployment only runs if secrets are configured
- Missing secrets will show a warning but won't fail the workflow

## Manual Deployment

If you prefer to deploy manually:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Troubleshooting

### "No existing credentials found" Error
This means the VERCEL_TOKEN secret is not configured in GitHub. Follow step 3 above.

### Build Failures
Check that:
1. All environment variables are set in Vercel dashboard
2. Database connection strings are valid
3. All dependencies are in package.json (not devDependencies)

### TypeScript Errors
Run locally first:
```bash
npm run typecheck
npm run check:all
```

## Environment Variables

Make sure these are set in your Vercel project settings:
- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- Email configuration variables (if using magic links)
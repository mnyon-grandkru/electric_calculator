# Deployment Guide for GitHub Pages

## Prerequisites
- GitHub account
- Git installed locally

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it `electric_calculator` (or your preferred name)
4. Choose Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/electric_calculator.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

## Step 4: Enable GitHub Actions

The deployment workflow will automatically run when you push to `main` or `master` branch.

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

## Step 5: Trigger Deployment

The workflow will automatically deploy when you push to main. To trigger it manually:

```bash
git push origin main
```

Or make a small change and push:

```bash
echo "# Deployment ready" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push origin main
```

## Step 6: Verify Deployment

1. Go to **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (green checkmark)
4. Go to **Settings** → **Pages**
5. Your site will be available at: `https://YOUR_USERNAME.github.io/electric_calculator/`

## Troubleshooting

### Build fails
- Check the **Actions** tab for error messages
- Ensure `package.json` has all dependencies listed
- Verify Node.js version in workflow matches your local version

### Site shows 404
- Wait a few minutes after deployment completes
- Check that the base path in `vite.config.ts` matches your repository name
- Verify GitHub Pages is enabled and pointing to `gh-pages` branch

### Assets not loading
- Ensure `base` in `vite.config.ts` is set to `/electric_calculator/` (or your repo name)
- Clear browser cache and try again

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
npm run build
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/YOUR_USERNAME/electric_calculator.git
git push -u origin gh-pages
```

Then enable GitHub Pages to use the `gh-pages` branch.


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

## Step 7: Configure Custom Domain (Optional)

If you want to use a custom domain (e.g., `calculator.yourdomain.com`):

### 7.1: Add Custom Domain in GitHub

1. Go to your repository → **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `calculator.yourdomain.com`)
3. Check **Enforce HTTPS** (recommended)
4. Click **Save**

### 7.2: Update DNS Records

You need to add DNS records with your domain provider. Choose one method:

#### Option A: CNAME Record (Subdomain - Recommended)

If using a subdomain like `calculator.yourdomain.com`:

1. Log into your domain registrar/DNS provider (e.g., Cloudflare, Namecheap, GoDaddy, Google Domains)
2. Navigate to DNS management
3. Add a new **CNAME** record:
   - **Name/Host**: `calculator` (or your subdomain)
   - **Value/Target**: `YOUR_USERNAME.github.io`
   - **TTL**: `3600` (or default)
4. Save the record

**Example:**
```
Type: CNAME
Name: calculator
Value: yourusername.github.io
TTL: 3600
```

#### Option B: A Records (Root Domain)

If using the root domain like `yourdomain.com`:

1. Log into your DNS provider
2. Add **four A records** pointing to GitHub Pages IPs:
   - **Name**: `@` (or leave blank for root domain)
   - **Type**: `A`
   - **Value**: `185.199.108.153`
   - **TTL**: `3600`
   
   Repeat for these IPs:
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

**Example:**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

**Note:** GitHub Pages IP addresses may change. Check [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) for current IPs.

### 7.3: Update Vite Config for Custom Domain

If using a custom domain, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // Change from '/electric_calculator/' to '/' for custom domain
  // ... rest of config
});
```

Then rebuild and redeploy:

```bash
npm run build
git add vite.config.ts dist/
git commit -m "Update base path for custom domain"
git push origin main
```

### 7.4: Verify DNS Propagation

1. Wait 5-60 minutes for DNS to propagate
2. Check DNS propagation: https://www.whatsmydns.net/
3. Verify GitHub Pages recognizes your domain:
   - Go to **Settings** → **Pages**
   - You should see a green checkmark next to your domain
4. Visit your custom domain in a browser

### 7.5: SSL Certificate

GitHub automatically provisions SSL certificates for custom domains:
- Usually takes a few minutes to a few hours
- Ensure **Enforce HTTPS** is enabled in Pages settings
- Certificate is automatically renewed by GitHub

## Troubleshooting

### Build fails
- Check the **Actions** tab for error messages
- Ensure `package.json` has all dependencies listed
- Verify Node.js version in workflow matches your local version

### Site shows 404
- Wait a few minutes after deployment completes
- Check that the base path in `vite.config.ts` matches your repository name (or `/` for custom domain)
- Verify GitHub Pages is enabled and pointing to `gh-pages` branch

### Assets not loading
- Ensure `base` in `vite.config.ts` is set correctly:
  - `/electric_calculator/` for GitHub Pages subdomain
  - `/` for custom domain
- Clear browser cache and try again

### Custom domain not working
- **DNS not propagated**: Wait up to 48 hours (usually 5-60 minutes)
- **Wrong DNS record type**: Verify CNAME for subdomain or A records for root domain
- **GitHub Pages not recognizing domain**: 
  - Check domain is entered correctly in Settings → Pages
  - Ensure DNS records point to correct GitHub Pages address
  - Wait for DNS propagation to complete
- **SSL certificate issues**: 
  - Wait for GitHub to provision certificate (can take hours)
  - Ensure domain is verified in GitHub Pages settings
  - Check that DNS records are correct
- **Base path mismatch**: Update `vite.config.ts` base path to `/` for custom domains

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


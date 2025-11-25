# GitHub Pages Setup Instructions

Your code has been pushed to: https://github.com/mnyon-grandkru/electric_calculator

## Next Steps to Enable GitHub Pages:

### 1. Enable GitHub Actions (if not already enabled)
1. Go to: https://github.com/mnyon-grandkru/electric_calculator/settings/actions
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### 2. Enable GitHub Pages
1. Go to: https://github.com/mnyon-grandkru/electric_calculator/settings/pages
2. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Click **Save**

### 3. Wait for Deployment
- The GitHub Actions workflow will automatically run and deploy to the `gh-pages` branch
- Check the Actions tab: https://github.com/mnyon-grandkru/electric_calculator/actions
- Wait for the workflow to complete (usually 2-5 minutes)

### 4. Access Your Site
Once deployment completes, your site will be available at:
- **GitHub Pages URL**: https://mnyon-grandkru.github.io/electric_calculator/

### Troubleshooting
- If the workflow fails, check the Actions tab for error messages
- Ensure GitHub Actions is enabled in repository settings
- Verify the workflow has write permissions


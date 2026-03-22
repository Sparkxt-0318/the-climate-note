# Legal Documents Hosting

This folder contains the legal documents (Privacy Policy and Terms of Service) for The Climate Note app, ready to be deployed as a static site.

## 📁 Contents

- `index.html` - Landing page with links to legal documents
- `privacy-policy.html` - Privacy Policy (HTML version)
- `terms-of-service.html` - Terms of Service (HTML version)
- `convert-md-to-html.cjs` - Script to regenerate HTML from markdown
- `vercel.json` - Vercel deployment configuration

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - 2 minutes)

```bash
# From the legal-docs directory
cd legal-docs
vercel deploy --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name: the-climate-note-legal
# - Directory: ./
# - Override settings? No
```

Your URLs will be:
- `https://the-climate-note-legal.vercel.app/`
- `https://the-climate-note-legal.vercel.app/privacy-policy`
- `https://the-climate-note-legal.vercel.app/terms-of-service`

### Option 2: GitHub Pages (5 minutes)

```bash
# Create gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
cp legal-docs/* .
git add .
git commit -m "Deploy legal documents"
git push -u origin gh-pages

# Enable in GitHub Settings → Pages
# URL: https://Sparkxt-0318.github.io/the-climate-note/
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from legal-docs
cd legal-docs
netlify deploy --prod
```

## 📝 Updating Documents

When you update the markdown files in the root directory:

```bash
# Regenerate HTML
cd legal-docs
node convert-md-to-html.cjs

# Redeploy
vercel deploy --prod
```

## 🔗 App Store Connect

Once deployed, add the URLs to App Store Connect:

1. Go to App Store Connect
2. Select your app → App Store tab
3. Scroll to "App Privacy" section
4. Add Privacy Policy URL: `https://your-domain.vercel.app/privacy-policy`
5. (Optional) Add Terms of Service link in app description

## ✅ Checklist

- [ ] Deploy to Vercel/GitHub Pages/Netlify
- [ ] Test all links work (/, /privacy-policy, /terms-of-service)
- [ ] Verify HTTPS is enabled
- [ ] Add URL to App Store Connect
- [ ] (Optional) Add custom domain

## 📞 Support

If you have questions about deployment:
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Guide](https://pages.github.com)
- [Netlify Docs](https://docs.netlify.com)

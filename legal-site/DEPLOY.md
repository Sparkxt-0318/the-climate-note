# Deploy Legal Documents to Vercel

## ✅ Files Ready
All legal documents are prepared and ready for deployment:
- `index.html` - Landing page with links to legal docs
- `privacy.html` - Privacy Policy (updated March 22, 2026)
- `terms.html` - Terms of Service (updated March 22, 2026)
- `styles.css` - Professional styling
- `vercel.json` - Configuration

## 🚀 Deploy to Vercel (2 minutes)

### Option 1: Vercel CLI (Recommended)

1. **Login to Vercel** (one-time setup):
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate with your Vercel account.

2. **Deploy from this directory**:
   ```bash
   cd legal-site
   vercel --prod
   ```

3. **Done!** You'll get a production URL like:
   ```
   https://climate-note-legal.vercel.app
   ```

### Option 2: Vercel Dashboard (No CLI needed)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Click "Import" and select "Upload files"
4. Drag and drop all files from the `legal-site/` folder:
   - index.html
   - privacy.html
   - terms.html
   - styles.css
   - vercel.json
5. Click "Deploy"
6. Wait 30 seconds for deployment to complete
7. Copy your production URL

### Option 3: Git-based Deployment

1. Push the `legal-site/` folder to a GitHub repository
2. Connect the repo to Vercel via the dashboard
3. Vercel will auto-deploy on every push

## 📋 After Deployment

1. **Copy your production URL** (e.g., `https://your-project.vercel.app`)

2. **Test the links**:
   - Privacy Policy: `https://your-project.vercel.app/privacy`
   - Terms of Service: `https://your-project.vercel.app/terms`

3. **Use these URLs in App Store Connect**:
   - Privacy Policy URL: `https://your-project.vercel.app/privacy`
   - Terms of Service URL: `https://your-project.vercel.app/terms`

## 🎯 What to Deploy

Deploy everything in the `legal-site/` directory:
```
legal-site/
├── index.html         ← Landing page
├── privacy.html       ← Privacy Policy page
├── terms.html         ← Terms of Service page
├── styles.css         ← Styles for all pages
└── vercel.json        ← Vercel configuration
```

## ⚡ Quick Commands

```bash
# From the legal-site directory:
cd /home/user/the-climate-note/legal-site

# Login to Vercel (one-time)
vercel login

# Deploy to production
vercel --prod

# That's it!
```

## 🔗 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Pricing](https://vercel.com/pricing) (Free tier is perfect for this!)

---

**Next Step:** Deploy to Vercel and copy the production URL for App Store Connect! 🚀

# 🚀 Deploy Legal Documents to Vercel

## Quick Start (5 minutes)

### Step 1: Pull Latest Changes
```bash
# On your Mac
cd /path/to/the-climate-note
git pull origin claude/climate-note-platform-DR212
```

### Step 2: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### Step 3: Deploy
```bash
# Navigate to legal-docs folder
cd legal-docs

# Deploy to Vercel
vercel deploy --prod

# Follow the prompts:
# 1. "Set up and deploy?" → Yes
# 2. "Which scope?" → Select your account
# 3. "Link to existing project?" → No
# 4. "What's your project's name?" → the-climate-note-legal (or any name)
# 5. "In which directory is your code located?" → ./
# 6. "Override settings?" → No

# Wait 30 seconds for deployment...
```

### Step 4: Copy Your URLs

After deployment completes, you'll see:

```
✅ Production: https://the-climate-note-legal.vercel.app [copied to clipboard]
```

**Your Legal Document URLs:**
- 🏠 **Landing Page:** `https://the-climate-note-legal.vercel.app`
- 🔒 **Privacy Policy:** `https://the-climate-note-legal.vercel.app/privacy-policy`
- 📋 **Terms of Service:** `https://the-climate-note-legal.vercel.app/terms-of-service`

---

## Step 5: Test Your URLs

Open each URL in a browser to verify:
- [ ] Landing page loads with both links
- [ ] Privacy Policy displays correctly
- [ ] Terms of Service displays correctly
- [ ] All pages are mobile-responsive
- [ ] HTTPS is enabled (🔒 in address bar)

---

## Step 6: Add to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → The Climate Note → App Store tab
3. Scroll to **"App Privacy"** section
4. Click **"Edit"** next to Privacy Policy
5. Paste: `https://the-climate-note-legal.vercel.app/privacy-policy`
6. Save

---

## Alternative: GitHub Pages (If Vercel doesn't work)

```bash
# From the-climate-note root directory
git checkout --orphan gh-pages
git rm -rf .
cp legal-docs/*.html .
git add *.html
git commit -m "Deploy legal docs"
git push -u origin gh-pages

# Then enable in GitHub:
# Settings → Pages → Source: gh-pages branch → Save
# URL will be: https://Sparkxt-0318.github.io/the-climate-note/
```

---

## Troubleshooting

### "Command not found: vercel"
```bash
npm install -g vercel
# or
sudo npm install -g vercel
```

### "No access to this team"
Choose your personal account instead of team account when prompted.

### "Authentication failed"
```bash
vercel logout
vercel login
# Follow the email verification link
vercel deploy --prod
```

### Want to redeploy after changes?
```bash
cd legal-docs
node convert-md-to-html.cjs  # Regenerate HTML from markdown
vercel deploy --prod          # Deploy updated files
```

---

## ✅ Success Checklist

After deployment:
- [ ] Received Vercel deployment URL
- [ ] Tested all 3 pages load correctly
- [ ] HTTPS is working (green lock icon)
- [ ] Mobile responsive (test on phone)
- [ ] Added Privacy Policy URL to App Store Connect
- [ ] Bookmarked URLs for future reference

---

## 📞 Next Steps

Once deployed, update your App Store submission checklist:
- ✅ Privacy policy hosted at public URL
- ✅ Terms of Service created and hosted
- ⏳ Continue with app icons and screenshots

You're one step closer to App Store submission! 🎉

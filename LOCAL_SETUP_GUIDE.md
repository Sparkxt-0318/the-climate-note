# 🚀 Climate Note - Local Setup Guide

## 📋 Prerequisites

Before starting, make sure you have:
- **macOS** (required for iOS development)
- **Xcode** installed from Mac App Store
- **Node.js** (v18 or later)
- **Apple Developer Account** ($99/year for App Store)

## 🛠️ Step 1: Create New Project Locally

On your Mac, open Terminal and run:

```bash
# Create project directory
mkdir climate-note-app
cd climate-note-app

# Initialize new React + TypeScript project
npm create vite@latest . -- --template react-ts
npm install

# Install required dependencies
npm install @supabase/supabase-js@^2.57.4 lucide-react@^0.344.0

# Install Capacitor for iOS
npm install @capacitor/core@^7.4.3 @capacitor/cli@^7.4.3
npm install @capacitor/ios@^7.4.3 @capacitor/app@^7.1.0
npm install @capacitor/local-notifications@^7.0.3 @capacitor/push-notifications@^7.0.3
npm install @capacitor/splash-screen@^7.0.3 @capacitor/status-bar@^7.0.3

# Install dev dependencies
npm install -D tailwindcss@^3.4.1 postcss@^8.4.35 autoprefixer@^10.4.18

# Initialize Tailwind CSS
npx tailwindcss init -p
```

## 🎨 Step 2: Configure Tailwind CSS

Replace the content of `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Replace the content of `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## ⚡ Step 3: Initialize Capacitor

```bash
# Initialize Capacitor
npx cap init "The Climate Note" "com.theclimatenote.app"

# Add iOS platform
npx cap add ios

# Build the web app
npm run build

# Sync to iOS
npx cap sync ios
```

## 📱 Step 4: Open in Xcode

```bash
# Open iOS project in Xcode
npx cap open ios
```

## 🔧 Step 5: Configure Environment

Create `.env` file in your project root:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 📋 Step 6: Copy Source Code

You'll need to copy the source code from your cloud project. The main files you need are:

### Core App Files:
- `src/App.tsx`
- `src/main.tsx`
- `src/types/index.ts`
- `src/lib/supabase.ts`

### Components:
- `src/components/LandingPage.tsx`
- `src/components/Dashboard.tsx`
- `src/components/Header.tsx`
- `src/components/ArticleView.tsx`
- `src/components/NotebookView.tsx`
- `src/components/ArchiveView.tsx`
- `src/components/AboutView.tsx`
- `src/components/AdminPanel.tsx`
- `src/components/NotificationSettings.tsx`
- `src/components/Tutorial.tsx`
- `src/components/PasswordReset.tsx`
- `src/components/PrivacyPolicy.tsx`
- `src/components/TermsOfService.tsx`
- `src/components/ui/Toast.tsx`

### Capacitor Integration:
- `src/capacitor-plugins.ts`
- `src/hooks/useNotifications.ts`
- `src/hooks/useCapacitorNotifications.ts`

### Configuration Files:
- `capacitor.config.json`
- `public/manifest.json`
- `public/sw.js`

## 🎯 Step 7: Test Your App

```bash
# Start development server
npm run dev

# In another terminal, sync changes to iOS
npm run build && npx cap sync ios

# Open in Xcode
npx cap open ios
```

## 📱 Step 8: Configure in Xcode

1. **Select your Apple Developer team**
2. **Test on iOS Simulator**
3. **Add app icons** (1024x1024 required)
4. **Archive for App Store** when ready

## 🚀 Ready for App Store!

Once everything is working:
1. **Archive your app** (Product → Archive)
2. **Upload to App Store Connect**
3. **Complete app listing**
4. **Submit for review**

---

## 🆘 Need Help?

If you run into issues:
1. **Check Node.js version**: `node --version` (should be 18+)
2. **Clear caches**: `npm run build && npx cap sync ios`
3. **Restart Xcode** if builds fail
4. **Clean build folder** in Xcode: Product → Clean Build Folder

Your Climate Note app will be ready for the App Store! 🌱📱
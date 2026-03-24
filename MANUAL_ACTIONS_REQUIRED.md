# 🎯 Manual Actions Required for App Store Submission

**Created:** March 24, 2026
**Status:** Ready for your action!

---

## ✅ What's Already Done

I've completed all the technical configuration:

- ✅ **Version updated to 1.0.0** in package.json
- ✅ **Privacy Policy & Terms of Service** ready in `/docs` folder
- ✅ **Info.plist updated** with notification permissions
- ✅ **Capacitor config verified** - all settings correct
- ✅ **GitHub Pages structure created** for hosting legal docs

---

## 🔴 CRITICAL - Actions You Must Complete

### **1. Enable GitHub Pages (5 minutes)** 🌐

**Purpose:** Host your Privacy Policy and Terms of Service at public URLs

**Steps:**
1. Go to your GitHub repository: https://github.com/Sparkxt-0318/the-climate-note
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: **main**
   - Folder: **/docs**
5. Click **Save**
6. Wait 2-3 minutes for deployment
7. Visit: `https://Sparkxt-0318.github.io/the-climate-note/`

**Your URLs will be:**
- Privacy Policy: `https://Sparkxt-0318.github.io/the-climate-note/privacy`
- Terms of Service: `https://Sparkxt-0318.github.io/the-climate-note/terms`
- Landing Page: `https://Sparkxt-0318.github.io/the-climate-note/`

**Save these URLs** - you'll need them for App Store Connect!

---

### **2. Create App Icons (1-2 hours)** 🎨

**Status:** ❌ **BLOCKING** - No icons exist yet

Your app currently has NO icons. This is required before submission.

**Option A: Quick Design with Canva (Recommended)**

1. Go to [Canva.com](https://canva.com) (free account)
2. Create **Custom Size: 1024×1024 pixels**
3. Design your icon:
   - Use emerald green (#059669) as background or accent
   - Add a notebook or climate-related icon
   - Keep it simple and recognizable when small
   - **NO transparency** (must have solid background)
   - **NO text/words** (optional, but keep minimal)
4. Export as **PNG** (highest quality)
5. Save as `app-icon-1024.png`

**Option B: Hire a Designer (Fiverr/Upwork)**
- Search "app icon design"
- Budget: $20-50 for quick turnaround
- Provide them: emerald green theme, climate/notebook concept

**Generate All Sizes:**

1. Go to [AppIcon.co](https://www.appicon.co)
2. Upload your 1024×1024 PNG
3. Select **iOS** platform
4. Click **Generate**
5. Download the ZIP file
6. Extract and copy ALL files to:
   ```
   ios/App/App/Assets.xcassets/AppIcon.appiconset/
   ```
7. **Important:** Keep the existing `Contents.json` file in that folder

**Verify:**
```bash
ls ios/App/App/Assets.xcassets/AppIcon.appiconset/
# Should show: Contents.json + multiple PNG files
```

---

### **3. Build and Test in Xcode (1-2 hours)** 🔨

**Purpose:** Make sure your app actually works before submitting

**Steps:**

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build the web app
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Open in Xcode
npx cap open ios
```

**In Xcode:**

1. **Select Device:**
   - Click device dropdown (top bar, near play button)
   - Choose **iPhone 15 Pro Max** (or any recent simulator)

2. **Clean Build:**
   - Menu: **Product → Clean Build Folder** (Shift+Cmd+K)
   - Wait for completion

3. **Update Version Numbers:**
   - Click **App** in left sidebar (blue icon)
   - Select **App** target
   - Go to **General** tab
   - Update:
     - **Version:** 1.0.0
     - **Build:** 1

4. **Build:**
   - Menu: **Product → Build** (Cmd+B)
   - **Check for errors** in bottom panel
   - If errors occur, read them carefully and fix

5. **Run:**
   - Click **Play button** (▶️) or press Cmd+R
   - Wait for simulator to boot and app to launch

**Test Everything:**

- [ ] App launches without crashing
- [ ] Splash screen appears (emerald green)
- [ ] Login/signup flow works
- [ ] Can view today's article
- [ ] Can write and save a note
- [ ] Streak counter updates
- [ ] Community notebook loads
- [ ] Settings page accessible
- [ ] Can toggle notification preferences

**If app crashes:**
- Check the **Console** in Xcode (bottom panel)
- Look for red error messages
- Common issues:
  - Missing environment variables (.env file)
  - Supabase connection issues
  - Missing dependencies

---

### **4. Take App Screenshots (2-3 hours)** 📸

**Required Sizes:**

You need screenshots for **3 device sizes**:

#### **iPhone 6.7" (iPhone 15 Pro Max)**
- Size: **1290 × 2796 pixels**
- Minimum: **3 screenshots**
- Recommended: 5-8 screenshots

#### **iPhone 6.5" (iPhone 11 Pro Max)**
- Size: **1242 × 2688 pixels**
- Minimum: **3 screenshots**

#### **iPad Pro 12.9" (3rd gen or later)**
- Size: **2048 × 2732 pixels**
- Minimum: **3 screenshots**

**How to Capture:**

1. **In Xcode Simulator:**
   - Select **iPhone 15 Pro Max** as device
   - Run your app (Cmd+R)
   - Navigate to each screen you want to capture
   - **Cmd+S** to save screenshot (saves to Desktop)
   - Screenshots are automatically the correct size!

2. **Repeat for other devices:**
   - Switch to **iPhone 11 Pro Max**
   - Run and capture same screens
   - Switch to **iPad Pro 12.9"**
   - Run and capture same screens

**Screenshot Ideas (in order):**

1. **Today's Article** - Main dashboard showing daily climate story
2. **Writing Note** - User writing their action commitment
3. **Streak Progress** - Gamification with fire emoji and streak count
4. **Community Notebook** - Grid of user profiles with shared notes
5. **Article Details** - Full article view with read button
6. **Settings** - Notification preferences and account settings

**Organize Your Screenshots:**

Create folders on your Desktop:
```
App-Screenshots/
├── iPhone-6.7/
│   ├── 1-dashboard.png
│   ├── 2-writing-note.png
│   ├── 3-streak.png
│   └── ...
├── iPhone-6.5/
│   └── ...
└── iPad-12.9/
    └── ...
```

**Pro Tips:**
- Use sample data that looks good (complete streaks, multiple notes)
- Take screenshots in **light mode** (more visible)
- Avoid showing personal information
- Make sure UI looks polished (no loading states)

---

### **5. Set Up App Store Connect (30 minutes)** 🍎

**Steps:**

1. **Go to App Store Connect:**
   - Visit: [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Sign in with your Apple Developer account

2. **Create New App:**
   - Click **My Apps**
   - Click **+** button (top left)
   - Select **New App**

3. **Fill In App Information:**
   ```
   Platforms: ☑ iOS
   Name: The Climate Note
   Primary Language: English (U.S.)
   Bundle ID: com.theclimatenote.app
   SKU: CLIMATE-NOTE-2026
   User Access: Full Access
   ```

4. **Click Create**

---

### **6. Complete App Store Listing (45 minutes)** 📝

**In App Store Connect, under your new app:**

#### **App Information Tab:**

**Category:**
- Primary: **Education**
- Secondary: **News**

**Privacy Policy URL:**
```
https://Sparkxt-0318.github.io/the-climate-note/privacy
```

**Terms of Service URL (Optional but recommended):**
```
https://Sparkxt-0318.github.io/the-climate-note/terms
```

**Support URL:**
```
https://github.com/Sparkxt-0318/the-climate-note
```

#### **Pricing and Availability:**
- Price: **Free**
- Available in: **All Countries**

#### **App Privacy (Critical!):**

Click **Set Up App Privacy** and answer:

**Data Collection:**
- ✅ Yes, we collect data

**Data Types:**
1. **Contact Info**
   - ☑ Email Address
   - Purpose: App Functionality, Analytics
   - Linked to user: Yes
   - Used for tracking: No

2. **Identifiers**
   - ☑ User ID
   - ☑ Device ID
   - Purpose: App Functionality, Analytics
   - Linked to user: Yes
   - Used for tracking: No

3. **User Content**
   - ☑ Other User Content (climate action notes)
   - Purpose: App Functionality
   - Linked to user: Yes
   - Used for tracking: No

4. **Usage Data**
   - ☑ Product Interaction
   - Purpose: Analytics, App Functionality
   - Linked to user: Yes
   - Used for tracking: No

**Third-Party Partners:**
- ☑ Yes, we share data with Supabase for app functionality

#### **Prepare for Submission Tab:**

**App Review Information:**
```
First Name: [Your First Name]
Last Name: [Your Last Name]
Phone Number: [Your Phone]
Email: [Your Email]
```

**Demo Account (CRITICAL!):**

You MUST provide a test account for Apple reviewers.

**Create a demo account in your app with sample data:**
- Email: `appreviewer@theclimatenote.app` (or any test email)
- Password: `TestPass2026!`

**In App Store Connect, enter:**
```
Demo Account Required: Yes
Username: appreviewer@theclimatenote.app
Password: TestPass2026!
```

**Notes to Reviewer:**
```
Thank you for reviewing The Climate Note!

This app helps users build daily climate action habits through:
- Daily environmental articles
- Personal action notes
- Streak tracking system
- Community sharing features

The demo account has sample data including:
- A 5-day reading streak
- Example action notes
- Access to all features

To test the app:
1. Launch the app
2. Login with provided credentials
3. View today's article
4. Write an action note
5. Check streak counter
6. View community notebook

All features work offline-first and sync when connected.

Please reach out if you have any questions!
```

#### **Version Information:**

**What's New in This Version:**
```
🌍 Welcome to The Climate Note v1.0!

Transform environmental awareness into daily action:

📖 Daily Climate Articles
Read curated environmental stories every day

📝 Personal Action Notes
Turn reading into commitment with written goals

🔥 Streak System
Build sustainable habits with gamified progress

👥 Community Notebook
Share and discover climate actions with others

Start your climate journey today!
```

**App Description:**
```
Transform environmental awareness into daily action with The Climate Note. 📓

📖 DAILY ENVIRONMENTAL STORIES
Read fresh insights about climate change, sustainability, and environmental solutions every day. Stay informed about the planet's biggest challenges and discover actionable solutions.

📝 PERSONAL ACTION NOTES
Turn reading into commitment by writing what you'll do differently after each article. Your notes become a personal journal of climate action and sustainable choices.

🔥 STREAK SYSTEM
Build sustainable habits with our gamified streak system that keeps you motivated. Track your daily reading and note-writing streaks with visual progress indicators.

👥 COMMUNITY NOTEBOOK
See what actions others are taking and get inspired by the community. Share your commitments and celebrate collective climate action.

🔔 SMART REMINDERS
Never miss your daily climate note with customizable notifications. Choose the best time for your daily environmental check-in.

✨ FEATURES:
• Fresh daily articles from reliable environmental sources
• Beautiful, distraction-free reading experience
• Quick note-taking for your climate commitments
• Streak tracking with fire emoji progress indicators
• Community feed of shared climate actions
• Customizable notification reminders
• Clean, modern interface
• Offline-first design
• Secure, private account system

🌱 PERFECT FOR:
• Environmental enthusiasts building green habits
• Students learning about climate change and sustainability
• Anyone wanting to make a positive environmental impact
• People interested in joining a climate-conscious community
• Individuals tracking their sustainability journey

Join thousands of users taking daily climate action. Every small step counts toward a sustainable future. 🌍

---

The Climate Note is free to use with no ads or premium tiers. We believe climate education and action should be accessible to everyone.

Questions or feedback? Contact us at support@theclimatenote.app
```

**Keywords (100 characters max):**
```
climate,environment,sustainability,green,eco,habits,education,news,action,community
```

**Promotional Text (170 characters):**
```
📓 Daily climate articles + personal action notes + gamified streaks = sustainable habits. Start your climate journey today!
```

**App Subtitle (30 characters):**
```
Daily climate action & notes
```

#### **App Previews and Screenshots:**

**iPhone 6.7" Display:**
- Upload your iPhone 15 Pro Max screenshots (drag and drop)
- Order them in the sequence you captured
- First screenshot is most important (shows in App Store preview)

**iPhone 6.5" Display:**
- Upload your iPhone 11 Pro Max screenshots

**iPad Pro 12.9" Display:**
- Upload your iPad screenshots

---

### **7. Archive and Upload to App Store (30-45 minutes)** 🚀

**Prerequisites:**
- ✅ App built successfully in Xcode
- ✅ All screenshots uploaded
- ✅ App Store Connect listing complete
- ✅ Demo account created and provided

**Steps:**

1. **In Xcode:**
   - Close the Simulator if running
   - Select **Any iOS Device (arm64)** from device dropdown
     - Click the device menu (top bar)
     - Scroll to top and select **Any iOS Device (arm64)**

2. **Archive:**
   - Menu: **Product → Archive**
   - Wait 5-10 minutes for archive to complete
   - Archive Organizer window will open automatically

3. **In Archive Organizer:**
   - Select your archive (should be the first/only one)
   - Click **Distribute App** button (blue button)

4. **Distribution Wizard:**
   - **Select method:** App Store Connect → **Next**
   - **Select destination:** Upload → **Next**
   - **App Store Connect distribution options:**
     - ☑ Upload your app's symbols (Recommended)
     - ☑ Manage Version and Build Number (Keep checked)
     - **Next**
   - **Signing options:**
     - Select **Automatically manage signing**
     - **Next**
   - **Review summary:**
     - Check everything looks correct
     - Click **Upload**
   - Wait 10-15 minutes for upload to complete

5. **Verification:**
   - Go back to [App Store Connect](https://appstoreconnect.apple.com)
   - Open your app
   - Go to **TestFlight** tab
   - Wait 10-15 minutes for "Processing" to complete
   - Once processed, you'll see your build appear

---

### **8. Submit for Review (15 minutes)** ✅

**Final Step:**

1. **In App Store Connect:**
   - Go to your app
   - Click **App Store** tab (not TestFlight)
   - Scroll to **Build** section
   - Click **+ Select a build to submit**
   - Choose your uploaded build
   - Click **Done**

2. **Export Compliance:**
   - Does your app use encryption? **Yes** (HTTPS)
   - Is it exempt from regulations? **Yes**
   - Reason: Standard HTTPS encryption only

3. **Content Rights:**
   - ☑ I confirm that I have the necessary rights

4. **Advertising Identifier:**
   - Does this app use the Advertising Identifier? **No**

5. **Review Everything:**
   - Scroll through entire form
   - Verify all information is correct
   - Check screenshots display properly
   - Confirm demo account credentials are correct

6. **Submit:**
   - Click **Add for Review** (top right)
   - Click **Submit to App Review**
   - Confirmation: "Your app is now In Review"

---

## ⏱️ Timeline Summary

| Task | Time | Status |
|------|------|--------|
| Enable GitHub Pages | 5 min | ⏳ TO DO |
| Create app icon | 1-2 hrs | ⏳ TO DO |
| Build & test in Xcode | 1-2 hrs | ⏳ TO DO |
| Take screenshots | 2-3 hrs | ⏳ TO DO |
| Set up App Store Connect | 30 min | ⏳ TO DO |
| Complete app listing | 45 min | ⏳ TO DO |
| Upload build | 30-45 min | ⏳ TO DO |
| Submit for review | 15 min | ⏳ TO DO |
| **Apple Review** | **1-7 days** | ⏳ WAIT |

**Total Active Work:** 6-10 hours
**Total Calendar Time:** 2-10 days (including Apple review)

---

## 🆘 Common Issues & Solutions

### **Issue: "Signing failed" in Xcode**
**Solution:**
1. Xcode → Preferences → Accounts
2. Click your Apple ID
3. Click "Download Manual Profiles"
4. In project settings, select your Team
5. Enable "Automatically manage signing"

### **Issue: "No provisioning profiles found"**
**Solution:**
1. Make sure you're signed in to Xcode with your Apple Developer account
2. Go to developer.apple.com → Certificates, IDs & Profiles
3. Create a new App ID if needed
4. Let Xcode auto-manage signing

### **Issue: "App crashes on launch in simulator"**
**Solution:**
1. Check Console for error messages (View → Debug Area → Show Debug Area)
2. Common causes:
   - Missing .env file with Supabase credentials
   - Network connection issues
   - Missing dependencies (run npm install again)

### **Issue: "Build takes forever"**
**Solution:**
1. Product → Clean Build Folder
2. Close and reopen Xcode
3. Restart your Mac
4. Check available disk space

### **Issue: "Screenshots wrong size"**
**Solution:**
- Don't manually resize screenshots
- Take them directly from Xcode Simulator
- Use the exact device types specified (iPhone 15 Pro Max, etc.)

### **Issue: "GitHub Pages not showing"**
**Solution:**
1. Wait 5-10 minutes after enabling (can take time)
2. Check Settings → Pages shows "Your site is live at..."
3. Clear browser cache
4. Try incognito/private browsing

---

## 📋 Quick Checklist

Before submitting, verify:

- [ ] GitHub Pages enabled and accessible
- [ ] App icons created and added to Xcode
- [ ] App builds without errors
- [ ] App runs in simulator without crashes
- [ ] All features tested and working
- [ ] Screenshots taken for all 3 device sizes
- [ ] Privacy policy URL working
- [ ] App Store Connect account set up
- [ ] App listing complete with description
- [ ] Keywords and category set
- [ ] Privacy questionnaire completed
- [ ] Demo account created and tested
- [ ] Build uploaded to App Store Connect
- [ ] Build selected in App Store tab
- [ ] Submit button clicked

---

## 🎉 You're Almost There!

Once you complete these steps and click "Submit to App Review":

1. **In Review** - Apple will review your app (1-7 days typically)
2. **You'll receive emails** about status changes
3. **If approved** - Your app goes live automatically (or on scheduled date)
4. **If rejected** - Apple will explain why; fix and resubmit

**Good luck! The world needs more climate-conscious people like you.** 🌍💚

---

**Questions?** Contact:
- **Technical issues:** Open GitHub issue
- **App Store questions:** Check [Apple's App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- **Need help?** support@theclimatenote.app (when set up)

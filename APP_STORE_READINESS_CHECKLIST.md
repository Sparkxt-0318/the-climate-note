# 📱 App Store Submission Readiness Checklist - The Climate Note

**Last Updated:** March 22, 2026

---

## ✅ **COMPLETED** (You Already Have These!)

### **Development & Configuration**
- [x] Capacitor iOS platform set up (`ios/` folder exists)
- [x] App bundle ID configured (`com.theclimatenote.app`)
- [x] App name set ("The Climate Note")
- [x] Splash screen configured (emerald green #059669)
- [x] Push notifications configured
- [x] Build scripts ready (`npm run build`)
- [x] Privacy policy created and updated (March 2026)

### **Prerequisites**
- [x] Apple Developer Account ($99/year)
- [x] Mac with Xcode installed
- [x] App icons structure created

---

## 🚨 **CRITICAL - MUST DO BEFORE SUBMISSION**

### **1. App Icons (MISSING)**
**Status:** ❌ Structure exists but PNG files missing

The iOS project expects icons but they don't exist yet. You need:

```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── AppIcon-512@2x.png (1024x1024) ← REQUIRED for App Store
```

**Action Required:**
1. Create or design your app icon (1024x1024 PNG)
   - Emerald green theme (#059669)
   - Climate notebook logo
   - No transparency, no text
2. Use a tool like [AppIcon.co](https://www.appicon.co) to generate all sizes
3. Drop generated icons into `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

**Apple's Required Icon Sizes:**
- 1024x1024 (App Store)
- 180x180 (iPhone @3x)
- 120x120 (iPhone @2x)
- 167x167 (iPad Pro)
- 152x152 (iPad @2x)
- 76x76 (iPad)
- 60x60, 40x40, 29x29, 20x20 (various uses)

---

### **2. App Screenshots (MISSING)**
**Status:** ❌ Not created yet

**Required Screenshots:**

#### **iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max)**
- Size: **1290 × 2796 pixels**
- Minimum: **3 screenshots**
- Recommended: 5-10 screenshots

#### **iPhone 6.5" Display (iPhone 11 Pro Max, XS Max)**
- Size: **1242 × 2688 pixels**
- Minimum: **3 screenshots**

#### **iPad Pro 12.9" (3rd gen)**
- Size: **2048 × 2732 pixels**
- Minimum: **3 screenshots**

**Screenshot Ideas:**
1. **Dashboard/Today's Article** - Show daily climate story with read button
2. **Action Note Writing** - User writing their commitment/note
3. **Streak & Stats** - Gamification with fire emoji and streak counter
4. **Community Notebook** - User circles with shared notes
5. **Settings/Notifications** - Reminder preferences

**How to Create:**
- **Option 1:** Test app in Xcode iOS Simulator → Take screenshots → Resize
- **Option 2:** Use [Figma](https://figma.com) with iPhone mockup templates
- **Option 3:** Use screenshot builder tools like [AppLaunchpad](https://applaunchpad.com)

---

### **3. Privacy Policy Hosting (CRITICAL)**
**Status:** ⚠️ Policy exists but needs public URL

**Your Updated Policy:** `/privacy-policy.md` (fixed March 22, 2026)

**Action Required:**
You MUST host this at a public URL before App Store submission.

**Quick Solutions:**

#### **Option A: GitHub Pages (Free, 5 min setup)**
```bash
# 1. Create gh-pages branch
git checkout --orphan gh-pages

# 2. Keep only privacy policy
git rm -rf .
git checkout main -- privacy-policy.md
mv privacy-policy.md index.md

# 3. Create _config.yml
echo "markdown: kramdown" > _config.yml

# 4. Push
git add .
git commit -m "Add privacy policy page"
git push -u origin gh-pages

# 5. Enable in GitHub Settings → Pages
# URL will be: https://Sparkxt-0318.github.io/the-climate-note/
```

#### **Option B: Vercel Static Page (Free, 2 min setup)**
```bash
# 1. Create privacy-policy folder
mkdir privacy-policy-site
cp privacy-policy.md privacy-policy-site/index.md

# 2. Deploy to Vercel
cd privacy-policy-site
vercel deploy --prod
```

#### **Option C: Google Docs (Quick but not ideal)**
- Convert to Google Doc
- Set sharing to "Anyone with link can view"
- Use shortened URL

**Apple requires:** Privacy policy URL in App Store Connect

---

### **4. Terms of Service (RECOMMENDED)**
**Status:** ❌ Not found

While not strictly required by Apple, it's **highly recommended** to have Terms of Service.

**Action Required:**
1. Create `terms-of-service.md` similar to privacy policy
2. Host alongside privacy policy
3. Link from app (optional but good practice)

---

## ⚙️ **TECHNICAL CHECKS BEFORE BUILD**

### **5. Version Numbers**
**Status:** ⚠️ Currently at 0.0.0

**Update package.json:**
```json
{
  "version": "1.0.0"
}
```

**Update iOS version in Xcode:**
- Marketing Version: `1.0.0`
- Build Number: `1`

---

### **6. Info.plist Requirements**
**Status:** ✅ Basic config exists, ⚠️ May need permissions

**Check if your app uses these features:**

#### **Push Notifications**
Your app has push notifications configured. You may need:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

#### **Privacy Permissions (If needed)**
Check if you need usage descriptions for:
- `NSUserNotificationsUsageDescription` - "We'd like to send you daily climate articles"
- `NSPhotoLibraryUsageDescription` - Only if app saves images

**Action:** Open `ios/App/App/Info.plist` and verify

---

### **7. Build & Test**
**Status:** ❌ Not tested yet

**Before submitting, you MUST:**

```bash
# 1. Clean build
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
# - Product → Clean Build Folder
# - Product → Build
# - Product → Run on Simulator
# - Test ALL features:
#   ✓ Login/signup works
#   ✓ Articles load
#   ✓ Notes can be written
#   ✓ Streak updates
#   ✓ Community notebook shows
#   ✓ Settings work
#   ✓ Notifications can be enabled
```

**Test on Physical Device (Strongly Recommended):**
- More accurate than simulator
- Test actual push notifications
- Verify performance

---

## 📝 **APP STORE CONNECT SETUP**

### **8. App Store Connect Account**
**Status:** ⚠️ Needs setup

**Steps:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with Apple Developer account
3. Click "My Apps" → "+" → "New App"

**App Information:**
- **Platforms:** iOS
- **Name:** The Climate Note
- **Primary Language:** English (U.S.)
- **Bundle ID:** com.theclimatenote.app
- **SKU:** CLIMATE-NOTE-2026
- **User Access:** Full Access

---

### **9. App Store Listing Content**
**Status:** ✅ Content ready (from guides), needs to be entered

**Copy this into App Store Connect:**

#### **App Information**
- **App Name:** The Climate Note
- **Subtitle:** Daily climate action, one note at a time 📝
- **Privacy Policy URL:** [Your hosted URL from step 3]

#### **Category**
- **Primary:** Education
- **Secondary:** News

#### **Age Rating**
- **Rating:** 4+
- **Reasons:** None (clean educational content)

#### **App Description** (4000 character limit)
```
Transform environmental awareness into daily action with The Climate Note. 📓

📖 DAILY ENVIRONMENTAL STORIES
Read fresh insights about climate change, sustainability, and environmental solutions every day.

📝 PERSONAL ACTION NOTES
Turn reading into commitment by writing what you'll do differently after each article.

🔥 STREAK SYSTEM
Build sustainable habits with our gamified streak system that keeps you motivated.

👥 COMMUNITY NOTEBOOK
See what actions others are taking and get inspired by the community.

🔔 SMART REMINDERS
Never miss your daily climate note with customizable notifications.

Perfect for:
• Environmental enthusiasts
• Students learning about sustainability
• Anyone wanting to make a positive impact
• People building eco-friendly habits

Join thousands of users taking daily climate action. Every small step counts toward a sustainable future.
```

#### **Keywords** (100 characters max)
```
climate,environment,sustainability,green,eco,habits,education,news,action,community,notebook
```

#### **Promotional Text** (170 characters, can update without review)
```
📓 Daily climate articles + personal action notes + gamified streaks = sustainable habits. Start your climate journey today!
```

#### **Support URL**
```
https://github.com/Sparkxt-0318/the-climate-note
```

#### **Marketing URL** (Optional)
Your Vercel deployment URL or future marketing site

---

### **10. App Privacy Questionnaire**
**Status:** ❌ Must complete in App Store Connect

Apple requires you to declare what data you collect.

**Based on your app, answer:**

#### **Data Types You Collect:**
- ✅ **Email Address** (for authentication)
- ✅ **Name/Display Name** (optional user profile)
- ✅ **User Content** (climate action notes)
- ✅ **Product Interaction** (streak data, reading habits)
- ✅ **Device ID** (for push notifications)

#### **How Data is Used:**
- ✅ App Functionality
- ✅ Analytics
- ❌ Third-Party Advertising (you don't do this)
- ❌ Developer's Advertising (you don't do this)

#### **Is data linked to user identity?**
- ✅ Yes (email, notes, streaks are linked to user account)

#### **Is data used for tracking?**
- ❌ No (you don't track across apps/websites)

#### **Do you share data with third parties?**
- ⚠️ **Yes** - Supabase (database provider)
  - Purpose: App Functionality
  - Data: Email, notes, user profiles

---

## 🚀 **SUBMISSION PROCESS**

### **11. Archive and Upload**
**Status:** ❌ Ready when steps 1-10 are complete

**Steps:**
```bash
# 1. Final build
npm run build
npx cap sync ios
npx cap open ios

# 2. In Xcode:
# - Select "Any iOS Device (arm64)" as target
# - Product → Archive
# - Wait for archive to complete

# 3. Organizer opens automatically
# - Click "Distribute App"
# - Select "App Store Connect"
# - Select "Upload"
# - Click "Next" through options
# - Click "Upload"

# 4. Wait 10-15 minutes for processing
```

---

### **12. Submit for Review**
**Status:** ❌ After upload completes

**In App Store Connect:**
1. Go to "My Apps" → "The Climate Note"
2. Click "App Store" tab
3. Under "Build", click "+" to select your uploaded build
4. Fill in:
   - Version Number: 1.0.0
   - Copyright: 2026 [Your Name/Company]
   - Review Information:
     - First Name, Last Name
     - Phone Number
     - Email
     - Demo Account (create test account with sample data)
5. Click "Add for Review"
6. Click "Submit to App Review"

---

## ⏱️ **TIMELINE ESTIMATE**

| Task | Time Estimate | Priority |
|------|---------------|----------|
| 1. Create app icons | 1-2 hours | 🔴 CRITICAL |
| 2. Take screenshots | 2-3 hours | 🔴 CRITICAL |
| 3. Host privacy policy | 15 minutes | 🔴 CRITICAL |
| 4. Create Terms of Service | 1 hour | 🟡 RECOMMENDED |
| 5. Update version numbers | 5 minutes | 🟢 EASY |
| 6. Verify Info.plist | 15 minutes | 🟢 EASY |
| 7. Build & test app | 1-2 hours | 🔴 CRITICAL |
| 8. Set up App Store Connect | 30 minutes | 🟢 EASY |
| 9. Enter app listing | 30 minutes | 🟢 EASY |
| 10. Complete privacy questionnaire | 20 minutes | 🟢 EASY |
| 11. Archive and upload | 30 minutes | 🟢 EASY |
| 12. Submit for review | 15 minutes | 🟢 EASY |
| **Apple Review Time** | **1-7 days** | ⏳ WAIT |

**Total Active Work:** 6-10 hours
**Total Calendar Time:** 2-10 days (including Apple review)

---

## 🎯 **PRIORITY ORDER - START HERE**

### **Today (Critical Path):**
1. ✅ Privacy policy updated (DONE!)
2. 🔴 **Create/generate app icons** → Blocks everything
3. 🔴 **Host privacy policy** → Required for submission
4. 🔴 **Build and test in Xcode** → Ensure it works

### **This Week:**
5. 🟡 Take app screenshots
6. 🟡 Create Terms of Service
7. 🟡 Set up App Store Connect listing
8. 🟡 Complete privacy questionnaire

### **When Ready:**
9. 🟢 Archive and upload build
10. 🟢 Submit for review
11. ⏳ Wait for Apple review

---

## 🆘 **POTENTIAL BLOCKERS & SOLUTIONS**

### **Rejection Scenarios:**

#### **"Missing Privacy Policy"**
- **Cause:** URL not accessible or not HTTPS
- **Fix:** Use GitHub Pages or Vercel (both HTTPS)

#### **"App Crashes on Launch"**
- **Cause:** Missing environment variables or Supabase config
- **Fix:** Test thoroughly, check console logs

#### **"Incomplete App Information"**
- **Cause:** Missing screenshots or demo account
- **Fix:** Upload all required screenshots, provide test credentials

#### **"Uses Push Notifications Without Permission"**
- **Cause:** Missing usage description in Info.plist
- **Fix:** Add `NSUserNotificationsUsageDescription`

#### **"Missing Icons"**
- **Cause:** App icons not present in all required sizes
- **Fix:** Use AppIcon generator to create all sizes

---

## 📞 **RESOURCES**

- **App Icon Generator:** https://www.appicon.co
- **Screenshot Tools:** https://screenshots.pro
- **Apple Developer Portal:** https://developer.apple.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Capacitor Docs:** https://capacitorjs.com/docs/ios
- **Review Guidelines:** https://developer.apple.com/app-store/review/guidelines

---

## ✅ **FINAL CHECKLIST (Print This!)**

Before hitting "Submit to App Review":

- [ ] App icons exist and display correctly
- [ ] All 3 screenshot sets uploaded (iPhone 6.7", 6.5", iPad)
- [ ] Privacy policy hosted at public HTTPS URL
- [ ] Terms of Service created (recommended)
- [ ] App builds without errors in Xcode
- [ ] App runs on iOS Simulator without crashes
- [ ] Tested on physical device (recommended)
- [ ] Version set to 1.0.0 (build 1)
- [ ] App description entered in App Store Connect
- [ ] Keywords added
- [ ] Privacy questionnaire completed
- [ ] Demo account created and credentials provided
- [ ] Support URL added
- [ ] Age rating set to 4+
- [ ] Build uploaded and selected
- [ ] All app information saved

**When ALL boxes are checked** → Click "Submit to App Review"

---

🎉 **You're 95% there! The Climate Note is almost ready for the App Store!**

**Next immediate steps:**
1. Generate app icons (1-2 hours)
2. Host privacy policy (15 min)
3. Test build in Xcode (1 hour)

Good luck! 🌍📱📓

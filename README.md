# The Climate Note 📓

Daily climate action, one note at a time. 📝

## About

The Climate Note is an environmental newsletter platform that turns reading into action. Users read daily environmental stories and write personal action notes about what they'll do differently, building sustainable habits through gamified streaks and community engagement.

## Features

- 📖 **Daily Environmental Articles** - Fresh insights and actionable content
- 📝 **Personal Action Notes** - Turn reading into commitment
- 🔥 **Streak System** - Gamified habit building
- 👥 **Community Notebook** - See what others are doing
- 🔔 **Smart Notifications** - Never miss your daily note
- 📱 **Native Mobile App** - Available on iOS App Store

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Mobile**: Capacitor (iOS/Android)
- **Hosting**: Bolt Hosting / Netlify
- **Notifications**: Web Push API + Native Push

## Development

### Web Development
```bash
npm install
npm run dev
```

### iOS App Development
```bash
# Build and open in Xcode
npm run ios:build

# Run on iOS simulator
npm run ios:run

# Sync changes to native app
npm run capacitor:sync
```

## App Store Deployment

### Prerequisites
- Apple Developer Account ($99/year)
- Xcode (Mac required)
- iOS device for testing

### Build Process
1. **Build web app**: `npm run build`
2. **Sync to iOS**: `npx cap sync ios`
3. **Open Xcode**: `npx cap open ios`
4. **Configure signing** in Xcode
5. **Build and archive** for App Store
6. **Submit via App Store Connect**

### App Store Requirements
- ✅ Privacy Policy (data collection)
- ✅ App Icons (multiple sizes)
- ✅ Screenshots for listing
- ✅ App Store description
- ✅ Age rating and categories

## Environment Variables

Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The app uses Supabase with the following tables:
- `articles` - Environmental articles and content
- `user_profiles` - User data and streak tracking
- `user_notes` - Personal action notes
- `note_reactions` - Community encouragement system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Contact

For questions about The Climate Note platform or contributing, please reach out through GitHub issues.

---

**Making environmental action accessible, one note at a time.** 🌱
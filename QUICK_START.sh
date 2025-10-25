#!/bin/bash

# Climate Note - Quick Setup Script
# Run this on your Mac to set up the project locally

echo "🌱 Setting up Climate Note App..."

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script requires macOS for iOS development"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install from https://nodejs.org"
    exit 1
fi

# Create project directory
echo "📁 Creating project directory..."
mkdir -p climate-note-app
cd climate-note-app

# Initialize Vite project
echo "⚡ Initializing React + TypeScript project..."
npm create vite@latest . -- --template react-ts --yes
npm install

# Install dependencies
echo "📦 Installing dependencies..."
npm install @supabase/supabase-js@^2.57.4 lucide-react@^0.344.0
npm install @capacitor/core@^7.4.3 @capacitor/cli@^7.4.3
npm install @capacitor/ios@^7.4.3 @capacitor/app@^7.1.0
npm install @capacitor/local-notifications@^7.0.3 @capacitor/push-notifications@^7.0.3
npm install @capacitor/splash-screen@^7.0.3 @capacitor/status-bar@^7.0.3
npm install -D tailwindcss@^3.4.1 postcss@^8.4.35 autoprefixer@^10.4.18

# Initialize Tailwind
echo "🎨 Setting up Tailwind CSS..."
npx tailwindcss init -p

# Configure Tailwind
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

# Update CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Initialize Capacitor
echo "📱 Setting up Capacitor for iOS..."
npx cap init "The Climate Note" "com.theclimatenote.app"
npx cap add ios

# Create environment file template
cat > .env.example << 'EOF'
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOF

echo ""
echo "✅ Basic setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Copy your source code files from the cloud project"
echo "2. Create .env file with your Supabase credentials"
echo "3. Run: npm run build && npx cap sync ios"
echo "4. Run: npx cap open ios"
echo ""
echo "📁 Project created in: $(pwd)"
echo ""
echo "🚀 Ready to build your Climate Note app for the App Store!"
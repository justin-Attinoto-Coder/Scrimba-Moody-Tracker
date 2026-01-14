# 🌈 Moody - Advanced Mood Tracker App

A **state-of-the-art** mood tracking application with beautiful gradients, advanced animations, and comprehensive features built with Vite, Firebase, and modern CSS.

## ✨ Features

### 🔐 Authentication & Security
- **Multi-Provider Authentication**: Email/Password and Google Sign-In
- **Password Management**: Change your password anytime for enhanced security
- **Account Control**: Delete your account and all associated data
- **Secure Firebase Rules**: Your data is private and protected

### 🎭 Mood Tracking
- **5 Mood Levels**: Track emotions from 😢 to 🤩
- **Custom Notes**: Add personal notes to each mood entry
- **Real-time Updates**: See your moods appear instantly
- **Edit & Delete**: Full control over your mood history

### 📊 Advanced Analytics
- **Statistics Dashboard**: 
  - Total mood entries
  - This week's tracking count
  - Most common mood
  - Current tracking streak
- **Visual Mood Distribution**: Interactive charts showing mood patterns
- **Trend Analysis**: Understand your emotional patterns over time

### 🎨 Beautiful Design
- **Advanced Gradient System**: Dynamic, animated gradients throughout
- **Mood-Based Colors**: Each mood has its own unique gradient
- **Smooth Animations**: Fade-ins, slides, floats, and shimmer effects
- **Glass Morphism**: Modern frosted glass effects
- **Responsive Design**: Perfect on desktop, tablet, and mobile

### 📅 Organization
- **Smart Filtering**: View moods by All, Today, This Week, or This Month
- **History View**: Browse your mood timeline
- **Tab Navigation**: Easy switching between Track, Statistics, and History

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), Advanced CSS3
- **Build Tool**: Vite 7.x (Lightning-fast HMR)
- **Backend**: Firebase Authentication & Firestore
- **Animations**: CSS Keyframes, Transforms, Gradients
- **Deployment**: Optimized for Vercel & Netlify

## 🚀 Quick Start Guide

### Step 1: Clone & Install
```bash
git clone https://github.com/justin-Attinoto-Coder/Scrimba-Moody-Tracker.git
cd Scrimba-Moody-Tracker
npm install
```

### Step 2: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select your project
3. Enable **Authentication** (Email/Password + Google)
4. Create **Firestore Database** (test mode initially)
5. Add these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 3: Configure Environment
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 🎉

## 🎯 How to Use

### Tracking Your Mood
1. **Sign In** with Email or Google
2. **Select** your current mood emoji
3. **Write** an optional note
4. **Save** to track your mood

### Changing Your Password (Security Feature!)
1. Click **⚙️ Settings** button
2. Go to **Change Password** section
3. Enter:
   - Current password
   - New password (min 6 characters)
   - Confirm new password
4. Click **Update Password**
5. ✅ Done! Your password is now stronger

**Pro Tip**: Use a strong, unique password like `MyMoody2026!` or `SecureTracker@123`

### Viewing Statistics
1. Click **📊 Statistics** tab
2. See your:
   - Total entries
   - Weekly count
   - Most common mood
   - Current streak
   - Mood distribution chart

### Managing Your Account
- **Change Password**: Settings → Change Password
- **Delete Account**: Settings → Danger Zone (⚠️ Permanent!)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Go to Settings → Environment Variables
# Add all VITE_FIREBASE_* variables
```

**One-Click Deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/justin-Attinoto-Coder/Scrimba-Moody-Tracker)

### Deploy to Netlify

```bash
# Build the project
npm run build

# Drag & drop the 'dist' folder to Netlify

# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

**Important**: Add your Firebase environment variables in:
- Vercel: Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📂 Project Structure

```
Scrimba-Moody-Tracker/
├── src/
│   ├── main.js          # Firebase logic, authentication, mood tracking
│   └── style.css        # Advanced gradient styles & animations
├── index.html           # UI structure with tabs, modal, statistics
├── .env                 # Firebase configuration (gitignored)
├── .env.example         # Template for environment variables
├── vercel.json          # Vercel deployment config
├── netlify.toml         # Netlify deployment config
├── package.json         # Dependencies & scripts
└── README.md            # This file
```

## 🎓 Scrimba Concepts Applied

This project demonstrates concepts learned in Scrimba courses:

- ✅ **JavaScript Fundamentals**: Event listeners, async/await, DOM manipulation
- ✅ **Firebase Integration**: Authentication, Firestore CRUD operations
- ✅ **CSS Mastery**: Advanced gradients, animations, responsive design
- ✅ **Modern Build Tools**: Vite setup, environment variables
- ✅ **Security Best Practices**: Password management, data protection
- ✅ **UX/UI Design**: Tab navigation, modals, interactive dashboards
- ✅ **State Management**: Tracking user state, real-time updates
- ✅ **Deployment**: Production-ready configuration

## 💡 Advanced Features Explained

### Gradient Animation System
- Uses CSS `@keyframes` for smooth gradient transitions
- Multiple gradient variants for different moods
- `background-size` and `background-position` for animation

### Password Change Security
- Re-authentication required before password change
- Client-side validation (length, matching)
- Firebase secure password update API
- Clear error messages for better UX

### Real-time Statistics
- Calculates metrics from Firestore data
- Streak algorithm tracks consecutive days
- Visual chart representation of mood distribution
- Optimized queries with Firebase indexes

## 🛠️ Troubleshooting

### "Password found in data breach" Warning
This is a browser security feature! It means the password exists in known breach databases. For testing, this is fine. For production:
- Use strong, unique passwords
- Enable Firebase password policy
- The warning protects users, not your app

### Environment Variables Not Loading
- Ensure `.env` is in project root
- Restart dev server after `.env` changes
- Variables must start with `VITE_`
- Don't commit `.env` to Git

### Firebase Permission Denied
- Check Firestore security rules are published
- Verify user is authenticated
- Ensure `userId` field matches current user

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - Free to use for learning and personal projects

## 🙏 Acknowledgments

- **Scrimba** for excellent web development courses
- **Firebase** for backend infrastructure
- **Vite** for blazing-fast development experience
- **You** for building awesome projects!

---

**Built with 🌈 and passion as part of Scrimba learning journey**

Need help? Found a bug? [Open an issue](https://github.com/justin-Attinoto-Coder/Scrimba-Moody-Tracker/issues)!

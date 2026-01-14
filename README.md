# 🌈 Moody - Mood Tracker App

A beautiful, privacy-focused mood tracking application built with Vite, Firebase, and modern CSS gradients.

## Features

- 🔐 **Secure Authentication**: Email/Password and Google Sign-In
- 🎭 **Mood Tracking**: Track your daily emotions with emoji selections
- 📝 **Notes**: Add optional notes to each mood entry
- 📊 **Filtering**: View moods by All, Today, This Week, or This Month
- ✨ **Beautiful UI**: Gradient-based design with smooth animations
- 🔒 **Private**: Your moods are only visible to you

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3 (Gradients & Animations)
- **Build Tool**: Vite
- **Backend**: Firebase Authentication & Firestore
- **Hosting**: Ready for deployment on Vercel, Netlify, or Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Scrimba-Moody-Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Add your Firebase configuration to `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Firestore Security Rules

Add these rules to your Firestore database:

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

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Sign In**: Choose Email/Password or Google Sign-In
2. **Select Mood**: Click on an emoji that represents your current mood
3. **Add Note** (optional): Write a brief note about your feelings
4. **Save**: Click "Save Mood" to store your entry
5. **Filter**: Use the filter buttons to view moods by timeframe
6. **Edit/Delete**: Manage your mood entries with the action buttons

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Project Structure

```
Scrimba-Moody-Tracker/
├── src/
│   ├── main.js          # Firebase & app logic
│   └── style.css        # Gradient styles & animations
├── index.html           # Main HTML structure
├── .env                 # Firebase configuration (not in git)
├── .env.example         # Template for environment variables
├── package.json         # Dependencies
└── README.md
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and personal use.

## Acknowledgments

- Built as part of Scrimba coursework
- Firebase for backend services
- Vite for lightning-fast development

---

Made with 🌈 by [Your Name]

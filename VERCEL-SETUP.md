# Vercel Environment Variables Setup

## Error: `auth/invalid-api-key`
This means Firebase environment variables are missing in Vercel.

---

## Fix: Add Environment Variables to Vercel

### **Method 1: Via Vercel Dashboard (Recommended)**

1. **Go to your Vercel project:**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `Scrimba-Moody-Tracker`

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add Each Variable:**
   Click **Add New** for each of these:

   **Variable 1:**
   - Name: `VITE_FIREBASE_API_KEY`
   - Value: `AIzaSyAutIAvF91pbWA_yjLDxXL77Sfg4v6tsms` (your Firebase API key)
   - Environment: Select **Production**, **Preview**, and **Development**
   
   **Variable 2:**
   - Name: `VITE_FIREBASE_AUTH_DOMAIN`
   - Value: `your-project-id.firebaseapp.com`
   - Environment: All three
   
   **Variable 3:**
   - Name: `VITE_FIREBASE_PROJECT_ID`
   - Value: `your-project-id`
   - Environment: All three
   
   **Variable 4:**
   - Name: `VITE_FIREBASE_STORAGE_BUCKET`
   - Value: `your-project-id.appspot.com`
   - Environment: All three
   
   **Variable 5:**
   - Name: `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - Value: `your-sender-id`
   - Environment: All three
   
   **Variable 6:**
   - Name: `VITE_FIREBASE_APP_ID`
   - Value: `your-app-id`
   - Environment: All three

4. **Find Your Firebase Values:**
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project
   - Click the **gear icon** ⚙️ → **Project settings**
   - Scroll down to **Your apps** section
   - Copy each value from the Firebase config

5. **Redeploy:**
   - After adding all variables, go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**
   - Check "Use existing Build Cache" (optional)
   - Click **Redeploy**

---

### **Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_FIREBASE_API_KEY
# Paste your value when prompted

# Repeat for all 6 variables...

# Redeploy
vercel --prod
```

---

## Quick Reference: Your Firebase Config

You can find these in your local `.env` file (if it exists) or in Firebase Console.

```env
VITE_FIREBASE_API_KEY=AIzaSyAutIAvF91pbWA_yjLDxXL77Sfg4v6tsms
VITE_FIREBASE_AUTH_DOMAIN=project-1091265111506.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-1091265111506
VITE_FIREBASE_STORAGE_BUCKET=project-1091265111506.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1091265111506
VITE_FIREBASE_APP_ID=1:1091265111506:web:xxxxxxxxxxxxx
```

> **Note:** Replace `xxxxxxxxxxxxx` with your actual App ID from Firebase

---

## Why This Happens

- Netlify may have auto-imported environment variables from your build
- Vercel requires manual configuration
- Environment variables are not stored in Git (for security)

---

## After Setup

Once environment variables are added and redeployed:
1. Visit your Vercel URL
2. The Firebase error should be gone
3. Authentication will work properly

## Bonus: Add Vercel Domain to Firebase

Don't forget to add your Vercel domain to Firebase authorized domains:
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add: `your-app-name.vercel.app`
3. Click **Add**

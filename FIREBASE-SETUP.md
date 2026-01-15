# Firebase Authentication Setup

## Issues You May Encounter

### Error 1: `auth/operation-not-allowed`
This means authentication providers are not enabled in Firebase.

### Error 2: Domain not authorized
The Netlify domain needs to be added to authorized domains.

---

## CRITICAL: Enable Authentication Providers First

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/

### 2. Select Your Project
Click on your "Scrimba Moody Tracker" project

### 3. Enable Authentication Providers
1. In the left sidebar, click **Authentication**
2. Click the **Sign-in method** tab
3. **Enable Email/Password:**
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**
4. **Enable Google Sign-In:**
   - Click on "Google"
   - Toggle **Enable** to ON
   - Enter a **Project support email** (your email)
   - Click **Save**

---

## Add Authorized Domains

### 4. Navigate to Authentication Settings
1. Still in **Authentication** section
2. Click the **Settings** tab at the top
3. Click **Authorized domains** tab

### 5. Add Your Netlify Domain
1. Click **Add domain** button
2. Enter: `scrimba-moody-tracker.netlify.app`
3. Click **Add**

### 6. Optional: Add Custom Domains
If you have a custom domain, add it too:
- yourapp.com
- www.yourapp.com

### 7. Save and Wait
- Changes may take a few minutes to propagate
- Refresh your Netlify site and try signing in again

---

## Summary Checklist

✅ **Step 1:** Enable Email/Password in Sign-in method  
✅ **Step 2:** Enable Google Sign-In in Sign-in method (add support email)  
✅ **Step 3:** Add `scrimba-moody-tracker.netlify.app` to Authorized domains  

---

## Current Authorized Domains
By default, Firebase authorizes:
- `localhost`
- `*.firebaseapp.com`

You need to manually add:
- ✅ `scrimba-moody-tracker.netlify.app` (your Netlify domain)
- ✅ Any custom domains you use

## Testing
After adding the domain:
1. Clear your browser cache
2. Visit your Netlify site
3. Try signing in with Google
4. The error should be gone!

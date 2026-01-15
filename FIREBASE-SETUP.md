# Firebase OAuth Domain Authorization

## Issue
Your Netlify deployment shows this error:
```
Info: The current domain is not authorized for OAuth operations. 
Add your domain (scrimba-moody-tracker.netlify.app) to the OAuth redirect domains list.
```

## Fix Steps

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/

### 2. Select Your Project
Click on your "Scrimba Moody Tracker" project

### 3. Navigate to Authentication Settings
1. In the left sidebar, click **Authentication**
2. Click the **Settings** tab at the top
3. Click **Authorized domains** tab

### 4. Add Your Netlify Domain
1. Click **Add domain** button
2. Enter: `scrimba-moody-tracker.netlify.app`
3. Click **Add**

### 5. Optional: Add Custom Domains
If you have a custom domain, add it too:
- yourapp.com
- www.yourapp.com

### 6. Save and Wait
- Changes may take a few minutes to propagate
- Refresh your Netlify site and try signing in again

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

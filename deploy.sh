#!/bin/bash

echo "🚀 Moody Tracker Deployment Script"
echo "=================================="
echo ""

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "Choose deployment platform:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) Both"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🟢 Deploying to Vercel..."
        echo "You'll need to login if you haven't already."
        echo ""
        vercel login
        echo ""
        echo "Now deploying..."
        vercel --prod
        ;;
    2)
        echo ""
        echo "🔵 Deploying to Netlify..."
        echo "You'll need to login if you haven't already."
        echo ""
        netlify login
        echo ""
        echo "Now deploying..."
        netlify deploy --prod
        ;;
    3)
        echo ""
        echo "🟢 Deploying to Vercel..."
        vercel login
        vercel --prod
        echo ""
        echo "🔵 Deploying to Netlify..."
        netlify login
        netlify deploy --prod
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment complete!"
echo ""
echo "⚠️  IMPORTANT: Don't forget to add environment variables!"
echo "Copy these from your .env file to your platform dashboard:"
echo "- VITE_FIREBASE_API_KEY"
echo "- VITE_FIREBASE_AUTH_DOMAIN"
echo "- VITE_FIREBASE_PROJECT_ID"
echo "- VITE_FIREBASE_STORAGE_BUCKET"
echo "- VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "- VITE_FIREBASE_APP_ID"
echo ""
echo "📖 See DEPLOY.md for detailed instructions!"

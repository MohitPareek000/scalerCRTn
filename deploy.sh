#!/bin/bash

# 🚀 Career Roadmap Tool - Deployment Script

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY environment variable is not set"
    echo "   Please set it using: export OPENAI_API_KEY='your-api-key-here'"
    echo "   Or add it to your deployment platform's environment variables"
fi

# Build the project
echo "🔨 Building the project..."
cd client
npm run build
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "🌐 Your application is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Choose your deployment platform (Vercel, Netlify, Heroku, etc.)"
echo "2. Set the OPENAI_API_KEY environment variable"
echo "3. Deploy your application"
echo ""
echo "📖 See DEPLOYMENT.md for detailed platform-specific instructions"

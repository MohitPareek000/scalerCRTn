@echo off
REM 🚀 Career Roadmap Tool - Deployment Script for Windows

echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if API key is set
if "%OPENAI_API_KEY%"=="" (
    echo ⚠️  Warning: OPENAI_API_KEY environment variable is not set
    echo    Please set it using: set OPENAI_API_KEY=your-api-key-here
    echo    Or add it to your deployment platform's environment variables
)

REM Build the project
echo 🔨 Building the project...
cd client
npm run build
cd ..

echo ✅ Build completed successfully!
echo.
echo 🌐 Your application is ready for deployment!
echo.
echo 📋 Next steps:
echo 1. Choose your deployment platform (Vercel, Netlify, Heroku, etc.)
echo 2. Set the OPENAI_API_KEY environment variable
echo 3. Deploy your application
echo.
echo 📖 See DEPLOYMENT.md for detailed platform-specific instructions
pause

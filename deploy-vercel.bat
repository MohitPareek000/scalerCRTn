@echo off
REM 🚀 Vercel Deployment Script for Career Roadmap Tool

echo 🚀 Starting Vercel deployment process...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing now...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Vercel CLI. Please install manually:
        echo    npm install -g vercel
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI is ready

REM Check if user is logged in
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel:
    vercel login
    if %errorlevel% neq 0 (
        echo ❌ Login failed. Please try again.
        pause
        exit /b 1
    )
)

echo ✅ Logged in to Vercel

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    echo 🌐 Your app is now live on Vercel!
    echo.
    echo 📋 Next steps:
    echo 1. Set OPENAI_API_KEY in Vercel dashboard
    echo 2. Test your application
    echo 3. Share your live URL
) else (
    echo ❌ Deployment failed. Check the logs above.
)

pause

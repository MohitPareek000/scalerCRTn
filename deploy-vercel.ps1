# 🚀 Vercel Deployment Script for Career Roadmap Tool

Write-Host "🚀 Starting Vercel deployment process..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed. Installing now..." -ForegroundColor Red
    try {
        npm install -g vercel
        Write-Host "✅ Vercel CLI installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually:" -ForegroundColor Red
        Write-Host "   npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

# Check if user is logged in
try {
    vercel whoami | Out-Null
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Vercel:" -ForegroundColor Blue
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm run install-all
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Blue
try {
    npm run build
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Blue
try {
    vercel --prod
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your app is now live on Vercel!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Set OPENAI_API_KEY in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Test your application" -ForegroundColor White
    Write-Host "3. Share your live URL" -ForegroundColor White
} catch {
    Write-Host "❌ Deployment failed. Check the logs above." -ForegroundColor Red
    exit 1
}

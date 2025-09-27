# 🌐 Ngrok Setup Script for Career Roadmap Tool

Write-Host "🚀 Starting Career Roadmap Tool with Ngrok..." -ForegroundColor Green

# Check if ngrok is installed
try {
    $ngrokVersion = ngrok version
    Write-Host "✅ Ngrok is installed: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "1. Go to https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "2. Download and extract ngrok.exe" -ForegroundColor Yellow
    Write-Host "3. Add ngrok to your PATH" -ForegroundColor Yellow
    Write-Host "4. Run: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor Yellow
    exit 1
}

# Check if servers are running
Write-Host "🔍 Checking if servers are running..." -ForegroundColor Blue

# Check backend (port 5000)
$backendRunning = $false
try {
    $backendCheck = netstat -ano | findstr ":5000"
    if ($backendCheck) {
        Write-Host "✅ Backend server is running on port 5000" -ForegroundColor Green
        $backendRunning = $true
    }
} catch {
    Write-Host "⚠️  Backend server not detected on port 5000" -ForegroundColor Yellow
}

# Check frontend (port 3000)
$frontendRunning = $false
try {
    $frontendCheck = netstat -ano | findstr ":3000"
    if ($frontendCheck) {
        Write-Host "✅ Frontend server is running on port 3000" -ForegroundColor Green
        $frontendRunning = $true
    }
} catch {
    Write-Host "⚠️  Frontend server not detected on port 3000" -ForegroundColor Yellow
}

# Start servers if not running
if (-not $backendRunning) {
    Write-Host "🚀 Starting backend server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start"
    Start-Sleep -Seconds 3
}

if (-not $frontendRunning) {
    Write-Host "🚀 Starting frontend server..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"
    Start-Sleep -Seconds 3
}

# Start ngrok
Write-Host "🌐 Starting ngrok tunnel..." -ForegroundColor Blue
Write-Host "This will expose your backend server to the internet." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop ngrok when done." -ForegroundColor Yellow
Write-Host ""

# Start ngrok
ngrok http 5000

@echo off
REM 🌐 Ngrok Setup Script for Career Roadmap Tool

echo 🚀 Starting Career Roadmap Tool with Ngrok...

REM Check if ngrok is installed
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ngrok is not installed. Please install it first:
    echo 1. Go to https://ngrok.com/download
    echo 2. Download and extract ngrok.exe
    echo 3. Add ngrok to your PATH
    echo 4. Run: ngrok config add-authtoken YOUR_TOKEN
    pause
    exit /b 1
)

echo ✅ Ngrok is installed

REM Check if servers are running
echo 🔍 Checking if servers are running...

REM Check backend (port 5000)
netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on port 5000
) else (
    echo ⚠️  Backend server not detected on port 5000
    echo 🚀 Starting backend server...
    start "Backend Server" cmd /k "cd server && npm start"
    timeout /t 3 /nobreak >nul
)

REM Check frontend (port 3000)
netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running on port 3000
) else (
    echo ⚠️  Frontend server not detected on port 3000
    echo 🚀 Starting frontend server...
    start "Frontend Server" cmd /k "cd client && npm start"
    timeout /t 3 /nobreak >nul
)

echo 🌐 Starting ngrok tunnel...
echo This will expose your backend server to the internet.
echo Press Ctrl+C to stop ngrok when done.
echo.

REM Start ngrok
ngrok http 5000

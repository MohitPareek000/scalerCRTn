# 🌐 Ngrok Setup for Career Roadmap Tool

## 📥 Install Ngrok

### Option 1: Download from Official Website (Recommended)
1. Go to https://ngrok.com/download
2. Download the Windows version
3. Extract the `ngrok.exe` file to a folder (e.g., `C:\ngrok\`)
4. Add the folder to your Windows PATH

### Option 2: Using Chocolatey (if you have it)
```powershell
choco install ngrok
```

### Option 3: Using Scoop (if you have it)
```powershell
scoop install ngrok
```

## 🔑 Get Your Auth Token

1. Sign up at https://ngrok.com/ (free account)
2. Go to https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy your authtoken
4. Run: `ngrok config add-authtoken YOUR_TOKEN_HERE`

## 🚀 Start Your Application with Ngrok

### Step 1: Start Your Backend Server
```bash
# In one terminal window
cd server
npm start
```

### Step 2: Start Your Frontend Server
```bash
# In another terminal window
cd client
npm start
```

### Step 3: Expose Backend with Ngrok
```bash
# In a third terminal window
ngrok http 5000
```

This will give you a public URL like: `https://abc123.ngrok.io`

### Step 4: Update Frontend to Use Ngrok URL

You'll need to update your frontend to use the ngrok URL instead of localhost.

## 🔧 Configuration Files

### Update client/src/App.js
```javascript
// Change the API_BASE_URL to use your ngrok URL
const API_BASE_URL = 'https://your-ngrok-url.ngrok.io/api';
```

### Or use Environment Variables
Create a `.env.local` file in your client directory:
```
REACT_APP_API_URL=https://your-ngrok-url.ngrok.io/api
```

## 📋 Complete Setup Script

I'll create a script to automate this process for you.

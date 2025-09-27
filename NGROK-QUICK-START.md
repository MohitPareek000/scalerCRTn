# 🌐 Quick Ngrok Setup Guide

## 🚀 **Step-by-Step Instructions**

### **1. Install Ngrok**
- Download from: https://ngrok.com/download
- Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
- Add the folder to your Windows PATH
- Sign up at https://ngrok.com/ (free account)
- Get your auth token and run: `ngrok config add-authtoken YOUR_TOKEN`

### **2. Start Your Application**
```bash
# Terminal 1: Start Backend
cd server
npm start

# Terminal 2: Start Frontend  
cd client
npm start
```

### **3. Start Ngrok**
```bash
# Terminal 3: Start Ngrok
ngrok http 5000
```

### **4. Get Your Public URL**
Ngrok will show something like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5000
```

### **5. Update Frontend Configuration**
Update `client/src/App.js` or create `client/.env.local`:
```javascript
// Replace with your actual ngrok URL
const API_BASE_URL = 'https://abc123.ngrok.io/api';
```

### **6. Test Your Application**
- Open: http://localhost:3000
- Complete the assessment
- Check if AI features work with the ngrok URL

## 🔧 **Automated Setup**

### **Option 1: Use the Batch File**
```bash
# Just run this:
start-ngrok.bat
```

### **Option 2: Use PowerShell**
```powershell
# Run this:
.\start-ngrok.ps1
```

## ✅ **Your Setup is Ready!**

- ✅ **CORS is configured** - Your server accepts requests from any origin
- ✅ **API key is set** - OpenAI features will work
- ✅ **Scripts are ready** - Automated setup available

## 🌐 **What You Get**

- **Public URL**: Share your app with anyone on the internet
- **HTTPS**: Secure connection for testing
- **Real-time**: Changes reflect immediately
- **Free**: No cost for basic usage

## 🚨 **Important Notes**

1. **Ngrok URL changes** every time you restart ngrok (unless you have a paid plan)
2. **Update frontend** each time you get a new ngrok URL
3. **Keep servers running** while using ngrok
4. **Stop ngrok** with `Ctrl+C` when done

## 🎯 **Next Steps**

1. Run `start-ngrok.bat` or follow the manual steps
2. Get your ngrok URL
3. Update the frontend configuration
4. Test your application
5. Share the public URL with others!

Your Career Roadmap Tool will be accessible from anywhere on the internet! 🌍

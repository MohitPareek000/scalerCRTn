# Railway Deployment Guide

## 🚀 Deploy Your Career Roadmap Tool on Railway

### Prerequisites
- Railway CLI installed: `npm install -g @railway/cli`
- OpenAI API key
- Git repository (GitHub recommended)

### Step 1: Login to Railway
```bash
railway login
```

### Step 2: Initialize Railway Project
```bash
railway init
```
- Choose "Empty Project"
- Name it: `career-roadmap-tool`

### Step 3: Deploy to Railway
```bash
railway up
```

### Step 4: Set Environment Variables
In Railway Dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add these variables:
   ```
   OPENAI_API_KEY = your_openai_api_key_here
   NODE_ENV = production
   PORT = 5000
   ```

### Step 5: Test Your Deployment
Your app will be available at: `https://your-app-name.railway.app`

Test these endpoints:
- `https://your-app-name.railway.app/api/test`
- `https://your-app-name.railway.app/api/current-roles`
- `https://your-app-name.railway.app/api/target-roles`

### What Railway Does:
- ✅ Builds React app automatically
- ✅ Starts Express server
- ✅ Serves both API and frontend
- ✅ Provides HTTPS
- ✅ Auto-scaling
- ✅ Environment management

### Troubleshooting:
- Check Railway logs: `railway logs`
- Verify environment variables in dashboard
- Ensure OpenAI API key is set correctly

### Commands:
```bash
# Deploy
railway up

# View logs
railway logs

# Open dashboard
railway open
```

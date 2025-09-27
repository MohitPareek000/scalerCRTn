# Railway Deployment Guide

## 🚀 Quick Setup for Railway

### 1. **Environment Variables in Railway Dashboard**
Go to your Railway project → Settings → Variables and add:

```
OPENAI_API_KEY=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
NODE_ENV=production
PORT=5000
```

### 2. **Railway Configuration**
- **Build Command:** `npm run railway-build`
- **Start Command:** `npm start`
- **Root Directory:** `/` (root of repository)

### 3. **Project Structure for Railway**
```
/
├── package.json (with all dependencies)
├── server/index.js (main server file)
├── client/ (React app)
├── railway.json (Railway config)
└── railway-build.js (build script)
```

### 4. **What Railway Will Do**
1. Install dependencies from root `package.json`
2. Run `npm run railway-build` to build React app
3. Start server with `npm start`
4. Serve both API and React app from single server

### 5. **API Endpoints**
- `GET /api/current-roles` - Get current roles
- `GET /api/target-roles` - Get target roles  
- `GET /api/suggested-skills/:targetRole` - Get skills for role
- `POST /api/analyze-skills` - Analyze user skills

### 6. **Troubleshooting**
- **Module not found:** Dependencies are now in root `package.json`
- **Build fails:** Check Railway logs for specific errors
- **API not working:** Verify environment variables are set

## ✅ Expected Results
- Single Railway service serving both frontend and backend
- API endpoints working at `/api/*`
- React app served at root `/`
- All features working including LLM integration

# 🚀 Deploy Career Roadmap Tool on Vercel

## 📋 **Step-by-Step Vercel Deployment Guide**

### **Step 1: Prepare Your Project**

#### 1.1 Update Package.json Scripts
Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm start\""
  }
}
```

#### 1.2 Create Build Script
Create `build.js` in your root directory:

```javascript
const { execSync } = require('child_process');

console.log('🔨 Building client...');
execSync('cd client && npm run build', { stdio: 'inherit' });
console.log('✅ Build completed!');
```

### **Step 2: Set Up Vercel Configuration**

#### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 2.2 Login to Vercel
```bash
vercel login
```

#### 2.3 Initialize Project
```bash
vercel
```

### **Step 3: Configure Environment Variables**

#### 3.1 Set OpenAI API Key
```bash
vercel env add OPENAI_API_KEY
# Enter your API key: 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
```

#### 3.2 Set Node Environment
```bash
vercel env add NODE_ENV production
```

### **Step 4: Deploy Your Application**

#### 4.1 Deploy to Preview
```bash
vercel --prod
```

#### 4.2 Get Your Live URL
Vercel will provide you with a URL like: `https://your-project.vercel.app`

### **Step 5: Update Frontend Configuration**

#### 5.1 Update API Base URL
In `client/src/App.js`, update the API_BASE_URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-project.vercel.app/api';
```

#### 5.2 Create Environment File
Create `client/.env.production`:

```
REACT_APP_API_URL=https://your-project.vercel.app/api
```

### **Step 6: Test Your Deployment**

1. **Visit your Vercel URL**
2. **Complete the 3-step assessment**
3. **Test AI features** (Learning Assistant, Skill Analysis)
4. **Verify all tabs work** (Skill Gaps, Career Path, Interview Prep, Projects)

## 🔧 **Alternative: GitHub Integration**

### **Option 1: Connect GitHub Repository**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy!

### **Option 2: Automatic Deployments**

- Every push to `main` branch will trigger automatic deployment
- Preview deployments for pull requests
- Easy rollbacks and version management

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### Issue 1: Build Fails
```bash
# Solution: Check build logs
vercel logs
```

#### Issue 2: API Routes Not Working
```bash
# Solution: Check vercel.json configuration
# Ensure routes are properly configured
```

#### Issue 3: Environment Variables Not Loading
```bash
# Solution: Redeploy after setting env vars
vercel --prod
```

### **Debug Commands:**
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod
```

## 🎯 **Production Checklist**

- ✅ **Environment Variables Set**
- ✅ **API Key Configured**
- ✅ **Build Scripts Working**
- ✅ **Routes Properly Configured**
- ✅ **CORS Settings Correct**
- ✅ **All Features Tested**

## 🌐 **Your Live Application**

Once deployed, your Career Roadmap Tool will be available at:
`https://your-project.vercel.app`

### **Features Available:**
- ✅ **3-Step Assessment**
- ✅ **AI-Powered Skill Analysis**
- ✅ **Career Path Roadmap**
- ✅ **Interview Preparation**
- ✅ **Project Recommendations**
- ✅ **Learning Assistant**

## 🚀 **Next Steps After Deployment**

1. **Test all features** on the live URL
2. **Share with users** for feedback
3. **Monitor performance** in Vercel dashboard
4. **Set up custom domain** (optional)
5. **Configure analytics** (optional)

Your Career Roadmap Tool is now live on the internet! 🌍

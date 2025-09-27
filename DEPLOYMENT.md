# 🚀 Deployment Guide

## API Key Configuration for Different Platforms

### 1. **Vercel Deployment (Recommended)**

#### Option A: Environment Variables in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `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`
   - **Environment**: Production, Preview, Development

#### Option B: Using Vercel CLI
```bash
vercel env add OPENAI_API_KEY
# Enter your API key when prompted
```

### 2. **Netlify Deployment**

#### Option A: Netlify Dashboard
1. Go to Site settings → Environment variables
2. Add new variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `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`

#### Option B: netlify.toml file
```toml
[build.environment]
  OPENAI_API_KEY = "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"
```

### 3. **Heroku Deployment**

#### Option A: Heroku CLI
```bash
heroku config:set OPENAI_API_KEY=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
```

#### Option B: Heroku Dashboard
1. Go to your app → Settings → Config Vars
2. Add new config var:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `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`

### 4. **Railway Deployment**

#### Option A: Railway Dashboard
1. Go to your project → Variables
2. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `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`

### 5. **DigitalOcean App Platform**

1. Go to your app → Settings → App-Level Environment Variables
2. Add new variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `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`

## 🔒 Security Best Practices

### 1. **Never Commit API Keys to Git**
- Add `.env` to `.gitignore` ✅ (Already done)
- Use environment variables in production
- Rotate API keys regularly

### 2. **API Key Management**
- Use different API keys for development and production
- Monitor API usage and costs
- Set up usage alerts in OpenAI dashboard

### 3. **Environment-Specific Configuration**
```javascript
// server/index.js (already configured)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

## 🚀 Quick Deployment Steps

### For Vercel (Easiest):
1. Push your code to GitHub
2. Connect Vercel to your GitHub repo
3. Add environment variable in Vercel dashboard
4. Deploy!

### For Netlify:
1. Push your code to GitHub
2. Connect Netlify to your GitHub repo
3. Add environment variable in Netlify dashboard
4. Deploy!

## ⚠️ Important Notes

1. **API Key is Already Configured**: Your server code is already set up to read from environment variables
2. **No Code Changes Needed**: The application will work once you set the environment variable
3. **Fallback Handling**: The app will show warnings if the API key is missing but won't crash
4. **Cost Management**: Monitor your OpenAI usage to avoid unexpected charges

## 🔧 Testing Your Deployment

After deployment, test these features:
- ✅ Complete the 3-step assessment
- ✅ Generate career roadmap
- ✅ Use AI Learning Assistant
- ✅ Get skill recommendations
- ✅ View interview prep content

Your application is production-ready! 🎉

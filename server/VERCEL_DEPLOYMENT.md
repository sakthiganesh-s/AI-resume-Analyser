# Vercel Backend Deployment Guide

## Quick Start for Backend on Vercel

### 1. Prerequisites
- GitHub account with code pushed
- Vercel account (free tier available)
- Environment variables ready

### 2. Deploy to Vercel

1. Go to **vercel.com** → Sign in with GitHub
2. Click **"Add New Project"**
3. Select your repository: `AI-resume-Analyser`
4. **Import Settings:**
   - Framework: **"Other"**
   - Root Directory: **`server`** (important!)
   - Build Command: `npm install`
   - Output Directory: Leave blank
   - Install Command: `npm install`

5. **Environment Variables:** Add these in Vercel dashboard
   ```
   MONGODB_URI = your_mongodb_connection_string
   OPENAI_API_KEY = your_openai_key
   GROQ_API_KEY = your_groq_key
   JWT_SECRET = your_jwt_secret_key
   CLIENT_URL = https://your-vercel-frontend.vercel.app
   ```

6. Click **"Deploy"**

### 3. Get Your Backend URL

After deployment, Vercel shows:
```
https://your-project.vercel.app
```

This becomes your backend API base URL.

### 4. Update Frontend Environment

In your Vercel frontend project settings, update:
```
VITE_API_BASE_URL = https://your-backend-project.vercel.app
```

Or in `client/.env`:
```
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

### 5. Deploy Frontend

Push the updated frontend to GitHub, and Vercel will auto-deploy.

## File Structure for Vercel

```
server/
├── api/
│   └── index.js           # Vercel serverless handler
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── index.js               # Local development
├── package.json
├── vercel.json            # Vercel configuration
└── .vercelignore          # Files to ignore
```

## How It Works

- **Local:** `npm run dev` uses `index.js` directly
- **Vercel:** Routes traffic through `api/index.js` (serverless function)
- Both use the same Express app setup

## Troubleshooting

### Cold Start Issues
- First request may take 5-10 seconds (normal for free tier)
- Use paid tier for better performance

### CORS Errors
- Verify `CLIENT_URL` is set in Vercel environment variables
- Check frontend URL is in `allowedOrigins` in `api/index.js`

### Database Connection Issues
- Ensure `MONGODB_URI` is correct
- Check MongoDB Atlas allows your Vercel IP (set to 0.0.0.0/0)

### Timeout Issues
- Vercel has 30-60 second timeout on free tier
- Long-running requests may fail
- Optimize database queries

## Cost Estimate

**Vercel (Free Tier):**
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions included

**Vercel (Pro Tier):**
- $20/month for more memory/timeout
- Recommended for production

## Verification

After deployment, test your API:

```bash
curl https://your-backend-project.vercel.app/api/health
```

Should return:
```json
{
  "success": true,
  "message": "API is healthy"
}
```

# VIRAD Wheel - Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy your Next.js app.

### Method 1: Vercel CLI (Fastest)

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Navigate to your project:
```bash
cd /Users/edy/Desktop/learning/random-shans
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. For production deployment:
```bash
vercel --prod
```

### Method 2: Vercel Dashboard (Easiest)

1. **Push to GitHub**:
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your repository
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Environment Configuration

No environment variables needed! The app works out of the box.

### Custom Domain (Optional)

1. Go to your project on Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

## Deploy to Netlify

1. Build your app:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

## Deploy to Other Platforms

### Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Next.js

### Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Build command: `npm run build`
5. Start command: `npm start`

## Self-Hosting

### Using Node.js

1. Build the app:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

3. App runs on `http://localhost:3000`

### Using PM2 (Production)

1. Install PM2:
```bash
npm i -g pm2
```

2. Build and start:
```bash
npm run build
pm2 start npm --name "virad-wheel" -- start
```

3. Save PM2 config:
```bash
pm2 save
pm2 startup
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t virad-wheel .
docker run -p 3000:3000 virad-wheel
```

## Performance Optimization

The app is already optimized with:
- ✅ Static page generation
- ✅ Image optimization
- ✅ Code splitting
- ✅ PWA caching
- ✅ Minified assets

## Post-Deployment Checklist

- [ ] Test the app on mobile devices
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Test Excel import/export
- [ ] Test dark/light mode
- [ ] Test sound effects
- [ ] Verify confetti animation
- [ ] Check responsive design

## Monitoring

For production apps, consider adding:
- Vercel Analytics (built-in with Vercel)
- Google Analytics
- Sentry for error tracking

## Updates

To update your deployed app:

**Vercel**: Just push to your GitHub repository - auto-deploys!

**Manual**: 
```bash
git pull
npm install
npm run build
pm2 restart virad-wheel
```

---

**Your VIRAD Wheel app is ready to deploy! 🚀**

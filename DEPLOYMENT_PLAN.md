# 🚀 Web3 Portfolio Deployment Plan

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build & Optimization](#build--optimization)
3. [Environment Configuration](#environment-configuration)
4. [Platform-Specific Deployment](#platform-specific-deployment)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] **Run linting**: `npm run lint`
- [ ] **Fix all TypeScript errors**: Check for any type errors
- [ ] **Test build locally**: `npm run build && npm start`
- [ ] **Verify no console errors**: Check browser console in production mode
- [ ] **Test all pages**: Home, About, Projects, Playground, Contracts
- [ ] **Test wallet connection**: Verify Phantom and other wallets work
- [ ] **Test responsive design**: Mobile, tablet, desktop views
- [ ] **Test hydration**: Ensure no hydration mismatches

### Content Updates
- [ ] **Update personal information**: `lib/data/personal.ts`
  - [ ] Email address
  - [ ] Social media links (GitHub, LinkedIn)
  - [ ] Resume file (`public/resume.pdf`)
  - [ ] Education and experience details
- [ ] **Update project data**: `lib/projects/data.ts`
  - [ ] Verify all project links are correct
  - [ ] Update project statuses
  - [ ] Add/remove projects as needed
- [ ] **Update metadata**: `app/layout.tsx`
  - [ ] Title and description
  - [ ] Open Graph tags (if needed)

### Configuration
- [ ] **Network selection**: Choose Devnet or Mainnet
- [ ] **RPC endpoint**: Configure custom RPC if needed
- [ ] **Domain name**: Prepare custom domain (optional)
- [ ] **Analytics**: Set up tracking (optional)

### Security
- [ ] **Review `.gitignore`**: Ensure sensitive files are excluded
- [ ] **No API keys in code**: Verify no hardcoded secrets
- [ ] **Environment variables**: Prepare for production env vars
- [ ] **HTTPS**: Ensure SSL certificate (automatic on Vercel/Netlify)

---

## 🔧 Build & Optimization

### Local Build Test

```bash
# 1. Clean previous builds
rm -rf .next
rm -rf node_modules/.cache

# 2. Install dependencies
npm ci

# 3. Build for production
npm run build

# 4. Test production build locally
npm start

# 5. Verify build output
# Check for:
# - No build errors
# - Bundle size is reasonable
# - All pages are accessible
```

### Build Optimization Checklist

- [ ] **Bundle size**: Check `.next` folder size
- [ ] **Code splitting**: Verify chunks are properly split
- [ ] **Image optimization**: Ensure images are optimized
- [ ] **Static assets**: Verify all assets are included
- [ ] **Source maps**: Disable in production (optional)

### Performance Checks

```bash
# Analyze bundle size
npm run build
# Check the output for bundle sizes

# Lighthouse audit (in browser)
# Open production build and run Lighthouse
```

---

## ⚙️ Environment Configuration

### Required Environment Variables

Currently, **no environment variables are required** for basic functionality. The app uses:
- Default Solana RPC endpoints (Devnet/Mainnet)
- Client-side wallet connections only

### Optional Environment Variables

If you want to use a custom RPC endpoint:

```bash
# .env.local (for local development)
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-endpoint.com

# In production, add via platform dashboard
```

### Network Configuration

**Current Setup**: Devnet (for development)

**To switch to Mainnet**:
1. Edit `components/providers/WalletProvider.tsx`
2. Change line 14:
   ```typescript
   const network = WalletAdapterNetwork.MainnetBeta
   ```

**To use custom RPC endpoint**:
1. Edit `components/providers/WalletProvider.tsx`
2. Modify the `endpoint` useMemo:
   ```typescript
   const endpoint = useMemo(() => {
     return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network)
   }, [network])
   ```

---

## 🌐 Platform-Specific Deployment

### Option 1: Vercel (Recommended for Next.js)

#### Step 1: Prepare Repository
```bash
# Ensure code is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Deploy to Vercel

**Via Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Vercel auto-detects Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci`
6. Click "Deploy"

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

#### Step 3: Configure Vercel

**Environment Variables** (if needed):
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_SOLANA_RPC_URL` if using custom RPC

**Build Settings**:
- Node.js Version: 18.x or higher
- Build Command: `npm run build`
- Output Directory: `.next`

**Custom Domain**:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

#### Step 4: Verify Deployment
- [ ] Check deployment URL
- [ ] Test all pages
- [ ] Verify wallet connection
- [ ] Check mobile responsiveness
- [ ] Test performance (Lighthouse)

---

### Option 2: Netlify

#### Step 1: Prepare Build
```bash
# Ensure build works locally
npm run build
```

#### Step 2: Deploy to Netlify

**Via Netlify Dashboard:**
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 (or higher)
6. Click "Deploy site"

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Step 3: Configure Netlify

**Environment Variables**:
- Go to Site Settings → Environment Variables
- Add any required variables

**Build Settings**:
- Create `netlify.toml` in project root:
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"

  [[plugins]]
    package = "@netlify/plugin-nextjs"
  ```

**Custom Domain**:
- Go to Domain Settings → Add custom domain
- Configure DNS records

---

### Option 3: Self-Hosted (VPS/Server)

#### Prerequisites
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or reverse proxy (optional)
- SSL certificate (Let's Encrypt)

#### Deployment Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd Portfolio-web3

# 2. Install dependencies
npm ci

# 3. Build application
npm run build

# 4. Start with PM2
npm install -g pm2
pm2 start npm --name "portfolio-web3" -- start

# 5. Save PM2 configuration
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ Post-Deployment Verification

### Functional Testing

- [ ] **Homepage loads**: Verify hero section and animations
- [ ] **Navigation works**: All links functional
- [ ] **About page**: Personal info displays correctly
- [ ] **Projects page**: All projects visible
- [ ] **Playground page**: Wallet connection works
- [ ] **Contracts page**: Smart contract info displays
- [ ] **Footer**: Links and contact info correct

### Wallet Testing

- [ ] **Phantom wallet**: Connect/disconnect works
- [ ] **Auto-connect**: Previously connected wallet reconnects
- [ ] **Network selection**: Correct network (Devnet/Mainnet)
- [ ] **Transaction signing**: Can sign messages (if applicable)
- [ ] **Balance display**: Shows correct SOL balance

### Performance Testing

- [ ] **Lighthouse score**: 
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+
- [ ] **Page load time**: < 3 seconds
- [ ] **First Contentful Paint**: < 1.5 seconds
- [ ] **Time to Interactive**: < 3.5 seconds

### Cross-Browser Testing

- [ ] **Chrome/Edge**: All features work
- [ ] **Firefox**: All features work
- [ ] **Safari**: All features work
- [ ] **Mobile browsers**: Responsive design works

### Mobile Testing

- [ ] **iOS Safari**: Test on iPhone
- [ ] **Android Chrome**: Test on Android
- [ ] **Tablet views**: iPad, Android tablets
- [ ] **Touch interactions**: All buttons/links work

---

## 📊 Monitoring & Maintenance

### Analytics Setup (Optional)

**Vercel Analytics**:
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Google Analytics** (Alternative):
- Add tracking code to `app/layout.tsx`
- Track wallet connections and page views

### Error Monitoring

**Sentry** (Optional):
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Performance Monitoring

- **Vercel Analytics**: Built-in performance metrics
- **Web Vitals**: Monitor Core Web Vitals
- **Uptime monitoring**: Use services like UptimeRobot

### Regular Maintenance

**Weekly**:
- [ ] Check deployment logs for errors
- [ ] Monitor performance metrics
- [ ] Review wallet connection success rate

**Monthly**:
- [ ] Update dependencies: `npm update`
- [ ] Review and update project portfolio
- [ ] Check for security updates
- [ ] Review analytics data

**Quarterly**:
- [ ] Major dependency updates
- [ ] Performance optimization review
- [ ] Content updates (projects, experience)

---

## 🐛 Troubleshooting

### Build Errors

**Issue**: Build fails with TypeScript errors
```bash
# Solution: Fix TypeScript errors
npm run lint
# Fix all reported errors
```

**Issue**: Build fails with module not found
```bash
# Solution: Clear cache and reinstall
rm -rf .next node_modules
npm ci
npm run build
```

**Issue**: ChunkLoadError in production
```bash
# Solution: Clear build cache
rm -rf .next
# Redeploy
```

### Runtime Errors

**Issue**: Hydration errors
- **Solution**: Ensure all client-only code uses `isMounted` checks
- **Check**: Browser console for specific hydration mismatches

**Issue**: Wallet not connecting
- **Solution**: 
  1. Check network configuration matches wallet
  2. Verify RPC endpoint is accessible
  3. Check browser console for errors
  4. Ensure wallet extension is installed

**Issue**: Slow page loads
- **Solution**:
  1. Check bundle size
  2. Enable compression
  3. Use CDN for static assets
  4. Optimize images

### Deployment-Specific Issues

**Vercel**:
- Check build logs in Vercel dashboard
- Verify Node.js version (18+)
- Check environment variables

**Netlify**:
- Verify `netlify.toml` configuration
- Check build logs
- Ensure Next.js plugin is installed

**Self-Hosted**:
- Check server logs: `pm2 logs`
- Verify Node.js version
- Check reverse proxy configuration
- Verify SSL certificate

---

## 📝 Deployment Checklist Summary

### Pre-Deployment
- [ ] Code quality checks passed
- [ ] All content updated
- [ ] Local build successful
- [ ] All tests passing
- [ ] No console errors

### Deployment
- [ ] Repository pushed to GitHub
- [ ] Platform configured (Vercel/Netlify)
- [ ] Environment variables set (if needed)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### Post-Deployment
- [ ] All pages accessible
- [ ] Wallet connection works
- [ ] Performance metrics acceptable
- [ ] Mobile responsive
- [ ] Analytics tracking (if enabled)
- [ ] Error monitoring active (if enabled)

---

## 🎯 Quick Start Commands

```bash
# 1. Clean and build
rm -rf .next node_modules/.cache
npm ci
npm run build

# 2. Test locally
npm start

# 3. Deploy (Vercel)
vercel --prod

# 4. Deploy (Netlify)
netlify deploy --prod

# 5. Check deployment
# Visit your deployment URL and verify
```

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files
- ✅ No API keys in code
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS (automatic on Vercel/Netlify)
- ✅ Keep dependencies updated
- ✅ Review security advisories regularly

---

**Last Updated**: 2024
**Next Review**: After major updates or quarterly

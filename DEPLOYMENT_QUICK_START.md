# 🚀 Quick Deployment Guide

## Fastest Path to Production

### Option 1: Vercel (Recommended - 5 minutes)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy
# Go to vercel.com → Import GitHub repo → Deploy
# OR use CLI:
npm i -g vercel
vercel --prod
```

**That's it!** Vercel auto-detects Next.js and handles everything.

---

### Option 2: Netlify (5 minutes)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy
# Go to netlify.com → Import GitHub repo → Deploy
# OR use CLI:
npm i -g netlify-cli
netlify deploy --prod
```

---

## Pre-Flight Checklist (2 minutes)

Before deploying, quickly verify:

```bash
# 1. Test build
npm run build

# 2. Test locally
npm start
# Visit http://localhost:3000 and check:
# - All pages load
# - Wallet connects
# - No console errors

# 3. Ready to deploy!
```

---

## Post-Deployment (1 minute)

After deployment, verify:

- [ ] Site loads at deployment URL
- [ ] Wallet connection works
- [ ] All pages accessible
- [ ] Mobile responsive

---

## Common Issues & Quick Fixes

**Build fails?**
```bash
rm -rf .next node_modules
npm ci
npm run build
```

**Wallet not connecting?**
- Check network (Devnet vs Mainnet) in `WalletProvider.tsx`
- Verify wallet extension is installed

**Hydration errors?**
- Already fixed with `isMounted` checks
- If still occurring, check browser console

---

## Need More Details?

See `DEPLOYMENT_PLAN.md` for comprehensive guide.

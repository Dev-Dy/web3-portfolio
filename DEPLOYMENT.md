# Deployment Guide

## 🚀 Deployment Options

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Deploy!

3. **Environment Variables** (if needed)
   - Add any RPC endpoints or API keys in Vercel dashboard
   - Currently none required for basic functionality

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Node Version**: 18.x or higher

### Self-Hosted

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📋 Pre-Deployment Checklist

- [ ] Update social links in `app/about/page.tsx`
- [ ] Update email in `app/about/page.tsx` and `components/layout/Footer.tsx`
- [ ] Update GitHub links in `lib/projects/data.ts`
- [ ] Test wallet connection on target network (Devnet/Mainnet)
- [ ] Verify all pages load correctly
- [ ] Test responsive design on mobile devices
- [ ] Check browser console for errors

## 🔧 Configuration

### Network Configuration

The app is currently configured for **Devnet** by default. To switch to Mainnet:

1. Edit `components/providers/WalletProvider.tsx`
2. Change:
   ```typescript
   const network = WalletAdapterNetwork.Devnet
   ```
   to:
   ```typescript
   const network = WalletAdapterNetwork.Mainnet
   ```

### Custom RPC Endpoint

To use a custom RPC endpoint (e.g., Helius, QuickNode):

1. Edit `components/providers/WalletProvider.tsx`
2. Replace `clusterApiUrl(network)` with your endpoint:
   ```typescript
   const endpoint = 'https://your-rpc-endpoint.com'
   ```

## 🌐 Domain Setup

### Vercel
- Add custom domain in Vercel dashboard
- Follow DNS configuration instructions

### Netlify
- Add custom domain in Netlify dashboard
- Configure DNS records

## 📊 Analytics (Optional)

Consider adding:
- Google Analytics
- Vercel Analytics
- Custom event tracking for wallet connections

## 🔒 Security Notes

- No API keys required for basic functionality
- Wallet connections are client-side only
- All transactions require user approval
- No private keys stored

## 🐛 Troubleshooting

### Build Errors
- Ensure Node.js 18+ is installed
- Clear `.next` folder and rebuild
- Check for TypeScript errors: `npm run lint`

### Wallet Connection Issues
- Ensure wallet extension is installed
- Check network configuration matches wallet
- Verify RPC endpoint is accessible

### Deployment Issues
- Check build logs in deployment platform
- Verify environment variables if used
- Ensure all dependencies are in `package.json`


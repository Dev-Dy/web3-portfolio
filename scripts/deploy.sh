#!/bin/bash

# Web3 Portfolio Deployment Script
# This script helps prepare and verify the deployment

set -e

echo "🚀 Web3 Portfolio Deployment Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pre-deployment checks
echo -e "${YELLOW}Step 1: Pre-deployment checks${NC}"
echo "Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18+ required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK${NC}"

echo "Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo -e "${GREEN}✓ Git status OK${NC}"

# Step 2: Clean build
echo ""
echo -e "${YELLOW}Step 2: Cleaning previous builds${NC}"
rm -rf .next
rm -rf node_modules/.cache
echo -e "${GREEN}✓ Cleaned${NC}"

# Step 3: Install dependencies
echo ""
echo -e "${YELLOW}Step 3: Installing dependencies${NC}"
npm ci
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 4: Lint check
echo ""
echo -e "${YELLOW}Step 4: Running linter${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${RED}✗ Linting failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Step 5: Build
echo ""
echo -e "${YELLOW}Step 5: Building for production${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Step 6: Check build output
echo ""
echo -e "${YELLOW}Step 6: Verifying build output${NC}"
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ Build output exists${NC}"
    echo "Build size: $(du -sh .next | cut -f1)"
else
    echo -e "${RED}✗ Build output not found${NC}"
    exit 1
fi

# Step 7: Summary
echo ""
echo -e "${GREEN}======================================"
echo "✅ Pre-deployment checks complete!"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "1. Review the build output above"
echo "2. Test locally: npm start"
echo "3. Deploy to your platform:"
echo "   - Vercel: vercel --prod"
echo "   - Netlify: netlify deploy --prod"
echo "   - Or use platform dashboard"
echo ""
echo "For detailed instructions, see DEPLOYMENT_PLAN.md"

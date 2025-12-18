# Architecture Documentation

## 📁 Folder Structure

```
Portfolio-web3/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with WalletProvider
│   ├── page.tsx                 # Home page (Hero + Architecture)
│   ├── globals.css              # Global styles & Tailwind
│   ├── projects/
│   │   └── page.tsx             # Projects showcase
│   ├── playground/
│   │   └── page.tsx             # Wallet playground
│   ├── contracts/
│   │   └── page.tsx             # Smart contract docs
│   └── about/
│       └── page.tsx             # About page
│
├── components/
│   ├── providers/
│   │   └── WalletProvider.tsx   # Solana wallet adapter setup
│   ├── layout/
│   │   ├── Navigation.tsx       # Top navigation bar
│   │   └── Footer.tsx           # Footer component
│   ├── wallet/
│   │   └── WalletButton.tsx     # Connect/disconnect wallet UI
│   └── home/
│       ├── Hero.tsx             # Hero section with wallet connect
│       └── ArchitectureOverview.tsx  # System architecture breakdown
│
├── lib/                         # Utilities (future)
│
├── contracts/                   # Anchor programs (future)
│   └── programs/
│
├── public/                      # Static assets
│
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── README.md                   # Project documentation
```

## 🏗️ Component Architecture

### WalletProvider
- Wraps the entire app with Solana wallet adapter context
- Configures connection to Devnet/Mainnet
- Supports Phantom wallet (extensible to others)

### Navigation
- Responsive navigation bar
- Active route highlighting with Framer Motion
- Wallet button integration

### Hero Section
- Name and role display
- Real wallet connection button
- Architecture diagram visualization
- Connected wallet state display

### Architecture Overview
- Five-layer system breakdown:
  1. Frontend Layer
  2. Wallet Adapter
  3. RPC Layer
  4. Smart Contract Layer
  5. Account Model
- Each layer shows:
  - Tech stack
  - Responsibilities
  - Description

## 🔌 Web3 Integration

### Wallet Connection Flow
1. User clicks "Connect Wallet"
2. Wallet adapter modal opens
3. User selects Phantom (or other wallet)
4. Wallet connects and provides public key
5. App fetches:
   - SOL balance
   - Network (Devnet/Mainnet)
   - Wallet address

### RPC Usage
- `connection.getBalance()` - Fetch SOL balance
- `connection.rpcEndpoint` - Detect network
- Future: Transaction submission, account queries

## 🎨 Design System

### Colors
- Background: `#0A0A0A` (near black)
- Foreground: `#E5E5E5` (light gray)
- Accent: `#00D9FF` (cyan)
- Card: `#1A1A1A` (dark gray)
- Border: `#2A2A2A` (medium gray)

### Typography
- System font stack for performance
- Clear hierarchy: h1 (5xl-6xl), h2 (4xl), body (lg)
- Accent color for highlights

### Animations
- Framer Motion for:
  - Page transitions
  - Component entrance
  - Active tab indicator
  - Wallet connection state

## 🚀 Next Steps

1. **Projects Page**
   - Project cards with system diagrams
   - Detail pages with architecture
   - GitHub links and demos

2. **Playground Page**
   - Interactive wallet operations
   - Transaction examples
   - On-chain data queries

3. **Contracts Page**
   - Smart contract documentation
   - Account model diagrams
   - Instruction lifecycle

4. **Smart Contract**
   - Anchor program setup
   - Demo program (read/write)
   - Frontend integration

## 🔒 Security Considerations

- Wallet adapter handles all signing
- No private keys stored
- RPC calls are read-only by default
- Transaction signing requires explicit user approval


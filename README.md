# Web3 Portfolio

A modern, architecture-first Web3 portfolio website built with Next.js, Solana, and Anchor.

## 🎯 Design Philosophy

- **Architecture > Marketing**: Focus on system design and technical depth
- **Systems > Screenshots**: Show how things work, not just what they look like
- **Real wallet interactions > Fake demos**: Actual on-chain interactions
- **Scalable design from day one**: Built for future expansion

## 🧱 Architecture

```
Frontend (Next.js, React)
  |
  |-- Wallet Adapter (Phantom / Solana wallets)
  |
  |-- RPC Calls (read-only + tx submission)
  |
Backend (Optional / Future)
  |
  |-- Indexing / Analytics
  |-- Job Runners / Automation
  |
Blockchain Layer
  |
  |-- Smart Contracts (Solana / Rust / Anchor)
  |-- Program-controlled Accounts (PDAs)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Phantom Wallet (or compatible Solana wallet)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Connect Wallet

1. Install [Phantom Wallet](https://phantom.app/)
2. Switch to Devnet (Settings → Developer Mode → Change Network)
3. Click "Connect Wallet" on the homepage

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with wallet provider
│   ├── page.tsx           # Home page
│   ├── projects/          # Projects page
│   ├── playground/        # Wallet playground
│   ├── contracts/         # Smart contracts documentation
│   └── about/             # About page
│
├── components/
│   ├── providers/         # React context providers
│   ├── layout/            # Navigation, Footer
│   ├── wallet/            # Wallet components
│   └── home/              # Home page components
│
├── lib/                   # Utilities and helpers
│
├── contracts/             # Anchor smart contracts
│   └── programs/          # Rust programs
│
└── public/                # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Web3**: @solana/web3.js, @solana/wallet-adapter
- **Animations**: Framer Motion
- **Smart Contracts**: Rust, Anchor framework

## 📝 Features

### ✅ Completed

- **Wallet Integration**
  - ✅ Phantom wallet connection
  - ✅ Real-time SOL balance display
  - ✅ Network detection (Devnet/Mainnet)
  - ✅ Wallet address display with copy functionality

- **Pages**
  - ✅ Home page with hero section and architecture overview
  - ✅ Projects page with interactive cards and detail pages
  - ✅ Playground page with wallet interactions
  - ✅ Smart Contracts documentation page
  - ✅ About page with skills and principles

- **Web3 Functionality**
  - ✅ Transaction history fetching
  - ✅ Test transaction capability (0 SOL self-transfer)
  - ✅ On-chain data queries
  - ✅ Real-time balance updates

- **UI/UX**
  - ✅ Modern dark theme with cyan accents
  - ✅ Responsive design (mobile, tablet, desktop)
  - ✅ Smooth animations (Framer Motion)
  - ✅ Glassmorphism effects
  - ✅ Gradient backgrounds and glows

- **Smart Contracts**
  - ✅ Complete Anchor program (Counter demo)
  - ✅ Program documentation
  - ✅ Account model explanation
  - ✅ Instruction lifecycle documentation

## 📄 License

MIT


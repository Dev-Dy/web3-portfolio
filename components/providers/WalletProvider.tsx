'use client'

import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use devnet for development, mainnet-beta for production
  const network = WalletAdapterNetwork.Devnet
  
  // Memoize endpoint to prevent unnecessary re-renders
  const endpoint = useMemo(() => {
    // Use a faster RPC endpoint if available (e.g., Helius, QuickNode)
    // For now, use the default cluster API
    return clusterApiUrl(network)
  }, [network])

  // Memoize wallets to prevent recreation on every render
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={false} // Disable auto-connect for faster initial load
        onError={(error) => {
          console.error('Wallet error:', error)
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}


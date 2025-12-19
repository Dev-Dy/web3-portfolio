'use client'

import { useMemo, useCallback } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS - this provides the modal styling
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use devnet for development
  const network = WalletAdapterNetwork.Devnet
  
  // Memoize endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Create wallet adapters - these are the wallets that will appear in the modal
  // Other wallets that support Wallet Standard will be auto-detected
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  // Error handler for wallet operations
  const onError = useCallback((error: Error) => {
    console.error('[Wallet Error]', error.message)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

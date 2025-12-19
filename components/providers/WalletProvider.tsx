'use client'

import { useMemo, useCallback } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS - this provides the modal styling
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use devnet for development
  const network = WalletAdapterNetwork.Devnet
  
  // Memoize endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Create wallet adapters - these are the wallets that will appear in the modal
  // Note: Phantom is auto-detected via Wallet Standard, so we don't need to manually register it
  // The warning "Phantom was registered as a Standard Wallet" is expected and can be safely ignored
  // It's just informational - Phantom will still work correctly via Wallet Standard auto-detection
  // Other wallets that support Wallet Standard will also be auto-detected
  const wallets = useMemo(
    () => [
      // Only register wallets that don't support Wallet Standard
      // Phantom is auto-detected, so we don't register it to avoid the warning
      new SolflareWalletAdapter(),
    ],
    []
  )

  // Error handler for wallet operations
  const onError = useCallback((error: Error) => {
    const errorMessage = error?.message || String(error)
    const errorName = (error as any)?.name || 'Unknown'
    const errorStack = error?.stack || ''
    
    // Check if this is a wallet extension content script error (non-critical)
    // These errors come from wallet extensions themselves and are not actionable
    const isContentScriptError = 
      errorMessage.includes('solanaActionsContentScript') ||
      errorMessage.includes('Something went wrong') ||
      errorStack.includes('solanaActionsContentScript') ||
      errorName.includes('ContentScript')
    
    if (isContentScriptError) {
      // Silently ignore wallet extension content script errors
      // These are internal to wallet extensions and don't affect functionality
      return
    }
    
    // Log actual errors for debugging
    console.error('[WalletProvider Error]', error)
    if (errorMessage) {
      console.error('[WalletProvider Error Message]', errorMessage)
    }
    if (errorName) {
      console.error('[WalletProvider Error Name]', errorName)
    }
    if (errorStack) {
      console.error('[WalletProvider Error Stack]', errorStack)
    }
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

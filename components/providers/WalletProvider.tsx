'use client'

import { useMemo, useCallback } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS - this provides the modal styling
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use devnet for development
  const network = WalletAdapterNetwork.Devnet
  
  // Memoize endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Create wallet adapters - these are the wallets that will appear in the modal
  // Note: Phantom supports Wallet Standard, which means it can be auto-detected, but we explicitly
  // register it here to ensure reliable connection. The warning "Phantom was registered as a Standard Wallet"
  // is expected when both Wallet Standard detection and explicit registration occur - this is harmless.
  // The SolanaWalletProvider handles deduplication internally.
  // 
  // Note: If you see "duplicate MetaMask key" warnings in console, this is a known issue with
  // @solana/wallet-adapter-react-ui when wallets are detected through multiple mechanisms
  // (e.g., Wallet Standard + browser extension detection). This warning is harmless and doesn't
  // affect functionality.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  // Error handler for wallet operations - provides user-friendly error messages
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
    
    // Check for specific connection failure scenarios and provide user-friendly messages
    let userMessage = ''
    
    if (errorMessage.includes('MetaMask') || errorMessage.includes('Failed to connect to MetaMask')) {
      // Scenario: MetaMask connection attempt (MetaMask is Ethereum-only, not Solana)
      userMessage = '❌ MetaMask is not a Solana wallet. Please use a Solana-compatible wallet like Phantom, Solflare, or install the Solana Snap in MetaMask.'
      console.error('[WalletProvider] MetaMask connection attempt detected (not Solana-compatible)', {
        error: errorMessage,
        tip: 'Use Phantom, Solflare, or other Solana wallets instead',
      })
    } else if (errorMessage.includes('User rejected') || errorMessage.includes('User cancelled')) {
      // Scenario: User rejected connection request
      userMessage = 'Connection cancelled. Please approve the connection request in your wallet.'
      console.warn('[WalletProvider] User rejected wallet connection')
      return // Don't show error for user cancellation
    } else if (errorMessage.includes('Wallet not found') || errorMessage.includes('not installed')) {
      // Scenario: Wallet extension not installed
      userMessage = '❌ Wallet extension not found. Please install a Solana wallet extension (Phantom, Solflare) and refresh the page.'
      console.error('[WalletProvider] Wallet not installed', errorMessage)
    } else if (errorMessage.includes('network') || errorMessage.includes('NetworkError')) {
      // Scenario: Network connection issues
      userMessage = '❌ Network error. Please check your internet connection and try again.'
      console.error('[WalletProvider] Network error', errorMessage)
    } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      // Scenario: Connection timeout
      userMessage = '❌ Connection timeout. The wallet took too long to respond. Please try again.'
      console.error('[WalletProvider] Connection timeout', errorMessage)
    } else {
      // Generic error - log for debugging but provide helpful message
      userMessage = `❌ Connection failed: ${errorMessage}. Please try again or use a different wallet.`
      console.error('[WalletProvider] Connection error', {
        error,
        message: errorMessage,
        name: errorName,
        stack: errorStack?.substring(0, 200),
      })
    }
    
    // Store error message in sessionStorage for WalletButton to display
    // This allows error messages to persist across component re-renders
    if (typeof window !== 'undefined' && userMessage) {
      sessionStorage.setItem('walletConnectionError', userMessage)
      // Clear error after 10 seconds to avoid stale messages
      setTimeout(() => {
        sessionStorage.removeItem('walletConnectionError')
      }, 10000)
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

'use client'

import { useMemo, useEffect, useState } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
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

  // Create wallets using useState with lazy initializer to ensure they're created on client only
  // This prevents SSR from caching an empty array and ensures wallets are available immediately on client
  // Note: Phantom is auto-detected via Wallet Standard, but we keep manual registration for compatibility
  // and to ensure it works in all browsers. The warning can be safely ignored.
  const [wallets] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PhantomWalletAdapter } = require('@solana/wallet-adapter-wallets')
      return [new PhantomWalletAdapter()]
    } catch (e) {
      console.error('Failed to create wallet adapters', e)
      return []
    }
  })

  // Check localStorage synchronously at initialization to enable auto-connect immediately
  const [autoConnect] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return !!localStorage.getItem('selectedWallet')
    } catch {
      return false
    }
  })
  
  // Attach event listeners to wallets after they're created
  // Use mounted flag to track lifecycle and prevent operations after unmount
  useEffect(() => {
    if (wallets.length === 0) return

    let mounted = true

    // Debug: expose adapters and names for troubleshooting
    try {
      // eslint-disable-next-line no-console
      console.debug('[WalletProvider] detected adapters:', wallets.map((a) => a.name))
      // expose for quick manual inspection in browser console
      if (typeof window !== 'undefined' && mounted) (window as any).__WALLETS = wallets
    } catch {}

    // Store cleanup functions for event listeners
    const cleanupFunctions: Array<() => void> = []

    // attach listeners to persist selection and clear on disconnect; also surface errors
    wallets.forEach((adapter) => {
      try {
        if (adapter.on && mounted) {
          const connectHandler = () => {
            if (!mounted) return
            try { localStorage.setItem('selectedWallet', adapter.name) } catch {}
            // eslint-disable-next-line no-console
            console.debug('[WalletProvider] adapter connected:', adapter.name)
          }
          const disconnectHandler = () => {
            if (!mounted) return
            try { localStorage.removeItem('selectedWallet') } catch {}
            // eslint-disable-next-line no-console
            console.debug('[WalletProvider] adapter disconnected:', adapter.name)
          }
          const errorHandler = (err: any) => {
            if (!mounted) return
            // eslint-disable-next-line no-console
            console.error('[WalletProvider] adapter error', adapter.name, err)
          }
          const readyHandler = () => {
            if (!mounted) return
            // eslint-disable-next-line no-console
            console.debug('[WalletProvider] adapter ready:', adapter.name)
          }

          adapter.on('connect', connectHandler)
          adapter.on('disconnect', disconnectHandler)
          adapter.on('error', errorHandler)
          adapter.on('ready', readyHandler)

          // Store cleanup functions (if adapter supports off method)
          if (adapter.off) {
            cleanupFunctions.push(() => {
              adapter.off?.('connect', connectHandler)
              adapter.off?.('disconnect', disconnectHandler)
              adapter.off?.('error', errorHandler)
              adapter.off?.('ready', readyHandler)
            })
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[WalletProvider] failed to attach listeners to adapter', adapter?.name, e)
      }
    })

    return () => {
      mounted = false
      // Execute cleanup functions
      cleanupFunctions.forEach((cleanup) => {
        try {
          cleanup()
        } catch (e) {
          // Ignore cleanup errors
        }
      })
    }
  }, [wallets])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={autoConnect}
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


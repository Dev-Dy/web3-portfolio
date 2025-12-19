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

  // Create wallets only on the client to avoid any SSR/hydration issues
  const [wallets, setWallets] = useState<any[]>([])
  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        // Lazy-require the adapter to ensure it runs only in the browser
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PhantomWalletAdapter } = require('@solana/wallet-adapter-wallets')
        const adapters: any[] = [new PhantomWalletAdapter()]

        // Debug: expose adapters and names for troubleshooting
        try {
          // eslint-disable-next-line no-console
          console.debug('[WalletProvider] detected adapters:', adapters.map((a) => a.name))
          // expose for quick manual inspection in browser console
          if (typeof window !== 'undefined') (window as any).__WALLETS = adapters
        } catch {}

        // If user previously selected a wallet, try to auto-connect to it
        const selected = typeof window !== 'undefined' ? localStorage.getItem('selectedWallet') : null

        // attach listeners to persist selection and clear on disconnect; also surface errors
        adapters.forEach((adapter) => {
          try {
            if (adapter.on) {
              adapter.on('connect', () => {
                try { localStorage.setItem('selectedWallet', adapter.name) } catch {}
                // eslint-disable-next-line no-console
                console.debug('[WalletProvider] adapter connected:', adapter.name)
              })
              adapter.on('disconnect', () => {
                try { localStorage.removeItem('selectedWallet') } catch {}
                // eslint-disable-next-line no-console
                console.debug('[WalletProvider] adapter disconnected:', adapter.name)
              })
              adapter.on('error', (err: any) => {
                // eslint-disable-next-line no-console
                console.error('[WalletProvider] adapter error', adapter.name, err)
              })
              adapter.on('ready', () => {
                // eslint-disable-next-line no-console
                console.debug('[WalletProvider] adapter ready:', adapter.name)
              })
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[WalletProvider] failed to attach listeners to adapter', adapter?.name, e)
          }
        })

        if (mounted) setWallets(adapters)
      } catch (e) {
        console.error('Failed to load wallet adapters', e)
      }
    }
    init()
    return () => { mounted = false }
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={typeof window !== 'undefined' && !!localStorage.getItem('selectedWallet')}
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


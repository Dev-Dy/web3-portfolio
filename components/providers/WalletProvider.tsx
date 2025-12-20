'use client'

import { useMemo, useCallback, useEffect } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider, useWalletModal } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Import wallet adapter CSS - this provides the modal styling
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use devnet for development
  const network = WalletAdapterNetwork.Devnet
  
  // Memoize endpoint
  const endpoint = useMemo(() => {
    // #region agent log
    const url = clusterApiUrl(network)
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletProvider.tsx:18',message:'RPC endpoint created',data:{endpoint:url,network},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{})
    // #endregion
    return url
  }, [network])

  // Create wallet adapters - these are the wallets that will appear in the modal
  // Note: Phantom is auto-detected via Wallet Standard, so we don't need to manually register it
  // The warning "Phantom was registered as a Standard Wallet" is expected and can be safely ignored
  // It's just informational - Phantom will still work correctly via Wallet Standard auto-detection
  // Other wallets that support Wallet Standard will also be auto-detected
  const wallets = useMemo(
    () => {
      // #region agent log
      try {
        const adapters = [
          // Only register wallets that don't support Wallet Standard
          // Phantom is auto-detected, so we don't register it to avoid the warning
          new SolflareWalletAdapter(),
        ]
        fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletProvider.tsx:32',message:'Wallets initialized',data:{count:adapters.length,names:adapters.map(a=>a.name)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{})
        return adapters
      } catch (err) {
        fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletProvider.tsx:32',message:'Wallet initialization error',data:{error:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{})
        return []
      }
      // #endregion
    },
    []
  )

  // Error handler for wallet operations
  const onError = useCallback((error: Error) => {
    const errorMessage = error?.message || String(error)
    const errorName = (error as any)?.name || 'Unknown'
    const errorStack = error?.stack || ''
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletProvider.tsx:35',message:'Error handler called',data:{errorMessage,errorName,errorStack:errorStack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{})
    // #endregion
    
    // Check if this is a wallet extension content script error (non-critical)
    // These errors come from wallet extensions themselves and are not actionable
    const isContentScriptError = 
      errorMessage.includes('solanaActionsContentScript') ||
      errorMessage.includes('Something went wrong') ||
      errorStack.includes('solanaActionsContentScript') ||
      errorName.includes('ContentScript')
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletProvider.tsx:48',message:'Content script check',data:{isContentScriptError},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{})
    // #endregion
    
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
          {/* #region agent log */}
          <WalletStateTracker />
          {/* #endregion */}
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

// Component to track wallet adapter state changes
function WalletStateTracker() {
  const { wallet, connected, connecting, publicKey, connect, disconnect } = useWallet()
  const { visible, setVisible } = useWalletModal()
  
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletProvider.tsx:WalletStateTracker',message:'Wallet state changed',data:{connected,connecting,hasPublicKey:!!publicKey,walletName:wallet?.adapter?.name,modalVisible:visible},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{})
  }, [connected, connecting, publicKey, wallet, visible])
  
  return null
}

'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState, useCallback } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Loader2 } from 'lucide-react'

export function WalletButton() {
  const { wallet, publicKey, disconnect, connected, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:12',message:'WalletButton render',data:{connected,connecting,hasPublicKey:!!publicKey,walletName:wallet?.adapter?.name,hasSetVisible:typeof setVisible === 'function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{})
  }, [connected, connecting, publicKey, wallet, setVisible])
  // #endregion
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Ensure client-side only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch balance when connected
  useEffect(() => {
    let mounted = true
    
    if (connected && publicKey) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:30',message:'Fetching balance',data:{publicKey:publicKey.toString(),endpoint:connection.rpcEndpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{})
      // #endregion
      connection.getBalance(publicKey)
        .then((lamports) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:33',message:'Balance fetched successfully',data:{lamports,balance:lamports / LAMPORTS_PER_SOL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{})
          // #endregion
          if (mounted) setBalance(lamports / LAMPORTS_PER_SOL)
        })
        .catch((err) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:35',message:'Balance fetch failed',data:{error:String(err),errorMessage:err?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{})
          // #endregion
          console.error('Failed to fetch balance:', err)
          if (mounted) setBalance(null)
        })

      // Detect network
      const endpoint = connection.rpcEndpoint
      if (endpoint.includes('devnet')) {
        setNetwork('Devnet')
      } else if (endpoint.includes('mainnet')) {
        setNetwork('Mainnet')
      } else {
        setNetwork('Testnet')
      }
    } else {
      setBalance(null)
      setNetwork('')
    }

    return () => { mounted = false }
  }, [connected, publicKey, connection])

  const handleConnect = useCallback(() => {
    // #region agent log
    const logData = {setVisibleType:typeof setVisible,setVisibleExists:!!setVisible}
    console.log('[WalletButton] handleConnect called', logData)
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:57',message:'handleConnect called',data:logData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})
    // #endregion
    setConnectionError(null)
    try {
      // Open the wallet modal
      console.log('[WalletButton] Opening wallet modal...')
      // #region agent log
      console.log('[WalletButton] Calling setVisible(true)')
      fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:64',message:'Calling setVisible(true)',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})
      // #endregion
      setVisible(true)
      console.log('[WalletButton] setVisible(true) called successfully')
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:65',message:'setVisible(true) completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})
      // #endregion
    } catch (error) {
      // #region agent log
      const errorData = {error:String(error),errorMessage:error instanceof Error ? error.message : 'Unknown'}
      console.error('[WalletButton] setVisible error', errorData)
      fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:66',message:'setVisible error',data:errorData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})
      // #endregion
      console.error('[WalletButton] Failed to open wallet modal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setConnectionError(`Failed to open wallet selection: ${errorMessage}. Please ensure your wallet extension is installed and try again.`)
    }
  }, [setVisible])

  // Add timeout for connecting state to prevent infinite loading
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:73',message:'Connecting state changed',data:{connecting,connected,publicKey:publicKey?.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{})
    // #endregion
    if (connecting) {
      const timeout = setTimeout(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:76',message:'Connection timeout triggered',data:{connecting,connected},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{})
        // #endregion
        console.warn('[WalletButton] Connection timeout - taking longer than 30 seconds')
        setConnectionError('Connection is taking longer than expected. Please try again or check your wallet extension.')
      }, 30000) // 30 second timeout

      return () => clearTimeout(timeout)
    } else {
      setConnectionError(null)
    }
  }, [connecting, connected, publicKey])

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true)
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    } finally {
      setIsDisconnecting(false)
    }
  }, [disconnect])

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="px-6 py-3 bg-accent/50 rounded-lg opacity-50">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    )
  }

  // Connected state
  if (connected && publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-3"
      >
        {/* Account info - hidden on mobile */}
        <div className="hidden sm:flex flex-col items-end text-sm bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2">
          <div className="text-foreground font-medium font-mono flex items-center space-x-2">
            <span>{shortenAddress(publicKey.toString())}</span>
            <motion.span
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-foreground/60 text-xs flex items-center space-x-1">
            <span>{wallet?.adapter?.name || 'Wallet'}</span>
            <span>•</span>
            <span>{network} • {balance !== null ? `${balance.toFixed(4)} SOL` : '...'}</span>
          </div>
        </div>

        {/* Disconnect button */}
        <motion.button
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isDisconnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </span>
        </motion.button>
      </motion.div>
    )
  }

  // Connecting state
  if (connecting) {
    return (
      <div className="flex flex-col items-end space-y-2">
        <motion.button
          disabled
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent/50 to-accent-dark/50 text-black/70 font-semibold rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </motion.button>
        {connectionError && (
          <p className="text-xs text-red-400 max-w-xs text-right">{connectionError}</p>
        )}
      </div>
    )
  }

  // Disconnected state - show connect button
  return (
    <div className="flex flex-col items-end space-y-2">
      <motion.button
        onClick={(e) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f26a7108-8da1-46ed-924d-6fa88678106c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'WalletButton.tsx:button-onClick',message:'Button clicked',data:{eventType:e.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})
          // #endregion
          handleConnect()
        }}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-black font-semibold rounded-lg transition-all duration-300 shadow-glow hover:shadow-glow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </motion.button>
      {connectionError && (
        <p className="text-xs text-red-400 max-w-xs text-right">{connectionError}</p>
      )}
    </div>
  )
}

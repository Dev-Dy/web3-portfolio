'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState, useCallback, useRef } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Loader2 } from 'lucide-react'

export function WalletButton() {
  const { wallet, publicKey, disconnect, connected, connecting } = useWallet()
  const { setVisible, visible } = useWalletModal()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [modalOpenAttempted, setModalOpenAttempted] = useState(false)

  // Ensure client-side only - prevents hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Diagnostic: Log modal state changes for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[WalletButton] Modal state changed:', {
        visible,
        setVisibleType: typeof setVisible,
        modalOpenAttempted,
        hasWallet: !!wallet,
      })
    }
  }, [visible, setVisible, modalOpenAttempted, wallet])

  // Monitor modal state - provide feedback if modal doesn't open after setVisible(true)
  useEffect(() => {
    if (modalOpenAttempted && !visible) {
      // Modal was requested to open but didn't actually open
      const timeout = setTimeout(() => {
        if (!visible) {
          // Check if modal element exists in DOM
          const modalElement = document.querySelector('[class*="wallet-adapter-modal"]') || 
                              document.querySelector('[class*="WalletModal"]')
          
          if (!modalElement) {
            setConnectionError(
              'Modal component not found in DOM. WalletModalProvider may not be rendering WalletModal. Check provider setup.'
            )
          } else {
            setConnectionError(
              'Modal exists but is not visible. Possible causes: CSS hiding modal (display:none, opacity:0), z-index too low, or modal rendered outside viewport.'
            )
          }
        }
      }, 500) // Wait 500ms to see if modal opens
      
      return () => clearTimeout(timeout)
    } else if (visible) {
      // Modal opened successfully, clear any errors
      setConnectionError(null)
      setModalOpenAttempted(false)
    }
  }, [visible, modalOpenAttempted])

  // Fetch balance when connected - use rpcEndpoint string instead of connection object to avoid unnecessary re-runs
  // Only fetch when wallet is actually connected and publicKey is available
  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null)
      setNetwork('')
      return
    }

    // Use ref to track if component is still mounted for cleanup
    let mounted = true
    
    // Fetch balance asynchronously - connection.getBalance is safe to call only when wallet is connected
    connection.getBalance(publicKey)
      .then((lamports) => {
        // Check mounted flag before updating state to prevent memory leaks
        if (mounted) {
        setBalance(lamports / LAMPORTS_PER_SOL)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch balance:', err)
        // Only update state if component is still mounted
        if (mounted) {
          setBalance(null)
        }
      })

    // Detect network from endpoint string - stable string comparison
      const endpoint = connection.rpcEndpoint
      if (endpoint.includes('devnet')) {
        setNetwork('Devnet')
      } else if (endpoint.includes('mainnet')) {
        setNetwork('Mainnet')
      } else {
      setNetwork('Testnet')
    }

    // Cleanup: mark as unmounted to prevent state updates after component unmounts
    return () => {
      mounted = false
    }
  }, [connected, publicKey, connection.rpcEndpoint]) // Use rpcEndpoint string instead of connection object

  const handleConnect = useCallback(() => {
    setConnectionError(null)
    setModalOpenAttempted(true)
    
    try {
      // Scenario 1: setVisible is undefined or null
      if (setVisible === undefined || setVisible === null) {
        const errorMsg = '❌ WalletModalProvider not properly initialized. setVisible function is missing. Check that WalletModalProvider wraps your app.'
        console.error('[WalletButton] Scenario 1:', errorMsg)
        setConnectionError(errorMsg)
        return
      }

      // Scenario 2: setVisible is not a function
      if (typeof setVisible !== 'function') {
        const errorMsg = `❌ WalletModalProvider configuration error. setVisible is "${typeof setVisible}", expected "function". This usually means WalletModalProvider is not set up correctly.`
        console.error('[WalletButton] Scenario 2:', errorMsg, { setVisible })
        setConnectionError(errorMsg)
        return
      }

      // Scenario 3: Wallet is already connected (shouldn't happen, but check anyway)
      if (connected) {
        console.warn('[WalletButton] Wallet already connected, modal should not open')
        setConnectionError(null)
        return
      }

      // Scenario 4: Check if we're in the right context (WalletModalProvider should be wrapping this)
      if (process.env.NODE_ENV === 'development') {
        console.log('[WalletButton] Attempting to open wallet modal...', {
          setVisibleType: typeof setVisible,
          currentVisible: visible,
          hasWallet: !!wallet,
          connecting,
        })
      }

      // Try to open the modal
      setVisible(true)

      // Verify modal opened (check after a brief delay)
      setTimeout(() => {
        if (!visible && modalOpenAttempted) {
          // Scenario 5: setVisible called but modal didn't actually open
          // Check if modal element exists in DOM
          const modalElement = document.querySelector('[class*="wallet-adapter-modal"]') || 
                              document.querySelector('[id*="wallet-modal"]') ||
                              document.querySelector('[role="dialog"]')
          
          if (!modalElement) {
            const errorMsg = '❌ Modal component not found in DOM. WalletModalProvider may not be rendering WalletModal component. Check provider setup in WalletProvider.tsx'
            console.error('[WalletButton] Scenario 5a:', errorMsg)
            setConnectionError(errorMsg)
          } else {
            const errorMsg = '❌ Modal exists in DOM but is not visible. Possible causes: CSS hiding modal (display:none, opacity:0), z-index too low, or modal rendered outside viewport. Check browser DevTools.'
            console.error('[WalletButton] Scenario 5b:', errorMsg, { modalElement })
            setConnectionError(errorMsg)
          }
        }
      }, 300)

    } catch (error) {
      // Scenario 6: setVisible threw an error
      console.error('[WalletButton] Scenario 6: Exception calling setVisible:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      let userMessage = '❌ Failed to open wallet selection modal.'
      
      if (errorMessage.includes('Cannot read') || errorMessage.includes('undefined') || errorMessage.includes('null')) {
        userMessage = '❌ WalletModalProvider not properly initialized. Component context is missing. Please refresh the page and ensure WalletModalProvider wraps your app.'
      } else if (errorMessage.includes('Provider') || errorMessage.includes('context')) {
        userMessage = '❌ Wallet provider configuration error. Check that WalletModalProvider is properly set up in WalletProvider.tsx and wraps all components using useWalletModal.'
      } else if (errorMessage.includes('render')) {
        userMessage = '❌ Modal rendering error. Check browser console for React errors or CSS conflicts.'
    } else {
        userMessage = `❌ Error: ${errorMessage}. Please refresh the page and try again. If issue persists, check browser console (F12).`
      }
      
      setConnectionError(userMessage)
    }
  }, [setVisible, visible, connected, wallet, connecting, modalOpenAttempted])

  // Track previous connecting state to detect connection failures
  const prevConnectingRef = useRef(connecting)

  // Listen for connection errors from WalletProvider
  useEffect(() => {
    const checkForStoredError = () => {
      if (typeof window !== 'undefined') {
        const storedError = sessionStorage.getItem('walletConnectionError')
        if (storedError) {
          setConnectionError(storedError)
          sessionStorage.removeItem('walletConnectionError')
        }
      }
    }

    // Check immediately and periodically (if error is set from WalletProvider's onError)
    checkForStoredError()
    const interval = setInterval(checkForStoredError, 500) // Check every 500ms

    return () => clearInterval(interval)
  }, [])

  // Monitor connection state changes and handle errors
  useEffect(() => {
    // Clear error when connection succeeds
    if (connected) {
      setConnectionError(null)
      setModalOpenAttempted(false)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('walletConnectionError')
      }
    }

    // Detect connection failure: was connecting, now not connecting and not connected
    const wasConnecting = prevConnectingRef.current
    if (wasConnecting && !connecting && !connected) {
      // Connection attempt failed - check for stored error message
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const storedError = sessionStorage.getItem('walletConnectionError')
          if (!storedError && !connected) {
            // No specific error message - provide generic helpful message
            setConnectionError('❌ Connection failed. Please try: 1) Ensure wallet extension is unlocked, 2) Approve the connection request, 3) Try a different wallet if the issue persists.')
          }
        }
      }, 500)
    }

    prevConnectingRef.current = connecting
  }, [connected, connecting])

  // Add timeout for connecting state to prevent infinite loading
  useEffect(() => {
    if (connecting) {
      const timeout = setTimeout(() => {
        console.warn('[WalletButton] Connection timeout - taking longer than 30 seconds')
        setConnectionError('❌ Connection timeout: Wallet is taking too long to respond. Please try: 1) Refresh the page, 2) Check wallet extension is unlocked, 3) Try a different wallet.')
      }, 30000) // 30 second timeout

      return () => clearTimeout(timeout)
    }
  }, [connecting])

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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg max-w-xs text-right"
          >
            <p className="text-xs text-red-400 font-medium">{connectionError}</p>
            <p className="text-xs text-red-400/70 mt-1">
              💡 Tip: Check browser console (F12) for detailed error information.
            </p>
          </motion.div>
        )}
      </div>
    )
  }

  // Disconnected state - show connect button
  return (
    <div className="flex flex-col items-end space-y-2">
      <motion.button
        onClick={handleConnect}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-black font-semibold rounded-lg transition-all duration-300 shadow-glow hover:shadow-glow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </motion.button>
      {connectionError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg max-w-xs text-right"
        >
          <p className="text-xs text-red-400 font-medium">{connectionError}</p>
          <p className="text-xs text-red-400/70 mt-1">
            💡 Tip: Check browser console (F12) for detailed error information.
          </p>
        </motion.div>
      )}
    </div>
  )
}

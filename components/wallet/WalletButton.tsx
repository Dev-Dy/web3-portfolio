'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState, useCallback } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Loader2 } from 'lucide-react'

export function WalletButton() {
  const { wallet, publicKey, disconnect, connected, connecting, select, wallets } = useWallet()
  const { visible, setVisible } = useWalletModal()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure client-side only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch balance when connected
  useEffect(() => {
    let mounted = true
    
    if (connected && publicKey) {
      connection.getBalance(publicKey)
        .then((lamports) => {
          if (mounted) setBalance(lamports / LAMPORTS_PER_SOL)
        })
        .catch((err) => {
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
    // Open the wallet modal
    setVisible(true)
  }, [setVisible])

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
      <motion.button
        disabled
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent/50 to-accent-dark/50 text-black/70 font-semibold rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Connecting...</span>
      </motion.button>
    )
  }

  // Disconnected state - show connect button
  return (
    <motion.button
      onClick={handleConnect}
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-black font-semibold rounded-lg transition-all duration-300 shadow-glow hover:shadow-glow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Wallet className="w-5 h-5" />
      <span>Connect Wallet</span>
    </motion.button>
  )
}

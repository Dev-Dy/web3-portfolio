'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion } from 'framer-motion'
import { Wallet, RefreshCw, PenLine, LogOut, Loader2, Copy, Check } from 'lucide-react'

export function WalletDetails() {
  const { wallet, publicKey, connected, connecting, disconnect, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()

  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [authSig, setAuthSig] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch balance and network info
  useEffect(() => {
    let mounted = true

    if (connected && publicKey) {
      setLoading(true)
      setError(null)

      connection.getBalance(publicKey)
        .then((lamports) => {
          if (mounted) {
            setBalance(lamports / 1e9)
            setLoading(false)
          }
        })
        .catch((err) => {
          if (mounted) {
            console.error('Failed to fetch balance:', err)
            setError('Failed to fetch balance')
            setLoading(false)
          }
        })

      // Detect network
      const ep = connection.rpcEndpoint
      if (ep.includes('devnet')) setNetwork('Devnet')
      else if (ep.includes('mainnet')) setNetwork('Mainnet')
      else setNetwork('Custom')
    } else {
      setBalance(null)
      setAuthSig(null)
      setError(null)
    }

    return () => { mounted = false }
  }, [connected, publicKey, connection])

  const refreshBalance = useCallback(async () => {
    if (!connected || !publicKey) return
    setLoading(true)
    setError(null)
    try {
      const lamports = await connection.getBalance(publicKey)
      setBalance(lamports / 1e9)
    } catch (err) {
      setError('Failed to refresh balance')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [connected, publicKey, connection])

  const handleSignMessage = useCallback(async () => {
    setError(null)
    setAuthSig(null)

    if (!connected || !publicKey) {
      setError('Wallet not connected')
      return
    }

    if (!signMessage) {
      setError('This wallet does not support signMessage')
      return
    }

    try {
      const message = `Sign in to Web3 Portfolio — ${Date.now()}`
      const encoded = new TextEncoder().encode(message)
      const signed = await signMessage(encoded)
      const hex = Array.from(signed).map(b => b.toString(16).padStart(2, '0')).join('')
      setAuthSig(hex.slice(0, 64) + '...')
    } catch (err: any) {
      setError(err?.message || 'Failed to sign message')
    }
  }, [connected, publicKey, signMessage])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
    } catch (err) {
      console.error('Failed to disconnect:', err)
    }
  }, [disconnect])

  const copyAddress = useCallback(async () => {
    if (!publicKey) return
    try {
      await navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [publicKey])

  if (!isMounted) {
    return (
      <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-sm text-foreground/90 max-w-md">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-sm text-foreground/90 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-accent" />
          <span className="font-medium">Wallet</span>
        </div>
        <div className="text-xs text-foreground/60">
          {connected ? (
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{network}</span>
            </span>
          ) : (
            'Disconnected'
          )}
        </div>
      </div>

      {/* Not connected state */}
      {!connected && (
        <div className="space-y-3">
          <p className="text-foreground/70">Connect your wallet to view account details</p>
          <motion.button
            onClick={() => setVisible(true)}
            disabled={connecting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-accent to-accent-dark text-black font-semibold rounded-lg disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {connecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Connected state */}
      {connected && publicKey && (
        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs text-foreground/60 mb-1">Address</span>
              <span className="font-mono text-sm">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </span>
            </div>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-foreground/60" />
              )}
            </button>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs text-foreground/60 mb-1">Balance</span>
              <span className="font-semibold text-lg">
                {loading ? '...' : balance !== null ? `${balance.toFixed(4)} SOL` : '—'}
              </span>
            </div>
            <button
              onClick={refreshBalance}
              disabled={loading}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh balance"
            >
              <RefreshCw className={`w-4 h-4 text-foreground/60 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Wallet name */}
          <div className="text-xs text-foreground/60">
            Connected via <span className="text-accent">{wallet?.adapter?.name || 'Unknown'}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignMessage}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-accent/10 text-accent rounded-lg text-sm border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              <PenLine className="w-4 h-4" />
              <span>Sign Message</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-600/10 text-red-400 rounded-lg text-sm hover:bg-red-600/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>

          {/* Signed message */}
          {authSig && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-xs text-green-400 mb-1">Signed Message</div>
              <div className="text-xs font-mono text-foreground/80 break-all">{authSig}</div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-xs text-red-400">{error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

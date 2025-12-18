'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { getWalletBalance, shortenAddress, getNetworkFromEndpoint } from '@/lib/solana/utils'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

export function WalletInfo() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true)
      getWalletBalance(connection, publicKey)
        .then((bal) => {
          setBalance(bal)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching balance:', err)
          setLoading(false)
        })

      const endpoint = connection.rpcEndpoint
      setNetwork(getNetworkFromEndpoint(endpoint))
    } else {
      setBalance(null)
      setNetwork('')
    }
  }, [connected, publicKey, connection])

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!connected || !publicKey) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <p className="text-foreground/60 text-center">
          Connect your wallet to view account information
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-5 shadow-card"
    >
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-dark rounded-full" />
        <h3 className="text-xl font-bold text-foreground">Wallet Information</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-foreground/60 mb-2 block uppercase tracking-wider">Address</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-sm text-foreground font-mono backdrop-blur-sm">
              {publicKey.toString()}
            </code>
            <button
              onClick={copyAddress}
              className="p-3 hover:bg-background/50 rounded-lg transition-all hover:scale-110 border border-border/50"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-foreground/60 hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground/60 mb-2 block uppercase tracking-wider">Network</label>
          <div className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-sm text-foreground backdrop-blur-sm">
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">{network}</span>
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground/60 mb-2 block uppercase tracking-wider">Balance</label>
          <div className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-sm text-foreground backdrop-blur-sm">
            {loading ? (
              <span className="text-foreground/60">Loading...</span>
            ) : balance !== null ? (
              <span className="font-mono font-semibold text-accent">{balance.toFixed(4)} SOL</span>
            ) : (
              <span className="text-foreground/60">—</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


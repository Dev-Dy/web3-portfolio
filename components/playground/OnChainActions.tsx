'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { motion } from 'framer-motion'
import { Send, RefreshCw } from 'lucide-react'

export function OnChainActions() {
  const { publicKey, sendTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTestTransaction = async () => {
    if (!publicKey || !sendTransaction) {
      setResult({ success: false, message: 'Wallet not connected' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Create a simple transfer transaction (sending 0 SOL to ourselves as a test)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey, // Sending to self (safe, no SOL lost)
          lamports: 0, // 0 SOL transfer
        })
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Send transaction
      const signature = await sendTransaction(transaction, connection)
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      setResult({
        success: true,
        message: `Transaction successful! Signature: ${signature.slice(0, 8)}...`,
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Transaction failed',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setResult(null)
  }

  if (!connected || !publicKey) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <p className="text-foreground/60 text-center">
          Connect your wallet to perform on-chain actions
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
        <h3 className="text-xl font-bold text-foreground">On-Chain Actions</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-2">Test Transaction</h4>
          <p className="text-xs text-foreground/70 mb-4 leading-relaxed">
            Send a 0 SOL transaction to yourself. This is a safe way to test transaction signing
            without spending any SOL.
          </p>
          <button
            onClick={handleTestTransaction}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-black font-semibold rounded-lg transition-all duration-300 shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-glow"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Test Transaction</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-xl border backdrop-blur-sm ${
              result.success
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm flex-1">{result.message}</p>
              <button
                onClick={handleRefresh}
                className="ml-2 p-1 hover:bg-black/20 rounded transition-colors"
                title="Clear"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-foreground/60">
          <strong>Note:</strong> All transactions require wallet approval. This is a demo
          environment - use Devnet for testing.
        </p>
      </div>
    </motion.div>
  )
}


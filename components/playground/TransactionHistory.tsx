'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { getTransactionHistory, shortenAddress } from '@/lib/solana/utils'
import { ParsedTransactionWithMeta } from '@solana/web3.js'
import { motion } from 'framer-motion'
import { ExternalLink, Clock } from 'lucide-react'

export function TransactionHistory() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [transactions, setTransactions] = useState<ParsedTransactionWithMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true)
      setError(null)
      // Limit to 5 transactions for better performance
      getTransactionHistory(connection, publicKey, 5)
        .then((txs) => {
          setTransactions(txs)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching transactions:', err)
          setError('Failed to fetch transactions')
          setLoading(false)
        })
    } else {
      setTransactions([])
    }
  }, [connected, publicKey, connection])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getTransactionType = (tx: ParsedTransactionWithMeta): string => {
    if (!tx.meta) return 'Unknown'
    
    const instructions = tx.transaction.message.instructions
    if (instructions.length === 0) return 'Unknown'
    
    // Check for common instruction types
    const firstInstruction = instructions[0]
    if ('parsed' in firstInstruction) {
      return firstInstruction.parsed.type || 'Transfer'
    }
    
    return 'Transaction'
  }

  const getTransactionStatus = (tx: ParsedTransactionWithMeta): { status: string; color: string } => {
    if (!tx.meta) {
      return { status: 'Unknown', color: 'text-foreground/60' }
    }
    
    if (tx.meta.err) {
      return { status: 'Failed', color: 'text-red-500' }
    }
    
    return { status: 'Success', color: 'text-green-500' }
  }

  if (!connected || !publicKey) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <p className="text-foreground/60 text-center">
          Connect your wallet to view transaction history
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-dark rounded-full" />
          <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
        </div>
        {transactions.length > 0 && (
          <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
            {transactions.length} transactions
          </span>
        )}
      </div>

      {loading && (
        <div className="text-center py-12 text-foreground/60">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mb-3" />
          <p>Loading transactions...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="inline-block p-3 bg-red-500/10 rounded-full mb-3">
            <span className="text-red-500 text-xl">⚠</span>
          </div>
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="text-center py-12 text-foreground/60">
          <p className="text-lg mb-2">No transactions found</p>
          <p className="text-sm">Your transaction history will appear here</p>
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="space-y-3">
          {transactions.map((tx, index) => {
            const signature = tx.transaction.signatures[0]
            const status = getTransactionStatus(tx)
            const type = getTransactionType(tx)
            const timestamp = tx.blockTime || 0

            return (
              <motion.div
                key={signature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-accent/50 hover:bg-background/70 transition-all card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-foreground/80">{type}</span>
                      <span className={`text-xs ${status.color}`}>{status.status}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-foreground/60">
                      <code className="font-mono">{shortenAddress(signature, 8)}</code>
                    </div>
                    {timestamp > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-foreground/60">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(timestamp)}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://solscan.io/tx/${signature}?cluster=${connection.rpcEndpoint.includes('devnet') ? 'devnet' : 'mainnet-beta'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-card rounded transition-colors"
                    title="View on Solscan"
                  >
                    <ExternalLink className="w-4 h-4 text-foreground/60 hover:text-accent" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}


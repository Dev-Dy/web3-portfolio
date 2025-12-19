'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletInfo } from '@/components/playground/WalletInfo'
import { TransactionHistory } from '@/components/playground/TransactionHistory'
import { OnChainActions } from '@/components/playground/OnChainActions'
import { WalletButton } from '@/components/wallet/WalletButton'
import { motion } from 'framer-motion'
import { Wallet, Activity, Zap } from 'lucide-react'

export default function PlaygroundPage() {
  const { connected } = useWallet()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl">
            <Activity className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Playground</h1>
        </div>
        <p className="text-xl text-foreground/80 max-w-3xl leading-relaxed">
          Interactive Web3 playground for testing wallet connections, reading on-chain data,
          and submitting transactions.
        </p>
      </motion.div>

      {!connected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-16 text-center shadow-card"
        >
          <div className="relative inline-block mb-6">
            <Wallet className="w-20 h-20 text-accent/30 mx-auto" />
            <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            Connect your Solana wallet to start interacting with the blockchain.
            View your balance, transaction history, and test transactions.
          </p>
          <WalletButton />
        </motion.div>
      )}

      {connected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WalletInfo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <OnChainActions />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <TransactionHistory />
          </motion.div>
        </div>
      )}

      {connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-gradient-to-br from-card/80 to-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-4">
                What You Can Do Here
              </h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-lg mt-0.5">▸</span>
                  <span>
                    <strong className="text-foreground">View Wallet Info:</strong> See your address, network, and SOL balance
                    in real-time
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-lg mt-0.5">▸</span>
                  <span>
                    <strong className="text-foreground">Transaction History:</strong> Browse your recent on-chain transactions
                    with links to Solscan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-3 text-lg mt-0.5">▸</span>
                  <span>
                    <strong className="text-foreground">Test Transactions:</strong> Send a 0 SOL transaction to yourself to
                    test the transaction signing flow
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

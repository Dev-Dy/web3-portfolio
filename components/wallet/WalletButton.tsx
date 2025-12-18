'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useConnection } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { motion } from 'framer-motion'

export function WalletButton() {
  const { wallet, publicKey, disconnect, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')

  useEffect(() => {
    if (connected && publicKey) {
      // Fetch balance
      connection.getBalance(publicKey).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL)
      })

      // Get network from connection endpoint
      const endpoint = connection.rpcEndpoint
      if (endpoint.includes('devnet')) {
        setNetwork('Devnet')
      } else if (endpoint.includes('mainnet')) {
        setNetwork('Mainnet')
      } else {
        setNetwork('Localnet')
      }
    } else {
      setBalance(null)
      setNetwork('')
    }
  }, [connected, publicKey, connection])

  const handleClick = () => {
    if (connected) {
      disconnect()
    } else {
      setVisible(true)
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (connected && publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-3"
      >
        <div className="hidden sm:flex flex-col items-end text-sm bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2">
          <div className="text-foreground font-medium font-mono">
            {shortenAddress(publicKey.toString())}
          </div>
          <div className="text-foreground/60 text-xs flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span>{network} • {balance !== null ? `${balance.toFixed(2)} SOL` : '...'}</span>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="px-5 py-2.5 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-black font-semibold rounded-lg transition-all duration-300 shadow-glow hover:shadow-glow-lg"
        >
          Disconnect
        </button>
      </motion.div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-black font-semibold rounded-lg transition-all duration-300 shadow-glow hover:shadow-glow-lg hover:scale-105"
    >
      Connect Wallet
    </button>
  )
}


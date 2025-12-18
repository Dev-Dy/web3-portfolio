import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export async function getWalletBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey)
  return balance / LAMPORTS_PER_SOL
}

export async function getTransactionHistory(
  connection: Connection,
  publicKey: PublicKey,
  limit: number = 5
): Promise<ParsedTransactionWithMeta[]> {
  try {
    // Fetch signatures first (faster)
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit })
    
    if (signatures.length === 0) {
      return []
    }

    // Fetch transaction details in parallel for better performance
    const transactionPromises = signatures.map((sig) =>
      connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
    )
    
    const transactions = await Promise.all(transactionPromises)

    return transactions.filter((tx): tx is ParsedTransactionWithMeta => tx !== null)
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    return []
  }
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function getNetworkFromEndpoint(endpoint: string): string {
  if (endpoint.includes('devnet')) {
    return 'Devnet'
  } else if (endpoint.includes('mainnet')) {
    return 'Mainnet'
  } else if (endpoint.includes('testnet')) {
    return 'Testnet'
  } else {
    return 'Localnet'
  }
}

export function formatSOL(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4)
}


'use client'

import { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion } from 'framer-motion'

function u8aToHex(u8a: Uint8Array) {
  return Array.from(u8a)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function WalletDetails() {
  const { wallet, publicKey, connected, connecting, disconnect, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const { connection } = useConnection()

  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[] | null>(null)
  const [authSig, setAuthSig] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detectedAdapters, setDetectedAdapters] = useState<string[] | null>(null)
  const [adapterObjects, setAdapterObjects] = useState<any[] | null>(null)
  const [connectingAdapter, setConnectingAdapter] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const getAdapterName = (a: any) => a?.name ?? a?.adapter?.name ?? 'Wallet'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // expose detected adapters for debug (populated by WalletProvider)
    if (typeof window !== 'undefined') {
      try {
        const list = (window as any).__WALLETS
        if (Array.isArray(list)) {
          setDetectedAdapters(list.map((a: any) => getAdapterName(a) || 'unnamed'))
          setAdapterObjects(list)
        }
      } catch {}
    }
    let mounted = true
    if (connected && publicKey) {
      setLoading(true)
      connection.getBalance(publicKey).then((lamports) => {
        if (!mounted) return
        setBalance(lamports / 1e9)
        setLoading(false)
      }).catch((err) => {
        if (!mounted) return
        setError(String(err))
        setLoading(false)
      })

      // recent signatures
      connection.getSignaturesForAddress(publicKey, { limit: 6 }).then((sigs) => {
        if (!mounted) return
        setRecent(sigs.map((s) => s.signature))
      }).catch(() => {
        if (!mounted) return
        setRecent(null)
      })

      // detect network name
      try {
        const ep = connection.rpcEndpoint
        if (ep.includes('devnet')) setNetwork('Devnet')
        else if (ep.includes('mainnet')) setNetwork('Mainnet')
        else setNetwork('Custom')
      } catch {
        setNetwork('Unknown')
      }
    } else {
      setBalance(null)
      setRecent(null)
      setAuthSig(null)
    }
    return () => { mounted = false }
  }, [connected, publicKey, connection])

  const refresh = async () => {
    if (!connected || !publicKey) return
    setLoading(true)
    try {
      const lamports = await connection.getBalance(publicKey)
      setBalance(lamports / 1e9)
    } catch (err: any) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSignMessage = async () => {
    setError(null)
    setAuthSig(null)
    if (!connected || !publicKey) {
      setError('Wallet not connected')
      return
    }

    if (!signMessage) {
      setError('This wallet does not support `signMessage`.')
      return
    }

    try {
      const message = `Sign in to Web3 Portfolio — ${Date.now()}`
      const encoded = new TextEncoder().encode(message)
      const signed = await signMessage(encoded)
      const hex = u8aToHex(signed)
      setAuthSig(hex)
    } catch (err: any) {
      setError(String(err?.message ?? err))
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (err: any) {
      setError(String(err))
    }
  }

  // Fallback: programmatic connect to an adapter object when modal doesn't work
  const connectAdapterDirect = async (adapter: any) => {
    if (!adapter) return
    setError(null)
    setConnectingAdapter(getAdapterName(adapter))
    try {
      // Some adapters expose `connect()` directly
      if (typeof adapter.connect === 'function') {
        await adapter.connect()
        try { localStorage.setItem('selectedWallet', adapter.name) } catch {}
      } else if (adapter.adapter && typeof adapter.adapter.connect === 'function') {
        // Some wrappers expose an inner adapter
        await adapter.adapter.connect()
        try { localStorage.setItem('selectedWallet', adapter.adapter.name) } catch {}
      } else {
        throw new Error('Adapter does not expose connect()')
      }
    } catch (err: any) {
      // Friendly error messages and popup guidance
      const msg = String(err?.message ?? err)
      // Provide helpful guidance for known extension/content-script failures
      if (/solanaActionsContentScript|Something went wrong/i.test(msg)) {
        setError(msg + ' — Wallet extension internal error. Try restarting the extension or browser, or use a different browser/profile where the wallet is installed.')
      } else {
        setError(msg)
      }
      // Detect popup/policy issues
      if (/popup|blocked|user denied|user closed/i.test(msg)) {
        setError(msg + ' — your browser may be blocking popups or the wallet prompt. Please allow popups for localhost and try again.')
      }
      // Also log for debugging
      // eslint-disable-next-line no-console
      console.error('[WalletDetails] connectAdapterDirect error', getAdapterName(adapter), err)
    } finally {
      setConnectingAdapter(null)
    }
  }

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-4 text-sm text-foreground/90 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-foreground/60">Wallet</div>
        <div className="text-xs text-foreground/60">{connected ? network : 'Disconnected'}</div>
      </div>

      {!connected && (
        <div className="flex items-center justify-between">
          <div className="text-sm">Not connected</div>
          <button
            onClick={() => setVisible(true)}
            className="px-4 py-2 bg-gradient-to-r from-accent to-accent-dark text-black rounded-md text-sm"
          >
            Connect
          </button>
        </div>
      )}

      {/* Custom in-app wallet list + fallback connect */}
      {!connected && adapterObjects && adapterObjects.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-foreground/60 mb-2">Available wallets (fallback connect)</div>
          <div className="flex flex-wrap gap-2">
            {adapterObjects.map((a: any, i: number) => (
              <button
                key={i}
                onClick={() => connectAdapterDirect(a)}
                disabled={!!connectingAdapter}
                className="px-3 py-1 bg-accent/10 text-accent rounded-md text-xs border border-accent/20"
              >
                {connectingAdapter === (a.name ?? a.adapter?.name) ? 'Connecting…' : (a.name ?? a.adapter?.name ?? 'Wallet')}
              </button>
            ))}
          </div>
          <div className="text-xs text-foreground/60 mt-2">If selecting a wallet doesn't prompt, try using the buttons above or allow popups for this site.</div>
        </div>
      )}

      {connected && publicKey && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm">{publicKey.toString()}</div>
            <div className="text-xs text-foreground/60">{loading ? '...' : `${balance ?? '—'} SOL`}</div>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={refresh} className="px-3 py-1 bg-accent/20 text-accent rounded-md text-xs">Refresh</button>
            <button onClick={handleSignMessage} className="px-3 py-1 bg-accent/10 text-accent rounded-md text-xs border border-accent/30">Sign Message</button>
            <button onClick={handleDisconnect} className="ml-auto px-3 py-1 bg-red-600/10 text-red-400 rounded-md text-xs">Disconnect</button>
          </div>

          <div className="pt-2">
            <div className="text-xs text-foreground/60">Recent Signatures</div>
            <div className="mt-1 text-xs font-mono break-words">{recent ? recent.join(', ') : '—'}</div>
          </div>

          {authSig && (
            <div className="pt-2">
              <div className="text-xs text-foreground/60">Signed Message (hex)</div>
              <div className="mt-1 text-xs font-mono break-words">{authSig}</div>
            </div>
          )}

          {error && (
            <div className="pt-2 text-xs text-rose-400">{error}</div>
          )}
        </div>
      )}

      {/* Debug info: show detected adapters and selected wallet name (dev only) */}
      {isMounted && (
        <div className="mt-3 text-xs text-foreground/60">
          <div>Detected adapters: {detectedAdapters ? detectedAdapters.join(', ') : 'None'}</div>
          <div>Selected wallet: {wallet?.adapter?.name ?? '—'}</div>
        </div>
      )}
    </div>
  )
}

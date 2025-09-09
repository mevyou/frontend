'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { Wallet, LogOut } from 'lucide-react'

// Simple component to render the custom element
const W3MButton = () => (
  <div dangerouslySetInnerHTML={{ __html: '<w3m-button></w3m-button>' }} />
)

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-card-foreground font-medium">{formatAddress(address)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1 text-brand-red hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    )
  }

  return <W3MButton />
}

export function ConnectWalletButton() {
  return (
    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
      <Wallet size={20} />
      <W3MButton />
    </button>
  )
}
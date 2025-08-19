'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { Wallet, LogOut } from 'lucide-react'

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-white font-medium">{formatAddress(address)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    )
  }

  return (
    <w3m-button />
  )
}

export function ConnectWalletButton() {
  return (
    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
      <Wallet size={20} />
      <w3m-button />
    </button>
  )
}
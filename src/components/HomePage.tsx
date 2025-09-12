'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import {
  Share2,
  Copy,
  User,
  Home,
  TrendingUp,
  Gamepad2,
  FileText,
  Gift,
  Wallet,
  ChevronDown
} from 'lucide-react'
import { formatAddress } from '@/lib/utils'
import { toast } from 'react-hot-toast'

type TabType = 'tokens' | 'nfts' | 'transactions'

export function HomePage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<TabType>('tokens')

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  const openInExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank')
    }
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join MeVsYou',
        text: 'Check out this awesome betting platform!',
        url: window.location.origin
      })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      toast.success('Referral link copied to clipboard!')
    }
  }

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome to MeVsYou</h1>
            <p className="text-gray-300 text-lg mb-8">Connect your wallet to start betting and earning</p>
            <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-teal-300 text-sm">
                Connect your wallet to view your profile, manage bets, and track your earnings
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Time */}
            {/* <div className="text-sm text-gray-400">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </div> */}

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xs">MV</span>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold leading-tight">ME VS YOU</div>
                <div className="text-xs text-gray-400 leading-tight">BETTING</div>
              </div>
            </div>

            {/* USDT Balance */}
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1.5">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">550.96 USDT</span>
              <ChevronDown size={14} className="text-green-400" />
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Share Referral Button */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-10">
        Profile
        <button
          onClick={shareReferral}
          className="w-[20rem] bg-teal-500/20 border border-teal-500/30 py-3 px-4 flex items-center justify-center gap-2 text-teal-300 hover:bg-teal-500/30 transition-colors rounded-2xl"
        >
          <Share2 size={18} />
          <span className="font-medium">Share Referral Link</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-400">Connected to Metamask</span>
          </div>

          {/* Available Balance */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-400 mb-1">Available balance</div>
            <div className="text-2xl font-bold">~ $75,240.00</div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">Drey.eth</div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{formatAddress(address)}</span>
                <button
                  onClick={copyAddress}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                  title="Copy address"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <button
              onClick={openInExplorer}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              <User size={16} />
              <span>View Profile</span>
            </button>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-4 mb-8">
          {/* Locked in Bets */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Locked in bets</div>
                <div className="text-xl font-bold">~ $3,240.00</div>
              </div>
              <button className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors">
                Unstake
              </button>
            </div>
          </div>

          {/* Pending Winnings */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Pending Winnings</div>
                <div className="text-xl font-bold text-green-400">~ $9,353.00</div>
              </div>
              <button className="bg-teal-500/20 border border-teal-500/30 text-teal-400 px-4 py-2 rounded-lg hover:bg-teal-500/30 transition-colors">
                My Bets
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            {[
              { id: 'tokens', label: 'Tokens' },
              { id: 'nfts', label: 'NFTs' },
              { id: 'transactions', label: 'Transaction history' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 rounded-lg p-4 min-h-[200px]">
          {activeTab === 'tokens' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Wallet size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your Tokens</h3>
              <p className="text-gray-400 text-sm">Connect your wallet to view your token holdings</p>
            </div>
          )}

          {activeTab === 'nfts' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Gamepad2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your NFTs</h3>
              <p className="text-gray-400 text-sm">No NFTs found in your wallet</p>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
              <p className="text-gray-400 text-sm">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-around py-3">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: TrendingUp, label: 'Market' },
            { icon: Gamepad2, label: 'Games' },
            { icon: FileText, label: 'My bets' },
            { icon: Gift, label: 'Earn' },
            { icon: Wallet, label: 'Wallet' }
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${item.active
                ? 'text-teal-400 bg-teal-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom spacing for navigation */}
      <div className="h-20"></div>
    </div>
  )
}

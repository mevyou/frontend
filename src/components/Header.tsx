'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { Menu, X, User, Wallet, LogOut, TrendingUp, Home, ChevronDown, Copy, ExternalLink } from 'lucide-react'
import { WalletConnect } from './WalletConnect'
import { ThemeToggle } from './ThemeToggle'
import { formatWeiToEther, formatAddress, cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function Header() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsProfileMenuOpen(false)
    toast.success('Wallet disconnected')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'My Bets', href: '/my-bets', icon: TrendingUp },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">MevYou</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 transition-colors px-3 py-2 rounded-lg",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Wallet & Profile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {isConnected && address ? (
              <div className="flex items-center gap-4">
                {/* Balance Display */}
                {balance && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {parseFloat(formatWeiToEther(balance.value)).toFixed(4)} ETH
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
                  </div>
                )}

                {/* Profile Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-gray-900 dark:text-white text-sm font-medium">
                      {formatAddress(address)}
                    </span>
                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Connected Wallet</p>
                            <p className="text-xs text-gray-400">{formatAddress(address)}</p>
                          </div>
                        </div>
                        {balance && (
                          <div className="mt-3 p-2 bg-gray-700 rounded">
                            <p className="text-xs text-gray-400">Balance</p>
                            <p className="text-sm font-medium text-white">{parseFloat(formatWeiToEther(balance.value)).toFixed(4)} ETH</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={copyAddress}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy size={16} />
                          <span>Copy Address</span>
                        </button>
                        <button
                          onClick={openEtherscan}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                          <ExternalLink size={16} />
                          <span>View on Etherscan</span>
                        </button>
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        >
                          <User size={16} />
                          <span>View Profile</span>
                        </Link>
                        <hr className="my-2 border-gray-700" />
                        <button
                          onClick={handleDisconnect}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <WalletConnect />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            {/* Navigation Links */}
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 transition-colors py-2 px-3 rounded-lg",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              )
            })}

            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Theme:</span>
              <ThemeToggle />
            </div>

            {/* Wallet Section */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              {isConnected && address ? (
                <div className="space-y-3">
                  {/* Balance */}
                  {balance && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white font-medium">
                        {parseFloat(formatWeiToEther(balance.value)).toFixed(4)} ETH
                      </span>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">Address:</span>
                    <span className="text-white font-medium">{formatAddress(address)}</span>
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  {/* Disconnect */}
                  <button
                    onClick={() => {
                      disconnect()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors py-2"
                  >
                    <LogOut size={16} />
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <WalletConnect />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  )
}
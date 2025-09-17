import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { arbitrum, mainnet, polygon, sepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

// 2. Create wagmiConfig
const metadata = {
  name: 'MevYou P2P Betting',
  description: 'Decentralized Peer-to-Peer Betting Platform',
  url: 'https://mevyou.com',
  icons: ['https://github.com/mevyou/frontend/blob/main/public/image/logo.png']
}

const chains = [sepolia, mainnet, polygon, arbitrum, sepolia] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

export const queryClient = new QueryClient()
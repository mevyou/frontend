# MevYou - P2P Betting Platform

A decentralized peer-to-peer betting platform built with Next.js, TypeScript, and Web3 technologies.

## Features

- 🔗 **Web3 Integration**: Connect with MetaMask and other wallets via WalletConnect
- 🎯 **P2P Betting**: Create and join betting pools with other users
- 👤 **User Profiles**: Track betting history, statistics, and performance
- 📱 **Responsive Design**: Modern UI built with Tailwind CSS
- ⚡ **Real-time Updates**: Live bet status and notifications
- 🔒 **Secure**: Smart contract-based betting with transparent resolution

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, Web3Modal
- **UI Components**: Headless UI, Lucide React, Framer Motion
- **State Management**: TanStack Query
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask recommended)
- WalletConnect Project ID (for wallet connections)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mevyou/frontend.git
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local .env.local.example
```

Edit `.env.local` and add your configuration:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_DEFAULT_CHAIN_ID=11155111
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page with betting dashboard
│   └── profile/           # User profile page
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── BettingDashboard.tsx
│   ├── BetCard.tsx
│   ├── CreateBetModal.tsx
│   ├── Header.tsx
│   ├── UserProfile.tsx
│   └── WalletConnect.tsx
├── hooks/                 # Custom React hooks
│   └── useBetting.ts      # Betting contract interactions
├── lib/                   # Utility libraries
│   ├── contracts/         # Smart contract ABIs
│   ├── utils.ts          # Helper functions
│   └── web3.ts           # Web3 configuration
└── styles/               # Global styles
```

## Smart Contract Integration

The application integrates with a P2P betting smart contract that supports:

- Creating new bets with custom descriptions and amounts
- Joining existing open bets
- Resolving bets with winner selection
- Canceling unmatched bets
- Viewing bet history and statistics

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet
2. **Create Bet**: Use the "Create Bet" button to set up a new betting pool
3. **Join Bets**: Browse available bets and join ones you're interested in
4. **Track Progress**: Monitor your bets in the dashboard and profile page
5. **Resolve Bets**: Participate in bet resolution when conditions are met

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS` | Smart contract address | Yes |
| `NEXT_PUBLIC_DEFAULT_CHAIN_ID` | Default blockchain network ID | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

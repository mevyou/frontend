/**
 * Centralized SVG Icons Management
 * Similar to Flutter's AppIcons, this file contains all SVG icon paths
 * Usage: import { AppIcons } from '@/lib/appIcons'
 * Example: <Image src={AppIcons.logo} alt="Logo" />
 */

export const AppIcons = {
  // Navigation & UI Icons
  logo: "/svg/logo.svg",
  home: "/svg/home1.svg",
  homebg: "/svg/homebg.svg",
  sidebarLeft: "/svg/sidebar-left.svg",
  gridView: "/svg/grid-view.svg",
  list: "/svg/list.svg",
  filter: "/svg/filter.svg",
  filters: "/svg/filters.svg",
  search: "/svg/search.svg",
  refresh: "/svg/refresh.svg",

  // User & Account Icons
  user: "/svg/user.svg",
  addUser: "/svg/add-user.svg",
  gamer: "/svg/gamer.svg",

  // Wallet & Finance Icons
  wallet: "/svg/wallet.svg",
  wallet05: "/svg/wallet-05.svg",
  addWallet: "/svg/add-wallet.svg",
  dollar: "/svg/dollar.svg",
  coins: "/svg/coins.svg",

  // Cryptocurrency Icons
  eth: "/svg/eth.svg",
  bnb: "/svg/bnb.svg",
  usdc: "/svg/usdc.svg",
  usdt: "/svg/usdt.svg",
  blockchain: "/svg/blockchain.svg",

  // Action Icons
  addCircle: "/svg/add-circle.svg",
  plusSign: "/svg/plus-sign.svg",
  cancelCircle: "/svg/cancel-circle.svg",
  checkmark: "/svg/checkmark.svg",
  checkmarkCircle: "/svg/checkmark-circle.svg",

  // Arrow Icons
  arrowDown: "/svg/arrow-down.svg",
  arrowDown1: "/svg/arrow-down1.svg",

  // Communication Icons
  bubbleChat: "/svg/bubble-chat.svg",
  mailActive: "/svg/mail-active.svg",
  share: "/svg/share1.svg",

  // Game & Competition Icons
  game: "/svg/game.svg",
  fire: "/svg/fire.svg",
  magic: "/svg/magic.svg",
  trophy: "/svg/trophy.svg", // Note: Add trophy.svg if available
  smiley: "/svg/smiley.svg",

  // Analytics & Charts
  analytics: "/svg/analytics.svg",
  chartUp: "/svg/chart-up.svg",

  // Time & Status Icons
  timer: "/svg/timer.svg",
  hourglass: "/svg/hourglass.svg",

  // Legend & Node Icons
  legendNode: "/svg/LegendNode.svg",
  legendNode1: "/svg/LegendNode1.svg",
  legendNode2: "/svg/LegendNode2.svg",
  legendNode3: "/svg/LegendNode3.svg",

  // Gift & Rewards
  gift: "/svg/gift.svg",
  giftActive: "/svg/gift-active.svg",

  // Background & Decorative
  bg: "/svg/bg.svg",
  frame: "/svg/frame.svg",
  frame1: "/svg/frame1.svg",

  // Document & File Icons
  file: "/svg/file.svg",
  invoice: "/svg/invoice.svg",
  transactionHistory: "/svg/transaction-history.svg",
} as const;

// Type for icon keys to ensure type safety
export type AppIconKey = keyof typeof AppIcons;

/**
 * Helper function to get icon path with type safety
 * @param iconName - The name of the icon
 * @returns The path to the SVG icon
 */
export const getIcon = (iconName: AppIconKey): string => {
  return AppIcons[iconName];
};

/**
 * Helper function to check if an icon exists
 * @param iconName - The name of the icon to check
 * @returns Boolean indicating if the icon exists
 */
export const hasIcon = (iconName: string): iconName is AppIconKey => {
  return iconName in AppIcons;
};

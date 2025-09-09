import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MevYou - P2P Betting Platform",
  description: "Decentralized peer-to-peer betting platform on Web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} font-nunito-sans antialiased bg-gray-100 dark:bg-black text-gray-900 dark:text-white transition-colors`}
      >
        <ThemeProvider>
          <Web3Provider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "dark:bg-gray-800 dark:text-white bg-white text-gray-900",
              }}
            />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

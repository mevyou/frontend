import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Toaster } from "react-hot-toast";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MevYou - P2P Betting Platform",
  description: "Decentralized peer-to-peer betting platform on Web3",
  icons: {
    icon: "/image/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${nunitoSans.variable} font-nunito-sans antialiased text-white transition-colors`}
        style={{ backgroundColor: '#121214' }}
      >
        <Web3Provider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "bg-gray-800 text-white",
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}

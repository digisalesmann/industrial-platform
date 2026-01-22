"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fix-overflow.css";
import { Providers } from "./providers";
import '@rainbow-me/rainbowkit/styles.css';
import WalletSidebar from '@/components/WalletSidebar';
import { WalletSidebarContext } from '@/components/WalletSidebarContext';
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isWalletSidebarOpen, setIsWalletSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen w-full bg-[#050505] relative overflow-x-hidden"}>
        {/* Industrial Theme Global Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Layer 1: The Industrial Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          {/* Layer 2: The Core Atmospheric Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
          {/* Layer 3: Noise/Grain Texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
        <Providers>
          <WalletSidebarContext.Provider value={{ isOpen: isWalletSidebarOpen, setIsOpen: setIsWalletSidebarOpen }}>
            <div className="relative z-10 min-h-screen">
              {children}
              <WalletSidebar isOpen={isWalletSidebarOpen} onClose={() => setIsWalletSidebarOpen(false)} />
            </div>
          </WalletSidebarContext.Provider>
        </Providers>
      </body>
    </html>
  );
}
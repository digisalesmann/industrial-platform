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
      <body className={inter.className}>
        <Providers>
          <WalletSidebarContext.Provider value={{ isOpen: isWalletSidebarOpen, setIsOpen: setIsWalletSidebarOpen }}>
            {children}
            <WalletSidebar isOpen={isWalletSidebarOpen} onClose={() => setIsWalletSidebarOpen(false)} />
          </WalletSidebarContext.Provider>
        </Providers>
      </body>
    </html>
  );
}
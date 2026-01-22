'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, users, isAuthenticated, removeToken } from '@/lib/api';
import { useAccount, useSignMessage } from 'wagmi';

interface User {
    id: number;
    wallet_address: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    authenticateWallet: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    useEffect(() => {
        // Check if user is already logged in with valid token
        async function loadUser() {
            if (isAuthenticated()) {
                try {
                    const profile = await users.getProfile();
                    setUser(profile);
                } catch {
                    removeToken();
                }
            }
            setIsLoading(false);
        }
        loadUser();
    }, []);


    // Auto-logout if wallet disconnects
    useEffect(() => {
        if (!isConnected && user) {
            logout();
        }
    }, [isConnected]);

    // Auto-authenticate whenever wallet is connected and not authenticated
    useEffect(() => {
        if (isConnected && address && !user) {
            authenticateWallet().catch(() => { });
        }
    }, [isConnected, address, !!user]);

    const authenticateWallet = async () => {
        if (!address) throw new Error('Wallet not connected');

        // Get nonce from backend
        const { message } = await auth.getNonce(address);

        // Sign the message with wallet
        const signature = await signMessageAsync({ message });

        // Verify signature and get JWT
        const { user: userData } = await auth.verify(address, signature);
        setUser(userData);
    };

    const logout = () => {
        auth.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, authenticateWallet, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

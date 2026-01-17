'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { getTokenLogoBySymbol } from './tokenLogo';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, erc20Abi } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Router ABI (only the functions we need)
const ROUTER_ABI = [
    {
        name: 'swapTokens',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'tokenIn', type: 'address' },
            { name: 'tokenOut', type: 'address' },
            { name: 'amountIn', type: 'uint256' },
            { name: 'minAmountOut', type: 'uint256' },
            { name: 'to', type: 'address' },
        ],
        outputs: [{ name: 'amountOut', type: 'uint256' }],
    },
] as const;

// Token configuration - update these with your deployed contract addresses
const TOKEN_CONFIG: Record<string, { address: `0x${string}`; decimals: number; name: string }> = {
    ETH: { address: '0x0000000000000000000000000000000000000000', decimals: 18, name: 'Ethereum' },
    WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, name: 'Wrapped Ethereum' },
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, name: 'USD Coin' },
    USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, name: 'Tether' },
    DAI: { address: '0x6B175474E89094C44Da98b954EesddFD691dCaC', decimals: 18, name: 'Dai' },
    WBTC: { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, name: 'Wrapped Bitcoin' },
};

// Router address - update with your deployed router
const ROUTER_ADDRESS = (process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

interface Token {
    symbol: string;
    name: string;
    address: `0x${string}`;
    decimals: number;
}

export default function FullScaleSwap() {
    const { address, isConnected } = useAccount();

    // Settings
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [slippage, setSlippage] = useState('0.5');

    // Token list
    const tokens: Token[] = useMemo(() => [
        { symbol: 'ETH', name: 'Ethereum', address: TOKEN_CONFIG.ETH.address, decimals: 18 },
        { symbol: 'USDC', name: 'USD Coin', address: TOKEN_CONFIG.USDC.address, decimals: 6 },
        { symbol: 'USDT', name: 'Tether', address: TOKEN_CONFIG.USDT.address, decimals: 6 },
        { symbol: 'DAI', name: 'Dai', address: TOKEN_CONFIG.DAI.address, decimals: 18 },
        { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: TOKEN_CONFIG.WBTC.address, decimals: 8 },
    ], []);

    // Selected tokens
    const [inputToken, setInputToken] = useState<Token>(tokens[0]);
    const [outputToken, setOutputToken] = useState<Token>(tokens[1]);

    // Input amounts
    const [inputAmount, setInputAmount] = useState('');
    const [outputAmount, setOutputAmount] = useState('');

    // UI state
    const [inputLogo, setInputLogo] = useState<string | null>(null);
    const [outputLogo, setOutputLogo] = useState<string | null>(null);
    const [dropdownLogos, setDropdownLogos] = useState<Record<string, string | undefined>>({});
    const [showInputDropdown, setShowInputDropdown] = useState(false);
    const [showOutputDropdown, setShowOutputDropdown] = useState(false);

    // Transaction state
    const [txStatus, setTxStatus] = useState<'idle' | 'approving' | 'swapping' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const inputDropdownRef = useRef<HTMLDivElement>(null);
    const outputDropdownRef = useRef<HTMLDivElement>(null);

    // Get input token balance
    const { data: inputBalance, refetch: refetchInputBalance } = useBalance({
        address: address,
        token: inputToken.symbol === 'ETH' ? undefined : inputToken.address,
    });

    // Get output token balance
    const { data: outputBalance } = useBalance({
        address: address,
        token: outputToken.symbol === 'ETH' ? undefined : outputToken.address,
    });

    // Check allowance for ERC20 tokens
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: inputToken.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: address && ROUTER_ADDRESS ? [address, ROUTER_ADDRESS] : undefined,
        query: {
            enabled: inputToken.symbol !== 'ETH' && !!address && ROUTER_ADDRESS !== '0x0000000000000000000000000000000000000000',
        },
    });

    // Approve contract
    const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();

    // Wait for approve transaction
    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    // Swap contract
    const { writeContract: swap, data: swapHash, isPending: isSwapping } = useWriteContract();

    // Wait for swap transaction
    const { isLoading: isSwapLoading, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
        hash: swapHash,
    });

    // Calculate output amount (simplified - in production, query the pool)
    useEffect(() => {
        if (!inputAmount || parseFloat(inputAmount) === 0) {
            setOutputAmount('');
            return;
        }

        // Simulated exchange rate - in production, query pool reserves
        const mockRates: Record<string, number> = {
            'ETH-USDC': 2500,
            'USDC-ETH': 0.0004,
            'ETH-USDT': 2500,
            'USDT-ETH': 0.0004,
            'ETH-DAI': 2500,
            'DAI-ETH': 0.0004,
            'USDC-USDT': 1,
            'USDT-USDC': 1,
            'ETH-WBTC': 0.05,
            'WBTC-ETH': 20,
        };

        const pairKey = `${inputToken.symbol}-${outputToken.symbol}`;
        const rate = mockRates[pairKey] || 1;
        const output = parseFloat(inputAmount) * rate;
        setOutputAmount(output.toFixed(6));
    }, [inputAmount, inputToken, outputToken]);

    // Handle approve success
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
            setTxStatus('idle');
        }
    }, [isApproveSuccess, refetchAllowance]);

    // Handle swap success
    useEffect(() => {
        if (isSwapSuccess) {
            setTxStatus('success');
            setInputAmount('');
            setOutputAmount('');
            refetchInputBalance();
            setTimeout(() => setTxStatus('idle'), 5000);
        }
    }, [isSwapSuccess, refetchInputBalance]);

    // Switch pairs
    const switchPairs = () => {
        const prevInput = inputToken;
        const prevInputAmount = inputAmount;
        setInputToken(outputToken);
        setOutputToken(prevInput);
        setInputAmount(outputAmount);
        setOutputAmount(prevInputAmount);
    };

    // Check if needs approval
    const needsApproval = useMemo(() => {
        if (inputToken.symbol === 'ETH') return false;
        if (!inputAmount || !allowance) return false;

        try {
            const amountIn = parseUnits(inputAmount, inputToken.decimals);
            return allowance < amountIn;
        } catch {
            return false;
        }
    }, [inputToken, inputAmount, allowance]);

    // Handle approve
    const handleApprove = async () => {
        if (!address) return;

        setTxStatus('approving');
        setErrorMessage(null);

        try {
            const amountIn = parseUnits(inputAmount, inputToken.decimals);
            approve({
                address: inputToken.address,
                abi: erc20Abi,
                functionName: 'approve',
                args: [ROUTER_ADDRESS, amountIn],
            });
        } catch (error: unknown) {
            setTxStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Approval failed');
        }
    };

    // Handle swap
    const handleSwap = async () => {
        if (!address || !inputAmount) return;

        setTxStatus('swapping');
        setErrorMessage(null);

        try {
            const amountIn = parseUnits(inputAmount, inputToken.decimals);
            const slippagePercent = parseFloat(slippage) / 100;
            const minOut = parseFloat(outputAmount) * (1 - slippagePercent);
            const minAmountOut = parseUnits(minOut.toFixed(outputToken.decimals), outputToken.decimals);

            swap({
                address: ROUTER_ADDRESS,
                abi: ROUTER_ABI,
                functionName: 'swapTokens',
                args: [inputToken.address, outputToken.address, amountIn, minAmountOut, address],
            });
        } catch (error: unknown) {
            setTxStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Swap failed');
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (inputDropdownRef.current && e.target instanceof Node && !inputDropdownRef.current.contains(e.target)) {
                setShowInputDropdown(false);
            }
            if (outputDropdownRef.current && e.target instanceof Node && !outputDropdownRef.current.contains(e.target)) {
                setShowOutputDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Load token logos
    useEffect(() => {
        getTokenLogoBySymbol(inputToken.symbol).then(setInputLogo);
    }, [inputToken]);

    useEffect(() => {
        getTokenLogoBySymbol(outputToken.symbol).then(setOutputLogo);
    }, [outputToken]);

    useEffect(() => {
        async function loadDropdownLogos() {
            const entries = await Promise.all(tokens.map(async t => [t.symbol, await getTokenLogoBySymbol(t.symbol)]));
            setDropdownLogos(Object.fromEntries(entries));
        }
        loadDropdownLogos();
    }, [tokens]);

    // Format balance display
    const formatBalance = (balance: typeof inputBalance) => {
        if (!balance) return '0.00';
        const value = parseFloat(balance.formatted);
        if (value < 0.0001 && value > 0) return '<0.0001';
        if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
        return value.toFixed(4);
    };

    // Get button state
    const getButtonState = () => {
        if (!isConnected) return { text: 'Connect Wallet', disabled: true, action: () => { } };
        if (!inputAmount || parseFloat(inputAmount) === 0) return { text: 'Enter Amount', disabled: true, action: () => { } };
        if (inputBalance && parseFloat(inputAmount) > parseFloat(inputBalance.formatted)) {
            return { text: 'Insufficient Balance', disabled: true, action: () => { } };
        }
        if (isApproving || isApproveLoading) return { text: 'Approving...', disabled: true, action: () => { } };
        if (isSwapping || isSwapLoading) return { text: 'Swapping...', disabled: true, action: () => { } };
        if (needsApproval) return { text: `Approve ${inputToken.symbol}`, disabled: false, action: handleApprove };
        return { text: 'Swap Now', disabled: false, action: handleSwap };
    };

    const buttonState = getButtonState();
    const isLoading = isApproving || isApproveLoading || isSwapping || isSwapLoading;

    // Calculate price impact (simplified)
    const priceImpact = useMemo(() => {
        if (!inputAmount || !outputAmount) return null;
        const impact = parseFloat(inputAmount) > 100 ? 0.5 : 0.01;
        return impact;
    }, [inputAmount, outputAmount]);

    return (
        <main className="min-h-screen bg-black text-white pt-24 md:pt-32 px-4 flex flex-col items-center">
            <Navbar currentView="marketplace" onViewChange={() => { }} />

            <div className="w-full max-w-[500px] relative">

                {/* HEADER & SETTINGS */}
                <div className="flex justify-between items-end mb-6 px-2">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Swap</h1>
                        <p className="text-[9px] text-zinc-500 font-mono tracking-[0.3em] mt-1 uppercase">Industrial DEX</p>
                    </div>
                    <button
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className="p-2 border border-white/10 hover:border-blue-500/50 bg-zinc-900/50 transition-all rounded-none group"
                    >
                        <svg className={`w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-transform ${settingsOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                    </button>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                    {settingsOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="absolute top-20 right-0 left-0 z-20 bg-zinc-950 border border-white/10 p-6 rounded-none shadow-2xl"
                        >
                            <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest">Slippage Tolerance</h3>
                            <div className="flex gap-2">
                                {['0.1', '0.5', '1.0'].map(val => (
                                    <button
                                        key={val} onClick={() => setSlippage(val)}
                                        className={`flex-1 py-2 text-[10px] font-mono border rounded-none ${slippage === val ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-white/5 text-zinc-500'}`}
                                    >
                                        {val}%
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    value={slippage}
                                    onChange={(e) => setSlippage(e.target.value)}
                                    className="w-20 bg-black border border-white/10 px-2 py-2 text-[10px] font-mono text-center outline-none focus:border-blue-500"
                                    placeholder="Custom"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Transaction Status Messages */}
                <AnimatePresence>
                    {txStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
                        >
                            <span className="text-emerald-500 text-lg">✓</span>
                            <span className="text-emerald-400 text-[11px] font-mono">Swap successful!</span>
                        </motion.div>
                    )}
                    {txStatus === 'error' && errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                        >
                            <span className="text-red-500 text-lg">!</span>
                            <span className="text-red-400 text-[11px] font-mono">{errorMessage}</span>
                            <button onClick={() => { setTxStatus('idle'); setErrorMessage(null); }} className="ml-auto text-zinc-500 hover:text-white">×</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MAIN SWAP INTERFACE */}
                <div className="bg-zinc-950 border border-white/10 p-1 md:p-2 rounded-none shadow-2xl">
                    <div className="space-y-1">
                        {/* INPUT BLOCK */}
                        <div className="bg-zinc-900/40 p-4 md:p-6 rounded-none border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">From</span>
                                <button
                                    onClick={() => inputBalance && setInputAmount(inputBalance.formatted)}
                                    className="text-[10px] font-mono text-zinc-600 hover:text-blue-500 transition-colors"
                                >
                                    Balance: {formatBalance(inputBalance)}
                                </button>
                            </div>
                            <div className="flex gap-2 md:gap-4 items-center">
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value)}
                                    className="bg-transparent text-2xl md:text-4xl font-black outline-none w-full placeholder:text-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <div className="relative shrink-0" ref={inputDropdownRef}>
                                    <button
                                        className="bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-full flex items-center gap-2 border border-white/5 transition-all min-w-[100px] md:min-w-[120px] justify-between"
                                        type="button"
                                        onClick={() => setShowInputDropdown(v => !v)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {inputLogo ? <img src={inputLogo} alt="" className="w-5 h-5 rounded-full object-contain bg-white p-0.5" /> : <div className="w-5 h-5 bg-blue-500 rounded-full" />}
                                            <span className="font-bold text-xs uppercase">{inputToken.symbol}</span>
                                        </div>
                                        <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {showInputDropdown && (
                                        <div className="absolute right-0 mt-2 bg-zinc-900 border border-white/10 rounded-none shadow-2xl z-20 w-[140px] max-h-48 overflow-y-auto">
                                            {tokens.filter(t => t.symbol !== outputToken.symbol).map(token => (
                                                <div key={token.symbol} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-white/5 last:border-0" onClick={() => { setInputToken(token); setShowInputDropdown(false); }}>
                                                    {dropdownLogos[token.symbol] ? (
                                                        <img src={dropdownLogos[token.symbol]} alt="" className="w-5 h-5 rounded-full bg-white object-contain p-0.5" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-zinc-700" />
                                                    )}
                                                    <span className="font-bold text-xs uppercase">{token.symbol}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SWAP ARROW */}
                        <div className="flex justify-center -my-4 relative z-10">
                            <motion.button
                                whileTap={{ scale: 0.9, rotate: 180 }}
                                onClick={switchPairs}
                                className="p-3 bg-zinc-950 border-4 border-black rounded-none text-blue-500 hover:text-white hover:bg-blue-600 transition-all shadow-xl group"
                                title="Switch"
                            >
                                <svg className="w-5 h-5 transition-transform group-active:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* OUTPUT BLOCK */}
                        <div className="bg-zinc-900/40 p-4 md:p-6 rounded-none border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">To</span>
                                <span className="text-[10px] font-mono text-zinc-600">Balance: {formatBalance(outputBalance)}</span>
                            </div>
                            <div className="flex gap-2 md:gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="0.0"
                                    value={outputAmount}
                                    disabled
                                    className="bg-transparent text-2xl md:text-4xl font-black outline-none w-full text-zinc-300"
                                />
                                <div className="relative shrink-0" ref={outputDropdownRef}>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-full flex items-center gap-2 border border-blue-500/20 transition-all min-w-[100px] md:min-w-[120px] justify-between"
                                        type="button"
                                        onClick={() => setShowOutputDropdown(v => !v)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {outputLogo ? <img src={outputLogo} alt="" className="w-5 h-5 rounded-full object-contain bg-white p-0.5" /> : <div className="w-5 h-5 bg-white rounded-full" />}
                                            <span className="font-bold text-xs text-white uppercase">{outputToken.symbol}</span>
                                        </div>
                                        <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {showOutputDropdown && (
                                        <div className="absolute right-0 mt-2 bg-zinc-900 border border-white/10 rounded-none shadow-2xl z-20 w-[140px] max-h-48 overflow-y-auto">
                                            {tokens.filter(t => t.symbol !== inputToken.symbol).map(token => (
                                                <div key={token.symbol} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-white/5 last:border-0" onClick={() => { setOutputToken(token); setShowOutputDropdown(false); }}>
                                                    {dropdownLogos[token.symbol] ? (
                                                        <img src={dropdownLogos[token.symbol]} alt="" className="w-5 h-5 rounded-full bg-white object-contain p-0.5" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-zinc-700" />
                                                    )}
                                                    <span className="font-bold text-xs text-white uppercase">{token.symbol}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-4 md:p-6 mt-2 space-y-3">
                        {inputAmount && outputAmount && (
                            <>
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-zinc-600 uppercase">Rate</span>
                                    <span className="text-zinc-400">1 {inputToken.symbol} = {(parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(6)} {outputToken.symbol}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-zinc-600 uppercase">Slippage</span>
                                    <span className="text-zinc-400">{slippage}%</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-4">
                            <span className="text-zinc-600 uppercase">Price Impact</span>
                            <span className={`${priceImpact && priceImpact > 1 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {priceImpact ? `${priceImpact < 0.01 ? '<' : ''}${priceImpact.toFixed(2)}%` : '-'}
                            </span>
                        </div>

                        {/* Connect or Swap Button */}
                        {!isConnected ? (
                            <div className="w-full">
                                <ConnectButton.Custom>
                                    {({ openConnectModal }) => (
                                        <button
                                            onClick={openConnectModal}
                                            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-none transition-all"
                                        >
                                            Connect Wallet
                                        </button>
                                    )}
                                </ConnectButton.Custom>
                            </div>
                        ) : (
                            <button
                                onClick={buttonState.action}
                                disabled={buttonState.disabled}
                                className={`w-full mt-4 py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-none transition-all flex items-center justify-center gap-3
                                    ${buttonState.disabled
                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                        : needsApproval
                                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                                    }`}
                            >
                                {isLoading && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {buttonState.text}
                            </button>
                        )}
                    </div>
                </div>

                {/* Wallet Info */}
                {isConnected && address && (
                    <div className="mt-4 p-3 bg-zinc-950 border border-white/5 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-600 font-mono uppercase">Connected</span>
                        <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </span>
                    </div>
                )}
            </div>
        </main>
    );
}
